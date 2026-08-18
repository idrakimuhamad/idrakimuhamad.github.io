import { GameState } from './state';
import { updateEnemies } from './enemies';
import { updateTowers } from './towers';
import { updatePlayer, resetPlayerCds, type PlayerInput } from './player';
import { updateProjectiles, updatePatches } from './projectiles';
import { updatePrep, updateCombat, onWaveCleared, startPrep, startCombat } from './waves';
import { rollCards, applyCard } from './upgrades';
import { updateHazard } from './hazards';
import { ERAS, ENEMIES } from '../core/defs';
import type { Difficulty, TowerKind, EnemyKind } from '../core/types';

export class Game {
  g = new GameState();
  onPhaseChange: ((phase: string) => void) | null = null;

  constructor() { /* state created lazily */ }

  startRun(difficulty: Difficulty): void {
    this.g = new GameState();
    this.g.difficulty = difficulty;
    resetPlayerCds();
    startPrep(this.g, 1);
    this.notifyPhase();
  }

  private notifyPhase() {
    if (this.onPhaseChange) this.onPhaseChange(this.g.phase);
  }

  togglePause(): void {
    if (this.g.phase === 'paused') {
      this.g.phase = this.pausedInto;
    } else if (this.g.phase === 'prep' || this.g.phase === 'combat' || this.g.phase === 'upgrade') {
      this.pausedInto = this.g.phase;
      this.g.phase = 'paused';
    }
    this.notifyPhase();
  }
  pausedInto: 'prep' | 'combat' | 'upgrade' = 'prep';

  chooseCard(id: string): void {
    applyCard(this.g, id);
    this.g.pendingCards = [];
    this.g.phase = 'prep';
    const next = this.g.wave + 1;
    startPrep(this.g, next);
    this.notifyPhase();
  }

  startEarly(): void {
    if (this.g.phase === 'prep') {
      startCombat(this.g, true);
      this.notifyPhase();
    }
  }

  // ---------------- main update ----------------
  update(dt: number, input: PlayerInput): void {
    const g = this.g;
    if (g.phase === 'menu' || g.phase === 'gameover' || g.phase === 'victory' || g.phase === 'upgrade') {
      // idle animation time still advances for backdrop; sim frozen
      g.time += dt;
      g.particles.update(dt);
      return;
    }
    if (g.phase === 'paused') return;

    // Cinematic time scaling: slow-mo during ultimates / boss moments.
    const c = g.cinematic;
    let timeScale = 1;
    if (c.slowMoT > 0) {
      c.slowMoT -= dt;
      timeScale = c.slowMo;
    }
    if (c.flash > 0) c.flash -= dt * 2.2;
    if (c.zoomT > 0) c.zoomT -= dt;
    else c.zoom = 1;

    const sdt = dt * g.gameSpeed * timeScale;
    g.time += sdt;
    g.stats.time += sdt;
    if (g.mods.overchargeT > 0) g.mods.overchargeT -= sdt;
    if (g.bastionFlash > 0) g.bastionFlash -= sdt;

    // Environmental era crossfade
    if (g.eraBlend < 1) g.eraBlend = Math.min(1, g.eraBlend + dt / 3.0);

    // player
    updatePlayer(g, sdt, input);

    if (g.phase === 'prep') {
      updatePrep(g, sdt);
    } else if (g.phase === 'combat') {
      const cleared = updateCombat(g, sdt);
      if (cleared) onWaveCleared(g);
    }

    // simulation always runs for existing entities
    updateEnemies(g, sdt);
    updateTowers(g, sdt);
    updateProjectiles(g, sdt);
    updatePatches(g, sdt);
    updateHazard(g, sdt);
    g.particles.update(sdt);

    // NOTE: fx are NOT drained here. The host (main.ts) drains g.drainFx() once per
    // frame and routes sound/announce/burst/shake events. Draining twice would
    // silently drop every sound and announcement.

    if (g.phase !== this.lastPhase) this.notifyPhase();
    this.lastPhase = g.phase;
  }
  private lastPhase = 'menu';

  // ---------------- debug ----------------
  debugStartWave(): void {
    if (this.g.phase === 'prep') this.startEarly();
    else if (this.g.phase === 'combat') { /* nothing */ }
  }
  debugAddEssence(n = 500): void { this.g.addEssence(n); }
  debugDamageBastion(n = 100): void {
    this.g.bastionHp = Math.max(0, this.g.bastionHp - n);
    if (this.g.bastionHp <= 0) { this.g.phase = 'gameover'; this.notifyPhase(); }
  }
  debugSpawn(kind: EnemyKind, lane = 0): void {
    const e = this.g.spawnEnemy(kind, lane);
    if (e) {
      const def = ENEMIES[kind];
      e.hp = def.hp; e.maxHp = def.hp; e.speed = def.speed; e.radius = def.radius;
      if (kind === 'boss') { e.hp = def.hp * 1.0; e.maxHp = e.hp; this.g.bossRef = e; }
    }
  }
  debugKillAll(): void {
    for (const e of [...this.g.enemies]) {
      this.g.killEnemy(e);
    }
  }
  debugToggleSpawnPause(): void { this.g.spawnPaused = !this.g.spawnPaused; }
}
