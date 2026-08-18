# Last Bastion

A 3D browser-based **action tower-defense / wave-survival** game. You play a guardian
defending an ancient crystal (the Bastion) on a single polished arena while enemy
swarms pour in from portals around the edge. You fight directly *and* build towers.

Core loop: **Prepare → Build → Survive Wave → Earn Essence → Upgrade/Unlock → Prepare Again.**
A run is 10 waves plus a final boss wave (The Rift Behemoth).

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

Deploy: copy the contents of `dist/` to any static host (GitHub Pages, Netlify, S3, ...).
The build uses relative asset paths (`base: './'`), so it works from any subdirectory.

## Controls

| Input | Action |
| --- | --- |
| WASD | Move |
| Mouse | Aim |
| Left click | Primary attack (fast bolt) |
| Right click | Lance (piercing shot, longer cooldown) |
| Space | Dash (i-frames, short cooldown) |
| Q | Ground Slam (AoE damage + knockback) |
| E | Arcane Volley (multi-shot spread) |
| R | Blink (teleport in aim direction) — unlockable via upgrade cards |
| F | Overcharge (temporary attack speed/damage boost) — unlockable via upgrade cards |
| Tab | Toggle build mode |
| Esc | Pause |
| F2 | Debug panel (waves, spawn pause, essence, bastion damage, kill all, path/range overlays, spawn, skip) |

In build mode: click a glowing pad to place the selected tower, click a placed tower to
select it (upgrade / sell panel), hover shows range preview and valid/invalid highlight.

## Gameplay systems

- **Waves** — 11 waves with a prep phase before each (early-starting grants bonus
  essence). Waves 3, 6 and 9 end with a pick-one-of-three upgrade card. From wave 6 on,
  two extra rift gates (northeast / northwest) come online, opening a fifth front.
- **Towers** — 4 types, 2 upgrade levels each:
  - Arcane Turret: fast single-target bolts.
  - Frost Obelisk: AoE slow pulse.
  - Ember Spire: explosive splash lob.
  - Tesla Pylon: chaining lightning.
- **Enemies** — Crawler (basic), Wisp (fast, chases the player), Brute (tanky),
  Bulwark (armored, raids towers), Shaman (heals nearby enemies), Colossus (elite tank,
  raids towers), and the boss **Rift Behemoth** (summons crawlers, void bolts, shield
  phase, tower suppression, enrage).
- **Difficulty** — Easy / Normal / Hard. Hard changes more than HP: enemy counts,
  speed, boss HP/speed, and shorter prep times.
- **Economy** — Essence from kills and wave-clear bonuses; spent on towers, tower
  upgrades, and paid card rerolls. Towers can be sold for a partial refund.
- **Persistence** — settings, difficulty, and best wave reached are stored in
  `localStorage`.

## Project structure

```
last-bastion/
  index.html            # page shell (canvas + UI root)
  src/
    main.ts             # wiring: game, renderer, input, UI, audio, saves
    style.css           # all UI styling
    core/
      types.ts          # shared types (Vec3, Enemy, Tower, FxEvent, ...)
      defs.ts           # data: enemies, towers, cards, waves, difficulty
      arena.ts          # arena layout: spline lanes, building pads, features
      rng.ts            # seeded RNG (deterministic arena layout)
      save.ts           # localStorage save/load
    game/
      state.ts          # GameState: entities, essence, phase machine, fx queue
      game.ts           # Game: main update loop, phase transitions, debug cmds
      player.ts         # movement, aim, attacks, dash, abilities, cooldowns
      enemies.ts        # enemy AI: lanes, targeting, attacks, boss mechanics
      towers.ts         # placement rules, targeting, firing, upgrade/sell
      projectiles.ts    # projectiles, hits, splash, chain, knockback
      waves.ts          # wave definitions, spawn queue, prep/combat phases
      upgrades.ts       # upgrade card pool and rolls
      effects.ts        # particle pool, beams, damage numbers, shake (logic side)
    render/
      renderer.ts       # three.js scene, camera follow, instanced enemies, fx
      world.ts          # static world: ground, portals, bastion, pads, features
      textures.ts       # procedural canvas textures (ground, glow, bars, text)
    ui/
      ui.ts             # DOM UI: menu, HUD, build bar, tower panel, cards, debug
    input/
      input.ts          # keyboard/mouse state, pointer -> ground raycast
    audio/
      audio.ts          # procedural WebAudio SFX + ambient music
```

## Technical notes

- **Rendering** — three.js (WebGL) with a fixed elevated third-person camera that
  follows the player. The original spec suggested WebGPU/TypeGPU; three.js was chosen
  for broad GPU-driver compatibility and because the game logic is fully decoupled
  from the renderer (swap-in point: `src/render/renderer.ts`).
- **No external art** — all geometry is primitives; ground, glow, health bars and
  damage numbers are procedural canvas textures.
- **No game engine** — hand-rolled update loop with a fixed 60 Hz logic step
  (accumulator in `game.ts`) and delta-clamped rendering.

## Performance considerations

- Enemies are rendered with **InstancedMesh** per enemy kind (one draw call per kind);
  the boss and player are small groups.
- Particles are a single pooled **THREE.Points** cloud (hard cap, see
  `MAX_PARTICLES` in `game/effects.ts`); beams, floating texts and health bars are
  fixed-size object pools.
- Quality setting (Low / Medium / High) toggles shadows and tone-mapping cost;
  Low disables shadow maps and per-frame shadow updates.
- The ground texture (1024² canvas with lane paths) is generated once at startup.
- Logic is capped at 60 Hz; rendering uses the real frame delta, so slow frames
  don't desync game state.
