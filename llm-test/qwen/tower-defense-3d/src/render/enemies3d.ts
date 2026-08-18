// Enemy 3D models (Tier 1 procedural) + per-enemy health bar sprite,
// hit flash (emissive), slow tint, and regen pulse.

import * as THREE from 'three';
import { ENEMIES } from '../core/defs';
import type { Enemy } from '../core/enemy';
import type { Game } from '../core/game';
import type { EnemyKind, SettingsStore } from '../core/types';
import { modelManager, cloneModel, type EnemyModelKey } from './models';

const ENEMY_MODEL_KEY: Record<EnemyKind, EnemyModelKey> = {
  basic: 'enemy_basic',
  runner: 'enemy_runner',
  tank: 'enemy_tank',
  swarm: 'enemy_swarm',
  armored: 'enemy_armored',
  regen: 'enemy_regen',
};

/** A tintable material on a GLTF body (cloned per enemy). */
interface TintMat {
  mat: THREE.MeshStandardMaterial;
  baseColor: THREE.Color;
  baseEmissive: THREE.Color;
}

interface EnemyMesh {
  group: THREE.Group;
  body: THREE.Object3D;
  isGLTF: boolean;
  // procedural-only tint state
  bodyMat?: THREE.MeshStandardMaterial;
  baseColor?: THREE.Color;
  // GLTF-only tint state
  gltfMats?: TintMat[];
  bar: THREE.Sprite;
  barCtx: CanvasRenderingContext2D;
  barTex: THREE.CanvasTexture;
  lastFrac: number;
}

function bodyFor(kind: EnemyKind): { geo: THREE.BufferGeometry; y: number } {
  switch (kind) {
    case 'basic':
      return { geo: new THREE.SphereGeometry(0.28, 16, 12), y: 0.24 };
    case 'runner':
      return { geo: new THREE.OctahedronGeometry(0.26, 0), y: 0.3 };
    case 'tank':
      return { geo: new THREE.BoxGeometry(0.5, 0.42, 0.5), y: 0.24 };
    case 'swarm':
      return { geo: new THREE.ConeGeometry(0.2, 0.42, 3), y: 0.24 };
    case 'armored':
      return { geo: new THREE.CylinderGeometry(0.27, 0.27, 0.3, 6), y: 0.2 };
    case 'regen':
      return { geo: new THREE.SphereGeometry(0.26, 12, 10), y: 0.26 };
  }
}

const SLOW_TINT = new THREE.Color('#6fd6ff');
const tmpColor = new THREE.Color();

/** Collect the (per-enemy cloned) standard materials of a GLTF body for tinting. */
function collectMats(body: THREE.Object3D): TintMat[] {
  const out: TintMat[] = [];
  body.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mats = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as THREE.MeshStandardMaterial[];
    for (const mat of mats) {
      if (!mat.color) continue;
      out.push({
        mat,
        baseColor: mat.color.clone(),
        baseEmissive: mat.emissive ? mat.emissive.clone() : new THREE.Color(0, 0, 0),
      });
    }
  });
  return out;
}

