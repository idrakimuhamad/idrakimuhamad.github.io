// verify-elite.mjs — headless check that the elite Sentinel:
//  1. spawns with the right stats (hp 720, speed 30, armor 8, reward 60, dmg 4)
//  2. loads its GLB and takes the SKINNED + AnimationMixer path (robot rig)
//  3. actually animates (bones move between frames)
//  4. walks toward the base (progress increases)
// Serves the deployed site at the folder root, like scripts/smoke.mjs.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const SERVE = existsSync(join(ROOT, 'index.html')) ? ROOT : join(ROOT, 'dist');
const MIME = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.png':'image/png', '.glb':'model/gltf-binary', '.wasm':'application/wasm' };
const server = createServer((req, res) => {
  let p = req.url?.split('?')[0] ?? '/';
  if (p === '/') p = '/index.html';
  const file = join(SERVE, p);
  if (!existsSync(file)) { res.writeHead(404); res.end('nf'); return; }
  res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(4198, r));
console.log(`serving ${SERVE === ROOT ? 'deployed site' : 'dist/'} on 4198`);

const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
const errors = [], warnings = [];
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text());
  if (m.type() === 'warning') warnings.push(m.text());
});
page.on('pageerror', (e) => errors.push(e.message));

const results = [];
const check = (name, ok, extra = '') => results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? `  (${extra})` : ''}`);

try {
  await page.goto('http://localhost:4198/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.click('#menu-start');
  await page.waitForTimeout(2500); // let all models (incl. enemy_elite) finish loading

  // --- spawn an elite via the debug hook --------------------------------
  await page.evaluate(() => window.__game.debugSpawnEnemy('elite'));
  await page.waitForTimeout(1500);

  const stats = await page.evaluate(() => {
    const e = window.__game.enemies.find((x) => x.kind === 'elite' && x.alive);
    if (!e) return null;
    return { baseHp: e.def.baseHp, speed: e.baseSpeed, armor: e.def.armor, reward: e.def.reward, dmg: e.def.damageToBase, progress: e.progress };
  });
  check('elite spawned', !!stats);
  if (stats) {
    // def.baseHp is the unscaled stat (maxHp is baseHp * wave hpMult).
    check('elite baseHp = 720', stats.baseHp === 720, `baseHp=${stats.baseHp}`);
    check('elite speed = 30px/s (0.75 u/s)', Math.abs(stats.speed - 0.75) < 1e-6, `speed=${stats.speed}`);
    check('elite armor = 8 flat', stats.armor === 8, `armor=${stats.armor}`);
    check('elite reward = 60', stats.reward === 60, `reward=${stats.reward}`);
    check('elite damageToBase = 4', stats.dmg === 4, `dmg=${stats.dmg}`);
  }

  // --- skinned path: robot rig present in the scene ----------------------
  const rig = await page.evaluate(() => {
    const scene = window.__renderer.scene;
    let skinned = 0, bones = 0;
    const boneNames = new Set();
    scene.traverse((o) => {
      if (o.isSkinnedMesh) skinned++;
      if (o.isBone) { bones++; boneNames.add(o.name); }
    });
    return { skinned, bones, boneNames: [...boneNames].sort() };
  });
  check('skinned meshes present (animated path in use)', rig.skinned > 0, `skinned=${rig.skinned}`);
  check('robot rig has 14 bones', rig.bones === 14, `bones=${rig.bones}: ${rig.boneNames.join(',')}`);

  // --- animation actually advances ---------------------------------------
  // The enemy walks, so world XZ of every bone drifts. Sample the wheel
  // bone's WORLD QUATERNION (it spins during the walk cycle) and the head
  // bone's world Y (head bob) — both are independent of the enemy's XZ
  // movement. Two samples 700 ms apart must differ.
  const sampleAnim = () => page.evaluate(() => {
    const scene = window.__renderer.scene;
    const bones = [];
    scene.traverse((o) => { if (o.isBone) bones.push(o); });
    const wheel = bones.find((x) => x.name === 'wheel');
    const head = bones.find((x) => x.name === 'head');
    const q = wheel.getWorldQuaternion(wheel.quaternion.clone());
    const y = head.getWorldPosition(head.position.clone()).y;
    return { wq: [q.x, q.y, q.z, q.w].map((n) => +n.toFixed(5)), headY: +y.toFixed(5) };
  });
  const a1 = await sampleAnim();
  await page.waitForTimeout(700);
  const a2 = await sampleAnim();
  const dq = Math.hypot(a1.wq[0] - a2.wq[0], a1.wq[1] - a2.wq[1], a1.wq[2] - a2.wq[2], a1.wq[3] - a2.wq[3]);
  const dy = Math.abs(a1.headY - a2.headY);
  check('robot bones animate over time', dq > 1e-3 || dy > 1e-3, `wheel quat d=${dq.toFixed(4)}, headY d=${dy.toFixed(4)}`);

  // --- the enemy walks toward the base -----------------------------------
  const p1 = await page.evaluate(() => window.__game.enemies.find((x) => x.kind === 'elite' && x.alive)?.progress ?? -1);
  await page.waitForTimeout(1200);
  const p2 = await page.evaluate(() => window.__game.enemies.find((x) => x.kind === 'elite' && x.alive)?.progress ?? -1);
  check('elite walks (progress increases)', p2 > p1 + 0.5, `progress ${p1.toFixed(3)} -> ${p2.toFixed(3)}`);

  // --- close-up screenshot: zoom to the robot, temporarily scale it 3x ---
  const shot = await page.evaluate(() => {
    const e = window.__game.enemies.find((x) => x.kind === 'elite' && x.alive);
    if (!e) return null;
    const cam = window.__renderer.camera3d;
    cam.target.set(e.x, 0, e.z);
    cam.zoomTo(cam.distance, new (cam.target.constructor)(0, 0)); // no-op dist, re-clamp target
    // project the enemy to screen space
    const v3 = cam.camera.position.clone().set(e.x, 0, e.z).project(cam.camera);
    const rect = document.getElementById('game').getBoundingClientRect();
    const sx = (v3.x * 0.5 + 0.5) * rect.width + rect.left;
    const sy = (-v3.y * 0.5 + 0.5) * rect.height + rect.top;
    // temporarily scale the skinned pool root (the group that owns the robot
    // SkinnedMesh) so the 0.65u robot is readable in the screenshot
    let root = null;
    window.__renderer.scene.traverse((o) => {
      if (o.isSkinnedMesh && !root) {
        let n = o;
        while (n.parent && n.parent.type === 'Group' && n.parent.parent?.type === 'Group') n = n.parent;
        root = n;
      }
    });
    window.__rootScale = root ? root.scale.x : 1;
    if (root) root.scale.setScalar(4);
    return { sx, sy, scaled: !!root };
  });
  check('robot pool root found + scaled for shot', !!shot?.scaled, `sx=${shot?.sx?.toFixed(0)} sy=${shot?.sy?.toFixed(0)}`);
  if (shot) {
    const d0 = await page.evaluate(() => window.__renderer.camera3d.distance);
    await page.mouse.move(shot.sx, shot.sy);
    for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, -800); await page.waitForTimeout(120); }
    const d1 = await page.evaluate(() => window.__renderer.camera3d.distance);
    console.log('zoom debug: dist', d0, '->', d1, 'at', shot.sx, shot.sy);
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'verify-elite-robot.png' });
    console.log('screenshot: verify-elite-robot.png');
    // restore the temporary scale
    await page.evaluate(() => {
      let root = null;
      window.__renderer.scene.traverse((o) => {
        if (o.isSkinnedMesh && !root) {
          let n = o;
          while (n.parent && n.parent.type === 'Group' && n.parent.parent?.type === 'Group') n = n.parent;
          root = n;
        }
      });
      if (root) root.scale.setScalar(window.__rootScale ?? 1);
    });
  }

  const loadFail = warnings.filter((w) => /failed to load/i.test(w));
  check('no model load failures', loadFail.length === 0, loadFail.slice(0, 2).join(' | '));
} catch (e) {
  results.push(`FAIL  exception: ${e.message}`);
}

console.log('\n=== ELITE VERIFY ===');
for (const r of results) console.log(r);
console.log(`\nconsole/page errors: ${errors.length}`);
for (const e of errors.slice(0, 10)) console.log('  ' + e);
await browser.close();
server.close();
process.exit(results.some((r) => r.startsWith('FAIL')) || errors.length > 0 ? 1 : 0);
