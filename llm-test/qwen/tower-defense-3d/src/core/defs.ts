// ALL game data — ported 1:1 from the 2D original (plan §8).
// Values are kept in 2D PIXEL units exactly as in the original bundle;
// convert to world units with px2w() (1 world unit = 40 px = 1 grid cell).

import type { Difficulty, EnemyKind, TowerKind } from './types';
import { T_BASE, T_ROCK, T_WATER } from './types';

/** Pixel scale of the 2D original: 1 grid cell = 40 px = 1 world unit. */
export const PX_PER_UNIT = 40;
/** Convert a 2D pixel value to world units. */
export const px2w = (px: number): number => px / PX_PER_UNIT;

export const COLS = 24;
export const ROWS = 16;

/** Spawn portal cell (2D `M`). */
export const SPAWN = { c: 0, r: 8 };
/** Base cell (2D `v`). */
export const BASE = { c: COLS - 1, r: 8 };

// ---------------------------------------------------------------- difficulty

export interface DifficultyDef {
  name: string;
  waveGrowth: number;
  moneyStart: number;
  baseHealth: number;
  killMult: number;
  earlyBonusMult: number;
}

/** 2D `H`. */
export const DIFFICULTY: Record<Difficulty, DifficultyDef> = {
  easy: { name: 'Easy', waveGrowth: 1.13, moneyStart: 320, baseHealth: 30, killMult: 1.15, earlyBonusMult: 1.25 },
  normal: { name: 'Normal', waveGrowth: 1.18, moneyStart: 250, baseHealth: 20, killMult: 1.0, earlyBonusMult: 1.0 },
  hard: { name: 'Hard', waveGrowth: 1.24, moneyStart: 200, baseHealth: 15, killMult: 0.85, earlyBonusMult: 0.75 },
};

// ------------------------------------------------------------------- towers

export interface TowerLevel {
  damage: number;
  range: number;        // px
  fireRate: number;     // shots/s
  projectileSpeed: number; // px/s
  splash: number;       // px (0 = none)
  slow: number;         // 0..1 fraction of speed removed (0 = none)
  slowDur: number;      // s
  cost: number;
}

export interface TowerDef {
  kind: TowerKind;
  name: string;
  icon: string;
  color: string;
  special: string;
  levels: TowerLevel[];
}

/** 2D `W`. */
export const TOWERS: Record<TowerKind, TowerDef> = {
  cannon: {
    kind: 'cannon', name: 'Cannon', icon: '💣', color: '#e07b39',
    special: 'Splash damage — great vs groups',
    levels: [
      { damage: 34, range: 120, fireRate: 0.9, projectileSpeed: 340, splash: 46, slow: 0, slowDur: 0, cost: 70 },
      { damage: 52, range: 130, fireRate: 1.0, projectileSpeed: 360, splash: 54, slow: 0, slowDur: 0, cost: 90 },
      { damage: 78, range: 140, fireRate: 1.1, projectileSpeed: 380, splash: 64, slow: 0, slowDur: 0, cost: 130 },
      { damage: 115, range: 155, fireRate: 1.2, projectileSpeed: 400, splash: 76, slow: 0, slowDur: 0, cost: 185 },
    ],
  },
  mg: {
    kind: 'mg', name: 'Machine Gun', icon: '🔫', color: '#c9d1d9',
    special: 'Rapid single-target fire — great vs fast enemies',
    levels: [
      { damage: 7, range: 110, fireRate: 8, projectileSpeed: 720, splash: 0, slow: 0, slowDur: 0, cost: 60 },
      { damage: 10, range: 118, fireRate: 9.5, projectileSpeed: 760, splash: 0, slow: 0, slowDur: 0, cost: 80 },
      { damage: 14, range: 126, fireRate: 11, projectileSpeed: 800, splash: 0, slow: 0, slowDur: 0, cost: 115 },
      { damage: 19, range: 135, fireRate: 13, projectileSpeed: 850, splash: 0, slow: 0, slowDur: 0, cost: 160 },
    ],
  },
  sniper: {
    kind: 'sniper', name: 'Sniper', icon: '🎯', color: '#5ad1e6',
    special: 'Extreme range & damage — targets the strongest',
    levels: [
      { damage: 90, range: 260, fireRate: 0.45, projectileSpeed: 1400, splash: 0, slow: 0, slowDur: 0, cost: 110 },
      { damage: 140, range: 285, fireRate: 0.5, projectileSpeed: 1500, splash: 0, slow: 0, slowDur: 0, cost: 140 },
      { damage: 210, range: 310, fireRate: 0.55, projectileSpeed: 1600, splash: 0, slow: 0, slowDur: 0, cost: 190 },
      { damage: 320, range: 340, fireRate: 0.6, projectileSpeed: 1750, splash: 0, slow: 0, slowDur: 0, cost: 260 },
    ],
  },
  frost: {
    kind: 'frost', name: 'Frost', icon: '❄️', color: '#6fd6ff',
    special: 'Slows enemies — stacks refresh, never permanent',
    levels: [
      { damage: 6, range: 100, fireRate: 1.6, projectileSpeed: 420, splash: 0, slow: 0.30, slowDur: 1.6, cost: 80 },
      { damage: 9, range: 110, fireRate: 1.8, projectileSpeed: 440, splash: 0, slow: 0.38, slowDur: 1.9, cost: 100 },
      { damage: 13, range: 120, fireRate: 2.0, projectileSpeed: 460, splash: 0, slow: 0.46, slowDur: 2.2, cost: 140 },
      { damage: 18, range: 132, fireRate: 2.2, projectileSpeed: 480, splash: 0, slow: 0.55, slowDur: 2.6, cost: 190 },
    ],
  },
  missile: {
    kind: 'missile', name: 'Missile', icon: '🚀', color: '#b06bff',
    special: 'Huge explosion — shreds armor & groups',
    levels: [
      { damage: 55, range: 190, fireRate: 0.55, projectileSpeed: 260, splash: 70, slow: 0, slowDur: 0, cost: 150 },
      { damage: 85, range: 205, fireRate: 0.6, projectileSpeed: 280, splash: 82, slow: 0, slowDur: 0, cost: 190 },
      { damage: 130, range: 220, fireRate: 0.65, projectileSpeed: 300, splash: 96, slow: 0, slowDur: 0, cost: 250 },
      { damage: 195, range: 240, fireRate: 0.7, projectileSpeed: 320, splash: 112, slow: 0, slowDur: 0, cost: 330 },
    ],
  },
};

