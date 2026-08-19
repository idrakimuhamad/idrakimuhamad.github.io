// gltf-to-glb.mjs <in.gltf> <out.glb> <keep-clip-name> [new-clip-name]
//
// Converts an unpacked glTF (e.g. from an itch.io GLTF zip) into a binary GLB,
// keeping ONLY the named animation clip (renamed to `new-clip-name` when given).
// All other clips are dropped — the game plays exactly one walk clip per enemy
// (see KEEP_ANIM in scripts/compress-assets.mjs), so the rest is dead weight.
//
// The rig/skin is kept untouched: animated enemies render as per-enemy
// SkinnedMeshes with an AnimationMixer (src/render/enemies3d.ts).
//
// Usage: node scripts/gltf-to-glb.mjs robot.gltf enemy_elite.glb walking Robot_Walk
import { NodeIO } from '@gltf-transform/core';
import { KHRMaterialsEmissiveStrength } from '@gltf-transform/extensions';
import { readFileSync, writeFileSync } from 'node:fs';

const [inPath, outPath, keepClip, newClipName] = process.argv.slice(2);
if (!inPath || !outPath || !keepClip) {
  console.error('usage: node scripts/gltf-to-glb.mjs <in.gltf> <out.glb> <keep-clip-name> [new-clip-name]');
  process.exit(1);
}

const io = new NodeIO().registerExtensions([KHRMaterialsEmissiveStrength]);
const doc = await io.read(inPath);

const kept = [];
for (const anim of doc.getRoot().listAnimations()) {
  if (anim.getName() === keepClip) {
    if (newClipName) anim.setName(newClipName);
    kept.push(anim);
  } else {
    anim.dispose();
  }
}
if (kept.length !== 1) {
  console.error(`expected exactly one animation named "${keepClip}", found: ${kept.length}`);
  process.exit(1);
}

const buf = await io.writeBinary(doc);
writeFileSync(outPath, buf);
console.log(`${inPath} -> ${outPath} (${(buf.length / 1024).toFixed(0)} KB), kept clip "${kept[0].getName()}"`);
