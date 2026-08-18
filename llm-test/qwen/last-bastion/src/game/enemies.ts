import { GameState } from './state';
import { ENEMIES, TOWERS, towerStats, ULTIMATE } from '../core/defs';
import { lanePoint, laneNormal } from '../core/arena';
import { hexToRgb } from './effects';
import { tickStatuses, vulnMult } from './status';
import type { Enemy, Vec3 } from '../core/types';

const tmpP: Vec3 = { x: 0, y: 0, z: 0 };
const tmpN: Vec3 = { x: 0, y: 0, z: 0 };

export function updateEnemies(g: GameState, dt: number): void {
  const player = g.player;
  for (let i = g.enemies.length - 1; i >= 0; i--) {
    const e = g.enemies[i];
    const def = ENEMIES[e.kind];

    // timers
    if (e.flash > 0) e.flash -= dt;
    if (e.slowT > 0) { e.slowT -= dt; if (e.slowT <= 0) e.slow = 0; }
    if (e.freezeT > 0) { e.freezeT -= dt; }
    if (e.buffT > 0) e.buffT -= dt;
    if (e.shieldT > 0) e.shieldT -= dt;

    // elemental status tick (burn DoT + chill slow + vulnerability)
    if (tickStatuses(g, e, dt)) continue; // died to burn

    // disruptive behaviour timers
    if (e.phaseT > 0) { e.phaseT -= dt; if (e.phaseT <= 0) e.untargetable = false; }
    if (e.slamTelegraph > 0) e.slamTelegraph -= dt;

    // knockback decay
    if (e.kbX || e.kbZ) {
      e.pos.x += (e.kbX ?? 0) * dt;
      e.pos.z += (e.kbZ ?? 0) * dt;
      const decay = Math.max(0, 1 - 6 * dt);
      e.kbX = (e.kbX ?? 0) * decay;
      e.kbZ = (e.kbZ ?? 0) * decay;
    }

    if (e.state === 'spawn') {
      e.spawnT -= dt;
      if (e.spawnT <= 0) e.state = 'walk';
      continue;
    }
    if (e.freezeT > 0) continue; // frozen: no action

    const speedMul = (1 - e.slow) * (e.buffT > 0 ? 1.35 : 1) * (e.enraged ? 1.4 : 1);
    const speed = e.speed * speedMul;

    // ---- targeting ----
    if (e.kind !== 'boss') {
      updateTargeting(g, e, !!def.raidTowers, !!def.aggroPlayer);
    }

    // ---- shaman healing + hex ----
    if (def.heal && e.state === 'walk') {
      e.healTick -= dt;
      if (e.healTick <= 0) {
        e.healTick = 0.5;
        for (const o of g.enemies) {
          if (o === e || o.dead || o.hp >= o.maxHp) continue;
          const dx = o.pos.x - e.pos.x, dz = o.pos.z - e.pos.z;
          if (dx * dx + dz * dz < (def.healRadius ?? 7) * (def.healRadius ?? 7)) {
            o.hp = Math.min(o.maxHp, o.hp + def.heal * 0.5);
          }
        }
        g.pushFx({ type: 'sound', sound: 'heal' });
      }
    }
    if (def.hex) updateHex(g, e, dt);

    // ---- disruptive behaviours ----
    if (def.phase) updateWispPhase(g, e, dt);
    if (def.charge) updateBruteCharge(g, e, dt, speed);
    if (def.slam) updateColossusSlam(g, e, dt);

    // ---- boss mechanics ----
    if (e.kind === 'boss') updateBoss(g, e, dt);

    // ---- movement / attack ----
    const targetPos = getTargetPos(g, e);
    if (targetPos) {
      const dx = targetPos.x - e.pos.x;
      const dz = targetPos.z - e.pos.z;
      const d = Math.hypot(dx, dz);
      if (d <= def.attackRange) {
        e.state = 'attack';
        e.attackCd -= dt;
        if (e.attackCd <= 0) {
          e.attackCd = def.attackInterval * (e.enraged ? 0.6 : 1);
          attackTarget(g, e, targetPos);
        }
      } else {
        e.state = 'walk';
        // walk along lane toward core
        e.dist += speed * dt;
        // lateral drift
        const lane = g.arena.lanes[e.lane];
        const remain = lane.length - e.dist;
        if (remain > 2) {
          e.lateral += (e.lateralTarget - e.lateral) * Math.min(1, 2.5 * dt);
          if (Math.abs(e.lateralTarget - e.lateral) < 0.2 && Math.random() < 0.4 * dt) {
            e.lateralTarget = (Math.random() - 0.5) * 4.5;
          }
        } else {
          e.lateral *= Math.max(0, 1 - 3 * dt);
        }
        // place on path (dist measured from portal toward core)
        const p = lanePoint(lane, e.dist, tmpP);
        const n = laneNormal(lane, e.dist, tmpN);
        e.pos.x = p.x + n.x * e.lateral;
        e.pos.z = p.z + n.z * e.lateral;
        // face travel direction (points arrays run portal -> core)
        if (Math.abs(e.kbX ?? 0) < 0.5) {
          const hx = (tmpP as Vec3 & { hx?: number; hz?: number }).hx ?? 0;
          const hz = (tmpP as Vec3 & { hx?: number; hz?: number }).hz ?? 0;
          e.facing = Math.atan2(hx, hz);
        }
        // contact damage to player
        if (def.contact && !player.dead) {
          const pdx = player.pos.x - e.pos.x, pdz = player.pos.z - e.pos.z;
          if (pdx * pdx + pdz * pdz < (e.radius + 0.6) * (e.radius + 0.6)) {
            hurtPlayer(g, def.contact, e.pos);
          }
        }
      }
    } else {
      // no target: walk to core
      e.dist += speed * dt;
      const lane = g.arena.lanes[e.lane];
      const p = lanePoint(lane, e.dist, tmpP);
      const n = laneNormal(lane, e.dist, tmpN);
      e.pos.x = p.x + n.x * e.lateral;
      e.pos.z = p.z + n.z * e.lateral;
      if (e.dist >= lane.length - def.attackRange) {
        // reached the bastion
        e.state = 'attack';
        e.attackCd -= dt;
        if (e.attackCd <= 0) {
          e.attackCd = def.attackInterval * (e.enraged ? 0.6 : 1);
          damageBastion(g, e, def.damage);
          g.pushFx({ type: 'sound', sound: 'bastion_hit' });
        }
      }
    }
  }
}

