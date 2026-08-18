// Tower state: levels, targeting, cooldowns. Port of 2D `pe`.
// Range/speed converted from px to world units via px2w.

import { TOWERS, px2w } from './defs';
import type { Enemy } from './enemy';
import type { TargetMode, TowerKind } from './types';

let nextId = 1;

export interface TowerUpdateResult { fired: boolean; target: Enemy | null }

export class Tower {
  id: number;
  kind: TowerKind;
  def: (typeof TOWERS)[TowerKind];
  c: number;
  r: number;
  x: number;
  z: number;
  level = 0;
  targetMode: TargetMode = 'first';
  cooldown = 0;
  angle = 0;
  invested: number;
  stats = { damageDealt: 0, kills: 0 };
  currentTarget: Enemy | null = null;
  flash = 0;

  constructor(kind: TowerKind, c: number, r: number) {
    this.id = nextId++;
    this.kind = kind;
    this.def = TOWERS[kind];
    this.c = c;
    this.r = r;
    this.x = c + 0.5;
    this.z = r + 0.5;
    this.invested = this.def.levels[0].cost;
  }

  get L(): (typeof TOWERS)[TowerKind]['levels'][number] {
    return this.def.levels[this.level];
  }

  get maxLevel(): number {
    return this.def.levels.length - 1;
  }

  get canUpgrade(): boolean {
    return this.level < this.maxLevel;
  }

  get upgradeCost(): number {
    return this.canUpgrade ? this.def.levels[this.level + 1].cost : 0;
  }

  get sellValue(): number {
    return Math.floor(this.invested * 0.7);
  }

  upgrade(): boolean {
    if (!this.canUpgrade) return false;
    this.invested += this.upgradeCost;
    this.level++;
    return true;
  }

  pickTarget(candidates: Enemy[]): Enemy | null {
    if (candidates.length === 0) return null;
    switch (this.targetMode) {
      case 'first': {
        let best: Enemy | null = null;
        for (const e of candidates) if (!best || e.progress > best.progress) best = e;
        return best;
      }
      case 'last': {
        let best: Enemy | null = null;
        for (const e of candidates) if (!best || e.progress < best.progress) best = e;
        return best;
      }
      case 'closest': {
        let best: Enemy | null = null;
        let bestD = Infinity;
        for (const e of candidates) {
          const d = (e.x - this.x) ** 2 + (e.z - this.z) ** 2;
          if (d < bestD) { bestD = d; best = e; }
        }
        return best;
      }
      case 'strongest': {
        let best: Enemy | null = null;
        for (const e of candidates) if (!best || e.hp > best.hp) best = e;
        return best;
      }
      case 'weakest': {
        let best: Enemy | null = null;
        for (const e of candidates) if (!best || e.hp < best.hp) best = e;
        return best;
      }
    }
    return null;
  }

  update(dt: number, enemies: Enemy[]): TowerUpdateResult {
    this.currentTarget = null;
    if (this.flash > 0) this.flash -= dt;
    if (this.cooldown > 0) this.cooldown -= dt;

    const range = px2w(this.L.range);
    const rangeSq = range * range;
    const candidates: Enemy[] = [];
    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      if (!e.alive) continue;
      const dx = e.x - this.x;
      const dz = e.z - this.z;
      if (dx * dx + dz * dz <= rangeSq) candidates.push(e);
    }
    if (candidates.length === 0) return { fired: false, target: null };

    const target = this.pickTarget(candidates);
    if (!target) return { fired: false, target: null };
    this.currentTarget = target;
    this.angle = Math.atan2(target.z - this.z, target.x - this.x);
    if (this.cooldown <= 0) {
      this.cooldown = 1 / this.L.fireRate;
      this.flash = 0.08;
      return { fired: true, target };
    }
    return { fired: false, target };
  }
}
