// Cloth — the particle grid + constraint structure.
//
// Data layout is Structure-of-Arrays with typed arrays so the solver can run
// tight, allocation-free loops over contiguous memory.
//
//   pos[i*3..i*3+2]  current position
//   prev[i*3..i*3+2] previous position (Verlet velocity is implicit: pos-prev)
//   invMass[i]       inverse mass (0 => pinned / infinite mass)
//   pinned[i]        1 if pinned (also forces invMass 0)
//
// Constraints are stored as parallel arrays:
//   ca[i], cb[i]     endpoint particle indices
//   rest[i]          rest length
//   type[i]          0 structural | 1 shear | 2 bending
//   active[i]        1 intact, 0 torn (torn constraints are skipped)

export const C_STRUCT = 0;
export const C_SHEAR = 1;
export const C_BEND = 2;

export class Cloth {
  /**
   * @param {number} cols particles across (x)
   * @param {number} rows particles down  (y, before it falls)
   * @param {number} width  world-space width  (x extent)
   * @param {number} height world-space height (y extent)
   * @param {number} mass   mass per particle
   */
  constructor(cols, rows, width, height, mass) {
    this.cols = cols;
    this.rows = rows;
    this.width = width;
    this.height = height;
    this.mass = mass;
    this.count = cols * rows;

    // ---- particle state ----
    this.pos = new Float32Array(this.count * 3);
    this.prev = new Float32Array(this.count * 3);
    this.invMass = new Float32Array(this.count);
    this.pinned = new Uint8Array(this.count);
    // per-particle accumulated force (gravity + wind), cleared each step
    this.force = new Float32Array(this.count * 3);

    // ---- constraints (built into plain arrays, converted at the end) ----
    this.ca = [];
    this.cb = [];
    this.rest = [];
    this.type = [];
    this.active = [];
    this.constraintCount = 0;

    this._buildGrid();
    this._buildConstraints();
  }

  index(col, row) {
    return row * this.cols + col;
  }

