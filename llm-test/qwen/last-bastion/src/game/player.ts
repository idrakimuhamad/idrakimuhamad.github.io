import { GameState } from './state';
import { damageEnemy } from './enemies';
import { resonanceDetonate, applyStatus } from './status';
import { ULTIMATE } from '../core/defs';
import type { Vec3, Enemy, StatusKind } from '../core/types';

// Auto basic attack: melee swing range (world units, from player center to enemy surface)
const MELEE_RANGE = 2.2;
const MELEE_ARC = 1.15; // radians each side of facing (~66 deg)
const MELEE_CD = 0.45;
const MELEE_ANIM = 0.2;

export interface PlayerInput {
  moveX: number; // -1..1 (screen right)
  moveY: number; // -1..1 (screen up)
  aim: Vec3;     // world point
  firing: boolean;
  lance: boolean;
  dash: boolean;
  q: boolean; e: boolean; r: boolean; f: boolean;
  ultimate: boolean;
}

export const ABILITY = {
  Q: { name: 'Ground Slam', cd: 8, desc: 'Radial knockback around you' },
  E: { name: 'Arcane Volley', cd: 10, desc: 'Burst of 8 bolts' },
  R: { name: 'Blink', cd: 6, desc: 'Teleport toward aim (unlocked)' },
  F: { name: 'Overcharge', cd: 25, desc: 'Nearby towers fire faster for 6s (unlocked)' },
};

const cds = { Q: 0, E: 0, R: 0, F: 0 };

export function resetPlayerCds() { cds.Q = 0; cds.E = 0; cds.R = 0; cds.F = 0; }
export function getCd(key: 'Q' | 'E' | 'R' | 'F'): number { return cds[key]; }
export function getCdMax(key: 'Q' | 'E' | 'R' | 'F'): number { return ABILITY[key].cd; }

