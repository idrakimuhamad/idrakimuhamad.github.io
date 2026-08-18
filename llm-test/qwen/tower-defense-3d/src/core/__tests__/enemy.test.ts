import { describe, expect, it } from 'vitest';
import { px2w } from '../defs';
import { Enemy } from '../enemy';

describe('enemy', () => {
  it('HP scaling rounds baseHp * mult', () => {
    const e = new Enemy('basic', 0.5, 8.5, 1.18);
    expect(e.maxHp).toBe(118); // round(100 * 1.18)
    expect(e.hp).toBe(118);
  });

  it('flat armor: min 1 damage', () => {
    const e = new Enemy('armored', 0.5, 8.5, 1);
    expect(e.takeDamage(5)).toBe(1); // max(1, 5 - 6)
    expect(e.takeDamage(10)).toBe(4); // 10 - 6
    const basic = new Enemy('basic', 0.5, 8.5, 1);
    expect(basic.takeDamage(34)).toBe(34);
  });

  it('slow takes max of factors and refreshes max of timers (no stacking)', () => {
    const e = new Enemy('basic', 0.5, 8.5, 1);
    e.applySlow(0.3, 1.6);
    expect(e.slowFactor).toBe(0.3);
    expect(e.slowTimer).toBe(1.6);
    e.applySlow(0.2, 2.0); // weaker but longer
    expect(e.slowFactor).toBe(0.3); // max, not stacked
    expect(e.slowTimer).toBe(2.0);
    e.applySlow(0.4, 1.0); // stronger but shorter
    expect(e.slowFactor).toBe(0.4);
    expect(e.slowTimer).toBe(2.0);
    expect(e.speed).toBeCloseTo(e.baseSpeed * 0.6);
    expect(e.isSlowed).toBe(true);
    // zero factor is a no-op
    e.applySlow(0, 5);
    expect(e.slowFactor).toBe(0.4);
  });

  it('slow expires after its timer', () => {
    const e = new Enemy('basic', 0.5, 8.5, 1);
    e.applySlow(0.3, 1.0);
    e.move(0.5);
    expect(e.isSlowed).toBe(true);
    e.move(0.6);
    expect(e.slowFactor).toBe(0);
    expect(e.isSlowed).toBe(false);
    expect(e.speed).toBe(e.baseSpeed);
  });

  it('regen only after the no-damage delay', () => {
    const e = new Enemy('regen', 0.5, 8.5, 1);
    expect(e.maxHp).toBe(180);
    e.takeDamage(40);
    expect(e.hp).toBe(140);
    // immediately after damage: no regen
    const hpBefore = e.hp;
    e.move(0.1);
    expect(e.hp).toBe(hpBefore);
    // after 2.2s without damage: 26 hp/s
    e.lastDamageTime = e.age - 2.3;
    e.move(1.0);
    expect(e.hp).toBeCloseTo(140 + 26, 5);
    // capped at maxHp
    e.hp = 179;
    e.lastDamageTime = e.age - 3;
    e.move(1.0);
    expect(e.hp).toBe(180);
  });

  it('hit flash decays', () => {
    const e = new Enemy('basic', 0.5, 8.5, 1);
    e.takeDamage(10);
    expect(e.hitFlash).toBe(0.12);
    e.move(0.1);
    expect(e.hitFlash).toBeLessThan(0.03);
    e.move(0.1);
    expect(e.hitFlash).toBeLessThanOrEqual(0);
  });

  it('walks cell-center to cell-center and reaches the base (leak)', () => {
    const e = new Enemy('basic', 0.5, 8.5, 1);
    e.setPath([{ c: 0, r: 8 }, { c: 1, r: 8 }, { c: 2, r: 8 }]);
    // speed = 55 px/s = 1.375 u/s
    expect(e.speed).toBeCloseTo(px2w(55));
    // 0.7s moves 0.9625 u < 1 cell, so still on segment 1
    expect(e.move(0.7)).toBe(false);
    expect(e.x).toBeCloseTo(0.5 + 1.375 * 0.7);
    expect(e.z).toBeCloseTo(8.5);
    expect(e.pathIndex).toBe(1);
    // then enough time to cross both remaining cells
    expect(e.move(1)).toBe(true); // reaches end of path
    expect(e.reachedBase).toBe(true);
    expect(e.x).toBeCloseTo(2.5);
    expect(e.progress).toBeCloseTo(2, 5);
  });

  it('currentCell clamps to the grid', () => {
    const e = new Enemy('basic', -0.2, 0.3, 1);
    expect(e.currentCell()).toEqual({ c: 0, r: 0 });
    e.x = 23.9;
    e.z = 15.9;
    expect(e.currentCell()).toEqual({ c: 23, r: 15 });
  });

  it('dead enemies do not move or take damage', () => {
    const e = new Enemy('basic', 0.5, 8.5, 1);
    e.takeDamage(999);
    expect(e.alive).toBe(false);
    expect(e.takeDamage(10)).toBe(0);
    expect(e.move(1)).toBe(false);
  });
});
