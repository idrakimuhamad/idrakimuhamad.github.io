// Fantasy-forest environment (enhancement item #7).
//
// Layers, back to front:
//   1. Border ring of trees around the map (dense/tall at the far edge,
//      shorter at the camera edge so it frames the map without blocking it).
//   2. Inner tree ring in the margin between the grid edge and the border
//      ring — still outside the walkable cells, so it thickens the forest
//      backdrop into a band without blocking towers or the path.
//   3. Mid ring between the inner and border rings — a third tree line that
//      turns the margin into a three-deep forest wall with overlapping canopy.
//   4. Water-edge trees hugging the ponds (orthogonal + diagonal shore).
//   5. Interior forest: trees + undergrowth INSIDE the playfield, on the
//      cells that are never buildable (boulder fields, forest-pool water)
//      and off the enemy path — the playfield reads as a forest floor, not
//      an empty green grid.
//   6. Rock-cell undergrowth (bushes, mushrooms, small stones around the
//      boulder fields).
//   7. Scattered props on walkable cells (mushrooms, stumps, bushes, stones),
//      offset from cell centers so towers can still be built there.
//
// Performance: the whole forest must stay light enough for the fixed-step
// sim to keep up at 4x on weak GPUs (SwiftShader in CI). Two tricks:
//
//   * Every tree placement is baked into a small number of merged static
//     meshes. All bark (pack + pines share the same bark texture) merges
//     into ONE mesh, pack leaves into a second, pine leaves into a third —
//     so ~220 trees still cost 3 draw calls (props: one small mesh per
//     prop model). The decimated GLBs keep the merged vertex total around
//     100k tris — static geometry, so the sim stays 4x-capable on weak
//     GPUs (SwiftShader in CI).
//   * The GLBs are decimated in the asset pipeline (scripts/compress-assets.mjs)
//     to a few hundred tris per tree/prop.
//
// A procedural low-poly forest is shown immediately and swapped out once
// the GLTF trees have settled (or kept forever if they fail to load).
//
// All placements come from a seeded PRNG, so the forest is identical on
// every load (stable screenshots, no "why did my trees moved" confusion).

import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { COLS, ROWS, SPAWN, BASE, TERRAIN_CELLS } from '../core/defs';
import { Grid } from '../core/grid';
import { Pathfinder } from '../core/pathfinder';
import { T_GRASS, T_ROCK, T_WATER } from '../core/types';
import { modelManager, type ModelKey } from './models';

// ------------------------------------------------------------------ PRNG

// Shared seeded PRNG (core/prng) — re-exported so existing imports keep
// working (terrain.ts, tests).
export { mulberry32 } from '../core/prng';
import { mulberry32 } from '../core/prng';

// ------------------------------------------------------------------ types

const TREE_KEYS = ['tree_pack', 'pine_1', 'pine_2', 'pine_3', 'pine_4', 'pine_5'] as const;
type TreeKey = (typeof TREE_KEYS)[number];
const PINE_KEYS = TREE_KEYS.filter((k) => k !== 'tree_pack') as TreeKey[];

const PROP_KEYS = ['mushroom_1', 'mushroom_2', 'stump', 'bush_1', 'bush_2', 'bush_3', 'bush_4', 'rock_2'] as const;
type PropKey = (typeof PROP_KEYS)[number];

interface Placement {
  x: number;
  z: number;
  rotY: number;
  /** Final height (trees) or size (props), in world units. */
  scale: number;
}
interface TreePlacement extends Placement {
  key: TreeKey;
  /** Which variant inside the tree pack (0..4); unused for pines. */
  variant: number;
}

/**
 * Merged-tree buckets. The pack and the pines share the same bark texture
 * (Quaternius "NormalTree_Bark"), so all bark merges into one mesh; the
 * leaves differ (bright deciduous vs dark pine), so they stay separate.
 */
type TreeBucket = 'bark' | 'packLeaves' | 'pineLeaves';
interface Bucket {
  mat: THREE.Material | null;
  /** Attribute-signature -> transformed geometries (keeps merges valid). */
  geos: Map<string, THREE.BufferGeometry[]>;
}

// ------------------------------------------------------------------ helpers

const cellKey = (c: number, r: number) => r * COLS + c;
const inBounds = (c: number, r: number) => c >= 0 && c < COLS && r >= 0 && r < ROWS;

// TERRAIN_CELLS is a sparse list of water/rock cells; everything else is
// grass. Build a dense lookup once.
const terrainMap = new Map<number, number>();
for (const cell of TERRAIN_CELLS) terrainMap.set(cellKey(cell.c, cell.r), cell.t);

