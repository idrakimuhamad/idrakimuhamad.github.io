import * as THREE from 'three';
import type { Lane } from '../core/arena';

// Procedural ground texture: dark stone with visible lane paths.
export function makeGroundTexture(lanes: Lane[], size = 1024): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  const S = size / 100; // world units -> px (arena is 100x100)
  const toPx = (x: number, z: number): [number, number] => [(x + 50) * S, (z + 50) * S];

  // base
  ctx.fillStyle = '#141a26';
  ctx.fillRect(0, 0, size, size);
  // noise blotches
  for (let i = 0; i < 2600; i++) {
    const x = Math.random() * size, y = Math.random() * size;
    const r = 2 + Math.random() * 14;
    const v = Math.random();
    ctx.fillStyle = v < 0.5 ? 'rgba(30,40,58,0.25)' : 'rgba(10,14,22,0.3)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // subtle grid
  ctx.strokeStyle = 'rgba(70,90,130,0.08)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 100; i += 5) {
    ctx.beginPath(); ctx.moveTo(i * S, 0); ctx.lineTo(i * S, size); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i * S); ctx.lineTo(size, i * S); ctx.stroke();
  }
  // lane paths
  for (const lane of lanes) {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // outer glow
    ctx.strokeStyle = 'rgba(120,150,200,0.10)';
    ctx.lineWidth = 11 * S * 0.5;
    strokeLane(ctx, lane, toPx);
    // stone path
    ctx.strokeStyle = '#2a3550';
    ctx.lineWidth = 7.5 * S * 0.5;
    strokeLane(ctx, lane, toPx);
    // center wear
    ctx.strokeStyle = 'rgba(150,175,220,0.14)';
    ctx.lineWidth = 3.4 * S * 0.5;
    strokeLane(ctx, lane, toPx);
  }
  // core ring
  const [cx, cy] = toPx(0, 0);
  ctx.strokeStyle = 'rgba(80,200,255,0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, 4.6 * S * 0.5, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = 'rgba(80,200,255,0.15)';
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(cx, cy, 6.2 * S * 0.5, 0, Math.PI * 2); ctx.stroke();

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function strokeLane(ctx: CanvasRenderingContext2D, lane: Lane, toPx: (x: number, z: number) => [number, number]) {
  ctx.beginPath();
  const pts = lane.points;
  const [x0, y0] = toPx(pts[0].x, pts[0].z);
  ctx.moveTo(x0, y0);
  for (let i = 1; i < pts.length; i++) {
    const [x, y] = toPx(pts[i].x, pts[i].z);
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}

// Small radial glow sprite texture (shared).
export function makeGlowTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d')!;
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.35, 'rgba(255,255,255,0.5)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  return tex;
}

// Health bar texture: dark bg + colored fill (red->green by ratio).
export function makeBarTexture(ratio: number): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 64; c.height = 10;
  const ctx = c.getContext('2d')!;
  ctx.clearRect(0, 0, 64, 10);
  ctx.fillStyle = 'rgba(8,10,16,0.85)';
  roundRect(ctx, 1, 1, 62, 8, 3);
  ctx.fill();
  const r = Math.max(0, Math.min(1, ratio));
  const hue = 120 * r; // red->green
  ctx.fillStyle = 'hsl(' + hue + ',80%,55%)';
  if (r > 0.02) {
    roundRect(ctx, 2, 2, Math.max(2, 60 * r), 6, 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Damage number / floating text texture.
export function makeTextTexture(text: string, color: string, size = 28): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 96;
  const ctx = c.getContext('2d')!;
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.font = 'bold ' + size + 'px "Segoe UI", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'rgba(0,0,0,0.8)';
  ctx.strokeText(text, 128, 48);
  ctx.fillStyle = color;
  ctx.fillText(text, 128, 48);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
