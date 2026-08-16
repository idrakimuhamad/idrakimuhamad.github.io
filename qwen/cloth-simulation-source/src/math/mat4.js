// Minimal column-major mat4 / vec3 helpers (no dependencies).
// Column-major to match WebGL's uniformMatrix4fv / uniformMatrix3fv layout.

/** Column-major 4x4 identity. */
export function mat4Identity(out) {
  out.fill(0);
  out[0] = out[5] = out[10] = out[15] = 1;
  return out;
}

/**
 * Perspective projection (right-handed, clip z in [-1, 1]).
 * fovY in radians, near/far positive.
 */
export function mat4Perspective(out, fovY, aspect, near, far) {
  const f = 1.0 / Math.tan(fovY / 2);
  out.fill(0);
  out[0] = f / aspect;
  out[5] = f;
  out[10] = (far + near) / (near - far);
  out[11] = -1;
  out[14] = (2 * far * near) / (near - far);
  return out;
}

/**
 * LookAt view matrix (right-handed). eye, center, up are [x,y,z].
 */
export function mat4LookAt(out, eye, center, up) {
  let z0 = eye[0] - center[0];
  let z1 = eye[1] - center[1];
  let z2 = eye[2] - center[2];
  let len = Math.hypot(z0, z1, z2) || 1;
  z0 /= len; z1 /= len; z2 /= len;

  // x = normalize(cross(up, z))
  let x0 = up[1] * z2 - up[2] * z1;
  let x1 = up[2] * z0 - up[0] * z2;
  let x2 = up[0] * z1 - up[1] * z0;
  len = Math.hypot(x0, x1, x2) || 1;
  x0 /= len; x1 /= len; x2 /= len;

  // y = cross(z, x)
  const y0 = z1 * x2 - z2 * x1;
  const y1 = z2 * x0 - z0 * x2;
  const y2 = z0 * x1 - z1 * x0;

  out[0] = x0; out[1] = y0; out[2] = z0; out[3] = 0;
  out[4] = x1; out[5] = y1; out[6] = z1; out[7] = 0;
  out[8] = x2; out[9] = y2; out[10] = z2; out[11] = 0;
  out[12] = -(x0 * eye[0] + x1 * eye[1] + x2 * eye[2]);
  out[13] = -(y0 * eye[0] + y1 * eye[1] + y2 * eye[2]);
  out[14] = -(z0 * eye[0] + z1 * eye[1] + z2 * eye[2]);
  out[15] = 1;
  return out;
}

/** out = a * b (both column-major). */
export function mat4Multiply(out, a, b) {
  const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  for (let i = 0; i < 4; i++) {
    const b0 = b[i * 4], b1 = b[i * 4 + 1], b2 = b[i * 4 + 2], b3 = b[i * 4 + 3];
    out[i * 4]     = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[i * 4 + 1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[i * 4 + 2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[i * 4 + 3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  }
  return out;
}

/** Extract the upper-left 3x3 (normal matrix) into a column-major 9-float array. */
export function mat3NormalFromMat4(out, m) {
  // For rigid camera transforms (rotation + translation, no non-uniform
  // scale) the normal matrix is just the rotation part.
  out[0] = m[0]; out[1] = m[1]; out[2] = m[2];
  out[3] = m[4]; out[4] = m[5]; out[5] = m[6];
  out[6] = m[8]; out[7] = m[9]; out[8] = m[10];
  return out;
}