/** Build-bar order (2D `U`). Hotkeys Q W E R T. */
export const TOWER_ORDER: TowerKind[] = ['cannon', 'mg', 'sniper', 'frost', 'missile'];
export const TOWER_HOTKEYS = ['Q', 'W', 'E', 'R', 'T'];

// ------------------------------------------------------------------ enemies

export interface EnemyDef {
  kind: EnemyKind;
  name: string;
  color: string;
  shape: 'circle' | 'diamond' | 'square' | 'triangle' | 'hex' | 'blob';
  baseHp: number;
  speed: number;        // px/s
  armor: number;        // flat damage reduction
  armorType: 'flat' | 'percent';
  armorPct: number;
  regen: number;        // hp/s after regenDelay
  regenDelay: number;   // s since last damage
  reward: number;
  score: number;
  radius: number;       // px
  damageToBase: number;
}

/** 2D `F`. */
export const ENEMIES: Record<EnemyKind, EnemyDef> = {
  basic:   { kind: 'basic', name: 'Basic', color: '#e8843c', shape: 'circle', baseHp: 100, speed: 55, armor: 0, armorType: 'flat', armorPct: 0, regen: 0, regenDelay: 0, reward: 12, score: 10, radius: 12, damageToBase: 1 },
  runner:  { kind: 'runner', name: 'Runner', color: '#ffd23c', shape: 'diamond', baseHp: 55, speed: 105, armor: 0, armorType: 'flat', armorPct: 0, regen: 0, regenDelay: 0, reward: 10, score: 12, radius: 9, damageToBase: 1 },
  tank:    { kind: 'tank', name: 'Tank', color: '#c0392b', shape: 'square', baseHp: 420, speed: 34, armor: 0, armorType: 'flat', armorPct: 0, regen: 0, regenDelay: 0, reward: 34, score: 30, radius: 15, damageToBase: 3 },
  swarm:   { kind: 'swarm', name: 'Swarm', color: '#7bd389', shape: 'triangle', baseHp: 34, speed: 72, armor: 0, armorType: 'flat', armorPct: 0, regen: 0, regenDelay: 0, reward: 5, score: 6, radius: 8, damageToBase: 1 },
  armored: { kind: 'armored', name: 'Armored', color: '#8fa3bd', shape: 'hex', baseHp: 220, speed: 46, armor: 6, armorType: 'flat', armorPct: 0, regen: 0, regenDelay: 0, reward: 24, score: 22, radius: 13, damageToBase: 2 },
  regen:   { kind: 'regen', name: 'Regenerator', color: '#b06bff', shape: 'blob', baseHp: 180, speed: 50, armor: 0, armorType: 'flat', armorPct: 0, regen: 26, regenDelay: 2.2, reward: 22, score: 20, radius: 12, damageToBase: 2 },
  // Elite boss: a mysterious mechanical Sentinel that rolls through the deep
  // forest in the late game. Toughest enemy — more HP than the tank, slower
  // and more deliberate, plated (flat armor), heavy base damage, big reward.
  elite:   { kind: 'elite', name: 'Sentinel', color: '#53d6e0', shape: 'hex', baseHp: 720, speed: 30, armor: 8, armorType: 'flat', armorPct: 0, regen: 0, regenDelay: 0, reward: 60, score: 80, radius: 16, damageToBase: 4 },
};

