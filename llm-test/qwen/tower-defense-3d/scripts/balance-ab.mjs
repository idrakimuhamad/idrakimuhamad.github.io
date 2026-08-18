// Phase 5 balance verification (plan §7): run the 2D ORIGINAL and the 3D
// PORT with identical deterministic scenarios and compare final stats.
//
// Both games expose the same API on window.__game (start, placeAt, step,
// waves.startNextWave, stats.data). We drive each game with the exact same
// manual step() sequence (1/120), so frame timing cannot desynchronize them.
//
// KNOWN FLOAT NOISE (documented, not a bug): the 2D core simulates in px,
// the 3D core in world units (px/40). Positions accumulate different
// per-step rounding, so a range/hit boundary check can flip when an entity
// is within ~1e-13 px of a boundary (observed: one MG shot phased by one
// step in a full game; totalDamageDealt off by ~0.06%). Gameplay-relevant
// stats (kills, leaks, money, score, result) are bit-identical. Gate:
// exact match on everything except totalDamageDealt (0.5% relative tol).

import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.webp': 'image/webp', '.glb': 'model/gltf-binary',
};

function serve(root, port, prefix = '') {
  const server = createServer((req, res) => {
    let p = req.url?.split('?')[0] ?? '/';
    if (prefix && p.startsWith(prefix)) p = p.slice(prefix.length) || '/';
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
  return new Promise((r) => server.listen(port, r));
}

const root3d = join(import.meta.dirname, '..');
const root2d = join(root3d, '..', 'tower-defense');
const dist = join(root3d, 'dist');

if (!existsSync(join(root2d, 'index.html'))) {
  console.error('2D original not found at', root2d);
  process.exit(1);
}
if (!existsSync(join(dist, 'index.html'))) {
  console.error('3D dist not found — run `npm run build` first');
  process.exit(1);
}

// the 2D build targets the GitHub Pages subpath /llm-test/qwen/tower-defense
await serve(root2d, 4203, '/llm-test/qwen/tower-defense');
await serve(dist, 4204);

const SCENARIOS = [
  {
    name: 'A: normal, 5 towers (expect game over)',
    difficulty: 'normal',
    layout: [
      ['cannon', 11, 7], ['cannon', 11, 9], ['mg', 13, 8], ['frost', 12, 6], ['sniper', 17, 8],
    ],
  },
  {
    name: 'B: easy, 8 towers maxed (expect victory)',
    difficulty: 'easy',
    upgradeAll: true,
    layout: [
      ['cannon', 11, 7], ['cannon', 11, 9], ['mg', 13, 8], ['frost', 12, 6],
      ['sniper', 17, 8], ['missile', 14, 9], ['cannon', 16, 6], ['mg', 10, 10],
    ],
  },
];

// Runs inside the page (Playwright serializes the function source).
// Shared verbatim by both games — same API surface on window.__game.
const setup = (cfg) => {
  const g = window.__game;
  g.cb.onHudUpdate = () => {};
  if (g.audio) g.audio.play = () => {};
  g.settings.data.particleEffects = false;
  g.settings.data.damageNumbers = false;
  g.settings.data.healthBars = false;
  g.settings.data.screenShake = false;
  g.settings.data.autoStartWaves = false;
  g.settings.data.sound = false;
  g.start(cfg.difficulty);
  g.particles.enabled = false;
  g.paused = true; // stop rAF stepping — the script steps manually
  g.acc = 0;
  g.debugAddMoney(100000);
  for (const [kind, c, r] of cfg.layout) {
    g.setPlacing(kind);
    const ok = g.placeAt(c, r);
    if (!ok) throw new Error('placement failed: ' + kind + ' at (' + c + ',' + r + ')');
  }
  g.setPlacing(null);
  if (cfg.upgradeAll) {
    for (const t of g.towers) {
      g.selectTower(t);
      while (t.canUpgrade) g.upgradeSelected();
    }
    g.selectTower(null);
  }
};

const stepChunk = (n) => {
  const g = window.__game;
  const STEP = 1 / 120;
  let steps = 0;
  while (g.state === 'playing' && steps < n) {
    g.step(STEP);
    steps++;
    // skip the 18 s countdowns: start the next wave immediately
    if (!g.waves.active && !g.waves.finalWaveReached) g.waves.startNextWave();
  }
  return {
    state: g.state,
    wave: g.waves.currentWave,
    baseHp: g.baseHp,
    money: g.economy.money,
    stats: g.stats.data,
  };
};

const browser = await chromium.launch();
const errors = [];

async function runScenario(scenario) {
  const [r2d, r3d] = await Promise.all(
    ['2D', '3D'].map(async (label) => {
      const url = label === '2D'
        ? 'http://localhost:4203/llm-test/qwen/tower-defense/'
        : 'http://localhost:4204/';
      const page = await browser.newPage({ viewport: { width: 1000, height: 700 } });
      page.on('pageerror', (err) => errors.push(`${scenario.name} ${label} pageerror: ${err.message}`));
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(`${scenario.name} ${label} console: ${msg.text()}`);
      });
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => window.__game, null, { timeout: 20000 });
      await page.evaluate(setup, scenario);
      const t0 = Date.now();
      let st;
      let chunk = 0;
      while (true) {
        st = await page.evaluate(stepChunk, 4800);
        chunk++;
        if (chunk % 10 === 0) console.log(`    [${label}] wave ${st.wave}/20  baseHp=${st.baseHp}  (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
        if (st.state !== 'playing') break;
        if (Date.now() - t0 > 600000) throw new Error(`${label}: timeout at wave ${st.wave}`);
      }
      await page.close();
      return st;
    }),
  );
  return { r2d, r3d };
}

console.log('=== BALANCE A/B: 2D original vs 3D port ===\n');

const FIELDS = [
  'enemiesSpawned', 'enemiesDefeated', 'enemiesLeaked',
  'towersBuilt', 'towersSold', 'moneyEarned', 'moneySpent',
  'totalDamageDealt', 'highestWave', 'score',
];

let allMatch = true;

for (const scenario of SCENARIOS) {
  console.log(`--- ${scenario.name}`);
  const { r2d, r3d } = await runScenario(scenario);
  console.log(`result: 2D=${r2d.state}  3D=${r3d.state}`);
  console.log(`baseHp: 2D=${r2d.baseHp}  3D=${r3d.baseHp}   money: 2D=${r2d.money}  3D=${r3d.money}\n`);

  console.log('stat'.padEnd(20), '2D'.padStart(12), '3D'.padStart(12), '');
  for (const f of FIELDS) {
    const a = r2d.stats[f];
    const b = r3d.stats[f];
    let match;
    if (f === 'totalDamageDealt') {
      // float-boundary noise (see header): 0.5% relative tolerance
      match = Math.abs(a - b) <= 0.005 * Math.max(Math.abs(a), Math.abs(b), 1);
    } else {
      match = a === b;
    }
    if (!match) allMatch = false;
    console.log(f.padEnd(20), String(a).padStart(12), String(b).padStart(12), match ? '' : '  <-- MISMATCH');
  }
  const extraMatch = r2d.state === r3d.state && r2d.baseHp === r3d.baseHp && r2d.money === r3d.money;
  if (!extraMatch) {
    allMatch = false;
    console.log('  <-- result/baseHp/money MISMATCH');
  }
  console.log('');
}

console.log(`page errors: ${errors.length}`);
for (const e of errors.slice(0, 10)) console.log('  ' + e);
if (errors.length > 0) allMatch = false;

console.log(`\nverdict: ${allMatch ? 'PASS — 3D balance matches the 2D original (exact, except float-noise totalDamageDealt)' : 'FAIL'}`);

await browser.close();
process.exit(allMatch ? 0 : 1);
