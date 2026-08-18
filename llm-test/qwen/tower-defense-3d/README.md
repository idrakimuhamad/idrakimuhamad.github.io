# Gridlock Defense 3D

A 3D browser re-imagining of **Gridlock Defense**, a 2D tower-defense game
([2D original](https://idrakimuhamad.github.io/llm-test/qwen/tower-defense/)).
Same map, same towers, same waves, same numbers — rendered in three.js with
real 3D models, PBR lighting, shadows, and particles.

The signature mechanic is preserved exactly: **dynamic A\* pathfinding**.
There is no fixed road — towers block grid cells, enemies re-route around
them in real time, and any placement that would wall off the base is
rejected.

No backend, no accounts, no server — a fully static frontend.

## Quick start

```bash
npm install
npm run dev        # Vite dev server on http://localhost:5173
```

Production:

```bash
npm run build      # typecheck (tsc) + vite build -> dist/
npm run preview    # serve dist/ on http://localhost:4173
```

Deploy: copy the contents of `dist/` to any static host. The build uses
relative asset paths (`base: './'`), so it works from any subdirectory.
This folder itself is a GitHub Pages deploy — `index.html` + `assets/` +
`libs/` at the folder root are the committed built site.

## Controls

| Input | Action |
| --- | --- |
| Q / W / E / R / T | Select tower: Cannon / Machine Gun / Sniper / Frost / Missile |
| Left click / tap | Place selected tower / select a tower |
| Right click | Cancel placement / deselect |
| 1 / 2 / 3 | Game speed 1× / 2× / 4× |
| Space | Start the next wave early (bonus) |
| D | Debug panel (spawn enemies, +money, skip wave, stats, overlays) |
| Mouse wheel / pinch | Zoom — anchored at the cursor (the point under it stays put) |
| Esc | Close modal → cancel placing → deselect → pause menu (Settings) |

Click a placed tower to open its panel: upgrade (up to level 4), sell (70%
refund), and targeting mode (First / Last / Closest / Strongest / Weakest).

## Gameplay

- **Towers** — 5 kinds × 4 levels: Cannon (splash), Machine Gun (rapid
  single-target), Sniper (extreme range/damage), Frost (slows), Missile
  (huge splash). Sell value is 70% of total invested.
- **Enemies** — 6 kinds: basic, runner (fast), tank (slow, high HP),
  swarm (weak, huge numbers), armored (flat damage reduction), regen
  (heals after 2.2 s without damage).
- **Waves** — 20 hand-authored waves with an 18 s countdown between them
  (starting early grants a bonus). Enemy HP scales `waveGrowth^(wave-1)`.
  Clear all 20 to win; lose when base HP hits 0.
- **Difficulty** — Easy / Normal / Hard changes wave growth, start money,
  base HP, kill rewards, and early-start bonus.
- **Economy** — money from kills and wave-clear bonuses (`20 + wave·4`);
  spent on towers and upgrades.

## Project structure

```
tower-defense-3d/
  index.html            # deployed built site (generated, committed)
  assets/               # deployed built JS/CSS/GLB (generated, committed)
  libs/draco/           # deployed Draco decoder (generated, committed)
  template.html         # Vite build INPUT (page shell: canvas + DOM UI)
  plan.md               # implementation plan + session handoff notes
  CREDITS.md            # asset credits (CC0 models, Poly Pizza)
  src/
    main.ts             # wiring: game, renderer, input, UI, audio, settings
    core/               # 100% renderer-independent game logic (pure TS)
      types.ts          # shared types
      defs.ts           # ALL game data: towers, enemies, waves, difficulty
      grid.ts           # 24x16 grid, terrain, tower occupancy
      pathfinder.ts     # A* with binary heap (4-directional, Manhattan)
      enemy.ts          # hp, slow, regen, path following
      tower.ts          # levels, targeting modes, cooldowns
      projectile.ts     # homing, splash, trails
      waves.ts          # wave scheduler, countdown, HP scaling
      economy.ts        # money, rewards, bonuses
      stats.ts          # run statistics
      game.ts           # fixed 120 Hz loop, phase machine, placement rules
      fx.ts             # particle + floating-text state
      __tests__/        # vitest unit tests (70)
    render/             # three.js only
      renderer.ts       # scene, lights, sky, fog, quality presets, draw
      models.ts         # GLTF registry (Draco+WebP) with procedural fallback
      terrain.ts        # ground, rocks, water, spawn portal, base
      towers3d.ts       # tower meshes, turrets, muzzle flash, range rings
      enemies3d.ts      # per-kind InstancedMesh, tinting, health bars
      projectiles3d.ts  # pooled projectiles + trails
      particles3d.ts    # pooled THREE.Points (1400) + text sprites (120)
      camera3d.ts       # fixed 3/4 view, cursor-anchored zoom, auto-fit, shake
      debug3d.ts        # grid/path/range overlay lines
    ui/ui.ts            # DOM UI: HUD, build bar, tower panel, menus, settings
    input/input.ts      # raycast picking, touch/pinch, keyboard hotkeys
    audio/audio.ts      # procedural WebAudio SFX (port of the 2D synth)
    settings.ts         # localStorage settings + quality preset
  assets-src/models/    # compressed GLB sources (Draco + WebP, 0.29 MB)
  scripts/
    smoke.mjs           # Playwright smoke test (npm run smoke)
    perf.mjs            # GPU fps benchmark (wave-20 swarm @ 4x)
    balance-ab.mjs      # deterministic 2D-vs-3D balance A/B test
    compress-assets.mjs # re-compress GLB assets
```

## Technical notes

- **Rendering** — three.js (WebGL2) with a fixed elevated 3/4 camera. The
  whole 24×16 map is auto-fitted to the window aspect (so portrait phones
  see the full map), and wheel/pinch zoom is anchored at the cursor — the
  ground point under it stays put while the view pans. ACES tone mapping,
  shadow-mapped sun, custom sky dome, fog (synced to the camera fit distance),
  and optional bloom (High quality only).
- **Logic/renderer split** — `src/core/` has zero three.js/DOM imports and
  runs on a fixed 120 Hz timestep (accumulator, max 8 substeps/frame,
  1×/2×/4× speed). The renderer only reads state each frame, so the game
  logic is unit-testable in Node and verifiable against the 2D original.
- **Assets** — 13 CC0 GLTF models (Poly Pizza), compressed with Draco
  geometry + WebP textures (0.29 MB total, well under the 15 MB budget).
  Every entity has a procedural primitive fallback, so the game works even
  if a model fails to load.
- **Determinism** — combat logic uses no randomness (only FX do), so the
  2D original and this port can be stepped in lockstep and compared exactly
  (`scripts/balance-ab.mjs` does this; all gameplay stats match bit-for-bit).

## Performance

- Enemies render as **per-kind InstancedMesh**es (one draw call per GLTF
  primitive per kind — ~18 draw calls for the whole enemy field), with
  per-instance color for slow/hit-flash/regen tinting.
- Particles are a single pooled **THREE.Points** cloud (hard cap 1400) plus
  a 120-sprite floating-text pool; projectiles and health bars are fixed
  object pools — no geometry/material allocation or disposal during play.
- Shaders are pre-compiled once all models have loaded, so there are no
  first-encounter frame hitches.
- Quality setting (Low / Medium / High) toggles shadows, shadow-map size,
  and bloom.
- Verified: 60 fps at 4× speed with a full wave-20 swarm (130 concurrent
  enemies) on medium quality (`scripts/perf.mjs`).

## Tests

```bash
npm run typecheck   # strict tsc --noEmit
npm test            # vitest: A*, placement, waves, economy, enemy/tower rules (70)
npm run smoke       # playwright: full lifecycle, no console errors
node scripts/perf.mjs       # GPU fps benchmark
node scripts/balance-ab.mjs # 2D vs 3D deterministic balance A/B
```
