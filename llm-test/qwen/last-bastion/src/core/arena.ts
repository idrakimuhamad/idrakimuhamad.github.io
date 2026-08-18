import { Rng } from './rng';
import type { Vec3 } from './types';

// Arena layout: three lanes converging on the Bastion, with natural curves,
// building pads, and scattered environmental features. All logic uses x/z on y=0.

export interface Lane {
  name: string;
  points: Vec3[];      // sampled centerline (y=0)
  cum: number[];       // cumulative distance at each point
  length: number;
  portal: Vec3;        // spawn point (outer end)
}

export interface Pad { id: number; pos: Vec3; lane: number; dist: number }
export interface Feature { pos: Vec3; scale: number; rot: number; kind: 'rock' | 'ruin' | 'tree' | 'crystal' }

export interface Arena {
  lanes: Lane[];
  pads: Pad[];
  features: Feature[];
  radius: number;
}

// Build the centerline of a lane from control points using a Catmull-Rom spline.
function spline(ctrl: Vec3[], samplesPerSeg: number): Vec3[] {
  const pts: Vec3[] = [];
  const n = ctrl.length;
  for (let i = 0; i < n - 1; i++) {
    const p0 = ctrl[Math.max(0, i - 1)];
    const p1 = ctrl[i];
    const p2 = ctrl[i + 1];
    const p3 = ctrl[Math.min(n - 1, i + 2)];
    for (let j = 0; j < samplesPerSeg; j++) {
      const t = j / samplesPerSeg;
      const t2 = t * t, t3 = t2 * t;
      const x = 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
      const z = 0.5 * ((2 * p1.z) + (-p0.z + p2.z) * t + (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t2 + (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t3);
      pts.push({ x, y: 0, z });
    }
  }
  pts.push({ ...ctrl[n - 1] });
  return pts;
}

function makeLane(name: string, ctrl: Vec3[]): Lane {
  const points = spline(ctrl, 14);
  const cum = [0];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1], b = points[i];
    cum.push(cum[i - 1] + Math.hypot(b.x - a.x, b.z - a.z));
  }
  return { name, points, cum, length: cum[cum.length - 1], portal: { ...points[0] } };
}

