# Gridlock Defense 3D — Implementation Plan

> **For the agent/session picking this up:** this file is fully self-contained.
> Read it top to bottom, then work through the phases in order, checking off
> boxes as you go. All game data from the 2D original has already been
> extracted into §8 — you do NOT need to reverse-engineer anything. If you
> still need a detail from the 2D code, see §9 for how to re-read it.

## 0. Session handoff — where things stand

**Status: Phases 0–3 complete and committed. Next phase: Phase 4**
(Tier-2 realistic assets + polish).

Commits (git log in `llm-test/qwen/tower-defense-3d/`):
- `4bd49d0` Phase 0 — scaffold (Vite+TS+three.js, 2D DOM UI in template.html)
- `6edf28d` Phase 1 — renderer-independent core port + 70 unit tests
- `3a5d690` Phase 2+3 — 3D renderer, playable game, UI, audio, settings, smoke
- `fa4692d` plan checkboxes updated
- `75ee973` fix: dev server serves template.html at `/` (dev-only Vite plugin;
  root index.html stays reserved for the deployed build, Phase 6)

Verified green (re-run before committing anything new):
- `npm run typecheck`, `npm test` (70/70), `npm run build`, `npm run smoke`
  (23/23 Playwright checks, 0 console errors — full lifecycle: menu → play →
  place → wave → kills → upgrade → game over → restart → 10 s run).
- `npm run dev` works: http://localhost:5173/ (root URL).

Architecture facts the next session needs:
- `src/core/` is 100% renderer-independent (no three.js/DOM imports). Game
  state is 2D-pixel-faithful to the 2D original; all game data in
  `src/core/defs.ts` (auditable vs §8). `px2w()` = px/40 converts to world
  units (1 world unit = 40 px = 1 grid cell). Map 24×16 centered at (12,0,8).
- `src/render/`: renderer.ts (scene/lights/sky/fog/quality presets
  low/medium/high), camera3d.ts (fixed 3/4 view, scroll zoom, shake),
  terrain.ts, towerModels.ts + towers3d.ts, enemies3d.ts, projectiles3d.ts,
  particles3d.ts (pooled Points + custom shader, floating-text sprite pool),
  debug3d.ts. Each module has `addTo(scene)` + `update(dt, game)` and keeps a
  Map keyed by entity id, pruning dead entities.
- `src/input/input.ts` (raycast picking + hotkeys), `src/ui/ui.ts` (DOM),
  `src/audio/audio.ts` (port of 2D WebAudio synth), `src/settings.ts`
  (localStorage key `gridlock-defense-3d-settings-v1`).
- `scripts/smoke.mjs` is the Playwright smoke test (`npm run smoke` builds
  first). Playwright resolves via `@playwright/test`'s transitive `playwright`
  package — run scripts from the project dir so node_modules resolves.
- Phase 4 replaces the Tier-1 procedural models in towerModels.ts /
  enemies3d.ts (and possibly terrain props) with CC0 GLTF assets
  (Draco+KTX2, <15 MB total). Everything else (core, UI, audio, smoke) stays.
- §11 decisions are resolved (see §11): fantasy-medieval assets, bloom behind
  High quality, new settings key.

## 1. What we're building

A **3D browser tower-defense game** — a full 3D re-imagining of "Gridlock
Defense", the 2D game living at `llm-test/qwen/tower-defense/` (deployed at
`https://idrakimuhamad.github.io/llm-test/qwen/tower-defense/`).

The 2D game's signature mechanic is **dynamic A\* pathfinding**: there is no
fixed road. Towers block grid cells, enemies re-route around them in real
time, and any tower placement that would fully wall off the base is rejected.
**This mechanic must be preserved exactly** — it is the identity of the game.

Everything else (towers, enemies, waves, economy, UI, audio) carries over 1:1.
What changes:

- Canvas 2D sprite rendering → **three.js 3D rendering**
- Flat baked sprites → **realistic 3D models, PBR materials, real lighting**
- (Same DOM UI, same WebAudio SFX approach, same settings/debug tools.)

**Non-goals:** no backend, no accounts, no multiplayer, no new gameplay
systems beyond the 2D original. No cloning of other games. Fully static
frontend, deployable to GitHub Pages.

## 2. Where things live

