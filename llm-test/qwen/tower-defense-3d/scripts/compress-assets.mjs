// Compress Tier-2 GLTF assets: Draco geometry + WebP texture recompress + cleanup.
// Reads assets-src/raw/*.glb, writes assets-src/models/*.glb
import { NodeIO } from '@gltf-transform/core';
import { KHRDracoMeshCompression } from '@gltf-transform/extensions';
import { draco, compressTexture, flatten, dedup, prune } from '@gltf-transform/functions';
import { createEncoderModule, createDecoderModule } from 'draco3d';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const rawDir = join(root, 'assets-src', 'raw');
const outDir = join(root, 'assets-src', 'models');

const io = new NodeIO()
  .registerDependencies({
    'draco3d.decoder': await createDecoderModule(),
    'draco3d.encoder': await createEncoderModule(),
  })
  .registerExtensions([KHRDracoMeshCompression]);

let totalIn = 0, totalOut = 0;
for (const f of readdirSync(rawDir).filter((x) => x.endsWith('.glb'))) {
  const inPath = join(rawDir, f);
  const outPath = join(outDir, f);
  const inSize = readFileSync(inPath).length;
  totalIn += inSize;
  const doc = await io.readBinary(readFileSync(inPath));
  // Strip walk/run animations AND the skin/rig — enemies are rotated to face
  // their movement direction and render in bind pose, so the rig (the wolf
  // alone carried 51 joints + ~400 KB of animation clips) is dead weight.
  // Removing the skin makes GLTFLoader emit a plain Mesh in bind pose.
  for (const anim of doc.getRoot().listAnimations()) anim.dispose();
  for (const skin of doc.getRoot().listSkins()) skin.dispose();
  // Recompress all textures to WebP (max 1024px, q82)
  for (const tex of doc.getRoot().listTextures()) {
    await compressTexture(tex, { targetFormat: 'webp', width: 1024, height: 1024, quality: 82 });
  }
  await doc.transform(flatten(), dedup(), draco(), prune());
  const outBuf = await io.writeBinary(doc);
  writeFileSync(outPath, outBuf);
  const outSize = outBuf.length;
  totalOut += outSize;
  console.log(`${f.padEnd(20)} ${(inSize/1024).toFixed(0).padStart(6)} KB -> ${(outSize/1024).toFixed(0).padStart(5)} KB  (-${(100-outSize/inSize*100).toFixed(0)}%)`);
}
console.log(`\nTOTAL: ${(totalIn/1024/1024).toFixed(2)} MB -> ${(totalOut/1024/1024).toFixed(2)} MB`);
