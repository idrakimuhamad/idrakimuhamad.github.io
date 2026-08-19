// Forest layout: determinism (seeded PRNG), playfield clearance, and the
// density level of the KayKit-style forest (border + inner + mid rings + shore).

import { describe, expect, it } from 'vitest';
import { BASE, COLS, ROWS, SPAWN } from '../../core/defs';
import {
  borderPlacements,
  innerRingPlacements,
  midRingPlacements,
  mulberry32,
  propPlacements,
  waterEdgePlacements,
} from '../forest';

const SEED = 0x5eed; // must match the Forest constructor

function allTrees() {
  const rand = mulberry32(SEED);
  return [
    ...borderPlacements(rand),
    ...innerRingPlacements(rand),
    ...midRingPlacements(rand),
    ...waterEdgePlacements(rand),
  ];
}

function allProps(): { key: string; x: number; z: number }[] {
  const rand = mulberry32(SEED);
  // consume the tree placement stream first, like the Forest constructor
  borderPlacements(rand);
  innerRingPlacements(rand);
  midRingPlacements(rand);
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

  it('keeps the border/inner/mid rings outside the walkable grid', () => {
    const rand = mulberry32(SEED);
    for (const t of [...borderPlacements(rand), ...innerRingPlacements(rand), ...midRingPlacements(rand)]) {
      const outside = t.x < -0.01 || t.x > COLS + 0.01 || t.z < -0.01 || t.z > ROWS + 0.01;
      expect(outside, `ring tree at (${t.x.toFixed(2)}, ${t.z.toFixed(2)}) is on the grid`).toBe(true);
    }
  });

  it('is a lush forest wall: ~220 trees, varied canopy, 40+ props', () => {
    const trees = allTrees();
    expect(trees.length).toBeGreaterThanOrEqual(180);
    expect(trees.length).toBeLessThanOrEqual(280);
    const heights = trees.map((t) => t.scale);
    // mixed ages: saplings and tall specimens both present
    expect(Math.min(...heights)).toBeLessThan(1.0);
    expect(Math.max(...heights)).toBeGreaterThan(4.0);
    expect(allProps().length).toBeGreaterThanOrEqual(40);
  });

  it('has a dense border: far-edge spacing ~1.1u (overlapping canopy)', () => {
    const rand = mulberry32(SEED);
    const border = borderPlacements(rand);
    // Far edge: trees along z ≈ -2.4 spanning x ∈ [-2.4, 26.4] (28.8u).
    // Step 1.1 -> ~27 trees on that edge alone; the whole border is ~85.
    const farEdge = border.filter((t) => t.z < -2.0);
    expect(farEdge.length).toBeGreaterThanOrEqual(24);
    expect(border.length).toBeGreaterThanOrEqual(80);
  });

  it('has three rings at 2.4u / 1.8u / 1.2u margins, each a full loop', () => {
    const rand = mulberry32(SEED);
    const rings: Array<[string, number, ReturnType<typeof borderPlacements>]> = [
      ['border', 2.4, borderPlacements(rand)],
      ['mid', 1.8, midRingPlacements(rand)],
      ['inner', 1.2, innerRingPlacements(rand)],
    ];
    for (const [name, margin, ring] of rings) {
      expect(ring.length, `${name} ring is empty`).toBeGreaterThan(30);
      const onFar = ring.some((t) => t.z < -0.5);
      const onNear = ring.some((t) => t.z > ROWS + 0.5);
      const onLeft = ring.some((t) => t.x < -0.5);
      const onRight = ring.some((t) => t.x > COLS + 0.5);
      expect(onFar && onNear && onLeft && onRight, `${name} ring missing an edge`).toBe(true);
      // Every tree sits in its ring's margin band (line margin ± jitter).
      for (const t of ring) {
        const beyond = Math.max(-t.x, t.x - COLS, -t.z, t.z - ROWS);
        expect(beyond, `${name} tree at (${t.x.toFixed(2)}, ${t.z.toFixed(2)})`)
          .toBeGreaterThan(margin - 1.0);
        expect(beyond).toBeLessThan(margin + 1.0);
      }
    }
  });
});
