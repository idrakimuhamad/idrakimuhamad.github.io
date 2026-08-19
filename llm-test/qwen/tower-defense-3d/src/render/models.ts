// Tier-2 realistic model registry (Phase 4).
//
// Loads Draco-compressed GLTF models (WebP textures), normalizes each into
// game-world scale (1 unit = 1 grid cell = 40 px), and caches them. The rest
// of the render layer asks for a model by key; if it isn't ready yet (or the
// load failed, e.g. offline) the caller keeps its Tier-1 procedural fallback
// and swaps in the GLTF model via onLoaded() once it arrives.
//
// All models are CC0 (see CREDITS.md).

import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// Model assets (Vite emits these as files and hands back their URLs).
import towerCannonUrl from '../../assets-src/models/tower_cannon.glb?url';
import towerMgUrl from '../../assets-src/models/tower_mg.glb?url';
import towerSniperUrl from '../../assets-src/models/tower_sniper.glb?url';
import towerFrostUrl from '../../assets-src/models/tower_frost.glb?url';
import towerMissileUrl from '../../assets-src/models/tower_missile.glb?url';
import enemyBasicUrl from '../../assets-src/models/enemy_basic.glb?url';
import enemyRunnerUrl from '../../assets-src/models/enemy_runner.glb?url';
import enemyTankUrl from '../../assets-src/models/enemy_tank.glb?url';
import enemySwarmUrl from '../../assets-src/models/enemy_swarm.glb?url';
import enemyArmoredUrl from '../../assets-src/models/enemy_armored.glb?url';
import enemyRegenUrl from '../../assets-src/models/enemy_regen.glb?url';
import enemyEliteUrl from '../../assets-src/models/enemy_elite.glb?url';
import baseUrl from '../../assets-src/models/base.glb?url';
import rockUrl from '../../assets-src/models/rock.glb?url';
import treePackUrl from '../../assets-src/models/tree_pack.glb?url';
import pine1Url from '../../assets-src/models/pine_1.glb?url';
import pine2Url from '../../assets-src/models/pine_2.glb?url';
import pine3Url from '../../assets-src/models/pine_3.glb?url';
import pine4Url from '../../assets-src/models/pine_4.glb?url';
import pine5Url from '../../assets-src/models/pine_5.glb?url';
import rock2Url from '../../assets-src/models/rock_2.glb?url';
import mushroom1Url from '../../assets-src/models/mushroom_1.glb?url';
import mushroom2Url from '../../assets-src/models/mushroom_2.glb?url';
import stumpUrl from '../../assets-src/models/stump.glb?url';
import bush1Url from '../../assets-src/models/bush_1.glb?url';
import bush2Url from '../../assets-src/models/bush_2.glb?url';
import bush3Url from '../../assets-src/models/bush_3.glb?url';
import bush4Url from '../../assets-src/models/bush_4.glb?url';

export type TowerModelKey =
  | 'tower_cannon' | 'tower_mg' | 'tower_sniper' | 'tower_frost' | 'tower_missile';
export type EnemyModelKey =
  | 'enemy_basic' | 'enemy_runner' | 'enemy_tank' | 'enemy_swarm' | 'enemy_armored' | 'enemy_regen'
  | 'enemy_elite';
export type ModelKey =
  | TowerModelKey
  | EnemyModelKey
  | 'base' | 'rock'
  // Fantasy-forest environment (item #7)
  | 'tree_pack' | 'pine_1' | 'pine_2' | 'pine_3' | 'pine_4' | 'pine_5'
  | 'rock_2' | 'mushroom_1' | 'mushroom_2' | 'stump'
  | 'bush_1' | 'bush_2' | 'bush_3' | 'bush_4';

export interface NormalizedModel {
  /** Normalized scene: scaled to `scale`, centered in x/z, resting on y=0, shadows on. */
  object: THREE.Group;
  /** Animation clips kept on the model (animated enemies, item #5). */
  animations?: THREE.AnimationClip[];
}

interface ModelConfig {
  url: string;
  /** Target size of the model's largest dimension, in world units. */
  scale: number;
  /** Extra Y rotation so the model's natural forward aligns with +X at parent rotation 0. */
  facing?: number;
  /** Extra lift off the ground (e.g. for a flying bat). */
  yOffset?: number;
  /** Rotate 180° about X before normalizing: some exports hang from y=0
   *  (trunk/stem extends in -y) instead of standing on it. */
  flip?: boolean;
  /** Skip normalization — the consumer owns the raw scene (e.g. the tree
   *  pack, whose five trees are extracted and normalized per variant). */
  raw?: boolean;
}

// Target sizes (world units). Towers fill ~1 cell, enemies are a touch smaller
// so they read as "creatures in the lane", the base castle is prominent.
const TOWER_SCALE = 0.82;
const ENEMY_SCALE = 0.55;

