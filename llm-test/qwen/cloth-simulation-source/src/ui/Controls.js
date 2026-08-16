// Controls — builds the control panel DOM and wires every control to the live
// Simulator. Organized into logical sections: Simulation, Cloth, Wind,
// Constraints, Rendering, plus presets and action buttons.

import { PRESETS, applyPreset } from '../presets.js';

export class Controls {
  /**
   * @param {HTMLElement} container the #panel-inner element
   * @param {object} sim
   * @param {object} renderer
   * @param {object} interaction
   */
  constructor(container, sim, renderer, interaction) {
    this.container = container;
    this.sim = sim;
    this.renderer = renderer;
    this.interaction = interaction;
    this.activePreset = null;
    this.rebuildTimer = null;

    this._build();
    this.syncFromSim();
  }

  // ---------- DOM helpers ----------
  _el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  _section(title) {
    const s = this._el('div', 'section');
    const h = this._el('div', 'section-head');
    h.appendChild(this._el('span', 'dot'));
    h.appendChild(this._el('h2', null, title));
    s.appendChild(h);
    return s;
  }

  _slider({ label, min, max, step, value, onInput, fmt }) {
    const wrap = this._el('div', 'ctrl');
    const row = this._el('div', 'ctrl-row');
    const labelEl = this._el('label', null, label);
    const valEl = this._el('span', 'val');
    row.appendChild(labelEl);
    row.appendChild(valEl);
    const input = this._el('input');
    input.type = 'range';
    input.min = min;
    input.max = max;
    input.step = step;
    input.value = value;
    const fmtFn = fmt || ((v) => (Number.isInteger(+step) ? Math.round(v) : (+v).toFixed(2)));
    const update = () => {
      valEl.textContent = fmtFn(input.value);
    };
    update();
    input.addEventListener('input', () => {
      update();
      onInput(parseFloat(input.value));
    });
    wrap.appendChild(row);
    wrap.appendChild(input);
    this.container.appendChild(wrap);
    return { input, valEl, update, set: (v) => { input.value = v; update(); } };
  }

  _toggle({ label, value, onInput }) {
    const wrap = this._el('div', 'ctrl');
    const row = this._el('div', 'ctrl-row');
    row.appendChild(this._el('label', null, label));
    const sw = this._el('label', 'switch');
    const input = this._el('input');
    input.type = 'checkbox';
    input.checked = !!value;
    const track = this._el('span', 'track');
    sw.appendChild(input);
    sw.appendChild(track);
    row.appendChild(sw);
    input.addEventListener('change', () => onInput(input.checked));
    wrap.appendChild(row);
    this.container.appendChild(wrap);
    return { input, set: (v) => { input.checked = !!v; } };
  }

  _buttons({ items, onAction }) {
    const row = this._el('div', 'btn-row');
    for (const it of items) {
      const b = this._el('button', 'btn' + (it.cls ? ' ' + it.cls : ''), it.label);
      b.dataset.action = it.action;
      b.addEventListener('click', () => onAction(it.action, b));
      row.appendChild(b);
    }
    this.container.appendChild(row);
    return row;
  }

  _seg({ options, value, onChange }) {
    const seg = this._el('div', 'seg');
    for (const o of options) {
      const b = this._el('button', null, o.label);
      b.dataset.value = o.value;
      if (o.value === value) b.classList.add('active');
      b.addEventListener('click', () => {
        for (const x of seg.children) x.classList.remove('active');
        b.classList.add('active');
        onChange(o.value);
      });
      seg.appendChild(b);
    }
    this.container.appendChild(seg);
    return seg;
  }

