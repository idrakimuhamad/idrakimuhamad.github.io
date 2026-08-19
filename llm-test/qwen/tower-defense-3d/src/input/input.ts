// Input: raycast picking onto the ground plane, click/tap place/select,
// drag-pan (left-drag past the tap threshold, single-finger touch drag
// past the tap threshold, or middle-mouse drag), right-click cancel,
// cursor-anchored scroll zoom, two-finger pinch zoom + pan, and hotkeys
// (Q/W/E/R/T, 1/2/3, Space = start wave, Esc = pause/close, D = debug).
// Port of 2D `We` with 3D picking + touch support.
//
// Drag-pan vs click: a press (mouse left button or single touch) that moves
// more than TAP_MAX_MOVE (12px) before release becomes a PAN and cancels
// the click/tap, so quick clicks/taps still place towers / select while
// drags move the view focus anywhere. A second touch finger down cancels
// the single-finger drag-pan and switches to pinch zoom+pan.

import * as THREE from 'three';
import { COLS, ROWS, TOWER_ORDER } from '../core/defs';
import type { Game } from '../core/game';
import type { Renderer } from '../render/renderer';

const GROUND_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
/** Tap: max movement (px) and duration (ms) before it stops being a tap. */
const TAP_MAX_MOVE = 12;
const TAP_MAX_MS = 600;

export class Input {
  private readonly detach: (() => void)[] = [];
  private readonly raycaster = new THREE.Raycaster();
  private readonly ndc = new THREE.Vector2();
  private readonly hit = new THREE.Vector3();
  /** Active pointers (mouse and/or touch), for pinch + tap detection. */
  private readonly pointers = new Map<number, { x: number; y: number; type: string; button: number }>();
  private pinchPrev: { dist: number; ndc: THREE.Vector2 } | null = null;
  private tapInfo: { x: number; y: number; t: number; id: number } | null = null;
  /** Active drag-pan (left past the tap threshold, or middle-mouse). */
  private dragPan: { id: number; x: number; y: number } | null = null;

  constructor(
    private readonly game: Game,
    private readonly canvas: HTMLCanvasElement,
    private readonly renderer: Renderer,
  ) {
    this.attach();
  }

  // ------------------------------------------------------------- picking

  private toNdc(clientX: number, clientY: number): THREE.Vector2 | null {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    this.ndc.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    return this.ndc;
  }

  private toWorld(clientX: number, clientY: number): THREE.Vector3 | null {
    if (!this.toNdc(clientX, clientY)) return null;
    this.raycaster.setFromCamera(this.ndc, this.renderer.camera3d.camera);
    return this.raycaster.ray.intersectPlane(GROUND_PLANE, this.hit) ? this.hit : null;
  }

  /** Click/tap action: place the ghost tower or select/deselect. */
  private handleClick(clientX: number, clientY: number): void {
    const g = this.game;
    const p = this.toWorld(clientX, clientY);
    if (!p || p.x < 0 || p.x >= COLS || p.z < 0 || p.z >= ROWS) return;
    const c = { c: Math.floor(p.x), r: Math.floor(p.z) };
    if (!g.grid.inBounds(c.c, c.r)) return;
    if (g.state !== 'playing' || g.paused) return;
    if (g.placing) {
      g.placeAt(c.c, c.r);
    } else {
      const occ = g.grid.towerAtCell(c.c, c.r);
      if (occ) {
        const tower = g.towers.find((t) => t.id === occ.id) ?? null;
        g.selectTower(tower);
      } else {
        g.selectTower(null);
      }
    }
  }

  private updateHover(clientX: number, clientY: number): void {
    const g = this.game;
    const p = this.toWorld(clientX, clientY);
    if (!p) {
      g.mouse.inside = false;
      g.hoverCell = null;
      return;
    }
    g.mouse.x = p.x;
    g.mouse.z = p.z;
    g.mouse.inside = p.x >= 0 && p.x < COLS && p.z >= 0 && p.z < ROWS;
    if (g.mouse.inside) {
      g.hoverCell = {
        c: Math.max(0, Math.min(COLS - 1, Math.floor(p.x))),
        r: Math.max(0, Math.min(ROWS - 1, Math.floor(p.z))),
      };
      if (g.placing) {
        const res = g.canPlace(g.placing, g.hoverCell.c, g.hoverCell.r);
        g.hoverValid = res.ok;
        g.hoverReason = res.reason;
      }
    } else {
      g.hoverCell = null;
    }
  }

  // ------------------------------------------------------------- events

