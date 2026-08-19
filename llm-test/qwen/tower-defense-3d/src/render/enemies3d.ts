// Enemy 3D rendering (Phase 5: instanced + animated).
//
// Two rendering paths per enemy kind:
//   * INSTANCED (runner/tank/armored/swarm, and any kind whose model has no
//     walk clip): one InstancedMesh per model primitive per kind — the whole
//     swarm renders in a handful of draw calls regardless of count. A subtle
//     procedural bob is baked into the instance matrix so enemies read as
//     "walking" rather than sliding. The swarm (bat) stays instanced: 50
//     concurrent bats × 5 materials would be ~250 draw calls if skinned.
//   * SKINNED (animated kinds — basic goblin, regen slime, whose GLBs keep a
//     walk clip, item #5): a lazily-grown pool of per-enemy SkinnedMeshes,
//     each with its own AnimationMixer playing the limb animation at an
//     independent phase. This is the real limb animation the instanced path
//     can't do. The pool grows on demand (high-water mark) and is indexed the
//     same way as the instanced path (instance i < count is live).
//
// Per-instance tinting (slow / hit flash / regen pulse) goes through
// instanceColor (instanced path) or per-instance cloned materials (skinned
// path). Health bars are pooled billboard sprites with stable per-enemy slot
// assignment. Tier-1 procedural fallbacks and async GLTF swap-in work as
// before: bodies are rebuilt per kind when a model arrives; instances re-sync
// from game state every frame, so the swap is stateless.

import * as THREE from 'three';
import { ENEMIES, WAVES, px2w } from '../core/defs';
import type { Enemy } from '../core/enemy';
import type { Game } from '../core/game';
import type { EnemyKind, SettingsStore } from '../core/types';
import { modelManager, type EnemyModelKey, type NormalizedModel } from './models';

const ENEMY_MODEL_KEY: Record<EnemyKind, EnemyModelKey> = {
  basic: 'enemy_basic',
  runner: 'enemy_runner',
  tank: 'enemy_tank',
  swarm: 'enemy_swarm',
  armored: 'enemy_armored',
  regen: 'enemy_regen',
};

const KINDS: EnemyKind[] = ['basic', 'runner', 'tank', 'swarm', 'armored', 'regen'];

/**
 * Animated kinds: kind -> substring of the walk clip name to play (item #5).
 * A kind only takes the skinned path when its loaded model actually carries a
 * matching clip; otherwise it falls back to the instanced path. The swarm (bat)
 * is deliberately NOT here — it's a 50-count swarm and must stay instanced.
 */
const ANIMATED_CLIP: Partial<Record<EnemyKind, string>> = {
  basic: 'Walk',
  regen: 'Walk',
};
// Walk-cycle baseline: the basic enemy's world speed. Faster kinds animate
// proportionally faster so feet track the on-screen movement.
const BASE_SPEED = px2w(ENEMIES.basic.speed);

/**
 * Per-kind instance capacity: the largest single-wave count of that kind
 * (waves never overlap) + headroom for debug spawns. Used as the initial
 * instanced capacity and as a soft floor for the skinned pool (which grows
 * lazily past it if a debug spawn demands).
 */
const CAPACITY: Record<EnemyKind, number> = (() => {
  const out = {} as Record<EnemyKind, number>;
  for (const kind of KINDS) {
    let max = 0;
    for (const wave of WAVES) for (const g of wave) if (g.kind === kind) max = Math.max(max, g.count);
    out[kind] = max + 8;
  }
  return out;
})();

const SLOW_TINT = new THREE.Color('#6fd6ff');
const REGEN_TINT = new THREE.Color('#8dffb4');
const WHITE = new THREE.Color(1, 1, 1);

// scratch (no per-frame allocation)
const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _p = new THREE.Vector3();
const _s = new THREE.Vector3();
const _c = new THREE.Color();
const Y_AXIS = new THREE.Vector3(0, 1, 0);

interface Prim {
  geo: THREE.BufferGeometry;
  mat: THREE.Material;
  /** Geometry we own (dispose on rebuild). GLTF geos are per-kind clones;
   *  materials are always shared with the model cache (never disposed here). */
  ownsGeo: boolean;
}

