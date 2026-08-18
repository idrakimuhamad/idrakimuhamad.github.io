// Screenshot mid-combat with health bars ON to verify readability (plan §7).
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.glb': 'model/gltf-binary' };
const dist = join(import.meta.dirname, '..', 'dist');
const server = createServer((req, res) => {
  let p = req.url?.split('?')[0] ?? '/';
  if (p === '/') p = '/index.html';
  const file = join(dist, p);
  if (!existsSync(file)) { res.writeHead(404); res.end('nf'); return; }
  res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(4205, r));

const browser = await chromium.launch({ args: ['--use-angle=d3d11'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto('http://localhost:4205/', { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.__game, null, { timeout: 20000 });
await page.evaluate(() => {
  const g = window.__game;
  g.cb.onHudUpdate = () => {};
  if (g.audio) g.audio.play = () => {};
  g.settings.data.particleEffects = true;
  g.settings.data.damageNumbers = true;
  g.settings.data.healthBars = true;
  g.settings.data.screenShake = false;
  g.settings.data.autoStartWaves = false;
  g.settings.data.sound = false;
  g.start('normal');
  g.debugAddMoney(100000);
  for (const [kind, c, r] of [['cannon', 11, 7], ['cannon', 11, 9], ['mg', 13, 8], ['frost', 12, 6], ['sniper', 17, 8]]) {
    g.setPlacing(kind);
    if (!g.placeAt(c, r)) throw new Error('placement failed');
  }
  g.setPlacing(null);
  g.waves.startNextWave(); // wave 1: 8 basics
  for (let i = 0; i < 12; i++) g.debugSpawnEnemy('armored'); // slow, tanky — linger in range
});
// let the game run (rAF-driven) until several enemies are damaged
await page.waitForFunction(() => {
  const g = window.__game;
  return g.enemies.filter((e) => e.hp < e.maxHp).length >= 3;
}, null, { timeout: 60000 });
await page.waitForTimeout(400); // let a few more shots land
await page.evaluate(() => window.__renderer.camera3d.zoom(-1000)); // zoom to min dist
await page.waitForTimeout(200);
await page.screenshot({ path: 'hud-check.png' });
const state = await page.evaluate(() => {
  const g = window.__game;
  return {
    wave: g.waves.currentWave,
    enemies: g.enemies.length,
    damaged: g.enemies.filter((e) => e.hp < e.maxHp).length,
  };
});
console.log('state:', JSON.stringify(state), 'errors:', errors.length);
await browser.close();
server.close();
process.exit(errors.length ? 1 : 0);
