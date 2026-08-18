// Settings store: localStorage persistence. Port of 2D `ae`.
// New key so the 3D game doesn't share settings with the 2D game (plan §11.3).

import type { SettingsData, SettingsStore } from './core/types';

const STORAGE_KEY = 'gridlock-defense-3d-settings-v1';

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

export class Settings implements SettingsStore {
  data: SettingsData = { ...DEFAULT_SETTINGS };

  constructor() {
    this.load();
  }

  load(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<SettingsData>;
        this.data = { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch {
      this.data = { ...DEFAULT_SETTINGS };
    }
  }

  save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch {
      // storage unavailable (private mode) — settings just won't persist
    }
  }

  set<K extends keyof SettingsData>(key: K, value: SettingsData[K]): void {
    this.data[key] = value;
    this.save();
  }

  reset(): void {
    this.data = { ...DEFAULT_SETTINGS };
    this.save();
  }
}