function updateTargeting(g: GameState, e: Enemy, raidTowers: boolean, aggroPlayer: boolean): void {
  // keep current target if still valid
  if (e.target === 'tower') {
    const t = g.towers.find((x) => x.id === e.targetId);
    if (t && !t.dead) {
      const dx = t.pos.x - e.pos.x, dz = t.pos.z - e.pos.z;
      if (dx * dx + dz * dz < 12 * 12) return;
    }
    e.target = null;
  }
  if (e.target === 'player') {
    if (g.player.dead) { e.target = null; return; }
    const dx = g.player.pos.x - e.pos.x, dz = g.player.pos.z - e.pos.z;
    if (dx * dx + dz * dz < 14 * 14) return;
    e.target = null;
  }
  // acquire new target
  if (aggroPlayer && !g.player.dead) {
    const dx = g.player.pos.x - e.pos.x, dz = g.player.pos.z - e.pos.z;
    if (dx * dx + dz * dz < 6 * 6) { e.target = 'player'; return; }
  }
  if (raidTowers) {
    let best: { id: number; d: number } | null = null;
    for (const t of g.towers) {
      if (t.dead) continue;
      const dx = t.pos.x - e.pos.x, dz = t.pos.z - e.pos.z;
      const d = dx * dx + dz * dz;
      if (d < 8 * 8 && (!best || d < best.d)) best = { id: t.id, d };
    }
    if (best) { e.target = 'tower'; e.targetId = best.id; return; }
  }
  e.target = null;
}

function getTargetPos(g: GameState, e: Enemy): Vec3 | null {
  if (e.target === 'player' && !g.player.dead) return g.player.pos;
  if (e.target === 'tower') {
    const t = g.towers.find((x) => x.id === e.targetId);
    if (t && !t.dead) return t.pos;
  }
  return null;
}

