// Renderer: WebGLRenderer + scene + sky + fog + lights + quality presets,
// and the per-frame draw that syncs all 3D modules from game state.

import * as THREE from 'three';
import type { Game } from '../core/game';
import type { SettingsStore, Quality } from '../core/types';
import { Camera3D } from './camera3d';
import { Debug3D } from './debug3d';
import { Enemies3D } from './enemies3d';
import { Particles3D } from './particles3d';
import { Projectiles3D } from './projectiles3d';
import { Terrain } from './terrain';
import { Towers3D } from './towers3d';

const SKY_VERT = /* glsl */ `
varying vec3 vWorld;
void main() {
  vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const SKY_FRAG = /* glsl */ `
precision mediump float;
varying vec3 vWorld;
void main() {
  float h = normalize(vWorld).y;
  vec3 top = vec3(0.22, 0.42, 0.72);
  vec3 horizon = vec3(0.78, 0.87, 0.96);
  vec3 ground = vec3(0.33, 0.4, 0.33);
  vec3 col = h > 0.0 ? mix(horizon, top, pow(h, 0.55)) : mix(horizon, ground, min(1.0, -h * 5.0));
  gl_FragColor = vec4(col, 1.0);
}
`;

const QUALITY: Record<Quality, { shadows: boolean; shadowSize: number; maxPixelRatio: number }> = {
  low: { shadows: false, shadowSize: 512, maxPixelRatio: 1 },
  medium: { shadows: true, shadowSize: 1024, maxPixelRatio: 1.5 },
  high: { shadows: true, shadowSize: 2048, maxPixelRatio: 2 },
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
  private quality: Quality;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly settings: SettingsStore,
  ) {
    this.gl = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.gl.outputColorSpace = THREE.SRGBColorSpace;
    this.gl.toneMapping = THREE.ACESFilmicToneMapping;
    this.gl.toneMappingExposure = 1.12;

    const aspect = this.aspect();
    this.camera3d = new Camera3D(aspect);
    this.scene.add(this.camera3d.camera);

    // sky dome
    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(160, 32, 16),
      new THREE.ShaderMaterial({ vertexShader: SKY_VERT, fragmentShader: SKY_FRAG, side: THREE.BackSide, depthWrite: false, fog: false }),
    );
    this.scene.add(sky);

    this.scene.fog = new THREE.Fog(0xcfe3f5, 45, 130);

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
    this.camera3d.setAspect(w / h);
  }

  zoom(deltaY: number): void {
    this.camera3d.zoom(deltaY);
  }

  setQuality(q: Quality): void {
    this.quality = q;
    this.applyQuality(q);
  }

  private applyQuality(q: Quality): void {
    const cfg = QUALITY[q];
    const dpr = Math.min(window.devicePixelRatio || 1, cfg.maxPixelRatio);
    this.gl.setPixelRatio(dpr);
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

  /** Per-frame: update camera + sync all modules from game state + render. */
  draw(dt: number, game: Game): void {
    this.camera3d.update(game.shake, this.settings.data.screenShake);
    this.terrain.update(dt, game);
    this.towers.update(dt, game);
    this.enemies.update(dt, game);
    this.projectiles.update(dt, game);
    this.particles.update(dt, game);
    this.debug.update(game);
    this.gl.render(this.scene, this.camera3d.camera);
  }

  dispose(): void {
    this.gl.dispose();
  }
}