interface SkinnedInstance {
  root: THREE.Object3D;
  mixer: THREE.AnimationMixer;
  action: THREE.AnimationAction;
  /** Cloned materials (one per primitive) — tinted per instance. */
  mats: { color?: THREE.Color }[];
  /** Each material's base color (rest state), so tint is a clean multiplier. */
  baseColors: THREE.Color[];
}

interface KindBody {
  kind: EnemyKind;
  animated: boolean;
  /** Instanced path (static kinds + fallbacks). */
  meshes: THREE.InstancedMesh[];
  isGLTF: boolean;
  capacity: number;
  /** Tint baseline: procedural = enemy base color (materials are white);
   *  GLTF = white (textures carry the base color). */
  baseTint: THREE.Color;
  /** Skinned path (animated kinds): lazily-grown pool, indexed like instances. */
  pool: SkinnedInstance[] | null;
}

/** Tier-1 procedural body: single primitive, geometry baked to ground at y=0. */
function proceduralPrim(kind: EnemyKind): Prim {
  let geo: THREE.BufferGeometry;
  let y: number;
  switch (kind) {
    case 'basic': geo = new THREE.SphereGeometry(0.28, 16, 12); y = 0.24; break;
    case 'runner': geo = new THREE.OctahedronGeometry(0.26, 0); y = 0.3; break;
    case 'tank': geo = new THREE.BoxGeometry(0.5, 0.42, 0.5); y = 0.24; break;
    case 'swarm': geo = new THREE.ConeGeometry(0.2, 0.42, 3); y = 0.24; break;
    case 'armored': geo = new THREE.CylinderGeometry(0.27, 0.27, 0.3, 6); y = 0.2; break;
    case 'regen': geo = new THREE.SphereGeometry(0.26, 12, 10); y = 0.26; break;
  }
  geo.translate(0, y, 0);
  const mat = new THREE.MeshStandardMaterial({
    // Base color comes from per-instance tint (baseTint), so the material
    // stays white and instanceColor reproduces the old per-enemy tinting.
    color: 0xffffff,
    roughness: 0.65,
    metalness: kind === 'armored' ? 0.55 : 0.1,
    flatShading: kind === 'runner' || kind === 'swarm',
  });
  return { geo, mat, ownsGeo: true };
}

/**
 * Extract primitives from a normalized GLTF model. GLTFLoader emits one
 * Mesh per primitive; each mesh's world transform (root centering, scale,
 * yOffset) is baked into a per-kind geometry clone so a plain InstancedMesh
 * can render it. Materials stay shared with the model cache.
 */
function gltfPrims(modelObject: THREE.Object3D): Prim[] {
  modelObject.updateMatrixWorld(true);
  const prims: Prim[] = [];
  modelObject.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const geos = Array.isArray(mesh.geometry) ? mesh.geometry : [mesh.geometry];
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (let i = 0; i < geos.length; i++) {
      const geo = geos[i].clone().applyMatrix4(mesh.matrixWorld);
      prims.push({ geo, mat: (mats[i] ?? mats[0]) as THREE.Material, ownsGeo: true });
    }
  });
  return prims;
}

/**
 * Clone a normalized model subtree into an independent skinned instance.
 * Geometry is shared (cheap); materials are cloned so each instance can be
 * tinted independently. Each SkinnedMesh's skeleton is rebuilt from the
 * cloned bones (clone() copies the template's skeleton, which points at the
 * template's bones), copying the template's inverse-bind matrices so we don't
 * depend on the clone's matrixWorld.
 */
function cloneSkinnedSubtree(template: THREE.Object3D): THREE.Object3D {
  const inst = template.clone();
  // Map template node -> cloned node via parallel traversal (clone preserves
  // child order, so the two trees line up index-for-index).
  const map = new Map<THREE.Object3D, THREE.Object3D>();
  (function walk(t: THREE.Object3D, c: THREE.Object3D): void {
    map.set(t, c);
    for (let i = 0; i < t.children.length; i++) {
      const tc = t.children[i];
      const cc = c.children[i];
      if (tc && cc) walk(tc, cc);
    }
  })(template, inst);
  // Rebuild every SkinnedMesh's skeleton from the cloned bones.
  inst.traverse((o) => {
    const sm = o as THREE.SkinnedMesh;
    if (!sm.isSkinnedMesh) return;
    let tsm: THREE.SkinnedMesh | null = null;
    for (const [t, c] of map) {
      if (c === sm) { tsm = t as THREE.SkinnedMesh; break; }
    }
    if (!tsm || !tsm.skeleton) return;
    const bones = tsm.skeleton.bones.map((b) => map.get(b)).filter((b): b is THREE.Bone => !!b);
    const boneInverses = tsm.skeleton.boneInverses.map((m) => m.clone());
    sm.skeleton = new THREE.Skeleton(bones, boneInverses);
    sm.bind(sm.skeleton, sm.bindMatrix);
  });
  // Clone materials for independent per-instance tinting.
  inst.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const src = mesh.material;
    mesh.material = Array.isArray(src) ? src.map((m) => m.clone()) : src.clone();
  });
  return inst;
}