function attackTarget(g: GameState, e: Enemy, pos: Vec3): void {
  const def = ENEMIES[e.kind];
  if (e.target === 'player') {
    hurtPlayer(g, def.damage, pos);
  } else if (e.target === 'tower') {
    const t = g.towers.find((x) => x.id === e.targetId);
    if (t && !t.dead) {
      t.hp -= def.damage;
      t.flash = 0.15;
      g.pushFx({ type: 'sound', sound: 'tower_hit' });
      if (t.hp <= 0) {
        g.pushFx({ type: 'announce', msg: 'TOWER DESTROYED', sub: TOWERS[t.kind].name, color: '#ff7d6b' });
        g.pushFx({ type: 'sound', sound: 'tower_destroy' });
        g.removeTower(t);
        g.pushFx({ type: 'shake', amount: 4 });
      }
    }
  }
}

function damageBastion(g: GameState, e: Enemy, dmg: number): void {
  g.bastionHp -= dmg;
  g.bastionFlash = 0.2;
  g.pushFx({ type: 'shake', amount: 3 });
  g.addUltimateCharge(ULTIMATE.gainBastion);
  if (g.bastionHp <= 0) {
    g.bastionHp = 0;
    g.phase = 'gameover';
    g.pushFx({ type: 'sound', sound: 'defeat' });
    g.pushFx({ type: 'shake', amount: 14 });
  }
}

export function hurtPlayer(g: GameState, dmg: number, from: Vec3): void {
  const p = g.player;
  if (p.dead || p.invulnT > 0) return;
  p.hp -= dmg;
  p.hurtT = 0.3;
  p.invulnT = 0.5;
  g.pushFx({ type: 'sound', sound: 'player_hit' });
  g.pushFx({ type: 'shake', amount: 5 });
  // knock player away
  const dx = p.pos.x - from.x, dz = p.pos.z - from.z;
  const d = Math.hypot(dx, dz) || 1;
  p.pos.x += (dx / d) * 0.6;
  p.pos.z += (dz / d) * 0.6;
  if (p.hp <= 0) {
    p.hp = 0;
    p.dead = true;
    g.phase = 'gameover';
    g.pushFx({ type: 'sound', sound: 'defeat' });
    g.pushFx({ type: 'announce', msg: 'THE GUARDIAN HAS FALLEN', sub: 'The Bastion is lost' });
  }
}

// Apply damage to an enemy. Returns true if it died.
// `fromDir` is the normalized direction the attack came from (for bulwark facing shield).
export function damageEnemy(g: GameState, e: Enemy, dmg: number, opts: { kb?: Vec3; kbStrength?: number; source?: number; fromDir?: Vec3 } = {}): boolean {
  if (e.dead || e.state === 'spawn') return false;
  if (e.kind === 'boss' && e.shieldT > 0) {
    g.pushFx({ type: 'text', msg: 'SHIELDED', pos: { x: e.pos.x, y: 2.4, z: e.pos.z }, color: '#8fe8ff' });
    return false;
  }
  const def = ENEMIES[e.kind];
  let final = dmg;
  // vulnerability from shock / mark / Fracture
  final *= vulnMult(g, e);
  // bulwark facing shield: reduced damage from the front
  if (def.shieldFacing && opts.fromDir) {
    const fx = Math.sin(e.facing ?? 0), fz = Math.cos(e.facing ?? 0);
    const dot = fx * opts.fromDir.x + fz * opts.fromDir.z;
    if (dot > 0.5) final *= 0.4;
  }
  if (def.armor) final = Math.max(1, final - def.armor);
  e.hp -= final;
  e.flash = 0.12;
  g.stats.damageDealt += final;
  if (opts.kb && opts.kbStrength) {
    e.kbX = (e.kbX ?? 0) + opts.kb.x * opts.kbStrength;
    e.kbZ = (e.kbZ ?? 0) + opts.kb.z * opts.kbStrength;
  }
  if (e.hp <= 0) {
    killEnemyWithRewards(g, e);
    return true;
  }
  return false;
}

