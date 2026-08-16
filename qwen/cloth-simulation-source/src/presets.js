// Presets — named configurations that demonstrate distinct physical behavior.
// Each preset is a plain object of parameter values. Applying one writes the
// values into the Simulator + Wind and re-applies the pin layout.

export const PRESETS = {
  silk: {
    name: 'Silk',
    desc: 'Light, flexible, wind-driven',
    params: {
      gravity: 9.8,
      damping: 0.99,
      iterations: 6,
      simSpeed: 1.0,
      cols: 34,
      rows: 26,
      width: 10,
      height: 8,
      mass: 0.15,
      structuralStiffness: 0.9,
      shearStiffness: 0.6,
      bendingStiffness: 0.15,
      tearingEnabled: false,
      tearThreshold: 1.6,
      pinMode: 'top-edge',
      wind: { enabled: true, strength: 16, direction: 0.0, turbulence: 0.4, gustFrequency: 0.8, gustiness: 0.7 },
    },
  },
  cotton: {
    name: 'Cotton',
    desc: 'Moderately stiff & damped',
    params: {
      gravity: 9.8,
      damping: 0.96,
      iterations: 8,
      simSpeed: 1.0,
      cols: 30,
      rows: 22,
      width: 10,
      height: 7,
      mass: 0.5,
      structuralStiffness: 1.0,
      shearStiffness: 0.9,
      bendingStiffness: 0.5,
      tearingEnabled: false,
      tearThreshold: 1.6,
      pinMode: 'top-edge',
      wind: { enabled: true, strength: 8, direction: 0.2, turbulence: 0.25, gustFrequency: 0.5, gustiness: 0.4 },
    },
  },
  heavy: {
    name: 'Heavy Fabric',
    desc: 'Dense, slow, little wind response',
    params: {
      gravity: 9.8,
      damping: 0.94,
      iterations: 10,
      simSpeed: 1.0,
      cols: 26,
      rows: 20,
      width: 9,
      height: 7,
      mass: 2.2,
      structuralStiffness: 1.0,
      shearStiffness: 1.0,
      bendingStiffness: 0.8,
      tearingEnabled: false,
      tearThreshold: 2.0,
      pinMode: 'top-edge',
      wind: { enabled: true, strength: 5, direction: 0.0, turbulence: 0.15, gustFrequency: 0.4, gustiness: 0.3 },
    },
  },
  flag: {
    name: 'Flag',
    desc: 'Pinned on one side, strong wind',
    params: {
      gravity: 9.8,
      damping: 0.985,
      iterations: 7,
      simSpeed: 1.0,
      cols: 34,
      rows: 22,
      width: 11,
      height: 6.5,
      mass: 0.35,
      structuralStiffness: 0.95,
      shearStiffness: 0.7,
      bendingStiffness: 0.25,
      tearingEnabled: false,
      tearThreshold: 1.6,
      pinMode: 'left-edge',
      wind: { enabled: true, strength: 22, direction: 0.0, turbulence: 0.3, gustFrequency: 0.7, gustiness: 0.6 },
    },
  },
  hammock: {
    name: 'Hammock',
    desc: 'Corner-pinned, deep gravity sag',
    params: {
      gravity: 12,
      damping: 0.97,
      iterations: 9,
      simSpeed: 1.0,
      cols: 28,
      rows: 28,
      width: 9,
      height: 9,
      mass: 0.6,
      structuralStiffness: 1.0,
      shearStiffness: 0.95,
      bendingStiffness: 0.35,
      tearingEnabled: false,
      tearThreshold: 1.8,
      pinMode: 'corners',
      wind: { enabled: true, strength: 4, direction: 0.5, turbulence: 0.2, gustFrequency: 0.4, gustiness: 0.3 },
    },
  },
  chaos: {
    name: 'Chaos',
    desc: 'Loose cloth, violent turbulent wind',
    params: {
      gravity: 9.8,
      damping: 0.992,
      iterations: 5,
      simSpeed: 1.0,
      cols: 30,
      rows: 24,
      width: 10,
      height: 8,
      mass: 0.2,
      structuralStiffness: 0.7,
      shearStiffness: 0.4,
      bendingStiffness: 0.1,
      tearingEnabled: true,
      tearThreshold: 1.5,
      pinMode: 'corners',
      wind: { enabled: true, strength: 30, direction: 0.0, turbulence: 0.9, gustFrequency: 1.2, gustiness: 0.9 },
    },
  },
};

/**
 * Apply a preset to the simulator.
 * @param {object} sim
 * @param {string} key preset key in PRESETS
 * @returns the preset object
 */
export function applyPreset(sim, key) {
  const p = PRESETS[key];
  if (!p) return null;
  const P = p.params;

  // physics
  sim.gravity = P.gravity;
  sim.damping = P.damping;
  sim.iterations = P.iterations;
  sim.simSpeed = P.simSpeed;
  sim.structuralStiffness = P.structuralStiffness;
  sim.shearStiffness = P.shearStiffness;
  sim.bendingStiffness = P.bendingStiffness;
  sim.tearingEnabled = P.tearingEnabled;
  sim.tearThreshold = P.tearThreshold;
  sim.pinMode = P.pinMode;

  // wind
  const w = sim.wind;
  w.enabled = P.wind.enabled;
  w.strength = P.wind.strength;
  w.direction = P.wind.direction;
  w.turbulence = P.wind.turbulence;
  w.gustFrequency = P.wind.gustFrequency;
  w.gustiness = P.wind.gustiness;

  // geometry — only rebuild if it actually changed
  if (
    sim.cols !== P.cols || sim.rows !== P.rows ||
    sim.width !== P.width || sim.height !== P.height || sim.mass !== P.mass
  ) {
    sim.cols = P.cols;
    sim.rows = P.rows;
    sim.width = P.width;
    sim.height = P.height;
    sim.mass = P.mass;
    sim.rebuild();
  } else {
    sim.cloth.applyPinMode(P.pinMode);
  }

  return p;
}