export function updatePlayer(g: GameState, dt: number, input: PlayerInput): void {
  const p = g.player;
  if (p.dead) return;
  if (p.invulnT > 0) p.invulnT -= dt;
  if (p.hurtT > 0) p.hurtT -= dt;
  if (p.fireCd > 0) p.fireCd -= dt;
  if (p.lanceCd > 0) p.lanceCd -= dt;
  if (p.dashCd > 0) p.dashCd -= dt;
  cds.Q = Math.max(0, cds.Q - dt);
  cds.E = Math.max(0, cds.E - dt);
  cds.R = Math.max(0, cds.R - dt);
  cds.F = Math.max(0, cds.F - dt);

  // facing toward aim
  const adx = input.aim.x - p.pos.x, adz = input.aim.z - p.pos.z;
  if (adx * adx + adz * adz > 0.05) p.facing = Math.atan2(adx, adz);

  // movement
  const speed = p.speed * g.mods.moveSpeed;
  if (p.dashT > 0) {
    p.dashT -= dt;
    p.pos.x += p.dashDir.x * 26 * dt;
    p.pos.z += p.dashDir.z * 26 * dt;
    if (g.mods.dashFire) {
      g.addPatch({ x: p.pos.x, y: 0, z: p.pos.z }, 1.1, 0.5, 14);
    }
    // Resonance: dashing through an enemy detonates all its statuses
    if (g.mods.resonance) {
      for (const e of g.enemies) {
        if (e.dead || e.state === 'spawn') continue;
        const dx = e.pos.x - p.pos.x, dz = e.pos.z - p.pos.z;
        if (dx * dx + dz * dz < (e.radius + 1.1) * (e.radius + 1.1)) {
          resonanceDetonate(g, e);
        }
      }
    }
  } else {
    let mx = input.moveX, my = input.moveY;
    const ml = Math.hypot(mx, my);
    if (ml > 1) { mx /= ml; my /= ml; }
    // screen space maps to world: right=+x, up=-z
    p.pos.x += mx * speed * dt;
    p.pos.z += -my * speed * dt;
  }
  // clamp to arena
  const r = g.arena.radius - 2;
  const pl = Math.hypot(p.pos.x, p.pos.z);
  if (pl > r) { p.pos.x *= r / pl; p.pos.z *= r / pl; }

  // dash
  if (input.dash && p.dashCd <= 0 && p.dashT <= 0) {
    p.dashCd = 2.5;
    p.dashT = 0.18;
    p.invulnT = Math.max(p.invulnT, 0.3);
    let dx = input.moveX, dz = -input.moveY;
    const l = Math.hypot(dx, dz);
    if (l < 0.1) { dx = Math.sin(p.facing); dz = Math.cos(p.facing); }
    else { dx /= l; dz /= l; }
    p.dashDir = { x: dx, y: 0, z: dz };
    g.pushFx({ type: 'sound', sound: 'dash' });
  }

  // auto basic attack: melee swing when an enemy is in reach
  if (p.meleeAnim > 0) {
    p.meleeAnim -= dt;
    p.facing = p.meleeAngle; // lock facing toward the target during the swing
  }
  if (p.meleeCd > 0) p.meleeCd -= dt;
  if (p.meleeCd <= 0 && p.meleeAnim <= 0 && p.dashT <= 0) {
    let best: Enemy | null = null;
    let bestD = Infinity;
    for (const e of g.enemies) {
      if (e.dead || e.state === 'spawn') continue;
      const dx = e.pos.x - p.pos.x, dz = e.pos.z - p.pos.z;
      const d = Math.hypot(dx, dz) - e.radius;
      if (d < MELEE_RANGE && d < bestD) { best = e; bestD = d; }
    }
    if (best) {
      const ang = Math.atan2(best.pos.x - p.pos.x, best.pos.z - p.pos.z);
      p.facing = ang;
      p.meleeAngle = ang;
      p.meleeCd = MELEE_CD / g.mods.attackSpeed;
      p.meleeAnim = MELEE_ANIM;
      let hitAny = false;
      for (const e of g.enemies) {
        if (e.dead || e.state === 'spawn') continue;
        const dx = e.pos.x - p.pos.x, dz = e.pos.z - p.pos.z;
        const d = Math.hypot(dx, dz);
        if (d > MELEE_RANGE + e.radius) continue;
        let diff = Math.atan2(dx, dz) - ang;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        if (Math.abs(diff) > MELEE_ARC) continue;
        const kb = { x: Math.sin(ang) * 5, y: 0, z: Math.cos(ang) * 5 };
        let meleeDmg = 9 * g.mods.attackSpeed;
        // Conduit: melee channels a fraction of your strongest tower's damage + its status
        if (g.mods.conduit > 0) {
          meleeDmg += bestConduitTower(g) * g.mods.conduit;
        }
        damageEnemy(g, e, meleeDmg, { kb, kbStrength: 0.5 });
        // conduit also applies the channelled tower's status
        if (g.mods.conduit > 0) {
          const st = conduitStatus(g);
          if (st) applyStatusMelee(g, e, st);
        }
        hitAny = true;
      }
      g.pushFx({ type: 'sound', sound: 'swing' });
      if (hitAny) {
        g.pushFx({ type: 'sound', sound: 'hit' });
        g.pushFx({ type: 'burst', pos: { x: p.pos.x + Math.sin(ang) * 1.7, y: 0.9, z: p.pos.z + Math.cos(ang) * 1.7 }, color: '#ffe8c8', value: 5, size: 0.08, speed: 3 });
      }
    }
  }

  // primary attack
  if (input.firing && p.fireCd <= 0) {
    p.fireCd = 0.34 / g.mods.attackSpeed;
    const p2 = g.allocProjectile();
    if (p2) {
      p2.active = true;
      p2.kind = 'bolt';
      p2.pos = { x: p.pos.x + Math.sin(p.facing) * 0.8, y: 1.2, z: p.pos.z + Math.cos(p.facing) * 0.8 };
      const dx = input.aim.x - p2.pos.x, dz = input.aim.z - p2.pos.z;
      const d = Math.hypot(dx, dz) || 1;
      const speed2 = 30;
      p2.vel = { x: (dx / d) * speed2, y: 0, z: (dz / d) * speed2 };
      p2.life = 1.0;
      const crit = Math.random() < g.mods.critChance;
      p2.dmg = (crit ? 28 : 14) * g.mods.attackSpeed;
      p2.radius = 0.26;
      p2.from = -1;
      p2.color = crit ? 0xffd84f : 0x9fe8ff;
      p2.pierce = g.mods.pierce;
      p2.bounces = 0;
      p2.splash = 0;
      p2.hit = [];
      p2.arcT = 0; p2.trailT = 0;
      g.pushFx({ type: 'sound', sound: 'shoot' });
      if (crit && g.mods.critEssence) g.addEssence(4);
    }
  }

  // secondary: lance
  if (input.lance && p.lanceCd <= 0) {
    p.lanceCd = 1.3;
    const p2 = g.allocProjectile();
    if (p2) {
      p2.active = true;
      p2.kind = 'lance';
      p2.pos = { x: p.pos.x + Math.sin(p.facing) * 0.8, y: 1.3, z: p.pos.z + Math.cos(p.facing) * 0.8 };
      const dx = input.aim.x - p2.pos.x, dz = input.aim.z - p2.pos.z;
      const d = Math.hypot(dx, dz) || 1;
      p2.vel = { x: (dx / d) * 22, y: 0, z: (dz / d) * 22 };
      p2.life = 1.4;
      p2.dmg = 34;
      p2.radius = 0.45;
      p2.from = -1;
      p2.color = 0xffb84f;
      p2.pierce = 2;
      p2.bounces = 0;
      p2.splash = 0;
      p2.hit = [];
      p2.arcT = 0; p2.trailT = 0;
      g.pushFx({ type: 'sound', sound: 'lance' });
    }
  }

  // abilities
  if (input.q && cds.Q <= 0) {
    cds.Q = ABILITY.Q.cd;
    groundSlam(g);
  }
  if (input.e && cds.E <= 0) {
    cds.E = ABILITY.E.cd;
    arcaneVolley(g);
  }
  if (input.r && cds.R <= 0) {
    if (g.mods.blink) {
      cds.R = ABILITY.R.cd;
      blink(g, input.aim);
    }
  }
  if (input.f && cds.F <= 0) {
    if (g.mods.overcharge) {
      cds.F = ABILITY.F.cd;
      g.mods.overchargeT = 6;
      g.pushFx({ type: 'sound', sound: 'overcharge' });
      g.pushFx({ type: 'announce', msg: 'OVERCHARGE', sub: 'Nearby towers fire 80% faster', color: '#d8ff4f' });
    }
  }

  // ultimate: chargeable Bastion Nova
  const u = g.ultimate;
  if (u.cd > 0) u.cd -= dt;
  if (u.active) {
    u.activeT -= dt;
    if (u.activeT <= 0) { u.active = false; u.charge = 0; u.cd = ULTIMATE.cd; }
  }
  if (input.ultimate && u.charge >= u.max && !u.active && u.cd <= 0) {
    castUltimate(g);
  }
}