  // ---------- build ----------
  _build() {
    const sim = this.sim;
    const renderer = this.renderer;

    // ---- title ----
    const title = this._el('div', 'panel-title');
    title.appendChild(this._el('h1', null, 'Cloth Physics'));
    title.appendChild(this._el('span', 'sub', 'Verlet + PBD · WebGL'));
    this.container.appendChild(title);

    // ---- presets ----
    const presets = this._el('div', 'presets');
    this.presetBtns = {};
    for (const key of Object.keys(PRESETS)) {
      const p = PRESETS[key];
      const b = this._el('button', 'preset-btn');
      b.innerHTML = `${p.name}<small>${p.desc}</small>`;
      b.addEventListener('click', () => this.applyPreset(key));
      presets.appendChild(b);
      this.presetBtns[key] = b;
    }
    this.container.appendChild(presets);

    // ---- Simulation section ----
    const simSec = this._section('Simulation');
    this.container.appendChild(simSec);
    this._sectionEl = simSec;
    this.c = {};
    this.c.gravity = this._sectionSlider(simSec, { label: 'Gravity', min: 0, max: 30, step: 0.1, value: sim.gravity, onInput: (v) => { sim.gravity = v; } });
    this.c.damping = this._sectionSlider(simSec, { label: 'Damping', min: 0.9, max: 0.999, step: 0.001, value: sim.damping, fmt: (v) => (+v).toFixed(3), onInput: (v) => { sim.damping = v; } });
    this.c.iterations = this._sectionSlider(simSec, { label: 'Solver iterations', min: 1, max: 20, step: 1, value: sim.iterations, onInput: (v) => { sim.iterations = v; } });
    this.c.simSpeed = this._sectionSlider(simSec, { label: 'Simulation speed', min: 0.1, max: 3, step: 0.1, value: sim.simSpeed, fmt: (v) => (+v).toFixed(1) + '×', onInput: (v) => { sim.simSpeed = v; } });
    this.c.cols = this._sectionSlider(simSec, { label: 'Resolution (cols)', min: 8, max: 60, step: 1, value: sim.cols, onInput: (v) => { sim.cols = v; this._scheduleRebuild(); } });
    this.c.rows = this._sectionSlider(simSec, { label: 'Resolution (rows)', min: 8, max: 60, step: 1, value: sim.rows, onInput: (v) => { sim.rows = v; this._scheduleRebuild(); } });
    this.c.width = this._sectionSlider(simSec, { label: 'Cloth width', min: 4, max: 16, step: 0.5, value: sim.width, onInput: (v) => { sim.width = v; this._scheduleRebuild(); } });
    this.c.height = this._sectionSlider(simSec, { label: 'Cloth height', min: 4, max: 16, step: 0.5, value: sim.height, onInput: (v) => { sim.height = v; this._scheduleRebuild(); } });

    // ---- Cloth section ----
    const clothSec = this._section('Cloth');
    this.container.appendChild(clothSec);
    this.c.struct = this._sectionSlider(clothSec, { label: 'Structural stiffness', min: 0.1, max: 1, step: 0.05, value: sim.structuralStiffness, onInput: (v) => { sim.structuralStiffness = v; } });
    this.c.shear = this._sectionSlider(clothSec, { label: 'Shear stiffness', min: 0, max: 1, step: 0.05, value: sim.shearStiffness, onInput: (v) => { sim.shearStiffness = v; } });
    this.c.bend = this._sectionSlider(clothSec, { label: 'Bending stiffness', min: 0, max: 1, step: 0.05, value: sim.bendingStiffness, onInput: (v) => { sim.bendingStiffness = v; } });
    this.c.mass = this._sectionSlider(clothSec, { label: 'Particle mass', min: 0.05, max: 5, step: 0.05, value: sim.mass, onInput: (v) => { sim.mass = v; this._scheduleRebuild(); } });

    // ---- Wind section ----
    const windSec = this._section('Wind');
    this.container.appendChild(windSec);
    const w = sim.wind;
    this.c.windEnabled = this._sectionToggle(windSec, { label: 'Enable wind', value: w.enabled, onInput: (v) => { w.enabled = v; } });
    this.c.windStrength = this._sectionSlider(windSec, { label: 'Wind strength', min: 0, max: 60, step: 1, value: w.strength, onInput: (v) => { w.strength = v; } });
    this.c.windDir = this._sectionSlider(windSec, { label: 'Wind direction', min: 0, max: 360, step: 1, value: (w.direction * 180) / Math.PI, fmt: (v) => Math.round(v) + '°', onInput: (v) => { w.direction = (v * Math.PI) / 180; } });
    this.c.windTurb = this._sectionSlider(windSec, { label: 'Turbulence', min: 0, max: 1, step: 0.05, value: w.turbulence, onInput: (v) => { w.turbulence = v; } });
    this.c.windGustFreq = this._sectionSlider(windSec, { label: 'Gust frequency', min: 0.1, max: 3, step: 0.1, value: w.gustFrequency, fmt: (v) => (+v).toFixed(1) + ' Hz', onInput: (v) => { w.gustFrequency = v; } });
    this.c.windGust = this._sectionSlider(windSec, { label: 'Gustiness', min: 0, max: 1, step: 0.05, value: w.gustiness, onInput: (v) => { w.gustiness = v; } });

    // ---- Constraints section ----
    const conSec = this._section('Constraints');
    this.container.appendChild(conSec);
    this.c.pinMode = this._sectionSeg(conSec, {
      options: [
        { value: 'top-left', label: 'TL' },
        { value: 'top-right', label: 'TR' },
        { value: 'top-edge', label: 'Top' },
        { value: 'corners', label: 'Corners' },
        { value: 'left-edge', label: 'Left' },
        { value: 'none', label: 'None' },
      ],
      value: sim.pinMode,
      onChange: (v) => { sim.setPinMode(v); this._clearPreset(); },
    });
    this.c.tearEnabled = this._sectionToggle(conSec, { label: 'Enable tearing', value: sim.tearingEnabled, onInput: (v) => { sim.tearingEnabled = v; } });
    this.c.tearThreshold = this._sectionSlider(conSec, { label: 'Tear threshold (stretch)', min: 1.1, max: 3, step: 0.05, value: sim.tearThreshold, onInput: (v) => { sim.tearThreshold = v; } });

    // quick pin buttons
    const pinBtns = this._el('div', 'btn-row');
    const mkBtn = (label, action, cls) => {
      const b = this._el('button', 'btn' + (cls ? ' ' + cls : ''), label);
      b.addEventListener('click', () => this._onPinAction(action));
      pinBtns.appendChild(b);
    };
    mkBtn('Pin top-left', 'top-left');
    mkBtn('Pin top-right', 'top-right');
    mkBtn('Pin top edge', 'top-edge');
    mkBtn('Unpin all', 'none', 'danger');
    this.container.appendChild(pinBtns);

    // ---- Rendering section ----
    const renSec = this._section('Rendering');
    this.container.appendChild(renSec);
    this.c.solid = this._sectionToggle(renSec, { label: 'Solid surface', value: renderer.showSolid, onInput: (v) => { renderer.showSolid = v; } });
    this.c.wire = this._sectionToggle(renSec, { label: 'Wireframe', value: renderer.showWireframe, onInput: (v) => { renderer.showWireframe = v; } });
    this.c.particles = this._sectionToggle(renSec, { label: 'Show particles', value: renderer.showParticles, onInput: (v) => { renderer.showParticles = v; } });
    this.c.constraints = this._sectionToggle(renSec, { label: 'Show constraints', value: renderer.showConstraints, onInput: (v) => { renderer.showConstraints = v; } });
    this.c.pinned = this._sectionToggle(renSec, { label: 'Show pinned particles', value: renderer.showPinned, onInput: (v) => { renderer.showPinned = v; } });
    this.c.normals = this._sectionToggle(renSec, { label: 'Show normals', value: renderer.showNormals, onInput: (v) => { renderer.showNormals = v; } });
    this.c.opacity = this._sectionSlider(renSec, { label: 'Cloth opacity', min: 0.1, max: 1, step: 0.05, value: renderer.opacity, onInput: (v) => { renderer.opacity = v; } });

    // ---- Actions ----
    const actSec = this._section('Actions');
    this.container.appendChild(actSec);
    const actRow = this._el('div', 'btn-row');
    this.pauseBtn = this._el('button', 'btn primary', '⏸ Pause');
    this.pauseBtn.addEventListener('click', () => this.togglePause());
    const resetBtn = this._el('button', 'btn', '↺ Reset');
    resetBtn.addEventListener('click', () => this.reset());
    const orbitBtn = this._el('button', 'btn', '⟲ View');
    orbitBtn.addEventListener('click', () => this.resetView());
    actRow.appendChild(this.pauseBtn);
    actRow.appendChild(resetBtn);
    actRow.appendChild(orbitBtn);
    this.container.appendChild(actRow);

    // interaction mode (drag vs pin)
    const modeRow = this._el('div', 'ctrl');
    const modeHead = this._el('div', 'ctrl-row');
    modeHead.appendChild(this._el('label', null, 'Pointer mode'));
    modeRow.appendChild(modeHead);
    this.c.mode = this._seg({
      options: [
        { value: 'drag', label: 'Drag cloth' },
        { value: 'pin', label: 'Pin / unpin' },
      ],
      value: this.interaction.mode,
      onChange: (v) => this.interaction.setMode(v),
    });
    modeRow.appendChild(this.c.mode);
    this.container.appendChild(modeRow);

    // footer
    const foot = this._el('div', 'panel-foot');
    foot.innerHTML = 'Custom WebGL renderer · Verlet + PBD cloth physics<br>No physics libraries — all simulation logic implemented in-browser.';
    this.container.appendChild(foot);
  }

