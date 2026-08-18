// DOM UI: menus, HUD, build bar, tower panel, cards, debug.
import type { GameState } from '../game/state';
import { TOWERS, TOWER_ORDER, WAVES, CARDS } from '../core/defs';
import { previewWave } from '../game/waves';
import { ABILITY } from '../game/player';
import type { Difficulty, TowerKind, CardDef } from '../core/types';

export interface UISettings { music: number; sfx: number; quality: 'low' | 'medium' | 'high' }

export interface UICallbacks {
  onStartGame: (d: Difficulty) => void;
  onResume: () => void;
  onQuitToMenu: () => void;
  onStartEarly: () => void;
  onBuildSelect: (k: TowerKind | null) => void;
  onUpgradeTower: () => void;
  onSellTower: () => void;
  onChooseCard: (id: string) => void;
  onDebug: (cmd: string, arg?: string) => void;
  onSettings: (s: UISettings) => void;
  onRestart: () => void;
}

export class UI {
  private root: HTMLDivElement;
  private el: Record<string, HTMLElement | null> = {};
  private cb: UICallbacks;
  private diff: Difficulty = 'normal';
  private settings: UISettings = { music: 0.5, sfx: 0.7, quality: 'high' };
  private announceTimer: number | null = null;

  constructor(root: HTMLDivElement, cb: UICallbacks) {
    this.root = root;
    this.cb = cb;
    this.build();
  }

  setDifficulty(d: Difficulty) { this.diff = d; this.refreshMenu(); }
  setSettings(s: UISettings) { this.settings = s; }

