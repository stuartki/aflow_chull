import * as THREE from 'three';
// import { colorVertex } from './helper';
// drawing points

export default class TernaryPoints {
  constructor(data, TGrid) {
    this.data = data;
    this.TGrid = TGrid;
  }

  plotEntries() {
    // clear points
    const entries = this.filterMinMaxGrid(this.data);

    // create new geometry
    const pointsGeometry = new THREE.BufferGeometry();

    const positions = new Float32Array(entries.length * 3);
    const colors = new Float32Array(entries.length * 3);
    const sizes = new Float32Array(entries.length);

    const auids = [];

    // const sprite = THREE.ImageUtils.loadTexture('textures/disc.png');

    for (let i = 0; i < entries.length; i++) {
      const pX = entries[i].composition[0] * 100;
      const pY = entries[i].composition[2] * 100;
      const pZ = entries[i].composition[1] * 100;
      const pCoord = this.TGrid.triCoord(pX, pY, pZ);

      const datapoint = new THREE.Vector3(
        pCoord[0],
        pCoord[1],
        (entries[i].enthalpyFormationAtom * this.TGrid.gridHeight),
      );
      let pointColor = new THREE.Color(pX / 100, pY / 100, pZ / 100);

      let size = 40;
      if (entries[i].isClicked) {
        pointColor = new THREE.Color('#CA6F96');
        size = 80;
      }
      datapoint.toArray(positions, i * 3);
      pointColor.toArray(colors, i * 3);
      sizes[i] = size;
      auids[i] = entries[i].auid;
    }

    pointsGeometry.addAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3),
    );
    pointsGeometry.addAttribute(
      'customColor',
      new THREE.BufferAttribute(colors, 3),
    );
    pointsGeometry.addAttribute(
      'size',
      new THREE.BufferAttribute(sizes, 1),
    );

    const fragmentShader = [
      'uniform vec3 color;',
      'uniform sampler2D texture;',
      'varying vec3 vColor;',
      'void main() {',
      ' gl_FragColor = vec4( color * vColor, 1.0 );',
      ' gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );',
      ' if ( gl_FragColor.a < ALPHATEST ) discard;',
      '}',
    ].join('\n');

    const vertexShader = [
      'attribute float size;',
      'attribute vec3 customColor;',
      'varying vec3 vColor;',
      'void main() {',
      '  vColor = customColor;',
      '  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
      '  gl_PointSize = size * ( 300.0 / -mvPosition.z );',
      '  gl_Position = projectionMatrix * mvPosition;',
      '}',
    ].join('\n');

    const texture = new THREE.TextureLoader().load('textures/ball.png');
    const pointsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color: { type: 'c', value: new THREE.Color(0xFFFFFF) },
        texture: { type: 't', value: texture },
      },
      vertexShader,
      fragmentShader,
      alphaTest: 0.9,
    });
    this.pointCloud = new THREE.Points(pointsGeometry, pointsMaterial);

    this.pointCloud.pointNames = auids;

    this.selectedPointCloud = new THREE.Points(pointsGeometry.clone(), pointsMaterial);
    this.selectedPointCloud.pointNames = auids;


    return this.pointCloud;
  }

  filterMinMaxGrid() {
    return this.data.filter((row) => {
      let bool;
      if (row.enthalpyFormationAtom >= this.TGrid.gridMin &&
          row.enthalpyFormationAtom <= this.TGrid.gridMax) {
        bool = true;
      } else {
        bool = false;
      }
      return bool;
    });
  }
}
