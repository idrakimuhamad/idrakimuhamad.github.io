import * as THREE from 'three';
import { buildWorld, type WorldRefs } from './world';
import { makeGlowTexture, makeBarTexture, makeTextTexture } from './textures';
import type { GameState, FxEvent } from '../game/state';
import { ENEMIES, TOWERS, towerStats, ERAS, HAZARDS, BASTION_TIERS, EVOLUTIONS, ULTIMATE } from '../core/defs';
import type { EnemyKind, TowerKind, Vec3, TowerVariant } from '../core/types';
import type { Arena } from '../core/arena';
import { MAX_PARTICLES } from '../game/effects';

const ENEMY_KINDS: EnemyKind[] = ['crawler', 'wisp', 'brute', 'bulwark', 'shaman', 'colossus'];
const MAX_BARS = 96;
const MAX_TEXTS = 40;
const MAX_BEAMS = 24;
const MAX_PATCH_MESHES = 40;

export class Renderer {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera;
  world: WorldRefs;
  quality: 'low' | 'medium' | 'high' = 'high';

  private enemyMeshes = new Map<EnemyKind, THREE.InstancedMesh>();
  private bossGroup: THREE.Group;
  private playerGroup: THREE.Group;
  private towerGroups = new Map<number, THREE.Group>();
  private projMeshes = new Map<string, THREE.InstancedMesh>();
  private points!: THREE.Points;
  private pGeo!: THREE.BufferGeometry;
  private patchMeshes: THREE.Mesh[] = [];
  private beams: { line: THREE.Line; life: number; max: number }[] = [];
  private bars: { sprite: THREE.Sprite; ratio: number; tex: THREE.CanvasTexture }[] = [];
  private texts: { sprite: THREE.Sprite; life: number; max: number; tex: THREE.CanvasTexture }[] = [];
  private ghost: THREE.Group;
  private rangeRing: THREE.Mesh;
  private camPos = new THREE.Vector3(0, 27, 21);
  private camTarget = new THREE.Vector3(0, 0, 0);
  private shake = 0;
  private raycaster = new THREE.Raycaster();
  private groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private dummy = new THREE.Object3D();
  private tmpColor = new THREE.Color();
  private time = 0;
  private hoverPad = -1;
  private hoverValid = true;
  private buildSelection: TowerKind | null = null;
  private selectedTowerId = -1;
  private showRanges = false;
  private barCursor = 0;
  private textCursor = 0;
  private beamCursor = 0;
  private sharedGlow: THREE.CanvasTexture;
  private hemi!: THREE.HemisphereLight;
  private dir!: THREE.DirectionalLight;
  private zoomCur = 1;
  private shockwave: THREE.Mesh;
  private shockT = 0;      // >0 while expanding
  private hazardRing: THREE.Mesh;
  private playerLight: THREE.PointLight;
  private prevEra = -1;

  constructor(private canvas: HTMLCanvasElement, arena: Arena) {
    this.sharedGlow = makeGlowTexture();
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.camera = new THREE.PerspectiveCamera(46, 1, 0.1, 300);
    this.camera.position.copy(this.camPos);

    this.scene.background = new THREE.Color(0x0a0e18);
    this.scene.fog = new THREE.Fog(0x0a0e18, 60, 130);

    // lights
    this.hemi = new THREE.HemisphereLight(0x8fb4ff, 0x1a1426, 0.55);
    this.scene.add(this.hemi);
    this.dir = new THREE.DirectionalLight(0xfff2dd, 1.6);
    this.dir.position.set(28, 42, 18);
    this.dir.castShadow = true;
    this.dir.shadow.mapSize.set(2048, 2048);
    this.dir.shadow.camera.left = -55; this.dir.shadow.camera.right = 55;
    this.dir.shadow.camera.top = 55; this.dir.shadow.camera.bottom = -55;
    this.dir.shadow.camera.far = 120;
    this.dir.shadow.bias = -0.0004;
    this.scene.add(this.dir);

    this.world = buildWorld(this.scene, arena, this.quality);

    this.buildEnemyMeshes();
    this.bossGroup = this.buildBoss();
    this.scene.add(this.bossGroup);
    this.playerGroup = this.buildPlayer();
    this.scene.add(this.playerGroup);
    this.buildProjectileMeshes();
    this.buildParticles();
    this.buildPatches();
    this.buildBeams();
    this.buildBars();
    this.buildTexts();
    this.ghost = this.buildGhost();
    this.rangeRing = new THREE.Mesh(
      new THREE.RingGeometry(0.96, 1, 48),
      new THREE.MeshBasicMaterial({ color: 0x4fd8ff, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false }),
    );
    this.rangeRing.rotation.x = -Math.PI / 2;
    this.rangeRing.visible = false;
    this.scene.add(this.rangeRing);

    // Ultimate shockwave ring (expands on cast)
    this.shockwave = new THREE.Mesh(
      new THREE.RingGeometry(0.9, 1, 64),
      new THREE.MeshBasicMaterial({ color: 0xffd84f, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }),
    );
    this.shockwave.rotation.x = -Math.PI / 2;
    this.shockwave.position.y = 0.1;
    this.shockwave.visible = false;
    this.scene.add(this.shockwave);

    // Hazard telegraph ring
    this.hazardRing = new THREE.Mesh(
      new THREE.RingGeometry(0.85, 1, 48),
      new THREE.MeshBasicMaterial({ color: 0xb44fd8, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false }),
    );
    this.hazardRing.rotation.x = -Math.PI / 2;
    this.hazardRing.position.y = 0.12;
    this.hazardRing.visible = false;
    this.scene.add(this.hazardRing);

    // Player point light for dynamic local illumination
    this.playerLight = new THREE.PointLight(0x9fe8ff, 12, 12, 2);
    this.playerLight.position.y = 1.6;
    this.scene.add(this.playerLight);

    this.resize();
  }

