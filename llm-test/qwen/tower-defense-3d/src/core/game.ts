// Game: fixed 120Hz loop, phase machine, placement rules, rerouting,
// kill/leak/impact handlers. Port of 2D `Le`.
//
// Renderer-independent: no three.js or DOM imports. The renderer pulls
// state each frame; the UI receives the same callbacks as the 2D game.

import { BASE, DIFFICULTY, SPAWN, TOWERS, px2w } from './defs';
import { Enemy } from './enemy';
import { Economy } from './economy';
import { Fx } from './fx';
import { Grid } from './grid';
import { overgrownCellsForWave } from './overgrowth';
import { Pathfinder } from './pathfinder';
import { Projectile } from './projectile';
import { Stats } from './stats';
import { Tower } from './tower';
import type { GameCallbacks, GameState, HudData, SettingsStore, SfxName, TowerKind } from './types';
import { T_GRASS } from './types';
import { Waves } from './waves';

/** Fixed logic step (2D `z`). */
export const STEP = 1 / 120;
/** Max substeps per frame (2D `J`). */
export const MAX_SUBSTEPS = 8;

export interface PlaceResult { ok: boolean; reason: string }

export class Game {
  grid = new Grid();
  pathfinder = new Pathfinder(24, 16);
  waves = new Waves();
  economy = new Economy('normal');
  stats = new Stats();
  particles = new Fx();

  enemies: Enemy[] = [];
  towers: Tower[] = [];
  projectiles: Projectile[] = [];

  baseHp = 20;
  maxBaseHp = 20;
  state: GameState = 'menu';
  speed = 1;
  paused = false;
  acc = 0;

  placing: TowerKind | null = null;
  hoverCell: { c: number; r: number } | null = null;
  hoverValid = false;
  hoverReason = '';
  selectedTower: Tower | null = null;

  /** Mouse world position (x, z) + whether inside the map (set by input). */
  mouse = { x: -100, z: -100, inside: false };

  shake = 0;
  baseFlash = 0;
  pathOpsThisFrame = 0;

  private readonly settings: SettingsStore;
  private readonly sfx: (name: SfxName) => void;
  private readonly cb: GameCallbacks;

  constructor(settings: SettingsStore, sfx: (name: SfxName) => void, cb: GameCallbacks) {
    this.settings = settings;
    this.sfx = sfx;
    this.cb = cb;
    this.particles.enabled = settings.data.particleEffects;
  }

  // ------------------------------------------------------------ lifecycle

  start(difficulty: 'easy' | 'normal' | 'hard'): void {
    this.reset(difficulty);
    this.state = 'playing';
    this.cb.onStateChange(this.state);
    this.cb.onHudUpdate(this.hudData());
    this.cb.onBuildSelection(null);
    this.cb.onSelectedTower(null);
  }

  reset(difficulty: 'easy' | 'normal' | 'hard'): void {
    this.settings.set('difficulty', difficulty);
    this.grid.reset();
    this.pathfinder.resetOps();
    this.enemies = [];
    this.towers = [];
    this.projectiles = [];
    this.particles.clear();
    this.stats.reset();
    this.economy = new Economy(difficulty);
    this.baseHp = DIFFICULTY[difficulty].baseHealth;
    this.maxBaseHp = this.baseHp;
    this.waves = new Waves();
    this.waves.configure(DIFFICULTY[difficulty].waveGrowth);
    this.waves.beginCountdown();
    this.placing = null;
    this.selectedTower = null;
    this.hoverCell = null;
    this.speed = 1;
    this.paused = false;
    this.acc = 0;
    this.shake = 0;
    this.baseFlash = 0;
    this.particles.enabled = this.settings.data.particleEffects;
    // Wave 0 -> no overgrowth, but call it so renderers resync to the
    // freshly reset (empty) overgrown set.
    this.applyOvergrowth();
  }

  toMenu(): void {
    this.state = 'menu';
    this.cb.onStateChange(this.state);
  }

  /**
   * Advance the simulation by real frame time `dt` (accumulator + fixed
   * substeps). Port of the 2D loop minus RAF/render.
   */
  frame(dt: number): void {
    if (dt > 0.25) dt = 0.25;
    if (this.state === 'playing' && !this.paused) {
      this.acc += dt * this.speed;
      let n = 0;
      while (this.acc >= STEP && n < MAX_SUBSTEPS) {
        this.step(STEP);
        this.acc -= STEP;
        n++;
        if (n >= MAX_SUBSTEPS) {
          this.acc = 0;
          break;
        }
      }
    }
  }

