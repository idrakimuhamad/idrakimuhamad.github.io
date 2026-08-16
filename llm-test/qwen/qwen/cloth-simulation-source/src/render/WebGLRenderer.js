// WebGLRenderer — a small custom renderer (no libraries).
//
// Draws:
//   * the cloth as a triangulated surface with per-vertex normals + directional
//     & ambient lighting (solid),
//   * optional wireframe / constraint lines,
//   * optional particle points (pinned ones highlighted),
//   * an optional cloth-normals debug overlay.
//
// All geometry lives in dynamic VBOs that we re-upload each frame (the cloth
// deforms every step). Buffers are sized once per rebuild.

import {
  mat4Perspective,
  mat4LookAt,
  mat3NormalFromMat4,
} from '../math/mat4.js';

const VERT_CLOTH = `
attribute vec3 aPos;
attribute vec3 aNormal;
uniform mat4 uProj;
uniform mat4 uView;
uniform mat3 uNormalMat;
varying vec3 vNormal;
varying vec3 vWorld;
void main() {
  vWorld = aPos;
  vNormal = normalize(uNormalMat * aNormal);
  gl_Position = uProj * uView * vec4(aPos, 1.0);
}
`;

const FRAG_CLOTH = `
precision mediump float;
varying vec3 vNormal;
varying vec3 vWorld;
uniform vec3 uLightDir;   // direction TO the light (normalized)
uniform vec3 uLightColor;
uniform vec3 uAmbient;
uniform vec3 uBaseColor;
uniform vec3 uCameraPos;
uniform float uOpacity;
void main() {
  vec3 N = normalize(vNormal);
  // two-sided cloth: flip normal toward the camera so the back face lights too
  vec3 V = normalize(uCameraPos - vWorld);
  if (dot(N, V) < 0.0) N = -N;
  float diff = max(dot(N, normalize(uLightDir)), 0.0);
  // a soft second fill light from below-left for depth
  vec3 fill = normalize(vec3(-0.4, -0.5, 0.3));
  float fillTerm = max(dot(N, fill), 0.0) * 0.25;
  vec3 col = uBaseColor * (uAmbient + uLightColor * (diff + fillTerm));
  // subtle rim for shape readability
  float rim = pow(1.0 - max(dot(N, V), 0.0), 3.0) * 0.15;
  col += rim;
  gl_FragColor = vec4(col, uOpacity);
}
`;

// Line + point program (shared): draws constraint lines, particles, normals.
const VERT_GENERIC = `
attribute vec3 aPos;
attribute vec3 aColor;
attribute float aSize;
uniform mat4 uProj;
uniform mat4 uView;
uniform float uPointSize;
varying vec3 vColor;
void main() {
  vColor = aColor;
  gl_Position = uProj * uView * vec4(aPos, 1.0);
  gl_PointSize = aSize * uPointSize;
}
`;

const FRAG_GENERIC = `
precision mediump float;
varying vec3 vColor;
void main() {
  gl_FragColor = vec4(vColor, 1.0);
}
`;

export class WebGLRenderer {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {object} sim  the Simulator (source of truth for geometry)
   */
  constructor(canvas, sim) {
    this.canvas = canvas;
    this.sim = sim;

    const attrs = {
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    };
    const gl = canvas.getContext('webgl', attrs) || canvas.getContext('experimental-webgl', attrs);
    if (!gl) throw new Error('WebGL not supported in this browser.');
    this.gl = gl;

    // ---- camera (orbit) ----
    this.target = [5, 4, 0];
    this.theta = 0.5;   // azimuth
    this.phi = 1.15;    // polar (from +Y)
    this.radius = 16;
    this.minRadius = 4;
    this.maxRadius = 60;

    this.proj = new Float32Array(16);
    this.view = new Float32Array(16);
    this.normalMat = new Float32Array(9);
    this.eye = [0, 0, 0];

    // ---- render options ----
    this.showSolid = true;
    this.showWireframe = false;
    this.showParticles = false;
    this.showConstraints = false;
    this.showPinned = true;
    this.showNormals = false;
    this.opacity = 1.0;
    this.baseColor = [0.86, 0.35, 0.32]; // warm red cloth

    this.lightDir = this._norm([0.4, 0.8, 0.5]);
    this.lightColor = [1.0, 0.98, 0.92];
    this.ambient = [0.22, 0.24, 0.28];

    this._compilePrograms();
    this._setupBackground();
    this.resize();
  }

