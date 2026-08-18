import type { SaveData, Difficulty } from './types';

const KEY = 'lastBastion.save.v1';

const defaults = (): SaveData => ({
  settings: { music: 0.5, sfx: 0.7, quality: 'high' },
  difficulty: 'normal',
  bestWave: 0,
  discovered: [],
});

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults();
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    const d = defaults();
    return {
      settings: { ...d.settings, ...(parsed.settings ?? {}) },
      difficulty: (['easy', 'normal', 'hard'] as Difficulty[]).includes(parsed.difficulty as Difficulty) ? parsed.difficulty as Difficulty : d.difficulty,
      bestWave: typeof parsed.bestWave === 'number' ? parsed.bestWave : 0,
      discovered: Array.isArray(parsed.discovered) ? parsed.discovered.filter((x) => typeof x === 'string') : [],
    };
  } catch {
    return defaults();
  }
}

export function saveSave(data: SaveData): void {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* storage unavailable */ }
}