  // section-scoped builders (append into a given section element)
  _sectionSlider(section, opts) {
    const prev = this.container;
    this.container = section;
    const r = this._slider(opts);
    this.container = prev;
    return r;
  }
  _sectionToggle(section, opts) {
    const prev = this.container;
    this.container = section;
    const r = this._toggle(opts);
    this.container = prev;
    return r;
  }
  _sectionSeg(section, opts) {
    const prev = this.container;
    this.container = section;
    const r = this._seg(opts);
    this.container = prev;
    return r;
  }

  // ---------- actions ----------
  _scheduleRebuild() {
    this._clearPreset();
    if (this.rebuildTimer) return;
    this.rebuildTimer = setTimeout(() => {
      this.rebuildTimer = null;
      this.sim.rebuild();
    }, 250);
  }

  _onPinAction(action) {
    this.sim.setPinMode(action);
    // reflect in the segmented control
    if (this.c.pinMode) {
      for (const b of this.c.pinMode.children) {
        b.classList.toggle('active', b.dataset.value === action);
      }
    }
    this._clearPreset();
  }

  togglePause() {
    this.sim.paused = !this.sim.paused;
    this.pauseBtn.textContent = this.sim.paused ? '▶ Resume' : '⏸ Pause';
    this.pauseBtn.classList.toggle('toggled', this.sim.paused);
  }

