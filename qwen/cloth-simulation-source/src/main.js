// main.js — application entry point.
// Wires together: Simulator (physics), WebGLRenderer (rendering),
// Interaction (input), Controls (UI), PerfMonitor (stats), and the main loop.

import { Simulator } from './physics/Simulator.js';
import { WebGLRenderer } from './render/WebGLRenderer.js';
import { Interaction } from './interaction/Interaction.js';
import { Controls } from './ui/Controls.js';
import { PerfMonitor } from './ui/PerfMonitor.js';

function boot() {
  const canvas = document.getElementById('gl');

  // ---- core objects ----
  const sim = new Simulator();
  const renderer = new WebGLRenderer(canvas, sim);
  const interaction = new Interaction(canvas, sim, renderer);
  const controls = new Controls(document.getElementById('panel-inner'), sim, renderer, interaction);
  const perf = new PerfMonitor(sim);

  // start on the Cotton preset for a balanced default look
  controls.applyPreset('cotton');

  // ---- responsive panel toggle (mobile drawer) ----
  const panel = document.getElementById('panel');
  const toggle = document.getElementById('panel-toggle');
  toggle.addEventListener('click', () => panel.classList.toggle('open'));
  // auto-open on wide screens by default (CSS shows it), closed state is mobile-only

  // ---- resize handling ----
  const onResize = () => renderer.resize();
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);
  onResize();

  // ---- main loop: fixed-timestep physics, variable-rate rendering ----
  let last = performance.now();
  function frame(now) {
    const dt = (now - last) / 1000;
    last = now;

    // physics (fixed timestep internally)
    sim.advance(dt);

    // render
    renderer.render();

    // stats
    perf.setPhysicsMs(sim.lastPhysicsMs || 0);
    perf.tick(now);

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // expose a small debug handle (harmless, useful for console tinkering)
  window.__cloth = { sim, renderer, controls, interaction };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
