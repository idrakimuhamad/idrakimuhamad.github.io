// Tower 3D model builders (Tier 1 procedural): base + rotating turret +
// muzzle flash + level pips. One prototype per kind; meshes clone it.

import * as THREE from 'three';
import { TOWERS } from '../core/defs';
import type { TowerKind } from '../core/types';
import { cloneModel, type NormalizedModel } from './models';

export const FLASH_COLOR: Record<TowerKind, string> = {
  cannon: '#ffcc66',
  mg: '#ffffff',
  sniper: '#9fefff',
  frost: '#bfefff',
  missile: '#d0b3ff',
};

const STONE = '#8d8577';
const STONE_DARK = '#6d665a';
const METAL = '#4a4f57';

function std(color: string, opts: Partial<THREE.MeshStandardMaterialParameters> = {}): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.15, ...opts });
}

export interface TowerProto {
  group: THREE.Group;
  turret: THREE.Object3D;
  flash: THREE.Mesh;
  pips: THREE.Mesh[];
  spin?: THREE.Object3D; // frost crystal
}

function makeFlash(parent: THREE.Object3D, x: number, y: number, z: number): THREE.Mesh {
  const flash = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 8, 6),
    new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, depthWrite: false }),
  );
  flash.position.set(x, y, z);
  parent.add(flash);
  return flash;
}

function makePips(g: THREE.Group): THREE.Mesh[] {
  const pips: THREE.Mesh[] = [];
  const pipMat = std('#ffd23c', { emissive: new THREE.Color('#b8860b'), emissiveIntensity: 0.4, roughness: 0.4, metalness: 0.5 });
  for (let i = 0; i < 3; i++) {
    const pip = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.05, 0.05), pipMat);
    pip.position.set(-0.14 + i * 0.14, 0.09, 0.4);
    pip.visible = false;
    g.add(pip);
    pips.push(pip);
  }
  return pips;
}

function buildCannon(): TowerProto {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.4, 0.28, 12), std(STONE));
  base.position.y = 0.14;
  base.castShadow = true;
  g.add(base);
  const turret = new THREE.Group();
  turret.position.y = 0.28;
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.26, 0.36), std(TOWERS.cannon.color, { roughness: 0.5, metalness: 0.3 }));
  body.castShadow = true;
  turret.add(body);
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.55, 10), std(METAL, { roughness: 0.4, metalness: 0.6 }));
  barrel.rotation.z = -Math.PI / 2;
  barrel.position.set(0.42, 0.08, 0);
  barrel.castShadow = true;
  turret.add(barrel);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.115, 10, 8), std(METAL, { roughness: 0.4, metalness: 0.6 }));
  tip.position.set(0.68, 0.08, 0);
  turret.add(tip);
  g.add(turret);
  return { group: g, turret, flash: makeFlash(turret, 0.78, 0.08, 0), pips: makePips(g) };
}

function buildMg(): TowerProto {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.36, 0.24, 12), std(STONE));
  base.position.y = 0.12;
  base.castShadow = true;
  g.add(base);
  const turret = new THREE.Group();
  turret.position.y = 0.24;
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.22, 0.32), std(TOWERS.mg.color, { roughness: 0.45, metalness: 0.5 }));
  body.castShadow = true;
  turret.add(body);
  for (const dz of [-0.08, 0.08]) {
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.5, 8), std(METAL, { roughness: 0.35, metalness: 0.7 }));
    barrel.rotation.z = -Math.PI / 2;
    barrel.position.set(0.4, 0.04, dz);
    turret.add(barrel);
  }
  g.add(turret);
  return { group: g, turret, flash: makeFlash(turret, 0.62, 0.04, -0.08), pips: makePips(g) };
}

