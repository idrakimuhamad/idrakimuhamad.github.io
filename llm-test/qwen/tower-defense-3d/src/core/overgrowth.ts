// Overgrowth: the deterministic, wave-scaled buildable-area shrink.
//
// As waves advance the forest reclaims the map: overgrownCellsForWave(n)
// returns the set of grass cells that are overgrown at the start of wave n.
// The set is:
//   * deterministic (seeded mulberry32 — identical on every load),
//   * monotonic (a cell overgrown at wave n stays overgrown at wave n+1),
//   * fair (never touches the initial enemy path or the spawn/base area,
//     and overgrown cells stay WALKABLE, so the enemy route is never cut
//     and the game stays winnable).

import { BASE, COLS, OVERGROWN_SEED, ROWS, SPAWN, overgrownFraction } from './defs';
import { Grid } from './grid';
import { Pathfinder } from './pathfinder';
import { mulberry32 } from './prng';
import type { Cell } from './types';
import { T_GRASS } from './types';

export interface OvergrownCell { c: number; r: number }

/** The initial (no-tower) enemy path from SPAWN to BASE. */
export function initialEnemyPath(): Cell[] {
  const grid = new Grid();
  return new Pathfinder(COLS, ROWS).findPath(grid, SPAWN.c, SPAWN.r, BASE.c, BASE.r) ?? [];
}

/**
 * Grass cells eligible for overgrowth: not on the initial enemy path and
 * not within 1 cell of the spawn or the base.
 */
export function eligibleOvergrownCells(): OvergrownCell[] {
  const grid = new Grid();
  const onPath = new Set(initialEnemyPath().map((p) => p.r * COLS + p.c));
  const out: OvergrownCell[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid.getTerrain(c, r) !== T_GRASS) continue;
      if (onPath.has(r * COLS + c)) continue;
      if (Math.abs(c - SPAWN.c) <= 1 && Math.abs(r - SPAWN.r) <= 1) continue;
      if (Math.abs(c - BASE.c) <= 1 && Math.abs(r - BASE.r) <= 1) continue;
      out.push({ c, r });
    }
  }
  return out;
}

/**
 * The overgrown set at the start of wave `n`: the first
 * `floor(fraction(n) * N)` cells of a seeded shuffle of the eligible cells.
 * Deterministic and monotonic in `n` (nested prefixes of one fixed order).
 */
export function overgrownCellsForWave(wave: number): OvergrownCell[] {
  const frac = overgrownFraction(wave);
  if (frac <= 0) return [];
  const eligible = eligibleOvergrownCells();
  const order = eligible.slice();
  const rand = mulberry32(OVERGROWN_SEED);
  // Seeded Fisher–Yates: identical order on every load.
  for (let i = order.length - 1; i > 0; i--) {
    const j = (rand() * (i + 1)) | 0;
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order.slice(0, Math.floor(frac * eligible.length));
}
