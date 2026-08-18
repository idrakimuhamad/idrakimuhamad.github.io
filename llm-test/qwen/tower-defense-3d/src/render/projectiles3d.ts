// Projectile 3D rendering (Phase 5: pooled). Meshes + trail lines are
// pre-allocated per projectile kind and recycled — no geometry/material
// creation or disposal during gameplay.

import * as THREE from 'three';
import type { Game } from '../core/game';
import type { Projectile } from '../core/projectile';
import type { ProjectileKind, SettingsStore } from '../core/types';

const TRAIL_LEN = 7;

/** Pool sizes: generous worst-case concurrency per kind (see game.fire). */
const POOL_SIZE: Record<ProjectileKind, number> = {
  shell: 24, bullet: 48, sniper: 12, frost: 24, missile: 12,
};

/** Trail color per kind (matches the projectile colors in Game.fire). */
const KIND_COLOR: Record<ProjectileKind, string> = {
  shell: '#ffb066', bullet: '#e8eefc', sniper: '#7fe9ff', frost: '#bfefff', missile: '#d09bff',
};

const ORIENTED: Record<ProjectileKind, boolean> = {
  shell: false, bullet: true, sniper: true, frost: false, missile: true,
};

interface Entry {
  mesh: THREE.Mesh;
  trail: THREE.Line;
  trailPos: Float32Array;
}

interface Pool {
  entries: Entry[];
  free: number[];
}

function buildMesh(kind: ProjectileKind): THREE.Mesh {
  const emissive = (c: string, i: number) => ({
    color: c,
    emissive: new THREE.Color(c),
    emissiveIntensity: i,
    roughness: 0.4,
    metalness: 0.2,
  });
  switch (kind) {
    case 'shell':
      return new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), new THREE.MeshStandardMaterial(emissive('#ff9944', 0.9)));
    case 'bullet':
      return new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), new THREE.MeshStandardMaterial(emissive('#ffe9a3', 1.2)));
    case 'sniper':
      return new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 6), new THREE.MeshStandardMaterial(emissive('#7fe7ff', 1.4)));
    case 'frost':
      return new THREE.Mesh(new THREE.IcosahedronGeometry(0.09, 0), new THREE.MeshStandardMaterial(emissive('#bfefff', 1.2)));
    case 'missile':
      return new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.3, 8), new THREE.MeshStandardMaterial(emissive('#d09bff', 1.1)));
  }
}

const X_AXIS = new THREE.Vector3(1, 0, 0);
const tmpDir = new THREE.Vector3();
const tmpQuat = new THREE.Quaternion();

export class Projectiles3D {
  private readonly group = new THREE.Group();
  private readonly pools = new Map<ProjectileKind, Pool>();
  private readonly active = new Map<number, { kind: ProjectileKind; idx: number }>();

  constructor(private readonly settings: SettingsStore) {
    for (const kind of Object.keys(POOL_SIZE) as ProjectileKind[]) {
      const pool: Pool = { entries: [], free: [] };
      for (let i = 0; i < POOL_SIZE[kind]; i++) {
        pool.entries.push(this.makeEntry(kind));
        pool.free.push(i);
      }
      this.pools.set(kind, pool);
    }
  }

  private makeEntry(kind: ProjectileKind): Entry {
    const mesh = buildMesh(kind);
    mesh.visible = false;
    const trailPos = new Float32Array(TRAIL_LEN * 3);
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
    const trail = new THREE.Line(
      trailGeo,
      new THREE.LineBasicMaterial({ color: KIND_COLOR[kind], transparent: true, opacity: 0.45 }),
    );
    trail.frustumCulled = false;
    trail.visible = false;
    this.group.add(mesh, trail);
    return { mesh, trail, trailPos };
  }

  /** Pool exhausted (beyond worst case): allocate one more entry. */
  private growPool(kind: ProjectileKind): number {
    const pool = this.pools.get(kind)!;
    pool.entries.push(this.makeEntry(kind));
    return pool.entries.length - 1;
  }

  update(dt: number, game: Game): void {
    const showTrails = this.settings.data.projectileTrails;
    const alive = new Set<number>();

    for (const p of game.projectiles) {
      if (!p.alive) continue;
      alive.add(p.id);
      let a = this.active.get(p.id);
      if (!a) {
        const pool = this.pools.get(p.kind)!;
        const idx = pool.free.pop() ?? this.growPool(p.kind);
        a = { kind: p.kind, idx };
        this.active.set(p.id, a);
      }
      const e = this.pools.get(p.kind)!.entries[a.idx];
      e.mesh.visible = true;
      e.mesh.position.set(p.x, 0.5, p.z);

      if (ORIENTED[p.kind]) {
        tmpDir.set(p.vx, 0, p.vz);
        if (tmpDir.lengthSq() > 0.0001) {
          tmpDir.normalize();
          tmpQuat.setFromUnitVectors(X_AXIS, tmpDir);
          e.mesh.quaternion.copy(tmpQuat);
        }
      }

      e.trail.visible = showTrails && p.trail.length > 0;
      if (e.trail.visible) {
        const n = p.trail.length;
        for (let i = 0; i < TRAIL_LEN; i++) {
          const t = i < n ? p.trail[i] : { x: p.x, z: p.z };
          e.trailPos[i * 3] = t.x;
          e.trailPos[i * 3 + 1] = 0.5;
          e.trailPos[i * 3 + 2] = t.z;
        }
        (e.trail.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
      }
    }

    // release dead projectiles back to their pools
    for (const [id, a] of this.active) {
      if (!alive.has(id)) {
        const e = this.pools.get(a.kind)!.entries[a.idx];
        e.mesh.visible = false;
        e.trail.visible = false;
        this.pools.get(a.kind)!.free.push(a.idx);
        this.active.delete(id);
      }
    }
  }

  addTo(scene: THREE.Scene): void {
    scene.add(this.group);
  }
}
