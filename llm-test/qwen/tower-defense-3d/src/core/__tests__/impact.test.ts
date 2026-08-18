import { describe, expect, it } from 'vitest';
import { px2w } from '../defs';
import { Enemy } from '../enemy';
import { Projectile } from '../projectile';
import { createGame } from './helpers';

function enemyAt(x: number, z: number, hp = 100): Enemy {
  const e = new Enemy('basic', x, z, 1);
  e.hp = hp;
  e.maxHp = Math.max(hp, e.maxHp);
  return e;
}

describe('splash impact (game.onProjectileImpact)', () => {
  it('applies damage * (1 - 0.5 * dist/splash) falloff to all enemies in radius', () => {
    const { game } = createGame();
    game.start('normal');
    const splash = px2w(46); // cannon L1 = 1.15 u
    // impact center (3.5, 5.5)
    const near = enemyAt(4.5, 5.5); // 1.0 u from center
    const far = enemyAt(4.9, 5.5); // 1.4 u > splash
    const mid = enemyAt(4.0, 5.5); // 0.5 u from center
    game.enemies.push(near, far, mid);

    const p = new Projectile({
      x: 3.5, z: 5.5, tx: 3.5, tz: 5.5,
      speed: 8.5, damage: 34, splash, slow: 0, slowDur: 0,
      kind: 'shell', color: '#fff', towerKind: 'cannon', target: near, towerId: 999,
    });
    game.onProjectileImpact(p);

    const nearDmg = 100 - near.hp;
    expect(nearDmg).toBeCloseTo(34 * (1 - 0.5 * (1.0 / splash)), 5);
    expect(far.hp).toBe(100); // outside radius, untouched
    const midDmg = 100 - mid.hp;
    expect(midDmg).toBeCloseTo(34 * (1 - 0.5 * (0.5 / splash)), 5);
  });

  it('frost direct hit applies slow and damage', () => {
    const { game } = createGame();
    game.start('normal');
    const target = enemyAt(5, 5);
    game.enemies.push(target);
    const p = new Projectile({
      x: 4.8, z: 5, tx: 5, tz: 5,
      speed: 10.5, damage: 6, splash: 0, slow: 0.3, slowDur: 1.6,
      kind: 'frost', color: '#fff', towerKind: 'frost', target, towerId: 999,
    });
    game.onProjectileImpact(p);
    expect(target.slowFactor).toBe(0.3);
    expect(target.slowTimer).toBe(1.6);
    expect(target.hp).toBe(94);
  });

  it('kills award reward, score and tower stats', () => {
    const { game } = createGame();
    game.start('normal');
    game.setPlacing('cannon');
    game.placeAt(10, 5);
    const tower = game.towers[0];
    const target = enemyAt(10.5, 5.5, 30);
    game.enemies.push(target);
    const moneyBefore = game.economy.money;
    const p = new Projectile({
      x: 10.5, z: 5.4, tx: 10.5, tz: 5.5,
      speed: 8.5, damage: 34, splash: 0, slow: 0, slowDur: 0,
      kind: 'shell', color: '#fff', towerKind: 'cannon', target, towerId: tower.id,
    });
    game.onProjectileImpact(p);
    expect(target.alive).toBe(false);
    expect(game.economy.money - moneyBefore).toBe(12);
    expect(game.stats.data.enemiesDefeated).toBe(1);
    expect(game.stats.data.score).toBe(10);
    expect(tower.stats.kills).toBe(1);
    // 2D-faithful: stats accumulate the full (uncapped) damage value
    expect(tower.stats.damageDealt).toBe(34);
  });

  it('splash kill counts for the tower', () => {
    const { game } = createGame();
    game.start('normal');
    game.setPlacing('cannon');
    game.placeAt(10, 5);
    const tower = game.towers[0];
    const a = enemyAt(10.5, 5.5, 20);
    const b = enemyAt(10.9, 5.5, 20);
    game.enemies.push(a, b);
    const p = new Projectile({
      x: 10.5, z: 5.5, tx: 10.5, tz: 5.5,
      speed: 8.5, damage: 34, splash: px2w(46), slow: 0, slowDur: 0,
      kind: 'shell', color: '#fff', towerKind: 'cannon', target: a, towerId: tower.id,
    });
    game.onProjectileImpact(p);
    expect(a.alive).toBe(false);
    expect(b.alive).toBe(false); // 0.4 u away, within 1.15 u splash
    expect(tower.stats.kills).toBe(2);
  });
});

describe('leak and base damage', () => {
  it('leaked enemy damages the base and is removed', () => {
    const { game } = createGame();
    game.start('normal');
    game.debugSpawnEnemy('basic');
    const e = game.enemies[0];
    e.reachedBase = true;
    e.alive = false;
    const hpBefore = game.baseHp;
    game.onEnemyLeak(e);
    expect(game.baseHp).toBe(hpBefore - 1); // basic damageToBase = 1
    expect(game.stats.data.enemiesLeaked).toBe(1);
    expect(game.baseFlash).toBe(1);
  });

  it('base at 0 hp triggers game over', () => {
    const { game, cap } = createGame();
    game.start('normal');
    game.debugDamageBase(999);
    expect(game.state).toBe('gameover');
    expect(cap.ends.length).toBe(1);
    expect(cap.ends[0].result).toBe('gameover');
  });
});
