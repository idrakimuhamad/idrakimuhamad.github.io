// Simulator — owns the Cloth + Wind and runs the fixed-timestep physics loop.
//
// Integration: position-based Verlet.
//   velocity  ≈ (pos - prev) / dt
//   prev      = pos
//   pos      += velocity * damping + (F / m) * dt²
//
// Constraints: Gauss-Seidel position projection (PBD-style), run for several
// iterations per step. Each constraint pulls its two endpoints toward their
// rest distance, weighted by inverse mass so pinned particles (invMass 0) don't
// move and the correction splits proportionally between free particles.
//
// Stability notes:
//   * Fixed timestep (default 1/60 s) decoupled from render FPS via an
//     accumulator. Render may run at any rate; physics advances in fixed quanta.
//   * Damping is applied to the Verlet velocity term, which both settles the
//     cloth (no infinite oscillation) and improves solver convergence.
//   * A max-substeps clamp prevents the "spiral of death" if the tab lags.

import { Cloth } from './Cloth.js';
import { Wind } from './Wind.js';

export class Simulator {
  constructor() {
    // ---- tunable physics parameters (exposed to the UI) ----
    this.gravity = 9.8;
    this.damping = 0.985;      // velocity retention per step (0..1)
    this.iterations = 6;       // constraint solver iterations per step
    this.simSpeed = 1.0;       // global time scale
    this.structuralStiffness = 1.0;
    this.shearStiffness = 0.9;
    this.bendingStiffness = 0.5;
    this.mass = 0.5;           // per particle

    // cloth geometry
    this.cols = 32;
    this.rows = 22;
    this.width = 10;
    this.height = 7;

    // tearing
    this.tearingEnabled = false;
    this.tearThreshold = 1.6;  // stretch ratio (dist / rest) at which a thread breaks

    // pin layout
    this.pinMode = 'top-edge';

    // ---- fixed timestep ----
    this.fixedDt = 1 / 60;
    this.accumulator = 0;
    this.maxSubsteps = 4;

    this.paused = false;
    this.lastPhysicsMs = 0;

    this.cloth = new Cloth(this.cols, this.rows, this.width, this.height, this.mass);
    this.wind = new Wind();

    // per-particle normals (shared with renderer + wind)
    this.normals = new Float32Array(this.cloth.count * 3);

    // drag state
    this.dragIndex = -1;
    this.dragTarget = new Float32Array(3);
    this.dragRadius = 0.9;

    // rebuild applies the default pin layout
    this.cloth.applyPinMode(this.pinMode);
  }

  /** Rebuild the cloth when resolution / size / mass changes. */
  rebuild() {
    this.cloth = new Cloth(this.cols, this.rows, this.width, this.height, this.mass);
    this.cloth.applyPinMode(this.pinMode);
    this.normals = new Float32Array(this.cloth.count * 3);
    this.dragIndex = -1;
    this.computeNormals();
  }

  reset() {
    this.cloth.reset(this.pinMode);
    this.accumulator = 0;
    this.dragIndex = -1;
    this.computeNormals();
  }

  setPinMode(mode) {
    this.pinMode = mode;
    this.cloth.applyPinMode(mode);
  }

  /** Advance the simulation by real elapsed time `frameDt` (seconds). */
  advance(frameDt) {
    if (this.paused) {
      // Still refresh normals so paused edits (e.g. pin toggles) stay correct.
      this.computeNormals();
      return;
    }
    // Scale by sim speed, clamp to avoid huge jumps after a stall.
    let dt = Math.min(frameDt, 0.1) * this.simSpeed;
    this.accumulator += dt;
    const t0 = performance.now();
    let steps = 0;
    while (this.accumulator >= this.fixedDt && steps < this.maxSubsteps) {
      this.step(this.fixedDt);
      this.accumulator -= this.fixedDt;
      steps++;
    }
    // If we're still behind (very slow frame), drop the excess so we don't
    // spiral. Physics stays stable; we just lose a little time.
    if (this.accumulator > this.fixedDt) this.accumulator = this.fixedDt;
    this.computeNormals();
    this.lastPhysicsMs = performance.now() - t0;
  }