function killEnemyWithRewards(g: GameState, e: Enemy): void {
  const def = ENEMIES[e.kind];
  const reward = Math.round(def.essence * g.mods.essenceMult * (e.elite ? 2 : 1));
  g.addEssence(reward);
  g.addUltimateCharge(ULTIMATE.gainKill * (e.elite ? 2 : 1));
  const c = hexToRgb(def.color);
  g.pushFx({ type: 'sound', sound: e.kind === 'boss' ? 'boss_die' : 'enemy_die' });
  g.pushFx({ type: 'shake', amount: e.kind === 'brute' || e.kind === 'colossus' || e.kind === 'boss' ? 4 : 1 });
  g.pushFx({ type: 'text', msg: '+' + reward, pos: { x: e.pos.x, y: 1.2, z: e.pos.z }, color: '#7dffb0' });
  g.pushFx({ type: 'burst', pos: { x: e.pos.x, y: 0.6, z: e.pos.z }, color: '#' + def.color.toString(16).padStart(6, '0'), value: e.kind === 'boss' ? 80 : e.kind === 'brute' || e.kind === 'colossus' ? 30 : 14, size: e.radius * 0.5, speed: 4 + e.radius * 3 });
  g.pushFx({ type: 'burst', pos: { x: e.pos.x, y: 0.4, z: e.pos.z }, color: '#7dffb0', value: 6, size: 0.1, speed: 2 });
  if (e.kind === 'boss') {
    g.pushFx({ type: 'cinematic', slowMo: 0.25, slowMoT: 1.6, flash: 0.9, flashColor: '#ffffff', zoom: 1.5, zoomT: 1.6, shake: 16 });
    g.pushFx({ type: 'announce', msg: 'THE BEHEMOTH IS SLAIN', sub: 'The rift collapses', color: '#ffd84f' });
  }
  g.killEnemy(e);
}

// ---------------- Disruptive behaviours ----------------

// Wisp: periodically becomes untargetable (phases out).
function updateWispPhase(g: GameState, e: Enemy, dt: number): void {
  e.phaseCd -= dt;
  if (e.phaseCd <= 0 && !e.untargetable) {
    e.untargetable = true;
    e.phaseT = 0.9;
    e.phaseCd = 3.5 + Math.random() * 2.5;
    g.particles.burst(e.pos.x, 0.6, e.pos.z, [0.33, 0.91, 1], 6, 1.5, 1, 0.4, 0.1);
  }
}

// Brute: telegraphed charge — winds up, then dashes a straight line dealing damage.
function updateBruteCharge(g: GameState, e: Enemy, dt: number, speed: number): void {
  if (e.chargeState === 'idle') {
    e.chargeCd -= dt;
    if (e.chargeCd <= 0 && e.dist > 10 && e.dist < 40) {
      e.chargeState = 'windup';
      e.chargeT = 0.7;
      // aim at player if close, else straight ahead
      const p = g.player;
      let dx = 0, dz = 0;
      if (!p.dead) { dx = p.pos.x - e.pos.x; dz = p.pos.z - e.pos.z; }
      const d = Math.hypot(dx, dz);
      if (d > 0.1) { e.chargeDir = { x: dx / d, y: 0, z: dz / d }; }
      else { e.chargeDir = { x: Math.sin(e.facing ?? 0), y: 0, z: Math.cos(e.facing ?? 0) }; }
    }
  } else if (e.chargeState === 'windup') {
    e.chargeT -= dt;
    if (e.chargeT <= 0) {
      e.chargeState = 'charge';
      e.chargeT = 0.55;
      g.pushFx({ type: 'sound', sound: 'swing' });
    }
  } else if (e.chargeState === 'charge') {
    e.chargeT -= dt;
    const chargeSpeed = 16;
    e.pos.x += e.chargeDir.x * chargeSpeed * dt;
    e.pos.z += e.chargeDir.z * chargeSpeed * dt;
    // damage player + towers in the path
    const p = g.player;
    if (!p.dead) {
      const dx = p.pos.x - e.pos.x, dz = p.pos.z - e.pos.z;
      if (dx * dx + dz * dz < (e.radius + 0.8) * (e.radius + 0.8)) hurtPlayer(g, 22, e.pos);
    }
    for (const t of g.towers) {
      if (t.dead) continue;
      const dx = t.pos.x - e.pos.x, dz = t.pos.z - e.pos.z;
      if (dx * dx + dz * dz < (e.radius + 0.9) * (e.radius + 0.9)) {
        t.hp -= 30; t.flash = 0.15;
        if (t.hp <= 0) { g.pushFx({ type: 'sound', sound: 'tower_destroy' }); g.removeTower(t); }
      }
    }
    if (e.chargeT <= 0) {
      e.chargeState = 'idle';
      e.chargeCd = 4 + Math.random() * 3;
    }
    void speed;
  }
}

