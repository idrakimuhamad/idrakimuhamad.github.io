// Input: raycast mouse picking onto the ground plane, click place/select,
// right-click/Esc cancel, scroll zoom, and hotkeys (Q/W/E/R/T, 1/2/3, Space, D).
// Port of 2D `We` with 3D picking.

import * as THREE from 'three';
import { COLS, ROWS, TOWER_ORDER } from '../core/defs';
import type { Game } from '../core/game';
import type { Renderer } from '../render/renderer';

const GROUND_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

export class Input {
  private readonly detach: (() => void)[] = [];
  private readonly raycaster = new THREE.Raycaster();
  private readonly ndc = new THREE.Vector2();
  private readonly hit = new THREE.Vector3();

  constructor(
    private readonly game: Game,
    private readonly canvas: HTMLCanvasElement,
    private readonly renderer: Renderer,
  ) {
    this.attach();
  }

  private toWorld(clientX: number, clientY: number): THREE.Vector3 | null {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    this.ndc.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(this.ndc, this.renderer.camera3d.camera);
    return this.raycaster.ray.intersectPlane(GROUND_PLANE, this.hit) ? this.hit : null;
  }

  private attach(): void {
    const canvas = this.canvas;
    const g = this.game;

    const onMove = (e: PointerEvent) => {
      const p = this.toWorld(e.clientX, e.clientY);
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
    };

    const onLeave = () => {
      g.mouse.inside = false;
      g.hoverCell = null;
    };

    const onDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const p = this.toWorld(e.clientX, e.clientY);
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
    };

    const onContext = (e: MouseEvent) => {
      e.preventDefault();
      if (g.placing) g.setPlacing(null);
      else if (g.selectedTower) g.selectTower(null);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      this.renderer.zoom(e.deltaY);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'SELECT') return;
      switch (e.key) {
        case 'Escape':
          if (g.placing) g.setPlacing(null);
          else if (g.selectedTower) g.selectTower(null);
          else if (g.state === 'playing' && g.paused) g.togglePause();
          break;
        case ' ':
          e.preventDefault();
          if (g.state === 'playing') g.togglePause();
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

    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('mousedown', onDown);
    canvas.addEventListener('contextmenu', onContext);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    this.detach.push(
      () => canvas.removeEventListener('pointermove', onMove),
      () => canvas.removeEventListener('mouseleave', onLeave),
      () => canvas.removeEventListener('mousedown', onDown),
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
