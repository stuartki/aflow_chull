import * as THREE from 'three';

// create 2D text
// used for axis names, element names
export function createText2D(text, color, font, size, segW, segH) {
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

export function colorVertex(vertex, gridHeight, color = '#787CB5', defaultColor = true) {
  let z;
  let c;
  if (defaultColor) {
    z = Math.abs(vertex.z / gridHeight);
    c = new THREE.Color();
    if (z < 0.1) {
      c.r = 1;
      c.g = 0.647;
      c.b = 0.0;
    } else {
      c.r = z * 0.30;
      c.g = z * 0.33;
      c.b = z;
    }
    return c;
  }
  c = new THREE.Color(color);
  if (vertex.z > 0) {
    return c;
  }
  z = 1 - Math.abs(vertex.z / gridHeight);
  const hsl = c.getHSL();

  c.setHSL(hsl.h, hsl.s, 1 - (hsl.l * z));
  return c;
}
