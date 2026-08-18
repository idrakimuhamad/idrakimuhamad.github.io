// Grid: 24x16 terrain + tower occupancy. Port of 2D `he`.
// World units: cell (c, r) occupies x ∈ [c, c+1), z ∈ [r, r+1).

import { BASE, COLS, ROWS, SPAWN, TERRAIN_CELLS } from './defs';
import { T_BASE, T_GRASS, T_ROCK, T_SPAWN } from './types';
import type { Cell } from './types';

export interface TowerRef { kind: string; id: number }

export class Grid {
  readonly cols = COLS;
  readonly rows = ROWS;
  terrain: number[] = [];
  towerAt: (TowerRef | null)[] = [];

  constructor() {
    this.reset();
  }

  idx(c: number, r: number): number {
    return r * this.cols + c;
  }

  inBounds(c: number, r: number): boolean {
    return c >= 0 && r >= 0 && c < this.cols && r < this.rows;
  }

  reset(): void {
    this.terrain = new Array(this.cols * this.rows).fill(T_GRASS);
    this.towerAt = new Array(this.cols * this.rows).fill(null);
    for (const cell of TERRAIN_CELLS) {
      if (this.inBounds(cell.c, cell.r)) this.terrain[this.idx(cell.c, cell.r)] = cell.t;
    }
    this.terrain[this.idx(SPAWN.c, SPAWN.r)] = T_SPAWN;
    this.terrain[this.idx(BASE.c, BASE.r)] = T_BASE;
  }

  getTerrain(c: number, r: number): number {
    return this.inBounds(c, r) ? this.terrain[this.idx(c, r)] : T_ROCK;
  }

  isWalkable(c: number, r: number): boolean {
    if (!this.inBounds(c, r)) return false;
    const i = this.idx(c, r);
    if (this.towerAt[i] !== null) return false;
    const t = this.terrain[i];
    return t === T_GRASS || t === T_SPAWN || t === T_BASE;
  }

  isBuildable(c: number, r: number): boolean {
    if (!this.inBounds(c, r)) return false;
    const i = this.idx(c, r);
    return this.terrain[i] === T_GRASS && this.towerAt[i] === null;
  }

  placeTower(c: number, r: number, kind: string, id: number): void {
    this.towerAt[this.idx(c, r)] = { kind, id };
  }

  removeTower(c: number, r: number): void {
    this.towerAt[this.idx(c, r)] = null;
  }

  towerAtCell(c: number, r: number): TowerRef | null {
    return this.inBounds(c, r) ? this.towerAt[this.idx(c, r)] : null;
  }

  /** Cell center in world units (2D: c*40+20, r*40+20). */
  cellCenter(c: number, r: number): { x: number; z: number } {
    return { x: c + 0.5, z: r + 0.5 };
  }

  /** World point -> cell (2D: floor(x/40), floor(y/40)). */
  cellFromPoint(x: number, z: number): Cell {
    return { c: Math.floor(x), r: Math.floor(z) };
  }
}
