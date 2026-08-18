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
import baseUrl from '../../assets-src/models/base.glb?url';
import rockUrl from '../../assets-src/models/rock.glb?url';

export type TowerModelKey =
  | 'tower_cannon' | 'tower_mg' | 'tower_sniper' | 'tower_frost' | 'tower_missile';
export type EnemyModelKey =
  | 'enemy_basic' | 'enemy_runner' | 'enemy_tank' | 'enemy_swarm' | 'enemy_armored' | 'enemy_regen';
export type ModelKey = TowerModelKey | EnemyModelKey | 'base' | 'rock';

export interface NormalizedModel {
  /** Normalized scene: scaled to `scale`, centered in x/z, resting on y=0, shadows on. */
  object: THREE.Group;
}

interface ModelConfig {
  url: string;
  /** Target size of the model's largest dimension, in world units. */
  scale: number;
  /** Extra Y rotation so the model's natural forward aligns with +X at parent rotation 0. */
  facing?: number;
  /** Extra lift off the ground (e.g. for a flying bat). */
  yOffset?: number;
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
  enemy_runner: { url: enemyRunnerUrl, scale: ENEMY_SCALE },
  enemy_tank: { url: enemyTankUrl, scale: ENEMY_SCALE },
  enemy_swarm: { url: enemySwarmUrl, scale: ENEMY_SCALE, yOffset: 0.12 },
  enemy_armored: { url: enemyArmoredUrl, scale: ENEMY_SCALE },
  enemy_regen: { url: enemyRegenUrl, scale: ENEMY_SCALE },
  base: { url: baseUrl, scale: 1.55 },
  rock: { url: rockUrl, scale: 0.6 },
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

function loadGLTF(url: string): Promise<THREE.Group> {
  return new Promise((resolve, reject) => {
    getLoader().load(
      url,
      (gltf: GLTF) => resolve(gltf.scene),
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
      const scene = await loadGLTF(CONFIG[key].url);
      const model: NormalizedModel = { object: normalize(scene, CONFIG[key]) };
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
