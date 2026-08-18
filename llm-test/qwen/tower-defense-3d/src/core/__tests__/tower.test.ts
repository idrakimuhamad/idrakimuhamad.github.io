import { describe, expect, it } from 'vitest';
import { Enemy } from '../enemy';
import { Projectile } from '../projectile';
import { Tower } from '../tower';

function enemyAt(x: number, z: number, hp = 100, kind: 'basic' | 'tank' = 'basic'): Enemy {
  const e = new Enemy(kind, x, z, 1);
  e.hp = hp;
  e.maxHp = Math.max(hp, e.maxHp);
  return e;
}

describe('tower targeting', () => {
  // tower at (10,8) => (10.5, 8.5); cannon range 120px = 3.0 u
  function makeTower(): Tower {
    return new Tower('cannon', 10, 8);
  }

  it('first: most path progress', () => {
    const t = makeTower();
    t.targetMode = 'first';
    const a = enemyAt(11.5, 8.5); a.progress = 5;
    const b = enemyAt(12.5, 8.5); b.progress = 50;
    const c = enemyAt(13.5, 8.5); c.progress = 20;
    expect(t.pickTarget([a, b, c])).toBe(b);
  });

  it('last: least path progress', () => {
    const t = makeTower();
    t.targetMode = 'last';
    const a = enemyAt(11.5, 8.5); a.progress = 5;
    const b = enemyAt(12.5, 8.5); b.progress = 50;
    const c = enemyAt(13.5, 8.5); c.progress = 20;
    expect(t.pickTarget([a, b, c])).toBe(a);
  });

  it('closest: nearest by distance', () => {
    const t = makeTower();
    t.targetMode = 'closest';
    const a = enemyAt(11.5, 8.5); // 1.0 away
    const b = enemyAt(13.5, 8.5); // 3.0 away
    const c = enemyAt(12.5, 10.5); // 2.24 away
    expect(t.pickTarget([a, b, c])).toBe(a);
  });

  it('strongest: most hp', () => {
    const t = makeTower();
    t.targetMode = 'strongest';
    const a = enemyAt(11.5, 8.5, 50);
    const b = enemyAt(12.5, 8.5, 300);
    const c = enemyAt(13.5, 8.5, 120);
    expect(t.pickTarget([a, b, c])).toBe(b);
  });

  it('weakest: least hp', () => {
    const t = makeTower();
    t.targetMode = 'weakest';
    const a = enemyAt(11.5, 8.5, 50);
    const b = enemyAt(12.5, 8.5, 300);
    const c = enemyAt(13.5, 8.5, 120);
    expect(t.pickTarget([a, b, c])).toBe(a);
  });

  it('only targets enemies in range and fires on cooldown', () => {
    const t = makeTower();
    const inRange = enemyAt(12.5, 8.5); // 2.0 away < 3.0
    const outOfRange = enemyAt(14.5, 8.5); // 4.0 away > 3.0
    let res = t.update(0, [inRange, outOfRange]);
    expect(res.fired).toBe(true);
    expect(res.target).toBe(inRange);
    // immediate second shot is on cooldown
    res = t.update(0, [inRange]);
    expect(res.fired).toBe(false);
    expect(res.target).toBe(inRange);
    // after 1/fireRate seconds it fires again
    res = t.update(1 / t.L.fireRate, [inRange]);
    expect(res.fired).toBe(true);
  });

  it('tracks target angle', () => {
    const t = makeTower();
    const target = enemyAt(13.5, 8.5);
    t.update(0, [target]);
    expect(t.angle).toBeCloseTo(Math.atan2(0, 3));
  });
});

describe('projectiles', () => {
  it('homing projectile homes onto its target', () => {
    const target = enemyAt(5, 5);
    const p = new Projectile({
      x: 0, z: 0, tx: 5, tz: 5,
      speed: 8.5, damage: 34, splash: 0, slow: 0, slowDur: 0,
      kind: 'shell', color: '#fff', towerKind: 'cannon', target, towerId: 1,
    });
    expect(p.homing).toBe(true);
    const res = p.update(0.1, [target]);
    expect(res).toBe('alive');
    expect(p.x).toBeGreaterThan(0);
    expect(p.z).toBeGreaterThan(0);
    // velocity renormalized to speed
    expect(Math.hypot(p.vx, p.vz)).toBeCloseTo(8.5);
  });

  it('bullet flies straight to last aim point', () => {
    const target = enemyAt(5, 0);
    const p = new Projectile({
      x: 0, z: 0, tx: 5, tz: 0,
      speed: 18, damage: 7, splash: 0, slow: 0, slowDur: 0,
      kind: 'bullet', color: '#fff', towerKind: 'mg', target, towerId: 1,
    });
    expect(p.homing).toBe(false);
    p.update(0.1, [target]);
    expect(p.z).toBeCloseTo(0, 5); // no vertical steering
  });

  it('hits the target within radius + 4px', () => {
    const target = enemyAt(2, 8.5);
    const p = new Projectile({
      x: 0.5, z: 8.5, tx: 2, tz: 8.5,
      speed: 8.5, damage: 34, splash: 0, slow: 0, slowDur: 0,
      kind: 'shell', color: '#fff', towerKind: 'cannon', target, towerId: 1,
    });
    let res = p.update(0.15, [target]);
    expect(res === 'alive' || res === 'hit').toBe(true);
    for (let i = 0; i < 50 && p.alive; i++) res = p.update(0.01, [target]);
    expect(res).toBe('hit');
    expect(p.alive).toBe(false);
  });

  it('re-targets nearest enemy within 100px when target dies', () => {
    const dead = enemyAt(5, 5);
    dead.alive = false;
    const other = enemyAt(2.4, 5); // 2.4 u = 96 px away
    const p = new Projectile({
      x: 0, z: 5, tx: 5, tz: 5,
      speed: 8.5, damage: 34, splash: 0, slow: 0, slowDur: 0,
      kind: 'shell', color: '#fff', towerKind: 'cannon', target: dead, towerId: 1,
    });
    p.update(0.01, [other]);
    expect(p.target).toBe(other);
  });

  it('expires after maxAge 8s', () => {
    const p = new Projectile({
      x: 0, z: 0, tx: 1, tz: 0,
      speed: 1, damage: 1, splash: 0, slow: 0, slowDur: 0,
      kind: 'shell', color: '#fff', towerKind: 'cannon', target: null, towerId: 1,
    });
    expect(p.update(7.9, [])).toBe('alive');
    expect(p.update(0.2, [])).toBe('dead');
    expect(p.alive).toBe(false);
  });

  it('records a trail of up to 6 points sampled every 0.02s', () => {
    const p = new Projectile({
      x: 0, z: 0, tx: 10, tz: 0,
      speed: 8.5, damage: 1, splash: 0, slow: 0, slowDur: 0,
      kind: 'shell', color: '#fff', towerKind: 'cannon', target: null, towerId: 1,
    });
    for (let i = 0; i < 20; i++) p.update(0.02, []);
    expect(p.trail.length).toBe(6);
  });
});
