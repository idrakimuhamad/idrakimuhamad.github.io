// Last Bastion - entry point
import './style.css';
import { Game } from './game/game';
import { Renderer } from './render/renderer';
import { InputManager } from './input/input';
import { UI, type UISettings } from './ui/ui';
import { AudioSys } from './audio/audio';
import { loadSave, saveSave } from './core/save';
import { getCd } from './game/player';
import { rollCards } from './game/upgrades';
import { canPlace, placeTower, upgradeTower, sellTower } from './game/towers';
import type { Difficulty, TowerKind, Vec3 } from './core/types';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const uiRoot = document.getElementById('ui-root') as HTMLDivElement;

const save = loadSave();
const audio = new AudioSys();
audio.setVolumes(save.settings.sfx, save.settings.music);

const game = new Game();
const renderer = new Renderer(canvas, game.g.arena);
renderer.setQuality(save.settings.quality);
const input = new InputManager(canvas);
const ui = new UI(uiRoot, {
  onStartGame: (d) => startGame(d),
  onResume: () => game.togglePause(),
  onQuitToMenu: () => quitToMenu(),
  onStartEarly: () => game.startEarly(),
  onBuildSelect: (k) => setBuildSelection(k),
  onUpgradeTower: () => {
    const t = game.g.towers.find((x) => x.id === game.g.selectedTowerId);
    if (t) upgradeTower(game.g, t);
  },
  onSellTower: () => {
    const t = game.g.towers.find((x) => x.id === game.g.selectedTowerId);
    if (t) sellTower(game.g, t);
  },
  onChooseCard: (id) => game.chooseCard(id),
  onDebug: (cmd, arg) => debugCommand(cmd, arg),
  onSettings: (s) => applySettings(s),
  onRestart: () => startGame(lastDifficulty),
});
ui.setDifficulty(save.difficulty);
ui.setSettings(save.settings);
ui.showBestWave(save.bestWave);
ui.showMenu();

let lastDifficulty: Difficulty = save.difficulty;
let debugVisible = false;
let endDelay = -1;

function startGame(d: Difficulty) {
  audio.init();
  lastDifficulty = d;
  save.difficulty = d;
  saveSave(save);
  game.startRun(d);
  renderer.resetEntities();
  ui.showHud();
  endDelay = -1;
}

function quitToMenu() {
  const g = game.g;
  g.phase = 'menu';
  // reset transient state so the menu is always clean
  g.buildMode = false;
  g.buildSelection = null;
  g.selectedTowerId = -1;
  ui.showMenu();
  ui.showBestWave(save.bestWave);
}

function applySettings(s: UISettings) {
  save.settings = s;
  saveSave(save);
  audio.setVolumes(s.sfx, s.music);
  renderer.setQuality(s.quality);
}

function setBuildSelection(k: TowerKind | null) {
  const g = game.g;
  if (k === null) {
    g.buildMode = false;
    g.buildSelection = null;
    g.selectedTowerId = -1;
  } else {
    g.buildMode = true;
    g.buildSelection = k;
    g.selectedTowerId = -1;
  }
}

function toggleBuildMode() {
  const g = game.g;
  if (g.phase !== 'prep' && g.phase !== 'combat') return;
  if (g.buildMode) {
    g.buildMode = false;
    g.buildSelection = null;
    g.selectedTowerId = -1;
  } else {
    g.buildMode = true;
    g.buildSelection = null;
  }
}

function togglePause() {
  // Esc first closes any open modal (settings/controls); second Esc pauses
  if (ui.closeModals()) return;
  const g = game.g;
  if (g.phase === 'prep' || g.phase === 'combat' || g.phase === 'upgrade' || g.phase === 'paused') {
    game.togglePause();
    if (g.phase === 'paused') ui.showPause();
    else ui.hidePause();
  }
}

function debugCommand(cmd: string, arg?: string) {
  const g = game.g;
  switch (cmd) {
    case 'wave': game.debugStartWave(); break;
    case 'spawnpause': game.debugToggleSpawnPause(); break;
    case 'essence': game.debugAddEssence(500); break;
    case 'dmg': game.debugDamageBastion(100); break;
    case 'killall': game.debugKillAll(); break;
    case 'paths': g.debug.showPaths = !g.debug.showPaths; break;
    case 'ranges': g.debug.showRanges = !g.debug.showRanges; break;
    case 'speed05': g.gameSpeed = 0.5; break;
    case 'speed1': g.gameSpeed = 1; break;
    case 'speed2': g.gameSpeed = 2; break;
    case 'speed4': g.gameSpeed = 4; break;
    case 'spawn': if (arg) game.debugSpawn(arg as any, 0); break;
  }
}

input.onTab = toggleBuildMode;
input.onEscape = togglePause;
input.onF2 = () => {
  debugVisible = !debugVisible;
  ui.showDebug(debugVisible);
};