export function buildArena(seed = 20240607): Arena {
  const rng = new Rng(seed);
  const center: Vec3 = { x: 0, y: 0, z: 0 };

  // Three lanes: north, east-south-east, west-south-west, each curving naturally.
  const lanes: Lane[] = [
    makeLane('north', [
      { x: 4, y: 0, z: -46 }, { x: -6, y: 0, z: -38 }, { x: 2, y: 0, z: -28 },
      { x: -3, y: 0, z: -18 }, { x: 1, y: 0, z: -9 }, center,
    ]),
    makeLane('east', [
      { x: 44, y: 0, z: 14 }, { x: 36, y: 0, z: 4 }, { x: 28, y: 0, z: 12 },
      { x: 19, y: 0, z: 6 }, { x: 10, y: 0, z: 3 }, center,
    ]),
    makeLane('west', [
      { x: -42, y: 0, z: 18 }, { x: -34, y: 0, z: 10 }, { x: -26, y: 0, z: 16 },
      { x: -17, y: 0, z: 8 }, { x: -9, y: 0, z: 4 }, center,
    ]),
    // Extra rift gates (northeast / northwest). Dormant until wave 6
    // (see buildSpawnQueue in waves.ts), which opens a fifth front.
    makeLane('northeast', [
      { x: 36, y: 0, z: -32 }, { x: 28, y: 0, z: -26 }, { x: 22, y: 0, z: -20 },
      { x: 13, y: 0, z: -12 }, center,
    ]),
    makeLane('northwest', [
      { x: -36, y: 0, z: -32 }, { x: -28, y: 0, z: -26 }, { x: -22, y: 0, z: -20 },
      { x: -13, y: 0, z: -12 }, center,
    ]),
  ];

  // Building pads: pairs flanking each lane at several distances, plus a ring near the core.
  const pads: Pad[] = [];
  let padId = 0;
  const addPad = (lane: number, dist: number, side: number) => {
    const L = lanes[lane];
    // find point at dist from END (core is at end of array)
    const dFromStart = L.length - dist;
    let i = 1;
    while (i < L.cum.length - 1 && L.cum[i] < dFromStart) i++;
    const a = L.points[i - 1], b = L.points[i];
    const seg = L.cum[i] - L.cum[i - 1] || 1;
    const t = (dFromStart - L.cum[i - 1]) / seg;
    const px = a.x + (b.x - a.x) * t;
    const pz = a.z + (b.z - a.z) * t;
    const dx = b.x - a.x, dz = b.z - a.z;
    const len = Math.hypot(dx, dz) || 1;
    const nx = -dz / len, nz = dx / len; // normal
    pads.push({ id: padId++, pos: { x: px + nx * side, y: 0, z: pz + nz * side }, lane, dist });
  };
  for (let lane = 0; lane < lanes.length; lane++) {
    for (const dist of [7, 13, 19, 26, 33]) {
      addPad(lane, dist, -5.2);
      addPad(lane, dist, 5.2);
    }
  }
  // Inner ring pads around the core.
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.35;
    pads.push({ id: padId++, pos: { x: Math.cos(a) * 6.5, y: 0, z: Math.sin(a) * 6.5 }, lane: -1, dist: 6.5 });
  }

  // Environmental features: rocks, ruins, trees, crystals scattered off the lanes.
  const features: Feature[] = [];
  const lanePts = lanes.flatMap((l) => l.points);
  const nearLane = (x: number, z: number, r: number) =>
    lanePts.some((p) => Math.hypot(p.x - x, p.z - z) < r);
  let guard = 0;
  while (features.length < 46 && guard++ < 400) {
    const a = rng.range(0, Math.PI * 2);
    const r = rng.range(9, 48);
    const x = Math.cos(a) * r, z = Math.sin(a) * r;
    if (Math.abs(x) < 7 && Math.abs(z) < 7) continue;
    if (nearLane(x, z, 4.5)) continue;
    if (pads.some((p) => Math.hypot(p.pos.x - x, p.pos.z - z) < 4)) continue;
    const roll = rng.next();
    const kind: Feature['kind'] = roll < 0.4 ? 'rock' : roll < 0.6 ? 'tree' : roll < 0.85 ? 'ruin' : 'crystal';
    features.push({ pos: { x, y: 0, z }, scale: rng.range(0.7, 1.6), rot: rng.range(0, Math.PI * 2), kind });
  }

  return { lanes, pads, features, radius: 50 };
}

// Position + heading at distance d from the core along lane (d clamped to lane length).
export function lanePoint(lane: Lane, d: number, out: Vec3): Vec3 {
  const dd = Math.max(0, Math.min(lane.length, d));
  let i = 1;
  while (i < lane.cum.length - 1 && lane.cum[i] < dd) i++;
  const a = lane.points[i - 1], b = lane.points[i];
  const seg = lane.cum[i] - lane.cum[i - 1] || 1;
  const t = (dd - lane.cum[i - 1]) / seg;
  out.x = a.x + (b.x - a.x) * t;
  out.z = a.z + (b.z - a.z) * t;
  out.y = 0;
  const dx = b.x - a.x, dz = b.z - a.z;
  const len = Math.hypot(dx, dz) || 1;
  (out as Vec3 & { hx?: number; hz?: number }).hx = dx / len;
  (out as Vec3 & { hx?: number; hz?: number }).hz = dz / len;
  return out;
}

// Normal (perpendicular) direction at distance d from the core along lane.
export function laneNormal(lane: Lane, d: number, out: Vec3): Vec3 {
  const p = lanePoint(lane, d, out);
  const hx = (p as Vec3 & { hx?: number; hz?: number }).hx ?? 1;
  const hz = (p as Vec3 & { hx?: number; hz?: number }).hz ?? 0;
  out.x = -hz; out.z = hx; out.y = 0;
  return out;
}
