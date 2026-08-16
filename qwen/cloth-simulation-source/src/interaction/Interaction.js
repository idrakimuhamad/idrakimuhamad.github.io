// Interaction — maps pointer input (mouse / touch / stylus) to simulation
// actions: dragging cloth, orbiting the camera, zooming, and pin/unpin.
//
// Modes:
//   * "drag"  (default) — primary button drags cloth; dragging empty space or
//     the right button orbits the camera; wheel/pinch zooms.
//   * "pin"   — tapping a particle toggles its pin state.
//
// We use Pointer Events so mouse, touch and pen share one code path. Multi-
// touch: two pointers => pinch zoom (and rotate on twist).

export class Interaction {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {object} sim
   * @param {object} renderer
   */
  constructor(canvas, sim, renderer) {
    this.canvas = canvas;
    this.sim = sim;
    this.renderer = renderer;

    this.mode = 'drag'; // 'drag' | 'pin'

    // pointer tracking
    this.pointers = new Map(); // pointerId -> {x, y}
    this.lastPinch = 0;
    this.lastTwist = 0;

    this.action = null; // 'drag-cloth' | 'orbit' | 'pin'
    this.grabIndex = -1;
    this.grabDepth = 0;
    this.grabOffset = [0, 0, 0];
    this.dragRadius = 1.1;

    this._bind();
  }

  setMode(mode) {
    this.mode = mode;
    this.canvas.classList.toggle('pin-mode', mode === 'pin');
  }

  _ndc(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    return [x, y];
  }

  _bind() {
    const c = this.canvas;
    c.addEventListener('pointerdown', (e) => this._down(e));
    c.addEventListener('pointermove', (e) => this._move(e));
    window.addEventListener('pointerup', (e) => this._up(e));
    window.addEventListener('pointercancel', (e) => this._up(e));
    c.addEventListener('wheel', (e) => this._wheel(e), { passive: false });
    // prevent context menu so right-drag orbit works
    c.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  _down(e) {
    this.canvas.setPointerCapture && this.canvas.setPointerCapture(e.pointerId);
    const rect = this.canvas.getBoundingClientRect();
    this.pointers.set(e.pointerId, { x: e.clientX - rect.left, y: e.clientY - rect.top });

    // two pointers => pinch mode
    if (this.pointers.size === 2) {
      this.action = 'pinch';
      this.grabIndex = -1;
      this.sim.clearDrag();
      const pts = [...this.pointers.values()];
      this.lastPinch = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      this.lastTwist = Math.atan2(pts[1].y - pts[0].y, pts[1].x - pts[0].x);
      return;
    }

    const [ndcX, ndcY] = this._ndc(e);

    // Right button or middle => orbit regardless of mode
    const orbitButton = e.button === 2 || e.button === 1;

    if (this.mode === 'pin' && !orbitButton) {
      // Pin mode: try to pick a particle to toggle
      const ray = this.renderer.rayFromNDC(ndcX, ndcY);
      const idx = this.sim.pickRay(ray.origin, ray.dir, this.dragRadius);
      if (idx >= 0) {
        const c = this.sim.cloth;
        c.setPinned(idx, !c.pinned[idx]);
        this.action = 'pin';
        return;
      }
      // no particle hit => fall through to orbit
      this.action = 'orbit';
      return;
    }

    // Drag mode
    if (orbitButton) {
      this.action = 'orbit';
      return;
    }
    const ray = this.renderer.rayFromNDC(ndcX, ndcY);
    const idx = this.sim.pickRay(ray.origin, ray.dir, this.dragRadius);
    if (idx >= 0) {
      this.action = 'drag-cloth';
      this.grabIndex = idx;
      const o = idx * 3;
      const pos = this.sim.cloth.pos;
      // depth of the grabbed particle from the camera origin
      this.grabDepth = Math.hypot(
        pos[o] - ray.origin[0],
        pos[o + 1] - ray.origin[1],
        pos[o + 2] - ray.origin[2]
      );
      this.sim.setDrag(idx, pos[o], pos[o + 1], pos[o + 2]);
      this.canvas.classList.add('dragging');
    } else {
      // clicked empty space => orbit
      this.action = 'orbit';
    }
  }

  _move(e) {
    if (!this.pointers.has(e.pointerId)) return;
    const rect = this.canvas.getBoundingClientRect();
    const prev = this.pointers.get(e.pointerId);
    const cur = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    this.pointers.set(e.pointerId, cur);

    if (this.action === 'pinch' && this.pointers.size >= 2) {
      const pts = [...this.pointers.values()];
      const pinch = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const twist = Math.atan2(pts[1].y - pts[0].y, pts[1].x - pts[0].x);
      if (this.lastPinch > 0) {
        const zoom = this.lastPinch / pinch;
        this.renderer.zoom(zoom);
        this.renderer.orbit(twist - this.lastTwist, 0);
      }
      this.lastPinch = pinch;
      this.lastTwist = twist;
      return;
    }

    const dx = cur.x - prev.x;
    const dy = cur.y - prev.y;

    if (this.action === 'orbit') {
      // drag right => rotate azimuth; drag down => rotate polar
      this.renderer.orbit(dx * 0.008, dy * 0.008);
    } else if (this.action === 'drag-cloth' && this.grabIndex >= 0) {
      const [ndcX, ndcY] = this._ndc(e);
      const p = this.renderer.rayPointAt(ndcX, ndcY, this.grabDepth);
      this.sim.setDrag(this.grabIndex, p[0], p[1], p[2]);
    }
  }

  _up(e) {
    this.pointers.delete(e.pointerId);
    if (this.pointers.size === 0) {
      if (this.action === 'drag-cloth') {
        this.sim.clearDrag();
        this.canvas.classList.remove('dragging');
      }
      this.action = null;
      this.grabIndex = -1;
    } else if (this.pointers.size === 1) {
      // dropped from pinch to single pointer; reset pinch state
      this.lastPinch = 0;
      this.action = 'orbit';
    }
  }

  _wheel(e) {
    e.preventDefault();
    const factor = Math.exp(e.deltaY * 0.001);
    this.renderer.zoom(factor);
  }
}