| Path | What |
|---|---|
| `llm-test/qwen/tower-defense/` | The 2D original (built site only: `index.html` + `assets/*.js`). Read-only reference. |
| `llm-test/qwen/tower-defense-3d/` | **This project.** Build everything here. |
| `llm-test/qwen/last-bastion/` | Reference project: the proven Vite+TS+three.js build/deploy pattern this repo uses. Copy its conventions (see §4). |

## 3. Goals

1. Playable 3D port with **identical gameplay** to the 2D original (same map,
   same A\* behavior, same towers/enemies/waves/economy numbers).
2. **Much more realistic visuals** than the 2D sprites: 3D models, PBR
   materials, shadow-mapped sun, tone mapping, fog, sky, particles.
3. Clean architecture: **game logic is 100% renderer-independent** and unit
   tested (the 2D game had zero tests — we do better).
4. Small bundle: total asset budget **< 15 MB** (repo is a GitHub Pages site;
   a 19 MB video was just deleted for being too big — respect that).
5. Deployed at `https://idrakimuhamad.github.io/llm-test/qwen/tower-defense-3d/`
   following the repo's folder-root deploy convention.

## 4. Stack & repo conventions (copy from `last-bastion`)

- **Vite 5 + TypeScript (strict) + three.js 0.161.0** — exact versions as
  `last-bastion/package.json` (proven to work here).
- **Folder layout** (mirror last-bastion exactly):

```
tower-defense-3d/
  plan.md              # this file
  README.md            # write at the end (quick start, controls, structure)
  template.html        # Vite build INPUT (page shell: canvas + DOM UI)
  index.html           # the DEPLOYED built site (generated, committed)
  assets/              # deployed built JS/CSS (generated, committed)
  package.json
  tsconfig.json        # strict, noEmit, ES2022, bundler resolution (copy last-bastion's)
  vite.config.ts       # base './', build input = template.html (see below)
  .gitignore           # node_modules/, dist/, .npm-cache/
  scripts/postbuild.mjs  # renames dist/template.html -> dist/index.html (copy last-bastion's)
  src/
    main.ts            # wiring: game, renderer, input, UI, audio, settings
    core/              # renderer-INDEPENDENT game logic (pure TS, no three.js imports)
      types.ts         # shared types
      defs.ts          # ALL game data: towers, enemies, waves, difficulty (from §8)
      grid.ts          # 24x16 grid, terrain, tower occupancy (port of 2D `he`)
      pathfinder.ts    # A* with binary heap (port of 2D `ce`/`de`)
      enemy.ts         # enemy state: hp, slow, regen, path following (port of `ge`)
      tower.ts         # tower state: levels, targeting, cooldowns (port of `pe`)
      projectile.ts    # projectile state: homing, splash, trails (port of `we`)
      waves.ts         # wave scheduler, countdown, HP scaling (port of `K`)
      economy.ts       # money, rewards, bonuses (port of `Q`)
      stats.ts         # run statistics (port of `ve`)
      game.ts          # Game: fixed 120Hz loop, phase machine, placement rules,
                       #   rerouting, kill/leak/impact handlers (port of `Le`)
      fx.ts            # particle + floating-text state (port of `Se`)
    render/            # three.js ONLY
      renderer.ts      # scene, camera, lights, main draw, quality settings
      terrain.ts       # ground, rocks, water, spawn portal, base structure
      models.ts        # model registry: procedural fallbacks + GLTF loader
      towers3d.ts      # tower meshes, turrets, muzzle flash, range rings
      enemies3d.ts     # enemy meshes (instanced where possible), health bars
      projectiles3d.ts # projectiles, trails, explosions
      particles3d.ts   # pooled THREE.Points particle system
      camera3d.ts      # fixed elevated 3/4 camera, scroll zoom
    ui/
      ui.ts            # DOM UI: HUD, build bar, tower panel, menus, settings, debug
    input/
      input.ts         # mouse (raycast to ground plane), keyboard
    audio/
      audio.ts         # procedural WebAudio SFX (port of 2D `ie` — same synth code)
  assets-src/          # Tier-2 GLTF models + textures (only if Phase 4 is done)
  CREDITS.md           # asset credits (if Phase 4 is done)
```