  /** One fixed physics step. */
  step(dt) {
    const c = this.cloth;
    const { pos, prev, invMass, force } = c;
    const n = c.count;
    const dt2 = dt * dt;

    // ---- 1. accumulate forces (gravity + wind) ----
    force.fill(0);
    const g = this.gravity;
    for (let i = 0; i < n; i++) {
      // gravity pulls down (-y)
      force[i * 3 + 1] -= g;
    }
    if (this.wind.enabled && this.wind.strength > 0) {
      this.wind.update(dt);
      this.wind.refresh();
      // approximate area per particle = (width/(cols-1)) * (height/(rows-1))
      const ax = this.cols > 1 ? this.width / (this.cols - 1) : 0;
      const ay = this.rows > 1 ? this.height / (this.rows - 1) : 0;
      const area = ax * ay;
      const nm = this.normals;
      for (let i = 0; i < n; i++) {
        if (invMass[i] === 0) continue;
        this.wind.applyParticle(i, nm, force, area);
      }
    }

    // ---- 2. Verlet integration ----
    const damp = this.damping;
    for (let i = 0; i < n; i++) {
      if (invMass[i] === 0) continue; // pinned
      const o = i * 3;
      const px = pos[o], py = pos[o + 1], pz = pos[o + 2];
      // implicit velocity
      let vx = (px - prev[o]) * damp;
      let vy = (py - prev[o + 1]) * damp;
      let vz = (pz - prev[o + 2]) * damp;
      // acceleration = F / m  (m = 1/invMass)
      const m = 1 / invMass[i];
      const ax = force[o] / m;
      const ay = force[o + 1] / m;
      const az = force[o + 2] / m;
      prev[o] = px;
      prev[o + 1] = py;
      prev[o + 2] = pz;
      pos[o] = px + vx + ax * dt2;
      pos[o + 1] = py + vy + ay * dt2;
      pos[o + 2] = pz + vz + az * dt2;
    }

    // ---- 3. drag: pull a neighbourhood toward the pointer target ----
    if (this.dragIndex >= 0) this._applyDrag();

    // ---- 4. constraint solving (Gauss-Seidel, multiple iterations) ----
    this._solveConstraints(dt);

    // ---- 5. tearing (only structural/shear threads) ----
    if (this.tearingEnabled) this._tear();

    // ---- 6. enforce pins (invMass 0 already skips them, but snap exactly) ----
    for (let i = 0; i < n; i++) {
      if (c.pinned[i]) {
        const o = i * 3;
        prev[o] = pos[o];
        prev[o + 1] = pos[o + 1];
        prev[o + 2] = pos[o + 2];
      }
    }
  }

  /**
   * Project each constraint toward its rest length. Stiffness < 1 relaxes the
   * correction (softer cloth); 1.0 is a hard distance constraint.
   */
  _solveConstraints(dt) {
    const c = this.cloth;
    const { ca, cb, rest, type, active, pos, invMass } = c;
    const n = c.constraintCount;
    const kStruct = this.structuralStiffness;
    const kShear = this.shearStiffness;
    const kBend = this.bendingStiffness;

    for (let iter = 0; iter < this.iterations; iter++) {
      for (let i = 0; i < n; i++) {
        if (!active[i]) continue;
        const a = ca[i], b = cb[i];
        const ima = invMass[a], imb = invMass[b];
        const wsum = ima + imb;
        if (wsum === 0) continue; // both pinned

        const ao = a * 3, bo = b * 3;
        let dx = pos[bo] - pos[ao];
        let dy = pos[bo + 1] - pos[ao + 1];
        let dz = pos[bo + 2] - pos[ao + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 1e-9) continue;

        const r = rest[i];
        const diff = (dist - r) / dist;
        // per-type stiffness
        let k = kStruct;
        const t = type[i];
        if (t === 1) k = kShear;
        else if (t === 2) k = kBend;

        const wA = (ima / wsum) * k;
        const wB = (imb / wsum) * k;
        const cx = dx * diff;
        const cy = dy * diff;
        const cz = dz * diff;
        pos[ao] += cx * wA;
        pos[ao + 1] += cy * wA;
        pos[ao + 2] += cz * wA;
        pos[bo] -= cx * wB;
        pos[bo + 1] -= cy * wB;
        pos[bo + 2] -= cz * wB;
      }
    }
  }

  /** Break structural/shear constraints stretched beyond the threshold. */
  _tear() {
    const c = this.cloth;
    const { ca, cb, rest, type, active, pos } = c;
    const n = c.constraintCount;
    const thr = this.tearThreshold;
    for (let i = 0; i < n; i++) {
      if (!active[i]) continue;
      if (type[i] !== 0 && type[i] !== 1) continue; // only threads tear
      const a = ca[i], b = cb[i];
      const ao = a * 3, bo = b * 3;
      const dx = pos[bo] - pos[ao];
      const dy = pos[bo + 1] - pos[ao + 1];
      const dz = pos[bo + 2] - pos[ao + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist / rest[i] > thr) active[i] = 0;
    }
  }

  /**
   * Dragging: pull every particle within `dragRadius` of the grabbed particle
   * toward the pointer target, weighted by a smooth falloff. Weighting by
   * distance (not just the single vertex) keeps the surrounding cloth
   * physically connected to the grab instead of teleporting one point.
   */
  _applyDrag() {
    const c = this.cloth;
    const { pos, prev, invMass } = c;
    const n = c.count;
    const o = this.dragIndex * 3;
    const tx = this.dragTarget[0], ty = this.dragTarget[1], tz = this.dragTarget[2];
    const R = this.dragRadius;
    const R2 = R * R;
    const gx = pos[o], gy = pos[o + 1], gz = pos[o + 2];
    for (let i = 0; i < n; i++) {
      if (invMass[i] === 0) continue;
      const io = i * 3;
      const dx = pos[io] - gx;
      const dy = pos[io + 1] - gy;
      const dz = pos[io + 2] - gz;
      const d2 = dx * dx + dy * dy + dz * dz;
      if (d2 > R2) continue;
      const d = Math.sqrt(d2);
      // smooth falloff 1 at center -> 0 at radius
      const w = 1 - d / R;
      const pull = w * w * 0.35; // gentle but firm
      pos[io] += (tx - pos[io]) * pull;
      pos[io + 1] += (ty - pos[io + 1]) * pull;
      pos[io + 2] += (tz - pos[io + 2]) * pull;
    }
  }

