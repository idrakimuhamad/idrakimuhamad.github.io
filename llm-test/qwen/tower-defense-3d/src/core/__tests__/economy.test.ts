import { describe, expect, it } from 'vitest';
import { Economy } from '../economy';
import { createGame } from './helpers';

describe('economy', () => {
  it('starts with difficulty money', () => {
    expect(new Economy('easy').money).toBe(320);
    expect(new Economy('normal').money).toBe(250);
    expect(new Economy('hard').money).toBe(200);
  });

  it('kill reward = round(reward * killMult)', () => {
    expect(new Economy('easy').killReward('basic')).toBe(14); // 12 * 1.15 = 13.8
    expect(new Economy('normal').killReward('basic')).toBe(12);
    expect(new Economy('hard').killReward('tank')).toBe(29); // 34 * 0.85 = 28.9
  });

  it('early bonus = round(countdown * 1.6 * mult)', () => {
    expect(new Economy('normal').earlyBonus(18)).toBe(29); // 28.8
    expect(new Economy('easy').earlyBonus(10)).toBe(20); // 16
    expect(new Economy('hard').earlyBonus(10)).toBe(12); // 12
  });

  it('spend fails when broke and does not change money', () => {
    const e = new Economy('normal');
    e.money = 50;
    expect(e.spend(60)).toBe(false);
    expect(e.money).toBe(50);
    expect(e.spend(50)).toBe(true);
    expect(e.money).toBe(0);
    expect(e.totalSpent).toBe(50);
  });

  it('earn tracks totals', () => {
    const e = new Economy('normal');
    e.earn(100);
    expect(e.money).toBe(350);
    expect(e.totalEarned).toBe(100);
  });
});

describe('game economy rules', () => {
  it('wave clear bonus = 20 + wave*4', () => {
    const { game } = createGame();
    game.start('normal');
    game.waves.startNextWave(); // wave 1
    game.waves.eventIndex = game.waves.events.length; // all spawned
    game.waves.spawnedThisWave = game.waves.totalThisWave;
    game.enemies = [];
    const moneyBefore = game.economy.money;
    game.checkWaveEnd();
    expect(game.economy.money - moneyBefore).toBe(24); // 20 + 1*4
    expect(game.waves.active).toBe(false);
    expect(game.waves.countdownActive).toBe(true);
    expect(game.stats.data.highestWave).toBe(1);
  });

  it('early wave start grants round(countdown * 1.6 * mult)', () => {
    const { game } = createGame();
    game.start('normal'); // countdown = 18
    const moneyBefore = game.economy.money;
    game.startWaveEarly();
    expect(game.economy.money - moneyBefore).toBe(29);
    expect(game.waves.active).toBe(true);
    expect(game.waves.currentWave).toBe(1);
  });

  it('early start does nothing while a wave is active', () => {
    const { game } = createGame();
    game.start('normal');
    game.startWaveEarly();
    const moneyBefore = game.economy.money;
    game.startWaveEarly();
    expect(game.economy.money).toBe(moneyBefore);
    expect(game.waves.currentWave).toBe(1);
  });

  it('upgrade costs the next level cost and caps at level 4', () => {
    const { game } = createGame();
    game.start('normal');
    game.setPlacing('cannon');
    game.placeAt(10, 5);
    const t = game.towers[0];
    game.selectTower(t);
    game.economy.money = 1000;

    expect(t.level).toBe(0);
    game.upgradeSelected();
    expect(t.level).toBe(1);
    expect(t.invested).toBe(160); // 70 + 90
    game.upgradeSelected();
    expect(t.level).toBe(2);
    expect(t.invested).toBe(290); // + 130
    game.upgradeSelected();
    expect(t.level).toBe(3);
    expect(t.invested).toBe(475); // + 185
    expect(t.canUpgrade).toBe(false);
    game.upgradeSelected(); // no-op at cap
    expect(t.level).toBe(3);
  });

  it('upgrade is rejected when money is insufficient', () => {
    const { game, cap } = createGame();
    game.start('normal');
    game.setPlacing('cannon');
    game.placeAt(10, 5);
    const t = game.towers[0];
    game.selectTower(t);
    game.economy.money = 50; // needs 90
    game.upgradeSelected();
    expect(t.level).toBe(0);
    expect(cap.toasts.some((t) => t.msg === 'Need $90 to upgrade')).toBe(true);
  });

  it('kill reward flows into money and stats', () => {
    const { game } = createGame();
    game.start('normal');
    game.debugSpawnEnemy('basic');
    const e = game.enemies[0];
    const moneyBefore = game.economy.money;
    e.takeDamage(9999);
    game.onEnemyKilled(e, null);
    expect(game.economy.money - moneyBefore).toBe(12);
    expect(game.stats.data.enemiesDefeated).toBe(1);
    expect(game.stats.data.score).toBe(10);
  });
});
