import * as THREE from 'three';

// create 2D text
// used for axis names, element names
export default function createText2D(text, color, font, size, segW, segH) {
  function createTextCanvas() {
    const textSize = size || 64;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const fontStr = `${textSize}px ${font || 'Arial'}`;
    ctx.font = fontStr;
    const w = ctx.measureText(text).width;
    const h = Math.ceil(textSize);
    canvas.width = w;
    canvas.height = h;
    ctx.font = fontStr;
    ctx.fillStyle = color || 'black';
    ctx.fillText(text, 0, Math.ceil(textSize * 0.8));
    return canvas;
  }
  const canvas = createTextCanvas(text, color, font, size);
  const plane = new THREE.PlaneGeometry(
      canvas.width,
      canvas.height,
      segW,
      segH,
    );
  const tex = new THREE.Texture(canvas);
  tex.needsUpdate = true;
  const planeMat = new THREE.MeshBasicMaterial({
    map: tex,
    color: 0xffffff,
    transparent: true,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(plane, planeMat);
  mesh.scale.set(0.5, 0.5, 0.5);
  mesh.doubleSided = true;
  return mesh;
}
