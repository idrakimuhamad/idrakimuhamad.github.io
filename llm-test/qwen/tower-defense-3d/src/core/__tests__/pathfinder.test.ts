import { describe, expect, it } from 'vitest';
import { BASE, SPAWN } from '../defs';
import { Grid } from '../grid';
import { Pathfinder } from '../pathfinder';

function make() {
  const grid = new Grid();
  const pf = new Pathfinder(24, 16);
  return { grid, pf };
}

describe('A* pathfinder', () => {
  it('finds the shortest path spawn -> base on the stock map', () => {
    const { grid, pf } = make();
    const path = pf.findPath(grid, SPAWN.c, SPAWN.r, BASE.c, BASE.r);
    expect(path).not.toBeNull();
    expect(path![0]).toEqual({ c: 0, r: 8 });
    expect(path![path!.length - 1]).toEqual({ c: 23, r: 8 });
    // Manhattan distance 23 + 2-step detour around rock (8,8) = 25 steps = 26 cells
    expect(path!.length).toBe(26);
  });

  it('path never crosses rocks or water', () => {
    const { grid, pf } = make();
    const path = pf.findPath(grid, SPAWN.c, SPAWN.r, BASE.c, BASE.r)!;
    for (const cell of path) {
      const t = grid.getTerrain(cell.c, cell.r);
      expect(t).not.toBe(1); // rock
      expect(t).not.toBe(2); // water
    }
    expect(path.some((c) => c.c === 8 && c.r === 8)).toBe(false);
  });

  it('returns null when the base is fully walled off', () => {
    const { grid, pf } = make();
    // base (23,8) neighbors: (22,8), (23,7), (23,9)
    const blocked = new Set<number>([8 * 24 + 22, 7 * 24 + 23, 9 * 24 + 23]);
    expect(pf.hasPath(grid, SPAWN.c, SPAWN.r, BASE.c, BASE.r, blocked)).toBe(false);
  });

  it('re-routes around a placed tower', () => {
    const { grid, pf } = make();
    grid.placeTower(10, 8, 'cannon', 1);
    const path = pf.findPath(grid, SPAWN.c, SPAWN.r, BASE.c, BASE.r);
    expect(path).not.toBeNull();
    expect(path!.some((c) => c.c === 10 && c.r === 8)).toBe(false);
  });

  it('reRoute() helper works from any cell', () => {
    const { grid, pf } = make();
    const path = pf.reRoute(grid, { c: 5, r: 5 }, BASE);
    expect(path).not.toBeNull();
    expect(path![0]).toEqual({ c: 5, r: 5 });
    expect(path![path!.length - 1]).toEqual({ c: 23, r: 8 });
  });

  it('counts ops', () => {
    const { grid, pf } = make();
    pf.resetOps();
    pf.findPath(grid, SPAWN.c, SPAWN.r, BASE.c, BASE.r);
    pf.findPath(grid, SPAWN.c, SPAWN.r, BASE.c, BASE.r);
    expect(pf.opsCount).toBe(2);
  });
});
