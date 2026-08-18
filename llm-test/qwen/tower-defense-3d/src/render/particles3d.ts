// Particle rendering: one pooled THREE.Points with a custom shader
// (per-point size / color / alpha / shape), plus a pool of floating-text
// sprites for damage numbers / money / info.

import * as THREE from 'three';
import type { Game } from '../core/game';
import type { Particle, ParticleShape } from '../core/fx';
import type { SettingsStore } from '../core/types';

const MAX_POINTS = 1400;
const MAX_TEXTS = 120;

const SHAPE_NUM: Record<ParticleShape, number> = { circle: 0, spark: 1, smoke: 2 };

const VERT = /* glsl */ `
attribute float aSize;
attribute vec3 aColor;
attribute float aAlpha;
attribute float aShape;
varying vec3 vColor;
varying float vAlpha;
varying float vShape;
uniform float uScale;
void main() {
  vColor = aColor;
  vAlpha = aAlpha;
  vShape = aShape;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * uScale / max(0.1, -mv.z);
  gl_Position = projectionMatrix * mv;
}
`;

const FRAG = /* glsl */ `
precision mediump float;
varying vec3 vColor;
varying float vAlpha;
varying float vShape;
void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv) * 2.0;
  float a = 0.0;
  if (vShape < 0.5) {
    // circle
    a = 1.0 - smoothstep(0.7, 1.0, d);
  } else if (vShape < 1.5) {
    // spark: 4-point star
    float s = abs(uv.x) + abs(uv.y);
    a = (1.0 - smoothstep(0.15, 1.0, s)) * 0.9;
    a += (1.0 - smoothstep(0.0, 0.5, d)) * 0.6;
  } else {
    // smoke: soft blob
    a = 1.0 - smoothstep(0.2, 1.0, d);
    a *= 0.55;
  }
  if (a <= 0.01) discard;
  gl_FragColor = vec4(vColor, a * vAlpha);
}
`;

interface ParsedColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

const colorCache = new Map<string, ParsedColor>();
function parseColor(str: string): ParsedColor {
  let c = colorCache.get(str);
  if (c) return c;
  if (str.startsWith('#')) {
    const n = parseInt(str.slice(1), 16);
    c = { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255, a: 1 };
  } else {
    const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (m) {
      c = { r: +m[1] / 255, g: +m[2] / 255, b: +m[3] / 255, a: m[4] !== undefined ? +m[4] : 1 };
    } else {
      c = { r: 1, g: 1, b: 1, a: 1 };
    }
  }
  colorCache.set(str, c);
  return c;
}

interface TextSprite {
  sprite: THREE.Sprite;
  ctx: CanvasRenderingContext2D;
  tex: THREE.CanvasTexture;
  key: string;
}

export class Particles3D {
  private readonly points: THREE.Points;
  private readonly positions = new Float32Array(MAX_POINTS * 3);
  private readonly colors = new Float32Array(MAX_POINTS * 3);
  private readonly sizes = new Float32Array(MAX_POINTS);
  private readonly alphas = new Float32Array(MAX_POINTS);
  private readonly shapes = new Float32Array(MAX_POINTS);
  private readonly material: THREE.ShaderMaterial;
  private readonly textPool: TextSprite[] = [];
  private readonly textGroup = new THREE.Group();

  constructor(private readonly settings: SettingsStore) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.positions, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('aColor', new THREE.BufferAttribute(this.colors, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('aSize', new THREE.BufferAttribute(this.sizes, 1).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(this.alphas, 1).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('aShape', new THREE.BufferAttribute(this.shapes, 1).setUsage(THREE.DynamicDrawUsage));
    this.material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: { uScale: { value: 30 } },
      transparent: true,
      depthWrite: false,
    });
    this.points = new THREE.Points(geo, this.material);
    this.points.frustumCulled = false;

    for (let i = 0; i < MAX_TEXTS; i++) {
      const canvas = document.createElement('canvas');
      canvas.width = 160;
      canvas.height = 40;
      const ctx = canvas.getContext('2d')!;
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
      sprite.visible = false;
      sprite.scale.set(1.15, 0.2875, 1);
      this.textGroup.add(sprite);
      this.textPool.push({ sprite, ctx, tex, key: '' });
    }
  }

  setPixelRatio(dpr: number): void {
    this.material.uniforms.uScale.value = 26 * dpr;
  }

  private syncTexts(game: Game): void {
    const texts = game.particles.texts;
    const showDamage = this.settings.data.damageNumbers;
    for (let i = 0; i < MAX_TEXTS; i++) {
      const t = texts[i];
      const s = this.textPool[i];
      if (!t || (t.kind === 'damage' && !showDamage)) {
        s.sprite.visible = false;
        s.key = '';
        continue;
      }
      s.sprite.visible = true;
      s.sprite.position.set(t.x, t.y, t.z);
      s.sprite.material.opacity = Math.min(1, t.life / (t.maxLife * 0.7));
      const key = `${t.text}|${t.color}|${t.size}`;
      if (key !== s.key) {
        s.key = key;
        const ctx = s.ctx;
        ctx.clearRect(0, 0, 160, 40);
        ctx.font = `bold ${Math.round(t.size * 2.2)}px system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(0,0,0,0.8)';
        ctx.strokeText(t.text, 80, 21);
        ctx.fillStyle = t.color;
        ctx.fillText(t.text, 80, 21);
        s.tex.needsUpdate = true;
      }
    }
  }

  update(_dt: number, game: Game): void {
    const enabled = this.settings.data.particleEffects;
    const parts = game.particles.particles;
    const n = Math.min(parts.length, MAX_POINTS);
    if (!enabled || n === 0) {
      this.points.visible = false;
      this.syncTexts(game);
      return;
    }
    for (let i = 0; i < n; i++) {
      const p: Particle = parts[i];
      const c = parseColor(p.color);
      const i3 = i * 3;
      this.positions[i3] = p.x;
      this.positions[i3 + 1] = p.y;
      this.positions[i3 + 2] = p.z;
      this.colors[i3] = c.r;
      this.colors[i3 + 1] = c.g;
      this.colors[i3 + 2] = c.b;
      this.sizes[i] = p.size;
      this.alphas[i] = c.a * (p.life / p.maxLife);
      this.shapes[i] = SHAPE_NUM[p.shape];
    }
    this.points.geometry.setDrawRange(0, n);
    (this.points.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
    (this.points.geometry.getAttribute('aColor') as THREE.BufferAttribute).needsUpdate = true;
    (this.points.geometry.getAttribute('aSize') as THREE.BufferAttribute).needsUpdate = true;
    (this.points.geometry.getAttribute('aAlpha') as THREE.BufferAttribute).needsUpdate = true;
    (this.points.geometry.getAttribute('aShape') as THREE.BufferAttribute).needsUpdate = true;
    this.points.visible = enabled && n > 0;
    this.syncTexts(game);
  }

  addTo(scene: THREE.Scene): void {
    scene.add(this.points, this.textGroup);
  }
}