/** Debug-spawn order (2D `ne`). */
export const ENEMY_ORDER: EnemyKind[] = ['basic', 'runner', 'tank', 'swarm', 'armored', 'regen', 'elite'];

// -------------------------------------------------------------------- waves

export interface WaveGroup { kind: EnemyKind; count: number; gap: number; delay: number }

/** 2D `Z` — 20 waves. */
export const WAVES: WaveGroup[][] = [
  [{ kind: 'basic', count: 8, gap: 1.1, delay: 0 }],
  [{ kind: 'basic', count: 12, gap: 0.9, delay: 0 }],
  [{ kind: 'basic', count: 8, gap: 0.9, delay: 0 }, { kind: 'runner', count: 5, gap: 0.6, delay: 6 }],
  [{ kind: 'basic', count: 10, gap: 0.8, delay: 0 }, { kind: 'runner', count: 8, gap: 0.5, delay: 4 }],
  [{ kind: 'swarm', count: 20, gap: 0.35, delay: 0 }, { kind: 'basic', count: 6, gap: 0.9, delay: 3 }],
  [{ kind: 'basic', count: 14, gap: 0.7, delay: 0 }, { kind: 'tank', count: 2, gap: 3, delay: 5 }],
  [{ kind: 'runner', count: 16, gap: 0.4, delay: 0 }, { kind: 'armored', count: 4, gap: 1.5, delay: 6 }],
  [{ kind: 'swarm', count: 26, gap: 0.3, delay: 0 }, { kind: 'armored', count: 5, gap: 1.4, delay: 4 }],
  [{ kind: 'tank', count: 4, gap: 2.5, delay: 0 }, { kind: 'basic', count: 14, gap: 0.6, delay: 3 }, { kind: 'regen', count: 4, gap: 2, delay: 10 }],
  [{ kind: 'armored', count: 8, gap: 1.2, delay: 0 }, { kind: 'runner', count: 12, gap: 0.4, delay: 4 }, { kind: 'tank', count: 3, gap: 3, delay: 8 }],
  [{ kind: 'regen', count: 8, gap: 1.6, delay: 0 }, { kind: 'swarm', count: 24, gap: 0.3, delay: 5 }],
  [{ kind: 'tank', count: 6, gap: 2, delay: 0 }, { kind: 'armored', count: 8, gap: 1.1, delay: 4 }, { kind: 'runner', count: 14, gap: 0.35, delay: 8 }],
  [{ kind: 'swarm', count: 40, gap: 0.22, delay: 0 }, { kind: 'regen', count: 6, gap: 1.5, delay: 6 }],
  [{ kind: 'armored', count: 12, gap: 0.9, delay: 0 }, { kind: 'tank', count: 5, gap: 2.2, delay: 5 }, { kind: 'runner', count: 16, gap: 0.3, delay: 10 }],
  // Waves 15+ : the Sentinel (elite) starts surfacing from the deep forest —
  // a rare, heavily armored boss, always spaced far apart so towers can focus
  // fire, with the final wave fielding the largest group.
  [{ kind: 'regen', count: 12, gap: 1.2, delay: 0 }, { kind: 'tank', count: 6, gap: 1.8, delay: 4 }, { kind: 'swarm', count: 30, gap: 0.25, delay: 8 }, { kind: 'elite', count: 2, gap: 8, delay: 14 }],
  [{ kind: 'armored', count: 14, gap: 0.8, delay: 0 }, { kind: 'runner', count: 24, gap: 0.25, delay: 5 }, { kind: 'regen', count: 8, gap: 1.2, delay: 10 }],
  [{ kind: 'tank', count: 10, gap: 1.5, delay: 0 }, { kind: 'armored', count: 12, gap: 0.8, delay: 5 }, { kind: 'swarm', count: 34, gap: 0.22, delay: 10 }, { kind: 'elite', count: 3, gap: 7, delay: 12 }],
  [{ kind: 'regen', count: 16, gap: 1, delay: 0 }, { kind: 'tank', count: 8, gap: 1.5, delay: 5 }, { kind: 'runner', count: 26, gap: 0.22, delay: 10 }],
  [{ kind: 'armored', count: 18, gap: 0.7, delay: 0 }, { kind: 'tank', count: 10, gap: 1.3, delay: 5 }, { kind: 'regen', count: 12, gap: 1, delay: 10 }, { kind: 'swarm', count: 40, gap: 0.2, delay: 14 }, { kind: 'elite', count: 3, gap: 7, delay: 12 }],
  [{ kind: 'tank', count: 14, gap: 1.2, delay: 0 }, { kind: 'armored', count: 20, gap: 0.6, delay: 5 }, { kind: 'regen', count: 16, gap: 0.9, delay: 10 }, { kind: 'runner', count: 30, gap: 0.2, delay: 15 }, { kind: 'swarm', count: 50, gap: 0.18, delay: 20 }, { kind: 'elite', count: 4, gap: 6, delay: 18 }],
];

