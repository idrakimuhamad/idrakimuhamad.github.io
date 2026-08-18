// DOM UI: HUD, build bar, tower panel, menus, toasts, settings modal, debug
// panel. Port of 2D `Be`, adapted: quality is a 3-way selector, and the
// renderer receives quality changes.

import { DIFFICULTY, ENEMIES, ENEMY_ORDER, TARGET_MODES, TOWER_ORDER, TOWERS } from '../core/defs';
import type { Game } from '../core/game';
import type { Tower } from '../core/tower';
import type { Stats } from '../core/stats';
import type { Renderer } from '../render/renderer';
import type { Sfx } from '../audio/audio';
import type { Settings } from '../settings';
import type { Difficulty, HudData, Quality } from '../core/types';

const $ = (id: string): HTMLElement => document.getElementById(id)!;
const $$ = (id: string): HTMLButtonElement => document.getElementById(id) as HTMLButtonElement;

export class UI {
  private toastTimer = 0;
  private readonly detach: (() => void)[] = [];

  constructor(
    private readonly game: Game,
    private readonly settings: Settings,
    private readonly audio: Sfx,
    private readonly renderer: Renderer,
  ) {
    this.buildBuildBar();
    this.buildDebugSpawnSelect();
    this.buildSettings();
    this.bind();
    this.applyDifficultyButtons(settings.data.difficulty);
    this.updateSpeedButtons();
  }

  // ---- build bar -----------------------------------------------------------

  private buildBuildBar(): void {
    const bar = $('build-bar');
    bar.innerHTML = '';
    const keys = ['Q', 'W', 'E', 'R', 'T'];
    TOWER_ORDER.forEach((kind, i) => {
      const def = TOWERS[kind];
      const slot = document.createElement('div');
      slot.className = 'build-slot';
      slot.dataset.kind = kind;
      slot.dataset.key = keys[i];
      const l0 = def.levels[0];
      slot.innerHTML = `
        <div class="bs-key">${keys[i]}</div>
        <div class="bs-icon">${def.icon}</div>
        <div class="bs-name">${def.name}</div>
        <div class="bs-cost">$${l0.cost}</div>`;
      const tip = document.createElement('div');
      tip.className = 'tooltip hidden';
      tip.innerHTML = `
        <div class="tt-name">${def.icon} ${def.name}</div>
        <div class="tt-cost">$${l0.cost}</div>
        <div class="tt-row"><span>Damage</span><span>${l0.damage}</span></div>
        <div class="tt-row"><span>Range</span><span>${l0.range}</span></div>
        <div class="tt-row"><span>Fire rate</span><span>${l0.fireRate}/s</span></div>
        <div class="tt-row"><span>Proj. speed</span><span>${l0.projectileSpeed}</span></div>
        ${l0.splash ? `<div class="tt-row"><span>Splash</span><span>${l0.splash}px</span></div>` : ''}
        ${l0.slow ? `<div class="tt-row"><span>Slow</span><span>${Math.round(l0.slow * 100)}% ${l0.slowDur}s</span></div>` : ''}
        <div class="tt-special">${def.special}</div>`;
      slot.appendChild(tip);
      const show = () => tip.classList.remove('hidden');
      const hide = () => tip.classList.add('hidden');
      slot.addEventListener('mouseenter', show);
      slot.addEventListener('mouseleave', hide);
      slot.addEventListener('click', () => {
        this.audio.play('click');
        const placing = this.game.placing;
        this.game.setPlacing(placing === kind ? null : kind);
        this.syncBuildBar();
      });
      bar.appendChild(slot);
      this.detach.push(() => slot.removeEventListener('mouseenter', show));
      this.detach.push(() => slot.removeEventListener('mouseleave', hide));
    });
  }

  syncBuildBar(): void {
    document.querySelectorAll<HTMLElement>('.build-slot').forEach((el) => {
      const kind = el.dataset.kind as import('../core/types').TowerKind;
      el.classList.toggle('selected', this.game.placing === kind);
      const cost = TOWERS[kind].levels[0].cost;
      el.classList.toggle('cant-afford', !this.game.economy.canAfford(cost));
    });
  }