  // ------------------------------------------------------- fixed step

  step(dt: number): void {
    this.pathOpsThisFrame = this.pathfinder.opsCount;

    const toSpawn = this.waves.update(dt);
    for (const kind of toSpawn) this.spawnEnemy(kind);

    if (this.settings.data.autoStartWaves && !this.waves.active && !this.waves.countdownActive && !this.waves.finalWaveReached) {
      if (this.beginWave()) this.sfx('wave');
    }

    for (const e of this.enemies) {
      if (!e.alive) continue;
      if (e.move(dt)) {
        e.alive = false;
        this.onEnemyLeak(e);
      }
    }

    for (const t of this.towers) {
      const res = t.update(dt, this.enemies);
      if (res.fired && res.target) this.fire(t, res.target);
    }

    for (const p of this.projectiles) {
      if (p.update(dt, this.enemies) === 'hit') this.onProjectileImpact(p);
    }

    this.particles.update(dt);
    this.cleanup();
    this.checkWaveEnd();

    if (this.shake > 0) this.shake = Math.max(0, this.shake - dt * 30);
    if (this.baseFlash > 0) this.baseFlash = Math.max(0, this.baseFlash - dt * 2);

    if (this.baseHp <= 0) {
      this.baseHp = 0;
      this.gameOver();
    }
    this.cb.onHudUpdate(this.hudData());
  }

  // ------------------------------------------------------------ events

  spawnEnemy(kind: import('./types').EnemyKind): void {
    const center = this.grid.cellCenter(SPAWN.c, SPAWN.r);
    const hpMult = this.waves.hpMultFor(this.waves.currentWave);
    const enemy = new Enemy(kind, center.x, center.z, hpMult);
    const path = this.pathfinder.findPath(this.grid, SPAWN.c, SPAWN.r, BASE.c, BASE.r);
    if (path) enemy.setPath(path);
    this.enemies.push(enemy);
    this.stats.spawnEnemy();
  }

  onEnemyLeak(e: Enemy): void {
    this.baseHp -= e.def.damageToBase;
    this.stats.leakEnemy();
    this.baseFlash = 1;
    if (this.settings.data.screenShake) this.shake = Math.max(this.shake, 8);
    this.sfx('baseHit');
    const center = this.grid.cellCenter(BASE.c, BASE.r);
    this.particles.burst(center.x, center.z, 20, '#ff5c72', { speed: 120, size: 3, life: 0.5, gravity: -40 }, 1.0);
    this.particles.text(center.x, center.z, `-${e.def.damageToBase}`, '#ff5c72', 16, 'info', 1.6);
  }

  fire(t: Tower, target: Enemy): void {
    const L = t.L;
    const angle = t.angle;
    // projectile spawns 14 px (0.35 u) out from tower center toward target
    const mx = t.x + Math.cos(angle) * px2w(14);
    const mz = t.z + Math.sin(angle) * px2w(14);
    this.particles.muzzle(mx, mz, angle, t.def.color, 0.9);

    let kind: import('./types').ProjectileKind;
    let color: string;
    switch (t.kind) {
      case 'cannon': kind = 'shell'; color = '#ffb066'; break;
      case 'mg': kind = 'bullet'; color = '#e8eefc'; break;
      case 'sniper': kind = 'sniper'; color = '#7fe9ff'; break;
      case 'frost': kind = 'frost'; color = '#bfefff'; break;
      case 'missile': kind = 'missile'; color = '#d09bff'; break;
    }

    this.projectiles.push(new Projectile({
      x: mx, z: mz,
      tx: target.x, tz: target.z,
      speed: px2w(L.projectileSpeed),
      damage: L.damage,
      splash: px2w(L.splash),
      slow: L.slow,
      slowDur: L.slowDur,
      kind,
      color,
      towerKind: t.kind,
      target,
      towerId: t.id,
    }));

    if (t.kind === 'mg') this.sfx('shootFast');
    else if (t.kind === 'sniper') this.sfx('shootSniper');
    else if (t.kind === 'frost') this.sfx('frost');
    else if (t.kind === 'missile') this.sfx('shoot');
    else this.sfx('shoot');
  }

