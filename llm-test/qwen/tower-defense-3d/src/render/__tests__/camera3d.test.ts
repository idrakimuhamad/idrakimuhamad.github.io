// Camera3D: drag-pan (ground follows the cursor 1:1), relaxed target clamp
// (map + forest margin), and regression checks for anchored zoom / reset.

import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { COLS, ROWS } from '../../core/defs';
import { Camera3D, PAN_MARGIN } from '../camera3d';

const W = 960; // test viewport (CSS px)
const H = 640;

function makeCam(): Camera3D {
  const cam = new Camera3D(W / H);
  cam.setViewport(W, H);
  cam.update(0, false);
  return cam;
}

/** Screen px (top-left origin) -> NDC. */
function pxToNdc(px: number, py: number): THREE.Vector2 {
  return new THREE.Vector2(px / (W * 0.5) - 1, 1 - py / (H * 0.5));
}

/** Ground-plane point under a screen position (px, top-left origin). */
function groundAt(cam: Camera3D, px: number, py: number): THREE.Vector3 {
  cam.update(0, false);
  cam.camera.updateMatrixWorld();
  const rc = new THREE.Raycaster();
  rc.setFromCamera(pxToNdc(px, py), cam.camera);
  const hit = new THREE.Vector3();
  if (!rc.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hit)) {
    throw new Error('ray missed the ground plane');
  }
  return hit;
}

describe('Camera3D drag-pan', () => {
  it('starts centered on the map', () => {
    const cam = makeCam();
    expect(cam.target.x).toBeCloseTo(COLS / 2, 5);
    expect(cam.target.z).toBeCloseTo(ROWS / 2, 5);
  });

  it('drag right moves the target left (ground follows the cursor right)', () => {
    const cam = makeCam();
    const x0 = cam.target.x;
    cam.panBy(100, 0, pxToNdc(W / 2, H / 2));
    expect(cam.target.x).toBeLessThan(x0);
    cam.panBy(-100, 0, pxToNdc(W / 2, H / 2));
    expect(cam.target.x).toBeCloseTo(x0, 4); // symmetric: back where we started
  });

  it('drag down moves the target away (north), ground follows the cursor down', () => {
    const cam = makeCam();
    const z0 = cam.target.z;
    cam.panBy(0, 100, pxToNdc(W / 2, H / 2));
    expect(cam.target.z).toBeLessThan(z0);
    // (A single large vertical step is not its own inverse: the ground span
    // per pixel is perspective-asymmetric vertically. Small incremental
    // deltas — as in a real drag — track 1:1, covered by the test below.)
    cam.panBy(0, -100, pxToNdc(W / 2, H / 2));
    expect(cam.target.z).toBeGreaterThan(z0 - 1);
    expect(cam.target.z).toBeLessThan(z0);
  });

  it('the ground point under the cursor follows the cursor 1:1', () => {
    const cam = makeCam();
    const cx = W * 0.6, cy = H * 0.4; // off-center cursor
    const dx = 180, dy = -90;
    // ground under the OLD cursor position, before the pan
    const before = groundAt(cam, cx - dx, cy - dy);
    cam.panBy(dx, dy, pxToNdc(cx, cy));
    // ...must now sit under the NEW cursor position
    const after = groundAt(cam, cx, cy);
    expect(after.x).toBeCloseTo(before.x, 4);
    expect(after.z).toBeCloseTo(before.z, 4);
  });

  it('pan scales with the viewport size (px -> NDC conversion)', () => {
    const a = makeCam();
    const b = makeCam();
    b.setViewport(W * 2, H * 2); // same aspect, 2x pixel density
    a.panBy(100, 0, pxToNdc(W / 2, H / 2));
    b.panBy(200, 0, new THREE.Vector2(0, 0)); // same fraction of the screen
    expect(b.target.x).toBeCloseTo(a.target.x, 4);
  });

  it('clamps the target to the map + forest margin (can reach the forest, not the void)', () => {
    const cam = makeCam();
    // Drag hard to the right: target should stop at -PAN_MARGIN (and go
    // negative — the old 0..COLS clamp would have stopped it at the map edge).
    for (let i = 0; i < 20; i++) cam.panBy(400, 0, pxToNdc(W / 2, H / 2));
    expect(cam.target.x).toBeCloseTo(-PAN_MARGIN, 5);
    expect(cam.target.x).toBeLessThan(0);
    // Drag hard down-left: target stops at the far (north) margin.
    for (let i = 0; i < 20; i++) cam.panBy(0, 400, pxToNdc(W / 2, H / 2));
    expect(cam.target.z).toBeCloseTo(-PAN_MARGIN, 5);
    // And the opposite corners.
    for (let i = 0; i < 40; i++) cam.panBy(-400, -400, pxToNdc(W / 2, H / 2));
    expect(cam.target.x).toBeCloseTo(COLS + PAN_MARGIN, 5);
    expect(cam.target.z).toBeCloseTo(ROWS + PAN_MARGIN, 5);
  });

  it('zoom stays anchored to the cursor after panning', () => {
    const cam = makeCam();
    const cx = W * 0.3, cy = H * 0.7;
    cam.panBy(120, 60, pxToNdc(cx, cy));
    const before = groundAt(cam, cx, cy);
    cam.zoomTo(16, pxToNdc(cx, cy));
    const after = groundAt(cam, cx, cy);
    expect(after.x).toBeCloseTo(before.x, 3);
    expect(after.z).toBeCloseTo(before.z, 3);
    expect(cam.distance).toBeCloseTo(16, 5);
  });

  it('resetView returns to the whole-map view', () => {
    const cam = makeCam();
    cam.panBy(200, 100, pxToNdc(W / 2, H / 2));
    cam.zoomTo(15, pxToNdc(W / 2, H / 2));
    cam.resetView();
    expect(cam.target.x).toBeCloseTo(COLS / 2, 5);
    expect(cam.target.z).toBeCloseTo(ROWS / 2, 5);
    expect(cam.distance).toBeCloseTo(cam.fitDistance, 5);
  });
});