  // ---------------- builders ----------------
  private buildEnemyMeshes() {
    const defs: [EnemyKind, THREE.BufferGeometry, THREE.MeshStandardMaterial][] = [
      ['crawler', new THREE.IcosahedronGeometry(0.55, 0), new THREE.MeshStandardMaterial({ color: 0x8a4fd8, roughness: 0.8, flatShading: true })],
      ['wisp', new THREE.SphereGeometry(0.42, 10, 8), new THREE.MeshStandardMaterial({ color: 0x54e8ff, emissive: 0x2fd8ff, emissiveIntensity: 1.2, roughness: 0.3 })],
      ['brute', new THREE.DodecahedronGeometry(0.95, 0), new THREE.MeshStandardMaterial({ color: 0xd84f5e, roughness: 0.85, flatShading: true })],
      ['bulwark', new THREE.BoxGeometry(1.5, 1.7, 1.1), new THREE.MeshStandardMaterial({ color: 0x9aa7b8, roughness: 0.6, metalness: 0.3, flatShading: true })],
      ['shaman', new THREE.ConeGeometry(0.55, 1.5, 6), new THREE.MeshStandardMaterial({ color: 0x6dff9e, emissive: 0x2fd86a, emissiveIntensity: 0.7, roughness: 0.5, flatShading: true })],
      ['colossus', new THREE.DodecahedronGeometry(1.5, 0), new THREE.MeshStandardMaterial({ color: 0xb44fd8, roughness: 0.7, flatShading: true })],
    ];
    for (const [kind, geo, mat] of defs) {
      const mesh = new THREE.InstancedMesh(geo, mat, 260);
      mesh.count = 0;
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      mesh.castShadow = this.quality !== 'low';
      mesh.frustumCulled = false;
      // init instance colors
      const c = new THREE.Color(ENEMIES[kind].color);
      for (let i = 0; i < 260; i++) mesh.setColorAt(i, c);
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      this.scene.add(mesh);
      this.enemyMeshes.set(kind, mesh);
    }
  }

