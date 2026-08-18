// Trace MG (tower id 3) fire events + enemy-28 damage events in both games,
// step by step, to find where the fire phase slips.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.glb': 'model/gltf-binary' };
const root3d = join(import.meta.dirname, '..');
const root2d = join(root3d, '..', 'tower-defense');
const dist = join(root3d, 'dist');
const P2D = '/llm-test/qwen/tower-defense';
const server = createServer((req, res) => {
  let p = req.url?.split('?')[0] ?? '/';
  let root = dist;
  if (p.startsWith(P2D)) { p = p.slice(P2D.length) || '/'; root = root2d; }
  if (p === '/') p = '/index.html';
  const file = join(root, p);
  if (!existsSync(file)) { res.writeHead(404); res.end('nf'); return; }
  res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(4204, r));
const LAYOUT = [['cannon', 11, 7], ['cannon', 11, 9], ['mg', 13, 8], ['frost', 12, 6], ['sniper', 17, 8]];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
page.on('pageerror', (e) => console.log('PAGEERROR:', e.message.slice(0, 300)));
await page.goto('http://localhost:4204/', { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.__game, null, { timeout: 20000 });
await page.evaluate(() => {
  const f = document.createElement('iframe');
  f.src = '/llm-test/qwen/tower-defense/';
  f.style.cssText = 'position:fixed;top:0;left:0;width:100px;height:100px;opacity:0.01;';
  document.body.appendChild(f);
});
await page.waitForFunction(() => {
  const f = document.querySelector('iframe');
  return f && f.contentWindow && f.contentWindow.__game;
}, null, { timeout: 20000 });

await page.evaluate((layoutJson) => {
  const layout = JSON.parse(layoutJson);
  const setupGame = (g) => {
    g.cb.onHudUpdate = () => {};
    if (g.audio) g.audio.play = () => {};
    g.settings.data.particleEffects = false;
    g.settings.data.damageNumbers = false;
    g.settings.data.healthBars = false;
    g.settings.data.screenShake = false;
    g.settings.data.autoStartWaves = false;
    g.settings.data.sound = false;
    g.start('normal');
    g.particles.enabled = false;
    g.paused = true;
    g.acc = 0;
    g.debugAddMoney(100000);
    for (const [kind, c, r] of layout) {
      g.setPlacing(kind);
      const ok = g.placeAt(c, r);
      if (!ok) throw new Error('placement failed');
    }
    g.setPlacing(null);
  };
  setupGame(window.__game);
  const g2 = document.querySelector('iframe').contentWindow.__game;
  setupGame(g2);
  window.__diag2 = g2;
  window.__diag3 = window.__game;

  // instrument: log MG (id 3) fire events and enemy 28 hp changes
  for (const [key, g] of [['g2', g2], ['g3', window.__game]]) {
    g.__fires = [];
    g.__e28 = [];
    const origFire = g.fire.bind(g);
    g.fire = (t, target) => {
      if (t.id === 3) g.__fires.push({ step: g.__step, tgt: target.id, cd: t.cooldown, ang: t.angle });
      return origFire(t, target);
    };
    const origStep = g.step.bind(g);
    g.step = (dt) => {
      g.__step = (g.__step ?? 0) + 1;
      const e28 = g.enemies.find((e) => e.id === 28);
      const hpBefore = e28 ? e28.hp : -1;
      const ldBefore = e28 ? e28.lastDamageTime : -1;
      origStep(dt);
      if (e28 && e28.hp !== hpBefore) {
        g.__e28.push({ step: g.__step, hp: e28.hp, ld: e28.lastDamageTime, delta: e28.hp - hpBefore });
      }
    };
  }
}, JSON.stringify(LAYOUT));

const result = await page.evaluate((maxSteps) => {
  const g2 = window.__diag2;
  const g3 = window.__diag3;
  const STEP = 1 / 120;
  let n = 0;
  while (g2.state === 'playing' && g3.state === 'playing' && n < maxSteps) {
    if (Math.abs(g2.stats.data.totalDamageDealt - g3.stats.data.totalDamageDealt) > 1e-6) break;
    g2.step(STEP);
    if (!g2.waves.active && !g2.waves.finalWaveReached) g2.waves.startNextWave();
    g3.step(STEP);
    if (!g3.waves.active && !g3.waves.finalWaveReached) g3.waves.startNextWave();
    n++;
  }
  return {
    at: n,
    fires2: g2.__fires.slice(-15),
    fires3: g3.__fires.slice(-15),
    e28_2: g2.__e28.slice(0, 20),
    e28_3: g3.__e28.slice(0, 20),
    cd2: g2.towers.find((t) => t.id === 3).cooldown,
    cd3: g3.towers.find((t) => t.id === 3).cooldown,
  };
}, 7000);

await browser.close();
server.close();
console.log('divergence at step', result.at);
console.log('MG fires 2D:', JSON.stringify(result.fires2));
console.log('MG fires 3D:', JSON.stringify(result.fires3));
console.log('enemy28 dmg 2D:', JSON.stringify(result.e28_2));
console.log('enemy28 dmg 3D:', JSON.stringify(result.e28_3));
console.log('cd 2D =', result.cd2, ' 3D =', result.cd3);