  _norm(v) {
    const l = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / l, v[1] / l, v[2] / l];
  }

  _compile(vsSrc, fsSrc) {
    const gl = this.gl;
    const compile = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        throw new Error('Shader compile error: ' + gl.getShaderInfoLog(sh));
      }
      return sh;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vsSrc));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fsSrc));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error('Program link error: ' + gl.getProgramInfoLog(prog));
    }
    return prog;
  }

  _compilePrograms() {
    this.clothProg = this._compile(VERT_CLOTH, FRAG_CLOTH);
    this.genProg = this._compile(VERT_GENERIC, FRAG_GENERIC);
    this._cacheLocations();
  }

  _cacheLocations() {
    const gl = this.gl;
    const c = this.clothProg;
    this.loc = {
      cloth: {
        aPos: gl.getAttribLocation(c, 'aPos'),
        aNormal: gl.getAttribLocation(c, 'aNormal'),
        uProj: gl.getUniformLocation(c, 'uProj'),
        uView: gl.getUniformLocation(c, 'uView'),
        uNormalMat: gl.getUniformLocation(c, 'uNormalMat'),
        uLightDir: gl.getUniformLocation(c, 'uLightDir'),
        uLightColor: gl.getUniformLocation(c, 'uLightColor'),
        uAmbient: gl.getUniformLocation(c, 'uAmbient'),
        uBaseColor: gl.getUniformLocation(c, 'uBaseColor'),
        uCameraPos: gl.getUniformLocation(c, 'uCameraPos'),
        uOpacity: gl.getUniformLocation(c, 'uOpacity'),
      },
      gen: {
        aPos: gl.getAttribLocation(this.genProg, 'aPos'),
        aColor: gl.getAttribLocation(this.genProg, 'aColor'),
        aSize: gl.getAttribLocation(this.genProg, 'aSize'),
        uProj: gl.getUniformLocation(this.genProg, 'uProj'),
        uView: gl.getUniformLocation(this.genProg, 'uView'),
        uPointSize: gl.getUniformLocation(this.genProg, 'uPointSize'),
      },
    };
  }

  _setupBackground() {
    const gl = this.gl;
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  /** (Re)allocate dynamic buffers for the current cloth size. */
  _ensureBuffers() {
    const sim = this.sim;
    const c = sim.cloth;
    const gl = this.gl;
    const n = c.count;

    // interleave pos(3) + normal(3) per vertex for the cloth
    const stride = 6;
    this.clothBuf = this.clothBuf || gl.createBuffer();
    this.clothData = new Float32Array(n * stride);
    this.indexData = this._buildIndices(c.cols, c.rows);
    this.indexBuf = this.indexBuf || gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexData, gl.STATIC_DRAW);
    this.indexCount = this.indexData.length;

    // generic buffers (positions + colors + sizes) for lines/points
    this.lineBuf = this.lineBuf || gl.createBuffer();
    this.pointBuf = this.pointBuf || gl.createBuffer();
    // max sizes: constraints*2 verts, particles points
    this.maxLineVerts = c.constraintCount * 2;
    this.lineData = new Float32Array(this.maxLineVerts * 7); // pos3 color3 size1
    this.pointData = new Float32Array(n * 7);
  }

  _buildIndices(cols, rows) {
    const idx = [];
    for (let r = 0; r < rows - 1; r++) {
      for (let col = 0; col < cols - 1; col++) {
        const i00 = r * cols + col;
        const i10 = i00 + 1;
        const i01 = i00 + cols;
        const i11 = i01 + 1;
        idx.push(i00, i10, i11, i00, i11, i01);
      }
    }
    return new Uint16Array(idx);
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    const pw = Math.max(1, Math.round(w * dpr));
    const ph = Math.max(1, Math.round(h * dpr));
    if (this.canvas.width !== pw || this.canvas.height !== ph) {
      this.canvas.width = pw;
      this.canvas.height = ph;
    }
    this.gl.viewport(0, 0, pw, ph);
    this.aspect = pw / ph;
  }

  // ---- camera controls ----
  orbit(dTheta, dPhi) {
    this.theta += dTheta;
    this.phi = Math.min(Math.PI - 0.05, Math.max(0.05, this.phi + dPhi));
  }
  zoom(factor) {
    this.radius = Math.min(this.maxRadius, Math.max(this.minRadius, this.radius * factor));
  }
  _updateCamera() {
    const { theta, phi, radius, target } = this;
    const sp = Math.sin(phi), cp = Math.cos(phi);
    this.eye[0] = target[0] + radius * sp * Math.sin(theta);
    this.eye[1] = target[1] + radius * cp;
    this.eye[2] = target[2] + radius * sp * Math.cos(theta);
    mat4Perspective(this.proj, (45 * Math.PI) / 180, this.aspect, 0.1, 200);
    mat4LookAt(this.view, this.eye, target, [0, 1, 0]);
    mat3NormalFromMat4(this.normalMat, this.view);
  }

  /** Project a world point to NDC [-1,1] (for picking). Returns [x,y] or null if behind. */
  projectToNDC(p) {
    const v = this.view, pr = this.proj;
    const x = p[0], y = p[1], z = p[2];
    const cx = v[0] * x + v[4] * y + v[8] * z + v[12];
    const cy = v[1] * x + v[5] * y + v[9] * z + v[13];
    const cz = v[2] * x + v[6] * y + v[10] * z + v[14];
    const cw = v[3] * x + v[7] * y + v[11] * z + v[15];
    if (cw <= 0) return null;
    const px = pr[0] * cx + pr[4] * cy + pr[8] * cz + pr[12];
    const py = pr[1] * cx + pr[5] * cy + pr[9] * cz + pr[13];
    const pw = pr[3] * cx + pr[7] * cy + pr[11] * cz + pr[15];
    if (pw <= 0) return null;
    return [px / pw, py / pw];
  }

  /**
   * Build a world-space ray from an NDC point (ndcX, ndcY in [-1,1]).
   * Returns { origin: [x,y,z], dir: [x,y,z] (normalized) }.
   *
   * We unproject the NDC point at near and far clip depths through the inverse
   * view-projection matrix, then form a ray between the two world points.
   * The view matrix is a rigid transform (rotation + translation), so its
   * inverse is the transpose of the rotation plus the eye offset.
   */
  rayFromNDC(ndcX, ndcY) {
    const v = this.view, pr = this.proj;
    // Inverse of the view matrix: it's a rigid transform (rotation R + eye
    // translation), so view = [R | -R*eye]. Its inverse is [R^T | eye].
    const invView = new Float32Array(16);
    invView[0] = v[0]; invView[1] = v[4]; invView[2] = v[8]; invView[3] = 0;
    invView[4] = v[1]; invView[5] = v[5]; invView[6] = v[9]; invView[7] = 0;
    invView[8] = v[2]; invView[9] = v[6]; invView[10] = v[10]; invView[11] = 0;
    invView[12] = this.eye[0]; invView[13] = this.eye[1]; invView[14] = this.eye[2]; invView[15] = 1;
    const invProj = this._inv4(pr);
    // full inverse = invView * invProj
    const inv = new Float32Array(16);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let s = 0;
        for (let k = 0; k < 4; k++) s += invView[k * 4 + j] * invProj[i * 4 + k];
        inv[i * 4 + j] = s;
      }
    }
    const unproj = (z) => {
      const x = inv[0] * ndcX + inv[4] * ndcY + inv[8] * z + inv[12];
      const y = inv[1] * ndcX + inv[5] * ndcY + inv[9] * z + inv[13];
      const zz = inv[2] * ndcX + inv[6] * ndcY + inv[10] * z + inv[14];
      const w = inv[3] * ndcX + inv[7] * ndcY + inv[11] * z + inv[15];
      return [x / w, y / w, zz / w];
    };
    const pNear = unproj(-1);
    const pFar = unproj(1);
    let dx = pFar[0] - pNear[0], dy = pFar[1] - pNear[1], dz = pFar[2] - pNear[2];
    const l = Math.hypot(dx, dy, dz) || 1;
    dx /= l; dy /= l; dz /= l;
    return { origin: pNear, dir: [dx, dy, dz] };
  }

  /**
   * World-space point at distance `t` along the ray from an NDC point.
   * Used to place the drag target in front of the camera at the grabbed
   * particle's original depth so the cloth follows the pointer naturally.
   */
  rayPointAt(ndcX, ndcY, t) {
    const r = this.rayFromNDC(ndcX, ndcY);
    return [
      r.origin[0] + r.dir[0] * t,
      r.origin[1] + r.dir[1] * t,
      r.origin[2] + r.dir[2] * t,
    ];
  }

  _inv4(m) {
    const o = new Float32Array(16);
    const a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3];
    const a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7];
    const a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11];
    const a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15];
    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) return o;
    det = 1.0 / det;
    o[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    o[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    o[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    o[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    o[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    o[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    o[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    o[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    o[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    o[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    o[10] = (a30 * b04 - a31 * b02 - a33 * b00) * det;
    o[11] = (a21 * b02 - a20 * b04 + a23 * b00) * det;
    o[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    o[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    o[14] = (a31 * b01 - a30 * b03 + a32 * b00) * det;
    o[15] = (a20 * b03 - a21 * b01 - a22 * b00) * det;
    return o;
  }

  render() {
    const gl = this.gl;
    const sim = this.sim;
    const c = sim.cloth;

    this._updateCamera();

    // clear with a neutral gradient-ish solid (background set via clearColor)
    gl.clearColor(0.058, 0.066, 0.082, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this._ensureBuffers();
    this._uploadCloth();

    // ---- solid cloth ----
    if (this.showSolid) {
      gl.enable(gl.BLEND);
      gl.depthMask(this.opacity >= 1);
      gl.useProgram(this.clothProg);
      const L = this.loc.cloth;
      gl.uniformMatrix4fv(L.uProj, false, this.proj);
      gl.uniformMatrix4fv(L.uView, false, this.view);
      gl.uniformMatrix3fv(L.uNormalMat, false, this.normalMat);
      gl.uniform3fv(L.uLightDir, this.lightDir);
      gl.uniform3fv(L.uLightColor, this.lightColor);
      gl.uniform3fv(L.uAmbient, this.ambient);
      gl.uniform3fv(L.uBaseColor, this.baseColor);
      gl.uniform3fv(L.uCameraPos, this.eye);
      gl.uniform1f(L.uOpacity, this.opacity);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.clothBuf);
      gl.enableVertexAttribArray(L.aPos);
      gl.vertexAttribPointer(L.aPos, 3, gl.FLOAT, false, 24, 0);
      gl.enableVertexAttribArray(L.aNormal);
      gl.vertexAttribPointer(L.aNormal, 3, gl.FLOAT, false, 24, 12);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuf);
      gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
      gl.depthMask(true);
    }

    // ---- wireframe / constraints (lines) ----
    if (this.showWireframe || this.showConstraints) {
      gl.useProgram(this.genProg);
      const L = this.loc.gen;
      gl.uniformMatrix4fv(L.uProj, false, this.proj);
      gl.uniformMatrix4fv(L.uView, false, this.view);
      gl.uniform1f(L.uPointSize, 1);
      const count = this._fillLines();
      if (count > 0) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.lineBuf);
        gl.bufferData(gl.ARRAY_BUFFER, this.lineData.subarray(0, count * 7), gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(L.aPos);
        gl.vertexAttribPointer(L.aPos, 3, gl.FLOAT, false, 28, 0);
        gl.enableVertexAttribArray(L.aColor);
        gl.vertexAttribPointer(L.aColor, 3, gl.FLOAT, false, 28, 12);
        gl.enableVertexAttribArray(L.aSize);
        gl.vertexAttribPointer(L.aSize, 1, gl.FLOAT, false, 28, 24);
        gl.drawArrays(gl.LINES, 0, count);
      }
    }

    // ---- particles (points) ----
    if (this.showParticles || this.showPinned) {
      gl.useProgram(this.genProg);
      const L = this.loc.gen;
      gl.uniformMatrix4fv(L.uProj, false, this.proj);
      gl.uniformMatrix4fv(L.uView, false, this.view);
      gl.uniform1f(L.uPointSize, 90);
      const count = this._fillPoints();
      if (count > 0) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.pointBuf);
        gl.bufferData(gl.ARRAY_BUFFER, this.pointData.subarray(0, count * 7), gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(L.aPos);
        gl.vertexAttribPointer(L.aPos, 3, gl.FLOAT, false, 28, 0);
        gl.enableVertexAttribArray(L.aColor);
        gl.vertexAttribPointer(L.aColor, 3, gl.FLOAT, false, 28, 12);
        gl.enableVertexAttribArray(L.aSize);
        gl.vertexAttribPointer(L.aSize, 1, gl.FLOAT, false, 28, 24);
        gl.drawArrays(gl.POINTS, 0, count);
      }
    }

    // ---- normals debug ----
    if (this.showNormals) {
      gl.useProgram(this.genProg);
      const L = this.loc.gen;
      gl.uniformMatrix4fv(L.uProj, false, this.proj);
      gl.uniformMatrix4fv(L.uView, false, this.view);
      gl.uniform1f(L.uPointSize, 1);
      const count = this._fillNormals();
      if (count > 0) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.lineBuf);
        gl.bufferData(gl.ARRAY_BUFFER, this.lineData.subarray(0, count * 7), gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(L.aPos);
        gl.vertexAttribPointer(L.aPos, 3, gl.FLOAT, false, 28, 0);
        gl.enableVertexAttribArray(L.aColor);
        gl.vertexAttribPointer(L.aColor, 3, gl.FLOAT, false, 28, 12);
        gl.enableVertexAttribArray(L.aSize);
        gl.vertexAttribPointer(L.aSize, 1, gl.FLOAT, false, 28, 24);
        gl.drawArrays(gl.LINES, 0, count);
      }
    }
  }

  _uploadCloth() {
    const gl = this.gl;
    const c = this.sim.cloth;
    const n = c.count;
    const pos = c.pos;
    const nm = this.sim.normals;
    const d = this.clothData;
    for (let i = 0; i < n; i++) {
      const o = i * 3;
      const d3 = i * 6;
      d[d3] = pos[o];
      d[d3 + 1] = pos[o + 1];
      d[d3 + 2] = pos[o + 2];
      d[d3 + 3] = nm[o];
      d[d3 + 4] = nm[o + 1];
      d[d3 + 5] = nm[o + 2];
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.clothBuf);
    gl.bufferData(gl.ARRAY_BUFFER, d, gl.DYNAMIC_DRAW);
  }

  _fillLines() {
    const c = this.sim.cloth;
    const { pos, ca, cb, active, type } = c;
    const d = this.lineData;
    const n = c.constraintCount;
    // wireframe draws all; constraints draws all too but color-coded by type
    let v = 0;
    const colorFor = (t) =>
      t === 0 ? [0.35, 0.6, 1.0] : t === 1 ? [0.4, 1.0, 0.6] : [1.0, 0.7, 0.35];
    for (let i = 0; i < n; i++) {
      if (!active[i]) continue;
      const a = ca[i] * 3, b = cb[i] * 3;
      const col = colorFor(type[i]);
      d[v * 7] = pos[a]; d[v * 7 + 1] = pos[a + 1]; d[v * 7 + 2] = pos[a + 2];
      d[v * 7 + 3] = col[0]; d[v * 7 + 4] = col[1]; d[v * 7 + 5] = col[2]; d[v * 7 + 6] = 1;
      v++;
      d[v * 7] = pos[b]; d[v * 7 + 1] = pos[b + 1]; d[v * 7 + 2] = pos[b + 2];
      d[v * 7 + 3] = col[0]; d[v * 7 + 4] = col[1]; d[v * 7 + 5] = col[2]; d[v * 7 + 6] = 1;
      v++;
      if (v >= this.maxLineVerts) break;
    }
    return v;
  }

  _fillPoints() {
    const c = this.sim.cloth;
    const { pos, pinned } = c;
    const d = this.pointData;
    const n = c.count;
    let v = 0;
    for (let i = 0; i < n; i++) {
      const isPin = pinned[i] === 1;
      if (!this.showParticles && !isPin) continue;
      if (!this.showPinned && isPin) continue;
      const o = i * 3;
      d[v * 7] = pos[o]; d[v * 7 + 1] = pos[o + 1]; d[v * 7 + 2] = pos[o + 2];
      if (isPin) {
        d[v * 7 + 3] = 1.0; d[v * 7 + 4] = 0.85; d[v * 7 + 5] = 0.2;
        d[v * 7 + 6] = 1.6;
      } else {
        d[v * 7 + 3] = 0.95; d[v * 7 + 4] = 0.95; d[v * 7 + 5] = 0.95;
        d[v * 7 + 6] = 1.0;
      }
      v++;
    }
    return v;
  }

  _fillNormals() {
    const c = this.sim.cloth;
    const { pos } = c;
    const nm = this.sim.normals;
    const d = this.lineData;
    const n = c.count;
    let v = 0;
    const scale = 0.35;
    for (let i = 0; i < n; i++) {
      if (v >= this.maxLineVerts - 1) break;
      const o = i * 3;
      d[v * 7] = pos[o]; d[v * 7 + 1] = pos[o + 1]; d[v * 7 + 2] = pos[o + 2];
      d[v * 7 + 3] = 0.3; d[v * 7 + 4] = 0.9; d[v * 7 + 5] = 0.9; d[v * 7 + 6] = 1;
      v++;
      d[v * 7] = pos[o] + nm[o] * scale;
      d[v * 7 + 1] = pos[o + 1] + nm[o + 1] * scale;
      d[v * 7 + 2] = pos[o + 2] + nm[o + 2] * scale;
      d[v * 7 + 3] = 0.3; d[v * 7 + 4] = 0.9; d[v * 7 + 5] = 0.9; d[v * 7 + 6] = 1;
      v++;
    }
    return v;
  }
}