  private buildDebugSpawnSelect(): void {
    const sel = $('dp-spawn-type') as HTMLSelectElement;
    sel.innerHTML = '';
    for (const kind of ENEMY_ORDER) {
      const opt = document.createElement('option');
      opt.value = kind;
      opt.textContent = ENEMIES[kind].name;
      sel.appendChild(opt);
    }
  }

  // ---- settings modal ------------------------------------------------------

  private buildSettings(): void {
    const body = $('settings-body');
    body.innerHTML = '';
    const group = (title: string, fill: () => void) => {
      const g = document.createElement('div');
      g.className = 'settings-group';
      g.innerHTML = `<div class="sg-title">${title}</div>`;
      const inner = document.createElement('div');
      fill();
      g.appendChild(inner);
      body.appendChild(g);
    };
    const toggle = (label: string, key: 'damageNumbers' | 'healthBars' | 'autoStartWaves' | 'particleEffects' | 'projectileTrails' | 'screenShake' | 'debug' | 'sound') => {
      const row = document.createElement('div');
      row.className = 'setting-row';
      const labelEl = document.createElement('label');
      labelEl.textContent = label;
      const tgl = document.createElement('div');
      tgl.className = 'toggle' + (this.settings.data[key] ? ' on' : '');
      tgl.addEventListener('click', () => {
        const v = !this.settings.data[key];
        this.settings.set(key, v);
        tgl.classList.toggle('on', v);
        this.applySetting(key);
      });
      row.appendChild(labelEl);
      row.appendChild(tgl);
      body.appendChild(row);
    };

    group('Gameplay', () => {
      const row = document.createElement('div');
      row.className = 'setting-row';
      const labelEl = document.createElement('label');
      labelEl.textContent = 'Difficulty';
      const wrap = document.createElement('div');
      wrap.className = 'settings-diff';
      wrap.style.flex = 'none';
      wrap.style.width = '200px';
      (['easy', 'normal', 'hard'] as Difficulty[]).forEach((d) => {
        const btn = document.createElement('button');
        btn.className = 'btn settings-diff-btn';
        btn.dataset.diff = d;
        btn.textContent = DIFFICULTY[d].name;
        btn.addEventListener('click', () => {
          this.settings.set('difficulty', d);
          this.applyDifficultyButtons(d);
        });
        wrap.appendChild(btn);
      });
      row.appendChild(labelEl);
      row.appendChild(wrap);
      body.appendChild(row);
      toggle('Damage numbers', 'damageNumbers');
      toggle('Health bars', 'healthBars');
      toggle('Auto-start waves', 'autoStartWaves');
    });

    group('Graphics', () => {
      const row = document.createElement('div');
      row.className = 'setting-row';
      const labelEl = document.createElement('label');
      labelEl.textContent = 'Quality';
      const wrap = document.createElement('div');
      wrap.className = 'settings-diff';
      wrap.style.flex = 'none';
      wrap.style.width = '200px';
      (['low', 'medium', 'high'] as Quality[]).forEach((q) => {
        const btn = document.createElement('button');
        btn.className = 'btn settings-quality-btn';
        btn.dataset.quality = q;
        btn.textContent = q[0].toUpperCase() + q.slice(1);
        btn.addEventListener('click', () => {
          this.settings.set('quality', q);
          this.renderer.setQuality(q);
          this.applyQualityButtons(q);
        });
        wrap.appendChild(btn);
      });
      row.appendChild(labelEl);
      row.appendChild(wrap);
      body.appendChild(row);
      toggle('Particle effects', 'particleEffects');
      toggle('Projectile trails', 'projectileTrails');
      toggle('Screen shake', 'screenShake');
      toggle('Debug visualization', 'debug');
    });

    group('Audio', () => {
      toggle('Sound', 'sound');
      const row = document.createElement('div');
      row.className = 'setting-row volume-row';
      const labelEl = document.createElement('label');
      labelEl.textContent = 'Volume';
      const range = document.createElement('input');
      range.type = 'range';
      range.min = '0';
      range.max = '1';
      range.step = '0.05';
      range.value = String(this.settings.data.volume);
      const val = document.createElement('span');
      val.className = 'vol-val';
      val.textContent = Math.round(this.settings.data.volume * 100) + '%';
      range.addEventListener('input', () => {
        const v = parseFloat(range.value);
        this.audio.setVolume(v);
        val.textContent = Math.round(v * 100) + '%';
      });
      row.appendChild(labelEl);
      row.appendChild(range);
      row.appendChild(val);
      body.appendChild(row);
    });

    this.applyQualityButtons(this.settings.data.quality);
  }