function makeSkinnedInstance(template: THREE.Object3D, clip: THREE.AnimationClip, offset: number): SkinnedInstance {
  const root = cloneSkinnedSubtree(template);
  root.visible = false;
  root.position.set(0, -1000, 0); // hidden until assigned
  const mixer = new THREE.AnimationMixer(root);
  const action = mixer.clipAction(clip);
  action.setLoop(THREE.LoopRepeat, Infinity);
  // Desync the walk phase so a group of enemies doesn't step in lockstep.
  action.time = offset;
  action.play();
  const mats: { color?: THREE.Color }[] = [];
  const baseColors: THREE.Color[] = [];
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const m of list) {
      mats.push(m as { color?: THREE.Color });
      const mc = (m as { color?: THREE.Color }).color;
      baseColors.push(mc ? mc.clone() : new THREE.Color(1, 1, 1));
    }
  });
  return { root, mixer, action, mats, baseColors };
}

function buildInstanced(kind: EnemyKind, prims: Prim[], capacity: number, isGLTF: boolean, baseTint: THREE.Color): KindBody {
  const meshes = prims.map((p) => {
    const im = new THREE.InstancedMesh(p.geo, p.mat, capacity);
    im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    im.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(capacity * 3), 3);
    im.count = 0;
    im.castShadow = true;
    im.frustumCulled = false; // instance transforms aren't in the bounding sphere
    return im;
  });
  return { kind, animated: false, meshes, isGLTF, capacity, baseTint, pool: null };
}

interface BarSlot {
  sprite: THREE.Sprite;
  ctx: CanvasRenderingContext2D;
  tex: THREE.CanvasTexture;
  owner: number;
  lastFrac: number;
}

function drawBar(ctx: CanvasRenderingContext2D, tex: THREE.CanvasTexture, frac: number): void {
  ctx.clearRect(0, 0, 64, 12);
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(0, 0, 64, 12);
  const h = Math.max(0, Math.min(1, frac));
  ctx.fillStyle = `hsl(${Math.round(h * 120)}, 85%, 50%)`;
  ctx.fillRect(2, 2, 60 * h, 8);
  tex.needsUpdate = true;
}

export class Enemies3D {
  private readonly group = new THREE.Group();
  private readonly bodies = new Map<EnemyKind, KindBody>();
  private readonly barSlots: BarSlot[] = [];
  private readonly barOwner = new Map<number, number>(); // enemy id -> slot index
  private readonly barFree: number[] = [];
  private time = 0;

  constructor(private readonly settings: SettingsStore) {
    for (const kind of KINDS) {
      this.rebuildKind(kind);
      modelManager.onLoaded(ENEMY_MODEL_KEY[kind], () => this.rebuildKind(kind));
    }
    // Health-bar pool: total instance capacity + headroom.
    const total = KINDS.reduce((a, k) => a + CAPACITY[k], 0) + 8;
    for (let i = 0; i < total; i++) this.barFree.push(this.makeBarSlot(i));
  }

  private makeBarSlot(index: number): number {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 12;
    const ctx = canvas.getContext('2d')!;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
    sprite.scale.set(0.62, 0.115, 1);
    sprite.visible = false;
    this.group.add(sprite);
    this.barSlots[index] = { sprite, ctx, tex, owner: 0, lastFrac: -1 };
    return index;
  }

  /** Tear down a kind's body (instanced meshes or skinned pool). */
  private disposeBody(kind: EnemyKind): void {
    const old = this.bodies.get(kind);
    if (!old) return;
    for (const im of old.meshes) {
      this.group.remove(im);
      im.geometry.dispose();
      if (!old.isGLTF) (im.material as THREE.Material).dispose();
    }
    if (old.pool) {
      for (const inst of old.pool) {
        this.group.remove(inst.root);
        // Materials are per-instance clones — dispose them. Geometry is shared
        // with the model cache (never disposed here).
        for (const m of inst.mats) (m as THREE.Material).dispose();
      }
      old.pool = null;
    }
  }

