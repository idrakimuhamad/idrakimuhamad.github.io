// Input: single-finger touch drag-pan, tap-to-place, and two-finger pinch.
//
// The Input class is DOM-light: it only needs a canvas with
// add/removeEventListener + getBoundingClientRect and a renderer exposing
// camera3d.camera + zoom/pan methods. We feed it synthetic pointer events
// (plain objects carrying the properties Input reads) and assert on the
// renderer pan/zoom calls and the game's placement state.
//
// Camera pose: (12.3, 10, 18.2) looking at (12.3, 0, 8.2), so the screen
// center (480, 320) of the 960x640 canvas raycasts to world (12.3, 8.2)
// -> cell (12, 8), a buildable grass cell (interior, not on a boundary).

import { describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import { Input } from '../input';
import type { Renderer } from '../../render/renderer';
import { createGame } from '../../core/__tests__/helpers';

// Input attaches a window keydown listener; node has no window.
const windowStub = { addEventListener: vi.fn(), removeEventListener: vi.fn() };
(globalThis as Record<string, unknown>).window = windowStub;

interface FakePointer {
  pointerId: number;
  pointerType: string;
  clientX: number;
  clientY: number;
  button: number;
  buttons: number;
  preventDefault(): void;
}

type AnyListener = (e: unknown) => void;

function makeEnv() {
  const listeners = new Map<string, AnyListener[]>();
  const canvas = {
    addEventListener: (type: string, fn: AnyListener) => {
      const list = listeners.get(type) ?? [];
      list.push(fn);
      listeners.set(type, list);
    },
    removeEventListener: (type: string, fn: AnyListener) => {
      const list = listeners.get(type) ?? [];
      listeners.set(type, list.filter((f) => f !== fn));
    },
    getBoundingClientRect: () => ({
      left: 0, top: 0, width: 960, height: 640,
      x: 0, y: 0, right: 960, bottom: 640, toJSON: () => ({}),
    }),
  } as unknown as HTMLCanvasElement;

  const camera = new THREE.PerspectiveCamera(45, 960 / 640, 0.1, 300);
  camera.position.set(12.3, 10, 18.2);
  camera.lookAt(12.3, 0, 8.2);
  camera.updateMatrixWorld();
  camera.matrixWorldInverse.copy(camera.matrixWorld).invert();

  const panBy = vi.fn();
  const zoomScale = vi.fn();
  const zoomBy = vi.fn();
  const renderer = { camera3d: { camera }, panBy, zoomScale, zoomBy } as unknown as Renderer;

  const { game } = createGame();
  game.start('normal');
  const input = new Input(game, canvas, renderer);

  const fire = (type: string, e: FakePointer) => {
    for (const fn of listeners.get(type) ?? []) fn(e);
  };
  const pointer = (
    pointerId: number, clientX: number, clientY: number,
    pointerType: 'touch' | 'mouse' = 'touch', buttons = 1, button = 0,
  ): FakePointer => ({ pointerId, clientX, clientY, pointerType, buttons, button, preventDefault: () => {} });

  return { game, input, fire, pointer, panBy, zoomScale, zoomBy, destroy: () => input.destroy() };
}

describe('single-finger touch drag-pan', () => {
  it('a single-finger touch drag past 12px pans the view', () => {
    const env = makeEnv();
    env.fire('pointerdown', env.pointer(1, 480, 320));
    for (let i = 1; i <= 10; i++) {
      env.fire('pointermove', env.pointer(1, 480 + i * 8, 320)); // 8px steps
    }
    env.fire('pointerup', env.pointer(1, 560, 320));
    // the first move past the 12px threshold starts the pan; every move
    // after that calls panBy (8 of the 10 moves qualify)
    expect(env.panBy.mock.calls.length).toBeGreaterThanOrEqual(5);
    env.destroy();
  });

  it('a touch drag cancels the tap: no tower is placed', () => {
    const env = makeEnv();
    env.game.setPlacing('cannon');
    env.fire('pointerdown', env.pointer(1, 480, 320));
    for (let i = 1; i <= 10; i++) {
      env.fire('pointermove', env.pointer(1, 480 + i * 8, 320));
    }
    env.fire('pointerup', env.pointer(1, 560, 320));
    expect(env.game.towers.length).toBe(0); // tap canceled by the drag
    env.destroy();
  });

  it('a quick single-finger tap still places a tower (no pan)', () => {
    const env = makeEnv();
    env.game.setPlacing('cannon');
    env.fire('pointerdown', env.pointer(1, 480, 320));
    env.fire('pointermove', env.pointer(1, 483, 318)); // 3.6px < 12
    env.fire('pointerup', env.pointer(1, 483, 318));
    expect(env.game.towers.length).toBe(1);
    expect(env.game.towers[0].c).toBe(12);
    expect(env.game.towers[0].r).toBe(8);
    expect(env.panBy).not.toHaveBeenCalled();
    env.destroy();
  });

  it('a second finger down cancels the single-finger drag and switches to pinch', () => {
    const env = makeEnv();
    // start a single-finger drag-pan...
    env.fire('pointerdown', env.pointer(1, 480, 320));
    env.fire('pointermove', env.pointer(1, 500, 320)); // 20px -> drag starts
    env.fire('pointermove', env.pointer(1, 520, 320)); // panBy #1
    const pansBeforePinch = env.panBy.mock.calls.length;
    expect(pansBeforePinch).toBeGreaterThanOrEqual(1);
    // ...then a second finger goes down: pinch mode, drag-pan canceled
    env.fire('pointerdown', env.pointer(2, 560, 320));
    // spread the fingers: pinch zoom anchored at the midpoint
    env.fire('pointermove', env.pointer(1, 460, 320));
    env.fire('pointermove', env.pointer(2, 580, 320));
    expect(env.zoomScale.mock.calls.length).toBe(2);
    // no further single-finger drag-pan after the second finger went down
    expect(env.panBy.mock.calls.length).toBe(pansBeforePinch);
    // lifting both fingers leaves a clean state (no stray tap)
    env.fire('pointerup', env.pointer(1, 460, 320));
    env.fire('pointerup', env.pointer(2, 580, 320));
    env.destroy();
  });

  it('two-finger pinch zoom+pan works from the start (no single-finger phase)', () => {
    const env = makeEnv();
    env.fire('pointerdown', env.pointer(1, 440, 320));
    env.fire('pointerdown', env.pointer(2, 520, 320)); // pinch mode immediately
    env.fire('pointermove', env.pointer(1, 420, 320));
    env.fire('pointermove', env.pointer(2, 540, 320));
    expect(env.zoomScale.mock.calls.length).toBe(2);
    expect(env.panBy).not.toHaveBeenCalled();
    env.destroy();
  });
});

describe('mouse drag-pan regression', () => {
  it('quick mouse click still places a tower', () => {
    const env = makeEnv();
    env.game.setPlacing('cannon');
    env.fire('pointerdown', env.pointer(1, 480, 320, 'mouse'));
    env.fire('pointerup', env.pointer(1, 480, 320, 'mouse'));
    expect(env.game.towers.length).toBe(1);
    expect(env.panBy).not.toHaveBeenCalled();
    env.destroy();
  });

  it('mouse left-drag past the threshold pans and does not place', () => {
    const env = makeEnv();
    env.game.setPlacing('cannon');
    env.fire('pointerdown', env.pointer(1, 300, 320, 'mouse'));
    env.fire('pointermove', env.pointer(1, 340, 320, 'mouse')); // 40px -> drag
    env.fire('pointermove', env.pointer(1, 380, 320, 'mouse')); // pan
    env.fire('pointerup', env.pointer(1, 380, 320, 'mouse'));
    expect(env.panBy.mock.calls.length).toBeGreaterThanOrEqual(1);
    expect(env.game.towers.length).toBe(0); // drag is not a click
    env.destroy();
  });

  it('middle-mouse drag pans immediately (no threshold)', () => {
    const env = makeEnv();
    env.fire('pointerdown', env.pointer(1, 480, 320, 'mouse', 4, 1));
    env.fire('pointermove', env.pointer(1, 500, 320, 'mouse', 4, 1));
    expect(env.panBy.mock.calls.length).toBe(1);
    env.fire('pointerup', env.pointer(1, 500, 320, 'mouse', 4, 1));
    env.destroy();
  });
});
