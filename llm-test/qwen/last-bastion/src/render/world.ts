import * as THREE from 'three';
import type { Arena, Pad } from '../core/arena';
import { makeGroundTexture, makeGlowTexture } from './textures';

export interface WorldRefs {
  portals: THREE.Group[];
  portalDiscs: THREE.Mesh[];
  bastion: THREE.Group;
  bastionCrystal: THREE.Mesh;
  bastionLight: THREE.PointLight;
  padRings: THREE.Mesh[];
  padDiscs: THREE.Mesh[];
  laneLines: THREE.Line[];
}

export function buildWorld(scene: THREE.Scene, arena: Arena, quality: 'low' | 'medium' | 'high'): WorldRefs {
  const glow = makeGlowTexture();

  // ---- ground ----
  const groundTex = makeGroundTexture(arena.lanes);
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(104, 104),
    new THREE.MeshStandardMaterial({ map: groundTex, roughness: 0.95, metalness: 0.05 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = quality !== 'low';
  scene.add(ground);

  // dark rim around arena
  const rim = new THREE.Mesh(
    new THREE.RingGeometry(50.5, 60, 64),
    new THREE.MeshBasicMaterial({ color: 0x05070c, side: THREE.DoubleSide }),
  );
  rim.rotation.x = -Math.PI / 2;
  rim.position.y = -0.02;
  scene.add(rim);

  // ---- environmental features ----
  const rockGeo = new THREE.DodecahedronGeometry(1, 0);
  const rockMat = new THREE.MeshStandardMaterial({ color: 0x39415a, roughness: 0.9, flatShading: true });
  const treeTrunkGeo = new THREE.CylinderGeometry(0.18, 0.26, 1.1, 6);
  const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3826, roughness: 1 });
  const treeTopGeo = new THREE.ConeGeometry(1.1, 2.2, 7);
  const treeTopMat = new THREE.MeshStandardMaterial({ color: 0x2c5a44, roughness: 0.9, flatShading: true });
  const ruinGeo = new THREE.BoxGeometry(1.4, 2.2, 1.4);
  const ruinMat = new THREE.MeshStandardMaterial({ color: 0x4a5470, roughness: 0.85, flatShading: true });
  const crystalGeo = new THREE.OctahedronGeometry(0.5, 0);
  const crystalMat = new THREE.MeshStandardMaterial({ color: 0x6b3fd8, emissive: 0x4b1fd8, emissiveIntensity: 0.9, roughness: 0.3 });

  for (const f of arena.features) {
    let mesh: THREE.Mesh;
    switch (f.kind) {
      case 'rock': mesh = new THREE.Mesh(rockGeo, rockMat); break;
      case 'tree': mesh = new THREE.Mesh(treeTopGeo, treeTopMat); break;
      case 'ruin': mesh = new THREE.Mesh(ruinGeo, ruinMat); break;
      case 'crystal': mesh = new THREE.Mesh(crystalGeo, crystalMat); break;
    }
    mesh.position.set(f.pos.x, 0, f.pos.z);
    mesh.rotation.y = f.rot;
    const s = f.scale;
    if (f.kind === 'tree') {
      const g = new THREE.Group();
      const trunk = new THREE.Mesh(treeTrunkGeo, treeTrunkMat);
      trunk.position.y = 0.55;
      const top = new THREE.Mesh(treeTopGeo, treeTopMat);
      top.position.y = 2.1;
      top.scale.setScalar(s);
      trunk.scale.setScalar(s);
      g.add(trunk, top);
      g.position.set(f.pos.x, 0, f.pos.z);
      g.rotation.y = f.rot;
      if (quality !== 'low') { top.castShadow = true; }
      scene.add(g);
      continue;
    }
    mesh.scale.setScalar(s);
    if (f.kind === 'crystal') {
      mesh.position.y = 0.5 * s;
      mesh.scale.set(s * 0.8, s * 1.3, s * 0.8);
    } else if (f.kind === 'ruin') {
      mesh.position.y = 1.1 * s;
      mesh.rotation.z = (Math.sin(f.rot * 3) * 0.12);
    } else {
      mesh.position.y = 0.35 * s;
      mesh.scale.set(s, s * 0.7, s);
    }
    if (quality !== 'low') mesh.castShadow = true;
    scene.add(mesh);
  }

  // ---- portals at lane starts ----
  const portals: THREE.Group[] = [];
  const portalDiscs: THREE.Mesh[] = [];
  const portalColors = [0x8a4fd8, 0x8a4fd8, 0x8a4fd8, 0xd84f9e, 0x4fd8b8];
  for (let i = 0; i < arena.lanes.length; i++) {
    const lane = arena.lanes[i];
    const p = lane.portal;
    const g = new THREE.Group();
    g.position.set(p.x, 0, p.z);
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(2.1, 0.28, 10, 28),
      new THREE.MeshStandardMaterial({ color: 0x2a2440, emissive: portalColors[i], emissiveIntensity: 0.7, roughness: 0.4 }),
    );
    torus.position.y = 2.2;
    g.add(torus);
    const disc = new THREE.Mesh(
      new THREE.CircleGeometry(1.85, 28),
      new THREE.MeshBasicMaterial({ color: portalColors[i], transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false }),
    );
    disc.position.y = 2.2;
    g.add(disc);
    portalDiscs.push(disc);
    // base stones
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(2.5, 2.9, 0.5, 10),
      new THREE.MeshStandardMaterial({ color: 0x333c55, roughness: 0.9, flatShading: true }),
    );
    base.position.y = 0.25;
    if (quality !== 'low') base.castShadow = true;
    g.add(base);
    // glow sprite
    const glowSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: portalColors[i], transparent: true, opacity: 0.5, depthWrite: false }));
    glowSpr.scale.setScalar(6);
    glowSpr.position.y = 2.2;
    g.add(glowSpr);
    scene.add(g);
    portals.push(g);
  }

  // ---- Bastion / Core ----
  const bastion = new THREE.Group();
  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(2.6, 3.2, 1.0, 8),
    new THREE.MeshStandardMaterial({ color: 0x3a4560, roughness: 0.8, flatShading: true }),
  );
  pedestal.position.y = 0.5;
  if (quality !== 'low') pedestal.castShadow = true;
  bastion.add(pedestal);
  const ring1 = new THREE.Mesh(
    new THREE.TorusGeometry(3.4, 0.12, 8, 40),
    new THREE.MeshStandardMaterial({ color: 0x2a3550, emissive: 0x2f88ff, emissiveIntensity: 0.5 }),
  );
  ring1.rotation.x = Math.PI / 2;
  ring1.position.y = 0.35;
  bastion.add(ring1);
  const crystal = new THREE.Mesh(
    new THREE.OctahedronGeometry(1.5, 0),
    new THREE.MeshStandardMaterial({ color: 0x9fe8ff, emissive: 0x3fd8ff, emissiveIntensity: 1.4, roughness: 0.15, metalness: 0.2 }),
  );
  crystal.position.y = 3.0;
  crystal.scale.set(1, 1.5, 1);
  if (quality !== 'low') crystal.castShadow = true;
  bastion.add(crystal);
  const bLight = new THREE.PointLight(0x4fd8ff, 30, 26, 1.8);
  bLight.position.y = 3.2;
  bastion.add(bLight);
  const bGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: 0x4fd8ff, transparent: true, opacity: 0.6, depthWrite: false }));
  bGlow.scale.setScalar(9);
  bGlow.position.y = 3;
  bastion.add(bGlow);
  // small orbiting shards
  for (let i = 0; i < 4; i++) {
    const shard = new THREE.Mesh(
      new THREE.TetrahedronGeometry(0.35, 0),
      new THREE.MeshStandardMaterial({ color: 0x8fd8ff, emissive: 0x3fa8ff, emissiveIntensity: 1 }),
    );
    shard.position.y = 3;
    bastion.add(shard);
  }
  scene.add(bastion);

  // ---- building pads ----
  const padRings: THREE.Mesh[] = [];
  const padDiscs: THREE.Mesh[] = [];
  const padRingGeo = new THREE.RingGeometry(1.05, 1.3, 24);
  const padDiscGeo = new THREE.CircleGeometry(1.05, 24);
  for (const pad of arena.pads) {
    const ring = new THREE.Mesh(padRingGeo, new THREE.MeshBasicMaterial({ color: 0x3f5f8f, transparent: true, opacity: 0.0, side: THREE.DoubleSide, depthWrite: false }));
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(pad.pos.x, 0.06, pad.pos.z);
    scene.add(ring);
    padRings.push(ring);
    const disc = new THREE.Mesh(padDiscGeo, new THREE.MeshBasicMaterial({ color: 0x2f4f7f, transparent: true, opacity: 0.0, side: THREE.DoubleSide, depthWrite: false }));
    disc.rotation.x = -Math.PI / 2;
    disc.position.set(pad.pos.x, 0.05, pad.pos.z);
    scene.add(disc);
    padDiscs.push(disc);
  }

  // ---- debug lane lines ----
  const laneLines: THREE.Line[] = [];
  for (const lane of arena.lanes) {
    const geo = new THREE.BufferGeometry().setFromPoints(lane.points.map((p) => new THREE.Vector3(p.x, 0.15, p.z)));
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.8 }));
    line.visible = false;
    scene.add(line);
    laneLines.push(line);
  }

  return { portals, portalDiscs, bastion, bastionCrystal: crystal, bastionLight: bLight, padRings, padDiscs, laneLines };
}