  private buildBoss(): THREE.Group {
    const g = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.DodecahedronGeometry(2.4, 0),
      new THREE.MeshStandardMaterial({ color: 0x4a2a8a, emissive: 0x6b2fd8, emissiveIntensity: 0.5, roughness: 0.6, flatShading: true }),
    );
    body.position.y = 2.2;
    body.castShadow = true;
    g.add(body);
    const head = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.1, 0),
      new THREE.MeshStandardMaterial({ color: 0x6b3fd8, emissive: 0x8a4fd8, emissiveIntensity: 0.9, flatShading: true }),
    );
    head.position.set(0, 4.2, 1.2);
    g.add(head);
    // spikes
    for (let i = 0; i < 6; i++) {
      const spike = new THREE.Mesh(
        new THREE.ConeGeometry(0.35, 1.6, 5),
        new THREE.MeshStandardMaterial({ color: 0x8a4fd8, emissive: 0x4b1fd8, emissiveIntensity: 0.6, flatShading: true }),
      );
      const a = (i / 6) * Math.PI * 2;
      spike.position.set(Math.cos(a) * 2.2, 2.6, Math.sin(a) * 2.2);
      spike.lookAt(Math.cos(a) * 5, 3.4, Math.sin(a) * 5);
      spike.rotateX(Math.PI / 2);
      g.add(spike);
    }
    // shield shell
    const shield = new THREE.Mesh(
      new THREE.SphereGeometry(3.4, 16, 12),
      new THREE.MeshBasicMaterial({ color: 0x8fe8ff, transparent: true, opacity: 0.22, depthWrite: false }),
    );
    shield.position.y = 2.4;
    shield.visible = false;
    g.add(shield);
    (g as any).userData = { body, head, shield };
    g.visible = false;
    return g;
  }

  private buildPlayer(): THREE.Group {
    const g = new THREE.Group();
    const matBody = new THREE.MeshStandardMaterial({ color: 0x4a6a9f, roughness: 0.6, metalness: 0.2, flatShading: true });
    const matAccent = new THREE.MeshStandardMaterial({ color: 0x2f4f7f, roughness: 0.7, flatShading: true });
    const matGlow = new THREE.MeshStandardMaterial({ color: 0x9fe8ff, emissive: 0x4fd8ff, emissiveIntensity: 1.6, roughness: 0.3 });
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.5, 0.9, 7), matBody);
    torso.position.y = 1.05;
    torso.castShadow = true;
    g.add(torso);
    const head = new THREE.Mesh(new THREE.IcosahedronGeometry(0.32, 0), matBody);
    head.position.y = 1.75;
    g.add(head);
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.1, 0.2), matGlow);
    visor.position.set(0, 1.78, 0.2);
    g.add(visor);
    // pauldrons
    for (const s of [-1, 1]) {
      const pad = new THREE.Mesh(new THREE.IcosahedronGeometry(0.26, 0), matAccent);
      pad.position.set(s * 0.55, 1.42, 0);
      g.add(pad);
    }
    // weapon staff
    const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.7, 5), matAccent);
    staff.position.set(0.5, 1.1, 0.35);
    staff.rotation.z = -0.25;
    g.add(staff);
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), matGlow);
    orb.position.set(0.66, 1.92, 0.35);
    g.add(orb);
    // sword (auto basic attack)
    const sword = new THREE.Group();
    const matBlade = new THREE.MeshStandardMaterial({ color: 0xcfe0f0, roughness: 0.25, metalness: 0.85, flatShading: true });
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.09, 1.1, 0.025), matBlade);
    blade.position.y = 0.55;
    blade.castShadow = true;
    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.06, 0.09), matAccent);
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 0.3, 5), new THREE.MeshStandardMaterial({ color: 0x4a3826, roughness: 0.9, flatShading: true }));
    grip.position.y = -0.15;
    sword.add(blade, guard, grip);
    sword.position.set(0.62, 1.05, 0.25);
    sword.rotation.z = -0.5;
    g.add(sword);
    (g as any).userData = { orb, sword };
    return g;
  }

  private buildProjectileMeshes() {
    const defs: [string, THREE.BufferGeometry, THREE.MeshStandardMaterial][] = [
      ['bolt', new THREE.SphereGeometry(0.26, 8, 6), new THREE.MeshStandardMaterial({ color: 0x9fe8ff, emissive: 0x4fd8ff, emissiveIntensity: 2 })],
      ['lance', new THREE.ConeGeometry(0.3, 1.1, 6), new THREE.MeshStandardMaterial({ color: 0xffd84f, emissive: 0xff8c42, emissiveIntensity: 1.6 })],
      ['ember', new THREE.SphereGeometry(0.4, 8, 6), new THREE.MeshStandardMaterial({ color: 0xff8c42, emissive: 0xff4f1f, emissiveIntensity: 2 })],
      ['void', new THREE.SphereGeometry(0.5, 8, 6), new THREE.MeshStandardMaterial({ color: 0xb44fd8, emissive: 0x8a2fd8, emissiveIntensity: 2 })],
    ];
    for (const [kind, geo, mat] of defs) {
      const mesh = new THREE.InstancedMesh(geo, mat, 220);
      mesh.count = 0;
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      mesh.frustumCulled = false;
      this.scene.add(mesh);
      this.projMeshes.set(kind, mesh);
    }
  }

  private buildParticles() {
    this.pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(MAX_PARTICLES * 3);
    const col = new Float32Array(MAX_PARTICLES * 3);
    const size = new Float32Array(MAX_PARTICLES);
    this.pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
    this.pGeo.setAttribute('color', new THREE.BufferAttribute(col, 3).setUsage(THREE.DynamicDrawUsage));
    this.pGeo.setAttribute('aSize', new THREE.BufferAttribute(size, 1).setUsage(THREE.DynamicDrawUsage));
    const mat = new THREE.PointsMaterial({
      size: 0.22, vertexColors: true, transparent: true, opacity: 0.95,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
    });
    this.points = new THREE.Points(this.pGeo, mat);
    this.points.frustumCulled = false;
    this.scene.add(this.points);
  }

  private buildPatches() {
    const geo = new THREE.CircleGeometry(1, 24);
    for (let i = 0; i < MAX_PATCH_MESHES; i++) {
      const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xff6a2f, transparent: true, opacity: 0.25, depthWrite: false, side: THREE.DoubleSide }));
      m.rotation.x = -Math.PI / 2;
      m.visible = false;
      this.scene.add(m);
      this.patchMeshes.push(m);
    }
  }

  private buildBeams() {
    for (let i = 0; i < MAX_BEAMS; i++) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xd8ff4f, transparent: true, opacity: 0.9 }));
      line.visible = false;
      line.frustumCulled = false;
      this.scene.add(line);
      this.beams.push({ line, life: 0, max: 0.18 });
    }
  }

  private buildBars() {
    for (let i = 0; i < MAX_BARS; i++) {
      const tex = makeBarTexture(1);
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
      sprite.visible = false;
      sprite.scale.set(1.6, 0.26, 1);
      this.scene.add(sprite);
      this.bars.push({ sprite, ratio: -1, tex });
    }
  }

  private buildTexts() {
    for (let i = 0; i < MAX_TEXTS; i++) {
      const tex = makeTextTexture('0', '#ffffff');
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
      sprite.visible = false;
      sprite.scale.set(3.4, 1.28, 1);
      this.scene.add(sprite);
      this.texts.push({ sprite, life: 0, max: 1, tex });
    }
  }

  private buildGhost(): THREE.Group {
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: 0x4fd8ff, transparent: true, opacity: 0.55, emissive: 0x2f88ff, emissiveIntensity: 0.5 });
    const geos: Record<TowerKind, THREE.BufferGeometry> = {
      arcane: new THREE.CylinderGeometry(0.5, 0.7, 1.4, 8),
      frost: new THREE.BoxGeometry(0.7, 2.0, 0.7),
      ember: new THREE.ConeGeometry(0.7, 1.8, 8),
      tesla: new THREE.CylinderGeometry(0.45, 0.65, 1.6, 8),
    };
    for (const k of Object.keys(geos) as TowerKind[]) {
      const m = new THREE.Mesh(geos[k], mat);
      m.position.y = 0.8;
      m.name = k;
      g.add(m);
    }
    g.visible = false;
    this.scene.add(g);
    return g;
  }

  // ---------------- public API ----------------
  resetEntities() {
    for (const [, grp] of this.towerGroups) this.scene.remove(grp);
    this.towerGroups.clear();
    this.bossGroup.visible = false;
    this.shake = 0;
  }

  setQuality(q: 'low' | 'medium' | 'high') {
    this.quality = q;
    if (q === 'low') {
      this.renderer.shadowMap.enabled = false;
      this.renderer.setPixelRatio(1);
    } else {
      this.renderer.shadowMap.enabled = true;
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, q === 'high' ? 2 : 1.5));
    }
  }

  resize() {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  screenToGround(ndcX: number, ndcY: number): Vec3 {
    this.raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), this.camera);
    const out = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(this.groundPlane, out);
    return { x: out.x, y: 0, z: out.z };
  }

  setBuildState(hoverPad: number, hoverValid: boolean, selection: TowerKind | null, selectedTowerId: number, showRanges: boolean) {
    this.hoverPad = hoverPad;
    this.hoverValid = hoverValid;
    this.buildSelection = selection;
    this.selectedTowerId = selectedTowerId;
    this.showRanges = showRanges;
  }

  addShake(amount: number) { this.shake = Math.min(14, this.shake + amount); }

  handleFx(events: FxEvent[]) {
    for (const e of events) {
      if (e.type === 'shake') this.addShake(e.amount ?? 2);
      else if (e.type === 'text' || e.type === 'dmg') this.spawnText(e.pos, e.msg ?? '', e.color ?? '#ffffff', e.type === 'dmg');
      else if (e.type === 'beam' && e.pos && e.pos2) this.spawnBeam(e.pos, e.pos2, e.color ?? '#d8ff4f');
      else if (e.type === 'ultimate' && e.pos) {
        this.shockwave.position.set(e.pos.x, 0.1, e.pos.z);
        this.shockT = 0.7;
        this.shockwave.visible = true;
        (this.shockwave.material as THREE.MeshBasicMaterial).color.set(e.color ?? ULTIMATE.color);
      } else if (e.type === 'evolve' && e.pos) {
        this.spawnText(e.pos, 'EVOLVED', e.color ?? '#ffffff', false);
      }
    }
  }

  private spawnText(pos: Vec3 | undefined, msg: string, color: string, isDmg: boolean) {
    if (!pos) return;
    const slot = this.texts[this.textCursor];
    this.textCursor = (this.textCursor + 1) % MAX_TEXTS;
    slot.tex.dispose();
    slot.tex = makeTextTexture(msg, color, isDmg ? 34 : 26);
    (slot.sprite.material as THREE.SpriteMaterial).map = slot.tex;
    slot.sprite.position.set(pos.x, pos.y + 1.6, pos.z);
    slot.life = slot.max = isDmg ? 0.8 : 1.2;
    slot.sprite.visible = true;
    (slot.sprite.material as THREE.SpriteMaterial).opacity = 1;
    slot.sprite.scale.set(isDmg ? 3.8 : 3.0, (isDmg ? 3.8 : 3.0) * 0.375, 1);
  }

  private spawnBeam(a: Vec3, b: Vec3, color: string) {
    const slot = this.beams[this.beamCursor];
    this.beamCursor = (this.beamCursor + 1) % MAX_BEAMS;
    const attr = slot.line.geometry.getAttribute('position') as THREE.BufferAttribute;
    // jagged lightning: 5 segments
    const n = 6;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const jx = i > 0 && i < n - 1 ? (Math.random() - 0.5) * 0.8 : 0;
      const jy = i > 0 && i < n - 1 ? (Math.random() - 0.5) * 0.8 : 0;
      arr[i * 3] = a.x + (b.x - a.x) * t + jx;
      arr[i * 3 + 1] = a.y + (b.y - a.y) * t + jy;
      arr[i * 3 + 2] = a.z + (b.z - a.z) * t + jx;
    }
    slot.line.geometry.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    (slot.line.material as THREE.LineBasicMaterial).color.set(color);
    slot.life = slot.max = 0.16;
    slot.line.visible = true;
  }

  // ---------------- per-frame sync ----------------
  sync(g: GameState, dt: number) {
    this.time += dt;
    this.updateEra(g, dt);
    this.updateCamera(g, dt);
    this.updateWorld(g, dt);
    this.updateEnemies(g);
    this.updateBoss(g);
    this.updatePlayer(g);
    this.updateTowers(g);
    this.updateProjectiles(g);
    this.updateParticles(g);
    this.updatePatches(g);
    this.updateBeams(dt);
    this.updateBars(g, dt);
    this.updateTexts(dt);
    this.updateGhost(g);
    this.updateShockwave(dt);
    this.updateHazardRing(g);
    this.updatePlayerLight(g);
    this.renderer.render(this.scene, this.camera);
  }

  // Environmental era lighting: crossfade fog/background/ambient/sun toward the current era.
  private updateEra(g: GameState, dt: number) {
    const era = ERAS[g.era] ?? ERAS[0];
    const k = Math.min(1, 3 * dt);
    const fog = this.scene.fog as THREE.Fog;
    const bg = this.scene.background as THREE.Color;
    const targetFog = new THREE.Color(era.fog);
    fog.color.lerp(targetFog, k);
    fog.near = THREE.MathUtils.lerp(fog.near, 60 - g.era * 4, k);
    fog.far = THREE.MathUtils.lerp(fog.far, 130 - g.era * 8, k);
    bg.lerp(targetFog, k);
    this.hemi.color.lerp(new THREE.Color(era.ambient), k);
    this.hemi.intensity = THREE.MathUtils.lerp(this.hemi.intensity, era.ambientI, k);
    this.dir.color.lerp(new THREE.Color(era.sun), k);
    this.dir.intensity = THREE.MathUtils.lerp(this.dir.intensity, era.sunI, k);
    // bastion light shifts with era
    const bLight = this.world.bastionLight;
    bLight.color.lerp(new THREE.Color(BASTION_TIERS[g.bastionTier]?.color ?? era.sun), k);
    void this.prevEra;
  }

  private updateShockwave(dt: number) {
    if (this.shockT <= 0) { this.shockwave.visible = false; return; }
    this.shockT -= dt;
    const t = 1 - this.shockT / 0.7; // 0..1
    const r = 1 + t * ULTIMATE.radius;
    this.shockwave.scale.setScalar(r);
    (this.shockwave.material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.85;
    if (this.shockT <= 0) this.shockwave.visible = false;
  }

  private updateHazardRing(g: GameState) {
    const h = g.hazard;
    if (!h || !h.active || !h.struck) { this.hazardRing.visible = false; return; }
    const cfg = HAZARDS[h.kind];
    const prog = 1 - Math.max(0, h.t) / cfg.telegraph; // 0..1 as it approaches strike
    this.hazardRing.visible = true;
    this.hazardRing.position.set(h.pos.x, 0.12, h.pos.z);
    this.hazardRing.scale.setScalar(h.radius * (0.3 + 0.7 * prog));
    const mat = this.hazardRing.material as THREE.MeshBasicMaterial;
    mat.color.setHex(cfg.color);
    mat.opacity = 0.25 + 0.55 * prog + 0.1 * Math.sin(this.time * 12);
  }

  private updatePlayerLight(g: GameState) {
    const p = g.player;
    this.playerLight.position.set(p.pos.x, 1.6, p.pos.z);
    // brighter when the ultimate is charging
    const charge = g.ultimate.charge / g.ultimate.max;
    this.playerLight.intensity = 10 + charge * 22 + (g.ultimate.active ? 40 : 0);
    this.playerLight.color.setHex(charge > 0.99 ? 0xffd84f : 0x9fe8ff);
  }

  private updateCamera(g: GameState, dt: number) {
    const p = g.player;
    const tx = p.pos.x * 0.85;
    const tz = p.pos.z * 0.85;
    this.camTarget.x += (tx - this.camTarget.x) * Math.min(1, 5 * dt);
    this.camTarget.z += (tz - this.camTarget.z) * Math.min(1, 5 * dt);
    this.camTarget.y = 0;
    // cinematic zoom (1 = normal, >1 closer)
    const targetZoom = g.cinematic.zoomT > 0 ? g.cinematic.zoom : 1;
    this.zoomCur += (targetZoom - this.zoomCur) * Math.min(1, 6 * dt);
    const zoom = this.zoomCur;
    const baseY = 27 / zoom;
    const baseZ = 21 / zoom;
    // shake
    if (this.shake > 0.05) {
      this.shake *= Math.max(0, 1 - 6 * dt);
      const s = this.shake * 0.06;
      this.camera.position.set(
        this.camTarget.x + s * (Math.random() - 0.5) * 2,
        baseY + s * (Math.random() - 0.5) * 2,
        this.camTarget.z + baseZ + s * (Math.random() - 0.5) * 2,
      );
    } else {
      this.camera.position.set(this.camTarget.x, baseY, this.camTarget.z + baseZ);
    }
    this.camera.lookAt(this.camTarget.x, 1, this.camTarget.z - 3);
  }

  private updateWorld(g: GameState, dt: number) {
    const w = this.world;
    for (let i = 0; i < w.portals.length; i++) {
      const portal = w.portals[i];
      const active = g.phase === 'combat' || g.phase === 'prep';
      const spin = active ? 1.2 : 0.3;
      portal.children[0].rotation.z += spin * dt;
      const disc = w.portalDiscs[i];
      const mat = disc.material as THREE.MeshBasicMaterial;
      mat.opacity = active ? 0.3 + 0.15 * Math.sin(this.time * 3 + i) : 0.12;
    }
    // bastion
    const c = w.bastionCrystal;
    c.rotation.y += dt * 0.8;
    c.position.y = 3.0 + Math.sin(this.time * 1.4) * 0.15;
    const flash = g.bastionFlash > 0 ? 1 : 0;
    (c.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.4 + flash * 3 + 0.3 * Math.sin(this.time * 2);
    // shards orbit
    const bastion = w.bastion;
    for (let i = 3; i < bastion.children.length; i++) {
      const shard = bastion.children[i];
      const a = this.time * 1.2 + (i - 3) * (Math.PI / 2);
      shard.position.set(Math.cos(a) * 2.2, 3.0 + Math.sin(this.time * 2 + i) * 0.3, Math.sin(a) * 2.2);
      shard.rotation.y += dt * 2;
    }
    // pads
    const build = g.buildMode;
    for (let i = 0; i < w.padRings.length; i++) {
      const ring = w.padRings[i];
      const disc = w.padDiscs[i];
      const occupied = g.towers.some((t) => t.padId === i && !t.dead);
      const isHover = i === this.hoverPad;
      let ringOp = 0, discOp = 0, ringColor = 0x3f5f8f;
      if (build) {
        if (occupied) { ringOp = 0.08; }
        else if (isHover) {
          ringOp = 0.9; discOp = 0.3;
          ringColor = this.hoverValid ? 0x54ff9e : 0xff5454;
        } else { ringOp = 0.25; discOp = 0.06; }
      }
      (ring.material as THREE.MeshBasicMaterial).opacity = ringOp;
      (ring.material as THREE.MeshBasicMaterial).color.setHex(ringColor);
      (disc.material as THREE.MeshBasicMaterial).opacity = discOp;
      (disc.material as THREE.MeshBasicMaterial).color.setHex(ringColor);
    }
    // debug lanes
    for (const line of w.laneLines) line.visible = g.debug.showPaths;
  }

  private updateEnemies(g: GameState) {
    const byKind = new Map<EnemyKind, number[]>();
    for (const e of g.enemies) {
      if (e.kind === 'boss') continue;
      let arr = byKind.get(e.kind);
      if (!arr) { arr = []; byKind.set(e.kind, arr); }
      const st = e.status;
      arr.push(e.hp, e.maxHp, e.pos.x, e.pos.z, e.lane, e.dist, e.flash, e.freezeT, e.spawnT, e.state === 'spawn' ? 1 : 0, e.slow, e.facing ?? 0,
        st.burnT > 0 ? 1 : 0, st.chillT > 0 ? 1 : 0, st.shockT > 0 ? 1 : 0, st.markT > 0 ? 1 : 0,
        e.untargetable ? 1 : 0, e.chargeState === 'charge' ? 1 : 0, e.slamTelegraph > 0 ? 1 : 0);
    }
    for (const kind of ENEMY_KINDS) {
      const mesh = this.enemyMeshes.get(kind)!;
      const arr = byKind.get(kind) ?? [];
      const n = arr.length / 18;
      mesh.count = n;
      for (let i = 0; i < n; i++) {
        const o = i * 18;
        const x = arr[o + 2], z = arr[o + 3];
        const flash = arr[o + 6], freezeT = arr[o + 7], spawnT = arr[o + 8], isSpawn = arr[o + 9];
        const burning = arr[o + 12], chilled = arr[o + 13], shocked = arr[o + 14], marked = arr[o + 15];
        const untargetable = arr[o + 16], charging = arr[o + 17], slaming = arr[o + 18] ?? 0;
        const scale = isSpawn ? Math.max(0.05, 1 - spawnT / 0.4) : 1;
        let y = 0;
        if (kind === 'wisp') y = 0.9 + Math.sin(this.time * 4 + i) * 0.15;
        else if (kind === 'shaman') y = 0.75;
        else y = 0.4;
        this.dummy.position.set(x, y, z);
        const facing = arr[o + 11];
        this.dummy.rotation.set(0, facing, 0);
        // charging enemies lunge forward slightly; slaming telegraphs a bob
        let pulse = 1;
        if (charging) pulse = 1 + 0.08 * Math.sin(this.time * 20);
        if (slaming) pulse = 1 + 0.12 * Math.sin(this.time * 16);
        this.dummy.scale.setScalar(scale * pulse * (flash > 0 ? 1.12 : 1));
        this.dummy.updateMatrix();
        mesh.setMatrixAt(i, this.dummy.matrix);
        // color priority: flash > untargetable(ghost) > freeze > burn > chill > shock > mark > base
        if (flash > 0) this.tmpColor.setHex(0xffffff);
        else if (untargetable) this.tmpColor.setHex(0x2a3a5a); // phase-dimmed
        else if (freezeT > 0) this.tmpColor.setHex(0x8fe8ff);
        else if (burning) this.tmpColor.setHex(0xff6b3a);
        else if (chilled) this.tmpColor.setHex(0x6fd8ff);
        else if (shocked) this.tmpColor.setHex(0xd8ff4f);
        else if (marked) this.tmpColor.setHex(0x9f6bff);
        else this.tmpColor.setHex(ENEMIES[kind].color);
        mesh.setColorAt(i, this.tmpColor);
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
  }

  private updateBoss(g: GameState) {
    const boss = g.bossRef;
    const grp = this.bossGroup;
    if (!boss || boss.dead) { grp.visible = false; return; }
    grp.visible = true;
    grp.position.set(boss.pos.x, 0, boss.pos.z);
    const ud = (grp as any).userData;
    ud.body.rotation.y += 0.01;
    ud.body.position.y = 2.2 + Math.sin(this.time * 2) * 0.2;
    ud.head.position.y = 4.2 + Math.sin(this.time * 2 + 1) * 0.2;
    const flash = boss.flash > 0;
    (ud.body.material as THREE.MeshStandardMaterial).emissiveIntensity = flash ? 2 : 0.5;
    ud.shield.visible = boss.shieldT > 0;
    if (ud.shield.visible) (ud.shield.material as THREE.MeshBasicMaterial).opacity = 0.15 + 0.1 * Math.sin(this.time * 8);
    grp.rotation.y = boss.facing ?? 0;
  }

  private updatePlayer(g: GameState) {
    const p = g.player;
    const grp = this.playerGroup;
    grp.position.set(p.pos.x, 0, p.pos.z);
    grp.rotation.y = p.facing;
    const hurt = p.hurtT > 0;
    grp.visible = !p.dead;
    const ud = (grp as any).userData;
    (ud.orb.material as THREE.MeshStandardMaterial).emissiveIntensity = hurt ? 3 : 1.6;
    // sword swing animation (driven by player.meleeAnim: 0.2 -> 0)
    if (ud.sword) {
      if (p.meleeAnim > 0) {
        const k = 1 - p.meleeAnim / 0.2;
        const ease = k * k * (3 - 2 * k); // smoothstep
        ud.sword.rotation.y = -1.4 + ease * 2.6;
        ud.sword.rotation.z = -0.5 + Math.sin(ease * Math.PI) * 0.4;
      } else {
        ud.sword.rotation.y = 0;
        ud.sword.rotation.z = -0.5;
      }
    }
    // dash trail glow
  }

  private updateTowers(g: GameState) {
    // remove dead
    for (const [id, grp] of this.towerGroups) {
      if (!g.towers.some((t) => t.id === id)) {
        this.scene.remove(grp);
        this.towerGroups.delete(id);
      }
    }
    for (const t of g.towers) {
      let grp = this.towerGroups.get(t.id);
      if (!grp) {
        grp = this.buildTowerGroup(t.kind, t.level);
        grp.position.set(t.pos.x, 0, t.pos.z);
        this.scene.add(grp);
        this.towerGroups.set(t.id, grp);
        // placement pop animation via scale
        (grp as any).userData.spawnT = 0.3;
      }
      const ud = (grp as any).userData;
      if (ud.spawnT > 0) {
        ud.spawnT -= 0.016;
        const s = 1 + Math.max(0, ud.spawnT) * 1.5;
        grp.scale.setScalar(2 - s);
      } else grp.scale.setScalar(1);
      // head rotation
      if (ud.head) ud.head.rotation.y = t.headAngle;
      // stun
      const stunned = t.stormCd > 0;
      if (ud.glow) (ud.glow.material as THREE.SpriteMaterial).opacity = stunned ? 0.15 : 0.4 + 0.15 * Math.sin(this.time * 4 + t.id);
      if (ud.glow) (ud.glow.material as THREE.SpriteMaterial).color.setHex(stunned ? 0xb44fd8 : TOWERS[t.kind].color);
      // flash
      if (t.flash > 0 && ud.body) (ud.body.material as THREE.MeshStandardMaterial).emissiveIntensity = 2;
    }
    // range ring for selected tower or debug
    const sel = g.towers.find((t) => t.id === this.selectedTowerId);
    if (sel && (g.buildMode || this.showRanges)) {
      this.rangeRing.visible = true;
      this.rangeRing.position.set(sel.pos.x, 0.07, sel.pos.z);
      this.rangeRing.scale.setScalar(sel.range);
      (this.rangeRing.material as THREE.MeshBasicMaterial).color.setHex(TOWERS[sel.kind].color);
    } else if (this.showRanges && g.towers.length > 0) {
      // show all ranges: use ring for first few (simple: only selected)
      this.rangeRing.visible = false;
    } else {
      this.rangeRing.visible = false;
    }
  }

  private buildTowerGroup(kind: TowerKind, level: number): THREE.Group {
    const g = new THREE.Group();
    const def = TOWERS[kind];
    const mat = new THREE.MeshStandardMaterial({ color: def.color, roughness: 0.5, metalness: 0.3, flatShading: true, emissive: def.color, emissiveIntensity: 0.25 });
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x3a4560, roughness: 0.8, flatShading: true });
    let body: THREE.Mesh | null = null;
    let head: THREE.Mesh | null = null;
    switch (kind) {
      case 'arcane': {
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.95, 0.5, 8), baseMat);
        base.position.y = 0.25;
        body = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.55, 1.1, 8), mat);
        body.position.y = 1.0;
        head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 10, 8), mat);
        head.position.y = 1.75;
        g.add(base, body, head);
        break;
      }
      case 'frost': {
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.0, 0.4, 6), baseMat);
        base.position.y = 0.2;
        body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 2.1, 0.7), mat);
        body.position.y = 1.4;
        head = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), mat);
        head.position.y = 2.8;
        g.add(base, body, head);
        break;
      }
      case 'ember': {
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.05, 0.45, 8), baseMat);
        base.position.y = 0.22;
        body = new THREE.Mesh(new THREE.ConeGeometry(0.75, 1.9, 8), mat);
        body.position.y = 1.4;
        head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 6), mat);
        head.position.y = 2.5;
        g.add(base, body, head);
        break;
      }
      case 'tesla': {
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 0.4, 8), baseMat);
        base.position.y = 0.2;
        body = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 1.5, 8), mat);
        body.position.y = 1.1;
        head = new THREE.Mesh(new THREE.IcosahedronGeometry(0.45, 0), mat);
        head.position.y = 2.2;
        g.add(base, body, head);
        break;
      }
    }
    if (body) body.castShadow = true;
    // level rings
    for (let i = 0; i < level - 1; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.9 + i * 0.25, 0.06, 6, 20),
        new THREE.MeshStandardMaterial({ color: 0xffd84f, emissive: 0xffa84f, emissiveIntensity: 0.8 }),
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.15 + i * 0.12;
      g.add(ring);
    }
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeGlowTexture(), color: def.color, transparent: true, opacity: 0.4, depthWrite: false }));
    glow.scale.setScalar(2.6);
    glow.position.y = 1.6;
    g.add(glow);
    (g as any).userData = { body, head, glow, spawnT: 0 };
    return g;
  }

  private updateProjectiles(g: GameState) {
    const byKind = new Map<string, ProjectileLite[]>();
    for (const p of g.projectilePool) {
      if (!p.active) continue;
      let arr = byKind.get(p.kind);
      if (!arr) { arr = []; byKind.set(p.kind, arr); }
      arr.push(p);
    }
    for (const [kind, mesh] of this.projMeshes) {
      const list = byKind.get(kind) ?? [];
      mesh.count = list.length;
      for (let i = 0; i < list.length; i++) {
        const p = list[i];
        this.dummy.position.set(p.pos.x, p.pos.y, p.pos.z);
        if (kind === 'lance') {
          const a = Math.atan2(p.vel.x, p.vel.z);
          this.dummy.rotation.set(0, a, 0);
          this.dummy.rotateX(Math.PI / 2);
        } else this.dummy.rotation.set(0, 0, 0);
        this.dummy.scale.setScalar(1);
        this.dummy.updateMatrix();
        mesh.setMatrixAt(i, this.dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }
  }

  private updateParticles(g: GameState) {
    const ps = g.particles;
    const pos = this.pGeo.getAttribute('position') as THREE.BufferAttribute;
    const col = this.pGeo.getAttribute('color') as THREE.BufferAttribute;
    for (let i = 0; i < ps.count; i++) {
      pos.setXYZ(i, ps.px[i], ps.py[i], ps.pz[i]);
      const fade = Math.max(0, ps.life[i] / ps.maxLife[i]);
      col.setXYZ(i, ps.cr[i] * fade, ps.cg[i] * fade, ps.cb[i] * fade);
    }
    this.pGeo.setDrawRange(0, ps.count);
    pos.needsUpdate = true;
    col.needsUpdate = true;
  }

  private updatePatches(g: GameState) {
    for (let i = 0; i < MAX_PATCH_MESHES; i++) {
      const m = this.patchMeshes[i];
      const p = g.patches[i];
      if (!p) { m.visible = false; continue; }
      m.visible = true;
      m.position.set(p.pos.x, 0.08, p.pos.z);
      m.scale.setScalar(p.radius * (0.9 + 0.1 * Math.sin(this.time * 10 + i)));
      (m.material as THREE.MeshBasicMaterial).opacity = 0.18 + 0.14 * (p.life / p.maxLife) + 0.05 * Math.sin(this.time * 12 + i);
    }
  }

  private updateBeams(dt: number) {
    for (const b of this.beams) {
      if (b.life <= 0) { b.line.visible = false; continue; }
      b.life -= dt;
      (b.line.material as THREE.LineBasicMaterial).opacity = Math.max(0, b.life / b.max) * 0.9;
    }
  }

  private updateBars(g: GameState, dt: number) {
    // gather entities needing bars
    const needs: { x: number; y: number; z: number; hp: number; max: number; scale: number }[] = [];
    for (const e of g.enemies) {
      if (e.dead || e.hp >= e.maxHp) continue;
      needs.push({ x: e.pos.x, y: e.pos.y + e.radius * 2 + 0.7, z: e.pos.z, hp: e.hp, max: e.maxHp, scale: e.radius * 1.8 });
    }
    for (const t of g.towers) {
      if (t.hp >= t.maxHp) continue;
      needs.push({ x: t.pos.x, y: 3.2, z: t.pos.z, hp: t.hp, max: t.maxHp, scale: 1.6 });
    }
    let idx = 0;
    for (let i = 0; i < MAX_BARS && idx < needs.length; i++) {
      const bar = this.bars[i];
      const n = needs[idx++];
      bar.sprite.visible = true;
      bar.sprite.position.set(n.x, n.y, n.z);
      bar.sprite.scale.set(n.scale, n.scale * 0.16, 1);
      const ratio = n.hp / n.max;
      if (Math.abs(ratio - bar.ratio) > 0.02) {
        bar.ratio = ratio;
        bar.tex.dispose();
        bar.tex = makeBarTexture(ratio);
        (bar.sprite.material as THREE.SpriteMaterial).map = bar.tex;
      }
    }
    for (let i = idx; i < MAX_BARS; i++) this.bars[i].sprite.visible = false;
  }

  private updateTexts(dt: number) {
    for (const t of this.texts) {
      if (t.life <= 0) { t.sprite.visible = false; continue; }
      t.life -= dt;
      t.sprite.position.y += dt * 1.6;
      (t.sprite.material as THREE.SpriteMaterial).opacity = Math.max(0, t.life / t.max);
    }
  }

  private updateGhost(g: GameState) {
    const sel = this.buildSelection;
    if (!g.buildMode || !sel || this.hoverPad < 0) {
      this.ghost.visible = false;
      return;
    }
    const pad = g.arena.pads[this.hoverPad];
    this.ghost.visible = true;
    this.ghost.position.set(pad.pos.x, 0, pad.pos.z);
    for (const child of this.ghost.children) {
      child.visible = child.name === sel;
    }
    const mat = (this.ghost.children.find((c) => c.name === sel) as THREE.Mesh).material as THREE.MeshStandardMaterial;
    mat.color.setHex(this.hoverValid ? 0x54ff9e : 0xff5454);
    mat.emissive.setHex(this.hoverValid ? 0x2fd86a : 0xd82f2f);
    // range preview
    const def = TOWERS[sel];
    const s = towerStats(sel, 1);
    this.rangeRing.visible = true;
    this.rangeRing.position.set(pad.pos.x, 0.07, pad.pos.z);
    this.rangeRing.scale.setScalar(s.range);
    (this.rangeRing.material as THREE.MeshBasicMaterial).color.setHex(this.hoverValid ? 0x54ff9e : 0xff5454);
    (this.rangeRing.material as THREE.MeshBasicMaterial).opacity = 0.4;
    void def;
  }
}

type ProjectileLite = { pos: { x: number; y: number; z: number }; vel: { x: number; z: number } };