  /** Lay particles out in a flat grid in the XY plane (z = 0), top edge at y=0. */
  _buildGrid() {
    const { cols, rows, width, height, mass } = this;
    const dx = cols > 1 ? width / (cols - 1) : 0;
    const dy = rows > 1 ? height / (rows - 1) : 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const x = c * dx;
        // y grows downward in cloth space; we'll keep y as world-up positive by
        // placing the top row at y = height and stepping down.
        const y = height - r * dy;
        const z = 0;
        this.pos[i * 3] = x;
        this.pos[i * 3 + 1] = y;
        this.pos[i * 3 + 2] = z;
        this.prev[i * 3] = x;
        this.prev[i * 3 + 1] = y;
        this.prev[i * 3 + 2] = z;
        this.invMass[i] = mass > 0 ? 1 / mass : 0;
        this.pinned[i] = 0;
      }
    }
  }

  /**
   * Build structural, shear and bending distance constraints.
   *
   * Structural: horizontal + vertical neighbours (the "threads").
   * Shear:      the two diagonal neighbours (prevents shearing into a diamond).
   * Bending:    skip-one neighbours along rows and columns (resists folding).
   */
  _buildConstraints() {
    const { cols, rows } = this;
    // Always build into fresh plain arrays (reset() re-runs this after the
    // previous run already converted them to typed arrays).
    const ca = [], cb = [], rest = [], type = [], active = [];
    const add = (a, b, t) => {
      if (a < 0 || b < 0 || a >= this.count || b >= this.count) return;
      const ax = this.pos[a * 3], ay = this.pos[a * 3 + 1], az = this.pos[a * 3 + 2];
      const bx = this.pos[b * 3], by = this.pos[b * 3 + 1], bz = this.pos[b * 3 + 2];
      const r = Math.hypot(bx - ax, by - ay, bz - az);
      ca.push(a);
      cb.push(b);
      rest.push(r);
      type.push(t);
      active.push(1);
    };

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = this.index(c, r);
        const right = c + 1 < cols ? this.index(c + 1, r) : -1;
        const down = r + 1 < rows ? this.index(c, r + 1) : -1;
        const rDown = c + 1 < cols && r + 1 < rows ? this.index(c + 1, r + 1) : -1;
        const lDown = c - 1 >= 0 && r + 1 < rows ? this.index(c - 1, r + 1) : -1;
        const r2 = c + 2 < cols ? this.index(c + 2, r) : -1;
        const d2 = r + 2 < rows ? this.index(c, r + 2) : -1;

        // structural
        if (right >= 0) add(i, right, C_STRUCT);
        if (down >= 0) add(i, down, C_STRUCT);
        // shear (both diagonals)
        if (rDown >= 0) add(i, rDown, C_SHEAR);
        if (lDown >= 0) add(i, lDown, C_SHEAR);
        // bending (skip-one)
        if (r2 >= 0) add(i, r2, C_BEND);
        if (d2 >= 0) add(i, d2, C_BEND);
      }
    }

    // Convert the plain arrays to typed arrays for the solver.
    this.ca = Uint32Array.from(ca);
    this.cb = Uint32Array.from(cb);
    this.rest = Float32Array.from(rest);
    this.type = Uint8Array.from(type);
    this.active = Uint8Array.from(active);
    this.constraintCount = this.ca.length;
  }

  /** True if the constraint index is a structural or shear "thread" (tearable). */
  isTearable(i) {
    return this.type[i] === C_STRUCT || this.type[i] === C_SHEAR;
  }

  setPinned(i, on) {
    this.pinned[i] = on ? 1 : 0;
    this.invMass[i] = on ? 0 : (this.mass > 0 ? 1 / this.mass : 0);
    if (on) {
      // A freshly pinned particle should not carry old velocity.
      const o = i * 3;
      this.prev[o] = this.pos[o];
      this.prev[o + 1] = this.pos[o + 1];
      this.prev[o + 2] = this.pos[o + 2];
    }
  }

  pinTopLeft() { this._clearPins(); this.setPinned(this.index(0, 0), true); }
  pinTopRight() { this._clearPins(); this.setPinned(this.index(this.cols - 1, 0), true); }
  pinTopEdge() {
    this._clearPins();
    for (let c = 0; c < this.cols; c++) this.setPinned(this.index(c, 0), true);
  }
  pinCorners() {
    this._clearPins();
    this.setPinned(this.index(0, 0), true);
    this.setPinned(this.index(this.cols - 1, 0), true);
    this.setPinned(this.index(0, this.rows - 1), true);
    this.setPinned(this.index(this.cols - 1, this.rows - 1), true);
  }
  // Flag preset: pin the left edge vertically (a flag pole).
  pinLeftEdge() {
    this._clearPins();
    for (let r = 0; r < this.rows; r++) this.setPinned(this.index(0, r), true);
  }
  unpinAll() { this._clearPins(); }
  _clearPins() {
    for (let i = 0; i < this.count; i++) {
      if (this.pinned[i]) this.setPinned(i, false);
    }
  }

  /**
   * Rebuild the whole cloth from scratch (used by Reset). Re-lays the grid and
   * regenerates constraints, then re-applies the given pin layout.
   */
  reset(pinMode) {
    this._buildGrid();
    this._buildConstraints();
    this.force.fill(0);
    this.applyPinMode(pinMode);
  }

  applyPinMode(mode) {
    switch (mode) {
      case 'top-left': this.pinTopLeft(); break;
      case 'top-right': this.pinTopRight(); break;
      case 'top-edge': this.pinTopEdge(); break;
      case 'corners': this.pinCorners(); break;
      case 'left-edge': this.pinLeftEdge(); break;
      case 'none': this.unpinAll(); break;
      default: this.pinTopEdge();
    }
  }
}
