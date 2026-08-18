// Environmental hazards: recurring battlefield events tied to specific waves.
// Each hazard telegraphs, then strikes a random point, affecting player/enemies/towers.
import { GameState } from './state';
import { HAZARDS } from '../core/defs';
import { hurtPlayer } from './enemies';
import type { Vec3 } from '../core/types';

export function updateHazard(g: GameState, dt: number): void {
  const h = g.hazard;
  if (!h || !h.active) return;
  const cfg = HAZARDS[h.kind];
  h.t -= dt;
  if (h.t > cfg.telegraph) return; // still waiting to strike

  // telegraph phase: pick a target point once, at the start of the telegraph window
  if (!h.struck) {
    const ang = Math.random() * Math.PI * 2;
    const rad = 4 + Math.random() * 10;
    h.pos = { x: Math.cos(ang) * rad, y: 0, z: Math.sin(ang) * rad };
    h.radius = cfg.radius;
    h.struck = true;
    g.pushFx({ type: 'hazard', hazard: h.kind, pos: { x: h.pos.x, y: 0, z: h.pos.z }, size: cfg.radius });
  }

  // strike at the moment the telegraph ends
  if (h.t <= 0) {
    strike(g, h.pos, h.radius, h.kind);
    h.t = cfg.interval; // reset to next strike
    h.struck = false;   // re-pick a new point next cycle
  }
}

function strike(g: GameState, pos: Vec3, radius: number, kind: string): void {
  const cfg = HAZARDS[kind as keyof typeof HAZARDS];
  g.pushFx({ type: 'shake', amount: 5 });
  switch (kind) {
    case 'rift_storm': {
      g.pushFx({ type: 'sound', sound: 'void_bolt' });
      g.pushFx({ type: 'burst', pos: { x: pos.x, y: 1, z: pos.z }, color: '#b44fd8', value: 40, size: 0.3, speed: 9 });
      g.pushFx({ type: 'beam', pos: { x: pos.x, y: 12, z: pos.z }, pos2: { x: pos.x, y: 0, z: pos.z }, color: '#b44fd8' });
      // stun towers in the radius
      let n = 0;
      for (const t of g.towers) {
        if (t.dead) continue;
        const dx = t.pos.x - pos.x, dz = t.pos.z - pos.z;
        if (dx * dx + dz * dz < radius * radius) { t.stormCd = 2.5; t.stormCdMax = 2.5; n++; }
      }
      if (n > 0) g.pushFx({ type: 'text', msg: 'STORM', pos: { x: pos.x, y: 3, z: pos.z }, color: '#b44fd8' });
      break;
    }
    case 'ember_tide': {
      g.pushFx({ type: 'sound', sound: 'explode' });
      g.pushFx({ type: 'burst', pos: { x: pos.x, y: 0.5, z: pos.z }, color: '#ff8c42', value: 60, size: 0.35, speed: 10 });
      // burn the player if caught
      const p = g.player;
      if (!p.dead) {
        const dx = p.pos.x - pos.x, dz = p.pos.z - pos.z;
        if (dx * dx + dz * dz < radius * radius) hurtPlayer(g, 16, pos);
      }
      // leave a burning patch
      g.addPatch(pos, radius * 0.8, 2.5, cfg.dps);
      break;
    }
    case 'frost_nova': {
      g.pushFx({ type: 'sound', sound: 'frost' });
      g.pushFx({ type: 'burst', pos: { x: pos.x, y: 0.5, z: pos.z }, color: '#8fe8ff', value: 50, size: 0.3, speed: 8 });
      // slow + briefly freeze enemies in the radius (a gift to the player, but they cluster)
      for (const e of g.enemies) {
        if (e.dead || e.state === 'spawn') continue;
        const dx = e.pos.x - pos.x, dz = e.pos.z - pos.z;
        if (dx * dx + dz * dz < radius * radius) {
          e.slow = Math.max(e.slow, 0.5);
          e.slowT = Math.max(e.slowT, 2.0);
          e.freezeT = Math.max(e.freezeT, 0.8);
        }
      }
      break;
    }
  }
}
