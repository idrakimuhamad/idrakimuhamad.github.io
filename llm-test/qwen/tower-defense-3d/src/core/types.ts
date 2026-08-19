// Shared types for the renderer-independent game core.
// No three.js or DOM imports allowed in core/.

export type Difficulty = 'easy' | 'normal' | 'hard';
export type TowerKind = 'cannon' | 'mg' | 'sniper' | 'frost' | 'missile';
export type EnemyKind = 'basic' | 'runner' | 'tank' | 'swarm' | 'armored' | 'regen' | 'elite';
export type TargetMode = 'first' | 'last' | 'closest' | 'strongest' | 'weakest';
export type ProjectileKind = 'shell' | 'bullet' | 'sniper' | 'frost' | 'missile';
export type GameState = 'menu' | 'playing' | 'paused' | 'victory' | 'gameover';
export type Quality = 'low' | 'medium' | 'high';

export type SfxName =
  | 'shoot' | 'shootFast' | 'shootSniper' | 'explosion' | 'bigExplosion'
  | 'frost' | 'death' | 'build' | 'upgrade' | 'sell' | 'invalid'
  | 'baseHit' | 'wave' | 'click' | 'win' | 'lose';

export interface Cell { c: number; r: number }
/** World position in the XZ plane (y = height, handled by fx/render). */
export interface Pos { x: number; z: number }

/** Terrain cell codes (2D `N`/`b`/`k`/`Y`/`X`). */
export const T_GRASS = 0;
export const T_ROCK = 1;
export const T_WATER = 2;
export const T_SPAWN = 3;
export const T_BASE = 4;

export interface SettingsData {
  difficulty: Difficulty;
  damageNumbers: boolean;
  healthBars: boolean;
  autoStartWaves: boolean;
  particleEffects: boolean;
  projectileTrails: boolean;
  screenShake: boolean;
  quality: Quality;
  debug: boolean;
  sound: boolean;
  volume: number;
}

export interface SettingsStore {
  data: SettingsData;
  set<K extends keyof SettingsData>(key: K, value: SettingsData[K]): void;
}

export interface HudData {
  hp: number;
  maxHp: number;
  money: number;
  wave: number;
  totalWaves: number;
  enemiesRemaining: number;
  score: number;
  speed: number;
  countdown: number;
  waveActive: boolean;
  canStartEarly: boolean;
}

export interface GameCallbacks {
  onStateChange(state: GameState): void;
  onHudUpdate(hud: HudData): void;
  onToast(msg: string, kind: 'good' | 'bad'): void;
  onSelectedTower(tower: import('./tower').Tower | null): void;
  onBuildSelection(kind: TowerKind | null): void;
  onEndScreen(result: 'victory' | 'gameover', stats: import('./stats').Stats): void;
}