// phase change hook
game.onPhaseChange = (phase) => {
  const g = game.g;
  if (phase === 'upgrade') {
    const cards = rollCards(g);
    g.pendingCards = cards.map((c) => ({ id: c.id, name: c.name, icon: c.icon, desc: c.desc, category: c.category }));
    ui.showUpgrade(cards);
  } else if (phase === 'gameover' || phase === 'victory') {
    if (endDelay < 0) endDelay = 1.4;
    if (g.wave > save.bestWave) {
      save.bestWave = g.wave;
      saveSave(save);
    }
    for (const c of g.acquiredCards) {
      if (!save.discovered.includes(c)) save.discovered.push(c);
    }
    saveSave(save);
  } else if (phase === 'prep' || phase === 'combat') {
    ui.showHud();
  }
};

// ---------------- main loop ----------------
let lastT = performance.now();
let fps = 60, frameMs = 16;
let fpsAcc = 0, fpsN = 0, fpsTimer = 0;

function frame(now: number) {
  requestAnimationFrame(frame);
  let dt = (now - lastT) / 1000;
  lastT = now;
  if (dt > 0.1) dt = 0.1;
  const t0 = performance.now();

  // aim point
  const snap = input.snapshot();
  const aim: Vec3 = renderer.screenToGround(snap.aimNdc.x, snap.aimNdc.y);

  // build mode hover pad
  const g = game.g;
  let hoverPad = -1, hoverValid = true;
  if (g.buildMode && g.buildSelection) {
    let bestD = 2.0;
    for (const p of g.arena.pads) {
      const d = Math.hypot(p.pos.x - aim.x, p.pos.z - aim.z);
      if (d < bestD) { bestD = d; hoverPad = p.id; }
    }
    if (hoverPad >= 0) hoverValid = canPlace(g, hoverPad, g.buildSelection);
  }
  renderer.setBuildState(hoverPad, hoverValid, g.buildSelection, g.selectedTowerId, g.debug.showRanges);

  // click handling (build / select)
  if (input.clickPos) {
    const cp = input.clickPos;
    input.clickPos = null;
    if (g.buildMode && g.phase !== 'paused') {
      if (hoverPad >= 0) {
        const existing = g.towers.find((t) => t.padId === hoverPad && !t.dead);
        if (existing) {
          g.selectedTowerId = existing.id;
          g.buildSelection = null;
        } else if (g.buildSelection && hoverValid) {
          placeTower(g, hoverPad, g.buildSelection);
          g.selectedTowerId = -1;
        }
      } else {
        g.selectedTowerId = -1;
      }
    } else {
      g.selectedTowerId = -1;
    }
    void cp;
  }

  // simulate
  game.update(dt, {
    moveX: snap.moveX, moveY: snap.moveY, aim,
    firing: snap.firing && !g.buildMode,
    lance: snap.lance && !g.buildMode,
    dash: snap.dash, q: snap.q, e: snap.e, r: snap.r, f: snap.f,
    ultimate: snap.ultimate,
  });

  // fx routing (single drain point for the whole game)
  for (const fx of g.drainFx()) {
    if (fx.type === 'sound') audio.play(fx.sound!);
    else if (fx.type === 'announce') ui.announce(fx.msg ?? '', fx.sub ?? '', fx.color);
    else if (fx.type === 'burst' && fx.pos) {
      const hex = fx.color ?? '#ffffff';
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const gg = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      g.particles.burst(fx.pos.x, fx.pos.y, fx.pos.z, [r, gg, b], fx.value ?? 10, fx.speed ?? 4, 2.5, 0.7, fx.size ?? 0.15);
    } else renderer.handleFx([fx]);
  }

  // end screen delay
  if (endDelay > 0) {
    endDelay -= dt;
    if (endDelay <= 0) {
      const victory = g.phase === 'victory';
      ui.showEnd(victory, {
        wave: g.wave, kills: g.stats.kills, essence: Math.floor(g.stats.essenceEarned),
        towers: g.stats.towersBuilt, time: g.stats.time,
      });
    }
  }

  // adaptive music mood: boss > combat > ambient, era tracks the battlefield
  const bossActive = g.enemies.some((e) => e.kind === 'boss' && !e.dead);
  audio.setMusicMood(bossActive ? 2 : g.phase === 'combat' ? 1 : 0, g.era);

  // UI
  ui.setCds(getCd('Q'), getCd('E'), getCd('R'), getCd('F'));
  ui.updateHud(g);
  if (debugVisible) {
    ui.updateDebug({
      fps, frameMs, enemies: g.enemies.length,
      projectiles: g.projectilePool.filter((p) => p.active).length,
      towers: g.towers.length, particles: g.particles.count,
      speed: g.gameSpeed, spawnPaused: g.spawnPaused,
      showPaths: g.debug.showPaths, showRanges: g.debug.showRanges,
      essence: g.essence, bastion: g.bastionHp, wave: g.wave,
    });
  }

  // render
  renderer.sync(g, dt);

  // fps
  const ft = performance.now() - t0;
  frameMs = frameMs * 0.9 + ft * 0.1;
  fpsAcc += 1 / Math.max(dt, 0.001); fpsN++;
  fpsTimer += dt;
  if (fpsTimer > 0.5) { fps = fpsAcc / fpsN; fpsAcc = 0; fpsN = 0; fpsTimer = 0; }
}

window.addEventListener('resize', () => renderer.resize());
renderer.resize();
requestAnimationFrame(frame);

// debug/verification handle (used by headless smoke tests)
(window as any).__lb = { game, renderer, audio, ui, placeTower, canPlace };