function buildSniper(): TowerProto {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.2, 12), std(STONE));
  base.position.y = 0.1;
  base.castShadow = true;
  g.add(base);
  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 0.34, 8), std(STONE_DARK));
  column.position.y = 0.34;
  column.castShadow = true;
  g.add(column);
  const turret = new THREE.Group();
  turret.position.y = 0.5;
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.26), std(TOWERS.sniper.color, { roughness: 0.4, metalness: 0.4 }));
  body.castShadow = true;
  turret.add(body);
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.95, 8), std(METAL, { roughness: 0.3, metalness: 0.7 }));
  barrel.rotation.z = -Math.PI / 2;
  barrel.position.set(0.55, 0.02, 0);
  barrel.castShadow = true;
  turret.add(barrel);
  const scope = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.16, 8), std(METAL));
  scope.rotation.z = -Math.PI / 2;
  scope.position.set(0.1, 0.14, 0);
  turret.add(scope);
  g.add(turret);
  return { group: g, turret, flash: makeFlash(turret, 1.02, 0.02, 0), pips: makePips(g) };
}

function buildFrost(): TowerProto {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.38, 0.26, 12), std(STONE));
  base.position.y = 0.13;
  base.castShadow = true;
  g.add(base);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.22, 0.04, 8, 16),
    std(TOWERS.frost.color, { emissive: new THREE.Color(TOWERS.frost.color), emissiveIntensity: 0.5, roughness: 0.3 }),
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.3;
  g.add(ring);
  const spin = new THREE.Group();
  spin.position.y = 0.62;
  const crystal = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.26, 0),
    new THREE.MeshStandardMaterial({
      color: TOWERS.frost.color,
      roughness: 0.15,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85,
      emissive: new THREE.Color('#3a9fd4'),
      emissiveIntensity: 0.7,
      flatShading: true,
    }),
  );
  crystal.castShadow = true;
  spin.add(crystal);
  g.add(spin);
  const flash = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 8, 6),
    new THREE.MeshBasicMaterial({ color: FLASH_COLOR.frost, transparent: true, opacity: 0, depthWrite: false }),
  );
  flash.position.y = 0.62;
  g.add(flash);
  return { group: g, turret: spin, flash, pips: makePips(g), spin };
}

function buildMissile(): TowerProto {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.42, 0.24, 12), std(STONE));
  base.position.y = 0.12;
  base.castShadow = true;
  g.add(base);
  const turret = new THREE.Group();
  turret.position.y = 0.24;
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.24, 0.44), std(TOWERS.missile.color, { roughness: 0.5, metalness: 0.35 }));
  body.castShadow = true;
  turret.add(body);
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2 + Math.PI / 4;
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.42, 8), std(METAL, { roughness: 0.4, metalness: 0.6 }));
    tube.position.set(Math.cos(a) * 0.16, 0.18, Math.sin(a) * 0.16);
    tube.rotation.set(Math.sin(a) * 0.6, 0, -Math.cos(a) * 0.6);
    tube.castShadow = true;
    turret.add(tube);
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.12, 8), std('#d09bff'));
    nose.position.set(Math.cos(a) * 0.24, 0.38, Math.sin(a) * 0.24);
    nose.rotation.set(Math.sin(a) * 0.6, 0, -Math.cos(a) * 0.6);
    turret.add(nose);
  }
  g.add(turret);
  return { group: g, turret, flash: makeFlash(turret, 0.3, 0.42, 0), pips: makePips(g) };
}

// Muzzle-flash anchor per kind, in the turret's local space (model is centered,
// ~0.82 units tall, facing +X). Tuned so the flash sits near the barrel/top.
const FLASH_POS: Record<TowerKind, [number, number, number]> = {
  cannon: [0.42, 0.5, 0],
  mg: [0.4, 0.42, 0],
  sniper: [0.45, 0.5, 0],
  frost: [0.0, 0.62, 0],
  missile: [0.3, 0.5, 0],
};

/** Build a TowerProto backed by a loaded (Tier-2) GLTF model. */
export function makeGLTFProto(kind: TowerKind, model: NormalizedModel): TowerProto {
  const g = new THREE.Group();
  const turret = new THREE.Group();
  g.add(turret);
  // Shared geometry; materials shared too (towers never tint the body).
  const body = cloneModel(model.object, false);
  turret.add(body);
  const [fx, fy, fz] = FLASH_POS[kind];
  const flash = makeFlash(turret, fx, fy, fz);
  return { group: g, turret, flash, pips: makePips(g) };
}

export const TOWER_BUILDERS: Record<TowerKind, () => TowerProto> = {
  cannon: buildCannon,
  mg: buildMg,
  sniper: buildSniper,
  frost: buildFrost,
  missile: buildMissile,
};
