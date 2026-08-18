// Enemy state: hp, slow, regen, path following. Port of 2D `ge`.
// Positions in world units (x, z); speeds converted from px/s via px2w.

import { ENEMIES, px2w } from './defs';
import type { Cell, EnemyKind } from './types';

let nextId = 1;

export class Enemy {
  id: number;
  kind: EnemyKind;
  def: (typeof ENEMIES)[EnemyKind];
  x: number;
  z: number;
  hp: number;
  maxHp: number;
  baseSpeed: number; // world units/s
  slowFactor = 0;
  slowTimer = 0;
  lastDamageTime = -999;
  age = 0;
  path: Cell[] = [];
  pathIndex = 0;
  progress = 0;
  alive = true;
  reachedBase = false;
  hitFlash = 0;
  damageTaken = 0;

  constructor(kind: EnemyKind, x: number, z: number, hpMult: number) {
    this.id = nextId++;
    this.kind = kind;
    this.def = ENEMIES[kind];
    this.x = x;
    this.z = z;
    this.maxHp = Math.round(this.def.baseHp * hpMult);
    this.hp = this.maxHp;
    this.baseSpeed = px2w(this.def.speed);
  }

  get speed(): number {
    return this.baseSpeed * (1 - this.slowFactor);
  }

  get isSlowed(): boolean {
    return this.slowFactor > 0.01 && this.slowTimer > 0;
  }

  get isRegenerating(): boolean {
    return this.def.regen > 0 && this.alive && this.age - this.lastDamageTime > this.def.regenDelay && this.hp < this.maxHp;
  }

  /** Returns actual damage applied (after armor). */
  takeDamage(dmg: number): number {
    if (!this.alive) return 0;
    let d = dmg;
    if (this.def.armorType === 'flat') d = Math.max(1, d - this.def.armor);
    else d = dmg * (1 - this.def.armorPct);
    this.hp -= d;
    this.damageTaken += d;
    this.lastDamageTime = this.age;
    this.hitFlash = 0.12;
    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
    }
    return d;
  }

  /** Slow takes the max of factors and refreshes the max of timers (never stacks). */
  applySlow(factor: number, dur: number): void {
    if (factor <= 0) return;
    this.slowFactor = Math.max(this.slowFactor, factor);
    this.slowTimer = Math.max(this.slowTimer, dur);
  }

  setPath(path: Cell[]): void {
    this.path = path;
    this.pathIndex = Math.min(1, path.length - 1);
    if (path.length <= 1) this.pathIndex = 0;
  }

  currentCell(): Cell {
    return {
      c: Math.max(0, Math.min(23, Math.floor(this.x))),
      r: Math.max(0, Math.min(15, Math.floor(this.z))),
    };
  }

  /** Walk along the path. Returns true when the base is reached (leak). */
  move(dt: number): boolean {
    if (!this.alive) return false;
    this.age += dt;
    if (this.slowTimer > 0) {
      this.slowTimer -= dt;
      if (this.slowTimer <= 0) {
        this.slowTimer = 0;
        this.slowFactor = 0;
      }
    }
    if (this.hitFlash > 0) this.hitFlash -= dt;
    if (this.def.regen > 0 && this.alive && this.age - this.lastDamageTime > this.def.regenDelay) {
      this.hp = Math.min(this.maxHp, this.hp + this.def.regen * dt);
    }

    let remaining = this.speed * dt;
    let guard = 0;
    while (remaining > 0 && guard++ < 64) {
      if (this.pathIndex >= this.path.length) return (this.reachedBase = true);
      const cell = this.path[this.pathIndex];
      const tx = cell.c + 0.5;
      const tz = cell.r + 0.5;
      const dx = tx - this.x;
      const dz = tz - this.z;
      const dist = Math.hypot(dx, dz);
      if (dist <= remaining) {
        this.x = tx;
        this.z = tz;
        this.progress += dist;
        remaining -= dist;
        this.pathIndex++;
        if (this.pathIndex >= this.path.length) return (this.reachedBase = true);
      } else {
        this.x += (dx / dist) * remaining;
        this.z += (dz / dist) * remaining;
        this.progress += remaining;
        remaining = 0;
      }
    }
    return false;
  }
}