function makeBar(): { sprite: THREE.Sprite; ctx: CanvasRenderingContext2D; tex: THREE.CanvasTexture } {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 12;
  const ctx = canvas.getContext('2d')!;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  sprite.scale.set(0.62, 0.115, 1);
  sprite.position.y = 0.78;
  sprite.visible = false;
  return { sprite, ctx, tex };
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
  private readonly meshes = new Map<number, EnemyMesh>();
  private time = 0;

  constructor(private readonly settings: SettingsStore) {}

  private ensure(e: Enemy): EnemyMesh {
    let m = this.meshes.get(e.id);
    if (!m) {
      m = this.createEnemyMesh(e);
      this.meshes.set(e.id, m);
    }
    return m;
  }

  private createEnemyMesh(e: Enemy): EnemyMesh {
    const group = new THREE.Group();
    const bar = makeBar();
    group.add(bar.sprite);
    this.group.add(group);
    const key = ENEMY_MODEL_KEY[e.kind];
    const model = modelManager.get(key);
    const m: EnemyMesh = {
      group,
      body: null as unknown as THREE.Object3D,
      isGLTF: false,
      bar: bar.sprite,
      barCtx: bar.ctx,
      barTex: bar.tex,
      lastFrac: -1,
    };
    if (model) {
      this.applyGLTFBody(m, e, model.object);
    } else {
      this.applyProceduralBody(m, e);
      modelManager.onLoaded(key, () => {
        const cur = this.meshes.get(e.id);
        if (cur && !cur.isGLTF && e.alive) this.applyGLTFBody(cur, e, modelManager.get(key)!.object);
      });
    }
    return m;
  }

  private applyProceduralBody(m: EnemyMesh, e: Enemy): void {
    const { geo, y } = bodyFor(e.kind);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: ENEMIES[e.kind].color,
      roughness: 0.65,
      metalness: e.kind === 'armored' ? 0.55 : 0.1,
      flatShading: e.kind === 'runner' || e.kind === 'swarm',
    });
    const body = new THREE.Mesh(geo, bodyMat);
    body.position.y = y;
    body.castShadow = true;
    m.group.add(body);
    m.body = body;
    m.isGLTF = false;
    m.bodyMat = bodyMat;
    m.baseColor = new THREE.Color(ENEMIES[e.kind].color);
    m.gltfMats = undefined;
  }

  private applyGLTFBody(m: EnemyMesh, e: Enemy, modelObject: THREE.Object3D): void {
    // Remove previous body (procedural mesh or stale GLTF clone).
    if (m.body) {
      m.group.remove(m.body);
      if (!m.isGLTF) {
        (m.body as THREE.Mesh).geometry.dispose();
        (m.bodyMat as THREE.Material)?.dispose();
      } else if (m.gltfMats) {
        for (const t of m.gltfMats) t.mat.dispose();
      }
    }
    // Clone with per-enemy materials so tinting is independent.
    const body = cloneModel(modelObject, true);
    m.group.add(body);
    m.body = body;
    m.isGLTF = true;
    m.bodyMat = undefined;
    m.baseColor = undefined;
    m.gltfMats = collectMats(body);
  }

  update(dt: number, game: Game): void {
    this.time += dt;
    const alive = new Set<number>();
    const showBars = this.settings.data.healthBars;

    for (const e of game.enemies) {
      if (!e.alive) continue;
      alive.add(e.id);
      const m = this.ensure(e);
      m.group.position.set(e.x, 0, e.z);

      // face movement direction
      if (e.pathIndex < e.path.length) {
        const wp = e.path[e.pathIndex];
        const dx = wp.c + 0.5 - e.x;
        const dz = wp.r + 0.5 - e.z;
        if (dx * dx + dz * dz > 0.0001) {
          m.group.rotation.y = -Math.atan2(dz, dx);
        }
      }

      // hit flash + slow tint + regen pulse
      const slowAmt = e.isSlowed ? 0.45 * e.slowFactor : 0;
      let emissive = e.hitFlash > 0 ? Math.min(1, e.hitFlash / 0.12) * 1.4 : 0;
      if (e.isRegenerating) emissive = Math.max(emissive, 0.35 + Math.sin(this.time * 6) * 0.25);
      if (m.isGLTF && m.gltfMats) {
        for (const t of m.gltfMats) {
          if (slowAmt > 0) t.mat.color.copy(t.baseColor).lerp(SLOW_TINT, slowAmt);
          else t.mat.color.copy(t.baseColor);
          t.mat.emissive.copy(t.baseEmissive);
          if (emissive > 0) {
            t.mat.emissive.r = Math.min(1, t.mat.emissive.r + emissive);
            t.mat.emissive.g = Math.min(1, t.mat.emissive.g + emissive);
            t.mat.emissive.b = Math.min(1, t.mat.emissive.b + emissive);
          }
        }
      } else if (m.bodyMat && m.baseColor) {
        tmpColor.copy(m.baseColor);
        if (slowAmt > 0) tmpColor.lerp(SLOW_TINT, slowAmt);
        m.bodyMat.color.copy(tmpColor);
        m.bodyMat.emissive.setRGB(emissive, emissive, emissive);
      }

      // wobble for organic enemies
      if (e.kind === 'regen' || e.kind === 'swarm') {
        const w = 1 + Math.sin(this.time * 7 + e.id) * 0.08;
        m.body.scale.set(w, 2 - w, w);
      } else {
        m.body.scale.set(1, 1, 1);
      }

      // health bar
      const frac = e.hp / e.maxHp;
      const show = showBars && frac < 0.999;
      m.bar.visible = show;
      if (show && Math.abs(frac - m.lastFrac) > 0.02) {
        m.lastFrac = frac;
        drawBar(m.barCtx, m.barTex, frac);
      }
    }

    for (const [id, m] of this.meshes) {
      if (!alive.has(id)) {
        this.group.remove(m.group);
        if (m.isGLTF) {
          // Geometry is shared with the model cache — only dispose cloned mats.
          if (m.gltfMats) for (const t of m.gltfMats) t.mat.dispose();
        } else {
          (m.body as THREE.Mesh).geometry.dispose();
          m.bodyMat?.dispose();
        }
        m.barTex.dispose();
        (m.bar.material as THREE.Material).dispose();
        this.meshes.delete(id);
      }
    }
  }

  addTo(scene: THREE.Scene): void {
    scene.add(this.group);
  }
}
