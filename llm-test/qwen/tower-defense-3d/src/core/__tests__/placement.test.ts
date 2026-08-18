import { describe, expect, it } from 'vitest';
import { createGame } from './helpers';

describe('canPlace / placeAt', () => {
  it('rejects out of bounds', () => {
    const { game } = createGame();
    game.start('normal');
    expect(game.canPlace('cannon', -1, 5).ok).toBe(false);
    expect(game.canPlace('cannon', 24, 5).ok).toBe(false);
    expect(game.canPlace('cannon', 5, -1).ok).toBe(false);
    expect(game.canPlace('cannon', 5, 16).ok).toBe(false);
  });

  it('rejects rock and water terrain', () => {
    const { game } = createGame();
    game.start('normal');
    const rock = game.canPlace('cannon', 8, 8);
    expect(rock.ok).toBe(false);
    expect(rock.reason).toBe('Cannot build on this terrain');
    const water = game.canPlace('cannon', 6, 3);
    expect(water.ok).toBe(false);
    expect(water.reason).toBe('Cannot build on this terrain');
  });

  it('rejects occupied cells', () => {
    const { game } = createGame();
    game.start('normal');
    game.setPlacing('cannon');
    expect(game.placeAt(10, 5)).toBe(true);
    const res = game.canPlace('cannon', 10, 5);
    expect(res.ok).toBe(false);
    expect(res.reason).toBe('Cell already occupied');
  });

  it('rejects when money is insufficient', () => {
    const { game } = createGame();
    game.start('normal');
    game.economy.money = 50;
    const res = game.canPlace('cannon', 10, 5);
    expect(res.ok).toBe(false);
    expect(res.reason).toBe('Not enough money ($70)');
  });

  it('rejects a placement that would block the path', () => {
    const { game } = createGame();
    game.start('normal');
    game.setPlacing('cannon');
    // wall the base off from two sides first (both legal placements)
    expect(game.placeAt(23, 7)).toBe(true);
    expect(game.placeAt(23, 9)).toBe(true);
    const res = game.canPlace('cannon', 22, 8);
    expect(res.ok).toBe(false);
    expect(res.reason).toBe('Would block the enemy path');
    // and the placement itself must fail
    expect(game.placeAt(22, 8)).toBe(false);
  });

  it('accepts valid grass and places the tower', () => {
    const { game } = createGame();
    game.start('normal');
    game.setPlacing('cannon');
    const moneyBefore = game.economy.money;
    expect(game.placeAt(10, 5)).toBe(true);
    expect(game.economy.money).toBe(moneyBefore - 70);
    expect(game.towers.length).toBe(1);
    expect(game.towers[0].kind).toBe('cannon');
    expect(game.grid.towerAtCell(10, 5)).not.toBeNull();
    expect(game.stats.data.towersBuilt).toBe(1);
  });

  it('placeAt without a selection returns false', () => {
    const { game } = createGame();
    game.start('normal');
    expect(game.placeAt(10, 5)).toBe(false);
  });

  it('selling a tower re-opens the path and refunds 70%', () => {
    const { game } = createGame();
    game.start('normal');
    game.setPlacing('cannon');
    expect(game.placeAt(10, 5)).toBe(true);
    game.selectTower(game.towers[0]);
    const moneyBefore = game.economy.money;
    game.sellSelected();
    expect(game.economy.money).toBe(moneyBefore + 49); // floor(70 * 0.7)
    expect(game.towers.length).toBe(0);
    expect(game.grid.towerAtCell(10, 5)).toBeNull();
  });

  it('placement re-routes live enemies around the new tower', () => {
    const { game } = createGame();
    game.start('normal');
    // spawn a basic enemy and let it walk a bit
    game.debugSpawnEnemy('basic');
    for (let i = 0; i < 120; i++) game.step(1 / 120); // 1s
    const enemy = game.enemies[0];
    expect(enemy).toBeDefined();
    // place a tower on the row-8 corridor ahead of it
    game.setPlacing('cannon');
    expect(game.placeAt(10, 8)).toBe(true);
    // enemy's path must now avoid the tower cell
    expect(enemy.path.some((c) => c.c === 10 && c.r === 8)).toBe(false);
    // and must still reach the base
    expect(enemy.path[enemy.path.length - 1]).toEqual({ c: 23, r: 8 });
  });
});
