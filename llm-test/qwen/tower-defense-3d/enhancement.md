# Enhancement TODOs

> Feedback from playtesting (see bullets at the bottom for the original notes).
> Work order: **core first, then nice-to-have.** Check items off as they land;
> keep a short log entry per change so progression is easy to monitor.

Legend: `[ ]` pending · `[~]` in progress · `[x]` done

## Core

- [x] **1. Cursor-anchored zoom.** Scroll zoom currently zooms toward the map
      center only. Make it zoom toward the cursor position (and pan the view
      target accordingly, clamped to the map). Also add two-finger pinch zoom
      (anchored at the pinch midpoint) for touch.
- [x] **2. Keybinds: Esc = pause/settings, Space = start wave.**
      - Esc: close an open modal → cancel placing → deselect tower → otherwise
        open/close the pause menu (which contains Settings).
      - Space: start the next wave early (with bonus), instead of pausing.
      - Update help text + button tooltips + smoke test accordingly.
- [x] **3. Debug panel: draggable + small-screen friendly.** Drag it by the
      title bar; add a collapse toggle; on small screens start collapsed and
      repositioned so it doesn't cover the map.
- [x] **4. Mobile / touch support.** Responsive layout (canvas fills the
      available space in portrait, camera auto-fits the map to any aspect,
      compact HUD/build bar), tap to place/select, pinch to zoom,
      `touch-action: none`, no accidental page zoom/scroll.

## Theme decision (final, 2026-08-18)

- **Theme: FANTASY FOREST.** Environment per #7 (trees, ground, rocks); characters
  per #9 (animated humanoids for enemies). #6 (futuristic) is dropped.
- **Grid: SQUARE stays.** #8 (hexagonal grid) is a **no-go** — dropped, not starting.
- Note: the KayKit packs (Forest, Adventurers) are paid itch.io assets; the
  licensed GLBs are not available in this environment. The work below ships the
  full themed environment + animated-character pipeline with CC0 stand-ins in
  the same low-poly style, and documents the exact drop-in steps for the real
  KayKit GLBs (see CREDITS.md).

## Nice to have

- [x] **5. Enemy limb animation.** Six of seven enemy kinds (basic Goblin,
      regen Slime, runner Horse, tank Skeleton, armored Knight, elite
      Sentinel robot) now play real skeletal walk/gallop animation via
      per-enemy `SkinnedMesh` + `AnimationMixer` instead of sliding. Only the
      swarm (Bat) keeps the instanced path with a procedural bob — it's a
      50-count swarm and a skinned version would be ~250 draw calls. The
      KayKit Character Animations drop-in (see CREDITS.md) remains available
      for higher-fidelity clips.
- [ ] **6. Futuristic asset theme.** Replace the medieval Poly Pizza
      towers/enemies with futuristic models that match each weapon type
      (cannon / MG / sniper / frost / missile). CC0 sources TBD (Poly Pizza
      sci-fi, Kenney, Quaternius).
- [x] **7. Fantasy forest world assets** (KayKit Forest direction,
      kaylousberg.itch.io/kaykit-forest) for the environment (trees, ground,
      rocks). Theme conflict with #6 resolved in favor of fantasy forest.
- [ ] **8. Hexagonal grid** (kaykit-medieval-hexagon style). **NO-GO (dropped,
      2026-08-18):** user decision — stay on the square grid. Not starting.
- [x] **9. Adventurer characters** (KayKit Adventurers direction,
      kaylousberg.itch.io/kaykit-adventurers) — animated humanoids for
      enemies (towers keep their weapon turrets). Theme decided: fantasy.
      Shipped with the CC0 Goblin (basic) + Slime (regen) animated stand-ins;
      the paid KayKit Adventurers GLBs drop in via the steps in CREDITS.md.

## Log

