# Finding: Animated enemies render as invisible (scale corruption)

**Status:** RESOLVED — committed `edf3b4b`, deployed to live GitHub Pages
**Date:** 2026-08-19
**Affected:** All animated enemies (basic/goblin, regen/slime, runner/horse, tank/tank, armored/knight, elite/robot). Static swarm (instanced bat) unaffected.

## Resolution (deeper than initial hypothesis)
The initial hypothesis blamed the skinned clone path re-applying the baked 147.98 scale. The real bug was in `normalize()` in `src/render/models.ts`:

- `Box3.setFromObject(scene)` ran **before** `updateMatrixWorld`. In three 0.161, `SkinnedMesh.bindMatrixInverse` (attached bind) is only computed in `updateMatrixWorld`; on a freshly parsed GLTF it's identity.
- `setFromObject` used the CPU-skinned object-level box with the stale identity inverse → the mesh node's baked scale (~148 goblin, ~100 others) applied **twice**, inflating the measured size ~130–150×.
- The normalization scale came out that many times too small → every skinned enemy rendered sub-pixel.

**Fix (`models.ts`, 2 changes):**
1. `scene.updateMatrixWorld(true)` before the first `setFromObject` (core fix).
2. `frustumCulled = false` on skinned meshes (rest-pose bounding sphere doesn't cover walk cycle → limbs could be culled).

Verified: typecheck, 71/71 tests, build, smoke 25/25 (0 errors), in-browser pixel check, and a cropped visual analysis showing 4 goblins marching from the portal (one per grid cell, matching measured world positions x=1.45→5.99). Deployed live.

## User report
> "Most if not all enemies are not appearing at all." The map/forest also looks sparser than the KayKit reference. Enemies are the priority.

Smoke test passes (25/25, kills happened) because it only checks **game logic**, not rendered pixels. Enemies spawn and die in the simulation, but **nothing draws on screen**.

## Root cause (confirmed via headless scene probe)

The 4 live basic enemies ARE in the Three.js scene and `visible = true` — but they are effectively zero-size:

1. **Geometry is tiny**: SkinnedMesh geometry bounding box max-dim ≈ **0.02 world units**.
2. **Ancestor scale chain is corrupted**: `[147.98, 1, 0.00127, 1, 1]` — net ≈ 0.19 but the geometry itself is ~0.02, so final rendered size ≈ **0.0038 units**. Invisible.
3. The 147.98 scale is a **baked-in huge scale on the GLB root** (a symptom of the FBX→GLB conversion / Quaternius source). The `normalize()` path in `src/render/models.ts` compensates by scaling to `ENEMY_SCALE` (0.55) — but the **skinned clone path** (`cloneSkinnedSubtree` / `makeSkinnedInstance` in `src/render/enemies3d.ts`) re-scales the template's baked 147.98 scale on top, instead of using the already-normalized 0.55.

So the skinned enemies get an extra ~148× on top of the normalizing scale — the inverse cancels out to ~0.001 and the enemy collapses to a dot.

## Evidence (from headless probe, 0 console errors)
- `SkinnedMesh visible=true`, `wpos=[6.06,0.1,8.78]`, `wscale=[147.98,…]`
- geometry box ~0.02, 12 bones, skinIndex count 1515 (rig is fine)
- material MeshStandardMaterial white, visible, opaque

## Fix direction (for the agent)
Ensure the skinned clone uses the **normalized** model scale (0.55 / 0.85 for elite), NOT the raw GLB's baked-in 147.98. The instanced path already normalizes correctly (it bakes `matrixWorld` via `gltfPrims`); the skinned path must apply the same normalization. Check `normalize()` output (a `Group` with the scene scaled to target) — clone that group, not the raw scene, so scale inheritance is correct.

## Related (lower priority)
- The forest/map looks sparser than the KayKit "Forest Nature Pack" reference — likely fewer tree/rock/bush placements than the reference image. Separate from the enemy invisibility; do after enemies render.
