// Renderer: WebGLRenderer + scene + sky + fog + lights + quality presets,
// and the per-frame draw that syncs all 3D modules from game state.

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import type { Game } from '../core/game';
import type { SettingsStore, Quality } from '../core/types';
import { Camera3D } from './camera3d';
import { Debug3D } from './debug3d';
import { Enemies3D } from './enemies3d';
import { Particles3D } from './particles3d';
import { Projectiles3D } from './projectiles3d';
import { Terrain } from './terrain';
import { Towers3D } from './towers3d';
import { modelManager } from './models';

const SKY_VERT = /* glsl */ `
varying vec3 vWorld;
void main() {
  vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const SKY_FRAG = /* glsl */ `
precision mediump float;
uniform vec3 sunDir;
varying vec3 vWorld;
void main() {
  vec3 dir = normalize(vWorld);
  float h = dir.y;
  vec3 top = vec3(0.15, 0.35, 0.68);
  vec3 horizon = vec3(0.80, 0.88, 0.97);
  vec3 ground = vec3(0.30, 0.38, 0.30);
  vec3 col = h > 0.0 ? mix(horizon, top, pow(h, 0.5)) : mix(horizon, ground, min(1.0, -h * 4.0));
  // sun disc + warm halo
  float s = max(0.0, dot(dir, sunDir));
  col += vec3(1.0, 0.92, 0.72) * pow(s, 260.0) * 1.4;
  col += vec3(1.0, 0.85, 0.60) * pow(s, 7.0) * 0.22;
  gl_FragColor = vec4(col, 1.0);
}
`;

const QUALITY: Record<Quality, { shadows: boolean; shadowSize: number; maxPixelRatio: number; bloom: boolean }> = {
  low: { shadows: false, shadowSize: 512, maxPixelRatio: 1, bloom: false },
  medium: { shadows: true, shadowSize: 1024, maxPixelRatio: 1.5, bloom: false },
  high: { shadows: true, shadowSize: 2048, maxPixelRatio: 2, bloom: true },
};

export class Renderer {
  readonly gl: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera3d: Camera3D;
  private readonly sun: THREE.DirectionalLight;
  private readonly terrain: Terrain;
  private readonly towers: Towers3D;
  private readonly enemies: Enemies3D;
  private readonly projectiles: Projectiles3D;
  private readonly particles: Particles3D;
  private readonly debug: Debug3D;
  private readonly composer: EffectComposer;
  private readonly bloomPass: UnrealBloomPass;
  private bloomEnabled = false;
  private quality: Quality;
  private precompiled = false;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly settings: SettingsStore,
  ) {
    this.gl = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.gl.outputColorSpace = THREE.SRGBColorSpace;
    this.gl.toneMapping = THREE.ACESFilmicToneMapping;
    this.gl.toneMappingExposure = 1.12;

    // Start loading Tier-2 GLTF models now (during the menu) so they're ready
    // by the time the first wave spawns. Procedural fallbacks cover the gap.
    modelManager.init();

    const aspect = this.aspect();
    this.camera3d = new Camera3D(aspect);
    this.scene.add(this.camera3d.camera);

    // sky dome (with sun glow aligned to the directional light)
    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(160, 32, 16),
      new THREE.ShaderMaterial({
        vertexShader: SKY_VERT,
        fragmentShader: SKY_FRAG,
        uniforms: { sunDir: { value: new THREE.Vector3(26, 26, -2).normalize() } },
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
      }),
    );
    this.scene.add(sky);

    // Subtle depth fade; color matches the sky horizon so the far edge blends in.
    // Distances are synced to the camera fit distance in syncFog() so the map
    // stays clear at any aspect (mobile backs the camera much further out).
    this.scene.fog = new THREE.Fog(0xcde2f5, 42, 115);
    this.syncFog();

    // lights
    const hemi = new THREE.HemisphereLight(0xbcd8ff, 0x3a4a33, 0.75);
    this.scene.add(hemi);
    this.sun = new THREE.DirectionalLight(0xfff2d9, 2.4);
    this.sun.position.set(26, 26, -2);
    this.sun.target.position.set(12, 0, 8);
    this.sun.castShadow = true;
    this.sun.shadow.camera.left = -18;
    this.sun.shadow.camera.right = 18;
    this.sun.shadow.camera.top = 14;
    this.sun.shadow.camera.bottom = -14;
    this.sun.shadow.camera.near = 5;
    this.sun.shadow.camera.far = 70;
    this.sun.shadow.bias = -0.0005;
    this.scene.add(this.sun, this.sun.target);

    // world modules
    this.terrain = new Terrain();
    this.towers = new Towers3D();
    this.enemies = new Enemies3D(settings);
    this.projectiles = new Projectiles3D(settings);
    this.particles = new Particles3D(settings);
    this.debug = new Debug3D(settings);
    this.terrain.addTo(this.scene);
    this.towers.addTo(this.scene);
    this.enemies.addTo(this.scene);
    this.projectiles.addTo(this.scene);
    this.particles.addTo(this.scene);
    this.debug.addTo(this.scene);

    // post-processing (bloom on high quality). RenderPass -> Bloom -> Output.
    this.composer = new EffectComposer(this.gl);
    this.composer.addPass(new RenderPass(this.scene, this.camera3d.camera));
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(960, 640), 0.55, 0.5, 0.92);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(new OutputPass());

    this.quality = settings.data.quality;
    this.applyQuality(this.quality);
    this.resize();
  }

  private aspect(): number {
    const holder = this.canvas.parentElement;
    if (holder && holder.clientWidth > 0 && holder.clientHeight > 0) {
      return holder.clientWidth / holder.clientHeight;
    }
    return 960 / 640;
  }

  resize(): void {
    const holder = this.canvas.parentElement;
    const w = holder ? holder.clientWidth : 960;
    const h = holder ? holder.clientHeight : 640;
    if (w === 0 || h === 0) return;
    this.gl.setSize(w, h, false);
    this.composer.setSize(w, h);
    this.camera3d.setViewport(w, h);
    this.camera3d.setAspect(w / h);
    this.syncFog();
  }

  /**
   * Keep the fog band just beyond the map's far corner so the playable area is
   * always crisp. The camera backs off to `fitDistance` to frame the whole map;
   * the far corner sits ~14.4u further (half the 24x16 diagonal), so start the
   * fog there and fade it out over the next ~60u of sky.
   */
  private syncFog(): void {
    const fog = this.scene.fog as THREE.Fog | null;
    if (!fog) return;
    const fit = this.camera3d.fitDistance;
    fog.near = fit + 16;
    fog.far = fit + 60;
  }

  /** Wheel zoom anchored at screen point `ndc` (-1..1). */
  zoomBy(deltaY: number, ndc: THREE.Vector2): void {
    this.camera3d.zoomBy(deltaY, ndc);
  }

  /** Pinch zoom: scale distance by `factor`, anchored at `ndc`. */
  zoomScale(factor: number, ndc: THREE.Vector2): void {
    this.camera3d.zoomScale(factor, ndc);
  }

  /** Drag-pan by a screen delta (CSS px), anchored at the cursor's `ndc`. */
  panBy(dxPx: number, dyPx: number, ndc: THREE.Vector2): void {
    this.camera3d.panBy(dxPx, dyPx, ndc);
  }

  /** Reset to the default view (whole map, centered). */
  resetCamera(): void {
    this.camera3d.resetView();
  }

  setQuality(q: Quality): void {
    this.quality = q;
    this.applyQuality(q);
  }

  private applyQuality(q: Quality): void {
    const cfg = QUALITY[q];
    const dpr = Math.min(window.devicePixelRatio || 1, cfg.maxPixelRatio);
    this.gl.setPixelRatio(dpr);
    this.composer.setPixelRatio(dpr);
    this.bloomEnabled = cfg.bloom;
    this.particles.setPixelRatio(dpr);
    const shadowsOn = cfg.shadows;
    if (this.gl.shadowMap.enabled !== shadowsOn) {
      this.gl.shadowMap.enabled = shadowsOn;
      this.gl.shadowMap.type = THREE.PCFSoftShadowMap;
      // material refresh so shadow state applies
      this.scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          for (const m of mats) m.needsUpdate = true;
        }
      });
    }
    if (shadowsOn) {
      this.sun.shadow.mapSize.set(cfg.shadowSize, cfg.shadowSize);
      if (this.sun.shadow.map) {
        this.sun.shadow.map.dispose();
        (this.sun.shadow as unknown as { map: null }).map = null;
      }
    }
  }

  /**
   * One-time shader pre-compile once all models have settled (loaded or
   * failed). Without this, the first enemy/tower of each kind compiles its
   * (instanced) shader variant mid-game — a visible hitch.
   */
  private maybePrecompile(): void {
    if (this.precompiled) return;
    const settled = modelManager.loadedCount() + modelManager.failed.size >= modelManager.totalCount();
    if (!settled) return;
    this.precompiled = true;
    this.gl.compile(this.scene, this.camera3d.camera);
  }

  /** Per-frame: update camera + sync all modules from game state + render. */
  draw(dt: number, game: Game): void {
    this.maybePrecompile();
    this.camera3d.update(game.shake, this.settings.data.screenShake);
    this.terrain.update(dt, game);
    this.towers.update(dt, game);
    this.enemies.update(dt, game);
    this.projectiles.update(dt, game);
    this.particles.update(dt, game);
    this.debug.update(game);
    if (this.bloomEnabled) this.composer.render();
    else this.gl.render(this.scene, this.camera3d.camera);
  }

  dispose(): void {
    this.gl.dispose();
  }
}