function terrainAt(c: number, r: number): number {
  if (!inBounds(c, r)) return -1;
  return terrainMap.get(cellKey(c, r)) ?? T_GRASS;
}

/** Bake every placement of `model` into per-material merged static meshes. */
function mergePlacements(model: THREE.Object3D, placements: Placement[]): THREE.Mesh[] {
  if (placements.length === 0) return [];
  model.updateMatrixWorld(true);
  // Bucket by (material, attribute signature) so mergeGeometries never sees
  // mismatched attribute sets (returns null otherwise, losing the whole batch).
  const buckets = new Map<string, { mat: THREE.Material; geos: THREE.BufferGeometry[] }>();
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const p = new THREE.Vector3();
  const s = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);

  for (const pl of placements) {
    p.set(pl.x, 0, pl.z);
    q.setFromAxisAngle(up, pl.rotY);
    s.setScalar(pl.scale);
    m4.compose(p, q, s);
    model.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
      const geo = mesh.geometry;
      const sig = `${mat.uuid}|` + Object.keys(geo.attributes).sort().join(',');
      let bucket = buckets.get(sig);
      if (!bucket) {
        bucket = { mat, geos: [] };
        buckets.set(sig, bucket);
      }
      const b = bucket;
      const g = geo.clone();
      // Model transform first (normalize: scale + center), then the placement
      // in world space (position + rotation + final scale). Order matters:
      // applying m4 first would multiply the placement position by the model scale.
      g.applyMatrix4(mesh.matrixWorld);
      g.applyMatrix4(m4);
      b.geos.push(g);
    });
  }

  const meshes: THREE.Mesh[] = [];
  for (const { mat, geos } of buckets.values()) {
    const merged = mergeGeometries(geos, false);
    for (const g of geos) g.dispose();
    if (!merged) continue;
    const mesh = new THREE.Mesh(merged, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    meshes.push(mesh);
  }
  return meshes;
}

/**
 * Extract the five trees from the raw tree-pack scene. The pack lays them
 * out in a row (x ≈ 200..222) at scale 100. Each node already carries a
 * −90° X rotation that stands the tree upright (its raw geometry lies along
 * local +Z). Each variant is cloned, re-centered, and scaled to unit height
 * so placements can use "scale = final height". The node's own rotation is
 * kept — overwriting it (e.g. rotation.x = π) knocks the tree on its side.
 */
function extractTreeVariants(raw: THREE.Object3D): THREE.Object3D[] {
  const scene = raw.children[0];
  const variants: THREE.Object3D[] = [];
  const box = new THREE.Box3();
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  for (const child of scene.children) {
    const v = child.clone();
    v.position.set(0, 0, 0);
    v.updateMatrixWorld(true);
    box.setFromObject(v);
    box.getSize(size);
    const h = size.y || 1;
    v.scale.multiplyScalar(1 / h);
    v.updateMatrixWorld(true);
    box.setFromObject(v);
    box.getCenter(center);
    v.position.set(-center.x, -box.min.y, -center.z);
    const g = new THREE.Group();
    g.add(v);
    variants.push(g);
  }
  return variants;
}

// ------------------------------------------------------------------ layout

// Pack trees are cheaper to decimate (~270 tris vs ~600 for pines), so they
// make up the majority; pines are the dark-green accent.
function pickTree(rand: () => number): { key: TreeKey; variant: number } {
  return rand() < 0.8
    ? { key: 'tree_pack', variant: (rand() * 5) | 0 }
    : { key: PINE_KEYS[(rand() * PINE_KEYS.length) | 0], variant: 0 };
}

/**
 * One line of trees from (x0,z0) to (x1,z1). `step` is the spacing, sMin/sMax
 * the base height range, heightBias a per-edge multiplier. Canopy variety:
 * ~12% of trees grow into very tall specimens and ~25% stay small saplings,
 * matching the reference's mixed-age forest (giants off for the camera edge
 * so the near ring never blocks the view).
 */
