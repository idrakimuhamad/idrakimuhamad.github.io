// Verify single-finger touch drag-pan (Part A), interior forest (Part B),
// and buildable-area shrink / overgrowth (Part C).
// Serves the deployed site (folder root) and checks:
//   1. forest scene graph: merged static meshes, interior forest present
//   2. single-finger touch TAP still places a tower
//   3. single-finger touch DRAG past the 12px threshold pans the view and
//      cancels the tap (no tower placed)
//   4. two-finger pinch still zooms
//   5. overgrowth: by wave 10 some cells are overgrown, placement is
//      rejected there with a clear reason, and the mossy overlay mesh is
//      in the scene with the right vertex count
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
await new Promise((r) => server.listen(4212, r));

const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const context = await browser.newContext({ viewport: { width: 1400, height: 900 }, hasTouch: true });
const page = await context.newPage();
const cdp = await context.newCDPSession(page);
const results = [];
const check = (name, ok, extra = '') => results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? `  (${extra})` : ''}`);
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

const touch = (type, touchPoints) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints });

await page.goto('http://localhost:4212/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
await page.click('#menu-start');
await page.waitForTimeout(2500); // let the GLTF forest merge in

const cam = () => page.evaluate(() => {
  const c = window.__renderer.camera3d;
  return { x: c.target.x, z: c.target.z, dist: c.distance };
});

const box = await page.locator('#game').boundingBox();
const cx = box.x + box.width / 2, cy = box.y + box.height / 2;

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
    return { meshes, verts, tris };
  });
  check('forest group present with merged static meshes', !!forest && forest.meshes >= 3 && forest.meshes <= 20,
    forest ? `meshes=${forest.meshes} verts=${forest.verts}` : 'missing');
  // ~220+ trees (rings + interior) + props, all merged — interior forest
  // added trees among the boulders and in the forest pools.
  check('interior forest present (merged, ~90-120k tris)', !!forest && forest.tris > 50000 && forest.tris < 180000,
    forest ? `tris=${Math.round(forest.tris)}` : '');
  await page.screenshot({ path: 'verify-touch-0-forest.png' });
}

// ------------------------------------------- touch tap still places
{
  await page.keyboard.press('q'); // select cannon
  await page.touchscreen.tap(cx, cy);
  await page.waitForTimeout(250);
  const towers = await page.evaluate(() => window.__game.towers.length);
  check('single-finger touch tap places a tower', towers === 1, `towers=${towers}`);
  await page.keyboard.press('Escape');
}

// ------------------------------------------- touch drag pans + cancels tap
{
  const c0 = await cam();
  await page.keyboard.press('q'); // if the tap isn't canceled, a tower appears
  await touch('touchStart', [{ x: cx - 200, y: cy, id: 1 }]);
  for (let i = 1; i <= 20; i++) {
    await touch('touchMove', [{ x: cx - 200 + i * 10, y: cy, id: 1 }]);
    await page.waitForTimeout(16);
  }
  await touch('touchEnd', []);
  await page.waitForTimeout(200);
  const c1 = await cam();
  const moved = Math.hypot(c1.x - c0.x, c1.z - c0.z);
  check('single-finger touch drag pans the view', moved > 1.5,
    `t=(${c0.x.toFixed(2)},${c0.z.toFixed(2)}) -> (${c1.x.toFixed(2)},${c1.z.toFixed(2)})`);
  // drag right -> ground follows cursor -> target moves left
  check('touch drag direction: ground follows finger', c1.x < c0.x, `dx=${(c1.x - c0.x).toFixed(2)}`);
  const towers = await page.evaluate(() => window.__game.towers.length);
  check('touch drag cancels the tap (no new tower)', towers === 1, `towers=${towers}`);
  await page.keyboard.press('Escape');
  await page.screenshot({ path: 'verify-touch-1-after-drag.png' });
}

// ------------------------------------------- two-finger pinch still zooms
{
  const d0 = (await cam()).dist;
  await touch('touchStart', [
    { x: cx - 100, y: cy, id: 1 },
    { x: cx + 100, y: cy, id: 2 },
  ]);
  for (let i = 1; i <= 10; i++) {
    await touch('touchMove', [
      { x: cx - 100 - i * 10, y: cy, id: 1 },
      { x: cx + 100 + i * 10, y: cy, id: 2 },
    ]);
    await page.waitForTimeout(16);
  }
  await touch('touchEnd', []);
  await page.waitForTimeout(200);
  const d1 = (await cam()).dist;
  check('two-finger pinch still zooms', d1 < d0 * 0.85, `dist ${d0.toFixed(1)} -> ${d1.toFixed(1)}`);
}

// ------------------------------------------- overgrowth (buildable-area shrink)
{
  // advance to wave 10 through the public debug API (skip/clear per wave)
  await page.evaluate(() => {
    const g = window.__game;
    for (let i = 0; i < 10; i++) {
      g.debugSkipWave();
      // force the wave to be fully spawned + cleared so it can end
      g.waves.eventIndex = g.waves.events.length;
      g.debugClearEnemies();
      g.checkWaveEnd();
    }
  });
  await page.waitForTimeout(400);
  const info = await page.evaluate(() => {
    const g = window.__game;
    const overgrown = [];
    for (let r = 0; r < 16; r++) {
      for (let c = 0; c < 24; c++) if (g.grid.isOvergrown(c, r)) overgrown.push([c, r]);
    }
    let placeOk = null, placeReason = null;
    if (overgrown.length > 0) {
      const [c, r] = overgrown[0];
      g.setPlacing('cannon');
      const res = g.canPlace('cannon', c, r);
      placeOk = res.ok;
      placeReason = res.reason;
      g.setPlacing(null);
    }
    // the mossy overlay mesh (terrain group, y=0.015)
    let overlayVerts = 0, overlayVisible = false;
    window.__renderer.scene.traverse((o) => {
      if (o.isMesh && o.position.y === 0.015 && o.geometry.attributes.position) {
        overlayVerts = o.geometry.attributes.position.count;
        overlayVisible = o.visible;
      }
    });
    return {
      wave: g.waves.currentWave,
      count: g.grid.overgrownCount,
      sample: overgrown.slice(0, 5),
      placeOk, placeReason,
      overlayVerts, overlayVisible,
      pathOk: g.pathfinder.hasPath(g.grid, 0, 8, 23, 8),
    };
  });
  check('overgrowth active by wave 10 (cells claimed)', info.count > 0,
    `wave=${info.wave} overgrown=${info.count} sample=${JSON.stringify(info.sample)}`);
  check('overlay mesh matches overgrown cell count', info.overlayVisible && info.overlayVerts === info.count * 4,
    `verts=${info.overlayVerts} count=${info.count}`);
  check('placement rejected on overgrown cell', info.placeOk === false && /overgrown/i.test(info.placeReason ?? ''),
    info.placeReason ?? 'no overgrown cell found');
  check('enemy path still walkable after overgrowth', info.pathOk === true);
  await page.screenshot({ path: 'verify-touch-2-overgrown.png' });
}

check('no page/console errors', errors.length === 0, errors.slice(0, 3).join('; '));

await browser.close();
server.close();
console.log('\n=== TOUCH-PAN / INTERIOR-FOREST / OVERGROWTH VERIFY ===');
for (const r of results) console.log(r);
const failed = results.filter((r) => r.startsWith('FAIL')).length;
process.exit(failed > 0 ? 1 : 0);
