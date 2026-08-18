// Verify the cannon barrel now tracks the target: aim at 0/90/180/270 and
// capture top-down (screen-right=+X, screen-down=+Z). The barrel should point
// in the aim direction in each shot.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.glb': 'model/gltf-binary', '.wasm': 'application/wasm' };
const dist = join(import.meta.dirname, '..', 'dist');
const server = createServer((req, res) => {
  let p = req.url?.split('?')[0] ?? '/';
  if (p === '/') p = '/index.html';
  const file = join(dist, p);
  if (!existsSync(file)) { res.writeHead(404); res.end('nf'); return; }
  res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(4224, r));

const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 700, height: 700 } });
await page.goto('http://localhost:4224/', { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.__game, null, { timeout: 20000 });
await page.evaluate(() => {
  const g = window.__game;
  g.cb.onHudUpdate = () => {};
  if (g.audio) g.audio.play = () => {};
  g.start('normal');
  g.debugAddMoney(100000);
  g.paused = true;
  window.__renderer.camera3d.update = () => {};
});

await page.evaluate(() => {
  const g = window.__game;
  g.setPlacing('cannon');
  if (!g.placeAt(12, 8)) throw new Error('place failed');
  g.setPlacing(null);
  g.towers[0].flash = 0;
});
await page.waitForTimeout(400);

// straight top-down
await page.evaluate(() => {
  const cam = window.__renderer.camera3d.camera;
  cam.position.set(12.5, 5, 8.5);
  cam.lookAt(12.5, 0, 8.5);
});
await page.waitForTimeout(150);

for (const deg of [0, 90, 180, 270]) {
  await page.evaluate((a) => { window.__game.towers[0].angle = a; }, (deg * Math.PI) / 180);
  await page.waitForTimeout(150);
  const rect = await page.evaluate(() => {
    const r = document.getElementById('game').getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
  await page.screenshot({
    path: join(import.meta.dirname, '..', `verify-cannon-${deg}.png`),
    clip: { x: rect.x + rect.width / 2 - 150, y: rect.y + rect.height / 2 - 150, width: 300, height: 300 },
  });
  console.log('captured', deg);
}

await browser.close();
server.close();
console.log('done');
