import { GameState } from './state';
import { WAVES, DIFFICULTY, UPGRADE_AFTER_WAVES, EARLY_BONUS_PER_SEC, ENEMIES, ERAS } from '../core/defs';
import type { Difficulty, EnemyKind, WaveGroup } from '../core/types';

export interface WavePreview { kind: EnemyKind; count: number; name: string; color: number }

export function previewWave(waveNum: number, diff: Difficulty = 'normal'): WavePreview[] {
  const def = WAVES[waveNum - 1];
  if (!def) return [];
  const dm = DIFFICULTY[diff];
  const out: WavePreview[] = [];
  for (const grp of def.groups) {
    const existing = out.find((o) => o.kind === grp.kind);
    const count = Math.max(1, Math.round(grp.count * dm.count));
    if (existing) existing.count += count;
    else out.push({ kind: grp.kind, count, name: ENEMIES[grp.kind].name, color: ENEMIES[grp.kind].color });
  }
  return out;
}

// Build the spawn queue for a wave. Lanes are assigned round-robin with some randomness.
export function buildSpawnQueue(g: GameState, waveNum: number): void {
  const def = WAVES[waveNum - 1];
  const dm = DIFFICULTY[g.difficulty];
  if (!def) return;
  const queue: { kind: EnemyKind; t: number; elite: boolean; lane: number }[] = [];
  // From wave 6 on the two extra rift gates (lanes 3-4) come online.
  const pool = waveNum >= 6 ? 5 : 3;
  let laneCursor = Math.floor(Math.random() * pool);
  for (const grp of def.groups) {
    const count = Math.max(1, Math.round(grp.count * dm.count));
    for (let i = 0; i < count; i++) {
      // spread spawns across lanes; boss always from north lane
      const lane = grp.kind === 'boss' ? 0 : (laneCursor + i) % pool;
      queue.push({ kind: grp.kind, t: grp.delay + i * grp.interval, elite: !!grp.elite, lane });
    }
  }
  queue.sort((a, b) => a.t - b.t);
  g.spawnQueue = queue;
  g.spawnTimer = 0;
}

export function startPrep(g: GameState, waveNum: number): void {
  const def = WAVES[waveNum - 1];
  g.wave = waveNum;
  g.phase = 'prep';
  g.prepTotal = DIFFICULTY[g.difficulty].prep;
  g.prepTime = g.prepTotal;
  g.buildMode = false;
  g.buildSelection = null;
  g.selectedTowerId = -1;

  // Environmental evolution: shift the battlefield era and arm the wave's hazard.
  const era = def?.era ?? 0;
  if (era !== g.era) {
    g.era = era;
    g.eraBlend = 0; // triggers a smooth crossfade in the renderer
    g.pushFx({ type: 'announce', msg: ERAS[era].name.toUpperCase(), sub: 'The battlefield shifts...', color: '#b48cff' });
  }
  g.setHazard(def?.hazard);

  if (waveNum === 11) {
    g.pushFx({ type: 'announce', msg: 'THE RIFT BEHEMOTH', sub: 'It stirs beyond the gate...' });
    g.pushFx({ type: 'sound', sound: 'boss_warn' });
  } else if (def?.warning) {
    g.pushFx({ type: 'announce', msg: def.warning.msg, sub: def.warning.sub, color: def.warning.color });
    g.pushFx({ type: 'sound', sound: 'wave_warn' });
  } else {
    g.pushFx({ type: 'announce', msg: 'WAVE ' + waveNum, sub: def?.label ?? '' });
  }
}

export function startCombat(g: GameState, early = false): void {
  if (g.phase !== 'prep') return;
  if (early) {
    const bonus = Math.round(g.prepTime * EARLY_BONUS_PER_SEC * g.mods.earlyBonusMult);
    if (bonus > 0) {
      g.addEssence(bonus);
      g.pushFx({ type: 'text', msg: '+' + bonus + ' Essence (early start)', pos: { x: 0, y: 4, z: 0 }, color: '#7dffb0' });
    }
  }
  g.phase = 'combat';
  buildSpawnQueue(g, g.wave);
  g.pushFx({ type: 'sound', sound: 'wave_start' });
  g.pushFx({ type: 'announce', msg: 'WAVE ' + g.wave, sub: 'Defend the Bastion!' });
}

// Called each frame during prep.
export function updatePrep(g: GameState, dt: number): void {
  g.prepTime -= dt;
  if (g.prepTime <= 0) startCombat(g, false);
}

// Called each frame during combat. Returns true when the wave is fully cleared.
export function updateCombat(g: GameState, dt: number): boolean {
  // spawn from queue
  if (!g.spawnPaused && g.spawnQueue.length > 0) {
    g.spawnTimer += dt;
    while (g.spawnQueue.length > 0 && g.spawnQueue[0].t <= g.spawnTimer) {
      const s = g.spawnQueue.shift()!;
      const e = g.spawnEnemy(s.kind, s.lane, s.elite);
      if (e) {
        const def = ENEMIES[s.kind];
        const dm = DIFFICULTY[g.difficulty];
        let hp = def.hp * dm.hp;
        if (s.elite) hp *= 2.2;
        if (s.kind === 'boss') hp = def.hp * dm.bossHp;
        e.hp = hp;
        e.maxHp = hp;
        e.speed = def.speed * dm.speed * (s.kind === 'boss' && dm.bossSpeed ? dm.bossSpeed : 1);
        e.radius = def.radius;
        if (s.kind === 'boss') g.bossRef = e;
        g.pushFx({ type: 'sound', sound: s.kind === 'boss' ? 'boss_spawn' : 'spawn' });
      }
    }
  }
  const cleared = g.spawnQueue.length === 0 && g.enemies.length === 0;
  return cleared;
}

export function onWaveCleared(g: GameState): void {
  const bonus = 30 + g.wave * 6;
  g.addEssence(bonus);
  g.pushFx({ type: 'text', msg: 'Wave ' + g.wave + ' cleared  +' + bonus + ' Essence', pos: { x: 0, y: 5, z: 0 }, color: '#7dffb0' });
  g.pushFx({ type: 'sound', sound: 'wave_clear' });
  const next = g.wave + 1;
  if (next > WAVES.length) {
    g.phase = 'victory';
    g.pushFx({ type: 'sound', sound: 'victory' });
    return;
  }
  if (UPGRADE_AFTER_WAVES.includes(g.wave)) {
    g.phase = 'upgrade';
    return;
  }
  startPrep(g, next);
}
