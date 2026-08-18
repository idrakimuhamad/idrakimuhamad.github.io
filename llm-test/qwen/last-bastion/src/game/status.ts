// Elemental status system: burn, chill, shock, mark + combos.
// Pure game logic; rendering reads e.status for visuals.
import { GameState } from './state';
import { STATUS } from '../core/defs';
import { damageEnemy } from './enemies';
import type { Enemy, StatusKind } from '../core/types';

// Apply a status to an enemy. `src` is the tower id that applied it (for combo attribution).
export function applyStatus(g: GameState, e: Enemy, kind: StatusKind, src: number, power = 1): void {
  if (e.dead || e.state === 'spawn') return;
  const boost = g.mods.statusBoost;
  const s = e.status;
  switch (kind) {
    case 'burn': {
      const dps = STATUS.burn.dps * power;
      // MELT: applying burn to a chilled enemy is far stronger
      const melt = s.chillT > 0;
      s.burnDps = Math.max(s.burnDps, dps * (melt ? STATUS.meltBurnMult : 1));
      s.burnT = Math.max(s.burnT, STATUS.burn.dur * boost);
      s.burnSrc = src;
      if (melt) {
        g.pushFx({ type: 'text', msg: 'MELT', pos: { x: e.pos.x, y: 1.6, z: e.pos.z }, color: '#ff8c42' });
        g.pushFx({ type: 'burst', pos: { x: e.pos.x, y: 0.8, z: e.pos.z }, color: '#ff8c42', value: 8, size: 0.12, speed: 3 });
      }
      break;
    }
    case 'chill': {
      const amt = Math.min(0.8, STATUS.chill.amt * power);
      s.chillAmt = Math.max(s.chillAmt, amt);
      s.chillT = Math.max(s.chillT, STATUS.chill.dur * boost);
      s.chillSrc = src;
      break;
    }
    case 'shock': {
      s.shockT = Math.max(s.shockT, STATUS.shock.dur * boost);
      s.shockSrc = src;
      // DETONATE: shocking a burning enemy explodes its burn into AoE
      if (s.burnT > 0) {
        detonateBurn(g, e);
      }
      break;
    }
    case 'mark': {
      s.markT = Math.max(s.markT, STATUS.mark.dur * boost);
      break;
    }
  }
}

// AoE explosion from a detonated burn.
export function detonateBurn(g: GameState, e: Enemy): void {
  const r = STATUS.detonateRadius;
  const dps = e.status.burnDps;
  e.status.burnT = 0;
  e.status.burnDps = 0;
  g.pushFx({ type: 'sound', sound: 'explode' });
  g.pushFx({ type: 'shake', amount: 3 });
  g.pushFx({ type: 'burst', pos: { x: e.pos.x, y: 0.6, z: e.pos.z }, color: '#ff8c42', value: 30, size: 0.2, speed: 6 });
  g.pushFx({ type: 'text', msg: 'DETONATE', pos: { x: e.pos.x, y: 1.8, z: e.pos.z }, color: '#ffd84f' });
  for (const o of g.enemies) {
    if (o === e || o.dead || o.state === 'spawn') continue;
    const dx = o.pos.x - e.pos.x, dz = o.pos.z - e.pos.z;
    if (dx * dx + dz * dz < r * r) {
      damageEnemy(g, o, STATUS.detonateDmg * (1 + dps * 0.15));
      // chain detonation: if the victim is also burning, it explodes too
      if (o.status.burnT > 0) detonateBurn(g, o);
    }
  }
}

// Total vulnerability multiplier (shock + mark + Fracture).
export function vulnMult(g: GameState, e: Enemy): number {
  const s = e.status;
  let v = 0;
  if (s.shockT > 0) v += STATUS.shock.vuln;
  if (s.markT > 0) v += STATUS.mark.vuln;
  if (s.shockT > 0 || s.markT > 0) v += g.mods.vulnBonus;
  return 1 + v;
}

// Tick statuses every frame. Returns true if the enemy died from burn.
export function tickStatuses(g: GameState, e: Enemy, dt: number): boolean {
  if (e.dead || e.state === 'spawn') return false;
  const s = e.status;
  let died = false;
  if (s.burnT > 0) {
    s.burnT -= dt;
    // burn damage is reduced by armor? No — burn bypasses armor (it's elemental).
    e.hp -= s.burnDps * dt;
    // occasional burn particle
    if (Math.random() < dt * 8) {
      g.particles.burst(e.pos.x, 0.5 + Math.random() * 0.6, e.pos.z, [1, 0.55, 0.25], 1, 1.5, 1.2, 0.5, 0.12);
    }
    if (e.hp <= 0) {
      died = true;
    }
  }
  // chill -> slow
  if (s.chillT > 0) {
    s.chillT -= dt;
    e.slow = Math.max(e.slow, s.chillAmt);
    e.slowT = Math.max(e.slowT, 0.2);
  }
  if (s.shockT > 0) s.shockT -= dt;
  if (s.markT > 0) s.markT -= dt;
  if (died) damageEnemy(g, e, 1, {}); // finalize with rewards
  return died;
}

// Resonance: dash through an enemy detonates all its statuses.
export function resonanceDetonate(g: GameState, e: Enemy): void {
  if (e.dead) return;
  const s = e.status;
  let n = 0;
  if (s.burnT > 0) { detonateBurn(g, e); n++; }
  if (s.shockT > 0) {
    g.pushFx({ type: 'burst', pos: { x: e.pos.x, y: 0.8, z: e.pos.z }, color: '#d8ff4f', value: 16, size: 0.15, speed: 5 });
    s.shockT = 0; n++;
  }
  if (s.markT > 0) { s.markT = 0; n++; }
  if (s.chillT > 0) {
    g.pushFx({ type: 'burst', pos: { x: e.pos.x, y: 0.8, z: e.pos.z }, color: '#8fe8ff', value: 10, size: 0.12, speed: 3 });
    s.chillT = 0; s.chillAmt = 0; n++;
  }
  if (n > 0) {
    damageEnemy(g, e, 12 * n);
    g.addUltimateCharge(4 * n);
    g.pushFx({ type: 'text', msg: 'RESONANCE', pos: { x: e.pos.x, y: 2.0, z: e.pos.z }, color: '#ffd84f' });
  }
}
