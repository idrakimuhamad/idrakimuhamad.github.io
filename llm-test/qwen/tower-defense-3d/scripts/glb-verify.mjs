// glb-verify.mjs <glb>
// Loads a GLB with GLTFLoader, checks skin/clip integrity, plays the clip,
// and reports: bone motion, foot ground clearance, overall bbox over the cycle.
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const f = process.argv[2];
const buf = readFileSync(f);
const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
const gltf = await new Promise((resolve, reject) =>
  new GLTFLoader().parse(ab, '', resolve, (e) => reject(e)),
);
const scene = gltf.scene;
scene.updateMatrixWorld(true);

console.log(`=== ${f} ===`);
console.log('animations:', gltf.animations.map((a) => `${a.name} (${a.duration.toFixed(3)}s)`));
let skinned = 0, bones = 0, tris = 0;
scene.traverse((o) => {
  if (o.isSkinnedMesh) { skinned++; tris += o.geometry.index ? o.geometry.index.count / 3 : 0; if (o.skeleton) bones = Math.max(bones, o.skeleton.bones.length); }
});
console.log(`skinnedMeshes=${skinned} bones=${bones} tris=${tris}`);

const clip = gltf.animations[0];
if (!clip) { console.log('NO CLIP'); process.exit(1); }
const mixer = new THREE.AnimationMixer(scene);
const action = mixer.clipAction(clip);
action.play();

// collect foot-ish bones (names containing Foot/Leg/Toe) and track min world y
const feet = [];
scene.traverse((o) => { if (o.isBone && /foot|leg|toe|hoof/i.test(o.name)) feet.push(o); });
let minFootY = Infinity, minMeshY = Infinity;
const box = new THREE.Box3();
const v = new THREE.Vector3();
const steps = 120;
let boneMoved = 0, boneStill = 0;
const before = new Map();
scene.traverse((o) => { if (o.isBone) { o.getWorldPosition(v); before.set(o, v.clone()); } });
for (let i = 0; i <= steps; i++) {
  scene.updateMatrixWorld(true);
  for (const ft of feet) { ft.getWorldPosition(v); minFootY = Math.min(minFootY, v.y); }
  box.setFromObject(scene);
  minMeshY = Math.min(minMeshY, box.min.y);
  if (i < steps) mixer.update(clip.duration / steps);
}
scene.updateMatrixWorld(true);
scene.traverse((o) => {
  if (o.isBone && before.has(o)) {
    o.getWorldPosition(v);
    if (v.distanceTo(before.get(o)) > 1e-6) boneMoved++; else boneStill++;
  }
});
box.setFromObject(scene);
const size = new THREE.Vector3();
box.getSize(size);
console.log(`bones moved=${boneMoved} still=${boneStill}`);
console.log(`min foot y over cycle: ${minFootY.toFixed(3)}   min mesh y: ${minMeshY.toFixed(3)}`);
console.log(`bbox size: (${size.x.toFixed(1)}, ${size.y.toFixed(1)}, ${size.z.toFixed(1)})  min=(${box.min.x.toFixed(1)}, ${box.min.y.toFixed(1)}, ${box.min.z.toFixed(1)})`);
// materials
const mats = new Set();
scene.traverse((o) => { if (o.isMesh) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => mats.add(`${m.name||m.type}:#${m.color?.getHexString?.() ?? '?'}`)); });
console.log('materials:', [...mats].join(' | '));
