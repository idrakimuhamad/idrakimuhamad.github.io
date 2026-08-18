// Lightweight CPU particle system + fire patches. Renderer uploads buffers each frame.

export const MAX_PARTICLES = 2400;

export class ParticleSystem {
  count = 0;
  // SoA layout for cache friendliness
  px = new Float32Array(MAX_PARTICLES);
  py = new Float32Array(MAX_PARTICLES);
  pz = new Float32Array(MAX_PARTICLES);
  vx = new Float32Array(MAX_PARTICLES);
  vy = new Float32Array(MAX_PARTICLES);
  vz = new Float32Array(MAX_PARTICLES);
  life = new Float32Array(MAX_PARTICLES);
  maxLife = new Float32Array(MAX_PARTICLES);
  size = new Float32Array(MAX_PARTICLES);
  cr = new Float32Array(MAX_PARTICLES);
  cg = new Float32Array(MAX_PARTICLES);
  cb = new Float32Array(MAX_PARTICLES);
  gravity = new Float32Array(MAX_PARTICLES);
  drag = new Float32Array(MAX_PARTICLES);

  spawn(x: number, y: number, z: number, opts: {
    count?: number; speed?: number; up?: number; life?: number; size?: number;
    color: [number, number, number]; spread?: number; gravity?: number; drag?: number;
  }) {
    const n = opts.count ?? 8;
    for (let i = 0; i < n; i++) {
      if (this.count >= MAX_PARTICLES) return;
      const i0 = this.count++;
      const a = Math.random() * Math.PI * 2;
      const s = (opts.speed ?? 3) * (0.4 + Math.random() * 0.8);
      const spread = opts.spread ?? 1;
      this.px[i0] = x; this.py[i0] = y; this.pz[i0] = z;
      this.vx[i0] = Math.cos(a) * s * spread;
      this.vy[i0] = (opts.up ?? 2) * (0.5 + Math.random() * 0.8);
      this.vz[i0] = Math.sin(a) * s * spread;
      const life = (opts.life ?? 0.6) * (0.6 + Math.random() * 0.7);
      this.life[i0] = life; this.maxLife[i0] = life;
      this.size[i0] = (opts.size ?? 0.14) * (0.6 + Math.random() * 0.8);
      this.cr[i0] = opts.color[0]; this.cg[i0] = opts.color[1]; this.cb[i0] = opts.color[2];
      this.gravity[i0] = opts.gravity ?? 6;
      this.drag[i0] = opts.drag ?? 0.9;
    }
  }

  burst(x: number, y: number, z: number, color: [number, number, number], count = 10, speed = 4, up = 2.5, life = 0.7, size = 0.15) {
    this.spawn(x, y, z, { count, speed, up, life, size, color });
  }

  update(dt: number) {
    let i = 0;
    while (i < this.count) {
      this.life[i] -= dt;
      if (this.life[i] <= 0) {
        // swap-remove
        const last = --this.count;
        if (i !== last) {
          this.px[i] = this.px[last]; this.py[i] = this.py[last]; this.pz[i] = this.pz[last];
          this.vx[i] = this.vx[last]; this.vy[i] = this.vy[last]; this.vz[i] = this.vz[last];
          this.life[i] = this.life[last]; this.maxLife[i] = this.maxLife[last];
          this.size[i] = this.size[last];
          this.cr[i] = this.cr[last]; this.cg[i] = this.cg[last]; this.cb[i] = this.cb[last];
          this.gravity[i] = this.gravity[last]; this.drag[i] = this.drag[last];
        }
        continue;
      }
      const dragF = Math.max(0, 1 - this.drag[i] * dt);
      this.vx[i] *= dragF; this.vz[i] *= dragF;
      this.vy[i] = this.vy[i] * dragF - this.gravity[i] * dt;
      this.px[i] += this.vx[i] * dt;
      this.py[i] += this.vy[i] * dt;
      this.pz[i] += this.vz[i] * dt;
      if (this.py[i] < 0.02) { this.py[i] = 0.02; this.vy[i] *= -0.3; }
      i++;
    }
  }
}

export const hexToRgb = (hex: number): [number, number, number] => [
  ((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255,
];
