// Verify drag-pan camera (Part B) + lush forest density (Part A).
// Serves the deployed site (folder root) and checks:
//   1. forest scene graph: merged tree meshes (3) + prop meshes, ~216 tree
//      placements worth of merged vertices (dense 3-ring forest wall)
//   2. left-drag past the 12px tap threshold pans the view (ground under the
//      cursor follows 1:1) and does NOT place a tower
//   3. a quick click still places a tower
//   4. middle-mouse drag pans immediately
//   5. target clamps to the map + forest margin (-3..27 / -3..19)
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
await new Promise((r) => server.listen(4211, r));

const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
const results = [];
const check = (name, ok, extra = '') => results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? `  (${extra})` : ''}`);
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

await page.goto('http://localhost:4211/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
await page.click('#menu-start');
await page.waitForTimeout(2500); // let the GLTF forest merge in

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
  const dx = nx * tanF * cam.aspect, dy = ny * tanF, dz = -1;
  const m = cam.matrixWorld.elements;
  const wx = m[0] * dx + m[4] * dy + m[8] * dz;
  const wy = m[1] * dx + m[5] * dy + m[9] * dz;
  const wz = m[2] * dx + m[6] * dy + m[10] * dz;
  const t = -cam.position.y / wy;
  return { x: cam.position.x + wx * t, z: cam.position.z + wz * t };
}, [clientX, clientY]);

// ---------------------------------------------------------------- forest
{
  const forest = await page.evaluate(() => {
    const scene = window.__renderer.scene;
    const g = scene.getObjectByName('forest');
    if (!g) return null;
    let meshes = 0, verts = 0, tris = 0;
    g.traverse((o) => {
      if (o.isMesh) {
        meshes++;
        const n = o.geometry.attributes.position.count;
        verts += n;
        tris += o.geometry.index ? o.geometry.index.count / 3 : n / 3;
      }
    });
    return { children: g.children.length, meshes, verts, tris };
  });
  check('forest group present with merged static meshes', !!forest && forest.meshes >= 3 && forest.meshes <= 20,
    forest ? `meshes=${forest.meshes} verts=${forest.verts} tris=${Math.round(forest.tris)}` : 'missing');
  // ~216 decimated trees (avg ~340 tris) + ~65 props (avg ~300 tris) ≈ 90k tris
  check('forest vertex budget is reasonable (merged, ~90k tris)', !!forest && forest.tris > 40000 && forest.tris < 160000,
    forest ? `tris=${Math.round(forest.tris)}` : '');
  await page.screenshot({ path: 'verify-pan-0-forest.png' });
}

// ---------------------------------------------------------------- drag-pan
const box = await page.locator('#game').boundingBox();
const cx = box.x + box.width / 2, cy = box.y + box.height / 2;

// quick click still places a tower (tap path intact) — before any panning,
// so the cursor center is the map center (grass cell 12,8)
{
  await page.keyboard.press('q');
  await page.waitForTimeout(150);
  await page.mouse.click(cx, cy);
  await page.waitForTimeout(250);
  const towers = await page.evaluate(() => window.__game.towers.length);
  check('quick click still places a tower', towers === 1, `towers=${towers}`);
  await page.keyboard.press('Escape');
}

// left-drag (well past the 12px tap threshold) pans; ground follows the cursor
{
  const c0 = await cam();
  const g0 = await groundAt(cx - 250, cy + 120); // ground under the OLD cursor pos
  await page.mouse.move(cx - 250, cy + 120);
  await page.mouse.down();
  for (let i = 1; i <= 25; i++) { // 250px right, 120px up, in 10px steps
    await page.mouse.move(cx - 250 + i * 10, cy + 120 - i * 4.8);
    await page.waitForTimeout(16);
  }
  await page.mouse.up();
  await page.waitForTimeout(200);
  const c1 = await cam();
  const g1 = await groundAt(cx, cy); // ground under the NEW cursor pos
  const moved = Math.hypot(c1.x - c0.x, c1.z - c0.z);
  check('left-drag pans the view', moved > 2, `t=(${c0.x.toFixed(2)},${c0.z.toFixed(2)}) -> (${c1.x.toFixed(2)},${c1.z.toFixed(2)})`);
  // drag right+up -> target moves left+down (the ground follows the cursor)
  check('drag direction: ground follows cursor', c1.x < c0.x && c1.z > c0.z, `dx=${(c1.x - c0.x).toFixed(2)} dz=${(c1.z - c0.z).toFixed(2)}`);
  // (the first ~12px of the press are the tap threshold, not panned)
  const drift = Math.hypot(g1.x - g0.x, g1.z - g0.z);
  check('ground under cursor follows 1:1', drift < 0.8, `drift=${drift.toFixed(3)}u`);
  const towers = await page.evaluate(() => window.__game.towers.length);
  check('drag does not place another tower', towers === 1, `towers=${towers}`);
  await page.screenshot({ path: 'verify-pan-1-after-drag.png' });
}

// middle-mouse drag pans immediately (no threshold)
{
  const c0 = await cam();
  await page.mouse.move(cx, cy);
  await page.mouse.down({ button: 'middle' });
  await page.mouse.move(cx + 180, cy - 60, { steps: 8 });
  await page.waitForTimeout(16);
  await page.mouse.up({ button: 'middle' });
  await page.waitForTimeout(200);
  const c1 = await cam();
  const moved = Math.hypot(c1.x - c0.x, c1.z - c0.z);
  check('middle-mouse drag pans', moved > 1, `t=(${c0.x.toFixed(2)},${c0.z.toFixed(2)}) -> (${c1.x.toFixed(2)},${c1.z.toFixed(2)})`);
}

// clamp: drag hard right -> target moves left into the west forest margin
// and stops at -PAN_MARGIN = -3 (beyond the map edge, inside the forest)
{
  const c0 = await cam();
  for (let i = 0; i < 8; i++) {
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + 600, cy, { steps: 6 });
    await page.mouse.up();
    await page.waitForTimeout(80);
  }
  const c1 = await cam();
  check('target clamps at the forest margin (-3)', c1.x >= -3.01 && c1.x <= -2.9, `t.x=${c1.x.toFixed(3)} (started ${c0.x.toFixed(2)})`);
  check('can pan beyond the map edge into the forest (x < 0)', c1.x < 0, `t.x=${c1.x.toFixed(2)}`);
  await page.screenshot({ path: 'verify-pan-2-forest-edge.png' });
}

check('no page/console errors', errors.length === 0, errors.slice(0, 3).join('; '));

await browser.close();
server.close();
console.log('\n=== DRAG-PAN / FOREST VERIFY ===');
for (const r of results) console.log(r);
const failed = results.filter((r) => r.startsWith('FAIL')).length;
process.exit(failed > 0 ? 1 : 0);