function treeLine(
  rand: () => number, out: TreePlacement[],
  x0: number, z0: number, x1: number, z1: number,
  step: number, sMin: number, sMax: number, heightBias = 1, allowGiants = true,
): void {
  const n = Math.max(1, Math.floor(Math.hypot(x1 - x0, z1 - z0) / step));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    let scale = (sMin + rand() * (sMax - sMin)) * heightBias;
    const v = rand();
    if (allowGiants && v < 0.12) scale *= 1.5 + rand() * 0.4;
    else if (v < 0.35) scale *= 0.45 + rand() * 0.2;
    out.push({
      x: x0 + (x1 - x0) * t + (rand() - 0.5) * step * 0.6,
      z: z0 + (z1 - z0) * t + (rand() - 0.5) * step * 0.6,
      rotY: rand() * Math.PI * 2,
      scale,
      ...pickTree(rand),
    });
  }
}

/** Outer border ring: dense/tall far edge, short camera edge. */
export function borderPlacements(rand: () => number): TreePlacement[] {
  const out: TreePlacement[] = [];
  const M = 2.4; // margin outside the map
  // Far edge (top of screen): dense, tall backdrop — step ~1.1 means the
  // canopies (radius ~0.5x height) heavily overlap into a forest wall.
  treeLine(rand, out, -M, -M, COLS + M, -M, 1.1, 2.4, 3.4, 1.15);
  // Side edges: same density so the wall is continuous around the map.
  treeLine(rand, out, -M, -M, -M, ROWS + M, 1.1, 2.0, 2.9);
  treeLine(rand, out, COLS + M, -M, COLS + M, ROWS + M, 1.1, 2.0, 2.9);
  // Near edge (camera side): short so it frames, never blocks.
  treeLine(rand, out, -M, ROWS + M, COLS + M, ROWS + M, 1.5, 1.3, 1.9, 1, false);
  return out;
}

/**
 * Second, inner ring: sits in the margin between the grid edge and the outer
 * border ring (1.2u outside the map, vs 2.4u for the outer ring). The margin
 * is not walkable, so the extra trees never block towers, the path, or the
 * spawn/base — they thicken the border into a multi-deep forest band.
 * Shorter than the outer ring so the far backdrop keeps its depth.
 */
export function innerRingPlacements(rand: () => number): TreePlacement[] {
  const out: TreePlacement[] = [];
  const IN = 1.2;
  treeLine(rand, out, -IN, -IN, COLS + IN, -IN, 1.6, 1.6, 2.6, 1.05);
  treeLine(rand, out, -IN, -IN, -IN, ROWS + IN, 1.6, 1.4, 2.4);
  treeLine(rand, out, COLS + IN, -IN, COLS + IN, ROWS + IN, 1.6, 1.4, 2.4);
  // Camera side: saplings only, so the near margin never occludes the map.
  treeLine(rand, out, -IN, ROWS + IN, COLS + IN, ROWS + IN, 2.2, 0.9, 1.5, 1, false);
  return out;
}

/**
 * Third, mid ring: halfway between the inner (1.2u) and border (2.4u) rings,
 * at 1.8u outside the map. All three rings are tree lines 0.6u apart, so
 * their canopies interlock into a solid forest wall (the KayKit reference
 * look) instead of three thin lines. Still entirely in the non-walkable
 * margin; shorter than the outer rings to preserve the backdrop's depth.
 */
export function midRingPlacements(rand: () => number): TreePlacement[] {
  const out: TreePlacement[] = [];
  const MID = 1.8;
  treeLine(rand, out, -MID, -MID, COLS + MID, -MID, 2.0, 1.5, 2.4, 1.0);
  treeLine(rand, out, -MID, -MID, -MID, ROWS + MID, 2.0, 1.3, 2.2);
  treeLine(rand, out, COLS + MID, -MID, COLS + MID, ROWS + MID, 2.0, 1.3, 2.2);
  // Camera side: saplings only, so the near margin never occludes the map.
  treeLine(rand, out, -MID, ROWS + MID, COLS + MID, ROWS + MID, 2.6, 0.8, 1.3, 1, false);
  return out;
}

/** Small trees hugging the ponds' shores (orthogonal + diagonal). */
export function waterEdgePlacements(rand: () => number): TreePlacement[] {
  const out: TreePlacement[] = [];
  const dirs = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [1, -1], [-1, 1], [-1, -1],
  ] as const;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (terrainAt(c, r) !== T_WATER) continue;
      for (const [dc, dr] of dirs) {
        if (terrainAt(c + dc, r + dr) !== T_GRASS) continue;
        // The ponds read as forest pools, not bare-edged ponds: most
        // orthogonal shore cells get a tree, diagonals a bit rarer.
        if (rand() > (dc === 0 || dr === 0 ? 0.65 : 0.5)) continue;
        const pine = rand() < 0.5;
        const v = rand();
        out.push({
          x: c + 0.5 + dc * 0.3 + (rand() - 0.5) * 0.35,
          z: r + 0.5 + dr * 0.3 + (rand() - 0.5) * 0.35,
          rotY: rand() * Math.PI * 2,
          // Mixed ages: two-fifths are small shore saplings.
          scale: v < 0.4 ? 0.7 + rand() * 0.3 : 1.1 + rand() * 1.0,
          key: pine ? PINE_KEYS[(rand() * PINE_KEYS.length) | 0] : 'tree_pack',
          variant: pine ? 0 : (rand() * 5) | 0,
        });
      }
    }
  }
  return out;
}