export const TOTAL_WAVES = WAVES.length;
/** 2D `oe` — seconds between waves. */
export const WAVE_COUNTDOWN = 18;

// ------------------------------------------------- buildable-area shrink

/**
 * Overgrowth mechanic (difficulty scaling): as the wave number rises, the
 * forest reclaims the buildable area. A deterministic (seeded) subset of
 * grass cells becomes overgrown — walkable (enemies still path through) but
 * NOT buildable. Early waves keep the full area; the blocked fraction grows
 * gradually each wave and caps so the game stays winnable. The enemy path
 * and the spawn/base area are never overgrown. See overgrowth.ts.
 */
export const OVERGROWN_SEED = 0x0b77;

/**
 * Fraction of eligible grass cells that are overgrown at the start of wave
 * `n` (1-based). Waves 1-2: 0 (full buildable area). Then +1.5% per wave,
 * capped at 15% from wave 12 onward (≈45 of ~310 eligible cells).
 */
export function overgrownFraction(wave: number): number {
  if (wave < 3) return 0;
  return Math.min(0.15, (wave - 2) * 0.015);
}

// ----------------------------------------------------------------- terrain

export interface TerrainCell { c: number; r: number; t: number }

/** 2D `re` — water + rock cells. */
export const TERRAIN_CELLS: TerrainCell[] = [
  // water (t = 2)
  { c: 5, r: 3, t: T_WATER }, { c: 6, r: 3, t: T_WATER }, { c: 7, r: 3, t: T_WATER },
  { c: 5, r: 4, t: T_WATER }, { c: 6, r: 4, t: T_WATER }, { c: 7, r: 4, t: T_WATER },
  { c: 6, r: 5, t: T_WATER },
  { c: 15, r: 11, t: T_WATER }, { c: 16, r: 11, t: T_WATER }, { c: 17, r: 11, t: T_WATER },
  { c: 15, r: 12, t: T_WATER }, { c: 16, r: 12, t: T_WATER }, { c: 17, r: 12, t: T_WATER },
  { c: 16, r: 13, t: T_WATER },
  // rock (t = 1)
  { c: 12, r: 2, t: T_ROCK }, { c: 13, r: 2, t: T_ROCK }, { c: 12, r: 3, t: T_ROCK },
  { c: 4, r: 11, t: T_ROCK }, { c: 5, r: 11, t: T_ROCK }, { c: 4, r: 12, t: T_ROCK },
  { c: 18, r: 4, t: T_ROCK }, { c: 19, r: 4, t: T_ROCK }, { c: 18, r: 5, t: T_ROCK },
  { c: 10, r: 13, t: T_ROCK }, { c: 11, r: 13, t: T_ROCK }, { c: 10, r: 14, t: T_ROCK },
  { c: 20, r: 13, t: T_ROCK }, { c: 21, r: 13, t: T_ROCK },
  { c: 8, r: 8, t: T_ROCK }, { c: 15, r: 7, t: T_ROCK },
];

// ---------------------------------------------------------------- targeting

export interface TargetModeDef { key: import('./types').TargetMode; label: string }

/** 2D `me`. */
export const TARGET_MODES: TargetModeDef[] = [
  { key: 'first', label: 'First' },
  { key: 'last', label: 'Last' },
  { key: 'closest', label: 'Closest' },
  { key: 'strongest', label: 'Strongest' },
  { key: 'weakest', label: 'Weakest' },
];