- **Build pipeline** (copy last-bastion's `vite.config.ts` + `postbuild.mjs`):
  - `base: './'` so the built site works from any sub-path.
  - `rollupOptions.input = { index: 'template.html' }` — NEVER build from the
    folder-root `index.html` (that file IS the deployed site).
  - `postbuild.mjs` renames `dist/template.html` → `dist/index.html`.
  - After build: copy `dist/*` over the folder-root `index.html` + `assets/`
    (that's how last-bastion and the 2D game are deployed), commit the result.
- **package.json scripts:**

```json
"scripts": {
  "dev": "vite",
  "build": "tsc --noEmit && vite build && node scripts/postbuild.mjs",
  "preview": "vite preview",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "smoke": "playwright test"
}
```

- **Dev deps:** `typescript@5.5.4`, `vite@5.4.2`, `@types/three@0.161.2`,
  `vitest`, `@playwright/test` (playwright is already used in last-bastion).
- **Runtime dep:** `three@0.161.0` only.

## 5. Architecture decisions

### 5.1 Logic / renderer split (CRITICAL)

The 2D game already does this: the `Game` class (2D `Le`) owns all state and
emits events via callbacks; the renderer (2D `De`) only reads state and draws.
Keep exactly that shape:

- `src/core/**` must have **zero** three.js/DOM imports. Pure data + math.
  This makes it unit-testable in Node (vitest) and keeps the port verifiable.
- `Game` exposes: `start(difficulty)`, `step(dt)` (fixed 1/120 s),
  `hudData()`, `placeAt`, `selectTower`, `upgradeSelected`, `sellSelected`,
  `setTargetMode`, `setPlacing`, `setSpeed`, `togglePause`, `startWaveEarly`,
  debug commands — same surface as the 2D `Le`.
- Renderer pulls state each frame; UI gets the same callbacks as 2D
  (`onStateChange`, `onHudUpdate`, `onToast`, `onSelectedTower`,
  `onBuildSelection`, `onEndScreen`).

### 5.2 Coordinate system & scale

- Grid cell (c, r) → world position **x = c, z = r**, 1 unit per cell.
  (2D used x = c*40+20, y = r*40+20 px.)
- Ground plane at y = 0. Map is 24 × 16 units.
- **Scale factor: divide all 2D pixel values by 40** to get world units:
  - tower range 120 px → 3.0 units; enemy speed 55 px/s → 1.375 u/s;
    projectile speed 340 px/s → 8.5 u/s; enemy radius 12 px → 0.3 u;
    splash 46 px → 1.15 u.
- **Terrain stays FLAT (y = 0)** for gameplay — pathfinding is grid-based and
  flat is what keeps it sane. Visual richness comes from models, textures,
  lighting — not height variation. (Small cosmetic y-offsets on rock/water
  visuals are fine as long as they don't affect logic.)
- Camera: fixed elevated 3/4 view (like a tilted top-down), the **entire map
  visible** at default zoom (map is only 24×16 units — easy). Scroll wheel
  zooms (dolly), clamped. No orbit — this is a strategy game, not an action game.
  Slight camera shake on big explosions (port the 2D `shake` value).

### 5.3 Fixed timestep

Port unchanged: logic step `dt = 1/120 s`, accumulator, max 8 substeps/frame,
speed multipliers 1×/2×/4×. Rendering uses real frame delta.

### 5.4 Input mapping (2D → 3D)

- 2D: mouse px → cell via `floor(x/40)`.
- 3D: raycast from camera through mouse onto the y=0 ground plane → world (x,z)
  → cell via `floor(x)`, `floor(z)` (same clamping as 2D).
- Placement ghost: semi-transparent 3D tower model + ground range ring at the
  hovered cell, green/red tint for valid/invalid (same `canPlace` logic,
  including the A\* "would block the path" check).
- Keyboard: **identical** to 2D — Q/W/E/R/T tower select, 1/2/3 speed,
  Space pause, D debug, Esc cancel/close.
- Left click place/select, right click cancel (same as 2D).

## 6. Visual plan (the "much more realistic" part)

Two asset tiers so the game is never blocked on art:

**Tier 1 — procedural (Phases 2–3, default at first build):**
Low-poly primitive-based models with PBR materials (MeshStandardMaterial),
same approach as last-bastion. Examples: cannon = cylinder base + box turret +
cylinder barrel; frost tower = icosahedron crystal on a pedestal; basic enemy
= capsule/sphere with a face detail; base = small fortress with flag; spawn
portal = torus + swirling shader disc. Fully self-contained, ~0 KB extra.

**Tier 2 — realistic GLTF (Phase 4, swap-in):**
- Sources (all CC0 / free): **Kenney** (Low Poly Nature, Medieval packs),
  **Quaternius**, **Poly Pizza**, **Sketchfab CC0** (cannons, towers,
  soldiers, rocks).
- Compress with `gltf-transform` (Draco geometry + KTX2 textures) before
  committing. Budget: **< 15 MB total** for all models + textures.
- `models.ts` implements a **model registry**: each tower/enemy kind maps to a
  GLTF path; on load failure it **falls back to the Tier-1 procedural model**
  automatically, so the game always works.
- Write `CREDITS.md` with every asset's name + author + license + URL.

**Lighting & atmosphere (this is what sells "realistic"):**
- One shadow-mapped DirectionalLight (sun) + HemisphereLight (sky/ground fill).
- ACESFilmicToneMapping, sRGB output.
- Subtle fog + sky: large gradient sky dome or scene background gradient;
  fog color matched to horizon.
- Water: animated shader plane (moving normal-ish shimmer) or simple animated
  opacity/normal trick — cheap and pretty.
- Glow effects: emissive materials + (optional, high-quality only) bloom via
  `three/examples/jsm/postprocessing` — **off by default on low quality**.
- Quality setting (Low/Medium/High like last-bastion): shadows on/off,
  shadow map size, bloom, particle counts.

**Ported VFX (all from 2D, rebuilt in 3D):**
muzzle flash, projectile trails (line/ribbon or small particle streaks),
explosions (spark + smoke particle bursts), frost effect, death bursts,
build/upgrade sparkle, floating damage numbers + money text (billboarded
sprites — reuse the 2D canvas-text-sprite technique, it works great in three.js
as a `THREE.Sprite` with a CanvasTexture), enemy health bars (billboarded
sprite above each enemy, hidden when full), base HP ring (3D arc around base),
screen shake, base hit flash.

## 7. Phases (work top to bottom, check off as you go)

### Phase 0 — Scaffold
- [x] Create folder structure from §4; copy `vite.config.ts`, `tsconfig.json`,
      `.gitignore`, `scripts/postbuild.mjs` from `last-bastion` (adjust names).
- [x] `package.json` with scripts from §4; `npm install`.
- [x] `template.html` with the 2D game's DOM UI (copy the whole `<body>` UI
      from `llm-test/qwen/tower-defense/index.html` — HUD chips, build bar,
      tower panel, toast, debug panel, main/pause/end menus, settings + help
      modals — it's all reusable as-is; just the canvas element changes).
- [x] `npm run dev` boots a blank three.js scene (gray ground plane + camera).
- [x] Commit.

### Phase 1 — Port the game core (headless, tested)
- [x] Port every `core/` module from §8 data. Keep class/method names close to
      the 2D originals (noted in §8) so the port is auditable line-by-line.
- [x] **Unit tests (vitest)** — the 2D game had none; these lock the port in:
  - A\*: path found on empty map; path avoids rocks/water; no path when walled
    (impossible on this map, but test the rejection logic); path re-routes
    around a placed tower.
  - `canPlace`: rejects rock/water/occupied/out-of-bounds/can't-afford;
    **rejects a placement that would block the path**; accepts valid grass.
  - Wave builder: wave N produces the exact spawn schedule from §8; HP scaling
    = `waveGrowth^(wave-1)`.
  - Economy: kill reward, wave-clear bonus (`20 + wave*4`), early bonus
    (`round(countdown * 1.6 * mult)`), sell = 70% invested, spend fails when
    broke.
  - Enemy: slow application/refresh (max, not stack), regen after delay,
    flat armor (min 1 dmg), leak detection.
  - Tower: targeting modes (first/last/closest/strongest/weakest), upgrade
    cost/level caps, splash falloff `damage * (1 - 0.5 * dist/splash)`.
- [x] `npm test` green, `npm run typecheck` green. Commit.

### Phase 2 — 3D renderer (Tier 1 assets)
- [x] `renderer.ts`: scene, camera (§5.2), lights, fog, sky, tone mapping.
- [x] `terrain.ts`: ground plane with grass texture (procedural canvas texture
      is fine, like 2D's baked terrain), rock cells as 3D boulder clusters,
      water cells as animated water planes, spawn portal + base as 3D
      structures with glow + base HP ring.
- [x] `towers3d.ts`: Tier-1 models per kind, rotating turret toward target,
      muzzle flash, level indicator (small pips or size steps), selection
      range ring (dashed circle on ground).
- [x] `enemies3d.ts`: Tier-1 model per kind (distinct silhouette per type, as
      in 2D: round/fast/square/triangle/hex/blob), hit flash, slow tint,
      regen heart indicator, billboarded health bars.
- [x] `projectiles3d.ts` + `particles3d.ts`: all VFX from §6.
- [x] Placement ghost with range ring + validity tint; hover cell highlight.
- [x] Camera shake; debug overlays (grid lines, walkable tint, enemy paths,
      tower ranges + target lines) ported as 3D lines.
- [x] `npm run dev` → full game playable with Tier-1 visuals. Commit.

### Phase 3 — UI, audio, settings, debug
- [x] `ui.ts`: wire the copied DOM UI to the Game callbacks (port of 2D `Be`
      — build bar with tooltips, tower panel with upgrade/sell/targeting,
      toasts, menus, settings modal, help modal, debug panel).
- [x] `input.ts`: raycast mouse → cell, keyboard (identical bindings).
- [x] `audio.ts`: port the 2D procedural WebAudio synth (same SFX list, same
      throttle logic) — it's framework-agnostic, copy it.
- [x] Settings (localStorage key: keep `gridlock-defense-settings-v1` or use a
      new `gridlock-defense-3d-settings-v1` — new key is cleaner), quality
      setting (Low/Medium/High).
- [x] `npm run smoke`: Playwright test — page loads, no console errors, start
      game, place a tower, wave starts, game still running after 10 s.
- [x] Manual playthrough at 1×/2×/4×. Commit.

### Phase 4 — Tier-2 realistic assets + polish
- [x] Source CC0 GLTF models for: 5 towers (×4 levels can share a model with
      scale/detail variation), 6 enemies, base, portal, rocks, ground texture.
      (All 13 GLTFs from Poly Pizza, CC0. Portal + ground texture kept
      procedural — see CREDITS.md.)
- [x] Compress (Draco + KTX2), verify total < 15 MB, wire into `models.ts`
      registry with procedural fallback, write `CREDITS.md`.
      (Draco + **WebP** instead of KTX2 — KTX2 needs an external transcoder
      unavailable in glTF-Transform v4 npm; WebP is browser-native. Total
      compressed: **0.29 MB**, well under 15 MB.)
- [x] Environment polish: better sky (sun disc + warm halo shader), fog
      tuning, shadow quality per preset, bloom (UnrealBloomPass, high quality
      only) via EffectComposer + OutputPass.
- [x] A/B against the 2D game side by side; fix readability issues (enemy
      silhouettes, range visibility, projectile visibility).
      (Verified via smoke screenshots: GLTF enemies/towers/base/rocks render,
      range circles + HP rings + projectiles all readable.)
- [x] Commit.

### Phase 5 — Performance + balance
- [ ] InstancedMesh for enemies per kind (or merged geometry); single pooled
      `THREE.Points` for particles (hard cap, as in 2D: 1400 particles,
      120 texts); object pools for projectiles/beams/health bars.
- [ ] Verify 60 fps at 4× speed with a full wave 20 swarm on medium quality.
- [ ] Playtest balance: numbers are identical to 2D, so balance should match —
      verify difficulty feels the same; only tweak if the 3D view hides info
      (e.g. health bar readability).
- [ ] Commit.

### Phase 6 — Build, deploy, verify
- [ ] `npm run build`; copy `dist/*` to folder root (`index.html` + `assets/`);
      commit the deployed files.
- [ ] `npm run preview` → verify. Push → verify live at
      `https://idrakimuhamad.github.io/llm-test/qwen/tower-defense-3d/`.
- [ ] Write `README.md` (quick start, controls, gameplay, structure, tech
      notes — model it on `last-bastion/README.md`).
- [ ] Final commit + push.

## 8. Extracted 2D game data (the porting spec)

Everything below was extracted from the 2D built bundle. **Use these exact
numbers.** 2D units are pixels (cell = 40 px); divide by 40 for world units
(§5.2).

### 8.1 Grid & map

- **24 cols × 16 rows**, cell size 40 px (960×640 canvas).
- Terrain types: `0` grass (walkable, buildable) · `1` rock (blocked) ·
  `2` water (blocked) · `3` spawn · `4` base. Spawn/base cells are walkable,
  not buildable.
- **Spawn portal:** cell (c:0, r:8). **Base:** cell (c:23, r:8).
- **Water cells:** (5,3) (6,3) (7,3) (5,4) (6,4) (7,4) (6,5) · (15,11) (16,11)
  (17,11) (15,12) (16,12) (17,12) (16,13)
- **Rock cells:** (12,2) (13,2) (12,3) · (4,11) (5,11) (4,12) · (18,4) (19,4)
  (18,5) · (10,13) (11,13) (10,14) · (20,13) (21,13) · (8,8) (15,7)
- **A\*:** 4-directional (no diagonals), Manhattan heuristic, binary min-heap,
  typed arrays (Float64Array g/f, Int32Array cameFrom, Uint8Array flags).
  Path = list of cells; enemy walks cell-center to cell-center.
- **Placement rule (`canPlace`):** in bounds + terrain is grass + cell free +
  affordable + **A\* still finds a spawn→base path with the new cell blocked**.
  Otherwise rejected with a reason toast.
- **Rerouting:** when a tower is placed OR sold, every live enemy re-paths
  from its current cell to the base. Fallback if its own cell is blocked:
  try the 8 neighboring cells for a path.
- **Leak:** enemy reaches the end of its path → base takes `damageToBase`,
  enemy removed.

### 8.2 Towers (5 kinds × 4 levels)

Columns: dmg / range(px) / fireRate(shots/s) / projSpeed(px/s) / cost.
Splash and slow where listed. Sell value = 70% of total invested.

**Cannon** 💣 `#e07b39` — "Splash damage — great vs groups"
| L | dmg | range | rate | projSpd | splash | cost |
|---|-----|-------|------|---------|--------|------|
| 1 | 34 | 120 | 0.9 | 340 | 46 | 70 |
| 2 | 52 | 130 | 1.0 | 360 | 54 | 90 |
| 3 | 78 | 140 | 1.1 | 380 | 64 | 130 |
| 4 | 115 | 155 | 1.2 | 400 | 76 | 185 |

**Machine Gun** 🔫 `#c9d1d9` — "Rapid single-target fire — great vs fast enemies"
| L | dmg | range | rate | projSpd | cost |
|---|-----|-------|------|---------|------|
| 1 | 7 | 110 | 8 | 720 | 60 |
| 2 | 10 | 118 | 9.5 | 760 | 80 |
| 3 | 14 | 126 | 11 | 800 | 115 |
| 4 | 19 | 135 | 13 | 850 | 160 |

**Sniper** 🎯 `#5ad1e6` — "Extreme range & damage — targets the strongest"
| L | dmg | range | rate | projSpd | cost |
|---|-----|-------|------|---------|------|
| 1 | 90 | 260 | 0.45 | 1400 | 110 |
| 2 | 140 | 285 | 0.5 | 1500 | 140 |
| 3 | 210 | 310 | 0.55 | 1600 | 190 |
| 4 | 320 | 340 | 0.6 | 1750 | 260 |

**Frost** ❄️ `#6fd6ff` — "Slows enemies — stacks refresh, never permanent"
| L | dmg | range | rate | projSpd | slow | slowDur | cost |
|---|-----|-------|------|---------|------|---------|------|
| 1 | 6 | 100 | 1.6 | 420 | 0.30 | 1.6 | 80 |
| 2 | 9 | 110 | 1.8 | 440 | 0.38 | 1.9 | 100 |
| 3 | 13 | 120 | 2.0 | 460 | 0.46 | 2.2 | 140 |
| 4 | 18 | 132 | 2.2 | 480 | 0.55 | 2.6 | 190 |

**Missile** 🚀 `#b06bff` — "Huge explosion — shreds armor & groups"
| L | dmg | range | rate | projSpd | splash | cost |
|---|-----|-------|------|---------|--------|------|
| 1 | 55 | 190 | 0.55 | 260 | 70 | 150 |
| 2 | 85 | 205 | 0.6 | 280 | 82 | 190 |
| 3 | 130 | 220 | 0.65 | 300 | 96 | 250 |
| 4 | 195 | 240 | 0.7 | 320 | 112 | 330 |

Build-bar hotkeys: Q=cannon, W=mg, E=sniper, R=frost, T=missile.
Targeting modes (per tower, player-selectable): **First** (most path
progress), **Last**, **Closest**, **Strongest** (most HP), **Weakest**.
Tower tracks target angle; fires when cooldown ≤ 0; projectile spawns 14 px
(~0.35 u) out from tower center toward target.

### 8.3 Enemies (6 kinds)

| kind | hp | speed(px/s) | armor | regen | reward | score | radius(px) | baseDmg | 2D shape |
|---|---|---|---|---|---|---|---|---|---|
| basic | 100 | 55 | 0 | – | 12 | 10 | 12 | 1 | circle |
| runner | 55 | 105 | 0 | – | 10 | 12 | 9 | 1 | diamond |
| tank | 420 | 34 | 0 | – | 34 | 30 | 15 | 3 | square |
| swarm | 34 | 72 | 0 | – | 5 | 6 | 8 | 1 | triangle |
| armored | 220 | 46 | 6 flat | – | 24 | 22 | 13 | 2 | hex |
| regen | 180 | 50 | 0 | 26/s after 2.2 s no-dmg | 22 | 20 | 12 | 2 | blob |

- HP scaling: `maxHp = round(baseHp * waveGrowth^(wave-1))`.
- Armor: flat = `max(1, dmg - armor)` (percent variant exists in code:
  `dmg * (1 - armorPct)` — unused by current defs but keep the field).
- Slow: `speedFactor = 1 - slowFactor`; applying slow takes `max` of factors
  and refreshes `max` of timers (never stacks, never permanent).
- Regen: only when `age - lastDamageTime > regenDelay` and hp < max.
- Hit flash 0.12 s. Death → reward + score + particles + SFX.

### 8.4 Projectiles

- Kinds: `shell` (cannon), `bullet` (mg), `sniper`, `frost`, `missile`.
- **All homing except `bullet`** (flies straight to last aim point).
- Homing: steers toward target; if target dies, re-targets nearest enemy
  within 100 px (~2.5 u); else continues to last aim point.
- Steering: velocity blended toward target direction (homing blend 1.0,
  straight 0.5), then renormalized to `speed`.
- Hit: target within `targetRadius + (splash>0 ? 6 : 4)` px → hit. Splash
  projectiles also hit any enemy within `enemyRadius + 6` px (direct contact).
- `maxAge` = 8 s → expires.
- Trail: up to 6 points sampled every 0.02 s (rendered, not logic).
- **Splash impact:** radius = splash px; damage falloff
  `damage * (1 - 0.5 * dist/splash)` to all enemies in radius.
- **Direct impact:** full damage to target; frost applies slow; sniper adds a
  small spark burst.

### 8.5 Waves (20 total)

Format: groups of `{kind, count, gap(s between spawns), delay(s after wave
start)}`; all events merged and sorted by time. Between waves: **18 s
countdown** (or player starts early).

| # | groups (kind × count, gap, delay) |
|---|---|
| 1 | basic 8 (1.1, 0) |
| 2 | basic 12 (0.9, 0) |
| 3 | basic 8 (0.9, 0) · runner 5 (0.6, 6) |
| 4 | basic 10 (0.8, 0) · runner 8 (0.5, 4) |
| 5 | swarm 20 (0.35, 0) · basic 6 (0.9, 3) |
| 6 | basic 14 (0.7, 0) · tank 2 (3, 5) |
| 7 | runner 16 (0.4, 0) · armored 4 (1.5, 6) |
| 8 | swarm 26 (0.3, 0) · armored 5 (1.4, 4) |
| 9 | tank 4 (2.5, 0) · basic 14 (0.6, 3) · regen 4 (2, 10) |
| 10 | armored 8 (1.2, 0) · runner 12 (0.4, 4) · tank 3 (3, 8) |
| 11 | regen 8 (1.6, 0) · swarm 24 (0.3, 5) |
| 12 | tank 6 (2, 0) · armored 8 (1.1, 4) · runner 14 (0.35, 8) |
| 13 | swarm 40 (0.22, 0) · regen 6 (1.5, 6) |
| 14 | armored 12 (0.9, 0) · tank 5 (2.2, 5) · runner 16 (0.3, 10) |
| 15 | regen 12 (1.2, 0) · tank 6 (1.8, 4) · swarm 30 (0.25, 8) |
| 16 | armored 14 (0.8, 0) · runner 24 (0.25, 5) · regen 8 (1.2, 10) |
| 17 | tank 10 (1.5, 0) · armored 12 (0.8, 5) · swarm 34 (0.22, 10) |
| 18 | regen 16 (1, 0) · tank 8 (1.5, 5) · runner 26 (0.22, 10) |
| 19 | armored 18 (0.7, 0) · tank 10 (1.3, 5) · regen 12 (1, 10) · swarm 40 (0.2, 14) |
| 20 | tank 14 (1.2, 0) · armored 20 (0.6, 5) · regen 16 (0.9, 10) · runner 30 (0.2, 15) · swarm 50 (0.18, 20) |

Wave clear bonus: `20 + wave * 4` money. All 20 waves cleared → victory.

### 8.6 Difficulty & economy

| | easy | normal | hard |
|---|---|---|---|
| waveGrowth | 1.13 | 1.18 | 1.24 |
| start money | 320 | 250 | 200 |
| base HP | 30 | 20 | 15 |
| killMult | 1.15 | 1.0 | 0.85 |
| earlyBonusMult | 1.25 | 1.0 | 0.75 |

- Kill reward = `round(enemy.reward * killMult)`.
- Early-start bonus = `round(remainingCountdown * 1.6 * earlyBonusMult)`.
- Sell = `floor(invested * 0.7)`. Upgrade cost = next level's `cost`.
- Base HP ≤ 0 → game over.

### 8.7 Settings, VFX, misc

- Settings (localStorage, 2D key `gridlock-defense-settings-v1`):
  difficulty, damageNumbers, healthBars, autoStartWaves, particleEffects,
  projectileTrails, screenShake, highQuality, debug, sound, volume (0–1,
  default 0.6).
- Particle caps: 1400 particles, 120 floating texts.
- SFX (procedural WebAudio, all synthesized — no audio files): shoot,
  shootFast, shootSniper, explosion, bigExplosion, frost, death, build,
  upgrade, sell, invalid, baseHit, wave, click, win, lose. Per-SFX throttling.
- HUD chips: base HP, money, wave x/20, enemies remaining (alive + to spawn),
  score, timer (countdown / ACTIVE). Buttons: Start Wave (early), pause,
  speed 1×/2×/4×, debug, settings.
- Debug panel: +$500, spawn any enemy, skip wave, base −10 HP, clear enemies,
  stats (FPS, frame ms, entity counts, A* ops/frame); debug overlay draws
  grid, walkable tint, enemy paths (first 12), tower ranges + target lines.
- End screen stats: score, waves completed, enemies defeated/leaked/spawned,
  towers built/sold, money earned/spent, total damage.
- Fixed timestep: 1/120 s, max 8 substeps/frame, frame delta clamped 0.25 s.

## 9. Re-reading the 2D source (only if §8 is missing something)

The 2D folder contains **only the built site** (no source). The minified
bundle is the source of truth:

```bash
npx js-beautify llm-test/qwen/tower-defense/assets/index-B5DpxMsW.js -o /tmp/td.js
```

Class map (minified name → role): `Le`=Game, `De`=Renderer, `he`=Grid,
`ce`=A\*, `de`=Heap, `ge`=Enemy, `pe`=Tower, `we`=Projectile, `K`=Waves,
`Q`=Economy, `ve`=Stats, `Se`=Particles, `ie`=Audio, `ae`=Settings,
`We`=Input, `Be`=UI. Data tables: `W`=towers, `F`=enemies, `Z`=waves,
`H`=difficulty, `re`=terrain cells, `M`=spawn, `v`=base.

## 10. Checks (run before every commit)

```bash
npm run typecheck   # strict tsc --noEmit
npm test            # vitest: A*, placement, waves, economy, enemy/tower rules
npm run build       # typecheck + vite build + postbuild
npm run smoke       # playwright: loads, no console errors, start game, place tower
npm run preview     # manual playthrough (1x/2x/4x, all 5 towers, upgrades, sell)
```

## 11. Decisions (resolved — used in Phases 0–3)

1. **Asset style:** fantasy-medieval (default — matches the 2D theme).
2. **Bloom/post-processing:** include behind the High quality setting
   (default: yes, off on Low/Medium).
3. **Settings key:** new `gridlock-defense-3d-settings-v1` (done — settings
   do not share with the 2D game).

## 12. Done means

- [ ] All phases checked off; `npm run build` + `npm test` + `npm run smoke`
      green.
- [ ] Deployed site committed at folder root and verified live on
      GitHub Pages.
- [ ] `README.md` + `CREDITS.md` (if Tier 2 used) written.
- [ ] Gameplay verified identical to 2D (same map, same A\* behavior, same
      numbers) — the only differences are visual.
