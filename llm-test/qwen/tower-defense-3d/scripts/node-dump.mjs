// Dump each tower GLB's node/mesh hierarchy with per-mesh world bbox,
// and for the small "gun" meshes compute the barrel axis (PCA of their verts).
import { NodeIO } from '@gltf-transform/core';
import { KHRDracoMeshCompression } from '@gltf-transform/extensions';
import { createDecoderModule } from 'draco3d';

const io = new NodeIO()
  .registerDependencies({ 'draco3d.decoder': await createDecoderModule() })
  .registerExtensions([KHRDracoMeshCompression]);

function worldTransform(node) {
  const m = new Float64Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
  let n = node;
  const chain = [];
  while (n) { chain.push(n); n = n.parent; }
  for (let i = chain.length - 1; i >= 0; i--) {
    const nn = chain[i];
    const [tx, ty, tz] = nn.getTranslation() ?? [0,0,0];
    const [rx, ry, rz, rw] = nn.getRotation() ?? [0,0,0,1];
    const [sx, sy, sz] = nn.getScale() ?? [1,1,1];
    const x=rx,y=ry,z=rz,w=rw;
    const R = [
      1-2*(y*y+z*z), 2*(x*y-z*w), 2*(x*z+y*w),
      2*(x*y+z*w), 1-2*(x*x+z*z), 2*(y*z-x*w),
      2*(x*z-y*w), 2*(y*z+x*w), 1-2*(x*x+y*y),
    ];
    const nm = new Float64Array([
      R[0]*sx, R[1]*sx, R[2]*sx, 0,
      R[3]*sy, R[4]*sy, R[5]*sy, 0,
      R[6]*sz, R[7]*sz, R[8]*sz, 0,
      tx, ty, tz, 1,
    ]);
    const out = new Float64Array(16);
    for (let c=0;c<4;c++) for (let r=0;r<4;r++) {
      let sum=0;
      for (let k=0;k<4;k++) sum += nm[k*4+r]*m[c*4+k];
      out[c*4+r]=sum;
    }
    m.set(out);
  }
  return m;
}

for (const kind of ['tower_cannon','tower_mg','tower_sniper','tower_frost','tower_missile']) {
  const doc = await io.read(`assets-src/models/${kind}.glb`);
  const root = doc.getRoot();
  console.log(`\n=== ${kind}`);
  for (const node of root.listNodes()) {
    const mesh = node.getMesh();
    if (!mesh) continue;
    const T = worldTransform(node);
    const prims = mesh.listPrimitives();
    let allPts = [];
    let totalN = 0;
    for (const prim of prims) {
      const pos = prim.getAttribute('POSITION');
      if (!pos) continue;
      const arr = pos.getArray();
      for (let i = 0; i < arr.length; i += 3) {
        const x = arr[i], y = arr[i+1], z = arr[i+2];
        const px = T[0]*x + T[4]*y + T[8]*z + T[12];
        const py = T[1]*x + T[5]*y + T[9]*z + T[13];
        const pz = T[2]*x + T[6]*y + T[10]*z + T[14];
        allPts.push([px,py,pz]);
        totalN++;
      }
    }
    if (!allPts.length) continue;
    let minX=1e9,minY=1e9,minZ=1e9,maxX=-1e9,maxY=-1e9,maxZ=-1e9;
    for (const [x,y,z] of allPts) {
      if(x<minX)minX=x; if(x>maxX)maxX=x;
      if(y<minY)minY=y; if(y>maxY)maxY=y;
      if(z<minZ)minZ=z; if(z>maxZ)maxZ=z;
    }
    const dx=maxX-minX, dy=maxY-minY, dz=maxZ-minZ;
    // PCA on x/z for this mesh (barrel axis)
    let cx=0,cz=0;
    for (const [x,,z] of allPts) { cx+=x; cz+=z; }
    cx/=allPts.length; cz/=allPts.length;
    let sxx=0,szz=0,sxz=0;
    for (const [x,,z] of allPts) {
      const dxx=x-cx, dzz=z-cz;
      sxx+=dxx*dxx; szz+=dzz*dzz; sxz+=dxx*dzz;
    }
    sxx/=allPts.length; szz/=allPts.length; sxz/=allPts.length;
    const theta = 0.5*Math.atan2(2*sxz, sxx-szz);
    const eig = (sxx+szz)/2 + Math.sqrt(((sxx-szz)/2)**2 + sxz*sxz);
    const axisDeg = ((theta*180)/Math.PI + 540)%360 - 180;
    // farthest vertex direction (more robust for a single barrel)
    let far=[0,0], fr=-1;
    for (const [x,,z] of allPts) {
      const r=(x-cx)**2+(z-cz)**2;
      if (r>fr) { fr=r; far=[x-cx, z-cz]; }
    }
    const farDeg = (Math.atan2(far[1],far[0])*180)/Math.PI;
    console.log(`  node="${node.getName()||'(root)'}" n=${totalN} bbox x[${minX.toFixed(2)},${maxX.toFixed(2)}] y[${minY.toFixed(2)},${maxY.toFixed(2)}] z[${minZ.toFixed(2)},${maxZ.toFixed(2)}] dims ${dx.toFixed(2)}x${dy.toFixed(2)}x${dz.toFixed(2)} | PCA=${axisDeg.toFixed(1)}°(eig=${eig.toFixed(3)}) far=${farDeg.toFixed(1)}°`);
  }
}
