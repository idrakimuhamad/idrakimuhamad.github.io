// PerfMonitor — lightweight FPS + physics-time + counts overlay.
// Updates the DOM at most ~4x/second to avoid layout thrash.

export class PerfMonitor {
  constructor(sim) {
    this.sim = sim;
    this.fpsEl = document.getElementById('perf-fps');
    this.physicsEl = document.getElementById('perf-physics');
    this.particlesEl = document.getElementById('perf-particles');
    this.constraintsEl = document.getElementById('perf-constraints');

    this.frames = 0;
    this.lastFpsTime = performance.now();
    this.fps = 0;
    this.physicsMs = 0; // smoothed
    this.lastUpdate = 0;
  }

  /** Call once per rendered frame. */
  tick(now) {
    this.frames++;
    if (now - this.lastFpsTime >= 500) {
      const dt = (now - this.lastFpsTime) / 1000;
      this.fps = this.frames / dt;
      this.frames = 0;
      this.lastFpsTime = now;
    }
    if (now - this.lastUpdate >= 250) {
      this.lastUpdate = now;
      this._render();
    }
  }

  setPhysicsMs(ms) {
    // exponential smoothing
    this.physicsMs = this.physicsMs === 0 ? ms : this.physicsMs * 0.8 + ms * 0.2;
  }

  _render() {
    const f = Math.round(this.fps);
    this.fpsEl.textContent = f;
    this.fpsEl.className = 'v ' + (f >= 50 ? 'good' : f >= 30 ? 'warn' : 'bad');
    this.physicsEl.textContent = this.physicsMs.toFixed(1) + ' ms';
    this.physicsEl.className = 'v ' + (this.physicsMs < 4 ? 'good' : this.physicsMs < 9 ? 'warn' : 'bad');
    const c = this.sim.cloth;
    if (c) {
      this.particlesEl.textContent = c.count.toLocaleString();
      this.constraintsEl.textContent = c.constraintCount.toLocaleString();
    }
  }
}