  onProjectileImpact(p: Projectile): void {
    const tower = this.towers.find((t) => t.id === p.towerId) ?? null;

    if (p.splash > 0) {
      const x = p.x;
      const z = p.z;
      this.particles.explosion(x, z, p.splash, p.color, 0.6);
      if (this.settings.data.screenShake) this.shake = Math.max(this.shake, p.towerKind === 'missile' ? 6 : 4);
      this.sfx(p.towerKind === 'missile' ? 'bigExplosion' : 'explosion');

      const splashSq = p.splash * p.splash;
      for (const e of this.enemies) {
        if (!e.alive) continue;
        const dx = e.x - x;
        const dz = e.z - z;
        const d2 = dx * dx + dz * dz;
        if (d2 <= splashSq) {
          const falloff = 1 - 0.5 * (Math.sqrt(d2) / p.splash);
          const dmg = e.takeDamage(p.damage * falloff);
          if (tower) {
            tower.stats.damageDealt += dmg;
            this.stats.addDamage(dmg);
          }
          this.particles.damage(e.x, e.z, dmg);
          if (!e.alive) this.onEnemyKilled(e, tower);
        }
      }
    } else {
      const target = p.target;
      if (target && target.alive) {
        const dmg = target.takeDamage(p.damage);
        if (tower) {
          tower.stats.damageDealt += dmg;
          this.stats.addDamage(dmg);
        }
        this.particles.damage(target.x, target.z, dmg);
        if (p.slow > 0) {
          target.applySlow(p.slow, p.slowDur);
          this.particles.frost(target.x, target.z);
        }
        if (p.kind === 'sniper') {
          this.particles.burst(target.x, target.z, 8, p.color, { speed: 80, size: 2, life: 0.3 });
        }
        if (!target.alive) this.onEnemyKilled(target, tower);
      } else {
        this.particles.burst(p.x, p.z, 4, p.color, { speed: 40, size: 2, life: 0.2 });
      }
    }
  }

  onEnemyKilled(e: Enemy, tower: Tower | null): void {
    if (!e.alive && e.hp <= 0 && !e.reachedBase) {
      const reward = this.economy.killReward(e.kind);
      this.economy.earn(reward);
      this.stats.addMoneyEarned(reward);
      this.stats.defeatEnemy(e.def.score);
      if (tower) tower.stats.kills++;
      this.particles.death(e.x, e.z, e.def.color);
      this.particles.money(e.x, e.z, reward);
      this.sfx('death');
    }
  }

  // -------------------------------------------------------- placement

  canPlace(kind: TowerKind, c: number, r: number): PlaceResult {
    if (!this.grid.inBounds(c, r)) return { ok: false, reason: 'Out of bounds' };
    if (this.grid.getTerrain(c, r) !== T_GRASS) return { ok: false, reason: 'Cannot build on this terrain' };
    if (this.grid.isOvergrown(c, r)) return { ok: false, reason: 'Overgrown — the forest has claimed this cell' };
    if (this.grid.towerAtCell(c, r)) return { ok: false, reason: 'Cell already occupied' };
    const cost = TOWERS[kind].levels[0].cost;
    if (!this.economy.canAfford(cost)) return { ok: false, reason: `Not enough money ($${cost})` };
    const blocked = new Set<number>();
    blocked.add(r * this.grid.cols + c);
    if (this.pathfinder.hasPath(this.grid, SPAWN.c, SPAWN.r, BASE.c, BASE.r, blocked)) {
      return { ok: true, reason: '' };
    }
    return { ok: false, reason: 'Would block the enemy path' };
  }

  placeAt(c: number, r: number): boolean {
    if (!this.placing) return false;
    const check = this.canPlace(this.placing, c, r);
    if (!check.ok) {
      this.cb.onToast(check.reason, 'bad');
      this.sfx('invalid');
      return false;
    }
    const kind = this.placing;
    const cost = TOWERS[kind].levels[0].cost;
    if (!this.economy.spend(cost)) {
      this.cb.onToast('Not enough money', 'bad');
      this.sfx('invalid');
      return false;
    }
    this.stats.addMoneySpent(cost);
    const tower = new Tower(kind, c, r);
    this.towers.push(tower);
    this.grid.placeTower(c, r, kind, tower.id);
    this.stats.buildTower();
    this.particles.build(tower.x, tower.z, tower.def.color, 0.6);
    this.sfx('build');
    this.rerouteAllEnemies();
    this.cb.onBuildSelection(this.placing);
    this.cb.onHudUpdate(this.hudData());
    return true;
  }

