// Terrain: ground with procedural grass texture, rock boulders (instanced),
// animated water, spawn portal, base fortress + HP ring.

import * as THREE from 'three';
import { BASE, COLS, ROWS, SPAWN, TERRAIN_CELLS } from '../core/defs';
import type { Game } from '../core/game';
import { T_BASE, T_ROCK, T_SPAWN, T_WATER } from '../core/types';
import { modelManager, cloneModel } from './models';

const CELL = 32; // texture px per cell

function makeGrassTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = COLS * CELL;
  canvas.height = ROWS * CELL;
  const ctx = canvas.getContext('2d')!;

  // base grass with per-cell variation
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const t = terrainAt(c, r);
      let base: string;
      if (t === T_WATER) base = '#1d3a4d'; // lake bed under water
      else if (t === T_ROCK) base = '#4a4a44';
      else if (t === T_SPAWN) base = '#2c2438';
      else if (t === T_BASE) base = '#57534a';
      else base = (c + r) % 2 === 0 ? '#41583a' : '#3d5437';
      ctx.fillStyle = base;
      ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
    }
  }
  // speckle noise on grass
  for (let i = 0; i < 2600; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const c = Math.floor(x / CELL);
    const r = Math.floor(y / CELL);
    const t = terrainAt(c, r);
    if (t === T_WATER || t === T_ROCK) continue;
    ctx.fillStyle = Math.random() < 0.5 ? 'rgba(255,255,255,0.045)' : 'rgba(0,0,0,0.06)';
    ctx.fillRect(x, y, 2, 2);
  }
  // subtle grid lines
  ctx.strokeStyle = 'rgba(0,0,0,0.14)';
  ctx.lineWidth = 1;
  for (let c = 0; c <= COLS; c++) {
    ctx.beginPath();
    ctx.moveTo(c * CELL + 0.5, 0);
    ctx.lineTo(c * CELL + 0.5, canvas.height);
    ctx.stroke();
  }
  for (let r = 0; r <= ROWS; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * CELL + 0.5);
    ctx.lineTo(canvas.width, r * CELL + 0.5);
    ctx.stroke();
  }
  // spawn pad glow
  const sc = center(SPAWN.c, SPAWN.r);
  const grad = ctx.createRadialGradient(sc.x, sc.y, 2, sc.x, sc.y, CELL * 0.7);
  grad.addColorStop(0, 'rgba(176,107,255,0.75)');
  grad.addColorStop(1, 'rgba(176,107,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(sc.x - CELL, sc.y - CELL, CELL * 2, CELL * 2);
  // base pad
  const bc = center(BASE.c, BASE.r);
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.beginPath();
  ctx.arc(bc.x, bc.y, CELL * 0.72, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function terrainAt(c: number, r: number): number {
  for (const cell of TERRAIN_CELLS) {
    if (cell.c === c && cell.r === r) return cell.t;
  }
  if (c === SPAWN.c && r === SPAWN.r) return T_SPAWN;
  if (c === BASE.c && r === BASE.r) return T_BASE;
  return 0;
}

function center(c: number, r: number): { x: number; y: number } {
  return { x: (c + 0.5) * CELL, y: (r + 0.5) * CELL };
}

function makeWaterTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#2e6f95';
  ctx.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 40; i++) {
    ctx.strokeStyle = `rgba(255,255,255,${0.04 + Math.random() * 0.08})`;
    ctx.lineWidth = 1 + Math.random() * 1.5;
    ctx.beginPath();
    const y = Math.random() * 128;
    ctx.moveTo(0, y);
    for (let x = 0; x <= 128; x += 16) {
      ctx.lineTo(x, y + Math.sin(x * 0.08 + i) * 3);
    }
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function makePortalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
  grad.addColorStop(0, 'rgba(230,200,255,0.95)');
  grad.addColorStop(0.4, 'rgba(176,107,255,0.7)');
  grad.addColorStop(0.8, 'rgba(90,40,160,0.35)');
  grad.addColorStop(1, 'rgba(40,10,80,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  // swirl arms
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  for (let a = 0; a < 3; a++) {
    ctx.beginPath();
    for (let t = 0; t < 1; t += 0.02) {
      const ang = a * (Math.PI * 2 / 3) + t * 4.5;
      const rad = t * 58;
      const x = 64 + Math.cos(ang) * rad;
      const y = 64 + Math.sin(ang) * rad;
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export class Terrain {
  private readonly group = new THREE.Group();
  private readonly waterMat: THREE.MeshStandardMaterial;
  private readonly portalDisc: THREE.Mesh;
  private readonly portalRing: THREE.Mesh;
  private baseGroup: THREE.Group;
  private baseIsGLTF = false;
  private rocks: THREE.Object3D;
  private rocksIsGLTF = false;
  private readonly baseFlashLight: THREE.PointLight;
  private hpRing: THREE.Mesh | null = null;
  private hpRingFrac = -1;
  private time = 0;

  constructor() {
    // ground
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(COLS, ROWS),
      new THREE.MeshStandardMaterial({ map: makeGrassTexture(), roughness: 1, metalness: 0 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(COLS / 2, 0, ROWS / 2);
    ground.receiveShadow = true;
    this.group.add(ground);

    // water (one merged mesh for all water cells)
    const waterCells = TERRAIN_CELLS.filter((c) => c.t === T_WATER);
    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    waterCells.forEach((cell, i) => {
      const x0 = cell.c;
      const z0 = cell.r;
      positions.push(x0, 0.02, z0, x0 + 1, 0.02, z0, x0 + 1, 0.02, z0 + 1, x0, 0.02, z0 + 1);
      uvs.push(0, 0, 1, 0, 1, 1, 0, 1);
      indices.push(i * 4, i * 4 + 1, i * 4 + 2, i * 4, i * 4 + 2, i * 4 + 3);
    });
    const waterGeo = new THREE.BufferGeometry();
    waterGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    waterGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    waterGeo.setIndex(indices);
    waterGeo.computeVertexNormals();
    this.waterMat = new THREE.MeshStandardMaterial({
      map: makeWaterTexture(),
      roughness: 0.25,
      metalness: 0.1,
      transparent: true,
      opacity: 0.92,
      emissive: new THREE.Color('#1a4a66'),
      emissiveIntensity: 0.25,
    });
    this.waterMat.map!.repeat.set(2, 2);
    const water = new THREE.Mesh(waterGeo, this.waterMat);
    this.group.add(water);

    // rocks: instanced boulders, 3 per rock cell
    const rockCells = TERRAIN_CELLS.filter((c) => c.t === T_ROCK);
    const rockGeo = new THREE.DodecahedronGeometry(0.34, 0);
    const rockMat = new THREE.MeshStandardMaterial({ color: '#7a7468', roughness: 0.95, metalness: 0.05 });
    const rocks = new THREE.InstancedMesh(rockGeo, rockMat, rockCells.length * 3);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const eul = new THREE.Euler();
    let ri = 0;
    for (const cell of rockCells) {
      for (let i = 0; i < 3; i++) {
        const ox = (Math.random() - 0.5) * 0.55;
        const oz = (Math.random() - 0.5) * 0.55;
        const s = 0.55 + Math.random() * 0.75;
        eul.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        q.setFromEuler(eul);
        m.compose(
          new THREE.Vector3(cell.c + 0.5 + ox, 0.12 * s, cell.r + 0.5 + oz),
          q,
          new THREE.Vector3(s, s * (0.7 + Math.random() * 0.4), s),
        );
        rocks.setMatrixAt(ri++, m);
      }
    }
    rocks.instanceMatrix.needsUpdate = true;
    rocks.castShadow = true;
    rocks.receiveShadow = true;
    this.rocks = rocks;
    this.rocksIsGLTF = false;
    this.group.add(rocks);

    // spawn portal at (0.5, 8.5): vertical ring facing +x
    const portal = new THREE.Group();
    portal.position.set(SPAWN.c + 0.5, 0, SPAWN.r + 0.5);
    const ringMat = new THREE.MeshStandardMaterial({
      color: '#3a2a55',
      roughness: 0.4,
      metalness: 0.6,
      emissive: new THREE.Color('#b06bff'),
      emissiveIntensity: 0.9,
    });
    this.portalRing = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.09, 12, 32), ringMat);
    this.portalRing.rotation.y = Math.PI / 2; // face +x
    this.portalRing.position.y = 0.55;
    this.portalRing.castShadow = true;
    portal.add(this.portalRing);
    const discMat = new THREE.MeshBasicMaterial({
      map: makePortalTexture(),
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    this.portalDisc = new THREE.Mesh(new THREE.CircleGeometry(0.42, 32), discMat);
    this.portalDisc.rotation.y = Math.PI / 2;
    this.portalDisc.position.y = 0.55;
    portal.add(this.portalDisc);
    const portalLight = new THREE.PointLight('#b06bff', 2.2, 4, 1.8);
    portalLight.position.set(0, 0.6, 0);
    portal.add(portalLight);
    this.group.add(portal);

    // base fortress at (23.5, 8.5)
    this.baseGroup = this.buildBase();
    this.baseIsGLTF = false;
    this.group.add(this.baseGroup);
    this.baseFlashLight = new THREE.PointLight('#ff3344', 0, 5, 1.5);
    this.baseFlashLight.position.set(BASE.c + 0.5, 1.2, BASE.r + 0.5);
    this.group.add(this.baseFlashLight);

    // Tier-2 upgrades: swap in realistic GLTF base + rocks when they load.
    modelManager.onLoaded('base', () => this.swapBase());
    modelManager.onLoaded('rock', () => this.swapRocks());
  }

  /** Replace the procedural base fortress with the loaded GLTF castle. */
  private swapBase(): void {
    const model = modelManager.get('base');
    if (!model || this.baseIsGLTF) return;
    this.group.remove(this.baseGroup);
    this.baseGroup.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.geometry.dispose();
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const mat of mats) mat.dispose();
      }
    });
    const castle = cloneModel(model.object, false);
    castle.position.set(BASE.c + 0.5, 0, BASE.r + 0.5);
    this.baseGroup = castle;
    this.baseIsGLTF = true;
    this.group.add(castle);
    // force HP ring rebuild on the new base group
    this.hpRing = null;
    this.hpRingFrac = -1;
  }

  /** Replace procedural instanced rocks with loaded GLTF boulders. */
  private swapRocks(): void {
    const model = modelManager.get('rock');
    if (!model || this.rocksIsGLTF) return;
    this.group.remove(this.rocks);
    if (!this.rocksIsGLTF) {
      // procedural instanced rocks own their geometry/material
      const inst = this.rocks as THREE.InstancedMesh;
      inst.geometry.dispose();
      (inst.material as THREE.Material).dispose();
    }
    const rockCells = TERRAIN_CELLS.filter((c) => c.t === T_ROCK);
    const rocks = new THREE.Group();
    let seed = 12345;
    const rand = () => {
      // deterministic pseudo-random so rock layout is stable across swaps
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    for (const cell of rockCells) {
      for (let i = 0; i < 2; i++) {
        const rock = cloneModel(model.object, false);
        const ox = (rand() - 0.5) * 0.5;
        const oz = (rand() - 0.5) * 0.5;
        const s = 0.6 + rand() * 0.7;
        rock.position.set(cell.c + 0.5 + ox, 0, cell.r + 0.5 + oz);
        rock.rotation.y = rand() * Math.PI * 2;
        rock.scale.setScalar(s);
        rocks.add(rock);
      }
    }
    this.rocks = rocks;
    this.rocksIsGLTF = true;
    this.group.add(rocks);
  }

  private buildBase(): THREE.Group {
    const g = new THREE.Group();
    g.position.set(BASE.c + 0.5, 0, BASE.r + 0.5);
    const stone = new THREE.MeshStandardMaterial({ color: '#8d8577', roughness: 0.9, metalness: 0.05 });
    const stoneDark = new THREE.MeshStandardMaterial({ color: '#6d665a', roughness: 0.95 });
    const roofMat = new THREE.MeshStandardMaterial({ color: '#a33b3b', roughness: 0.8 });

    const keep = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.85, 0.62), stone);
    keep.position.y = 0.425;
    keep.castShadow = true;
    g.add(keep);

    for (const [dx, dz] of [[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]] as const) {
      const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 1.05, 8), stoneDark);
      tower.position.set(dx, 0.525, dz);
      tower.castShadow = true;
      g.add(tower);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.3, 8), roofMat);
      roof.position.set(dx, 1.2, dz);
      roof.castShadow = true;
      g.add(roof);
    }
    // flag
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.55, 6), stoneDark);
    pole.position.y = 1.12;
    g.add(pole);
    const flag = new THREE.Mesh(
      new THREE.PlaneGeometry(0.26, 0.16),
      new THREE.MeshStandardMaterial({ color: '#e04444', roughness: 0.7, side: THREE.DoubleSide }),
    );
    flag.position.set(0.13, 1.3, 0);
    flag.name = 'flag';
    g.add(flag);
    return g;
  }

  /** Base HP ring: 3D arc on the ground around the base. */
  private updateHpRing(frac: number): void {
    if (Math.abs(frac - this.hpRingFrac) < 0.02 && this.hpRing) return;
    this.hpRingFrac = frac;
    if (this.hpRing) {
      this.baseGroup.remove(this.hpRing);
      this.hpRing.geometry.dispose();
      (this.hpRing.material as THREE.Material).dispose();
      this.hpRing = null;
    }
    if (frac <= 0) return;
    // The GLTF castle is wider than the procedural fortress, so use a bigger ring.
    const [r0, r1] = this.baseIsGLTF ? [1.0, 1.22] : [0.72, 0.88];
    const geo = new THREE.RingGeometry(r0, r1, 48, 1, -Math.PI / 2, Math.PI * 2 * Math.min(1, frac));
    const color = new THREE.Color().setHSL(0.33 * frac, 0.85, 0.5);
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(geo, mat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.04;
    this.baseGroup.add(ring);
    this.hpRing = ring;
  }

  update(dt: number, game: Game): void {
    this.time += dt;
    // water shimmer
    const off = this.waterMat.map!;
    off.offset.x += dt * 0.02;
    off.offset.y += dt * 0.013;
    // portal spin
    this.portalDisc.rotation.z -= dt * 1.6;
    const pulse = 0.75 + Math.sin(this.time * 2.2) * 0.25;
    (this.portalRing.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
    // base flag wave
    const flag = this.baseGroup.getObjectByName('flag');
    if (flag) flag.rotation.y = Math.sin(this.time * 3) * 0.35;
    // base hit flash
    this.baseFlashLight.intensity = game.baseFlash * 3;
    // HP ring
    this.updateHpRing(game.maxBaseHp > 0 ? game.baseHp / game.maxBaseHp : 0);
  }

  addTo(scene: THREE.Scene): void {
    scene.add(this.group);
  }
}
