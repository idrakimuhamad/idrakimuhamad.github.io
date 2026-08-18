// Fixed elevated 3/4 camera with scroll zoom and screen shake (plan §5.2).
// No orbit — strategy game view. The whole 24x16 map is visible at default zoom.

import * as THREE from 'three';

const MAP_CENTER = new THREE.Vector3(12, 0, 8);
/** Camera direction from target: up + behind (south side of the map). */
const CAM_DIR = new THREE.Vector3(0, 0.82, 0.57).normalize();

const MIN_DIST = 13;
const MAX_DIST = 42;
const DEFAULT_DIST = 26;

export class Camera3D {
  readonly camera: THREE.PerspectiveCamera;
  private dist = DEFAULT_DIST;
  private readonly shakeOffset = new THREE.Vector3();

  constructor(aspect: number) {
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 300);
    this.update(0, false);
  }

  setAspect(aspect: number): void {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  /** Scroll zoom: deltaY > 0 zooms out. */
  zoom(deltaY: number): void {
    this.dist = THREE.MathUtils.clamp(this.dist + deltaY * 0.02, MIN_DIST, MAX_DIST);
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
      .copy(MAP_CENTER)
      .addScaledVector(CAM_DIR, this.dist)
      .add(this.shakeOffset);
    this.camera.lookAt(MAP_CENTER);
  }
}