// The chargeable Bastion ultimate: a spectacular radial nova from the player.
function castUltimate(g: GameState): void {
  const p = g.player;
  const u = g.ultimate;
  u.active = true;
  u.activeT = ULTIMATE.duration;
  g.pushFx({ type: 'sound', sound: 'ultimate' });
  g.pushFx({ type: 'ultimate', pos: { x: p.pos.x, y: 0, z: p.pos.z }, color: '#ffd84f' });
  g.pushFx({ type: 'cinematic', slowMo: 0.35, slowMoT: 0.9, flash: 0.8, flashColor: '#fff0c0', zoom: 1.35, zoomT: 0.9, shake: 14 });
  g.pushFx({ type: 'announce', msg: 'BASTION NOVA', sub: 'The guardian unleashes its full power', color: '#ffd84f' });
  const R = ULTIMATE.radius;
  for (const e of g.enemies) {
    if (e.dead || e.state === 'spawn') continue;
    const dx = e.pos.x - p.pos.x, dz = e.pos.z - p.pos.z;
    const d = Math.hypot(dx, dz);
    if (d < R) {
      const kb = { x: (dx / (d || 1)) * 14, y: 0, z: (dz / (d || 1)) * 14 };
      damageEnemy(g, e, ULTIMATE.damage, { kb, kbStrength: 2.2 });
    }
  }
  // also heal the bastion a bit
  g.bastionHp = Math.min(g.bastionMaxHp, g.bastionHp + ULTIMATE.healBastion);
}