/**
 * Interior forest: trees and dense undergrowth INSIDE the playfield, on the
 * cells that are never buildable and not on the enemy path:
 *   * rock cells — small trees growing among the boulders + mossy
 *     undergrowth (mushrooms, stones, bushes) in the crevices;
 *   * water cells — small forest-pool trees standing in the pond water.
 * The initial enemy path (A* SPAWN -> BASE, no towers) and the spawn/base
 * neighbourhoods stay clear, so enemies always walk through and the
 * portal/fortress read cleanly. Everything is baked into the same merged
 * static meshes as the rest of the forest (no per-tree meshes).
 */
export function interiorPlacements(rand: () => number): { trees: TreePlacement[]; props: Map<PropKey, Placement[]> } {
  const trees: TreePlacement[] = [];
  const props = new Map<PropKey, Placement[]>(PROP_KEYS.map((k) => [k, []]));
  const grid = new Grid();
  const path = new Pathfinder(COLS, ROWS).findPath(grid, SPAWN.c, SPAWN.r, BASE.c, BASE.r) ?? [];
  const onPath = new Set(path.map((p) => p.r * COLS + p.c));
  const clearOfEnds = (c: number, r: number): boolean =>
    !(Math.abs(c - SPAWN.c) <= 1 && Math.abs(r - SPAWN.r) <= 1) &&
    !(Math.abs(c - BASE.c) <= 1 && Math.abs(r - BASE.r) <= 1);

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const t = terrainAt(c, r);
      if (t !== T_ROCK && t !== T_WATER) continue;
      if (onPath.has(r * COLS + c)) continue;
      if (!clearOfEnds(c, r)) continue;
      const x = c + 0.5;
      const z = r + 0.5;
      if (t === T_ROCK) {
        // Trees growing among the boulders — shorter than the border rings
        // so the playfield stays open, mixed ages for a natural look.
        const roll = rand();
        const n = roll < 0.6 ? 1 : roll < 0.85 ? 2 : 0;
        for (let i = 0; i < n; i++) {
          const { key, variant } = pickTree(rand);
          trees.push({
            x: x + (rand() - 0.5) * 0.55,
            z: z + (rand() - 0.5) * 0.55,
            rotY: rand() * Math.PI * 2,
            scale: 1.1 + rand() * 0.9,
            key,
            variant,
          });
        }
        // Mossy undergrowth in the boulder crevices.
        const pn = 1 + ((rand() * 3) | 0);
        for (let i = 0; i < pn; i++) {
          const roll = rand();
          const key: PropKey =
            roll < 0.4 ? 'mushroom_1' :
            roll < 0.7 ? 'mushroom_2' :
            roll < 0.85 ? 'rock_2' : 'bush_1';
          props.get(key)!.push({
            x: x + (rand() - 0.5) * 0.7,
            z: z + (rand() - 0.5) * 0.7,
            rotY: rand() * Math.PI * 2,
            scale: key === 'rock_2' ? 0.4 + rand() * 0.3 : 0.5 + rand() * 0.4,
          });
        }
      } else {
        // Forest pools: small trees standing in the pond water.
        if (rand() < 0.5) {
          const { key, variant } = pickTree(rand);
          trees.push({
            x: x + (rand() - 0.5) * 0.4,
            z: z + (rand() - 0.5) * 0.4,
            rotY: rand() * Math.PI * 2,
            scale: 0.8 + rand() * 0.5,
            key,
            variant,
          });
        }
      }
    }
  }
  return { trees, props };
}