  reset() {
    this.sim.reset();
  }

  resetView() {
    this.renderer.target = [5, 4, 0];
    this.renderer.theta = 0.5;
    this.renderer.phi = 1.15;
    this.renderer.radius = 16;
  }

  applyPreset(key) {
    applyPreset(this.sim, key);
    this.activePreset = key;
    this.syncFromSim();
    for (const k of Object.keys(this.presetBtns)) {
      this.presetBtns[k].classList.toggle('active', k === key);
    }
  }

  _clearPreset() {
    if (this.activePreset) {
      this.activePreset = null;
      for (const k of Object.keys(this.presetBtns)) this.presetBtns[k].classList.remove('active');
    }
  }

  /** Push current sim/renderer state back into the controls (after a preset). */
  syncFromSim() {
    const sim = this.sim;
    const r = this.renderer;
    const w = sim.wind;
    this.c.gravity.set(sim.gravity);
    this.c.damping.set(sim.damping);
    this.c.iterations.set(sim.iterations);
    this.c.simSpeed.set(sim.simSpeed);
    this.c.cols.set(sim.cols);
    this.c.rows.set(sim.rows);
    this.c.width.set(sim.width);
    this.c.height.set(sim.height);
    this.c.struct.set(sim.structuralStiffness);
    this.c.shear.set(sim.shearStiffness);
    this.c.bend.set(sim.bendingStiffness);
    this.c.mass.set(sim.mass);
    this.c.windEnabled.set(w.enabled);
    this.c.windStrength.set(w.strength);
    this.c.windDir.set((w.direction * 180) / Math.PI);
    this.c.windTurb.set(w.turbulence);
    this.c.windGustFreq.set(w.gustFrequency);
    this.c.windGust.set(w.gustiness);
    this.c.tearEnabled.set(sim.tearingEnabled);
    this.c.tearThreshold.set(sim.tearThreshold);
    this.c.opacity.set(r.opacity);
    // segmented: pin mode
    for (const b of this.c.pinMode.children) {
      b.classList.toggle('active', b.dataset.value === sim.pinMode);
    }
    // toggles that reflect renderer state
    this.c.solid.input.checked = r.showSolid;
    this.c.wire.input.checked = r.showWireframe;
    this.c.particles.input.checked = r.showParticles;
    this.c.constraints.input.checked = r.showConstraints;
    this.c.pinned.input.checked = r.showPinned;
    this.c.normals.input.checked = r.showNormals;
  }
}
