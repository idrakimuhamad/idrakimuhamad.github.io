// Fixed elevated 3/4 camera with cursor-anchored zoom and screen shake
// (plan §5.2). No orbit — strategy game view.
//
// Zooming (wheel or pinch) is anchored to a screen point: the ground point
// under the cursor/midpoint stays under it while the distance changes, which
// pans the view target as a side effect. The target is clamped to the map so
// the view can never get lost. `fitToAspect()` computes the distance at which
// the whole 24x16 map fits the current screen aspect; that is the zoom-out
// limit and the initial distance, so every aspect (desktop, portrait phone,
// ultrawide) starts with the full map visible.

import * as THREE from 'three';
import { COLS, ROWS } from '../core/defs';

const MAP_CENTER = new THREE.Vector3(COLS / 2, 0, ROWS / 2);
/** Camera direction from target: up + behind (south side of the map). */
const CAM_DIR = new THREE.Vector3(0, 0.82, 0.57).normalize();

const MIN_DIST = 13;
/** Margin so the map edges don't sit exactly on the screen edges. */
const FIT_MARGIN = 0.96;

export class Camera3D {
  readonly camera: THREE.PerspectiveCamera;
  /** View target on the ground plane (panned by anchored zoom). */
  readonly target = MAP_CENTER.clone();
  private dist: number;
  private maxDist = MIN_DIST;
  /** Fit distance of the previous aspect, to tell "user zoomed in" apart
   *  from "view was at whole-map" when the aspect changes. */
  private lastFit = 0;
  private readonly shakeOffset = new THREE.Vector3();
  private readonly raycaster = new THREE.Raycaster();
  private readonly groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private readonly _v = new THREE.Vector3();

  constructor(aspect: number) {
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 300);
    this.dist = this.fitToAspect();
    this.update(0, false);
  }

  get distance(): number {
    return this.dist;
  }

  /** Distance at which the whole map fits the current aspect (zoom-out limit). */
  get fitDistance(): number {
    return this.maxDist;
  }

  setAspect(aspect: number): void {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
    this.fitToAspect();
  }

  /**
   * Compute the distance at which the whole map fits the current aspect and
   * use it as the zoom-out limit. Returns the fit distance. Called on
   * resize so portrait/wide screens all see the full map.
   */
  fitToAspect(): number {
    // The NDC extent of the map corners shrinks as the camera moves away
    // along the fixed view direction. Grow the distance until all four
    // corners (with margin) are inside the frustum, then binary-search the
    // tightest distance.
    let d = MIN_DIST;
    let guard = 0;
    while (this.maxCornerNdc(d) > FIT_MARGIN && guard++ < 64) d *= 1.1;
    let lo = d / 1.1;
    let hi = d;
    for (let i = 0; i < 16; i++) {
      const mid = (lo + hi) / 2;
      if (this.maxCornerNdc(mid) > FIT_MARGIN) lo = mid;
      else hi = mid;
    }
    this.maxDist = hi;
    if (this.dist > this.maxDist) this.dist = this.maxDist;
    // If the view was sitting at the previous whole-map distance, follow the
    // new one (aspect changed, e.g. window resize / phone rotation). If the
    // user had zoomed in, keep their zoom.
    if (this.lastFit > 0 && Math.abs(this.dist - this.lastFit) < 1e-6) this.dist = hi;
    this.lastFit = hi;
    return this.maxDist;
  }

  /** Max |ndc| over the four map corners with the camera at distance d. */
  private maxCornerNdc(d: number): number {
    this.placeCameraAt(MAP_CENTER, d);
    let m = 0;
    for (const [x, z] of [[0, 0], [COLS, 0], [0, ROWS], [COLS, ROWS]] as const) {
      this._v.set(x, 0, z).project(this.camera);
      m = Math.max(m, Math.abs(this._v.x), Math.abs(this._v.y));
    }
    return m;
  }

  /**
   * Zoom to an absolute distance, anchored so the ground point under `ndc`
   * (screen space, -1..1) stays under the cursor. Pans the view target as
   * needed; the target is clamped to the map afterwards.
   */
  zoomTo(newDist: number, ndc: THREE.Vector2): void {
    newDist = THREE.MathUtils.clamp(newDist, MIN_DIST, this.maxDist);
    const before = this.groundPointAt(ndc, this.dist);
    this.dist = newDist;
    if (before) {
      const after = this.groundPointAt(ndc, this.dist);
      if (after) this.target.addScaledVector(this._v.subVectors(before, after), 1);
    }
    this.clampTarget();
  }

  /** Wheel zoom: deltaY > 0 zooms out. */
  zoomBy(deltaY: number, ndc: THREE.Vector2): void {
    this.zoomTo(this.dist + deltaY * 0.02, ndc);
  }

  /** Pinch zoom: scale the current distance by `factor`, anchored at `ndc`. */
  zoomScale(factor: number, ndc: THREE.Vector2): void {
    this.zoomTo(this.dist * factor, ndc);
  }

  /** Back to the default view: whole map, centered. */
  resetView(): void {
    this.target.copy(MAP_CENTER);
    this.dist = this.maxDist;
  }

  /** shake is the 2D shake value in px (0..~10); converted to world units. */
  update(shake: number, shakeEnabled: boolean): void {
    if (shakeEnabled && shake > 0) {
      const s = shake / 40; // px -> world units
      this.shakeOffset.set(
        (Math.random() - 0.5) * s,
        (Math.random() - 0.5) * s * 0.5,
        (Math.random() - 0.5) * s,
      );
    } else {
      this.shakeOffset.set(0, 0, 0);
    }
    this.camera.position
      .copy(this.target)
      .addScaledVector(CAM_DIR, this.dist)
      .add(this.shakeOffset);
    this.camera.lookAt(this.target);
  }

  // ------------------------------------------------------------- internals

  /**
   * Ground-plane point under screen point `ndc` for a hypothetical camera at
   * (target, dist). Temporarily moves the live camera (its projection is
   * already current); the per-frame update() repositions it afterwards.
   */
  private groundPointAt(ndc: THREE.Vector2, dist: number): THREE.Vector3 | null {
    this.placeCameraAt(this.target, dist);
    this.raycaster.setFromCamera(ndc, this.camera);
    const hit = new THREE.Vector3();
    const ok = this.raycaster.ray.intersectPlane(this.groundPlane, hit);
    return ok ? hit : null;
  }

  /** Move the live camera to (center + CAM_DIR*dist) looking at center. */
  private placeCameraAt(center: THREE.Vector3, dist: number): void {
    this.camera.position.copy(center).addScaledVector(CAM_DIR, dist);
    this.camera.lookAt(center);
    this.camera.updateMatrixWorld();
    this.camera.matrixWorldInverse.copy(this.camera.matrixWorld).invert();
  }

  private clampTarget(): void {
    this.target.x = THREE.MathUtils.clamp(this.target.x, 0, COLS);
    this.target.z = THREE.MathUtils.clamp(this.target.z, 0, ROWS);
  }
}