  private build() {
    const r = this.root;
    r.innerHTML = [
      '<div class="screen menu-screen" id="menu-screen">',
      '  <div class="menu-inner">',
      '    <h1 class="game-title">LAST BASTION</h1>',
      '    <p class="tagline">Hold the crystal. Outlast the void.</p>',
      '    <div class="menu-col">',
      '      <div class="menu-section">',
      '        <label>Difficulty</label>',
      '        <div class="diff-row">',
      '          <button class="btn diff-btn" data-diff="easy">Easy</button>',
      '          <button class="btn diff-btn" data-diff="normal">Normal</button>',
      '          <button class="btn diff-btn" data-diff="hard">Hard</button>',
      '        </div>',
      '        <p class="diff-desc" id="diff-desc"></p>',
      '      </div>',
      '      <button class="btn primary big" id="btn-start">Start Defense</button>',
      '      <div class="menu-row">',
      '        <button class="btn" id="btn-controls">Controls</button>',
      '        <button class="btn" id="btn-settings">Settings</button>',
      '      </div>',
      '      <p class="best-wave" id="best-wave"></p>',
      '    </div>',
      '  </div>',
      '  <div class="modal hidden" id="controls-modal">',
      '    <h2>Controls</h2>',
      '    <div class="controls-grid">',
      '      <div><b>WASD</b><span>Move</span></div>',
      '      <div><b>Mouse</b><span>Aim</span></div>',
      '      <div><b>Auto</b><span>Melee swing (enemies in reach)</span></div>',
      '      <div><b>Left Click</b><span>Bolt attack</span></div>',
      '      <div><b>Right Click</b><span>Lance (piercing, cooldown)</span></div>',
      '      <div><b>Space</b><span>Dash</span></div>',
      '      <div><b>Q</b><span>Ground Slam</span></div>',
      '      <div><b>E</b><span>Arcane Volley</span></div>',
      '      <div><b>R</b><span>Blink (unlockable)</span></div>',
      '      <div><b>F</b><span>Overcharge (unlockable)</span></div>',
      '      <div><b>Tab</b><span>Build mode</span></div>',
      '      <div><b>Esc</b><span>Pause</span></div>',
      '      <div><b>F2</b><span>Debug panel</span></div>',
      '    </div>',
      '    <button class="btn" data-close>Close</button>',
      '  </div>',
      '  <div class="modal hidden" id="settings-modal">',
      '    <h2>Settings</h2>',
      '    <label>Music <input type="range" id="set-music" min="0" max="1" step="0.05"></label>',
      '    <label>SFX <input type="range" id="set-sfx" min="0" max="1" step="0.05"></label>',
      '    <label>Quality',
      '      <select id="set-quality">',
      '        <option value="low">Low</option>',
      '        <option value="medium">Medium</option>',
      '        <option value="high">High</option>',
      '      </select>',
      '    </label>',
      '    <button class="btn" data-close>Close</button>',
      '  </div>',
      '</div>',
      '<div class="hud hidden" id="hud">',
      '  <div class="hud-top">',
      '    <div class="panel bastion-panel">',
      '      <div class="panel-label">BASTION</div>',
      '      <div class="hp-bar big"><div class="hp-fill" id="bastion-hp-fill"></div><span class="hp-text" id="bastion-hp-text"></span></div>',
      '    </div>',
      '    <div class="panel wave-panel">',
      '      <div class="wave-num" id="wave-num">WAVE 1</div>',
      '      <div class="wave-sub" id="wave-sub"></div>',
      '      <div class="enemies-left" id="enemies-left"></div>',
      '    </div>',
      '    <div class="panel essence-panel">',
      '      <div class="essence-icon">&#9672;</div>',
      '      <div class="essence-val" id="essence-val">0</div>',
      '    </div>',
      '  </div>',
      '  <div class="boss-bar-wrap hidden" id="boss-bar-wrap">',
      '    <div class="boss-name">THE RIFT BEHEMOTH</div>',
      '    <div class="hp-bar boss"><div class="hp-fill" id="boss-hp-fill"></div></div>',
      '  </div>',
      '  <div class="prep-panel hidden" id="prep-panel">',
      '    <div class="prep-title">NEXT WAVE</div>',
      '    <div class="prep-composition" id="prep-composition"></div>',
      '    <div class="prep-count" id="prep-count"></div>',
      '    <button class="btn primary" id="btn-early">Start Wave Early <span class="early-bonus" id="early-bonus"></span></button>',
      '  </div>',
      '  <div class="hud-bottom">',
      '    <div class="panel player-panel">',
      '      <div class="panel-label">GUARDIAN</div>',
      '      <div class="hp-bar"><div class="hp-fill" id="player-hp-fill"></div><span class="hp-text" id="player-hp-text"></span></div>',
      '    </div>',
      '    <div class="abilities" id="abilities"></div>',
      '    <div class="build-hint" id="build-hint">TAB &#8212; Build Mode</div>',
      '  </div>',
      '  <div class="build-bar hidden" id="build-bar"></div>',
      '  <div class="tower-panel hidden" id="tower-panel"></div>',
      '  <div class="upgrades-strip hidden" id="upgrades-strip"></div>',
      '  <div class="announce-wrap"><div class="announce" id="announce"></div><div class="announce-sub" id="announce-sub"></div></div>',
      '</div>',
      '<div class="screen pause-screen hidden" id="pause-screen">',
      '  <div class="menu-inner small">',
      '    <h1 class="pause-title">PAUSED</h1>',
      '    <button class="btn primary big" id="btn-resume">Resume</button>',
      '    <div class="menu-row">',
      '      <button class="btn" id="btn-pause-settings">Settings</button>',
      '      <button class="btn danger" id="btn-quit">Quit to Menu</button>',
      '    </div>',
      '  </div>',
      '</div>',
      '<div class="screen upgrade-screen hidden" id="upgrade-screen">',
      '  <div class="upgrade-inner">',
      '    <h1 class="upgrade-title">THE BASTION RESONATES</h1>',
      '    <p class="upgrade-sub">Choose a boon for the defense</p>',
      '    <div class="cards" id="cards"></div>',
      '  </div>',
      '</div>',
      '<div class="screen end-screen hidden" id="end-screen">',
      '  <div class="menu-inner small">',
      '    <h1 id="end-title">VICTORY</h1>',
      '    <p id="end-sub"></p>',
      '    <div class="end-stats" id="end-stats"></div>',
      '    <button class="btn primary big" id="btn-again">Defend Again</button>',
      '    <button class="btn" id="btn-end-menu">Main Menu</button>',
      '  </div>',
      '</div>',
      '<div class="debug-panel hidden" id="debug-panel"></div>',
    ].join('\n');
    this.wire();
    this.refreshMenu();
  }

  private $(id: string): HTMLElement {
    if (!this.el[id]) this.el[id] = this.root.querySelector('#' + id);
    return this.el[id] as HTMLElement;
  }

