// Gridlock Defense 3D - entry point (Phase 0: blank scene)
import './style.css';
import * as THREE from 'three';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const holder = document.getElementById('canvas-holder') as HTMLDivElement;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0e18);

const camera = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 200);
camera.position.set(12, 20, 26);
camera.lookAt(12, 0, 8);

const sun = new THREE.DirectionalLight(0xffffff, 2.0);
sun.position.set(20, 30, 10);
scene.add(sun);
scene.add(new THREE.HemisphereLight(0x88aaff, 0x334422, 0.8));

// gray ground plane (24 x 16 world units)
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(24, 16),
  new THREE.MeshStandardMaterial({ color: 0x445544, roughness: 1 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.set(12, 0, 8);
scene.add(ground);

function resize() {
  const p = Math.min(window.innerWidth - 24, 1280);
  const m = Math.max(300, window.innerHeight - 24 - 150);
  const y = 960 / 640;
  let w = p;
  let h = w / y;
  if (h > m) { h = m; w = h * y; }
  holder.style.width = `${w}px`;
  holder.style.height = `${h}px`;
  const cw = holder.clientWidth;
  const ch = holder.clientHeight;
  renderer.setSize(cw, ch, false);
  camera.aspect = cw / ch;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
});
