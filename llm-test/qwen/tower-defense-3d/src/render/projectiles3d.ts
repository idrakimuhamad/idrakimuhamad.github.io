// Projectile 3D meshes (one per kind) + optional trail line.

import * as THREE from 'three';
import type { Game } from '../core/game';
import type { Projectile } from '../core/projectile';
import type { ProjectileKind, SettingsStore } from '../core/types';

interface ProjMesh {
  mesh: THREE.Mesh;
  trail: THREE.Line;
  trailPositions: Float32Array;
  oriented: boolean; // meshes that should face their velocity
}

const TRAIL_LEN = 7;

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
  private readonly meshes = new Map<number, ProjMesh>();

  constructor(private readonly settings: SettingsStore) {}

  private ensure(p: Projectile): ProjMesh {
    let m = this.meshes.get(p.id);
    if (!m) {
      const mesh = buildMesh(p.kind);
      const trailPositions = new Float32Array(TRAIL_LEN * 3);
      const trailGeo = new THREE.BufferGeometry();
      trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
      const trail = new THREE.Line(
        trailGeo,
        new THREE.LineBasicMaterial({ color: p.color, transparent: true, opacity: 0.45 }),
      );
      trail.frustumCulled = false;
      this.group.add(mesh, trail);
      m = { mesh, trail, trailPositions, oriented: p.kind === 'bullet' || p.kind === 'sniper' || p.kind === 'missile' };
      this.meshes.set(p.id, m);
    }
    return m;
  }

  update(dt: number, game: Game): void {
    const alive = new Set<number>();
    const showTrails = this.settings.data.projectileTrails;

    for (const p of game.projectiles) {
      if (!p.alive) continue;
      alive.add(p.id);
      const m = this.ensure(p);
      m.mesh.position.set(p.x, 0.5, p.z);

      if (m.oriented) {
        tmpDir.set(p.vx, 0, p.vz);
        if (tmpDir.lengthSq() > 0.0001) {
          tmpDir.normalize();
          tmpQuat.setFromUnitVectors(X_AXIS, tmpDir);
          m.mesh.quaternion.copy(tmpQuat);
        }
      }

      m.trail.visible = showTrails && p.trail.length > 0;
      if (m.trail.visible) {
        const n = p.trail.length;
        for (let i = 0; i < TRAIL_LEN; i++) {
          const t = i < n ? p.trail[i] : { x: p.x, z: p.z };
          m.trailPositions[i * 3] = t.x;
          m.trailPositions[i * 3 + 1] = 0.5;
          m.trailPositions[i * 3 + 2] = t.z;
        }
        (m.trail.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
      }
    }

    for (const [id, m] of this.meshes) {
      if (!alive.has(id)) {
        this.group.remove(m.mesh, m.trail);
        m.mesh.geometry.dispose();
        (m.mesh.material as THREE.Material).dispose();
        m.trail.geometry.dispose();
        (m.trail.material as THREE.Material).dispose();
        this.meshes.delete(id);
      }
    }
  }

  addTo(scene: THREE.Scene): void {
    scene.add(this.group);
  }
}
