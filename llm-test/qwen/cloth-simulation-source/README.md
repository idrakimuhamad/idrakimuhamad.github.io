# Cloth Physics Sandbox

An interactive, real-time cloth physics simulation that runs entirely in the
browser. A small physics sandbox — not a canned animation.

- **Physics:** Verlet integration + Position Based Dynamics (Gauss–Seidel
  distance-constraint projection), implemented from scratch. No physics
  libraries.
- **Rendering:** a lightweight custom **WebGL** renderer (hand-written GLSL
  shaders, dynamic VBOs, per-vertex normals, directional + ambient lighting).
- **Zero runtime dependencies.** The only dev dependency is Vite (build/dev
  server).

## Run

```bash
npm install
npm run dev
```

Open the printed URL (default `http://localhost:5173`).

### Production build

```bash
npm run build     # outputs to dist/
npm run preview   # serve the built site locally
```

The build uses relative asset paths (`base: './'`), so `dist/` can be deployed
to any static host or sub-path (e.g. GitHub Pages) as-is.

## What's inside

| File | Responsibility |
| --- | --- |
| `src/main.js` | App wiring + main loop (fixed-timestep physics, variable-rate render) |
| `src/physics/Cloth.js` | Particle grid (SoA typed arrays) + structural/shear/bending constraints |
| `src/physics/Simulator.js` | Verlet integration, PBD solver, wind forces, tearing, drag, normals, fixed timestep |
| `src/physics/Wind.js` | Dynamic wind: direction, strength, turbulence, gusts; orientation-aware force |
| `src/render/WebGLRenderer.js` | WebGL renderer: shaders, orbit/zoom camera, surface/lines/points/normals |
| `src/interaction/Interaction.js` | Pointer input: drag cloth, orbit, zoom, pinch, pin/unpin |
| `src/ui/Controls.js` | Control panel (sliders/toggles/presets) wired to the live sim |
| `src/ui/PerfMonitor.js` | FPS / physics-time / particle & constraint counts overlay |
| `src/presets.js` | Silk, Cotton, Heavy Fabric, Flag, Hammock, Chaos |
| `src/math/mat4.js` | Minimal mat4/vec3 helpers |

## Physics model

- **Particles** keep `pos`, `prev`, `invMass`, `pinned` (Structure-of-Arrays
  `Float32Array`/`Uint8Array` for cache-friendly, allocation-free loops).
- **Integration** is position-based Verlet:
  `v = (pos − prev) · damping;  pos += v + (F/m)·dt²`.
- **Constraints** are distance constraints solved by Gauss–Seidel projection,
  weighted by inverse mass so pinned particles (invMass 0) never move. Three
  families: structural (threads), shear (diagonals), bending (skip-one).
- **Wind** force is `ŵ · (ŵ·n)` per particle using the local surface normal,
  so only faces oriented toward the wind get pushed — this is what makes the
  cloth ripple and flap.
- **Fixed timestep** (1/60 s) with an accumulator decouples physics from render
  FPS; a max-substep clamp prevents the spiral-of-death on slow frames.
- **Tearing** breaks structural/shear constraints stretched past a threshold.

## Controls

- **Drag** the cloth to pull it (the surrounding cloth follows via a
  distance-weighted grab, not a single-vertex teleport).
- **Right-drag** / drag empty space to orbit; **scroll** or **pinch** to zoom.
- Switch pointer mode to **Pin / unpin** and tap particles to pin/unpin them.
- Use the **Constraints** section for pin layouts (top-left, top-right, top
  edge, corners, left edge, none) and toggling tearing.
- **Presets** swap in very different material + wind + pin configurations.
- **Pause / Reset / View** in the Actions section.

On small screens the panel collapses into a drawer (hamburger button, top-right).

## Performance notes

- Typed arrays + no per-frame allocations in the hot loop.
- Buffers are allocated once per cloth rebuild and re-uploaded with
  `DYNAMIC_DRAW` each frame.
- If physics gets too expensive at high resolution, the fixed-timestep clamp
  prioritizes stability over visual smoothness.
