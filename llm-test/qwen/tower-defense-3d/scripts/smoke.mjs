// Headless smoke test: serves dist/, drives the game with Playwright,
// captures console errors and screenshots at each stage.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const DIST = join(import.meta.dirname, '..', 'dist');
const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
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
await new Promise((r) => server.listen(4199, r));
console.log('serving dist on 4199');

const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

const errors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
});
page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));

const results = [];
const check = (name, ok, extra = '') => {
  results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? `  (${extra})` : ''}`);
};

try {
  await page.goto('http://localhost:4199/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // --- menu ---
  const menuVisible = await page.locator('#menu-main').isVisible();
  check('main menu visible', menuVisible);
  await page.screenshot({ path: 'smoke-1-menu.png' });

  // --- start game ---
  await page.click('#menu-start');
  await page.waitForTimeout(800);
  const state1 = await page.evaluate(() => window.__game.state);
  check('state playing after start', state1 === 'playing', `state=${state1}`);
  const hudVisible = await page.locator('#hud-top').isVisible();
  check('HUD visible', hudVisible);
  await page.screenshot({ path: 'smoke-2-playing.png' });

  // --- place a cannon at map center via canvas click ---
  const canvas = page.locator('#game');
  const box = await canvas.boundingBox();
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  await page.keyboard.press('q');
  await page.waitForTimeout(200);
  const placing = await page.evaluate(() => window.__game.placing);
  check('hotkey q selects cannon', placing === 'cannon', `placing=${placing}`);
  await page.mouse.move(cx, cy);
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'smoke-3-ghost.png' });
  await page.mouse.click(cx, cy);
  await page.waitForTimeout(300);
  const towers = await page.evaluate(() => window.__game.towers.length);
  check('tower placed', towers === 1, `towers=${towers}`);
  const money = await page.evaluate(() => window.__game.economy.money);
  check('money spent', money < 200, `money=${money}`);
  // placing mode persists after placement (2D-faithful); exit it before selecting
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);

  // --- select the tower, open panel ---
  await page.mouse.click(cx, cy);
  await page.waitForTimeout(300);
  const panelVisible = await page.locator('#tower-panel').isVisible();
  check('tower panel opens on click', panelVisible);
  await page.screenshot({ path: 'smoke-4-panel.png' });
  await page.keyboard.press('Escape');

  // --- start wave, let enemies flow ---
  await page.click('#btn-startwave');
  await page.waitForTimeout(500);
  const waveActive = await page.evaluate(() => window.__game.waves.active);
  check('wave active', waveActive);
  await page.waitForTimeout(4000);
  const enemies = await page.evaluate(() => window.__game.enemies.filter((e) => e.alive).length);
  check('enemies spawned', enemies > 0, `enemies=${enemies}`);
  await page.screenshot({ path: 'smoke-5-wave.png' });

  // --- speed 4: enemies walk into range, cannon fires ---
  await page.keyboard.press('3');
  await page.waitForTimeout(1500); // ~6s game time: first enemy enters range
  // shells are in flight ~30% of the time; sample a window and take the max
  let maxProj = 0;
  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(120);
    const p = await page.evaluate(() => window.__game.projectiles.filter((pr) => pr.alive).length);
    if (p > maxProj) maxProj = p;
  }
  check('projectiles fired', maxProj > 0, `max concurrent=${maxProj}`);
  await page.waitForTimeout(4500);
  const kills = await page.evaluate(() => window.__game.stats.data.enemiesDefeated);
  const leaked = await page.evaluate(() => window.__game.stats.data.enemiesLeaked);
  check('kills happened', kills > 0, `kills=${kills} leaked=${leaked}`);
  await page.screenshot({ path: 'smoke-6-kills.png' });

  // --- debug overlay ---
  await page.keyboard.press('d');
  await page.waitForTimeout(500);
  const debugOn = await page.evaluate(() => window.__game.settings.data.debug);
  check('debug toggled', debugOn);
  await page.screenshot({ path: 'smoke-7-debug.png' });
  await page.keyboard.press('d');

  // --- pause ---
  await page.keyboard.press(' ');
  await page.waitForTimeout(300);
  const paused = await page.evaluate(() => window.__game.paused);
  check('space pauses', paused);
  const pauseMenu = await page.locator('#menu-pause').isVisible();
  check('pause menu visible', pauseMenu);
  await page.screenshot({ path: 'smoke-8-pause.png' });
  await page.click('#pause-resume');

  // --- zoom ---
  await page.mouse.move(cx, cy);
  await page.mouse.wheel(0, -600);
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'smoke-9-zoom.png' });

  // --- settings modal: quality switch ---
  await page.click('#btn-settings');
  await page.waitForTimeout(300);
  const modalVisible = await page.locator('#modal-settings').isVisible();
  check('settings modal opens', modalVisible);
  await page.click('.settings-quality-btn[data-quality="low"]');
  await page.waitForTimeout(300);
  const quality = await page.evaluate(() => window.__game.settings.data.quality);
  check('quality set to low', quality === 'low', `quality=${quality}`);
  await page.screenshot({ path: 'smoke-10-settings.png' });
  await page.click('#settings-close');

  // --- fps counter populated ---
  const fps = await page.evaluate(() => window.__fps);
  check('fps counter running', (fps ?? 0) > 0, `fps=${fps}`);

  // --- upgrade flow: give money, select tower, upgrade ---
  await page.evaluate(() => window.__game.debugAddMoney(500));
  await page.waitForTimeout(200);
  await page.evaluate(() => {
    const g = window.__game;
    g.selectTower(g.towers[0]);
  });
  await page.waitForTimeout(200);
  const levelBefore = await page.evaluate(() => window.__game.towers[0].level);
  await page.click('#tp-upgrade');
  await page.waitForTimeout(300);
  const levelAfter = await page.evaluate(() => window.__game.towers[0].level);
  check('tower upgraded', levelAfter === levelBefore + 1, `level ${levelBefore} -> ${levelAfter}`);
  await page.keyboard.press('Escape');

  // --- game over: damage base to 0, end screen shows, restart resets ---
  await page.evaluate(() => window.__game.debugDamageBase(9999));
  await page.waitForTimeout(500);
  const stateEnd = await page.evaluate(() => window.__game.state);
  check('game over state', stateEnd === 'gameover', `state=${stateEnd}`);
  const endVisible = await page.locator('#menu-end').isVisible();
  check('end screen visible', endVisible);
  const endTitle = await page.locator('#end-title').textContent();
  check('end title is game over', (endTitle ?? '').includes('Game Over'), `title=${endTitle}`);
  await page.screenshot({ path: 'smoke-11-gameover.png' });

  await page.click('#end-restart');
  await page.waitForTimeout(500);
  const stateRestart = await page.evaluate(() => window.__game.state);
  const towersRestart = await page.evaluate(() => window.__game.towers.length);
  const hpRestart = await page.evaluate(() => window.__game.baseHp);
  check('restart resets game', stateRestart === 'playing' && towersRestart === 0 && hpRestart === 20, `state=${stateRestart} towers=${towersRestart} hp=${hpRestart}`);
  await page.screenshot({ path: 'smoke-12-restart.png' });

  // --- still running after 10s of playtime (plan requirement) ---
  await page.evaluate(() => window.__game.startWaveEarly());
  await page.waitForTimeout(10000);
  const stateFinal = await page.evaluate(() => window.__game.state);
  const running = stateFinal === 'playing' || stateFinal === 'paused' || stateFinal === 'victory' || stateFinal === 'gameover';
  check('still running after 10s', running, `state=${stateFinal}`);
} catch (e) {
  results.push(`FAIL  exception: ${e.message}`);
}

console.log('\n=== SMOKE RESULTS ===');
for (const r of results) console.log(r);
console.log(`\nconsole/page errors: ${errors.length}`);
for (const e of errors.slice(0, 20)) console.log('  ' + e);

await browser.close();
server.close();
const failed = results.filter((r) => r.startsWith('FAIL')).length;
process.exit(failed > 0 || errors.length > 0 ? 1 : 0);
