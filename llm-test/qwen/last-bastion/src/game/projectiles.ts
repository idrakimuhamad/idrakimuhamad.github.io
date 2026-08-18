import { GameState } from './state';
import { damageEnemy, hurtPlayer } from './enemies';
import { applyStatus } from './status';
import { ULTIMATE } from '../core/defs';
import type { Projectile, Enemy } from '../core/types';

export function updateProjectiles(g: GameState, dt: number): void {
  for (const p of g.projectilePool) {
    if (!p.active) continue;
    p.life -= dt;
    if (p.life <= 0) { p.active = false; continue; }

    if (p.kind === 'ember') {
      // arc flight
      p.arcT += dt;
      const t = Math.min(1, p.arcT / p.arcDur);
      p.pos.x = p.arcFrom.x + (p.arcTo.x - p.arcFrom.x) * t;
      p.pos.z = p.arcFrom.z + (p.arcTo.z - p.arcFrom.z) * t;
      p.pos.y = p.arcFrom.y + (p.arcH * 4 * t * (1 - t));
      if (t >= 1) {
        p.active = false;
        explodeEmber(g, p);
      }
      continue;
    }

    // straight flight
    p.pos.x += p.vel.x * dt;
    p.pos.y += p.vel.y * dt;
    p.pos.z += p.vel.z * dt;

    // collision vs enemies (skip own shooter's friendly fire)
    if (p.from >= 0 || p.from === -1 || p.from === -2) {
      const friendly = p.from === -2; // boss bolts hurt player/bastion
      if (friendly) {
        // hit player
        const pl = g.player;
        if (!pl.dead) {
          const dx = pl.pos.x - p.pos.x, dz = pl.pos.z - p.pos.z;
          if (dx * dx + dz * dz < (p.radius + 0.6) * (p.radius + 0.6)) {
            p.active = false;
            hurtPlayer(g, p.dmg, p.pos);
            g.pushFx({ type: 'burst', pos: { x: p.pos.x, y: 1, z: p.pos.z }, color: '#b44fd8', value: 12, size: 0.15, speed: 4 });
            continue;
          }
        }
        // hit bastion
        const bx = 0 - p.pos.x, bz = 0 - p.pos.z;
        if (bx * bx + bz * bz < 2.2 * 2.2) {
          p.active = false;
          g.bastionHp = Math.max(0, g.bastionHp - p.dmg);
          g.bastionFlash = 0.2;
          g.pushFx({ type: 'shake', amount: 4 });
          g.pushFx({ type: 'burst', pos: { x: p.pos.x, y: 1, z: p.pos.z }, color: '#b44fd8', value: 12, size: 0.15, speed: 4 });
          if (g.bastionHp <= 0) {
            g.phase = 'gameover';
            g.pushFx({ type: 'sound', sound: 'defeat' });
          }
          continue;
        }
        continue;
      }

      // player/tower projectile vs enemies
      outer: for (const e of g.enemies) {
        if (e.dead || e.state === 'spawn' || e.untargetable || p.hit.includes(e.id)) continue;
        const dx = e.pos.x - p.pos.x, dz = e.pos.z - p.pos.z;
        const rr = p.radius + e.radius;
        if (dx * dx + dz * dz >= rr * rr) continue;
        p.hit.push(e.id);
        const kb = { x: p.vel.x, y: 0, z: p.vel.z };
        const kbStrength = p.kind === 'lance' ? (g.mods.lanceKnockback ? 2.4 : 1.0) : 0.4;
        const fromDir = { x: p.vel.x, y: 0, z: p.vel.z };
        const killed = damageEnemy(g, e, p.dmg, { kb, kbStrength, fromDir });
        // player projectiles charge the ultimate
        if (p.from === -1) g.addUltimateCharge(ULTIMATE.gainPlayer);
        // apply carried status
        if (p.status) applyStatus(g, e, p.status, p.from >= 0 ? p.from : -1, p.statusPower);
        if (p.mark) applyStatus(g, e, 'mark', p.from >= 0 ? p.from : -1, 1);
        g.pushFx({ type: 'sound', sound: p.kind === 'lance' ? 'lance_hit' : 'hit' });
        g.pushFx({ type: 'burst', pos: { x: p.pos.x, y: 0.8, z: p.pos.z }, color: '#' + p.color.toString(16).padStart(6, '0'), value: 6, size: 0.12, speed: 3 });
        if (p.pierce > 0) {
          p.pierce--; // fly through
          continue;
        }
        if (p.bounces > 0) {
          const next = nearestEnemy(g, p, e);
          if (next) {
            p.bounces--;
            const dx2 = next.pos.x - p.pos.x, dz2 = next.pos.z - p.pos.z;
            const d2 = Math.hypot(dx2, dz2) || 1;
            p.vel = { x: (dx2 / d2) * 26, y: 0, z: (dz2 / d2) * 26 };
            p.life = 0.5;
            continue;
          }
        }
        p.active = false;
        break outer;
      }
    }

    // out of bounds
    const r = g.arena.radius + 4;
    if (p.pos.x * p.pos.x + p.pos.z * p.pos.z > r * r) p.active = false;
  }
}

