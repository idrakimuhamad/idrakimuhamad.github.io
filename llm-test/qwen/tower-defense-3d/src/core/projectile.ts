// Projectile state: homing, splash, trails. Port of 2D `we`.
// All distances converted to world units (px2w); speeds in world units/s.

import { px2w } from './defs';
import type { Enemy } from './enemy';
import type { ProjectileKind, TowerKind } from './types';

let nextId = 1;

export interface ProjectileInit {
  x: number;
  z: number;
  tx: number;
  tz: number;
  speed: number;      // world units/s
  damage: number;
  splash: number;     // world units (0 = none)
  slow: number;
  slowDur: number;
  kind: ProjectileKind;
  color: string;
  towerKind: TowerKind;
  target: Enemy | null;
  towerId: number;
}

export type ProjectileUpdateResult = 'alive' | 'hit' | 'dead';

export class Projectile {
  id: number;
  x: number;
  z: number;
  vx = 0;
  vz = 0;
  speed: number;
  damage: number;
  splash: number;
  slow: number;
  slowDur: number;
  kind: ProjectileKind;
  color: string;
  towerKind: TowerKind;
  target: Enemy | null;
  towerId: number;
  alive = true;
  homing: boolean;
  lastAimX: number;
  lastAimZ: number;
  trail: { x: number; z: number }[] = [];
  trailTimer = 0;
  age = 0;
  maxAge = 8;

  constructor(e: ProjectileInit) {
    this.id = nextId++;
    this.x = e.x;
    this.z = e.z;
    this.speed = e.speed;
    this.damage = e.damage;
    this.splash = e.splash;
    this.slow = e.slow;
    this.slowDur = e.slowDur;
    this.kind = e.kind;
    this.color = e.color;
    this.towerKind = e.towerKind;
    this.target = e.target;
    this.towerId = e.towerId;
    this.homing = e.kind !== 'bullet';
    this.lastAimX = e.tx;
    this.lastAimZ = e.tz;
    const dx = e.tx - e.x;
    const dz = e.tz - e.z;
    const d = Math.hypot(dx, dz) || 1;
    this.vx = (dx / d) * this.speed;
    this.vz = (dz / d) * this.speed;
  }

  update(dt: number, enemies: Enemy[]): ProjectileUpdateResult {
    this.age += dt;
    if (this.age > this.maxAge) {
      this.alive = false;
      return 'dead';
    }

    let ax: number, az: number;
    if (this.target && this.target.alive) {
      ax = this.target.x;
      az = this.target.z;
      this.lastAimX = ax;
      this.lastAimZ = az;
    } else if (this.homing) {
      const rt = this.findRetarget(enemies);
      if (rt) {
        this.target = rt;
        ax = rt.x;
        az = rt.z;
        this.lastAimX = ax;
        this.lastAimZ = az;
      } else {
        ax = this.lastAimX;
        az = this.lastAimZ;
      }
    } else {
      ax = this.lastAimX;
      az = this.lastAimZ;
    }

    const dx = ax - this.x;
    const dz = az - this.z;
    const d = Math.hypot(dx, dz);
    if (d > px2w(0.5)) {
      const blend = this.homing ? 1 : 0.5;
      this.vx = this.vx * (1 - blend) + (dx / d) * this.speed * blend;
      this.vz = this.vz * (1 - blend) + (dz / d) * this.speed * blend;
      const v = Math.hypot(this.vx, this.vz) || 1;
      this.vx = (this.vx / v) * this.speed;
      this.vz = (this.vz / v) * this.speed;
    }

    this.x += this.vx * dt;
    this.z += this.vz * dt;

    this.trailTimer -= dt;
    if (this.trailTimer <= 0) {
      this.trail.push({ x: this.x, z: this.z });
      if (this.trail.length > 6) this.trail.shift();
      this.trailTimer = 0.02;
    }

    // direct hit on current target
    if (this.target && this.target.alive) {
      const ox = this.target.x - this.x;
      const oz = this.target.z - this.z;
      const h = px2w(this.target.def.radius + (this.splash > 0 ? 6 : 4));
      if (ox * ox + oz * oz <= h * h) {
        this.alive = false;
        return 'hit';
      }
    }

    // splash: direct contact with any enemy
    if (this.splash > 0) {
      for (const e of enemies) {
        if (!e.alive) continue;
        const ox = e.x - this.x;
        const oz = e.z - this.z;
        const h = px2w(e.def.radius + 6);
        if (ox * ox + oz * oz <= h * h) {
          this.target = e;
          this.alive = false;
          return 'hit';
        }
      }
    } else if (!this.target || !this.target.alive) {
      // non-splash, no live target: contact with any enemy
      for (const e of enemies) {
        if (!e.alive) continue;
        const ox = e.x - this.x;
        const oz = e.z - this.z;
        const h = px2w(e.def.radius + 3);
        if (ox * ox + oz * oz <= h * h) {
          this.target = e;
          this.alive = false;
          return 'hit';
        }
      }
    }

    // splash: reached last aim point
    if (this.splash > 0 && (!this.target || !this.target.alive)) {
      const ox = this.lastAimX - this.x;
      const oz = this.lastAimZ - this.z;
      if (ox * ox + oz * oz <= (this.speed * dt + px2w(6)) ** 2) {
        this.alive = false;
        return 'hit';
      }
    }

    // bullet: reached last aim point (no explosion, just expires)
    if (this.splash === 0 && (!this.target || !this.target.alive) && this.kind === 'bullet') {
      const ox = this.lastAimX - this.x;
      const oz = this.lastAimZ - this.z;
      if (ox * ox + oz * oz <= (this.speed * dt + px2w(4)) ** 2) {
        this.alive = false;
        return 'dead';
      }
    }

    return 'alive';
  }

  /** Nearest living enemy within 100 px (2.5 world units). */
  findRetarget(enemies: Enemy[]): Enemy | null {
    let best: Enemy | null = null;
    let bestD = 100 * 100; // px^2
    for (const e of enemies) {
      if (!e.alive) continue;
      const dx = e.x - this.x;
      const dz = e.z - this.z;
      const d = (dx * dx + dz * dz) * 1600; // back to px^2 (1 u = 40 px)
      if (d < bestD) {
        bestD = d;
        best = e;
      }
    }
    return best;
  }
}