- **New enemy kind: elite “Sentinel” robot boss (2026-08-19).**
  A 7th enemy kind for the late game — a mysterious mechanical Sentinel that
  rolls through the deep forest. The toughest enemy in the game:
  - **Stats** (`defs.ts`): baseHp **720** (vs tank 420), speed **30** (0.75
    u/s — slower than every other kind; deliberate, not fast), armor **8
    flat** (more than the Knight's 6), reward **60**, score 80, radius 16,
    damageToBase **4** (heaviest base damage). Color `#53d6e0`, hex shape.
  - **Waves** (`defs.ts`): rare and late — wave **15** (2, gap 8, delay 14),
    17 (3, gap 7), 19 (3, gap 7), 20 (4, gap 6, delay 18). Always spaced far
    apart so towers can focus fire; the final wave fields the largest group.
  - **Asset** (`assets-src/raw/enemy_elite.glb` → `assets-src/models/`):
    [styloo's robot character](https://styloo.itch.io/robot-character) (CC0,
    itch.io) — a self-contained GLTF with base64-embedded textures, 11 clips,
    a 14-bone rig and 8014 tris. New `scripts/gltf-to-glb.mjs` (gltf-transform
    NodeIO + `KHRMaterialsEmissiveStrength`) re-encodes it to GLB keeping only
    the `walking` clip, renamed **`Robot_Walk`** so it can't
    substring-collide with the pack's `walkstart`/`walkingstop`. The walk has
    zero root motion (body tilt, head bob, wheel spin) and loops perfectly.
  - **Facing** (`models.ts`): the robot faces **-Z** at rest (face/eyes/front
    wheel on the -Z side, measured by rendering the GLB from four camera
    directions), so it gets `facing: -π/2` — the opposite sign of the +Z-
    facing Quaternius models. Scale 0.85 (boss-sized; max dim is the
    outstretched-arm span, not height).
  - **Pipeline** (`scripts/compress-assets.mjs`): `KEEP_ANIM` keeps the skin +
    `Robot_Walk`; `SIMPLIFY` decimates 8014 → 2327 tris (ratio 0.3, error
    0.05 — it's the heaviest animated model and at most 4 are ever live).
    817 KB → 118 KB. Total payload 1.34 → 1.45 MB.
  - **`enemies3d.ts`**: `ENEMY_MODEL_KEY`, `KINDS`, `ANIMATED_CLIP`
    (`elite: 'Robot_Walk'`), a box procedural fallback, and metalness 0.55
    (it's plated, like the Knight).
  - **Tests** (`waves.test.ts`): wave-20 total 130 → 134; new test asserts
    elites appear only in waves 15+, 2–4 per wave, gap ≥ 5, first appearance
    wave 15. 70 → 71 tests.
  - **Verified**: typecheck + 71 tests + build + full smoke (25/25, `kills
    happened`, 0 console errors) + new `scripts/verify-elite.mjs` (Playwright,
    12/12): stats in the live game, skinned path in use, 14-bone robot rig,
    bones animate between frames (wheel quaternion Δ≈1.74, head bob), enemy
    walks, no model load failures. Screenshot: `verify-elite-robot.png`.

- **#5 (round 2) — runner/tank/armored enemies animated (2026-08-19).**
  The three previously-static enemies now play real limb animation, using free
  CC0 animated models from Quaternius's itch.io packs (the Poly Pizza wolf and
  ogre had no usable clips; the paid KayKit packs remain the drop-in upgrade):
  - **runner → Horse** ([Low Poly Animated Animals](https://quaternius.itch.io/lowpoly-animated-animals),
    `Run` gallop, 0.833 s — the pack has no wolf; the horse is the only
    wolf-like quadruped with a run clip), **tank → Skeleton** ([Low Poly
    Animated Monsters](https://quaternius.itch.io/lowpoly-animated-monsters),
    `Skeleton_Running`, 1.0 s — the only monster with a ground locomotion
    clip; the Dragon only flies), **armored → Knight** ([Low Poly Animated
    Knight](https://quaternius.itch.io/lowpoly-animated-knight), `Walking`,
    1.25 s). All three clips have zero root motion (pure joint articulation),
    which is exactly what the in-place skinned path needs.
  - **Conversion** (`scripts/fbx-to-glb.mjs`, new): the packs ship FBX, not
    GLB. The script loads the FBX with three.js `FBXLoader`, rebuilds each
    skinned mesh as one de-indexed primitive per material (the raw FBX carries
    45–73 tiny material groups per mesh, which `GLTFExporter` would turn into
    45–73 draw calls per enemy), drops the horse's all-white vertex colors,
    keeps only the one clip the game plays, and exports a GLB (Node needs a
    small `FileReader` polyfill for `GLTFExporter`). Facing was measured per
    model (head/torso vs. hips, foot-toe direction, run-cycle stride): all
    three face +Z at rest, so `models.ts` gives each the same `facing: π/2`
    offset as the cannon barrel. No Blender required.
  - **Pipeline** (`scripts/compress-assets.mjs`): the three new GLBs join
    `KEEP_ANIM` (skin + one clip kept, rest stripped; no decimation needed —
    690/1810/956 tris). Compressed sizes: runner 192→59 KB, tank 298→35 KB,
    armored 267→70 KB. Total payload 1.2 → 1.34 MB.
  - **`enemies3d.ts`**: `ANIMATED_CLIP` gains `runner: 'Run'`,
    `tank: 'Running'`, `armored: 'Walking'` — the existing skinned pool picks
    them up with no other changes (phase-offset, rate-scaled to on-screen
    speed, per-instance tinting all reuse the goblin/slime path).
  - **Performance.** Worst wave (14): 30 runners × 2 prims + 14 tanks + 20
    armored × 3 prims + 16 regen = ~150 skinned draw calls at peak, each a
    small mesh (≤1810 tris) — the same order of magnitude the instanced path
    already implied per kind, and far under the ~250-call ceiling that keeps
    the swarm instanced. Verified: typecheck + 70 tests + build + full smoke
    (25/25, `kills happened` green, 0 console errors).

- **#5 Enemy limb animation + #9 Adventurer characters — done (2026-08-19).**
  - KayKit (Adventurers + Character Animations) is paid and its GLBs aren't
    available here, so the animated characters ship as CC0 Quaternius stand-ins
    in the same low-poly style (see CREDITS.md for the exact KayKit drop-in).
  - **Pipeline** (`scripts/compress-assets.mjs`): the basic (Goblin) and regen
    (Slime) GLBs now keep their skin/rig + a single walk clip instead of being
    baked to a static mesh; the other enemies are still baked static. The
    animated meshes are also decimated (meshoptimizer preserves the
    JOINTS/WEIGHT attributes) to keep per-enemy skinning cheap.
  - **`models.ts`**: `NormalizedModel` now carries `animations` (the kept
    clips) alongside the scene.
  - **`enemies3d.ts`**: two rendering paths per kind. Animated kinds (basic,
    regen) use a lazily-grown pool of per-enemy `SkinnedMesh`es, each with its
    own `AnimationMixer` playing the walk clip at a phase-offset, rate-scaled
    to the enemy's on-screen speed × game speed — so feet track the movement
    and a group doesn't step in lockstep. Static kinds (runner/tank/armored/
    swarm + any kind whose model has no walk clip) keep the instanced path, now
    with a subtle procedural bob so they read as walking. The swap is
    stateless: bodies rebuild when a model arrives and re-sync from game state
    every frame.
  - **Performance.** Only the live animated enemies are skinned (a lazily
    grown pool, indexed like the instanced path), so the smoke window (wave 1 =
    8 Goblins) skins ~8 meshes. Measured ~16 FPS at the 4× kill window on the
    SwiftShader smoke rig (kill lands ~2.3 s before the check); the swarm (Bat)
    stays instanced so a 50-count wave is still a handful of draw calls.
    Verified: typecheck + 70 tests + build + full smoke (25/25, `kills
    happened` green, 0 console errors), stable across runs.

- **#7 Fantasy forest world assets — done (2026-08-19).**
  - KayKit is paid and its GLBs aren't available here, so the environment ships
    with CC0 Quaternius low-poly stand-ins in the same style (see CREDITS.md
    for the exact KayKit drop-in steps).
  - **Assets** (`assets-src/raw` → `assets-src/models`): 6 tree models
    (`tree_pack` with 5 variants, `pine_1..5`), 4 bushes, 2 mushrooms, a stump,
    and a second rock. `scripts/compress-assets.mjs` gained a `simplify` step
    (meshoptimizer) that decimates the large static environment meshes to a few
    hundred tris each (measured quality floors; `bush_4` is non-manifold and
    won't simplify, so it's left as-is). Total asset payload 19.3 MB → 1.2 MB.
  - **`src/render/forest.ts`** (new): a seeded-PRNG forest — a border ring of
    trees (dense/tall at the far edge, sparse/short at the camera edge),
    water-edge trees hugging the ponds, and rock-cell undergrowth + scattered
    props. A procedural low-poly forest shows immediately and is swapped for
    the GLTF trees once they load (kept forever on load failure).
  - **Performance.** The whole forest is baked into a handful of merged static
    meshes: every tree's bark (pack + pines share the same bark texture) merges
    into ONE mesh, pack leaves into a second, pine leaves into a third — so ~40
    trees cost **3 draw calls** instead of ~120. Combined with the decimated
    geometry this keeps the scene light enough for the fixed-step sim to hold
    4× speed on the SwiftShader smoke rig (kill-window ~17 FPS, first kill
    ~2.4 s before the smoke check fires). Verified: typecheck + 70 tests +
    build + full smoke (25/25, `kills happened` green, 0 console errors).

- **Core items 1–4 done.**
  - `camera3d.ts`: view target is now a pan-able point (clamped to the map).
    `zoomTo/dist` re-anchors the ground point under a screen `ndc` so the
    cursor stays put while zooming; `fitToAspect()` computes the distance at
    which the whole 24×16 map fits the current aspect and uses it as the
    zoom-out limit + initial distance (so portrait/ultrawide all start with
    the full map visible). Wheel + two-finger pinch both zoom via this.
  - `input.ts`: pointer events (mouse + touch). Tap = place/select; two
    pointers = pinch zoom (anchored at the midpoint, also pans by midpoint
    movement); single-finger drag does NOT pan (keeps the 2D behavior). Esc
    now closes modal → cancel → deselect → pause; Space starts the wave early.
  - `renderer.ts`: `zoomBy/zoomScale/resetCamera`; fog near/far synced to the
    camera fit distance so the map stays crisp at any aspect (mobile backs the
    camera ~60u out, which previously put the whole map in the fog band).
  - `main.ts`: responsive canvas — desktop keeps the letterboxed 3:2 box;
    small screens let the canvas flex to fill the space (HUD/build bar
    compacted via CSS). `ResizeObserver` keeps the buffer in sync when the HUD
    appears. `resetCamera()` on game start.
  - `ui.ts`: Esc closes open modals in the capture phase before Input pauses;
    debug panel is draggable by its title bar, has a collapse toggle, and
    starts collapsed under 720px.
  - `style.css`: `touch-action: none` on canvas, `overscroll-behavior: none`,
    responsive HUD/build-bar/tower-panel breakpoints (720/480px), debug-panel
    drag/collapse styles.
  - `template.html`: viewport meta (no user zoom), help text + pause tooltip
    updated, debug panel restructured (`.dp-title` drag handle + `.dp-body`).
  - `smoke.mjs`: updated for the new keybinds (esc pauses/resumes, space
    starts the wave). New `scripts/verify-zoom.mjs` verifies cursor-anchored
    zoom + mobile layout (10 checks, all green).

## Original feedback

- zoom only work in center of the map, make it zoomable depending on the cursor.
- pause/settings should be on esc, and space should start the wave
- debug panel cover up the map on smaller device, make it draggable or adjust its placement on smaller device
- game doesn't display nicely on mobile/touch device
- the enemy asset only animate on plane of their direction, no limb animation
- asset uses medieval look - try to find a futuristic asset that meet the type of weapon
- maybe use the world asset from https://kaylousberg.itch.io/kaykit-forest
- or perhaps we can make it hexagonal instead of square, and assets like this https://kaylousberg.itch.io/kaykit-medieval-hexagon
- characters kit https://kaylousberg.itch.io/kaykit-adventurers, enemy https://kaylousberg.itch.io/kaykit-character-animations
