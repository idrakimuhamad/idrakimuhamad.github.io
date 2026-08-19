// Forest layout: determinism (seeded PRNG), playfield clearance, and the
// density level of the KayKit-style forest (border + inner ring + shore).

import { describe, expect, it } from 'vitest';
import { BASE, COLS, ROWS, SPAWN } from '../../core/defs';
import {
  borderPlacements,
  innerRingPlacements,
  mulberry32,
  propPlacements,
  waterEdgePlacements,
} from '../forest';

const SEED = 0x5eed; // must match the Forest constructor

function allTrees() {
  const rand = mulberry32(SEED);
  return [...borderPlacements(rand), ...innerRingPlacements(rand), ...waterEdgePlacements(rand)];
}

function allProps(): { key: string; x: number; z: number }[] {
  const rand = mulberry32(SEED);
  // consume the tree placement stream first, like the Forest constructor
  borderPlacements(rand);
  innerRingPlacements(rand);
  waterEdgePlacements(rand);
  const props = propPlacements(rand);
  const out: { key: string; x: number; z: number }[] = [];
  for (const [key, placements] of props) for (const p of placements) out.push({ key, x: p.x, z: p.z });
  return out;
}

describe('forest layout', () => {
  it('is deterministic: same seed -> identical placements', () => {
    const a = allTrees();
    const b = allTrees();
    expect(a).toEqual(b);
    const pa = allProps();
    const pb = allProps();
    expect(pa).toEqual(pb);
  });

  it('keeps spawn and base clear of props', () => {
    for (const p of allProps()) {
      const c = Math.floor(p.x);
      const r = Math.floor(p.z);
      expect(Math.abs(c - SPAWN.c) <= 1 && Math.abs(r - SPAWN.r) <= 1).toBe(false);
      expect(Math.abs(c - BASE.c) <= 1 && Math.abs(r - BASE.r) <= 1).toBe(false);
    }
  });

  it('keeps the border/inner rings outside the walkable grid', () => {
    const rand = mulberry32(SEED);
    for (const t of [...borderPlacements(rand), ...innerRingPlacements(rand)]) {
      const outside = t.x < -0.01 || t.x > COLS + 0.01 || t.z < -0.01 || t.z > ROWS + 0.01;
      expect(outside, `ring tree at (${t.x.toFixed(2)}, ${t.z.toFixed(2)}) is on the grid`).toBe(true);
    }
  });

  it('is a dense forest: ~90 trees, varied canopy, 20+ props', () => {
    const trees = allTrees();
    expect(trees.length).toBeGreaterThanOrEqual(70);
    expect(trees.length).toBeLessThanOrEqual(130);
    const heights = trees.map((t) => t.scale);
    // mixed ages: saplings and tall specimens both present
    expect(Math.min(...heights)).toBeLessThan(1.2);
    expect(Math.max(...heights)).toBeGreaterThan(3.5);
    expect(allProps().length).toBeGreaterThanOrEqual(20);
  });
});
