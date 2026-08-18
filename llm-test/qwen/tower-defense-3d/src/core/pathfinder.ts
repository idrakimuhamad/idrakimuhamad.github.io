// A* pathfinding with binary min-heap. Port of 2D `ce` (A*) and `de` (heap).
// 4-directional, Manhattan heuristic, typed arrays, cell-to-cell paths.
// The blocked-set parameter implements the "would wall off the base" check.

import type { Grid } from './grid';
import type { Cell } from './types';

/** 2D `de`. */
class MinHeap {
  private items: { idx: number; f: number }[] = [];

  get size(): number { return this.items.length; }

  clear(): void { this.items.length = 0; }

  push(idx: number, f: number): void {
    const items = this.items;
    items.push({ idx, f });
    let i = items.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (items[p].f <= items[i].f) break;
      this.swap(p, i);
      i = p;
    }
  }

  pop(): { idx: number; f: number } | undefined {
    const items = this.items;
    if (items.length === 0) return undefined;
    const top = items[0];
    const last = items.pop()!;
    if (items.length > 0) {
      items[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        let m = i;
        if (l < items.length && items[l].f < items[m].f) m = l;
        if (r < items.length && items[r].f < items[m].f) m = r;
        if (m === i) break;
        this.swap(m, i);
        i = m;
      }
    }
    return top;
  }

  private swap(a: number, b: number): void {
    const items = this.items;
    const t = items[a];
    items[a] = items[b];
    items[b] = t;
  }
}

/** 2D `ce`. */
export class Pathfinder {
  private g: Float64Array;
  private f: Float64Array;
  private cameFrom: Int32Array;
  private closed: Uint8Array;
  private inOpen: Uint8Array;
  private heap = new MinHeap();
  private ops = 0;
  private readonly cols: number;
  private readonly rows: number;

  constructor(cols: number, rows: number) {
    this.cols = cols;
    this.rows = rows;
    const n = cols * rows;
    this.g = new Float64Array(n);
    this.f = new Float64Array(n);
    this.cameFrom = new Int32Array(n);
    this.closed = new Uint8Array(n);
    this.inOpen = new Uint8Array(n);
  }

  get opsCount(): number { return this.ops; }

  resetOps(): void { this.ops = 0; }

  hasPath(grid: Grid, sc: number, sr: number, tc: number, tr: number, blocked?: Set<number>): boolean {
    return this.findPath(grid, sc, sr, tc, tr, blocked) !== null;
  }

  /**
   * Find a path from (sc,sr) to (tc,tr). Returns list of cells (start..end)
   * or null. `blocked` is an optional set of cell indices (r*cols+c) that
   * must be treated as walls (used by the placement check).
   */
  findPath(grid: Grid, sc: number, sr: number, tc: number, tr: number, blocked?: Set<number>): Cell[] | null {
    const { cols, rows } = this;
    this.g.fill(Infinity);
    this.closed.fill(0);
    this.inOpen.fill(0);
    this.cameFrom.fill(-1);
    this.heap.clear();
    this.ops++;

    const blockedCell = (c: number, r: number): boolean => {
      if (c < 0 || r < 0 || c >= cols || r >= rows) return true;
      const i = r * cols + c;
      if (blocked && blocked.has(i)) return true;
      return !grid.isWalkable(c, r);
    };

    const start = sr * cols + sc;
    const goal = tr * cols + tc;
    if (blockedCell(sc, sr) || blockedCell(tc, tr)) return null;

    const h = (c: number, r: number): number => Math.abs(c - tc) + Math.abs(r - tr);

    this.g[start] = 0;
    this.f[start] = h(sc, sr);
    this.heap.push(start, this.f[start]);
    this.inOpen[start] = 1;

    const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    while (this.heap.size > 0) {
      const cur = this.heap.pop()!.idx;
      if (this.closed[cur]) continue;
      this.closed[cur] = 1;
      this.inOpen[cur] = 0;
      if (cur === goal) {
        const path: Cell[] = [];
        let n = cur;
        while (n !== -1) {
          path.push({ c: n % cols, r: Math.floor(n / cols) });
          n = this.cameFrom[n];
        }
        path.reverse();
        return path;
      }
      const c = cur % cols;
      const r = Math.floor(cur / cols);
      for (let d = 0; d < 4; d++) {
        const nc = c + DIRS[d][0];
        const nr = r + DIRS[d][1];
        if (blockedCell(nc, nr)) continue;
        const ni = nr * cols + nc;
        if (this.closed[ni]) continue;
        const ng = this.g[cur] + 1;
        if (ng < this.g[ni]) {
          this.cameFrom[ni] = cur;
          this.g[ni] = ng;
          this.f[ni] = ng + h(nc, nr);
          this.heap.push(ni, this.f[ni]);
          this.inOpen[ni] = 1;
        }
      }
    }
    return null;
  }

  reRoute(grid: Grid, from: Cell, to: Cell): Cell[] | null {
    return this.findPath(grid, from.c, from.r, to.c, to.r);
  }
}
