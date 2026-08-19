// glb-verify-draco.mjs <glb>
// Loads a Draco-compressed GLB via @gltf-transform (same decoder the pipeline
// uses), verifies skin + animation survive compression. (three.js's
// DRACOLoader needs a Web Worker, so the in-browser path is covered by the
// Playwright smoke test instead.)
import { readFileSync } from 'node:fs';
import { NodeIO } from '@gltf-transform/core';
import { KHRDracoMeshCompression } from '@gltf-transform/extensions';
import { createDecoderModule } from 'draco3d';

const f = process.argv[2];
const io = new NodeIO()
  .registerDependencies({ 'draco3d.decoder': await createDecoderModule() })
  .registerExtensions([KHRDracoMeshCompression]);

const doc = await io.readBinary(readFileSync(f));
const root = doc.getRoot();
console.log(`=== ${f} ===`);
console.log('animations:', root.listAnimations().map((a) => `${a.getName()} (${a.listChannels().length} channels)`));
console.log('skins:', root.listSkins().map((s) => `${s.getName()} joints=${s.listJoints().length}`));
let tris = 0, skinnedPrims = 0;
for (const mesh of root.listMeshes()) {
  for (const prim of mesh.listPrimitives()) {
    const mode = prim.getMode();
    const pos = prim.getAttribute('POSITION');
    const idx = prim.getIndices();
    const n = idx ? idx.getCount() : pos.getCount();
    tris += n / 3;
    if (prim.listAttributes().JOINT) skinnedPrims++;
  }
}
console.log(`meshes=${root.listMeshes().length} nodes=${root.listNodes().length} tris=${tris} skinnedPrims=${skinnedPrims}`);
// materials
const mats = new Set();
for (const m of root.listMaterials()) {
  const c = m.getBaseColorFactor();
  mats.add(`${m.getName() || 'unnamed'}:rgba(${(c[0] * 255) | 0},${(c[1] * 255) | 0},${(c[2] * 255) | 0})`);
}
console.log('materials:', [...mats].join(' | '));
