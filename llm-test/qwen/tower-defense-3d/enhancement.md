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

## Nice to have

- [ ] **5. Enemy limb animation.** Current GLTF enemies are static meshes that
      slide; add walk/limb animation. Candidate source: KayKit Character
      Animations (kaylousberg.itch.io/kaykit-character-animations) — needs
      retargeting onto the existing enemy bodies or a full model swap.
- [ ] **6. Futuristic asset theme.** Replace the medieval Poly Pizza
      towers/enemies with futuristic models that match each weapon type
      (cannon / MG / sniper / frost / missile). CC0 sources TBD (Poly Pizza
      sci-fi, Kenney, Quaternius).
- [ ] **7. KayKit Forest world assets** (kaylousberg.itch.io/kaykit-forest)
      for the environment (trees, ground, rocks). Conflicts with #6's
      futuristic direction — pick one theme.
- [ ] **8. Hexagonal grid** (kaykit-medieval-hexagon style). BIG change:
      rework A* for hex neighbours, re-lay out the map, and it breaks the
      bit-identical 2D-parity tests. **Needs a go/no-go decision before
      starting** — it changes the game's core identity.
- [ ] **9. KayKit Adventurers characters** (kaylousberg.itch.io/kaykit-adventurers)
      — animated humanoids for enemies/towers. Overlaps #5/#6/#7; decide
      theme first (futuristic vs fantasy).

## Log

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
