import * as THREE from 'three';
import axios from 'axios';
// import { colorVertex } from './helper';
// drawing hull


export default class TernaryHull {
  constructor(data, TGrid) {
    this.TGrid = TGrid;
    this.data = data;
    this.gridHeight = this.TGrid.gridHeight;
    this.n1EG = undefined;
    this.sc = undefined;
    this.hullGroup = new THREE.Group();
  }

  colorVertex(vertex, defaultColor = true, color = '#787CB5') {
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

  drawHull(data = this.data, defaultColor = true, init = true) {
    const hullData = data;

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
      face.vertexColors[0] = this.colorVertex(geometry.vertices[face.a], defaultColor);
      face.vertexColors[1] = this.colorVertex(geometry.vertices[face.b], defaultColor);
      face.vertexColors[2] = this.colorVertex(geometry.vertices[face.c], defaultColor);
    }

    const hullMesh = new THREE.Mesh(geometry, material);
    const hullGroup = new THREE.Group();
    hullGroup.add(hullMesh);
    // =======================  END DRAWING CONVEX HULL ==========================
    // COMMENTED OUT BELOW IS THE DECREPRED WAY TO DRAW EDGES
    // this.edges = new THREE.EdgesHelper(this.hullMesh, this.color, 0.05);
    // this.edges.material.linewidth = 2;
    const edgesGeometry = new THREE.EdgesGeometry(geometry, 0.05);
    const edges = new THREE.LineSegments(
      edgesGeometry,
      new THREE.LineBasicMaterial({
        color: '#000000',
        linewidth: 2,
      }),
    );
    hullGroup.add(edges);
    if (init) {
      this.hullGroup = hullGroup;
      this.hullMesh = hullMesh;
      this.edges = edges;
    }
    return hullGroup;
  }

  stabilityCriterion(vertexAuid) {
    const f = this.data.vertices.filter(t => t.auid === vertexAuid);
    const thisSSHullVertices = f.length > 0 ? f[0].ssHullVertices : null;
    const thisSSHullFaces = f.length > 0 ? f[0].ssHullFaces : null;
    if (this.sc === undefined) {
      // const vertices = res.data.facets_data;
      // const newHullSet = [];
      // Object.values(vertices).forEach(d =>
      //   d.forEach(e => e.vertices_auid.forEach(element => newHullSet.push(element))),
      // );
      // const scData = this.data.entries.filter(entry => newHullSet.includes(entry.auid));
      // const scFaces = THREE.ShapeUtils.triangulateShape(scData);
      const hullData = { vertices: thisSSHullVertices, faces: thisSSHullFaces };
      this.sc = this.drawHull(hullData, false, false);
    }
  }

  n1EnthalpyGain(vertexAuid) {
    if (this.n1EG === undefined) {
      const hullData = { vertices: this.data.n1HullVertices, faces: this.data.n1HullFaces };
      this.n1EG = this.drawHull(hullData, false, false);
      this.hullGroup.add(this.n1EG);
      this.hullGroup.remove(this.edges);
      this.hullGroup.remove(this.hullMesh);
    } else {
      this.hullGroup.remove(this.n1EG);
      this.hullGroup.add(this.edges);
      this.hullGroup.add(this.hullMesh);
      this.n1EG = undefined;
    }
  }
}
