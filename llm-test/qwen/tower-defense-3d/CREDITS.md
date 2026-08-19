# Asset Credits — Tower Defense 3D

All 3D models in this game are **CC0 / Public Domain** and were downloaded
from [Poly Pizza](https://poly.pizza) (a curated catalogue of CC0 3D models).
Each model is freely usable with no attribution required; credit is given
here as a courtesy and for provenance.

## Compression

Every model is compressed before shipping with
[`gltf-transform`](https://gltf-transform.dev/) using:

- **Draco** (`KHR_draco_mesh_compression`) for geometry, and
- **WebP** for embedded textures (browser-native, no runtime transcoder).
- **Mesh decimation** (meshoptimizer, via `simplifyPrimitive`) for the large
  static environment meshes (trees + props) and the animated enemy meshes. The
  forest is small on screen and low-poly is the aesthetic, so these are reduced
  to a few hundred tris each before compression — this is what keeps the whole
  scene light enough to run at 4× speed on weak GPUs.

The runtime decodes Draco via three.js's `DRACOLoader` (WASM decoder shipped
in `libs/draco/`). The **total compressed asset payload is ~1.2 MB** —
well under the 15 MB budget set in the plan. (KTX2 was considered but
requires an external transcoder that isn't available in the glTF-Transform
v4 npm packages; WebP + Draco is the robust, dependency-light choice.)

**Enemy rigs.** Most enemies are **baked to a static mesh** at build time:
their skinned rig is stripped and they render in bind pose, rotated to face
their movement (the wolf alone carried 51 joints + 24 clips → 964 KB down to
13 KB). Two enemies are the exception — the **basic (Goblin)** and **regen
(Slime)** keep their skin + a single walk clip so they play real limb
animation (items #5/#9). The swarm (Bat) has a fly clip but is a 50-count
swarm, so it stays instanced (a skinned swarm would be ~250 draw calls).

## Models

| In-game role | Model | Author | License | Source (GLB) |
|---|---|---|---|---|
| Cannon tower | Cannon | Quaternius | CC0 | [static.poly.pizza/6d76c733…](https://static.poly.pizza/6d76c733-c77c-46f5-9d4f-af847d4052b3.glb) |
| Machine-Gun tower | Watch Tower | Quaternius | CC0 | [static.poly.pizza/af1eb6e4…](https://static.poly.pizza/af1eb6e4-a1b9-415f-bb4d-6098c4a70b40.glb) |
| Sniper tower | Stone Tower | Quaternius | CC0 | [static.poly.pizza/2ebc450e…](https://static.poly.pizza/2ebc450e-0874-4b5a-bbfa-6e30e29fcc85.glb) |
| Frost tower | Crystal | iPoly3D | CC0 | [static.poly.pizza/75211364…](https://static.poly.pizza/75211364-db9b-4004-8e35-18031f096da1.glb) |
| Missile tower | Turret Cannon | Quaternius | CC0 | [static.poly.pizza/aaf0aaa7…](https://static.poly.pizza/aaf0aaa7-c244-430a-908b-2ac57567d81c.glb) |
| Basic enemy | Goblin *(animated)* | Quaternius | CC0 | [static.poly.pizza/54e0fd61…](https://static.poly.pizza/54e0fd61-6898-4b17-b039-8fa656d02954.glb) |
| Runner enemy | Wolf | Quaternius | CC0 | [static.poly.pizza/f1d12388…](https://static.poly.pizza/f1d12388-e39b-4157-b32a-646a1d089fc4.glb) |
| Tank enemy | Ogre | joney_lol | CC0 | [static.poly.pizza/1ba94998…](https://static.poly.pizza/1ba94998-1534-441e-a5f7-e51ce167ecc0.glb) |
| Swarm enemy | Bat | Quaternius | CC0 | [static.poly.pizza/4ae13ae9…](https://static.poly.pizza/4ae13ae9-c257-41ed-86b5-1b4760924ebc.glb) |
| Armored enemy | Knight | Dawid2K | CC0 | [static.poly.pizza/5aef0a90…](https://static.poly.pizza/5aef0a90-a166-4024-b3bb-ca6ad8c733f3.glb) |
| Regen enemy | Slime *(animated)* | Quaternius | CC0 | [static.poly.pizza/195565b4…](https://static.poly.pizza/195565b4-842a-44e9-a59a-5ebb1d133255.glb) |
| Player base | Castle | Quaternius | CC0 | [static.poly.pizza/22b576c3…](https://static.poly.pizza/22b576c3-24c2-45c4-a89c-b088901c3695.glb) |
| Rock obstacle | Rock | Quaternius | CC0 | [static.poly.pizza/87d3dfd2…](https://static.poly.pizza/87d3dfd2-de47-4b03-b9f1-4c84c2a605b0.glb) |

### Fantasy-forest environment (item #7)

The forest border, pond-edge trees, and undergrowth use Quaternius CC0
environment models (same author as the towers/enemies above, same low-poly
style). These are the CC0 stand-ins for the paid KayKit Forest pack — see
`enhancement.md` for the drop-in steps for the real KayKit GLBs.

| In-game role | Model | Author | License |
|---|---|---|---|
| Deciduous trees (×5 variants) | Normal Tree pack | Quaternius | CC0 |
| Pine trees (×5) | Pine 1–5 | Quaternius | CC0 |
| Undergrowth bushes (×4) | Bush (large / small / cluster) | Quaternius | CC0 |
| Mushrooms (×2) | Mushroom | Quaternius | CC0 |
| Tree stump | Tree Stump (moss) | Quaternius | CC0 |
| Extra boulder | Environment Rock | Quaternius | CC0 |

## Procedural (no external asset)

The following are generated in code (Tier-1 procedural builders), keeping the
game fully functional even if a GLTF asset fails to load:

- **Spawn portal** — animated torus + swirl shader (`terrain.ts`). A GLTF
  portal was evaluated but the available CC0 options were poor fits for the
  fantasy theme, so the procedural version is kept.
- **Ground / grass & water** — procedural grid + animated water shader.
- **All projectiles, beams, particles, muzzle flashes, damage text** —
  procedural VFX.

## Swapping in the real KayKit assets

The environment (item #7) and the animated enemies (items #9/#5) ship with CC0
Quaternius stand-ins because the **KayKit packs are paid** on itch.io and their
GLBs aren't available in this environment. To use the real KayKit assets, buy
the packs, then:

1. **Forest** ([KayKit Forest](https://kaylousberg.itch.io/kaykit-forest)) —
   drop the KayKit tree/prop GLBs into `assets-src/raw/` under the existing
   keys (`tree_pack`, `pine_1..5`, `bush_1..4`, `mushroom_1/2`, `stump`,
   `rock_2`), keeping the same mesh/material names so `forest.ts` picks them up.
   Re-run `node scripts/compress-assets.mjs` (the decimation ratios in
   `SIMPLIFY` may need re-tuning for the new tri counts) and `npm run build`.
2. **Characters** ([KayKit Adventurers](https://kaylousberg.itch.io/kaykit-adventurers)
   + [KayKit Character Animations](https://kaylousberg.itch.io/kaykit-character-animations))
   — replace `enemy_basic`/`enemy_regen` (and any other kind) with KayKit
   humanoid GLBs that carry a walk clip. The pipeline keeps the skin + the clip
   whose name matches `ANIMATED_CLIP[kind]` in `src/render/enemies3d.ts` (set
   the substring to the KayKit clip name, e.g. `Walk`), and the skinned path
   plays it. Kinds whose model has no matching clip fall back to the instanced
   path automatically, so you can mix animated and static kinds.

The CC0 stand-ins and the KayKit assets share the same low-poly fantasy style,
so the swap is a drop-in with no code changes beyond the clip-name substrings.

## License note

CC0 1.0 Universal — the authors have dedicated these works to the public
domain. You may use, modify, and redistribute them for any purpose, without
attribution. See [Poly Pizza](https://poly.pizza) for the full catalogue.
