// Verify cursor-anchored zoom (enhancement #1) + mobile layout (#4).
// Serves the deployed site (folder root) and checks:
//   1. default view = whole map (camera dist == fit distance)
//   2. zooming with the cursor at a corner pans the target toward that corner
//   3. zooming out returns to the whole-map view (target clamped to map)
//   4. portrait phone viewport renders a full-height play area
// Run `npm run build` + copy dist/* to the folder root first.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const SERVE = existsSync(join(ROOT, 'index.html')) ? ROOT : join(ROOT, 'dist');
const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.glb': 'model/gltf-binary',
  '.wasm': 'application/wasm',
};
const server = createServer((req, res) => {
  let p = req.url?.split('?')[0] ?? '/';
  if (p === '/') p = '/index.html';
  const file = join(SERVE, p);
  if (!existsSync(file)) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(4210, r));

const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const results = [];
const check = (name, ok, extra = '') => results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? `  (${extra})` : ''}`);

// ---------------------------------------------------------------- desktop
{
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('http://localhost:4210/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.click('#menu-start');
  await page.waitForTimeout(800);

  const cam = () => page.evaluate(() => {
    const c = window.__renderer.camera3d;
    return { x: c.target.x, z: c.target.z, dist: c.distance };
  });

  // Ground-plane point under a client-space screen position (manual ray from
  // the camera through the NDC point — no THREE global needed).
  const groundAt = (clientX, clientY) => page.evaluate(([cx, cy]) => {
    const cam = window.__renderer.camera3d.camera;
    const rect = document.getElementById('game').getBoundingClientRect();
    const nx = ((cx - rect.left) / rect.width) * 2 - 1;
    const ny = -((cy - rect.top) / rect.height) * 2 + 1;
    const tanF = Math.tan((cam.fov / 2) * Math.PI / 180);
    // camera-space direction for the NDC point (z_cam = -1)
    const dx = nx * tanF * cam.aspect, dy = ny * tanF, dz = -1;
    const m = cam.matrixWorld.elements;
    const wx = m[0] * dx + m[4] * dy + m[8] * dz;
    const wy = m[1] * dx + m[5] * dy + m[9] * dz;
    const wz = m[2] * dx + m[6] * dy + m[10] * dz;
    const t = -cam.position.y / wy;
    return { x: cam.position.x + wx * t, z: cam.position.z + wz * t };
  }, [clientX, clientY]);

  const c0 = await cam();
  check('default target = map center', Math.abs(c0.x - 12) < 0.01 && Math.abs(c0.z - 8) < 0.01, `t=(${c0.x.toFixed(2)},${c0.z.toFixed(2)})`);
  await page.screenshot({ path: 'verify-zoom-0-default.png' });

  // zoom IN with the cursor at the TOP-LEFT of the canvas
  const box = await page.locator('#game').boundingBox();
  const tl = { x: box.x + 40, y: box.y + 40 };
  await page.mouse.move(tl.x, tl.y);
  await page.mouse.wheel(0, -1200);
  await page.waitForTimeout(250);
  const c1 = await cam();
  check('zoom-in at top-left pans target toward top-left', c1.x < 10 && c1.z < 6 && c1.dist < c0.dist, `t=(${c1.x.toFixed(2)},${c1.z.toFixed(2)}) dist=${c1.dist.toFixed(1)}`);
  await page.screenshot({ path: 'verify-zoom-1-topleft.png' });

  // zoom back out, then zoom IN with the cursor at the BOTTOM-RIGHT.
  // The anchor (ground point under the cursor) must stay under the cursor.
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  for (let i = 0; i < 10; i++) await page.mouse.wheel(0, 600);
  await page.waitForTimeout(200);
  const br = { x: box.x + box.width - 40, y: box.y + box.height - 40 };
  await page.mouse.move(br.x, br.y);
  await page.waitForTimeout(150);
  const g0 = await groundAt(br.x, br.y);
  const c2pre = await cam();
  await page.mouse.wheel(0, -1200);
  await page.waitForTimeout(250);
  const g1 = await groundAt(br.x, br.y);
  const c2 = await cam();
  const anchorDrift = Math.hypot(g1.x - g0.x, g1.z - g0.z);
  check('zoom-in keeps ground point under cursor', anchorDrift < 0.35, `drift=${anchorDrift.toFixed(3)}u`);
  check('zoom-in at bottom-right pans target toward bottom-right', c2.x > c2pre.x + 1 && c2.z > c2pre.z + 1, `t=(${c2pre.x.toFixed(2)},${c2pre.z.toFixed(2)}) -> (${c2.x.toFixed(2)},${c2.z.toFixed(2)})`);
  await page.screenshot({ path: 'verify-zoom-2-bottomright.png' });

  // zoom all the way OUT: target clamped to map, whole map visible again
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  for (let i = 0; i < 12; i++) await page.mouse.wheel(0, 600);
  await page.waitForTimeout(250);
  const c3 = await cam();
  check('zoom-out clamps target inside map', c3.x >= 0 && c3.x <= 24 && c3.z >= 0 && c3.z <= 16, `t=(${c3.x.toFixed(2)},${c3.z.toFixed(2)})`);
  await page.screenshot({ path: 'verify-zoom-3-zoomout.png' });

  check('no page errors', errors.length === 0, errors.slice(0, 3).join('; '));
  await page.close();
}

// ---------------------------------------------------------------- mobile
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('http://localhost:4210/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'verify-zoom-4-mobile-menu.png' });

  await page.tap('#menu-start');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify-zoom-5-mobile-playing.png' });

  const holder = await page.evaluate(() => {
    const h = document.getElementById('canvas-holder');
    const r = h.getBoundingClientRect();
    return { w: r.width, h: r.height, inViewport: r.bottom <= 844 + 1 && r.top >= 0 };
  });
  check('mobile canvas fills space & fits viewport', holder.h > 300 && holder.inViewport, `${holder.w.toFixed(0)}x${holder.h.toFixed(0)} inViewport=${holder.inViewport}`);

  const cam = await page.evaluate(() => {
    const c = window.__renderer.camera3d;
    return { x: c.target.x, z: c.target.z, dist: c.distance };
  });
  check('mobile camera auto-fits map', cam.dist > 26, `dist=${cam.dist.toFixed(1)}`);

  // tap places a tower (touch input path)
  await page.keyboard.press('q');
  await page.waitForTimeout(200);
  const box = await page.locator('#game').boundingBox();
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(300);
  const towers = await page.evaluate(() => window.__game.towers.length);
  check('touch tap places tower', towers === 1, `towers=${towers}`);
  await page.screenshot({ path: 'verify-zoom-6-mobile-tower.png' });

  // debug panel starts collapsed on small screens
  await page.keyboard.press('d');
  await page.waitForTimeout(300);
  const collapsed = await page.evaluate(() => document.getElementById('debug-panel').classList.contains('collapsed'));
  check('debug panel collapsed on mobile', collapsed);
  await page.screenshot({ path: 'verify-zoom-7-mobile-debug.png' });

  check('mobile: no page errors', errors.length === 0, errors.slice(0, 3).join('; '));
  await page.close();
}

await browser.close();
server.close();
console.log('\n=== ZOOM/MOBILE VERIFY ===');
for (const r of results) console.log(r);
const failed = results.filter((r) => r.startsWith('FAIL')).length;
process.exit(failed > 0 ? 1 : 0);
