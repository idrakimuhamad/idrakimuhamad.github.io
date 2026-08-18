// Wave scheduler: build spawn schedule, countdown, HP scaling. Port of 2D `K`.

import { TOTAL_WAVES, WAVES, WAVE_COUNTDOWN } from './defs';
import type { EnemyKind } from './types';

export interface WaveEvent { kind: EnemyKind; time: number }

export class Waves {
  currentWave = 0;
  readonly totalWaves = TOTAL_WAVES;
  waveTime = 0;
  events: WaveEvent[] = [];
  eventIndex = 0;
  countdown = 0;
  countdownActive = false;
  spawnedThisWave = 0;
  totalThisWave = 0;
  active = false;
  waveGrowth = 1.18;
  pendingEarlyBonus = 0;

  buildWave(n: number): WaveEvent[] {
    const groups = WAVES[n - 1];
    const events: WaveEvent[] = [];
    for (const g of groups) {
      for (let i = 0; i < g.count; i++) {
        events.push({ kind: g.kind, time: g.delay + i * g.gap });
      }
    }
    events.sort((a, b) => a.time - b.time);
    return events;
  }

  configure(waveGrowth: number): void {
    this.waveGrowth = waveGrowth;
  }

  hpMultFor(wave: number): number {
    return Math.pow(this.waveGrowth, wave - 1);
  }

  beginCountdown(): void {
    if (this.currentWave >= this.totalWaves) return;
    this.countdownActive = true;
    this.countdown = WAVE_COUNTDOWN;
  }

  /** Returns false if all waves already started. */
  startNextWave(): boolean {
    if (this.currentWave >= this.totalWaves) return false;
    this.currentWave++;
    this.events = this.buildWave(this.currentWave);
    this.eventIndex = 0;
    this.waveTime = 0;
    this.spawnedThisWave = 0;
    this.totalThisWave = this.events.length;
    this.active = true;
    this.countdownActive = false;
    return true;
  }

  /** Returns the kinds to spawn this step. */
  update(dt: number): EnemyKind[] {
    const toSpawn: EnemyKind[] = [];
    if (this.countdownActive) {
      this.countdown -= dt;
      if (this.countdown <= 0) {
        this.countdown = 0;
        this.countdownActive = false;
      }
      return toSpawn;
    }
    if (!this.active) return toSpawn;
    this.waveTime += dt;
    while (this.eventIndex < this.events.length && this.events[this.eventIndex].time <= this.waveTime) {
      toSpawn.push(this.events[this.eventIndex].kind);
      this.eventIndex++;
      this.spawnedThisWave++;
    }
    return toSpawn;
  }

  allSpawned(): boolean {
    return this.eventIndex >= this.events.length;
  }

  remainingToSpawn(): number {
    return this.events.length - this.eventIndex;
  }

  waveComplete(): boolean {
    return this.active && this.allSpawned();
  }

  get finalWaveReached(): boolean {
    return this.currentWave >= this.totalWaves;
  }
}
