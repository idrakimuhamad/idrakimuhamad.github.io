// Enemy 3D rendering (Phase 5: instanced).
//
// One InstancedMesh per model primitive per enemy kind (a glTF kind with 4
// materials = 4 instanced meshes) — the whole swarm renders in ~18 draw
// calls regardless of count, instead of one mesh per enemy. Per-instance
// tinting (slow / hit flash / regen pulse) goes through `instanceColor`;
// per-instance transform (position, facing yaw, wobble scale) through the
// instance matrix. Health bars are pooled billboard sprites with stable
// per-enemy slot assignment.
//
// Tier-1 procedural fallbacks and async GLTF swap-in work as before: bodies
// are rebuilt per kind when a model arrives; instances re-sync from game
// state every frame, so the swap is stateless.

import * as THREE from 'three';
import { ENEMIES, WAVES } from '../core/defs';
import type { Enemy } from '../core/enemy';
import type { Game } from '../core/game';
import type { EnemyKind, SettingsStore } from '../core/types';
import { modelManager, type EnemyModelKey } from './models';

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
 * Per-kind instance capacity: the largest single-wave count of that kind
 * (waves never overlap) + headroom for debug spawns. Overflow still works —
 * the kind body grows on demand.
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

interface KindBody {
  kind: EnemyKind;
  meshes: THREE.InstancedMesh[];
  capacity: number;
  isGLTF: boolean;
  /** Tint baseline: procedural = enemy base color (materials are white);
   *  GLTF = white (textures carry the base color). */
  baseTint: THREE.Color;
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

function buildKind(kind: EnemyKind, prims: Prim[], capacity: number, isGLTF: boolean, baseTint: THREE.Color): KindBody {
  const meshes = prims.map((p) => {
    const im = new THREE.InstancedMesh(p.geo, p.mat, capacity);
    im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    im.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(capacity * 3), 3);
    im.count = 0;
    im.castShadow = true;
    im.frustumCulled = false; // instance transforms aren't in the bounding sphere
    return im;
  });
  return { kind, meshes, capacity, isGLTF, baseTint };
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

  /** (Re)build a kind's instanced body from the current model (or fallback). */
  private rebuildKind(kind: EnemyKind): void {
    const old = this.bodies.get(kind);
    if (old) {
      for (const im of old.meshes) this.group.remove(im);
      for (const im of old.meshes) {
        // Geometries are always ours (procedural or per-kind GLTF clones);
        // materials are shared with the model cache — never disposed here.
        im.geometry.dispose();
      }
      if (!old.isGLTF) {
        for (const im of old.meshes) (im.material as THREE.Material).dispose();
      }
    }
    const model = modelManager.get(ENEMY_MODEL_KEY[kind]);
    const prims = model ? gltfPrims(model.object) : [proceduralPrim(kind)];
    const body = buildKind(
      kind,
      prims,
      CAPACITY[kind],
      !!model,
      model ? WHITE : new THREE.Color(ENEMIES[kind].color),
    );
    this.bodies.set(kind, body);
    for (const im of body.meshes) this.group.add(im);
  }

  /** Grow a kind body when live enemies exceed capacity (debug-spawn safety). */
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
    const body = buildKind(
      kind,
      prims,
      capacity,
      !!model,
      model ? WHITE : new THREE.Color(ENEMIES[kind].color),
    );
    this.bodies.set(kind, body);
    for (const im of body.meshes) this.group.add(im);
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
      let i = used.get(e.kind) ?? 0;
      if (i >= body.capacity) {
        this.growKind(e.kind);
        continue; // re-synced next frame at the new capacity
      }
      used.set(e.kind, i + 1);

      // transform: position + facing yaw + wobble scale
      let yaw = 0;
      if (e.pathIndex < e.path.length) {
        const wp = e.path[e.pathIndex];
        const dx = wp.c + 0.5 - e.x;
        const dz = wp.r + 0.5 - e.z;
        if (dx * dx + dz * dz > 0.0001) yaw = -Math.atan2(dz, dx);
      }
      let sx = 1, sy = 1, sz = 1;
      if (e.kind === 'regen' || e.kind === 'swarm') {
        const w = 1 + Math.sin(this.time * 7 + e.id) * 0.08;
        sx = w; sy = 2 - w; sz = w;
      }
      _q.setFromAxisAngle(Y_AXIS, yaw);
      _p.set(e.x, 0, e.z);
      _s.set(sx, sy, sz);
      _m.compose(_p, _q, _s);

      // tint: base -> slow lerp -> hit-flash whiten -> regen pulse
      const slowAmt = e.isSlowed ? 0.45 * e.slowFactor : 0;
      const flash = e.hitFlash > 0 ? Math.min(1, e.hitFlash / 0.12) : 0;
      const regenPulse = e.isRegenerating ? 0.35 + Math.sin(this.time * 6) * 0.25 : 0;
      _c.copy(body.baseTint);
      if (slowAmt > 0) _c.lerp(SLOW_TINT, slowAmt);
      if (flash > 0) _c.lerp(WHITE, flash * 0.85);
      if (regenPulse > 0) _c.lerp(REGEN_TINT, regenPulse * 0.55);

      for (const im of body.meshes) {
        im.setMatrixAt(i, _m);
        im.setColorAt(i, _c);
      }
    }

    for (const [kind, n] of used) {
      const body = this.bodies.get(kind)!;
      for (const im of body.meshes) {
        im.count = n;
        im.instanceMatrix.needsUpdate = true;
        if (im.instanceColor) im.instanceColor.needsUpdate = true;
      }
    }
    // kinds with zero live enemies
    for (const kind of KINDS) {
      if (!used.has(kind)) {
        for (const im of this.bodies.get(kind)!.meshes) im.count = 0;
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

  addTo(scene: THREE.Scene): void {
    scene.add(this.group);
  }
}
