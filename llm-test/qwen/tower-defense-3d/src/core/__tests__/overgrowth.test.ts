// Buildable-area shrink (overgrowth): the harder the wave, the less area
// the player can build on. Deterministic, monotonic, fair (path +
// spawn/base stay clear, existing towers are preserved).

import { describe, expect, it } from 'vitest';
import { BASE, SPAWN, TOTAL_WAVES, overgrownFraction } from '../defs';
import { Grid } from '../grid';
import { eligibleOvergrownCells, initialEnemyPath, overgrownCellsForWave } from '../overgrowth';
import { Pathfinder } from '../pathfinder';
import { T_GRASS } from '../types';
import { createGame } from './helpers';

const key = (c: number, r: number) => r * 24 + c;

/** Advance the game to wave `n` through the public wave/overgrowth API. */
function advanceToWave(game: ReturnType<typeof createGame>['game'], n: number): void {
  while (game.waves.currentWave < n) {
    game.waves.startNextWave();
    game.applyOvergrowth();
    game.waves.active = false; // pretend the wave cleared so the next can start
  }
}

describe('overgrownFraction', () => {
  it('waves 1-2 keep the full buildable area', () => {
    expect(overgrownFraction(0)).toBe(0);
    expect(overgrownFraction(1)).toBe(0);
    expect(overgrownFraction(2)).toBe(0);
  });

  it('grows gradually and caps at 15%', () => {
    expect(overgrownFraction(3)).toBeGreaterThan(0);
    for (let w = 3; w < TOTAL_WAVES; w++) {
      expect(overgrownFraction(w + 1)).toBeGreaterThanOrEqual(overgrownFraction(w));
    }
    expect(overgrownFraction(12)).toBe(0.15);
    expect(overgrownFraction(TOTAL_WAVES)).toBe(0.15);
  });
});

describe('overgrownCellsForWave', () => {
  it('is deterministic (same wave -> same cells)', () => {
    expect(overgrownCellsForWave(10)).toEqual(overgrownCellsForWave(10));
    expect(overgrownCellsForWave(17)).toEqual(overgrownCellsForWave(17));
  });

  it('is empty in early waves, grows, and is monotonic (nested prefixes)', () => {
    expect(overgrownCellsForWave(1)).toEqual([]);
    const w5 = overgrownCellsForWave(5);
    const w10 = overgrownCellsForWave(10);
    const w12 = overgrownCellsForWave(12);
    const w20 = overgrownCellsForWave(20);
    expect(w5.length).toBeGreaterThan(0);
    expect(w10.length).toBeGreaterThan(w5.length);
    expect(w12.length).toBeGreaterThan(w10.length);
    expect(w20.length).toBe(w12.length); // capped at 15% from wave 12
    // w5 is a prefix of w10: every wave-5 cell is still overgrown at wave 10
    const set10 = new Set(w10.map((c) => key(c.c, c.r)));
    for (const c of w5) expect(set10.has(key(c.c, c.r))).toBe(true);
  });

  it('only ever claims eligible grass cells', () => {
    const eligible = new Set(eligibleOvergrownCells().map((c) => key(c.c, c.r)));
    for (const c of overgrownCellsForWave(20)) {
      expect(eligible.has(key(c.c, c.r))).toBe(true);
    }
  });
});

describe('eligibleOvergrownCells', () => {
  it('excludes the initial enemy path and the spawn/base neighbourhoods', () => {
    const grid = new Grid();
    const path = new Set(initialEnemyPath().map((p) => key(p.c, p.r)));
    const cells = eligibleOvergrownCells();
    expect(cells.length).toBeGreaterThan(200); // plenty of room to build
    for (const { c, r } of cells) {
      expect(grid.getTerrain(c, r)).toBe(T_GRASS);
      expect(path.has(key(c, r))).toBe(false);
      expect(Math.abs(c - SPAWN.c) <= 1 && Math.abs(r - SPAWN.r) <= 1).toBe(false);
      expect(Math.abs(c - BASE.c) <= 1 && Math.abs(r - BASE.r) <= 1).toBe(false);
    }
  });
});

describe('buildable-area shrink (game integration)', () => {
  it('buildable area shrinks as waves advance', () => {
    const { game } = createGame();
    game.start('normal');
    expect(game.grid.overgrownCount).toBe(0);
    advanceToWave(game, 6);
    const at6 = game.grid.overgrownCount;
    expect(at6).toBeGreaterThan(0);
    advanceToWave(game, 12);
    expect(game.grid.overgrownCount).toBeGreaterThan(at6);
    advanceToWave(game, 20);
    expect(game.grid.overgrownCount).toBe(overgrownCellsForWave(20).length);
  });

  it('rejects new placement on overgrown cells with a clear reason', () => {
    const { game } = createGame();
    game.start('normal');
    advanceToWave(game, 10);
    const cell = overgrownCellsForWave(10)[0];
    const res = game.canPlace('cannon', cell.c, cell.r);
    expect(res.ok).toBe(false);
    expect(res.reason).toContain('Overgrown');
    expect(game.grid.isBuildable(cell.c, cell.r)).toBe(false);
    // a non-overgrown grass cell still accepts towers
    const free = eligibleOvergrownCells().find((c) => !game.grid.isOvergrown(c.c, c.r))!;
    expect(game.canPlace('cannon', free.c, free.r).ok).toBe(true);
  });

  it('preserves existing towers when their cell becomes overgrown', () => {
    const { game } = createGame();
    game.start('normal');
    // build early on a cell that the forest claims by wave 10
    const future = overgrownCellsForWave(10)[0];
    game.setPlacing('cannon');
    expect(game.placeAt(future.c, future.r)).toBe(true);
    expect(game.towers.length).toBe(1);
    advanceToWave(game, 10);
    expect(game.grid.isOvergrown(future.c, future.r)).toBe(true);
    // the tower survives: still in the list, still on the grid
    expect(game.towers.length).toBe(1);
    expect(game.towers[0].c).toBe(future.c);
    expect(game.towers[0].r).toBe(future.r);
    expect(game.grid.towerAtCell(future.c, future.r)).not.toBeNull();
    // but no NEW tower can be placed on that cell
    expect(game.canPlace('cannon', future.c, future.r).ok).toBe(false);
  });

  it('keeps the enemy path walkable after overgrowth', () => {
    const { game } = createGame();
    game.start('normal');
    advanceToWave(game, 20);
    expect(game.pathfinder.hasPath(game.grid, SPAWN.c, SPAWN.r, BASE.c, BASE.r)).toBe(true);
  });

  it('startWaveEarly applies overgrowth when the wave begins', () => {
    const { game } = createGame();
    game.start('normal');
    game.startWaveEarly(); // wave 1
    expect(game.waves.currentWave).toBe(1);
    expect(game.grid.overgrownCount).toBe(0);
    const clearAndStart = () => {
      game.waves.eventIndex = game.waves.events.length;
      game.enemies = [];
      game.checkWaveEnd(); // wave cleared -> countdown
      game.startWaveEarly();
    };
    clearAndStart(); // wave 2
    expect(game.grid.overgrownCount).toBe(0);
    clearAndStart(); // wave 3 -> overgrowth kicks in
    expect(game.grid.overgrownCount).toBeGreaterThan(0);
  });

  it('reset clears overgrowth for a fresh game', () => {
    const { game } = createGame();
    game.start('normal');
    advanceToWave(game, 10);
    expect(game.grid.overgrownCount).toBeGreaterThan(0);
    game.reset('normal');
    expect(game.grid.overgrownCount).toBe(0);
  });
});