/** Bushes + mushrooms around rock fields, plus scattered props. */
export function propPlacements(rand: () => number): Map<PropKey, Placement[]> {
  const out = new Map<PropKey, Placement[]>(PROP_KEYS.map((k) => [k, []]));
  const used = new Set<number>();
  const isCleanGrass = (c: number, r: number) => {
    if (terrainAt(c, r) !== T_GRASS) return false;
    const k = cellKey(c, r);
    if (used.has(k)) return false;
    // Keep the spawn and base cells (and their neighbours) clear.
    if (Math.abs(c - SPAWN.c) <= 1 && Math.abs(r - SPAWN.r) <= 1) return false;
    if (Math.abs(c - BASE.c) <= 1 && Math.abs(r - BASE.r) <= 1) return false;
    return true;
  };
  const place = (c: number, r: number, dc: number, dr: number, key: PropKey, scale: number) => {
    if (!isCleanGrass(c, r)) return;
    used.add(cellKey(c, r));
    out.get(key)!.push({
      x: c + 0.5 + dc * 0.22 + (rand() - 0.5) * 0.3,
      z: r + 0.5 + dr * 0.22 + (rand() - 0.5) * 0.3,
      rotY: rand() * Math.PI * 2,
      scale,
    });
  };

  // Undergrowth at the edge of every rock cell (cheap models only): bushes,
  // mushrooms and small stones crowd the boulders (40% of each shore side).
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]] as const;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (terrainAt(c, r) !== T_ROCK) continue;
      for (const [dc, dr] of dirs) {
        if (rand() > 0.4) continue;
        const roll = rand();
        const key: PropKey =
          roll < 0.3 ? 'bush_1' :
          roll < 0.5 ? 'bush_3' :
          roll < 0.65 ? 'rock_2' :
          roll < 0.85 ? 'mushroom_1' : 'mushroom_2';
        place(c + dc, r + dr, -dc, -dr, key, key === 'rock_2' ? 0.5 + rand() * 0.4 : 0.7 + rand() * 0.5);
      }
    }
  }

  // Scattered props on random walkable cells (offset from the cell center so
  // towers can still be built there without sitting inside a bush).
  const candidates: { c: number; r: number }[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (isCleanGrass(c, r)) candidates.push({ c, r });
    }
  }
  // Partial Fisher–Yates with the seeded PRNG.
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = (rand() * (i + 1)) | 0;
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  for (const cell of candidates.slice(0, 84)) {
    const roll = rand();
    const key: PropKey =
      roll < 0.18 ? 'mushroom_1' :
      roll < 0.36 ? 'mushroom_2' :
      roll < 0.48 ? 'stump' :
      roll < 0.52 ? 'rock_2' :
      roll < 0.7 ? 'bush_1' :
      roll < 0.85 ? 'bush_3' :
      roll < 0.93 ? 'bush_4' : 'bush_2';
    const dc = (rand() - 0.5) * 0.5;
    const dr = (rand() - 0.5) * 0.5;
    place(cell.c, cell.r, dc, dr, key, key === 'bush_2' ? 0.8 + rand() * 0.3 : key === 'rock_2' ? 0.5 + rand() * 0.4 : 0.7 + rand() * 0.55);
  }
  return out;
}

// ------------------------------------------------------------------ fallback

/**
 * Procedural low-poly tree (trunk + two cones), normalized to unit height.
 * Shown until the GLTF forest is ready; kept if it never loads.
 */
function buildFallbackForest(placements: TreePlacement[]): THREE.Group {
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5d4630, roughness: 1 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x47793c, roughness: 1 });
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.11, 0.5, 5), trunkMat);
  trunk.position.y = 0.25;
  const c1 = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.85, 6), leafMat);
  c1.position.y = 0.75;
  const c2 = new THREE.Mesh(new THREE.ConeGeometry(0.36, 0.65, 6), leafMat);
  c2.position.y = 1.2;
  const proto = new THREE.Group();
  proto.add(trunk, c1, c2);
  // Normalize to unit height (total height ≈ 1.525).
  proto.scale.setScalar(1 / 1.525);

  const group = new THREE.Group();
  for (const mesh of mergePlacements(proto, placements)) {
    group.add(mesh);
  }
  return group;
}

// ------------------------------------------------------------------ forest

export class Forest {
  readonly group = new THREE.Group();
  private readonly treePlacements: TreePlacement[];
  private readonly fallback: THREE.Group;
  private readonly buckets: Record<TreeBucket, Bucket> = {
    bark: { mat: null, geos: new Map() },
    packLeaves: { mat: null, geos: new Map() },
    pineLeaves: { mat: null, geos: new Map() },
  };
  private finalized = false;