  /**
   * Compute a smooth per-particle normal by accumulating the normals of the
   * triangles that touch each particle. Used for lighting and wind.
   */
  computeNormals() {
    const c = this.cloth;
    const { cols, rows, pos } = c;
    const nm = this.normals;
    nm.fill(0);
    const addTri = (a, b, cc) => {
      const ax = pos[a * 3], ay = pos[a * 3 + 1], az = pos[a * 3 + 2];
      const bx = pos[b * 3], by = pos[b * 3 + 1], bz = pos[b * 3 + 2];
      const cx = pos[cc * 3], cy = pos[cc * 3 + 1], cz = pos[cc * 3 + 2];
      const ux = bx - ax, uy = by - ay, uz = bz - az;
      const vx = cx - ax, vy = cy - ay, vz = cz - az;
      let nx = uy * vz - uz * vy;
      let ny = uz * vx - ux * vz;
      let nz = ux * vy - uy * vx;
      nm[a * 3] += nx; nm[a * 3 + 1] += ny; nm[a * 3 + 2] += nz;
      nm[b * 3] += nx; nm[b * 3 + 1] += ny; nm[b * 3 + 2] += nz;
      nm[cc * 3] += nx; nm[cc * 3 + 1] += ny; nm[cc * 3 + 2] += nz;
    };
    for (let r = 0; r < rows - 1; r++) {
      for (let col = 0; col < cols - 1; col++) {
        const i00 = r * cols + col;
        const i10 = i00 + 1;
        const i01 = i00 + cols;
        const i11 = i01 + 1;
        // skip triangles that include a torn seam? For normals we just use the
        // current positions; tearing doesn't remove particles.
        addTri(i00, i10, i11);
        addTri(i00, i11, i01);
      }
    }
    // normalize
    for (let i = 0; i < c.count; i++) {
      const o = i * 3;
      const l = Math.sqrt(nm[o] * nm[o] + nm[o + 1] * nm[o + 1] + nm[o + 2] * nm[o + 2]);
      if (l > 1e-9) {
        nm[o] /= l; nm[o + 1] /= l; nm[o + 2] /= l;
      } else {
        nm[o] = 0; nm[o + 1] = 1; nm[o + 2] = 0;
      }
    }
  }

  /**
   * Find the particle nearest to a world-space point (for drag picking).
   * @returns particle index, or -1
   */
  pickNearest(px, py, pz, maxDist) {
    const c = this.cloth;
    const { pos } = c;
    let best = -1;
    let bestD = maxDist * maxDist;
    for (let i = 0; i < c.count; i++) {
      const o = i * 3;
      const dx = pos[o] - px, dy = pos[o + 1] - py, dz = pos[o + 2] - pz;
      const d = dx * dx + dy * dy + dz * dz;
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    return best;
  }

  /**
   * Pick the particle closest to a world-space ray (screen picking).
   * For each particle we compute the squared perpendicular distance to the ray
   * and keep the smallest, but only accept hits in front of the camera.
   * @param {number[]} o ray origin
   * @param {number[]} d ray direction (normalized)
   * @param {number} maxDist max perpendicular distance (world units)
   * @returns particle index or -1
   */
  pickRay(o, d, maxDist) {
    const c = this.cloth;
    const { pos } = c;
    let best = -1;
    let bestD = maxDist * maxDist;
    for (let i = 0; i < c.count; i++) {
      const p = i * 3;
      // vector from origin to particle
      const vx = pos[p] - o[0];
      const vy = pos[p + 1] - o[1];
      const vz = pos[p + 2] - o[2];
      // projection onto ray
      const t = vx * d[0] + vy * d[1] + vz * d[2];
      if (t < 0) continue; // behind the camera
      // closest point on ray to the particle
      const cx = o[0] + d[0] * t;
      const cy = o[1] + d[1] * t;
      const cz = o[2] + d[2] * t;
      const dx = pos[p] - cx, dy = pos[p + 1] - cy, dz = pos[p + 2] - cz;
      const dist2 = dx * dx + dy * dy + dz * dz;
      if (dist2 < bestD) {
        bestD = dist2;
        best = i;
      }
    }
    return best;
  }

  setDrag(index, tx, ty, tz) {
    this.dragIndex = index;
    this.dragTarget[0] = tx;
    this.dragTarget[1] = ty;
    this.dragTarget[2] = tz;
  }

  clearDrag() {
    this.dragIndex = -1;
  }
}