  /** (Re)build a kind's body from the current model (or fallback). */
  private rebuildKind(kind: EnemyKind): void {
    this.disposeBody(kind);
    const model = modelManager.get(ENEMY_MODEL_KEY[kind]);
    const clipSub = ANIMATED_CLIP[kind];
    const clip = clipSub ? model?.animations?.find((c) => c.name.includes(clipSub)) : undefined;
    if (clip) {
      // Animated: lazily-grown skinned pool (no pre-build).
      this.bodies.set(kind, { kind, animated: true, meshes: [], isGLTF: true, capacity: CAPACITY[kind], baseTint: WHITE, pool: [] });
    } else {
      const prims = model ? gltfPrims(model.object) : [proceduralPrim(kind)];
      const body = buildInstanced(kind, prims, CAPACITY[kind], !!model, model ? WHITE : new THREE.Color(ENEMIES[kind].color));
      this.bodies.set(kind, body);
      for (const im of body.meshes) this.group.add(im);
    }
  }

  /** Ensure the skinned pool has at least `n` instances (grow lazily). */
  private ensurePool(kind: EnemyKind, body: KindBody, n: number): void {
    const model = modelManager.get(ENEMY_MODEL_KEY[kind])!;
    const clip = model.animations!.find((c) => c.name.includes(ANIMATED_CLIP[kind]!))!;
    const pool = body.pool!;
    while (pool.length < n) {
      const inst = makeSkinnedInstance(model.object, clip, pool.length * 0.37);
      pool.push(inst);
      this.group.add(inst.root);
    }
  }

  /** Per-enemy tint factor (white base, lerped toward effect colors). */
  private computeTint(e: Enemy, baseTint: THREE.Color, out: THREE.Color): void {
    const slowAmt = e.isSlowed ? 0.45 * e.slowFactor : 0;
    const flash = e.hitFlash > 0 ? Math.min(1, e.hitFlash / 0.12) : 0;
    const regenPulse = e.isRegenerating ? 0.35 + Math.sin(this.time * 6) * 0.25 : 0;
    out.copy(baseTint);
    if (slowAmt > 0) out.lerp(SLOW_TINT, slowAmt);
    if (flash > 0) out.lerp(WHITE, flash * 0.85);
    if (regenPulse > 0) out.lerp(REGEN_TINT, regenPulse * 0.55);
  }

  update(dt: number, game: Game): void {
    this.time += dt;
    const showBars = this.settings.data.healthBars;
    const alive = new Set<number>();

    const used = new Map<EnemyKind, number>();
    for (const e of game.enemies) {
      if (!e.alive) continue;
      alive.add(e.id);
      const body = this.bodies.get(e.kind)!;
      const i = used.get(e.kind) ?? 0;
      used.set(e.kind, i + 1);

      // facing yaw toward the next waypoint
      let yaw = 0;
      if (e.pathIndex < e.path.length) {
        const wp = e.path[e.pathIndex];
        const dx = wp.c + 0.5 - e.x;
        const dz = wp.r + 0.5 - e.z;
        if (dx * dx + dz * dz > 0.0001) yaw = -Math.atan2(dz, dx);
      }

      if (body.animated && body.pool) {
        this.ensurePool(e.kind, body, i + 1);
        this.updateSkinned(e, body, i, yaw, dt, game);
      } else {
        if (i >= body.capacity) {
          this.growKind(e.kind);
          continue; // re-synced next frame at the new capacity
        }
        this.updateInstanced(e, body, i, yaw);
      }
    }

    // finalize per-kind counts / hide unused skinned instances
    for (const [kind, n] of used) {
      const body = this.bodies.get(kind)!;
      if (body.animated && body.pool) {
        for (let i = n; i < body.pool.length; i++) {
          body.pool[i].root.visible = false;
          body.pool[i].root.position.set(0, -1000, 0);
        }
      } else {
        for (const im of body.meshes) {
          im.count = n;
          im.instanceMatrix.needsUpdate = true;
          if (im.instanceColor) im.instanceColor.needsUpdate = true;
        }
      }
    }
    // kinds with zero live enemies
    for (const kind of KINDS) {
      const body = this.bodies.get(kind)!;
      if (!used.has(kind)) {
        if (body.animated && body.pool) {
          for (const inst of body.pool) {
            inst.root.visible = false;
            inst.root.position.set(0, -1000, 0);
          }
        } else {
          for (const im of body.meshes) im.count = 0;
        }
      }
    }

    // ---- pooled health bars ---------------------------------------------
    for (const [id, slot] of this.barOwner) {
      if (!alive.has(id)) {
        const s = this.barSlots[slot];
        s.sprite.visible = false;
        s.owner = 0;
        this.barOwner.delete(id);
        this.barFree.push(slot);
      }
    }
    for (const e of game.enemies) {
      if (!e.alive) continue;
      const frac = e.hp / e.maxHp;
      const show = showBars && frac < 0.999;
      let slot = this.barOwner.get(e.id);
      if (show && slot === undefined) {
        slot = this.barFree.pop() ?? this.makeBarSlot(this.barSlots.length);
        this.barOwner.set(e.id, slot);
        this.barSlots[slot].owner = e.id;
        this.barSlots[slot].lastFrac = -1; // force redraw
      }
      if (!show || slot === undefined) continue;
      const s = this.barSlots[slot];
      s.sprite.visible = true;
      s.sprite.position.set(e.x, 0.78, e.z);
      if (Math.abs(frac - s.lastFrac) > 0.02) {
        s.lastFrac = frac;
        drawBar(s.ctx, s.tex, frac);
      }
    }
  }