  /** Every live enemy re-paths from its current cell to the base. */
  rerouteAllEnemies(): void {
    for (const e of this.enemies) {
      if (!e.alive) continue;
      const cell = e.currentCell();
      let path = this.pathfinder.findPath(this.grid, cell.c, cell.r, BASE.c, BASE.r);
      if (!path) path = this.findNearestPath(cell.c, cell.r);
      if (path) {
        e.setPath(path);
      } else {
        e.path = [{ c: BASE.c, r: BASE.r }];
        e.pathIndex = 0;
      }
    }
  }

  private findNearestPath(c: number, r: number): import('./types').Cell[] | null {
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]];
    for (const [dc, dr] of dirs) {
      const nc = c + dc;
      const nr = r + dr;
      if (this.grid.isWalkable(nc, nr)) {
        const path = this.pathfinder.findPath(this.grid, nc, nr, BASE.c, BASE.r);
        if (path) {
          path.unshift({ c, r });
          return path;
        }
      }
    }
    return null;
  }

  // ------------------------------------------------------ tower actions

  selectTower(t: Tower | null): void {
    this.selectedTower = t;
    this.cb.onSelectedTower(t);
  }

  upgradeSelected(): void {
    const t = this.selectedTower;
    if (!t || !t.canUpgrade) return;
    const cost = t.upgradeCost;
    if (!this.economy.canAfford(cost)) {
      this.cb.onToast(`Need $${cost} to upgrade`, 'bad');
      this.sfx('invalid');
      return;
    }
    if (this.economy.spend(cost)) {
      this.stats.addMoneySpent(cost);
      t.upgrade();
      this.particles.build(t.x, t.z, t.def.color, 0.6);
      this.particles.text(t.x, t.z, 'UPGRADED', '#3ddc84', 12, 'info', 1.4);
      this.sfx('upgrade');
      this.cb.onSelectedTower(t);
      this.cb.onHudUpdate(this.hudData());
    }
  }

  sellSelected(): void {
    const t = this.selectedTower;
    if (!t) return;
    const value = t.sellValue;
    this.economy.earn(value);
    this.stats.addMoneyEarned(value);
    this.stats.sellTower();
    this.grid.removeTower(t.c, t.r);
    this.towers = this.towers.filter((x) => x.id !== t.id);
    this.particles.burst(t.x, t.z, 16, '#ffcf5c', { speed: 90, size: 3, life: 0.5, gravity: -40 }, 0.6);
    this.particles.money(t.x, t.z, value, 1.0);
    this.sfx('sell');
    this.selectTower(null);
    this.rerouteAllEnemies();
    this.cb.onHudUpdate(this.hudData());
  }

  setTargetMode(mode: import('./types').TargetMode): void {
    if (this.selectedTower) {
      this.selectedTower.targetMode = mode;
      this.sfx('click');
      this.cb.onSelectedTower(this.selectedTower);
    }
  }

  // ------------------------------------------------------------- waves

  startWaveEarly(): void {
    if (this.state !== 'playing' || this.waves.active || this.waves.finalWaveReached) return;
    const bonus = this.waves.countdownActive ? this.economy.earlyBonus(this.waves.countdown) : 0;
    if (bonus > 0) {
      this.economy.earn(bonus);
      this.stats.addMoneyEarned(bonus);
      this.particles.text(12, 2, `+$${bonus} early bonus`, '#ffcf5c', 15, 'info', 2.0);
    }
    this.beginWave();
    this.sfx('wave');
    this.cb.onHudUpdate(this.hudData());
  }

  // ------------------------------------------------- buildable-area shrink

  /**
   * Apply the current wave's overgrown set (buildable-area shrink). The
   * harder the wave, the more cells the forest has reclaimed: overgrown
   * cells are walkable (enemies still path through) but no longer
   * buildable. Monotonic: cells only ever become overgrown, never re-open.
   * Existing towers are preserved — overgrowth only prevents NEW placement.
   */
  applyOvergrowth(): void {
    let fresh = 0;
    for (const { c, r } of overgrownCellsForWave(this.waves.currentWave)) {
      if (!this.grid.isOvergrown(c, r)) {
        this.grid.setOvergrown(c, r, true);
        fresh++;
      }
    }
    if (fresh > 0) {
      this.cb.onToast(`The forest overgrows ${fresh} more cell${fresh > 1 ? 's' : ''}`, 'good');
    }
  }

  /** Start the next wave and apply its overgrowth (buildable-area shrink). */
  private beginWave(): boolean {
    const started = this.waves.startNextWave();
    if (started) this.applyOvergrowth();
    return started;
  }

  checkWaveEnd(): void {
    if (this.state === 'playing' && this.waves.active && this.waves.allSpawned() && this.enemies.length === 0) {
      this.waves.active = false;
      this.stats.setWave(this.waves.currentWave);
      if (this.waves.finalWaveReached) {
        this.victory();
      } else {
        this.waves.beginCountdown();
        const bonus = 20 + this.waves.currentWave * 4;
        this.economy.earn(bonus);
        this.stats.addMoneyEarned(bonus);
        this.particles.text(12, 2, `Wave ${this.waves.currentWave} cleared! +$${bonus}`, '#3ddc84', 15, 'info', 2.0);
        this.sfx('wave');
      }
      this.cb.onHudUpdate(this.hudData());
    }
  }

  victory(): void {
    this.state = 'victory';
    this.sfx('win');
    this.cb.onStateChange(this.state);
    this.cb.onEndScreen('victory', this.stats);
  }

  gameOver(): void {
    this.state = 'gameover';
    this.sfx('lose');
    this.cb.onStateChange(this.state);
    this.cb.onEndScreen('gameover', this.stats);
  }

  private cleanup(): void {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      if (!this.enemies[i].alive) {
        this.enemies[i] = this.enemies[this.enemies.length - 1];
        this.enemies.pop();
      }
    }
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      if (!this.projectiles[i].alive) {
        this.projectiles[i] = this.projectiles[this.projectiles.length - 1];
        this.projectiles.pop();
      }
    }
  }

  // --------------------------------------------------------------- hud

  hudData(): HudData {
    const enemiesRemaining = this.enemies.length + this.waves.remainingToSpawn();
    return {
      hp: this.baseHp,
      maxHp: this.maxBaseHp,
      money: this.economy.money,
      wave: this.waves.currentWave,
      totalWaves: this.waves.totalWaves,
      enemiesRemaining,
      score: this.stats.data.score,
      speed: this.speed,
      countdown: this.waves.countdownActive ? this.waves.countdown : 0,
      waveActive: this.waves.active,
      canStartEarly: !this.waves.active && !this.waves.finalWaveReached,
    };
  }

  setSpeed(speed: number): void {
    this.speed = speed;
    this.cb.onHudUpdate(this.hudData());
  }

  togglePause(): void {
    if (this.state !== 'playing') return;
    this.paused = !this.paused;
    this.cb.onStateChange(this.paused ? 'paused' : 'playing');
    this.cb.onHudUpdate(this.hudData());
  }

  setPlacing(kind: TowerKind | null): void {
    this.placing = kind;
    if (kind) this.selectTower(null);
    this.cb.onBuildSelection(kind);
  }

  // ------------------------------------------------------------- debug

  toggleDebug(): void {
    this.settings.set('debug', !this.settings.data.debug);
    this.particles.enabled = this.settings.data.particleEffects;
    this.cb.onStateChange(this.state);
  }

  debugAddMoney(amount: number): void {
    this.economy.earn(amount);
    this.cb.onHudUpdate(this.hudData());
  }

  debugSpawnEnemy(kind: import('./types').EnemyKind): void {
    this.spawnEnemy(kind);
  }

  debugSkipWave(): void {
    if (this.waves.countdownActive) {
      if (this.beginWave()) this.sfx('wave');
    } else if (!this.waves.active && !this.waves.finalWaveReached) {
      if (this.beginWave()) this.sfx('wave');
    }
  }

  debugDamageBase(amount: number): void {
    this.baseHp -= amount;
    this.baseFlash = 1;
    if (this.baseHp <= 0) {
      this.baseHp = 0;
      this.gameOver();
    }
    this.cb.onHudUpdate(this.hudData());
  }

  debugClearEnemies(): void {
    for (const e of this.enemies) e.alive = false;
    this.enemies = [];
  }
}
