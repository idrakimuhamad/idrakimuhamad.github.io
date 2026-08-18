// Diagnostic: find the FIRST step where the 2D and 3D simulations diverge.
// Runs the 2D original in a same-origin iframe next to the 3D game and
// steps both in lockstep, comparing totalDamageDealt (and state dumps on
// divergence) with a float-tolerance so pure rounding noise doesn't trip.

import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.webp': 'image/webp', '.glb': 'model/gltf-binary',
};

const root3d = join(import.meta.dirname, '..');
const root2d = join(root3d, '..', 'tower-defense');
const dist = join(root3d, 'dist');
const P2D = '/llm-test/qwen/tower-defense';

const server = createServer((req, res) => {
  let p = req.url?.split('?')[0] ?? '/';
  let root = dist;
  if (p.startsWith(P2D)) {
    p = p.slice(P2D.length) || '/';
    root = root2d;
  }
  if (p === '/') p = '/index.html';
  const file = join(root, p);
  if (!existsSync(file)) {
    res.writeHead(404);
    res.end('not found');
    return;
  }
  res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(4204, r));

const LAYOUT = [
  ['cannon', 11, 7], ['cannon', 11, 9], ['mg', 13, 8], ['frost', 12, 6], ['sniper', 17, 8],
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
page.on('pageerror', (e) => console.log('PAGEERROR:', e.message.slice(0, 300)));
await page.goto('http://localhost:4204/', { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.__game, null, { timeout: 20000 });

// 2D original in a same-origin iframe
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
      if (!ok) throw new Error('placement failed: ' + kind + ' at (' + c + ',' + r + ')');
    }
    g.setPlacing(null);
  };
  setupGame(window.__game);
  const g2 = document.querySelector('iframe').contentWindow.__game;
  setupGame(g2);
  window.__diag2 = g2;
  window.__diag3 = window.__game;
}, JSON.stringify(LAYOUT));

const result = await page.evaluate(
  (maxSteps) => {
    const g2 = window.__diag2;
    const g3 = window.__diag3;
    const STEP = 1 / 120;
    const TOL = 1e-6;

    const dump = (g, is2d) => ({
      enemies: g.enemies.filter((e) => e.alive).map((e) => ({
        id: e.id, k: e.kind, hp: e.hp, x: e.x, y: is2d ? e.y : e.z,
        pi: e.pathIndex, pr: e.progress, sf: e.slowFactor, st: e.slowTimer,
        age: e.age, ld: e.lastDamageTime,
      })),
      projectiles: g.projectiles.filter((p) => p.alive).map((p) => ({
        id: p.id, x: p.x, y: is2d ? p.y : p.z, vx: p.vx, vy: is2d ? p.vy : p.vz,
        t: p.target ? p.target.id : -1, age: p.age,
      })),
      towers: g.towers.map((t) => ({
        id: t.id, cd: t.cooldown, a: t.angle, ct: t.currentTarget ? t.currentTarget.id : -1,
      })),
      wave: g.waves.currentWave,
      baseHp: g.baseHp,
      money: g.economy.money,
    });

    let n = 0;
    while (g2.state === 'playing' && g3.state === 'playing' && n < maxSteps) {
      const d2 = g2.stats.data.totalDamageDealt;
      const d3 = g3.stats.data.totalDamageDealt;
      if (Math.abs(d2 - d3) > TOL) {
        return { at: n, d2, d3, s2: dump(g2, true), s3: dump(g3, false) };
      }
      g2.step(STEP);
      if (!g2.waves.active && !g2.waves.finalWaveReached) g2.waves.startNextWave();
      g3.step(STEP);
      if (!g3.waves.active && !g3.waves.finalWaveReached) g3.waves.startNextWave();
      n++;
    }
    return {
      at: -1,
      d2: g2.stats.data.totalDamageDealt,
      d3: g3.stats.data.totalDamageDealt,
      st2: g2.state,
      st3: g3.state,
    };
  },
  200000,
);

await browser.close();
server.close();

if (result.at === -1) {
  console.log('no divergence above tolerance');
  console.log('final:', JSON.stringify(result, null, 2));
  process.exit(0);
}

console.log(`DIVERGENCE at step ${result.at} (t=${(result.at / 120).toFixed(3)}s game time)`);
console.log(`dmg 2D=${result.d2}  3D=${result.d3}  delta=${result.d2 - result.d3}`);

const { s2, s3 } = result;
const close = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;

// diff towers
for (let i = 0; i < Math.max(s2.towers.length, s3.towers.length); i++) {
  const a = s2.towers[i], b = s3.towers[i];
  if (!a || !b || a.id !== b.id || !close(a.cd, b.cd, 1e-9) || !close(a.a, b.a, 1e-9) || a.ct !== b.ct) {
    console.log(`TOWER diff @${i}: 2D=${JSON.stringify(a)} 3D=${JSON.stringify(b)}`);
  }
}
// diff enemies by id
const e2 = new Map(s2.enemies.map((e) => [e.id, e]));
const e3 = new Map(s3.enemies.map((e) => [e.id, e]));
for (const [id, a] of e2) {
  const b = e3.get(id);
  if (!b) { console.log(`ENEMY ${id} missing in 3D: ${JSON.stringify(a)}`); continue; }
  const diffs = [];
  for (const f of ['hp', 'x', 'y', 'pr', 'sf', 'st', 'age', 'ld']) {
    if (!close(a[f], b[f], 1e-9)) diffs.push(`${f}: 2D=${a[f]} 3D=${b[f]}`);
  }
  if (a.pi !== b.pi) diffs.push(`pi: 2D=${a.pi} 3D=${b.pi}`);
  if (diffs.length) console.log(`ENEMY ${id} (${a.k}) ${diffs.join(' | ')}`);
}
for (const [id, b] of e3) if (!e2.has(id)) console.log(`ENEMY ${id} missing in 2D: ${JSON.stringify(b)}`);
// diff projectiles by id
const p2 = new Map(s2.projectiles.map((p) => [p.id, p]));
const p3 = new Map(s3.projectiles.map((p) => [p.id, p]));
for (const [id, a] of p2) {
  const b = p3.get(id);
  if (!b) { console.log(`PROJ ${id} missing in 3D: ${JSON.stringify(a)}`); continue; }
  const diffs = [];
  for (const f of ['x', 'y', 'vx', 'vy', 'age']) {
    if (!close(a[f], b[f], 1e-9)) diffs.push(`${f}: 2D=${a[f]} 3D=${b[f]}`);
  }
  if (a.t !== b.t) diffs.push(`target: 2D=${a.t} 3D=${b.t}`);
  if (diffs.length) console.log(`PROJ ${id} ${diffs.join(' | ')}`);
}
for (const [id, b] of p3) if (!p2.has(id)) console.log(`PROJ ${id} missing in 2D: ${JSON.stringify(b)}`);
console.log(`\nwave 2D=${s2.wave} 3D=${s3.wave}  baseHp 2D=${s2.baseHp} 3D=${s3.baseHp}  money 2D=${s2.money} 3D=${s3.money}`);