  private attach(): void {
    const canvas = this.canvas;
    const g = this.game;

    const onPointerDown = (e: PointerEvent) => {
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY, type: e.pointerType, button: e.button });
      if (this.pointers.size === 2) {
        // Two fingers down: pinch/pan mode; cancel any pending tap or drag.
        this.tapInfo = null;
        this.dragPan = null;
        const [a, b] = [...this.pointers.values()];
        this.pinchPrev = {
          dist: Math.hypot(a.x - b.x, a.y - b.y),
          ndc: this.toNdc((a.x + b.x) / 2, (a.y + b.y) / 2)!.clone(),
        };
      } else if (this.pointers.size === 1) {
        this.tapInfo = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId };
        // Middle-mouse drag is an explicit pan (no tap threshold).
        if (e.pointerType === 'mouse' && e.button === 1) {
          e.preventDefault(); // stop the browser's middle-click autoscroll
          this.dragPan = { id: e.pointerId, x: e.clientX, y: e.clientY };
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const prev = this.pointers.get(e.pointerId);
      if (prev) {
        prev.x = e.clientX;
        prev.y = e.clientY;
      }
      if (this.pointers.size === 2 && this.pinchPrev) {
        const [a, b] = [...this.pointers.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist > 0 && this.pinchPrev.dist > 0) {
          // Anchor the PREVIOUS midpoint: keeps the world point under the
          // fingers glued to them, which zooms by the pinch ratio AND pans
          // by the midpoint's screen movement.
          this.renderer.zoomScale(this.pinchPrev.dist / dist, this.pinchPrev.ndc);
        }
        this.pinchPrev = {
          dist: dist,
          ndc: this.toNdc((a.x + b.x) / 2, (a.y + b.y) / 2)!.clone(),
        };
        return;
      }
      // Drag-pan: middle-mouse pans immediately; left-mouse starts panning
      // once the press has moved past the tap threshold (a quick click still
      // places/selects — see onPointerEnd). The ground under the cursor
      // follows the cursor 1:1 (Camera3D.panBy).
      const dp = this.dragPan;
      if (dp && dp.id === e.pointerId) {
        const ndc = this.toNdc(e.clientX, e.clientY);
        if (ndc) this.renderer.panBy(e.clientX - dp.x, e.clientY - dp.y, ndc);
        dp.x = e.clientX;
        dp.y = e.clientY;
      } else if (
        this.tapInfo && this.tapInfo.id === e.pointerId &&
        (
          (e.pointerType === 'mouse' && (e.buttons & 1)) || // left button held
          // (pointermove reports button=-1 while dragging, so use the
          //  `buttons` bitmask, not `button`)
          e.pointerType === 'touch' // single-finger touch drag; a second
        ) // finger down cancels this via the size===2 pinch branch
        &&
        Math.hypot(e.clientX - this.tapInfo.x, e.clientY - this.tapInfo.y) > TAP_MAX_MOVE
      ) {
        this.dragPan = { id: e.pointerId, x: e.clientX, y: e.clientY };
      }
      this.updateHover(e.clientX, e.clientY);
    };

    const onPointerEnd = (e: PointerEvent) => {
      this.pointers.delete(e.pointerId);
      if (this.pointers.size < 2) this.pinchPrev = null;
      if (this.dragPan?.id === e.pointerId) this.dragPan = null;
      const tap = this.tapInfo;
      if (tap && tap.id === e.pointerId && this.pointers.size === 0) {
        const moved = Math.hypot(e.clientX - tap.x, e.clientY - tap.y);
        if (performance.now() - tap.t < TAP_MAX_MS && moved < TAP_MAX_MOVE) {
          this.handleClick(e.clientX, e.clientY);
        }
      }
      if (this.pointers.size === 0) this.tapInfo = null;
    };

    const onLeave = () => {
      g.mouse.inside = false;
      g.hoverCell = null;
      // The mouse may have been released outside the canvas (no pointerup
      // will arrive): drop stuck mouse pointer state so the next click
      // starts clean (no phantom pinch, no stuck drag-pan).
      for (const [id, p] of [...this.pointers]) {
        if (p.type !== 'mouse') continue;
        this.pointers.delete(id);
        if (this.dragPan?.id === id) this.dragPan = null;
        if (this.tapInfo?.id === id) this.tapInfo = null;
      }
      if (this.pointers.size < 2) this.pinchPrev = null;
    };

    const onContext = (e: MouseEvent) => {
      e.preventDefault();
      if (g.placing) g.setPlacing(null);
      else if (g.selectedTower) g.selectTower(null);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const ndc = this.toNdc(e.clientX, e.clientY);
      if (ndc) this.renderer.zoomBy(e.deltaY, ndc);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'SELECT') return;
      switch (e.key) {
        case 'Escape':
          // (Open modals close themselves first — see UI's capture handler.)
          if (g.placing) g.setPlacing(null);
          else if (g.selectedTower) g.selectTower(null);
          else if (g.state === 'playing') g.togglePause();
          break;
        case ' ':
          e.preventDefault();
          if (g.state === 'playing' && !g.paused) g.startWaveEarly();
          break;
        case '1':
          g.setSpeed(1);
          break;
        case '2':
          g.setSpeed(2);
          break;
        case '3':
          g.setSpeed(4);
          break;
        case 'd':
        case 'D':
          g.toggleDebug();
          break;
      }
      const idx = { q: 0, w: 1, e: 2, r: 3, t: 4 }[e.key.toLowerCase()];
      if (idx !== undefined && g.state === 'playing') {
        const kind = TOWER_ORDER[idx];
        g.setPlacing(g.placing === kind ? null : kind);
      }
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerEnd);
    canvas.addEventListener('pointercancel', onPointerEnd);
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('contextmenu', onContext);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    this.detach.push(
      () => canvas.removeEventListener('pointerdown', onPointerDown),
      () => canvas.removeEventListener('pointermove', onPointerMove),
      () => canvas.removeEventListener('pointerup', onPointerEnd),
      () => canvas.removeEventListener('pointercancel', onPointerEnd),
      () => canvas.removeEventListener('mouseleave', onLeave),
      () => canvas.removeEventListener('contextmenu', onContext),
      () => canvas.removeEventListener('wheel', onWheel),
      () => window.removeEventListener('keydown', onKeyDown),
    );
  }

  destroy(): void {
    this.detach.forEach((d) => d());
    this.detach.length = 0;
  }
}
