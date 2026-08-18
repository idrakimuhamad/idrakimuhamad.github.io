// Tower 3D sync: keeps a mesh per tower (cloned from the kind prototype),
// updates turret aim / muzzle flash / level pips, draws the selection range
// ring and the placement ghost with validity tint + range ring.

import * as THREE from 'three';
import { px2w, TOWERS } from '../core/defs';
import type { Game } from '../core/game';
import type { Tower } from '../core/tower';
import type { TowerKind } from '../core/types';
import { FLASH_COLOR, TOWER_BUILDERS, type TowerProto } from './towerModels';

interface TowerMesh {
  proto: TowerProto;
  ring: THREE.Line | null;
  ringRadius: number;
}

function makeRangeRing(radius: number, color: string, dashed: boolean): THREE.Line {
  const pts: THREE.Vector3[] = [];
  const N = 64;
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = dashed
    ? new THREE.LineDashedMaterial({ color, dashSize: 0.22, gapSize: 0.14, transparent: true, opacity: 0.9 })
    : new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.85 });
  const line = new THREE.Line(geo, mat);
  if (dashed) line.computeLineDistances();
  line.position.y = 0.05;
  return line;
}

export class Towers3D {
  private readonly group = new THREE.Group();
  private readonly meshes = new Map<number, TowerMesh>();
  private ghost: THREE.Group | null = null;
  private ghostRing: THREE.Line | null = null;
  private ghostQuad: THREE.Mesh | null = null;
  private ghostKind: TowerKind | null = null;
  private ghostValid: boolean | null = null;
  private readonly ghostMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.45, depthWrite: false });
  time = 0;

  constructor() {
    const quadGeo = new THREE.PlaneGeometry(1, 1);
    quadGeo.rotateX(-Math.PI / 2);
    this.ghostQuad = new THREE.Mesh(quadGeo, new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.25, depthWrite: false }));
    this.ghostQuad.position.y = 0.03;
    this.ghostQuad.visible = false;
    this.group.add(this.ghostQuad);
  }

  private ensure(tower: Tower): TowerMesh {
    let m = this.meshes.get(tower.id);
    if (!m) {
      const proto = TOWER_BUILDERS[tower.kind]();
      const mesh = proto.group;
      this.group.add(mesh);
      m = { proto, ring: null, ringRadius: 0 };
      this.meshes.set(tower.id, m);
    }
    return m;
  }

  private syncGhost(kind: TowerKind, valid: boolean): void {
    if (this.ghostKind !== kind || this.ghostValid !== valid) {
      this.ghostKind = kind;
      this.ghostValid = valid;
      if (this.ghost) {
        this.group.remove(this.ghost);
        this.ghost.traverse((o) => {
          if (o instanceof THREE.Mesh) o.geometry.dispose();
        });
      }
      const proto = TOWER_BUILDERS[kind]();
      proto.group.traverse((o) => {
        if (o instanceof THREE.Mesh) o.material = this.ghostMat;
      });
      this.ghostMat.color.set(valid ? '#3ddc84' : '#ff5c72');
      this.ghost = proto.group;
      this.group.add(this.ghost);
      if (this.ghostRing) {
        this.group.remove(this.ghostRing);
        this.ghostRing.geometry.dispose();
        (this.ghostRing.material as THREE.Material).dispose();
        this.ghostRing = null;
      }
      const range = px2w(TOWERS[kind].levels[0].range);
      this.ghostRing = makeRangeRing(range, valid ? '#3ddc84' : '#ff5c72', true);
      this.group.add(this.ghostRing);
    }
  }

  update(dt: number, game: Game): void {
    this.time += dt;
    const alive = new Set<number>();

    for (const tower of game.towers) {
      alive.add(tower.id);
      const m = this.ensure(tower);
      const g = m.proto.group;
      g.position.set(tower.x, 0, tower.z);
      const s = 1 + tower.level * 0.05;
      g.scale.set(s, s, s);
      // turret aims at tower.angle (0 = +x, CCW in x/z plane)
      m.proto.turret.rotation.y = -tower.angle;
      // muzzle flash
      const flashMat = m.proto.flash.material as THREE.MeshBasicMaterial;
      flashMat.opacity = Math.min(1, tower.flash / 0.08);
      flashMat.color.set(FLASH_COLOR[tower.kind]);
      m.proto.flash.scale.setScalar(0.6 + Math.min(1, tower.flash / 0.08) * 0.8);
      // frost crystal spin
      if (m.proto.spin) m.proto.spin.rotation.y += dt * 1.5;
      // level pips
      for (let i = 0; i < m.proto.pips.length; i++) m.proto.pips[i].visible = tower.level > i;
      // selection ring
      const selected = game.selectedTower?.id === tower.id;
      const radius = px2w(tower.L.range);
      if (selected) {
        if (!m.ring || Math.abs(m.ringRadius - radius) > 0.01) {
          if (m.ring) {
            m.ring.geometry.dispose();
            (m.ring.material as THREE.Material).dispose();
          }
          m.ring = makeRangeRing(radius, '#ffd23c', true);
          m.ringRadius = radius;
          g.add(m.ring);
        }
        m.ring.visible = true;
      } else if (m.ring) {
        m.ring.visible = false;
      }
    }

    // remove dead
    for (const [id, m] of this.meshes) {
      if (!alive.has(id)) {
        this.group.remove(m.proto.group);
        m.proto.group.traverse((o) => {
          if (o instanceof THREE.Mesh) o.geometry.dispose();
        });
        this.meshes.delete(id);
      }
    }

    // placement ghost
    const placing = game.placing;
    if (placing && game.hoverCell && game.mouse.inside) {
      const c = game.hoverCell;
      const valid = game.hoverValid;
      this.syncGhost(placing, valid);
      if (this.ghost) {
        this.ghost.visible = true;
        this.ghost.position.set(c.c + 0.5, 0, c.r + 0.5);
      }
      if (this.ghostRing) {
        this.ghostRing.visible = true;
        this.ghostRing.position.set(c.c + 0.5, 0.05, c.r + 0.5);
      }
      if (this.ghostQuad) {
        this.ghostQuad.visible = true;
        this.ghostQuad.position.set(c.c + 0.5, 0.03, c.r + 0.5);
        (this.ghostQuad.material as THREE.MeshBasicMaterial).color.set(valid ? '#3ddc84' : '#ff5c72');
      }
    } else {
      if (this.ghost) this.ghost.visible = false;
      if (this.ghostRing) this.ghostRing.visible = false;
      if (this.ghostQuad) this.ghostQuad.visible = false;
    }
  }

  addTo(scene: THREE.Scene): void {
    scene.add(this.group);
  }
}