// Colossus: AoE slam with a telegraph — damages player + towers in a ring.
function updateColossusSlam(g: GameState, e: Enemy, dt: number): void {
  e.slamCd -= dt;
  if (e.slamCd <= 0 && e.state === 'walk') {
    e.slamCd = 5 + Math.random() * 2;
    e.slamTelegraph = 0.8;
  }
  if (e.slamTelegraph > 0 && e.slamTelegraph < 0.02) {
    // impact
    const r = 4.5;
    g.pushFx({ type: 'sound', sound: 'slam' });
    g.pushFx({ type: 'shake', amount: 8 });
    g.pushFx({ type: 'burst', pos: { x: e.pos.x, y: 0.2, z: e.pos.z }, color: '#b44fd8', value: 40, size: 0.3, speed: 8 });
    const p = g.player;
    if (!p.dead) {
      const dx = p.pos.x - e.pos.x, dz = p.pos.z - e.pos.z;
      if (dx * dx + dz * dz < r * r) hurtPlayer(g, 18, e.pos);
    }
    for (const t of g.towers) {
      if (t.dead) continue;
      const dx = t.pos.x - e.pos.x, dz = t.pos.z - e.pos.z;
      if (dx * dx + dz * dz < r * r) { t.hp -= 25; t.flash = 0.15; if (t.hp <= 0) g.removeTower(t); }
    }
  }
}

// Shaman: curses a tower, slowing its fire rate (hex).
function updateHex(g: GameState, e: Enemy, dt: number): void {
  e.hexCd -= dt;
  if (e.hexCd <= 0) {
    e.hexCd = 5 + Math.random() * 3;
    // pick a tower in range
    let best: import('../core/types').Tower | null = null;
    let bestD = 14 * 14;
    for (const t of g.towers) {
      if (t.dead) continue;
      const dx = t.pos.x - e.pos.x, dz = t.pos.z - e.pos.z;
      const d = dx * dx + dz * dz;
      if (d < bestD) { bestD = d; best = t; }
    }
    if (best) {
      best.stormCd = 4;
      best.stormCdMax = 4;
      e.hexTargetId = best.id;
      g.pushFx({ type: 'sound', sound: 'void_bolt' });
      g.pushFx({ type: 'beam', pos: { x: e.pos.x, y: 1.2, z: e.pos.z }, pos2: { x: best.pos.x, y: 1.6, z: best.pos.z }, color: '#6dff9e' });
      g.pushFx({ type: 'text', msg: 'HEXED', pos: { x: best.pos.x, y: 2.4, z: best.pos.z }, color: '#6dff9e' });
    }
  }
}

