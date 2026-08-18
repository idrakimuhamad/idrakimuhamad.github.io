// Phase 5 performance scenario (plan §7): full wave-20 swarm (130 enemies)
// at 4x speed on medium quality. Serves dist/, places a standard 8-tower
// layout, spawns the entire wave-20 mix at once (worst case: denser than the
// real wave, which spreads the same 130 spawns over 29 s), then samples FPS.
//
// Usage:
//   node scripts/perf.mjs            # GPU if available
//   node scripts/perf.mjs --swiftshader  # force software rendering (baseline)
//
// Reports WEBGL renderer + min/avg/max FPS + peak entity counts.

import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const SWIFTSHADER = process.argv.includes('--swiftshader');
// Headless Chromium defaults to SwiftShader; --use-angle=d3d11 forces the
// real GPU (NVIDIA/AMD via ANGLE) when one is present.
const GPU_ARGS = ['--use-angle=d3d11', '--disable-gpu-vsync'];
const DIST = join(import.meta.dirname, '..', 'dist');
const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.glb': 'model/gltf-binary',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = createServer((req, res) => {
  let p = req.url?.split('?')[0] ?? '/';
  if (p === '/') p = '/index.html';
  const file = join(DIST, p);
  if (!existsSync(file)) {
    res.writeHead(404);
    res.end('not found');
    return;
  }
  res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(4202, r));

const browser = await chromium.launch({ args: SWIFTSHADER ? ['--enable-unsafe-swiftshader'] : GPU_ARGS });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
const errors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
});
page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));

try {
  await page.goto('http://localhost:4202/', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__game && window.__renderer, null, { timeout: 15000 });
  await page.waitForTimeout(2500); // let GLTF models load

  const glRenderer = await page.evaluate(() => {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
  });

  // --- set up the stress scenario ----------------------------------------
  const setup = await page.evaluate(() => {
    const g = window.__game;
    g.start('normal');
    g.settings.data.quality = 'medium';
    window.__renderer.setQuality('medium');
    g.settings.data.healthBars = true;
    g.settings.data.particleEffects = true;
    g.settings.data.projectileTrails = true;
    g.debugAddMoney(100000);

    // 5-tower layout (all grass cells, path stays open) — weak enough that
    // the 130-enemy swarm survives long enough to test sustained load
    const layout = [
      ['cannon', 11, 7], ['cannon', 11, 9], ['mg', 13, 8], ['frost', 12, 6],
      ['sniper', 17, 8],
    ];
    for (const [kind, c, r] of layout) {
      g.setPlacing(kind);
      const ok = g.placeAt(c, r);
      if (!ok) throw new Error(`placement failed: ${kind} at (${c},${r})`);
    }
    g.setPlacing(null);

    // full wave-20 mix, spawned at once (worst case)
    const mix = [['tank', 14], ['armored', 20], ['regen', 16], ['runner', 30], ['swarm', 50]];
    for (const [kind, n] of mix) for (let i = 0; i < n; i++) g.debugSpawnEnemy(kind);
    g.setSpeed(4);
    return { towers: g.towers.length, enemies: g.enemies.length };
  });

  // --- sample FPS for 12 s ------------------------------------------------
  const samples = [];
  for (let i = 0; i < 24; i++) {
    await page.waitForTimeout(500);
    samples.push(await page.evaluate(() => ({
      fps: window.__fps ?? 0,
      ft: window.__frametime ?? 0,
      enemies: window.__game.enemies.length,
      projectiles: window.__game.projectiles.length,
    })));
    if (i === 10) await page.screenshot({ path: 'perf-swarm.png' });
  }

  console.log('samples (t ms, fps, ft ms, enemies, projectiles):');
  samples.forEach((s, i) => console.log(`  ${String(i * 500).padStart(5)}  ${String(s.fps).padStart(5)}  ${s.ft.toFixed(2)}  ${String(s.enemies).padStart(4)}  ${s.projectiles}`));

  const fps = samples.map((s) => s.fps).filter((f) => f > 0);
  const min = Math.min(...fps);
  const avg = fps.reduce((a, b) => a + b, 0) / fps.length;
  const max = Math.max(...fps);
  const peakEnemies = Math.max(...samples.map((s) => s.enemies));
  const peakProj = Math.max(...samples.map((s) => s.projectiles));

  console.log('=== PERF: wave-20 swarm @ 4x, medium quality ===');
  console.log(`webgl renderer: ${glRenderer}`);
  console.log(`setup: towers=${setup.towers} enemies=${setup.enemies}`);
  console.log(`peak concurrent: enemies=${peakEnemies} projectiles=${peakProj}`);
  // first sample is contaminated by the setup evaluate (130 A* paths) —
  // report steady-state min separately
  const steady = fps.slice(1);
  const minSteady = steady.length ? Math.min(...steady) : min;
  console.log(`fps: min=${min.toFixed(1)} (steady min=${minSteady.toFixed(1)}) avg=${avg.toFixed(1)} max=${max.toFixed(1)}  (target 60)`);
  const isGpu = /NVIDIA|AMD|Direct3D11/i.test(glRenderer);
  console.log(`verdict: ${avg >= 58 && minSteady >= 55 ? 'PASS (avg>=58, steady min>=55)' : 'BELOW TARGET'} on ${isGpu ? 'GPU' : 'software'}`);
  console.log(`console/page errors: ${errors.length}`);
  for (const e of errors.slice(0, 10)) console.log('  ' + e);
} catch (e) {
  console.error('PERF FAILED:', e.message);
  process.exitCode = 1;
}

await browser.close();
server.close();
