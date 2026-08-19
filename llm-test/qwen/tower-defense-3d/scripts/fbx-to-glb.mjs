// fbx-to-glb.mjs <fbx> <out.glb> <clip-substring>
// Converts a Quaternius FBX (flat-color, embedded rig) to GLB, keeping ONLY the
// matching animation clip (the game plays one walk/gallop cycle per enemy).
//
// Why this script exists (vs. just shipping the FBX):
//  - FBX material groups: Quaternius FBX files carry dozens of tiny material
//    groups per mesh (45 on the horse, 73 on the knight). GLTFExporter turns
//    each group into a primitive -> 45-73 draw calls per enemy. We rebuild the
//    geometry as one de-indexed chunk PER MATERIAL (2-3 primitives total).
//  - All-white vertex colors on the horse are dropped (material color is the
//    real color).
//  - Only the one clip we play is kept (the pipeline then keeps skin + clip).
//
// Usage: node scripts/fbx-to-glb.mjs in.fbx out.glb Walking
import { readFileSync, writeFileSync } from 'node:fs';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

// GLTFExporter reads its merged Blob through FileReader (browser API, absent
// in Node). Minimal polyfill over Blob.arrayBuffer().
if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((ab) => {
        this.result = ab;
        if (this.onloadend) this.onloadend();
      });
    }
    readAsDataURL(blob) {
      blob.arrayBuffer().then((ab) => {
        this.result = `data:${blob.type};base64,${Buffer.from(ab).toString('base64')}`;
        if (this.onloadend) this.onloadend();
      });
    }
  };
}

const [fbxPath, outPath, clipSub] = process.argv.slice(2);
if (!fbxPath || !outPath || !clipSub) {
  console.error('usage: fbx-to-glb.mjs <fbx> <out.glb> <clip-substring>');
  process.exit(1);
}

/**
 * Rebuild a skinned mesh as one de-indexed SkinnedMesh per material, so the
 * GLB has one primitive per material instead of one per FBX material group.
 * Returns [mesh] when there is nothing to split.
 */
function splitMeshByMaterial(mesh) {
  const geo = mesh.geometry;
  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  const groups = geo.groups.length
    ? geo.groups
    : [{ start: 0, count: geo.index ? geo.index.count : geo.attributes.position.count, materialIndex: 0 }];
  if (groups.length <= 1) return [mesh];

  const index = geo.index;
  const perMat = new Map(); // materialIndex -> vertex ids
  for (const g of groups) {
    const m = g.materialIndex;
    if (!perMat.has(m)) perMat.set(m, []);
    const arr = perMat.get(m);
    for (let i = g.start; i < g.start + g.count; i += 3) {
      for (let k = 0; k < 3; k++) arr.push(index ? index.getX(i + k) : i + k);
    }
  }

  const newMeshes = [];
  for (const [m, ids] of perMat) {
    if (ids.length === 0) continue;
    const ng = new THREE.BufferGeometry();
    for (const name of ['position', 'normal', 'uv']) {
      const src = geo.attributes[name];
      if (!src) continue;
      const out = new Float32Array(ids.length * src.itemSize);
      for (let i = 0; i < ids.length; i++) {
        const vi = ids[i];
        for (let c = 0; c < src.itemSize; c++) out[i * src.itemSize + c] = src.getComponent(vi, c);
      }
      ng.setAttribute(name, new THREE.BufferAttribute(out, src.itemSize));
    }
    const si = geo.attributes.skinIndex;
    const sw = geo.attributes.skinWeight;
    if (si && sw) {
      const outI = new Uint16Array(ids.length * 4);
      const outW = new Float32Array(ids.length * 4);
      for (let i = 0; i < ids.length; i++) {
        const vi = ids[i];
        for (let c = 0; c < 4; c++) {
          outI[i * 4 + c] = si.getComponent(vi, c);
          outW[i * 4 + c] = sw.getComponent(vi, c);
        }
      }
      ng.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(outI, 4));
      ng.setAttribute('skinWeight', new THREE.Float32BufferAttribute(outW, 4));
    }
    const mat = mats[m].clone();
    if (mat.vertexColors && !ng.attributes.color) mat.vertexColors = false;
    const nm = new THREE.SkinnedMesh(ng, mat);
    nm.name = `${mesh.name}_part${m}`;
    nm.position.copy(mesh.position);
    nm.quaternion.copy(mesh.quaternion);
    nm.scale.copy(mesh.scale);
    nm.bind(mesh.skeleton, mesh.bindMatrix);
    newMeshes.push(nm);
  }
  return newMeshes;
}

const buf = readFileSync(fbxPath);
const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
const scene = new FBXLoader().parse(ab, '');
scene.updateMatrixWorld(true);

// Split multi-group skinned meshes (see splitMeshByMaterial).
{
  const parent = scene;
  for (const child of [...parent.children]) {
    if (!child.isSkinnedMesh || child.geometry.groups.length <= 1) continue;
    const parts = splitMeshByMaterial(child);
    parent.remove(child);
    for (const p of parts) parent.add(p);
    console.log(`split "${child.name}" into ${parts.length} primitives`);
  }
}

const clip = scene.animations.find((a) => a.name.includes(clipSub));
if (!clip) {
  console.error(`clip "${clipSub}" not found. Available:`, scene.animations.map((a) => a.name));
  process.exit(1);
}
// Drop every other clip (the pipeline keeps skin + this one clip).
scene.animations = [clip];

// GLTFExporter needs unique node names (it references nodes by name in skins
// and animation paths). De-duplicate defensively.
{
  const seen = new Map();
  scene.traverse((o) => {
    if (!o.name) return;
    const n = seen.get(o.name) ?? 0;
    if (n > 0) o.name = `${o.name}_${n}`;
    seen.set(o.name, n + 1);
  });
}

const exporter = new GLTFExporter();
const glb = await exporter.parseAsync(scene, { binary: true, animations: [clip] });
writeFileSync(outPath, Buffer.from(glb));
console.log(`wrote ${outPath} (${(glb.byteLength / 1024).toFixed(1)} KB), clip "${clip.name}" (${clip.duration.toFixed(3)}s)`);