  private wire() {
    const $ = (id: string) => this.$(id);
    this.root.querySelectorAll('.diff-btn').forEach((b) => {
      b.addEventListener('click', () => {
        this.diff = (b as HTMLElement).dataset.diff as Difficulty;
        this.refreshMenu();
      });
    });
    $('btn-start').addEventListener('click', () => this.cb.onStartGame(this.diff));
    $('btn-controls').addEventListener('click', () => $('controls-modal').classList.remove('hidden'));
    $('btn-settings').addEventListener('click', () => {
      $('settings-modal').classList.remove('hidden');
      this.syncSettingsInputs();
    });
    this.root.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => {
      (b.parentElement as HTMLElement).classList.add('hidden');
    }));
    $('set-music').addEventListener('input', () => this.emitSettings());
    $('set-sfx').addEventListener('input', () => this.emitSettings());
    $('set-quality').addEventListener('change', () => this.emitSettings());
    $('btn-early').addEventListener('click', () => this.cb.onStartEarly());
    $('btn-resume').addEventListener('click', () => this.cb.onResume());
    $('btn-quit').addEventListener('click', () => this.cb.onQuitToMenu());
    $('btn-pause-settings').addEventListener('click', () => {
      $('settings-modal').classList.remove('hidden');
      this.syncSettingsInputs();
    });
    $('btn-again').addEventListener('click', () => this.cb.onRestart());
    $('btn-end-menu').addEventListener('click', () => this.cb.onQuitToMenu());
  }

  private syncSettingsInputs() {
    (this.$('set-music') as HTMLInputElement).value = String(this.settings.music);
    (this.$('set-sfx') as HTMLInputElement).value = String(this.settings.sfx);
    (this.$('set-quality') as HTMLSelectElement).value = this.settings.quality;
  }

  private emitSettings() {
    this.settings = {
      music: parseFloat((this.$('set-music') as HTMLInputElement).value),
      sfx: parseFloat((this.$('set-sfx') as HTMLInputElement).value),
      quality: (this.$('set-quality') as HTMLSelectElement).value as UISettings['quality'],
    };
    this.cb.onSettings(this.settings);
  }

  private refreshMenu() {
    this.root.querySelectorAll('.diff-btn').forEach((b) => {
      (b as HTMLElement).classList.toggle('active', (b as HTMLElement).dataset.diff === this.diff);
    });
    const descs: Record<Difficulty, string> = {
      easy: 'Fewer, slower enemies. Generous Essence. Longer preparation.',
      normal: 'The intended experience.',
      hard: 'Faster, tougher swarms. Scarce Essence. Short preparation.',
    };
    this.$('diff-desc').textContent = descs[this.diff];
  }

  showBestWave(n: number) {
    this.$('best-wave').textContent = n > 0 ? 'Best run: wave ' + n + ' of ' + WAVES.length : 'No completed runs yet';
  }

  // ---------------- screens ----------------
  showMenu() {
    this.closeModals();
    this.show('menu-screen');
    this.hide('hud'); this.hide('pause-screen'); this.hide('upgrade-screen'); this.hide('end-screen'); this.hide('debug-panel');
  }
  showHud() {
    this.hide('menu-screen'); this.hide('pause-screen'); this.hide('upgrade-screen'); this.hide('end-screen');
    this.show('hud');
  }
  showPause() { this.show('pause-screen'); this.hide('hud'); }
  hidePause() { this.hide('pause-screen'); this.show('hud'); }

  // Esc handling: close any open modal; returns true if a modal was closed
  closeModals(): boolean {
    let closed = false;
    for (const id of ['settings-modal', 'controls-modal']) {
      const el = this.$(id);
      if (el && !el.classList.contains('hidden')) { el.classList.add('hidden'); closed = true; }
    }
    return closed;
  }

  showUpgrade(cards: CardDef[]) {
    this.show('upgrade-screen');
    const wrap = this.$('cards');
    wrap.innerHTML = '';
    for (const c of cards) {
      const div = document.createElement('div');
      div.className = 'card cat-' + c.category;
      div.innerHTML =
        '<div class="card-icon">' + c.icon + '</div>' +
        '<div class="card-name">' + c.name + '</div>' +
        '<div class="card-desc">' + c.desc + '</div>' +
        '<div class="card-cat">' + c.category + '</div>';
      div.addEventListener('click', () => this.cb.onChooseCard(c.id));
      wrap.appendChild(div);
    }
  }

  showEnd(victory: boolean, stats: { wave: number; kills: number; essence: number; towers: number; time: number }) {
    this.show('end-screen');
    this.$('end-title').textContent = victory ? 'THE BASTION STANDS' : 'THE BASTION HAS FALLEN';
    this.$('end-title').className = victory ? 'end-title victory' : 'end-title defeat';
    this.$('end-sub').textContent = victory
      ? 'The Rift Behemoth is destroyed. The crystal endures.'
      : 'The void swallows the last light. Wave ' + stats.wave + ' of ' + WAVES.length + '.';
    const mins = Math.floor(stats.time / 60), secs = Math.floor(stats.time % 60);
    this.$('end-stats').innerHTML =
      '<div><b>' + stats.wave + '</b><span>waves reached</span></div>' +
      '<div><b>' + stats.kills + '</b><span>void creatures slain</span></div>' +
      '<div><b>' + stats.essence + '</b><span>essence gathered</span></div>' +
      '<div><b>' + stats.towers + '</b><span>towers built</span></div>' +
      '<div><b>' + mins + ':' + secs.toString().padStart(2, '0') + '</b><span>time defended</span></div>';
  }

  private show(id: string) { this.$(id).classList.remove('hidden'); }
  private hide(id: string) { this.$(id).classList.add('hidden'); }

  // ---------------- HUD per-frame ----------------
  updateHud(g: GameState) {
    if (this.$('hud').classList.contains('hidden')) return;
    const bRatio = g.bastionHp / g.bastionMaxHp;
    const bFill = this.$('bastion-hp-fill');
    bFill.style.width = (bRatio * 100).toFixed(1) + '%';
    bFill.className = 'hp-fill' + (bRatio < 0.3 ? ' low' : bRatio < 0.6 ? ' mid' : '');
    this.$('bastion-hp-text').textContent = Math.ceil(g.bastionHp) + ' / ' + g.bastionMaxHp;
    const pRatio = g.player.hp / g.player.maxHp;
    const pFill = this.$('player-hp-fill');
    pFill.style.width = (pRatio * 100).toFixed(1) + '%';
    pFill.className = 'hp-fill' + (pRatio < 0.3 ? ' low' : pRatio < 0.6 ? ' mid' : '');
    this.$('player-hp-text').textContent = Math.ceil(g.player.hp) + ' / ' + g.player.maxHp;
    this.$('essence-val').textContent = String(Math.floor(g.essence));
    const inCombat = g.phase === 'combat';
    this.$('wave-num').textContent = g.wave > 0 ? 'WAVE ' + g.wave + ' / ' + WAVES.length : 'STANDBY';
    this.$('wave-sub').textContent = g.wave > 0 && g.wave <= WAVES.length ? WAVES[g.wave - 1].label : '';
    const remaining = g.enemies.length + g.spawnQueue.length;
    this.$('enemies-left').textContent = inCombat ? remaining + ' enemies remaining' : '';
    const boss = g.bossRef;
    const bossWrap = this.$('boss-bar-wrap');
    if (boss && !boss.dead && (g.phase === 'combat' || g.phase === 'prep')) {
      bossWrap.classList.remove('hidden');
      this.$('boss-hp-fill').style.width = ((boss.hp / boss.maxHp) * 100).toFixed(1) + '%';
    } else bossWrap.classList.add('hidden');
    const prep = this.$('prep-panel');
    if (g.phase === 'prep' && g.wave > 0) {
      prep.classList.remove('hidden');
      const comp = previewWave(g.wave, g.difficulty);
      this.$('prep-composition').innerHTML = comp.map((c) =>
        '<span class="comp-item"><i style="background:#' + c.color.toString(16).padStart(6, '0') + '"></i>' + c.count + ' ' + c.name + (c.count > 1 ? 's' : '') + '</span>'
      ).join('');
      this.$('prep-count').textContent = 'Starting in: ' + Math.ceil(g.prepTime) + 's';
      const bonus = Math.round(g.prepTime * 2 * g.mods.earlyBonusMult);
      this.$('early-bonus').textContent = bonus > 0 ? '(+' + bonus + ' essence)' : '';
    } else prep.classList.add('hidden');
    this.updateAbilities(g);
    this.updateBuildBar(g);
    this.updateTowerPanel(g);
    this.updateUpgradesStrip(g);
    this.$('build-hint').classList.toggle('active', g.buildMode);
    this.$('build-hint').textContent = g.buildMode ? 'TAB - Exit Build Mode' : 'TAB - Build Mode';
  }

  private updateAbilities(g: GameState) {
    const wrap = this.$('abilities');
    const keys: ('Q' | 'E' | 'R' | 'F')[] = ['Q', 'E', 'R', 'F'];
    if (wrap.children.length !== 4) {
      wrap.innerHTML = keys.map((k) =>
        '<div class="ability" data-key="' + k + '">' +
        '<div class="ability-cd"></div>' +
        '<div class="ability-key">' + k + '</div>' +
        '<div class="ability-name"></div>' +
        '</div>'
      ).join('');
    }
    const cds = { Q: this.cdQ, E: this.cdE, R: this.cdR, F: this.cdF };
    const cdMax = { Q: ABILITY.Q.cd, E: ABILITY.E.cd, R: ABILITY.R.cd, F: ABILITY.F.cd };
    const locked = { Q: false, E: false, R: !g.mods.blink, F: !g.mods.overcharge };
    for (const k of keys) {
      const el = wrap.querySelector('[data-key="' + k + '"]') as HTMLElement;
      const cd = cds[k];
      (el.querySelector('.ability-cd') as HTMLElement).style.height = ((cd / cdMax[k]) * 100).toFixed(1) + '%';
      el.querySelector('.ability-name')!.textContent = ABILITY[k].name;
      el.classList.toggle('locked', locked[k]);
      el.classList.toggle('ready', cd <= 0 && !locked[k]);
    }
  }
  cdQ = 0; cdE = 0; cdR = 0; cdF = 0;
  setCds(q: number, e: number, r: number, f: number) { this.cdQ = q; this.cdE = e; this.cdR = r; this.cdF = f; }

  private updateBuildBar(g: GameState) {
    const bar = this.$('build-bar');
    if (!g.buildMode) { bar.classList.add('hidden'); return; }
    bar.classList.remove('hidden');
    if (bar.children.length === 0) {
      for (const k of TOWER_ORDER) {
        const def = TOWERS[k];
        const btn = document.createElement('button');
        btn.className = 'tower-btn';
        btn.dataset.kind = k;
        btn.innerHTML =
          '<div class="tower-icon" style="color:#' + def.color.toString(16).padStart(6, '0') + '">' + def.icon + '</div>' +
          '<div class="tower-name">' + def.name + '</div>' +
          '<div class="tower-cost">&#9672; ' + def.cost + '</div>';
        btn.addEventListener('click', () => this.cb.onBuildSelect(k));
        bar.appendChild(btn);
      }
      const exit = document.createElement('button');
      exit.className = 'tower-btn exit';
      exit.innerHTML = '<div class="tower-icon">&#10005;</div><div class="tower-name">Exit</div><div class="tower-cost">TAB</div>';
      exit.addEventListener('click', () => this.cb.onBuildSelect(null));
      bar.appendChild(exit);
    }
    for (const child of bar.children) {
      const btn = child as HTMLElement;
      const k = btn.dataset.kind as TowerKind | undefined;
      if (k) {
        btn.classList.toggle('selected', g.buildSelection === k);
        btn.classList.toggle('unaffordable', g.essence < TOWERS[k].cost);
      }
    }
  }

  private updateTowerPanel(g: GameState) {
    const panel = this.$('tower-panel');
    const t = g.towers.find((x) => x.id === g.selectedTowerId);
    if (!t || !g.buildMode) { panel.classList.add('hidden'); return; }
    panel.classList.remove('hidden');
    const def = TOWERS[t.kind];
    const up = t.level < 3 ? def.upgrades[t.level - 1] : null;
    const sellVal = Math.round(t.invested * g.mods.sellRefund);
    panel.innerHTML =
      '<div class="tp-title" style="color:#' + def.color.toString(16).padStart(6, '0') + '">' + def.icon + ' ' + def.name + ' <span class="tp-level">LV' + t.level + '</span></div>' +
      '<div class="tp-stats">' +
      '<span>DMG ' + Math.round(t.damage) + '</span>' +
      '<span>RNG ' + Math.round(t.range) + '</span>' +
      '<span>SPD ' + (1 / t.interval).toFixed(2) + '/s</span>' +
      '<span>HP ' + Math.ceil(t.hp) + '/' + t.maxHp + '</span>' +
      '</div>' +
      (up
        ? '<button class="btn primary tp-btn" id="tp-upgrade"' + (g.essence < up.cost ? ' disabled' : '') + '>Upgrade: ' + up.name + ' (&#9672; ' + up.cost + ')</button>' +
          '<p class="tp-desc">' + up.desc + '</p>'
        : '<p class="tp-desc">Fully upgraded.</p>') +
      '<button class="btn tp-btn" id="tp-sell">Sell (&#9672; ' + sellVal + ')</button>';
    if (up) panel.querySelector('#tp-upgrade')!.addEventListener('click', () => this.cb.onUpgradeTower());
    panel.querySelector('#tp-sell')!.addEventListener('click', () => this.cb.onSellTower());
  }

  private updateUpgradesStrip(g: GameState) {
    const strip = this.$('upgrades-strip');
    if (g.acquiredCards.length === 0) { strip.classList.add('hidden'); return; }
    strip.classList.remove('hidden');
    const icons = g.acquiredCards.map((id) => {
      const c = CARDS.find((x) => x.id === id);
      return c ? '<span class="upg-icon" title="' + c.name + ': ' + c.desc + '">' + c.icon + '</span>' : '';
    }).join('');
    strip.innerHTML = icons;
  }

  // ---------------- announcements ----------------
  announce(msg: string, sub: string, color = '#9fe8ff') {
    const a = this.$('announce');
    const s = this.$('announce-sub');
    a.textContent = msg;
    a.style.color = color;
    s.textContent = sub;
    a.classList.remove('show');
    void a.offsetWidth;
    a.classList.add('show');
    if (this.announceTimer) window.clearTimeout(this.announceTimer);
    this.announceTimer = window.setTimeout(() => a.classList.remove('show'), 2600);
  }

  // ---------------- debug ----------------
  showDebug(visible: boolean) {
    this.$('debug-panel').classList.toggle('hidden', !visible);
  }
  updateDebug(d: {
    fps: number; frameMs: number; enemies: number; projectiles: number; towers: number;
    particles: number; speed: number; spawnPaused: boolean; showPaths: boolean; showRanges: boolean;
    essence: number; bastion: number; wave: number;
  }) {
    const p = this.$('debug-panel');
    if (p.classList.contains('hidden')) return;
    p.innerHTML =
      '<div class="dbg-title">DEBUG (F2)</div>' +
      '<div class="dbg-row"><span>FPS</span><b>' + d.fps.toFixed(0) + '</b></div>' +
      '<div class="dbg-row"><span>Frame</span><b>' + d.frameMs.toFixed(2) + ' ms</b></div>' +
      '<div class="dbg-row"><span>Enemies</span><b>' + d.enemies + '</b></div>' +
      '<div class="dbg-row"><span>Projectiles</span><b>' + d.projectiles + '</b></div>' +
      '<div class="dbg-row"><span>Towers</span><b>' + d.towers + '</b></div>' +
      '<div class="dbg-row"><span>Particles</span><b>' + d.particles + '</b></div>' +
      '<div class="dbg-row"><span>Essence</span><b>' + Math.floor(d.essence) + '</b></div>' +
      '<div class="dbg-row"><span>Bastion</span><b>' + Math.ceil(d.bastion) + '</b></div>' +
      '<div class="dbg-row"><span>Wave</span><b>' + d.wave + '</b></div>' +
      '<div class="dbg-row"><span>Speed</span><b>' + d.speed + 'x</b></div>' +
      '<div class="dbg-btns">' +
      '<button data-cmd="wave">Next Wave</button>' +
      '<button data-cmd="spawnpause">' + (d.spawnPaused ? 'Resume Spawn' : 'Pause Spawn') + '</button>' +
      '<button data-cmd="essence">+500</button>' +
      '<button data-cmd="dmg">Bastion -100</button>' +
      '<button data-cmd="killall">Kill All</button>' +
      '<button data-cmd="paths">' + (d.showPaths ? 'Hide' : 'Show') + ' Paths</button>' +
      '<button data-cmd="ranges">' + (d.showRanges ? 'Hide' : 'Show') + ' Ranges</button>' +
      '<button data-cmd="speed05">0.5x</button>' +
      '<button data-cmd="speed1">1x</button>' +
      '<button data-cmd="speed2">2x</button>' +
      '<button data-cmd="speed4">4x</button>' +
      '</div>' +
      '<div class="dbg-spawn"><span>Spawn:</span>' +
      ['crawler', 'wisp', 'brute', 'bulwark', 'shaman', 'colossus', 'boss'].map((k) => '<button data-cmd="spawn" data-arg="' + k + '">' + k + '</button>').join('') +
      '</div>';
    p.querySelectorAll('button').forEach((b) => {
      b.addEventListener('click', () => {
        this.cb.onDebug((b as HTMLElement).dataset.cmd!, (b as HTMLElement).dataset.arg);
      });
    });
  }
}


