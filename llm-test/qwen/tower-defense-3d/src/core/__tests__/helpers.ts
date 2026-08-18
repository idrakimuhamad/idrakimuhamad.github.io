// Shared test helpers for the core port.

import { Game } from '../game';
import type { GameCallbacks, SettingsData, SettingsStore, SfxName } from '../types';

export const DEFAULT_SETTINGS: SettingsData = {
  difficulty: 'normal',
  damageNumbers: true,
  healthBars: true,
  autoStartWaves: false,
  particleEffects: true,
  projectileTrails: true,
  screenShake: true,
  quality: 'high',
  debug: false,
  sound: true,
  volume: 0.6,
};

export function mockSettings(): SettingsStore {
  const data: SettingsData = { ...DEFAULT_SETTINGS };
  return {
    data,
    set: (k, v) => {
      (data as unknown as Record<string, unknown>)[k] = v;
    },
  };
}

export interface CbCapture {
  states: string[];
  huds: unknown[];
  toasts: { msg: string; kind: string }[];
  selected: unknown[];
  builds: unknown[];
  ends: { result: string; stats: unknown }[];
  cb: GameCallbacks;
}

export function captureCbs(): CbCapture {
  const states: string[] = [];
  const huds: unknown[] = [];
  const toasts: { msg: string; kind: string }[] = [];
  const selected: unknown[] = [];
  const builds: unknown[] = [];
  const ends: { result: string; stats: unknown }[] = [];
  const cb: GameCallbacks = {
    onStateChange: (s) => states.push(s),
    onHudUpdate: (h) => huds.push(h),
    onToast: (msg, kind) => toasts.push({ msg, kind }),
    onSelectedTower: (t) => selected.push(t),
    onBuildSelection: (k) => builds.push(k),
    onEndScreen: (result, stats) => ends.push({ result, stats }),
  };
  return { states, huds, toasts, selected, builds, ends, cb };
}

export interface TestGame {
  game: Game;
  settings: SettingsStore;
  cap: CbCapture;
  sfx: SfxName[];
}

export function createGame(difficulty: 'easy' | 'normal' | 'hard' = 'normal'): TestGame {
  const settings = mockSettings();
  const cap = captureCbs();
  const sfx: SfxName[] = [];
  const game = new Game(settings, (n) => sfx.push(n), cap.cb);
  return { game, settings, cap, sfx };
}