function nearestEnemy(g: GameState, p: Projectile, exclude: Enemy): Enemy | null {
  let best: Enemy | null = null;
  let bestD = 9 * 9;
  for (const e of g.enemies) {
    if (e.dead || e.state === 'spawn' || e === exclude || p.hit.includes(e.id)) continue;
    const dx = e.pos.x - p.pos.x, dz = e.pos.z - p.pos.z;
    const d2 = dx * dx + dz * dz;
    if (d2 < bestD) { bestD = d2; best = e; }
  }
  return best;
}

function explodeEmber(g: GameState, p: Projectile): void {
  g.pushFx({ type: 'sound', sound: 'explode' });
  g.pushFx({ type: 'shake', amount: 2 });
  g.pushFx({ type: 'burst', pos: { x: p.pos.x, y: 0.4, z: p.pos.z }, color: '#ff8c42', value: 26, size: 0.2, speed: 7 });
  g.pushFx({ type: 'burst', pos: { x: p.pos.x, y: 0.3, z: p.pos.z }, color: '#ffd84f', value: 10, size: 0.12, speed: 3 });
  for (const e of g.enemies) {
    if (e.dead || e.state === 'spawn') continue;
    const dx = e.pos.x - p.pos.x, dz = e.pos.z - p.pos.z;
    const d = Math.hypot(dx, dz);
    if (d < p.splash + e.radius) {
      const fall = 1 - (d / (p.splash + e.radius)) * 0.5;
      const kb = { x: (dx / (d || 1)), y: 0, z: (dz / (d || 1)) };
      damageEnemy(g, e, p.dmg * fall, { kb, kbStrength: 3 });
    }
  }
  if (g.mods.emberFire) {
    g.addPatch({ x: p.pos.x, y: 0, z: p.pos.z }, p.splash * 0.8, 2.2, 12);
  }
}

// fire patches (burning ground) damage enemies standing in them
export function updatePatches(g: GameState, dt: number): void {
  for (let i = g.patches.length - 1; i >= 0; i--) {
    const p = g.patches[i];
    p.life -= dt;
    if (p.life <= 0) { g.patches.splice(i, 1); continue; }
    p.tick -= dt;
    if (p.tick <= 0) {
      p.tick = 0.4;
      for (const e of g.enemies) {
        if (e.dead || e.state === 'spawn') continue;
        const dx = e.pos.x - p.pos.x, dz = e.pos.z - p.pos.z;
        if (dx * dx + dz * dz < (p.radius + e.radius) * (p.radius + e.radius)) {
          damageEnemy(g, e, p.dps * 0.4);
        }
      }
    }
  }
}
