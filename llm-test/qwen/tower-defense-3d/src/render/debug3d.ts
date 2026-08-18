// Debug visualization overlay (plan §11.2): grid lines, walkable tint,
// enemy paths (first 12), tower ranges, tower→target lines.

import * as THREE from 'three';
import { COLS, px2w, ROWS } from '../core/defs';
import type { Game } from '../core/game';
import type { SettingsStore } from '../core/types';

function circlePoints(radius: number, y: number): Float32Array {
  const arr = new Float32Array(65 * 3);
  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    arr[i * 3] = Math.cos(a) * radius;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = Math.sin(a) * radius;
  }
  return arr;
}

export class Debug3D {
  private readonly group = new THREE.Group();
  private readonly walkable: THREE.Mesh;
  private readonly pathLines: THREE.Line[] = [];
  private readonly rangeLines: THREE.Line[] = [];
  private readonly targetLines: THREE.Line[] = [];
  private walkableSig = '';

  constructor(private readonly settings: SettingsStore) {
    // grid lines
    const gridPts: number[] = [];
    for (let c = 0; c <= COLS; c++) gridPts.push(c, 0.02, 0, c, 0.02, ROWS);
    for (let r = 0; r <= ROWS; r++) gridPts.push(0, 0.02, r, COLS, 0.02, r);
    const gridGeo = new THREE.BufferGeometry();
    gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(gridPts, 3));
    const grid = new THREE.LineSegments(gridGeo, new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.18 }));
    this.group.add(grid);

    // walkable tint (rebuilt when occupancy changes)
    const walkGeo = new THREE.BufferGeometry();
    this.walkable = new THREE.Mesh(
      walkGeo,
      new THREE.MeshBasicMaterial({ color: '#3ddc84', transparent: true, opacity: 0.13, depthWrite: false }),
    );
    this.walkable.position.y = 0.015;
    this.group.add(this.walkable);

    // pools of lines
    const lineMat = (color: string, opacity: number) => new THREE.LineBasicMaterial({ color, transparent: true, opacity });
    for (let i = 0; i < 12; i++) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(64 * 3), 3));
      const l = new THREE.Line(geo, lineMat('#ff5cf1', 0.55));
      l.frustumCulled = false;
      l.visible = false;
      this.group.add(l);
      this.pathLines.push(l);
    }
    for (let i = 0; i < 40; i++) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(circlePoints(1, 0.04), 3));
      const l = new THREE.Line(geo, lineMat('#5cff5c', 0.4));
      l.visible = false;
      this.group.add(l);
      this.rangeLines.push(l);
    }
    for (let i = 0; i < 40; i++) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
      const l = new THREE.Line(geo, lineMat('#ffff55', 0.6));
      l.frustumCulled = false;
      l.visible = false;
      this.group.add(l);
      this.targetLines.push(l);
    }
  }

  private rebuildWalkable(game: Game): void {
    const sig = game.towers.map((t) => `${t.c},${t.r}`).sort().join('|');
    if (sig === this.walkableSig) return;
    this.walkableSig = sig;
    const positions: number[] = [];
    const indices: number[] = [];
    let v = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!game.grid.isWalkable(c, r)) continue;
        positions.push(c, 0, r, c + 1, 0, r, c + 1, 0, r + 1, c, 0, r + 1);
        indices.push(v, v + 1, v + 2, v, v + 2, v + 3);
        v += 4;
      }
    }
    const geo = this.walkable.geometry;
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
  }

  update(game: Game): void {
    this.group.visible = this.settings.data.debug;
    if (!this.group.visible) return;
    this.rebuildWalkable(game);

    // enemy paths (first 12)
    for (let i = 0; i < this.pathLines.length; i++) {
      const line = this.pathLines[i];
      const e = game.enemies[i];
      if (!e || !e.alive || e.pathIndex >= e.path.length) {
        line.visible = false;
        continue;
      }
      const pts = e.path.slice(e.pathIndex);
      const pos = line.geometry.getAttribute('position') as THREE.BufferAttribute;
      const n = Math.min(pts.length, 64);
      for (let j = 0; j < n; j++) {
        pos.setXYZ(j, pts[j].c + 0.5, 0.05, pts[j].r + 0.5);
      }
      pos.needsUpdate = true;
      line.geometry.setDrawRange(0, n);
      line.visible = true;
    }

    // tower ranges
    for (let i = 0; i < this.rangeLines.length; i++) {
      const line = this.rangeLines[i];
      const t = game.towers[i];
      if (!t) {
        line.visible = false;
        continue;
      }
      line.visible = true;
      line.position.set(t.x, 0, t.z);
      const r = px2w(t.L.range);
      line.scale.set(r, 1, r);
    }

    // tower -> current target lines
    for (let i = 0; i < this.targetLines.length; i++) {
      const line = this.targetLines[i];
      const t = game.towers[i];
      const target = t?.currentTarget;
      if (!t || !target || !target.alive) {
        line.visible = false;
        continue;
      }
      const pos = line.geometry.getAttribute('position') as THREE.BufferAttribute;
      pos.setXYZ(0, t.x, 0.5, t.z);
      pos.setXYZ(1, target.x, 0.5, target.z);
      pos.needsUpdate = true;
      line.visible = true;
    }
  }

  addTo(scene: THREE.Scene): void {
    scene.add(this.group);
  }
}