const CONFIG: Record<ModelKey, ModelConfig> = {
  // facing = the model's natural barrel/front direction (atan2(z,x) at rest),
  // so that after the turret's `rotation.y = -tower.angle` the barrel tracks
  // the target. Measured from the raw GLB geometry (scripts/node-dump.mjs).
  // Cannon barrel (wide muzzle rim) points +Z at rest -> +90deg. The other
  // towers (watchtower mg/sniper, crystal frost, rock missile) have their
  // front/gun on +X or are symmetric, so they need no facing offset.
  tower_cannon: { url: towerCannonUrl, scale: TOWER_SCALE, facing: Math.PI / 2 },
  tower_mg: { url: towerMgUrl, scale: TOWER_SCALE },
  tower_sniper: { url: towerSniperUrl, scale: TOWER_SCALE },
  tower_frost: { url: towerFrostUrl, scale: TOWER_SCALE },
  tower_missile: { url: towerMissileUrl, scale: TOWER_SCALE },
  enemy_basic: { url: enemyBasicUrl, scale: ENEMY_SCALE },
  // The Quaternius horse/skeleton/knight all face +Z at rest (measured from
  // head/torso vs. hips, foot-toe direction, and the run-cycle stride), so
  // they need the same +90deg facing offset as the cannon barrel.
  enemy_runner: { url: enemyRunnerUrl, scale: ENEMY_SCALE, facing: Math.PI / 2 },
  enemy_tank: { url: enemyTankUrl, scale: ENEMY_SCALE, facing: Math.PI / 2 },
  enemy_swarm: { url: enemySwarmUrl, scale: ENEMY_SCALE, yOffset: 0.12 },
  enemy_armored: { url: enemyArmoredUrl, scale: ENEMY_SCALE, facing: Math.PI / 2 },
  enemy_regen: { url: enemyRegenUrl, scale: ENEMY_SCALE },
  // Elite Sentinel (styloo robot): faces -Z at rest (face/eyes/front wheel on
  // the -Z side, measured from the rendered GLB), so it needs -90deg to align
  // with +X. Scaled a bit larger than the other enemies: it's the boss.
  // (max dim is the outstretched-arm span, not the height.)
  enemy_elite: { url: enemyEliteUrl, scale: 0.85, facing: -Math.PI / 2 },
  base: { url: baseUrl, scale: 1.55 },
  rock: { url: rockUrl, scale: 0.6 },
  // --- fantasy forest (item #7) -----------------------------------------
  // The pack holds five normal trees laid out in a row; forest.ts extracts
  // them as variants, so it loads raw (no whole-pack normalization).
  tree_pack: { url: treePackUrl, scale: 1, raw: true },
  // Unit height (max dim = trunk height) so a placement's `scale` is the
  // final world height, matching the extracted tree_pack variants.
  pine_1: { url: pine1Url, scale: 1.0 },
  pine_2: { url: pine2Url, scale: 1.0 },
  pine_3: { url: pine3Url, scale: 1.0 },
  pine_4: { url: pine4Url, scale: 1.0 },
  pine_5: { url: pine5Url, scale: 1.0 },
  rock_2: { url: rock2Url, scale: 0.5 },
  mushroom_1: { url: mushroom1Url, scale: 0.28, flip: true },
  mushroom_2: { url: mushroom2Url, scale: 0.3 },
  stump: { url: stumpUrl, scale: 0.5, flip: true },
  bush_1: { url: bush1Url, scale: 0.55 },
  bush_2: { url: bush2Url, scale: 1.15 }, // 3-bush cluster
  bush_3: { url: bush3Url, scale: 0.6 },
  bush_4: { url: bush4Url, scale: 0.5, flip: true },
};

const ALL_KEYS = Object.keys(CONFIG) as ModelKey[];

// ------------------------------------------------------------------ loading

let loader: GLTFLoader | null = null;

function getLoader(): GLTFLoader {
  if (loader) return loader;
  const draco = new DRACOLoader();
  // Decoder is served from public/libs/draco (copied from three's examples).
  draco.setDecoderPath('libs/draco/');
  draco.preload();
  loader = new GLTFLoader();
  loader.setDRACOLoader(draco);
  return loader;
}

function loadGLTF(url: string): Promise<{ scene: THREE.Group; animations: THREE.AnimationClip[] }> {
  return new Promise((resolve, reject) => {
    getLoader().load(
      url,
      (gltf: GLTF) => resolve({ scene: gltf.scene, animations: gltf.animations }),
      undefined,
      (err) => reject(err instanceof Error ? err : new Error(String(err))),
    );
  });
}

const _box = new THREE.Box3();
const _size = new THREE.Vector3();
const _center = new THREE.Vector3();

