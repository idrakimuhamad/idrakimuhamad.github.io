/// <reference types="vite/client" />

// Vite `?url` asset imports resolve to the emitted file's URL (a string).
declare module '*.glb?url' {
  const url: string;
  export default url;
}
declare module '*.gltf?url' {
  const url: string;
  export default url;
}