  private applySetting(key: string): void {
    if (key === 'particleEffects') this.game.particles.enabled = this.settings.data.particleEffects;
    if (key === 'sound') this.audio.setVolume(this.settings.data.volume);
  }

  private applyDifficultyButtons(d: Difficulty): void {
    document.querySelectorAll<HTMLElement>('.diff-btn').forEach((el) => el.classList.toggle('active', el.dataset.diff === d));
    document.querySelectorAll<HTMLElement>('.settings-diff-btn').forEach((el) => el.classList.toggle('active', el.dataset.diff === d));
  }

  private applyQualityButtons(q: Quality): void {
    document.querySelectorAll<HTMLElement>('.settings-quality-btn').forEach((el) => el.classList.toggle('active', el.dataset.quality === q));
  }

  // ---- bindings ------------------------------------------------------------

  private bind(): void {
    const on = (id: string, ev: string, fn: (e: Event) => void) => {
      const el = $(id);
      el.addEventListener(ev, fn);
      this.detach.push(() => el.removeEventListener(ev, fn));
    };

    on('menu-start', 'click', () => {
      this.audio.unlock();
      this.audio.play('click');
      this.startGame();
    });
    on('menu-help', 'click', () => {
      this.audio.play('click');
      this.showModal('modal-help');
    });
    on('menu-settings', 'click', () => {
      this.audio.play('click');
      this.showModal('modal-settings');
    });
    document.querySelectorAll<HTMLElement>('.diff-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.audio.play('click');
        const d = btn.dataset.diff as Difficulty;
        this.settings.set('difficulty', d);
        this.applyDifficultyButtons(d);
      });
    });
    on('pause-resume', 'click', () => {
      this.audio.play('click');
      this.game.togglePause();
    });
    on('pause-settings', 'click', () => {
      this.audio.play('click');
      this.showModal('modal-settings');
    });
    on('pause-menu', 'click', () => {
      this.audio.play('click');
      this.game.toMenu();
    });
    on('end-restart', 'click', () => {
      this.audio.play('click');
      this.startGame();
    });
    on('end-menu', 'click', () => {
      this.audio.play('click');
      this.game.toMenu();
    });
    on('settings-close', 'click', () => {
      this.audio.play('click');
      this.hideModal('modal-settings');
    });
    on('help-close', 'click', () => {
      this.audio.play('click');
      this.hideModal('modal-help');
    });
    on('btn-startwave', 'click', () => {
      this.audio.play('click');
      this.game.startWaveEarly();
    });
    on('btn-pause', 'click', () => {
      this.audio.play('click');
      this.game.togglePause();
    });
    on('btn-s1', 'click', () => {
      this.audio.play('click');
      this.game.setSpeed(1);
      this.updateSpeedButtons();
    });
    on('btn-s2', 'click', () => {
      this.audio.play('click');
      this.game.setSpeed(2);
      this.updateSpeedButtons();
    });
    on('btn-s3', 'click', () => {
      this.audio.play('click');
      this.game.setSpeed(4);
      this.updateSpeedButtons();
    });
    on('btn-debug', 'click', () => {
      this.audio.play('click');
      this.game.toggleDebug();
    });
    on('btn-settings', 'click', () => {
      this.audio.play('click');
      this.showModal('modal-settings');
    });
    on('tp-close', 'click', () => this.game.selectTower(null));
    on('tp-upgrade', 'click', () => this.game.upgradeSelected());
    on('tp-sell', 'click', () => this.game.sellSelected());
    on('dp-money', 'click', () => this.game.debugAddMoney(500));
    on('dp-spawn', 'click', () => {
      const kind = ($('dp-spawn-type') as HTMLSelectElement).value as keyof typeof ENEMIES;
      this.game.debugSpawnEnemy(kind);
    });
    on('dp-skipwave', 'click', () => this.game.debugSkipWave());
    on('dp-damage', 'click', () => this.game.debugDamageBase(10));
    on('dp-clear', 'click', () => this.game.debugClearEnemies());
  }

  private startGame(): void {
    const difficulty = this.settings.data.difficulty;
    this.hideModal('modal-settings');
    this.hideModal('modal-help');
    this.game.start(difficulty);
  }

  private showModal(id: string): void {
    $(id).classList.remove('hidden');
  }

  private hideModal(id: string): void {
    $(id).classList.add('hidden');
  }

  updateSpeedButtons(): void {
    $$('btn-s1').classList.toggle('active', this.game.speed === 1);
    $$('btn-s2').classList.toggle('active', this.game.speed === 2);
    $$('btn-s3').classList.toggle('active', this.game.speed === 4);
  }

  // ---- state callbacks -----------------------------------------------------

  setState(state: string): void {
    const playing = state === 'playing' || state === 'paused';
    $('hud-top').classList.toggle('hidden', !playing);
    $('build-bar').classList.toggle('hidden', !playing);
    $('menu-main').classList.toggle('hidden', state !== 'menu');
    $('menu-pause').classList.toggle('hidden', state !== 'paused');
    $('menu-end').classList.toggle('hidden', !(state === 'victory' || state === 'gameover'));
    $('debug-panel').classList.toggle('hidden', !(this.settings.data.debug && playing));
    if (state === 'menu') {
      this.game.selectTower(null);
      this.game.setPlacing(null);
    }
    this.updateSpeedButtons();
  }

  updateHud(h: HudData): void {
    $('hud-hp').textContent = `${h.hp}`;
    $('chip-hp').classList.toggle('low', h.hp / h.maxHp <= 0.3);
    $('hud-money').textContent = `${h.money}`;
    $('hud-wave').textContent = `${h.wave} / ${h.totalWaves}`;
    $('hud-enemies').textContent = `${h.enemiesRemaining}`;
    $('hud-score').textContent = `${h.score}`;
    const timer = $('hud-timer');
    const startBtn = $$('btn-startwave');
    if (h.waveActive) {
      timer.textContent = 'ACTIVE';
      startBtn.disabled = true;
      startBtn.textContent = '▶ Wave Active';
    } else if (h.canStartEarly) {
      timer.textContent = h.countdown > 0 ? `${Math.ceil(h.countdown)}s` : 'ready';
      startBtn.disabled = false;
      startBtn.textContent = '▶ Start Wave';
    } else {
      timer.textContent = '–';
      startBtn.disabled = true;
      startBtn.textContent = '▶ Start Wave';
    }
    $('btn-pause').textContent = this.game.paused ? '▶' : '⏸';
    this.syncBuildBar();
  }

  showToast(msg: string, kind: 'good' | 'bad'): void {
    const el = $('toast');
    el.textContent = msg;
    el.className = kind === 'good' ? 'good' : '';
    el.classList.remove('hidden');
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => el.classList.add('hidden'), 1800);
  }

  updateTowerPanel(tower: Tower | null): void {
    const panel = $('tower-panel');
    if (!tower) {
      panel.classList.add('hidden');
      return;
    }
    panel.classList.remove('hidden');
    $('tp-name').textContent = `${tower.def.icon} ${tower.def.name}`;
    $('tp-level').textContent = `Level ${tower.level + 1} / ${tower.def.levels.length}`;
    const L = tower.L;
    const next = tower.canUpgrade ? tower.def.levels[tower.level + 1] : null;
    const row = (label: string, cur: string, nextVal?: string) => {
      const arrow = nextVal && nextVal !== cur ? ` <span class="up">→ ${nextVal}</span>` : '';
      return `<div class="st-row"><span>${label}</span><span>${cur}${arrow}</span></div>`;
    };
    $('tp-stats').innerHTML =
      row('Damage', `${L.damage}`, next ? `${next.damage}` : undefined) +
      row('Range', `${L.range}`, next ? `${next.range}` : undefined) +
      row('Fire rate', `${L.fireRate}/s`, next ? `${next.fireRate}/s` : undefined) +
      (L.splash ? row('Splash', `${L.splash}px`, next?.splash ? `${next.splash}px` : undefined) : '') +
      (L.slow ? row('Slow', `${Math.round(L.slow * 100)}%`, next?.slow ? `${Math.round(next.slow * 100)}%` : undefined) : '') +
      row('Invested', `$${tower.invested}`) +
      row('Sell value', `$${tower.sellValue}`);
    const targeting = $('tp-targeting');
    targeting.innerHTML = '';
    for (const mode of TARGET_MODES) {
      const btn = document.createElement('div');
      btn.className = 'tg' + (tower.targetMode === mode.key ? ' active' : '');
      btn.textContent = mode.label;
      btn.addEventListener('click', () => this.game.setTargetMode(mode.key));
      targeting.appendChild(btn);
    }
    $('tp-tstats').innerHTML = `
      <div class="st-row"><span>Damage dealt</span><span>${Math.round(tower.stats.damageDealt)}</span></div>
      <div class="st-row"><span>Enemies killed</span><span>${tower.stats.kills}</span></div>`;
    const upBtn = $$('tp-upgrade');
    if (tower.canUpgrade) {
      upBtn.disabled = !this.game.economy.canAfford(tower.upgradeCost);
      upBtn.textContent = `Upgrade ($${tower.upgradeCost})`;
    } else {
      upBtn.disabled = true;
      upBtn.textContent = 'Max Level';
    }
    $('tp-sell').textContent = `Sell ($${tower.sellValue})`;
  }

  showEndScreen(result: 'victory' | 'gameover', stats: Stats): void {
    const d = stats.data;
    const title = $('end-title');
    title.textContent = result === 'victory' ? '🏆 Victory!' : '💀 Game Over';
    title.className = result === 'victory' ? 'win' : 'lose';
    $('end-sub').textContent =
      result === 'victory' ? 'You defended the base through all waves!' : 'Your base was overwhelmed.';
    const rows: [string, number | string][] = [
      ['Final score', d.score],
      ['Waves completed', d.highestWave],
      ['Enemies defeated', d.enemiesDefeated],
      ['Enemies leaked', d.enemiesLeaked],
      ['Enemies spawned', d.enemiesSpawned],
      ['Towers built', d.towersBuilt],
      ['Towers sold', d.towersSold],
      ['Money earned', `$${d.moneyEarned}`],
      ['Money spent', `$${d.moneySpent}`],
      ['Total damage', Math.round(d.totalDamageDealt)],
    ];
    $('end-stats').innerHTML = rows.map(([k, v]) => `<div class="es-row"><span>${k}</span><span>${v}</span></div>`).join('');
  }

  updateDebugPanel(): void {
    if (!this.settings.data.debug) return;
    const g = this.game;
    const fps = (window as unknown as { __fps?: number }).__fps ?? 0;
    const ft = (window as unknown as { __frametime?: number }).__frametime ?? 0;
    $('dp-stats').textContent = `FPS: ${fps}
Frame: ${ft.toFixed(2)}ms
Enemies: ${g.enemies.length}
Projectiles: ${g.projectiles.length}
Particles: ${g.particles.particles.length}
Towers: ${g.towers.length}
Path ops: ${g.pathOpsThisFrame}`;
  }

  destroy(): void {
    this.detach.forEach((d) => d());
    this.detach.length = 0;
  }
}
