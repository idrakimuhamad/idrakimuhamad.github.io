// Compress Tier-2 GLTF assets: Draco geometry + WebP texture recompress + cleanup.
// Reads assets-src/raw/*.glb, writes assets-src/models/*.glb
import { NodeIO } from '@gltf-transform/core';
import { KHRDracoMeshCompression } from '@gltf-transform/extensions';
import { draco, compressTexture, flatten, dedup, prune, simplifyPrimitive } from '@gltf-transform/functions';
import { createEncoderModule, createDecoderModule } from 'draco3d';
import { MeshoptSimplifier } from 'meshoptimizer';
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

// Large static environment meshes (trees + props) are decimated hard: the
// forest merges all tree instances into 3 draw calls (shared bark, pack
// leaves, pine leaves), but the whole scene must still stay light enough for
// the fixed-step sim to keep up at 4x on weak GPUs (SwiftShader in CI). The
// forest is small on screen and low-poly is the aesthetic, so a few hundred
// tris per tree/prop is plenty.
// ratio = target fraction of triangles, error = meshoptimizer deviation
// tolerance (fraction of the mesh's bounding-sphere radius). Values are the
// measured quality floors (scripts/tmp-sweep.mjs) — pushing further degrades
// silhouettes or the simplifier refuses (bush_4 is non-manifold).
const SIMPLIFY = {
  'tree_pack.glb': { ratio: 0.05, error: 0.1 },
  'pine_1.glb': { ratio: 0.1, error: 0.04 },
  'pine_2.glb': { ratio: 0.1, error: 0.04 },
  'pine_3.glb': { ratio: 0.1, error: 0.04 },
  'pine_4.glb': { ratio: 0.1, error: 0.04 },
  'pine_5.glb': { ratio: 0.1, error: 0.04 },
  'bush_1.glb': { ratio: 0.5, error: 0.15 },
  'bush_2.glb': { ratio: 0.3, error: 0.15 },
  'bush_3.glb': { ratio: 0.2, error: 0.2 },
  'bush_4.glb': { ratio: 0.3, error: 0.15 },
  'mushroom_2.glb': { ratio: 0.3, error: 0.15 },
  // Animated enemies (item #5) render as per-enemy SkinnedMeshes, so their
  // geometry is skinned every frame — decimate harder than the static ones.
  // meshoptimizer preserves the JOINTS/WEIGHT attributes through simplify.
  'enemy_basic.glb': { ratio: 0.25, error: 0.05 },
  'enemy_regen.glb': { ratio: 0.5, error: 0.06 },
  'enemy_swarm.glb': { ratio: 0.5, error: 0.06 },
};

// Enemy models that keep their skin/rig + a single walk clip so enemies play
// real limb animation (item #5). All other clips are dropped to keep the
// payload small. The value is a substring of the glTF animation name to keep.
// (The swarm/Bat has a fly clip but is a 50-count swarm, so it stays baked
// static + instanced — a skinned swarm would be ~250 draw calls.)
const KEEP_ANIM = {
  'enemy_basic.glb': 'Walk',        // Goblin  -> "...|Walk"
  'enemy_regen.glb': 'Slime_Walk',  // Slime   -> "Armature|Slime_Walk"
  'enemy_runner.glb': 'Run',        // Horse   -> "Armature|Run" (gallop)
  'enemy_tank.glb': 'Running',      // Skeleton -> "SkeletonArmature|Skeleton_Running"
  'enemy_armored.glb': 'Walking',   // Knight  -> "HumanArmature|Walking"
};

let totalIn = 0, totalOut = 0;
for (const f of readdirSync(rawDir).filter((x) => x.endsWith('.glb'))) {
  const inPath = join(rawDir, f);
  const outPath = join(outDir, f);
  const inSize = readFileSync(inPath).length;
  totalIn += inSize;
  const doc = await io.readBinary(readFileSync(inPath));
  // Decimate large static environment geometry before compression.
  const simp = SIMPLIFY[f];
  if (simp) {
    for (const mesh of doc.getRoot().listMeshes()) {
      for (const prim of mesh.listPrimitives()) {
        if (!prim.getIndices()) continue; // meshoptimizer needs indexed tris
        await simplifyPrimitive(prim, { simplifier: MeshoptSimplifier, ...simp });
      }
    }
  }
  const keepAnim = KEEP_ANIM[f];
  if (keepAnim) {
    // Keep the skin/rig + only the matching walk/fly clip; drop the rest.
    for (const anim of doc.getRoot().listAnimations()) {
      if (!anim.getName().includes(keepAnim)) anim.dispose();
    }
  } else {
    // Strip walk/run animations AND the skin/rig — enemies are rotated to face
    // their movement direction and render in bind pose, so the rig (the wolf
    // alone carried 51 joints + ~400 KB of animation clips) is dead weight.
    // Removing the skin makes GLTFLoader emit a plain Mesh in bind pose.
    for (const anim of doc.getRoot().listAnimations()) anim.dispose();
    for (const skin of doc.getRoot().listSkins()) skin.dispose();
  }
  // Recompress all textures to WebP (max 1024px, q82)
  for (const tex of doc.getRoot().listTextures()) {
    await compressTexture(tex, { targetFormat: 'webp', width: 1024, height: 1024, quality: 82 });
  }
  // Animated models keep their node hierarchy (the skin binds to the bone
  // tree), so skip flatten(); static models flatten as before.
  const transforms = keepAnim
    ? [dedup(), draco(), prune()]
    : [flatten(), dedup(), draco(), prune()];
  await doc.transform(...transforms);
  const outBuf = await io.writeBinary(doc);
  writeFileSync(outPath, outBuf);
  const outSize = outBuf.length;
  totalOut += outSize;
  console.log(`${f.padEnd(20)} ${(inSize/1024).toFixed(0).padStart(6)} KB -> ${(outSize/1024).toFixed(0).padStart(5)} KB  (-${(100-outSize/inSize*100).toFixed(0)}%)`);
}
console.log(`\nTOTAL: ${(totalIn/1024/1024).toFixed(2)} MB -> ${(totalOut/1024/1024).toFixed(2)} MB`);
