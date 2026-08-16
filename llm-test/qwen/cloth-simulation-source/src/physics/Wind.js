// Wind — a dynamic wind field with direction, strength, turbulence and gusts.
//
// The base wind direction oscillates slowly (turbulence) and its magnitude is
// modulated by a low-frequency "gust" envelope (gustiness). Per-particle force
// is computed from the local surface normal so the wind pushes faces that are
// oriented toward it (dot(normal, wind) > 0) and lets them through when they
// face away — this is what makes the cloth ripple and flap instead of being
// shoved uniformly.

export class Wind {
  constructor() {
    this.enabled = true;
    this.strength = 12;        // base force magnitude
    this.direction = 0;        // radians, angle in the XZ plane (0 = +X)
    this.turbulence = 0.35;    // 0..1 how much the direction wanders
    this.gustFrequency = 0.6;  // how fast the gust envelope oscillates
    this.gustiness = 0.6;      // 0..1 depth of the gust modulation
    this.time = 0;

    // Scratch, precomputed once per step by refresh().
    this._v = new Float32Array(3);
    this._w0 = 0;
    this._w2 = 0;
    this._mag = 0;
  }

  /** Advance the wind clock. `dt` is the fixed simulation timestep. */
  update(dt) {
    this.time += dt;
  }

  /**
   * Compute the current wind velocity vector into `out[3]`.
   * Combines the base direction (with turbulent wander) and the gust envelope.
   */
  velocity(out) {
    const t = this.time;
    // Turbulent directional wander: two incommensurate sines give a
    // non-repeating, organic drift of the wind heading.
    const wander = Math.sin(t * 1.7) * 0.6 + Math.sin(t * 0.53 + 1.3) * 0.4;
    const ang = this.direction + wander * this.turbulence * Math.PI;

    // Gust envelope: a smooth 0..1 pulse. Blend two sines so gusts don't have
    // a single obvious period.
    const g1 = Math.sin(t * this.gustFrequency * Math.PI * 2);
    const g2 = Math.sin(t * this.gustFrequency * 0.53 * Math.PI * 2 + 0.9);
    let gust = 0.5 + 0.5 * (g1 * 0.7 + g2 * 0.3); // 0..1
    // Map through gustiness: 0 => steady, 1 => full swing.
    const depth = this.gustiness;
    const gustScale = 1 - depth + depth * (0.2 + 1.6 * gust);

    const mag = this.strength * gustScale;
    out[0] = Math.cos(ang) * mag;
    out[1] = 0;
    out[2] = Math.sin(ang) * mag;
    return out;
  }

  /**
   * Precompute the current wind vector + magnitude for the per-particle fast
   * path. Called once per simulation step, before the force loop.
   */
  refresh() {
    const v = this.velocity(this._v);
    this._w0 = v[0];
    this._w2 = v[2];
    this._mag = Math.hypot(v[0], v[1], v[2]);
  }

  /**
   * Apply wind force to a single particle, given the local surface normal.
   *
   *   F = ŵ * (ŵ·n) * mag * area
   *
   * Only the component of the wind that "hits" the face (dot > 0) contributes,
   * projected along the wind direction — one-sided, orientation-aware loading.
   *
   * @param {number} i         particle index
   * @param {Float32Array} normals  per-particle normals (xyz)
   * @param {Float32Array} forceOut accumulated force array (cloth.force)
   * @param {number} area       approximate area per particle (scaling)
   */
  applyParticle(i, normals, forceOut, area) {
    const dot = normals[i * 3] * this._w0 + normals[i * 3 + 2] * this._w2;
    if (dot <= 0) return; // face turned away from the wind
    const f = this._mag * dot * area;
    forceOut[i * 3] += this._w0 * f;
    forceOut[i * 3 + 2] += this._w2 * f;
  }
}
