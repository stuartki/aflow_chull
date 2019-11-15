import * as THREE from 'three';
// import { colorVertex } from './helper';
// drawing hull

export default class TernaryHull {
  constructor(data, TGrid) {
    this.data = data;
    this.TGrid = TGrid;

    this.gridHeight = this.TGrid.gridHeight;
    this.hullGroup = new THREE.Group();
  }

  colorVertex(vertex, color = '#787CB5', defaultColor = true) {
    let z;
    let c;
    if (defaultColor) {
      z = Math.abs(vertex.z / this.gridHeight);
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
    z = 1 - Math.abs(vertex.z / this.gridHeight);
    const hsl = c.getHSL();

    c.setHSL(hsl.h, hsl.s, 1 - (hsl.l * z));
    return c;
  }

  drawHull() {
    const hullData = this.data;

    // ski - I dont believe this is necessary after cleaning at init
    // clean previous elements
    // this.group.remove(this.hullMesh);
    // this.group.remove(this.elementA);
    // this.group.remove(this.elementB);
    // this.group.remove(this.elementC);
    // this.scene.remove(this.edges);

    // ============ DRAWING CONVEX HULL USING FACES ===================
    const geometry = new THREE.Geometry();
    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      vertexColors: THREE.VertexColors,
      opacity: 0.40, // orig 0.25
      transparent: true,
      depthWrite: false, // FIXES TOOLTIP VISIBILITY WHEN WITHIN HULL
      depthTest: false,   // FIXES TOOLTIP VISIBILITY WHEN WITHIN HULL
    });

    // ONLY VERTICES
    for (let i = 0; i < hullData.vertices.length; i++) {
      // resetting vertices height to 0 for the sake of visualization?
      if (hullData.vertices[i].composition[0] === 1 ||
          hullData.vertices[i].composition[1] === 1 ||
          hullData.vertices[i].composition[2] === 1) {
        hullData.vertices[i].enthalpyFormationAtom = 0.0;
      }
      const triPos = this.TGrid.triCoord(
        hullData.vertices[i].composition[0],
        hullData.vertices[i].composition[2],
        hullData.vertices[i].composition[1],
      );
      geometry.vertices.push(
        new THREE.Vector3(
          triPos[0],
          triPos[1],
          hullData.vertices[i].enthalpyFormationAtom * this.gridHeight,
        ),
      );
    }

    for (let i = 0; i < hullData.faces.length; i++) {
      geometry.faces.push(
        new THREE.Face3(
          hullData.faces[i][0],
          hullData.faces[i][1],
          hullData.faces[i][2],
        ),
      );
    }

    for (let i = 0; i < geometry.faces.length; ++i) {
      const face = geometry.faces[i];
      face.vertexColors[0] = this.colorVertex(geometry.vertices[face.a], this.TGrid.gridHeight);
      face.vertexColors[1] = this.colorVertex(geometry.vertices[face.b], this.TGrid.gridHeight);
      face.vertexColors[2] = this.colorVertex(geometry.vertices[face.c], this.TGrid.gridHeight);
    }

    this.hullMesh = new THREE.Mesh(geometry, material);
    this.hullGroup.add(this.hullMesh);
    // =======================  END DRAWING CONVEX HULL ==========================
    // COMMENTED OUT BELOW IS THE DECREPRED WAY TO DRAW EDGES
    // this.edges = new THREE.EdgesHelper(this.hullMesh, this.color, 0.05);
    // this.edges.material.linewidth = 2;
    const edgesGeometry = new THREE.EdgesGeometry(geometry, 0.05);
    this.edges = new THREE.LineSegments(
      edgesGeometry,
      new THREE.LineBasicMaterial({
        color: '#787CB5',
        linewidth: 2,
      }),
    );
    this.hullGroup.add(this.edges);
    return this.hullGroup;
  }
}