/** Scale to target size, center in x/z, rest on y=0, enable shadows. */
function normalize(scene: THREE.Object3D, cfg: ModelConfig): THREE.Group {
  scene.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.castShadow = true;
      mesh.receiveShadow = false;
    }
  });

  // Flip upside-down exports upright BEFORE measuring (a 180° X rotation
  // preserves extents, so it doesn't affect the scale/centering math).
  if (cfg.flip) scene.rotation.x = Math.PI;
  _box.setFromObject(scene);
  _size.set(0, 0, 0);
  _box.getSize(_size);
  const maxDim = Math.max(_size.x, _size.y, _size.z) || 1;
  scene.scale.setScalar(cfg.scale / maxDim);
  // Apply the facing rotation BEFORE centering so the x/z centering accounts
  // for it (rotating a positioned object would otherwise displace its center).
  // Rotating around Y leaves the Y extent and maxDim unchanged.
  if (cfg.facing) scene.rotation.y = cfg.facing;

  _box.setFromObject(scene);
  _box.getCenter(_center);
  scene.position.x = -_center.x;
  scene.position.z = -_center.z;
  scene.position.y = -_box.min.y + (cfg.yOffset ?? 0);

  const group = new THREE.Group();
  group.add(scene);
  return group;
}

/** Raw model: no normalization — the consumer (forest.ts) handles it. */
function wrapRaw(scene: THREE.Object3D): THREE.Group {
  scene.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.castShadow = true;
      mesh.receiveShadow = false;
    }
  });
  const group = new THREE.Group();
  group.add(scene);
  return group;
}

// ------------------------------------------------------------------ manager

export class ModelManager {
  private readonly cache = new Map<ModelKey, NormalizedModel>();
  private readonly inflight = new Map<ModelKey, Promise<NormalizedModel>>();
  private readonly listeners = new Map<ModelKey, Set<() => void>>();
  readonly failed = new Set<ModelKey>();

  /** Kick off loading every model (non-blocking). Safe to call once. */
  init(): void {
    for (const key of ALL_KEYS) void this.load(key);
  }

  /** Number of models currently loaded (for a load-progress readout). */
  loadedCount(): number {
    return this.cache.size;
  }

  totalCount(): number {
    return ALL_KEYS.length;
  }

  isLoaded(key: ModelKey): boolean {
    return this.cache.has(key);
  }

  /** Returns the normalized model, or null if not loaded yet / failed. */
  get(key: ModelKey): NormalizedModel | null {
    return this.cache.get(key) ?? null;
  }

  /**
   * Register a callback fired when `key` becomes available. If it is already
   * loaded the callback runs immediately (synchronously).
   */
  onLoaded(key: ModelKey, cb: () => void): void {
    if (this.cache.has(key)) {
      cb();
      return;
    }
    let set = this.listeners.get(key);
    if (!set) {
      set = new Set();
      this.listeners.set(key, set);
    }
    set.add(cb);
  }

  load(key: ModelKey): Promise<NormalizedModel> {
    const cached = this.cache.get(key);
    if (cached) return Promise.resolve(cached);
    const existing = this.inflight.get(key);
    if (existing) return existing;
    const p = this.doLoad(key);
    this.inflight.set(key, p);
    return p;
  }

  private async doLoad(key: ModelKey): Promise<NormalizedModel> {
    try {
      const { scene, animations } = await loadGLTF(CONFIG[key].url);
      const cfg = CONFIG[key];
      const object = cfg.raw ? wrapRaw(scene) : normalize(scene, cfg);
      const model: NormalizedModel = { object, animations: animations.length ? animations : undefined };
      this.cache.set(key, model);
      const set = this.listeners.get(key);
      if (set) {
        for (const cb of set) {
          try {
            cb();
          } catch (err) {
            console.error(`[models] onLoaded(${key}) callback threw`, err);
          }
        }
        set.clear();
      }
      return model;
    } catch (err) {
      console.warn(`[models] failed to load "${key}" — using procedural fallback`, err);
      this.failed.add(key);
      throw err;
    } finally {
      this.inflight.delete(key);
    }
  }

  dispose(): void {
    for (const model of this.cache.values()) {
      model.object.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.geometry.dispose();
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          for (const m of mats) m.dispose();
        }
      });
    }
    this.cache.clear();
    this.listeners.clear();
    this.inflight.clear();
  }
}

/**
 * Clone a normalized model for per-entity use. Geometry is always shared
 * (cheap); materials are cloned only when `cloneMaterials` is set (needed for
 * per-enemy tinting — towers share materials safely since they never tint).
 */
export function cloneModel<T extends THREE.Object3D>(object: T, cloneMaterials: boolean): T {
  const cloned = object.clone() as T;
  if (cloneMaterials) {
    cloned.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        const src = mesh.material;
        mesh.material = Array.isArray(src) ? src.map((m) => m.clone()) : src.clone();
      }
    });
  }
  return cloned;
}

/** Shared singleton. */
export const modelManager = new ModelManager();
