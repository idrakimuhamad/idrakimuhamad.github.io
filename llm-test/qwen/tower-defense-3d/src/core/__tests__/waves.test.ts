import { describe, expect, it } from 'vitest';
import { WAVES } from '../defs';
import { Waves } from '../waves';

function expectSchedule(events: { kind: string; time: number }[], expected: { kind: string; time: number }[]) {
  expect(events.length).toBe(expected.length);
  for (let i = 0; i < expected.length; i++) {
    expect(events[i].kind).toBe(expected[i].kind);
    expect(events[i].time).toBeCloseTo(expected[i].time, 8);
  }
}

describe('wave builder', () => {
  it('wave 1: 8 basic at 1.1s gaps', () => {
    const w = new Waves();
    const events = w.buildWave(1);
    expectSchedule(events, [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ kind: 'basic', time: i * 1.1 })));
  });

  it('wave 3: groups merged and sorted by time', () => {
    const w = new Waves();
    const events = w.buildWave(3);
    expectSchedule(events, [
      { kind: 'basic', time: 0 },
      { kind: 'basic', time: 0.9 },
      { kind: 'basic', time: 1.8 },
      { kind: 'basic', time: 2.7 },
      { kind: 'basic', time: 3.6 },
      { kind: 'basic', time: 4.5 },
      { kind: 'basic', time: 5.4 },
      { kind: 'runner', time: 6 },
      { kind: 'basic', time: 6.3 },
      { kind: 'runner', time: 6.6 },
      { kind: 'runner', time: 7.2 },
      { kind: 'runner', time: 7.8 },
      { kind: 'runner', time: 8.4 },
    ]);
  });

  it('total event count matches group counts for all 20 waves', () => {
    const w = new Waves();
    for (let n = 1; n <= 20; n++) {
      const expected = WAVES[n - 1].reduce((s, g) => s + g.count, 0);
      expect(w.buildWave(n).length).toBe(expected);
    }
  });

  it('wave 20 has 134 enemies (incl. 4 elite Sentinels)', () => {
    const w = new Waves();
    expect(w.buildWave(20).length).toBe(14 + 20 + 16 + 30 + 50 + 4);
  });

  it('elite Sentinels appear only in late waves (15+), 2-4 each, spaced apart', () => {
    for (let n = 1; n <= 20; n++) {
      const elites = WAVES[n - 1].filter((g) => g.kind === 'elite');
      if (n < 15) {
        expect(elites.length, `wave ${n}`).toBe(0);
      } else {
        for (const g of elites) {
          expect(g.count, `wave ${n}`).toBeGreaterThanOrEqual(2);
          expect(g.count, `wave ${n}`).toBeLessThanOrEqual(4);
          expect(g.gap, `wave ${n}`).toBeGreaterThanOrEqual(5); // spaced apart
        }
      }
    }
    // first appearance is wave 15
    expect(WAVES[14].some((g) => g.kind === 'elite')).toBe(true);
  });

  it('HP scaling = waveGrowth^(wave-1)', () => {
    const w = new Waves();
    w.configure(1.18);
    expect(w.hpMultFor(1)).toBe(1);
    expect(w.hpMultFor(2)).toBeCloseTo(1.18);
    expect(w.hpMultFor(5)).toBeCloseTo(Math.pow(1.18, 4));
  });

  it('countdown and wave start', () => {
    const w = new Waves();
    w.beginCountdown();
    expect(w.countdownActive).toBe(true);
    expect(w.countdown).toBe(18);
    expect(w.startNextWave()).toBe(true);
    expect(w.currentWave).toBe(1);
    expect(w.active).toBe(true);
    expect(w.countdownActive).toBe(false);
    expect(w.totalThisWave).toBe(8);
  });

  it('spawns events as wave time passes them', () => {
    const w = new Waves();
    w.startNextWave();
    // wave 1 times: 0, 1.1, 2.2, 3.3, ...
    expect(w.update(0.5).length).toBe(1); // t=0 event (waveTime 0.5)
    expect(w.update(0.7).length).toBe(1); // t=1.1 event (waveTime 1.2)
    expect(w.update(1.0).length).toBe(1); // t=2.2 event (waveTime 2.2)
    expect(w.remainingToSpawn()).toBe(5);
  });
});