function applyStatusMelee(g: GameState, e: Enemy, st: StatusKind) {
  applyStatus(g, e, st, -1, 1);
}

// Strongest tower damage for the conduit (cached per-frame via a module var).
let conduitCache = { dmg: 0, status: null as StatusKind | null, t: -1 };
function bestConduitTower(g: GameState): number {
  const now = g.time;
  if (conduitCache.t < now - 0.3) {
    let best = 0; let st: StatusKind | null = null;
    for (const t of g.towers) {
      if (t.dead) continue;
      if (t.damage > best) { best = t.damage; st = towerStatus(t.kind); }
    }
    conduitCache = { dmg: best, status: st, t: now };
  }
  return conduitCache.dmg;
}
function conduitStatus(g: GameState): StatusKind | null {
  bestConduitTower(g);
  return conduitCache.status;
}
function towerStatus(kind: string): StatusKind | null {
  switch (kind) {
    case 'ember': return 'burn';
    case 'frost': return 'chill';
    case 'tesla': return 'shock';
    case 'arcane': return 'mark';
    default: return null;
  }
}

function groundSlam(g: GameState): void {
  const p = g.player;
  g.pushFx({ type: 'sound', sound: 'slam' });
  g.pushFx({ type: 'shake', amount: 7 });
  g.pushFx({ type: 'burst', pos: { x: p.pos.x, y: 0.3, z: p.pos.z }, color: '#9fe8ff', value: 40, size: 0.2, speed: 9 });
  for (const e of g.enemies) {
    if (e.dead || e.state === 'spawn') continue;
    const dx = e.pos.x - p.pos.x, dz = e.pos.z - p.pos.z;
    const d = Math.hypot(dx, dz);
    if (d < 5.2) {
      const kb = { x: (dx / (d || 1)) * 10, y: 0, z: (dz / (d || 1)) * 10 };
      damageEnemy(g, e, 22, { kb, kbStrength: 1.6 });
    }
  }
}

function arcaneVolley(g: GameState): void {
  const p = g.player;
  g.pushFx({ type: 'sound', sound: 'volley' });
  for (let i = 0; i < 8; i++) {
    const p2 = g.allocProjectile();
    if (!p2) return;
    const spread = (i - 3.5) * 0.16;
    const ang = p.facing + spread;
    const tx = p.aim.x, tz = p.aim.z;
    // aim direction with spread
    const dx0 = Math.sin(ang), dz0 = Math.cos(ang);
    p2.active = true;
    p2.kind = 'bolt';
    p2.pos = { x: p.pos.x + dx0 * 0.8, y: 1.2, z: p.pos.z + dz0 * 0.8 };
    p2.vel = { x: dx0 * 28, y: 0, z: dz0 * 28 };
    p2.life = 0.9;
    p2.dmg = 11;
    p2.radius = 0.24;
    p2.from = -1;
    p2.color = 0x4fd8ff;
    p2.pierce = 0; p2.bounces = 0; p2.splash = 0;
    p2.hit = [];
    p2.arcT = 0; p2.trailT = 0;
    void tx; void tz;
  }
}

function blink(g: GameState, aim: Vec3): void {
  const p = g.player;
  const dx = aim.x - p.pos.x, dz = aim.z - p.pos.z;
  const d = Math.hypot(dx, dz);
  const dist = Math.min(9, Math.max(3, d * 0.6));
  g.pushFx({ type: 'burst', pos: { x: p.pos.x, y: 0.8, z: p.pos.z }, color: '#9fe8ff', value: 14, size: 0.15, speed: 4 });
  p.pos.x += (dx / (d || 1)) * dist;
  p.pos.z += (dz / (d || 1)) * dist;
  g.pushFx({ type: 'burst', pos: { x: p.pos.x, y: 0.8, z: p.pos.z }, color: '#9fe8ff', value: 14, size: 0.15, speed: 4 });
  g.pushFx({ type: 'sound', sound: 'blink' });
}
