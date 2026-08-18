import { describe, expect, it } from 'vitest';
import { STEP } from '../game';
import { createGame } from './helpers';

describe('fixed-step loop', () => {
  it('STEP is 1/120', () => {
    expect(STEP).toBeCloseTo(1 / 120);
  });

  it('frame() runs substeps proportional to dt', () => {
    const { game } = createGame();
    game.start('normal');
    game.debugSpawnEnemy('basic');
    const e = game.enemies[0];
    const x0 = e.x;
    game.frame(1 / 60); // 60fps frame at 1x => 2 substeps
    expect(e.x - x0).toBeCloseTo(2 * 1.375 / 120, 6);
  });

  it('frame() is a no-op when paused', () => {
    const { game } = createGame();
    game.start('normal');
    game.debugSpawnEnemy('basic');
    const e = game.enemies[0];
    const x0 = e.x;
    game.paused = true;
    game.frame(0.5);
    expect(e.x).toBe(x0);
  });

  it('frame() is a no-op in menu state', () => {
    const { game } = createGame();
    // state is 'menu' by default
    game.debugSpawnEnemy('basic');
    const e = game.enemies[0];
    const x0 = e.x;
    game.frame(0.5);
    expect(e.x).toBe(x0);
  });

  it('speed 2 doubles simulation rate', () => {
    const { game } = createGame();
    game.start('normal');
    game.speed = 2;
    game.debugSpawnEnemy('basic');
    const e = game.enemies[0];
    const x0 = e.x;
    game.frame(1 / 60); // 4 substeps at 2x
    expect(e.x - x0).toBeCloseTo(4 * 1.375 / 120, 6);
  });

  it('caps substeps at 8 per frame (2D MAX_SUBSTEPS)', () => {
    const { game } = createGame();
    game.start('normal');
    game.debugSpawnEnemy('basic');
    const e = game.enemies[0];
    const x0 = e.x;
    game.frame(5.0); // huge dt: at most 8 substeps may run
    expect(e.x - x0).toBeLessThanOrEqual(8 * 1.375 / 120 + 1e-9);
    expect(e.x - x0).toBeGreaterThan(0); // still simulated some
  });
});

describe('wave lifecycle', () => {
  it('full wave 1: spawns 8 enemies, clears, grants bonus, starts countdown', () => {
    const { game } = createGame();
    game.start('normal');
    game.waves.startNextWave();
    const moneyBefore = game.economy.money;
    // simulate until the wave clears, auto-killing enemies each step
    let guard = 0;
    while (game.waves.active && guard++ < 120 * 60) {
      game.step(STEP);
      for (const e of game.enemies) {
        if (e.alive) {
          e.takeDamage(9999);
          if (!e.alive) game.onEnemyKilled(e, null);
        }
      }
    }
    expect(game.waves.currentWave).toBe(1);
    expect(game.waves.active).toBe(false);
    expect(game.waves.countdownActive).toBe(true);
    expect(game.stats.data.enemiesSpawned).toBe(8);
    expect(game.stats.data.enemiesDefeated).toBe(8);
    // 8 kills * $12 + clear bonus $24
    expect(game.economy.money - moneyBefore).toBe(8 * 12 + 24);
  });

  it('auto-start waves when enabled', () => {
    const { game, settings } = createGame();
    settings.set('autoStartWaves', true);
    game.start('normal');
    // force the countdown to zero
    game.waves.countdown = 0.001;
    game.step(STEP);
    expect(game.waves.active).toBe(true);
    expect(game.waves.currentWave).toBe(1);
  });

  it('victory after final wave cleared', () => {
    const { game, cap } = createGame();
    game.start('normal');
    // jump to final wave
    for (let w = 1; w < 20; w++) {
      game.waves.startNextWave();
      game.waves.active = false;
    }
    game.waves.startNextWave();
    expect(game.waves.currentWave).toBe(20);
    game.waves.eventIndex = game.waves.events.length;
    game.waves.spawnedThisWave = game.waves.totalThisWave;
    game.enemies = [];
    game.checkWaveEnd();
    expect(game.state).toBe('victory');
    expect(cap.ends.length).toBe(1);
    expect(cap.ends[0].result).toBe('victory');
  });
});