  constructor() {
    this.group.name = 'forest';
    const rand = mulberry32(0x5eed);
    this.treePlacements = [
      ...borderPlacements(rand),
      ...innerRingPlacements(rand),
      ...midRingPlacements(rand),
      ...waterEdgePlacements(rand),
    ];
    // Interior forest: trees + undergrowth on the non-buildable interior
    // cells (boulder fields, forest pools), off the enemy path.
    const interior = interiorPlacements(rand);
    this.treePlacements.push(...interior.trees);
    const props = propPlacements(rand);
    for (const [key, list] of interior.props) {
      if (list.length > 0) props.get(key)!.push(...list);
    }

    // Immediate procedural forest (also the permanent fallback on load failure).
    this.fallback = buildFallbackForest(this.treePlacements);
    this.group.add(this.fallback);

    // GLTF trees: collect transformed geometry per key into shared buckets,
    // then merge everything at once (3 draw calls total for all trees).
    void Promise.all(
      TREE_KEYS.map((key) => modelManager.load(key).catch(() => null)),
    ).then(() => this.finalizeTrees());

    // Props merge individually as their models load (no fallback needed).
    for (const [key, placements] of props) {
      if (placements.length === 0) continue;
      modelManager.onLoaded(key, () => {
        const model = modelManager.get(key);
        if (!model) return;
        for (const mesh of mergePlacements(model.object, placements)) this.group.add(mesh);
      });
    }
  }

  /**
   * Classify a model's materials into tree buckets and collect its placed
   * geometry. Bark is shared across the pack and pines (same texture);
   * leaves stay separate (different textures).
   */
  private collectInto(model: THREE.Object3D, placements: TreePlacement[], isPack: boolean): void {
    if (placements.length === 0) return;
    model.updateMatrixWorld(true);

    // Map each unique material to a bucket (by name, with index fallback:
    // first material is bark, the rest are leaves in every tree model).
    const matBucket = new Map<THREE.Material, TreeBucket>();
    const unique: THREE.Material[] = [];
    model.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
      if (!unique.includes(mat)) unique.push(mat);
    });
    unique.forEach((mat, i) => {
      const name = (mat as THREE.MeshStandardMaterial).name || '';
      let b: TreeBucket;
      if (/bark/i.test(name)) b = 'bark';
      else if (/leaf/i.test(name)) b = isPack ? 'packLeaves' : 'pineLeaves';
      else b = i === 0 ? 'bark' : isPack ? 'packLeaves' : 'pineLeaves';
      matBucket.set(mat, b);
      if (!this.buckets[b].mat) this.buckets[b].mat = mat;
    });

    const m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const p = new THREE.Vector3();
    const s = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);
    for (const pl of placements) {
      p.set(pl.x, 0, pl.z);
      q.setFromAxisAngle(up, pl.rotY);
      s.setScalar(pl.scale);
      m4.compose(p, q, s);
      model.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
        const b = matBucket.get(mat) ?? (isPack ? 'packLeaves' : 'pineLeaves');
        const sig = Object.keys(mesh.geometry.attributes).sort().join(',');
        let geos = this.buckets[b].geos.get(sig);
        if (!geos) {
          geos = [];
          this.buckets[b].geos.set(sig, geos);
        }
        const g = mesh.geometry.clone();
        // Model transform first (normalize: scale + center), then the
        // placement in world space. Same order as mergePlacements.
        g.applyMatrix4(mesh.matrixWorld);
        g.applyMatrix4(m4);
        geos.push(g);
      });
    }
  }

  /** Merge all collected tree geometry and swap the fallback out. */
  private finalizeTrees(): void {
    if (this.finalized) return;
    this.finalized = true;
    for (const key of TREE_KEYS) {
      const model = modelManager.get(key);
      if (!model) continue; // failed load — that key's trees stay procedural
      const mine = this.treePlacements.filter((p) => p.key === key);
      if (key === 'tree_pack') {
        const variants = extractTreeVariants(model.object);
        for (let i = 0; i < variants.length; i++) {
          this.collectInto(variants[i], mine.filter((p) => p.variant === i), true);
        }
      } else {
        this.collectInto(model.object, mine, false);
      }
    }
    for (const bucket of Object.values(this.buckets)) {
      if (!bucket.mat) continue;
      for (const geos of bucket.geos.values()) {
        const merged = mergeGeometries(geos, false);
        for (const g of geos) g.dispose();
        if (!merged) continue;
        const mesh = new THREE.Mesh(merged, bucket.mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.group.add(mesh);
      }
    }
    // Swap out the procedural forest.
    this.group.remove(this.fallback);
    this.fallback.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      }
    });
  }
}
