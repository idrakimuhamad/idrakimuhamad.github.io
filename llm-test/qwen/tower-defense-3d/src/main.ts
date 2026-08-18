// Gridlock Defense 3D — entry point (Phase 2: full game wiring).
// Game (core, renderer-independent) + Renderer (three.js) + Input + UI + Sfx.

import './style.css';
import { Game } from './core/game';
import { Renderer } from './render/renderer';
import { Input } from './input/input';
import { UI } from './ui/ui';
import { Sfx } from './audio/audio';
import { Settings } from './settings';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const holder = document.getElementById('canvas-holder') as HTMLDivElement;

const settings = new Settings();
const audio = new Sfx(settings);

// Game callbacks fire only on state transitions (after start()), so the UI
// can be constructed after the game and referenced from the closures.
let ui: UI;
const game = new Game(
  settings,
  (name) => audio.play(name),
  {
    onStateChange: (s) => ui.setState(s),
    onHudUpdate: (h) => ui.updateHud(h),
    onToast: (m, k) => ui.showToast(m, k),
    onSelectedTower: (t) => ui.updateTowerPanel(t),
    onBuildSelection: () => ui.syncBuildBar(),
    onEndScreen: (r, s) => ui.showEndScreen(r, s),
  },
);

const renderer = new Renderer(canvas, settings);
ui = new UI(game, settings, audio, renderer);
new Input(game, canvas, renderer);

ui.setState('menu');

// ---- canvas sizing (same 960x640 aspect as the 2D game) --------------------

function fitCanvas(): void {
  const p = Math.min(window.innerWidth - 24, 1280);
  const m = Math.max(300, window.innerHeight - 24 - 150);
  const y = 960 / 640;
  let w = p;
  let h = w / y;
  if (h > m) {
    h = m;
    w = h * y;
  }
  holder.style.width = `${w}px`;
  holder.style.height = `${h}px`;
  renderer.resize();
}
window.addEventListener('resize', fitCanvas);
fitCanvas();

// ---- audio unlock on first interaction -------------------------------------

const unlock = () => audio.unlock();
window.addEventListener('pointerdown', unlock, { once: true });
window.addEventListener('keydown', unlock, { once: true });

// ---- main loop ---------------------------------------------------------------

let last = performance.now();
let fpsCount = 0;
let fpsTime = performance.now();

renderer.gl.setAnimationLoop((now: number) => {
  const dt = Math.min((now - last) / 1000, 0.25);
  last = now;
  game.frame(dt);
  renderer.draw(dt, game);

  fpsCount++;
  if (now - fpsTime >= 500) {
    (window as unknown as { __fps: number }).__fps = Math.round((fpsCount * 1000) / (now - fpsTime));
    (window as unknown as { __frametime: number }).__frametime = (now - fpsTime) / fpsCount;
    fpsCount = 0;
    fpsTime = now;
    ui.updateDebugPanel();
  }
});

(window as unknown as { __game: Game }).__game = game;
(window as unknown as { __renderer: Renderer }).__renderer = renderer;
