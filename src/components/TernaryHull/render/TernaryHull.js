import * as THREE from 'three';
import axios from 'axios';
// import { colorVertex } from './helper';
// drawing hull


export default class TernaryHull {
  constructor(data, TGrid) {
    this.TGrid = TGrid;
    this.data = data;
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

  drawHull(data = this.data, init = true) {
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
      face.vertexColors[0] = this.colorVertex(geometry.vertices[face.a], this.TGrid.gridHeight);
      face.vertexColors[1] = this.colorVertex(geometry.vertices[face.b], this.TGrid.gridHeight);
      face.vertexColors[2] = this.colorVertex(geometry.vertices[face.c], this.TGrid.gridHeight);
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
        color: '#787CB5',
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

  stabilityCriterion(vertex) {
    const url = 'http://localhost:3000/data';

    axios.get(url).then((res) => {
      const vertices = res.data.facets_data;
      const newHullSet = [];
      Object.values(vertices).forEach(d =>
        d.forEach(e => e.vertices_auid.forEach(element => newHullSet.push(element))),
      );
      const scData = this.data.entries.filter(entry => newHullSet.includes(entry.auid));
      const scFaces = THREE.ShapeUtils.triangulateShape(scData);
      const hullData = { vertices: scData, faces: scFaces };

    });
  }

  n1EnthalpyGain() {
    const hullData = this.data.vertices;
    let minBHull1;
    let minBHull2;
    let minBHull3;
    let minHull;
    let minBHull;

    for (let i = 0; i < hullData.length; i++) {
      if (hullData[i].composition[0] === 0) {
        if (minBHull1 === undefined) {
          minBHull1 = hullData[i];
        } else if (minBHull1.enthalpyFormationAtom > hullData[i].enthalpyFormationAtom) {
          minBHull1 = hullData[i];
        }
      }
      if (hullData[i].composition[1] === 0) {
        if (minBHull2 === undefined) {
          minBHull2 = hullData[i];
        } else if (minBHull2.enthalpyFormationAtom > hullData[i].enthalpyFormationAtom) {
          minBHull2 = hullData[i];
        }
      }
      if (hullData[i].composition[2] === 0) {
        if (minBHull3 === undefined) {
          minBHull3 = hullData[i];
        } else if (minBHull3.enthalpyFormationAtom > hullData[i].enthalpyFormationAtom) {
          minBHull3 = hullData[i];
        }
      }
      if (minHull === undefined) {
        minHull = hullData[i];
      } else if (minHull.enthalpyFormationAtom > hullData[i].enthalpyFormationAtom) {
        minHull = hullData[i];
      }
    }
    const vertices = [minBHull1, minBHull2, minBHull3];
    this.hullGroup.add(this.drawHull({ vertices: [minBHull1, minBHull2, minBHull3], faces: [[0, 1, 2]] }, false));
    minBHull = minBHull1;
    vertices.forEach((v) => {
      if (minBHull.enthalpyFormationAtom > v.enthalpyFormationAtom) {
        minBHull = v;
      }
    });
    if (minBHull.enthalpyFormationAtom !== minHull.enthalpyFormationAtom) {
      this.minHull.isClicked = true;
    }
  }
}