// ---------------- Boss AI (3-phase cinematic) ----------------
function updateBoss(g: GameState, e: Enemy, dt: number): void {
  const hpRatio = e.hp / e.maxHp;
  // phase transitions (cinematic)
  const newPhase = hpRatio > 0.66 ? 1 : hpRatio > 0.33 ? 2 : 3;
  if (newPhase !== e.phase) {
    e.phase = newPhase;
    e.enraged = newPhase >= 2;
    const phaseInfo = [
      { msg: 'THE BEHEMOTH STIRS', sub: 'Phase 2 — it summons the void', color: '#b44fd8' },
      { msg: 'THE BEHEMOTH RAGES', sub: 'Phase 3 — desperate fury', color: '#ff7d6b' },
    ][newPhase - 2] ?? { msg: 'THE BEHEMOTH STIRS', sub: 'It fights harder', color: '#b44fd8' };
    g.pushFx({ type: 'cinematic', slowMo: 0.3, slowMoT: 1.2, flash: 0.7, flashColor: '#b44fd8', zoom: 1.4, zoomT: 1.2, shake: 12 });
    g.pushFx({ type: 'announce', msg: phaseInfo.msg, sub: phaseInfo.sub, color: phaseInfo.color });
    g.pushFx({ type: 'sound', sound: 'boss_enrage' });
    // phase 2: gain a shield burst
    if (newPhase === 2) e.shieldT = 2.5;
  }

  // summon crawlers (more in later phases)
  e.summonCd -= dt;
  if (e.summonCd <= 0) {
    e.summonCd = e.phase === 3 ? 6 : e.phase === 2 ? 8 : 11;
    const n = e.phase === 3 ? 5 : e.phase === 2 ? 4 : 3;
    for (let i = 0; i < n; i++) {
      const lane = (e.lane + i) % 3;
      const c = g.spawnEnemy('crawler', lane);
      if (c) {
        c.hp = 42 * DIFF_HP(g); c.maxHp = c.hp; c.speed = 3.4; c.radius = 0.55;
        c.dist = Math.max(0, e.dist - 6 - i * 2);
      }
    }
    g.pushFx({ type: 'sound', sound: 'boss_summon' });
    g.pushFx({ type: 'shake', amount: 3 });
  }

  // ranged void bolts at player (or bastion if player far) — faster in later phases
  e.boltCd -= dt;
  if (e.boltCd <= 0) {
    e.boltCd = e.phase === 3 ? 1.6 : e.phase === 2 ? 2.4 : 3.4;
    const p = g.player;
    const target = !p.dead && Math.hypot(p.pos.x - e.pos.x, p.pos.z - e.pos.z) < 26 ? p.pos : { x: 0, y: 0, z: 0 };
    const bolts = e.phase === 3 ? 3 : e.phase === 2 ? 2 : 1;
    for (let i = 0; i < bolts; i++) {
      const spread = (i - (bolts - 1) / 2) * 0.25;
      const tx = target.x + Math.sin(spread) * 3;
      const tz = target.z + Math.cos(spread) * 3;
      fireVoidBolt(g, e, { x: tx, y: 0, z: tz }, e.phase === 3 ? 28 : e.phase === 2 ? 22 : 18, target === p.pos ? -1 : -2);
    }
  }

  // shield (less frequent in phase 3)
  e.shieldCd -= dt;
  if (e.shieldCd <= 0) {
    e.shieldCd = e.phase === 3 ? 16 : e.phase === 2 ? 12 : 14;
    e.shieldT = e.phase === 3 ? 2 : 3;
    g.pushFx({ type: 'announce', msg: 'VOID SHIELD', sub: 'The Behemoth is invulnerable', color: '#8fe8ff' });
    g.pushFx({ type: 'sound', sound: 'boss_shield' });
  }

  // disable nearby towers (stun via stormCd reuse)
  bossStunTick(e, dt, g);
}

// per-boss stun cooldown, keyed by enemy id (module-level, boss is unique per run)
const bossStunCd = new Map<number, number>();
function bossStunTick(e: Enemy, dt: number, g: GameState) {
  let cd = bossStunCd.get(e.id) ?? 6;
  cd -= dt;
  if (cd <= 0) {
    cd = e.phase === 3 ? 7 : e.phase === 2 ? 9 : 12;
    let disabled = 0;
    for (const t of g.towers) {
      if (t.dead || disabled >= 2) continue;
      const dx = t.pos.x - e.pos.x, dz = t.pos.z - e.pos.z;
      if (dx * dx + dz * dz < 9 * 9) {
        t.stormCd = 5;
        t.stormCdMax = 5;
        disabled++;
      }
    }
    if (disabled > 0) {
      g.pushFx({ type: 'announce', msg: 'TOWERS SUPPRESSED', sub: disabled + ' defense' + (disabled > 1 ? 's' : '') + ' disabled', color: '#b44fd8' });
      g.pushFx({ type: 'sound', sound: 'boss_stun' });
      g.pushFx({ type: 'shake', amount: 4 });
    }
  }
  bossStunCd.set(e.id, cd);
}

function DIFF_HP(g: GameState): number {
  return g.difficulty === 'easy' ? 0.8 : g.difficulty === 'hard' ? 1.35 : 1;
}

function fireVoidBolt(g: GameState, e: Enemy, target: Vec3, dmg: number, from: number): void {
  const p = g.allocProjectile();
  if (!p) return;
  p.active = true;
  p.kind = 'void';
  p.pos = { x: e.pos.x, y: 1.6, z: e.pos.z };
  const dx = target.x - p.pos.x, dz = target.z - p.pos.z;
  const d = Math.hypot(dx, dz) || 1;
  const speed = 14;
  p.vel = { x: (dx / d) * speed, y: 0, z: (dz / d) * speed };
  p.life = 4;
  p.dmg = dmg;
  p.radius = 0.5;
  p.from = from;
  p.color = 0xb44fd8;
  p.hit = [];
  g.pushFx({ type: 'sound', sound: 'void_bolt' });
}
