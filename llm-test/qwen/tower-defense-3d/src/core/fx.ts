// Particle + floating-text state. Port of 2D `Se`, adapted to 3D:
// positions are (x, z) ground plane + y height. Gravity positive = UP
// (2D screen gravity was positive = down, so signs are flipped).
// The renderer reads this state; no three.js imports here.

export const MAX_PARTICLES = 1400;
export const MAX_TEXTS = 120;

export type ParticleShape = 'circle' | 'spark' | 'smoke';

export interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  gravity: number; // world units/s^2, + = up
  drag: number;    // per-frame (60fps) velocity retention
  shape: ParticleShape;
}

export interface FloatingText {
  x: number;
  y: number;
  z: number;
  vy: number;
  life: number;
  maxLife: number;
  text: string;
  color: string;
  size: number;
  kind: 'info' | 'money' | 'damage';
}

export interface BurstOpts {
  speed?: number;
  size?: number;
  life?: number;
  gravity?: number;
  drag?: number;
  shape?: ParticleShape;
}

export class Fx {
  particles: Particle[] = [];
  texts: FloatingText[] = [];
  enabled = true;

  clear(): void {
    this.particles.length = 0;
    this.texts.length = 0;
  }

  addP(p: Particle): void {
    if (!this.enabled) return;
    if (this.particles.length >= MAX_PARTICLES) this.particles.shift();
    this.particles.push(p);
  }

  addT(t: FloatingText): void {
    if (this.texts.length >= MAX_TEXTS) this.texts.shift();
    this.texts.push(t);
  }

  burst(x: number, z: number, count: number, color: string, opts: BurstOpts = {}, y = 0.5): void {
    const speed = opts.speed ?? 120;
    const size = opts.size ?? 3;
    const life = opts.life ?? 0.5;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const f = speed * (0.4 + Math.random() * 0.8);
      this.addP({
        x, z, y,
        vx: Math.cos(a) * f,
        vy: 0,
        vz: Math.sin(a) * f,
        life: life * (0.6 + Math.random() * 0.6),
        maxLife: life,
        size: size * (0.6 + Math.random() * 0.8),
        color,
        gravity: opts.gravity ?? 0,
        drag: opts.drag ?? 0.9,
        shape: opts.shape ?? 'circle',
      });
    }
  }

  explosion(x: number, z: number, radius: number, color: string, y = 0.5): void {
    this.burst(x, z, Math.min(40, radius), color, { speed: radius * 4, size: 3, life: 0.5, drag: 0.86, shape: 'spark' }, y);
    this.burst(x, z, 14, '#ffffff', { speed: radius * 2, size: 2, life: 0.3, drag: 0.8, shape: 'spark' }, y);
    for (let i = 0; i < 8; i++) {
      const a = Math.random() * Math.PI * 2;
      this.addP({
        x, z, y,
        vx: Math.cos(a) * 30,
        vy: 20,
        vz: Math.sin(a) * 30,
        life: 0.7,
        maxLife: 0.7,
        size: radius * 0.3,
        color: 'rgba(80,80,90,0.5)',
        gravity: 20, // 2D gravity -20 (screen up) => +20 world up
        drag: 0.9,
        shape: 'smoke',
      });
    }
  }

  muzzle(x: number, z: number, angle: number, color: string, y = 0.9): void {
    for (let i = 0; i < 5; i++) {
      const a = angle + (Math.random() - 0.5) * 0.6;
      const f = 200 + Math.random() * 120;
      this.addP({
        x, z, y,
        vx: Math.cos(a) * f,
        vy: 0,
        vz: Math.sin(a) * f,
        life: 0.12,
        maxLife: 0.12,
        size: 2.5,
        color,
        gravity: 0,
        drag: 0.85,
        shape: 'spark',
      });
    }
  }

  frost(x: number, z: number, y = 0.5): void {
    this.burst(x, z, 10, '#bfefff', { speed: 60, size: 2.5, life: 0.5, gravity: 10, shape: 'spark' }, y);
  }

  death(x: number, z: number, color: string, y = 0.5): void {
    this.burst(x, z, 14, color, { speed: 100, size: 3, life: 0.5, gravity: -60, drag: 0.9 }, y);
    this.burst(x, z, 6, '#ffffff', { speed: 60, size: 2, life: 0.3 }, y);
  }

  build(x: number, z: number, color: string, y = 0.5): void {
    this.burst(x, z, 18, color, { speed: 90, size: 3, life: 0.5, gravity: -40, drag: 0.88 }, y);
  }

  text(x: number, z: number, str: string, color: string, size = 13, kind: FloatingText['kind'] = 'info', y = 1.2): void {
    // 2D text rose at 40 px/s => 1 world unit/s
    this.addT({ x, z, y, vy: 1, life: 0.9, maxLife: 0.9, text: str, color, size, kind });
  }

  money(x: number, z: number, amount: number, y = 1.2): void {
    this.text(x, z, `+$${amount}`, '#ffcf5c', 13, 'money', y);
  }

  damage(x: number, z: number, amount: number, y = 1.0): void {
    this.text(x, z, `${Math.round(amount)}`, '#ffffff', 12, 'damage', y);
  }

  update(dt: number): void {
    const ps = this.particles;
    for (let i = ps.length - 1; i >= 0; i--) {
      const p = ps[i];
      p.life -= dt;
      if (p.life <= 0) {
        ps[i] = ps[ps.length - 1];
        ps.pop();
        continue;
      }
      p.vy += p.gravity * dt;
      const drag = Math.pow(p.drag, dt * 60);
      p.vx *= drag;
      p.vy *= drag;
      p.vz *= drag;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;
    }
    const ts = this.texts;
    for (let i = ts.length - 1; i >= 0; i--) {
      const t = ts[i];
      t.life -= dt;
      if (t.life <= 0) {
        ts[i] = ts[ts.length - 1];
        ts.pop();
        continue;
      }
      t.y += t.vy * dt;
      t.vy *= Math.pow(0.9, dt * 60);
    }
  }
}