  /** Skinned path: show + place instance i, advance its walk, apply tint. */
  private updateSkinned(e: Enemy, body: KindBody, i: number, yaw: number, dt: number, game: Game): void {
    const inst = body.pool![i];
    if (!inst.root.visible) inst.root.visible = true;
    inst.root.position.set(e.x, 0, e.z);
    inst.root.rotation.y = yaw;
    // Walk cycle rate tracks on-screen speed (game speed * kind speed ratio).
    const rate = (e.speed / BASE_SPEED) * game.speed;
    inst.mixer.update(dt * rate);
    // Tint: multiply each material's base color by the effect factor.
    this.computeTint(e, WHITE, _c);
    for (let k = 0; k < inst.mats.length; k++) {
      const m = inst.mats[k];
      if (m.color) m.color.copy(inst.baseColors[k]).multiply(_c);
    }
  }

  /** Instanced path: write the instance matrix (with a procedural walk bob) + tint. */
  private updateInstanced(e: Enemy, body: KindBody, i: number, yaw: number): void {
    // procedural walk bob: a subtle vertical bounce, phase-offset per enemy so
    // the swarm doesn't move in lockstep.
    const bob = Math.abs(Math.sin(this.time * 9 + e.id * 1.7)) * 0.05;
    let sx = 1, sy = 1, sz = 1;
    if (e.kind === 'regen' || e.kind === 'swarm') {
      const w = 1 + Math.sin(this.time * 7 + e.id) * 0.08;
      sx = w; sy = 2 - w; sz = w;
    }
    _p.set(e.x, bob, e.z);
    _s.set(sx, sy, sz);
    _m.compose(_p, _q.setFromAxisAngle(Y_AXIS, yaw), _s);

    this.computeTint(e, body.baseTint, _c);
    for (const im of body.meshes) {
      im.setMatrixAt(i, _m);
      im.setColorAt(i, _c);
    }
  }

  /** Grow an instanced kind body when live enemies exceed capacity. */
  private growKind(kind: EnemyKind): void {
    const old = this.bodies.get(kind)!;
    const capacity = old.capacity * 2;
    for (const im of old.meshes) {
      this.group.remove(im);
      im.geometry.dispose();
    }
    if (!old.isGLTF) for (const im of old.meshes) (im.material as THREE.Material).dispose();
    const model = modelManager.get(ENEMY_MODEL_KEY[kind]);
    const prims = model ? gltfPrims(model.object) : [proceduralPrim(kind)];
    const body = buildInstanced(kind, prims, capacity, !!model, model ? WHITE : new THREE.Color(ENEMIES[kind].color));
    this.bodies.set(kind, body);
    for (const im of body.meshes) this.group.add(im);
  }

  addTo(scene: THREE.Scene): void {
    scene.add(this.group);
  }
}
