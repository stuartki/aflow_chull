import * as THREE from 'three';
import axios from 'axios';

import TrackballControls from './TrackballControls';
import TernaryGrid from './TernaryGrid';
import TernaryAxis from './TernaryAxis';
import TernaryHull from './TernaryHull';
import TernaryPoints from './TernaryPoints';

import MeshLine from './MeshLine';
// import OrbitControls from './OrbitControls';

class TernaryHullRender {
  constructor(hull, showEntries, defaultColor, pointClickHandler) {
    this.pointClickHandler = pointClickHandler;
    this.defaultColor = defaultColor;
    this.hull = hull;
    this.showEntries = showEntries;
    if (defaultColor) {
      this.color = '#787CB5';
    } else {
      this.color = this.hull.color;
    }

    // initialize grid, axis, hull classes
    // all scaling, gridHeights are connected in TGrid
    this.TGrid = new TernaryGrid();

    // all drawing of axis labels are in TAxis
    this.TAxis = new TernaryAxis(-1.0, 1.0, this.TGrid.gridHeight);

    // all hull faces and colors
    this.THull = new TernaryHull(this.hull, this.TGrid);

    // all plotting of points
    this.TPoints = new TernaryPoints(this.hull.entries, this.TGrid);

    // grid attributes
    this.gridMin = -1.0;
    this.gridMax = 1.0;

    this.pointCloud = null;
    this.intersectArray = [];

    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Points.threshold = 15;
    // this.container;
    // this.width;
    // this.height;
    // this.camera;
    this.scene = new THREE.Scene();
    this.group = new THREE.Group();
    this.lineGroup = new THREE.Group();
    // this.group.applyMatrix(
    //   new THREE.Matrix4().makeTranslation(-this.TGrid.triCenter[0], -this.TGrid.triCenter[1], 0),
    // );
    // this.controls;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    // pointer
    const sphereGeometry = new THREE.SphereBufferGeometry(2, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    this.scene.add(this.sphere);
  }

  init(containerID) {
    this.group.remove(this.group.children);

    this.container = document.getElementById(containerID);
    this.width = this.container.getBoundingClientRect().width;
    this.height = this.container.getBoundingClientRect().height;

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      1,
      10000,
    );

    this.setCamera('init');
    this.scene.add(this.camera);
    this.scene.add(this.group);

    // TODO: add tooltip stuff


    // ternary Axis needs hull data for elements
    // ternary grid is just a component, visual
    // Draw Triangular grid
    this.group.add(this.TGrid.drawGrid());
    // Draw Axis Ticks
    this.group.add(this.TAxis.drawAxis());
    // Draw Element names
    this.group.add(this.TAxis.drawThreeElements(this.hull.species));
    // Draw hull mesh
    this.group.add(this.THull.drawHull());
    // Draw Points
    if (this.showEntries) this.plotEntries();

    this.renderer.setClearColor(0xFFFFFF, 1);
    this.renderer.setSize(
      this.width,
      this.height,
    );
    this.container.appendChild(this.renderer.domElement);

    // eslint-disable-next-line max-len
    // window.addEventListener('keydown', this.onKeyDown.bind(this), false); // part of work in progress

    window.addEventListener('resize', this.onWindowResize.bind(this), false);

    this.container.addEventListener(
      'mousemove',
      this.onMouseMove.bind(this),
      false,
    );

    this.container.addEventListener(
      'mousedown',
      this.onClick.bind(this),
      false,
    );
    this.animate();
  }

  setCamera(type) {
    if (type === 'init') {
      this.camera.up = new THREE.Vector3(0, 1, 0);
      this.camera.position.set(this.TGrid.triCenter[0], this.TGrid.triCenter[1], 1000);
      this.controls = new TrackballControls(this.camera, this.container);
      this.controls.rotateSpeed = 1.0;
      // this.camera.lookAt(new THREE.Vector3(this.TGrid.triCenter[0], this.TGrid.triCenter[1], 0));
      this.controls.target = new THREE.Vector3(this.TGrid.triCenter[0], this.TGrid.triCenter[1], 0);
      this.controls.addEventListener('change', () => this.render());
    }
  }

  plotEntries() {
    this.group.remove(this.pointCloud);
    this.pointCloud = this.TPoints.plotEntries();
    this.intersectArray = [];
    this.intersectArray.push(this.pointCloud);
    this.group.add(this.pointCloud);
  }

  // slightly cleaned so that it only updates colors and sizes
  updatePlottedEntries(data, defaultBehavior) {
    const entries = this.TPoints.filterMinMaxGrid(data);
    this.lineGroup.remove(...this.lineGroup.children);
    const colors = new Float32Array(entries.length * 3);
    const sizes = new Float32Array(entries.length);
    const selectedData = [];
    let click = false;

    const auids = [];
    // const sprite = THREE.ImageUtils.loadTexture('textures/disc.png');

    for (let i = 0; i < entries.length; i++) {
      // const pX = entries[i].composition[0] * 100;
      // const pY = entries[i].composition[2] * 100;
      // const pZ = entries[i].composition[1] * 100;
      // const pCoord = this.TGrid.triCoord(pX, pY, pZ);

      // const datapoint = new THREE.Vector3(
      //   pCoord[0],
      //   pCoord[1],
      //   (entries[i].enthalpyFormationAtom * this.gridHeight),
      // );
      // let pointColor;
      // if (this.defaultColor) {
      //   pointColor = new THREE.Color(pX / 100, pY / 100, pZ / 100);
      // } else {
      //   pointColor = this.colorVertex(datapoint);
      // }
      let size = 40;
      let pointColor;
      if (entries[i].isClicked) {
        selectedData.push(i);
        click = true;
        pointColor = new THREE.Color('#CA6F96');
        size = 80;
      } else {
        // eslint-disable-next-line max-len
        pointColor = new THREE.Color(entries[i].composition[0], entries[i].composition[2], entries[i].composition[1]);
      }
      // datapoint.toArray(positions, i * 3);
      pointColor.toArray(colors, i * 3);
      sizes[i] = size;
      auids[i] = entries[i].auid;
    }

    if (defaultBehavior && click) {
      const sPositions = new Float32Array(entries.length * 3);
      const sColors = new Float32Array(entries.length * 3);
      const sSizes = new Float32Array(entries.length);
      const sAuids = [];
      for (let s = 0; s < selectedData.length; s++) {
        // const decompositionAuids = entries[selectedData[s]].decompositionAuids;
        // const decompositionPoints = this.entries.filter(d => decompositionAuids.includes(d.auid));
        const size = 80;
        const pointColor = new THREE.Color('#CA6F96');


        const spos = this.pointCloud.geometry.attributes.position.array.slice(
          selectedData[s] * 3, (selectedData[s] * 3) + 3,
        );
        for (let j = 0; j < 3; j++) {
          sPositions[s * 3 + j] = spos[j];
        }
        pointColor.toArray(sColors, s * 3);
        sSizes[s] = size;
        sAuids.push(entries[selectedData[s]].auid);

        // decompositionPoints.forEach((d) => {
        //   const pX = d.composition[0] * 100;
        //   const pY = d.composition[2] * 100;
        //   const pZ = d.composition[1] * 100;
        //   const pCoord = this.TGrid.triCoord(pX, pY, pZ);

        //   const datapoint = new THREE.Vector3(
        //     pCoord[0],
        //     pCoord[1],
        //     (d.enthalpyFormationAtom * this.TGrid.gridHeight),
        //   );
        //   let dpointColor;
        //   if (this.defaultColor) {
        //     dpointColor = new THREE.Color(pX / 100, pY / 100, pZ / 100);
        //   } else {
        //     dpointColor = this.colorVertex(datapoint);
        //   }
        //   dpointColor.toArray(sColors, s * 3);
        //   sSizes[s] = size;
        //   sAuids.push(entries[selectedData[s]].auid);
        // });
      }

      this.TPoints.selectedPointCloud.geometry.setDrawRange(0, selectedData.length);

      this.TPoints.selectedPointCloud.geometry.attributes.size.set(sSizes);
      this.TPoints.selectedPointCloud.geometry.attributes.size.needsUpdate = true;

      this.TPoints.selectedPointCloud.geometry.attributes.customColor.set(sColors);
      this.TPoints.selectedPointCloud.geometry.attributes.customColor.needsUpdate = true;

      this.TPoints.selectedPointCloud.geometry.attributes.position.set(sPositions);
      this.TPoints.selectedPointCloud.geometry.attributes.position.needsUpdate = true;

      this.TPoints.selectedPointCloud.pointNames = sAuids;

      this.group.remove(this.pointCloud);
      this.group.add(this.TPoints.selectedPointCloud);
      this.intersectArray = [];
      this.intersectArray.push(this.TPoints.selectedPointCloud);
    } else {
      this.group.remove(this.TPoints.selectedPointCloud);
      this.group.add(this.pointCloud);
      this.intersectArray = [this.pointCloud];
    }


    this.pointCloud.geometry.attributes.size.set(sizes);
    this.pointCloud.geometry.attributes.size.needsUpdate = true;

    this.pointCloud.geometry.attributes.customColor.set(colors);
    this.pointCloud.geometry.attributes.customColor.needsUpdate = true;

    // this.pointCloud.geometry.attributes.position.set(positions);
    // this.pointCloud.geometry.attributes.position.needsUpdate = true;

    this.pointCloud.pointNames = auids;
  }

  onWindowResize() {
    this.width = this.container.getBoundingClientRect().width;
    this.height = this.container.getBoundingClientRect().height;

    // this.windowHalfX = window.innerWidth / 2;
    // this.windowHalfY = window.innerHeight / 2;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    // this.camera.left = - this.windowHalfX;
    // this.camera.right = this.windowHalfX;
    // this.camera.top = this.windowHalfY;
    // this.camera.bottom = - this.windowHalfY;
    // this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    this.render();
  }

  findFacet(pointAuid) {

    function makeLine(v1, v2) {
      const geometry = new THREE.Geometry();
      geometry.vertices.push(
        v1, v2,
      );
      const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
      return new THREE.Line(geometry, material);
    }

    function hullDistance(endpoints, curX) {
      const m = (endpoints[1].y - endpoints[0].y) / (endpoints[1].x - endpoints[0].x);
      const b = endpoints[0].y - (m * endpoints[0].x);
      return ((m * curX) + b);
    }

    const pt = this.hull.entries.filter(d => d.auid === pointAuid)[0];

    const decompPoints = this.hull.entries.filter(d => pt.decompositionAuids.includes(d.auid));

    const faces = this.THull.hullMesh.geometry.faces;
    const vertices = this.THull.hullMesh.geometry.vertices;
    let vertex1;
    let vertex2;
    let vertex3;
    let newLine = null;
    const thisPoint = { x: point[0], y: point[1], z: point[2] };
    for (let i = 0; i < faces.length; i++) {
      vertex1 = vertices[faces[i].a];
      vertex2 = vertices[faces[i].b];
      vertex3 = vertices[faces[i].c];
      if (inEdge(point, vertex1, vertex2)) {
        this.group.add(makeLine(vertex1, vertex2));
        newLine = makeLine(thisPoint,
          {
            x: thisPoint.x,
            y: hullDistance([vertex1, vertex2], thisPoint.x),
          },
        );
        this.group.add(newLine);
      }
      if (inEdge(point, vertex2, vertex3)) {
        this.group.add(makeLine(vertex2, vertex3));
        newLine = makeLine(thisPoint,
          {
            x: thisPoint.x,
            y: hullDistance([vertex2, vertex3], thisPoint.x),
          },
        );
        this.group.add(newLine);
      }
      if (inEdge(point, vertex3, vertex1)) {
        this.group.add(makeLine(vertex3, vertex1));
        newLine = makeLine(thisPoint,
          {
            x: thisPoint.x,
            y: hullDistance([vertex3, vertex1], thisPoint.x),
          },
        );
        this.group.add(newLine);
      }
    }
  }

  distanceToHull(point) {
    function inTriangle(pt, vertices) {
      function sgn(p1, p2, p3) {
        // eslint-disable-next-line no-mixed-operators
        return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
      }

      const d1 = sgn(pt, vertices[0], vertices[1]);
      const d2 = sgn(pt, vertices[1], vertices[2]);
      const d3 = sgn(pt, vertices[2], vertices[0]);

      const hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
      const hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);

      return !(hasNeg && hasPos);
    }

    function makeLine(v1, v2) {
      const geometry = new THREE.Geometry();
      geometry.vertices.push(
        v1, v2,
      );
      geometry.computeLineDistances();
      const material = new THREE.LineDashedMaterial(
        {
          color: 0xff0000,
          linewidth: 100,
        });
      return new THREE.Line(geometry, material);
    }

    function hullPoint(normal, v1, curPoint) {
      const pt = curPoint.clone();
      const ptOnPlane = v1.clone();
      pt.add(ptOnPlane.multiplyScalar(-1));
      const b = normal.dot(pt);
      return new THREE.Vector3(curPoint.x, curPoint.y, curPoint.z - b / normal.z);
    }

    this.THull.hullMesh.geometry.computeFaceNormals();
    const faces = this.THull.hullMesh.geometry.faces;
    const vertices = this.THull.hullMesh.geometry.vertices;

    let vertex1;
    let vertex2;
    let vertex3;

    const thisPoint = { x: point[0], y: point[1], z: point[2] };
    for (let i = 0; i < faces.length; i++) {
      vertex1 = vertices[faces[i].a];
      vertex2 = vertices[faces[i].b];
      vertex3 = vertices[faces[i].c];
      if (inTriangle(thisPoint, [vertex1, vertex2, vertex3])) {
        const p = new THREE.Vector3(thisPoint.x, thisPoint.y, thisPoint.z);
        this.lineGroup.add(makeLine(p, hullPoint(faces[i].normal, vertex1, p)));
      }
    }
  }

  pointIndicator(auid) {
    function isBinPoint(entries, i) {
      const pX = !entries[i].composition[0];
      const pY = !entries[i].composition[2];
      const pZ = !entries[i].composition[1];

      return (pX || pY || pZ);
    }

    let index;
    for (let i = 0; i < this.hull.entries.length; i++) {
      if (auid === this.hull.entries[i].auid) {
        index = i;
      }
    }

    const isVertex = this.hull.entries[index].distanceToHull === 0;
    const isClicked = this.hull.entries[index].isClicked;
    if (isClicked && !isBinPoint(this.hull.entries, index) && !isVertex) {
      return 1;
    } else if (isClicked && isBinPoint(this.hull.entries, index) && isVertex) {
      return 2;
    } else if (isClicked && isVertex) {
      return 3;
    } else if (isClicked) {
      return 4;
    }
    return -1;
  }

  onMouseMove(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    const viewport = document.getElementById('viewport'); // boostrap fix
    // eslint-disable-next-line no-unused-vars
    const top = window.pageYOffset || document.documentElement.scrollTop;
    const left = window.pageXOffset || document.documentElement.scrollLeft;
    this.mouse.x = (
      // eslint-disable-next-line no-mixed-operators
      (event.clientX - this.renderer.domElement.offsetLeft - viewport.offsetLeft + left) /
      this.renderer.domElement.width
    // eslint-disable-next-line no-mixed-operators
    ) * 2 - 1; // NOTE: the +5 is a hack to get raycaster centered on point in nwjs
    this.mouse.y = -(
      (event.clientY - this.renderer.domElement.offsetTop - viewport.offsetTop) /
    // eslint-disable-next-line no-mixed-operators
    this.renderer.domElement.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersections = this.raycaster.intersectObjects(this.intersectArray);
    const intersection = (intersections.length) > 0 ? intersections[0] : null;

    if (intersection !== null) {
      this.sphere.position.copy(intersection.point);
      const auid = intersection.object.pointNames[intersection.index];
      const indicator = this.pointIndicator(auid);
      if (indicator === 1) {
        const index = this.pointCloud.pointNames.indexOf(auid);
        const pt = this.pointCloud.geometry.attributes.position.array.slice(index * 3, index * 3 + 3);
        this.distanceToHull(pt);
        this.group.add(this.lineGroup);
        // this.findFacet(auid);
      } else if (indicator === 3) {
        this.THull.stabilityCriterion(auid);
        let count = 0;
        while (this.THull.sc && count < 10) {
          setTimeout(() => {}, 100);
          count += 1;
        }
        this.group.add(this.THull.sc);
        this.THull.hullGroup.remove(this.THull.edges);
      }
    } else {
      this.group.remove(this.lineGroup);
      this.group.remove(this.THull.sc);
      this.THull.sc = undefined;
      this.lineGroup.remove(...this.lineGroup.children);
      this.THull.hullGroup.add(this.THull.edges);
    }
    this.render();
  }

  togglePointCloudVisibility(bool) {
    if (this.pointCloud) {
      this.pointCloud.visible = bool;
    }
  }

  toggleLabels(bool) {
    this.TAxis.setVisibility(bool);
  }

  onClick(event) {
    event.preventDefault();
    const viewport = document.getElementById('viewport'); // boostrap fix
    // eslint-disable-next-line no-unused-vars
    const top = window.pageYOffset || document.documentElement.scrollTop;
    const left = window.pageXOffset || document.documentElement.scrollLeft;
    // viewport for scrolls + domElement in respect to sidebar, etc. + already scrolled
    this.mouse.x = (
      // eslint-disable-next-line no-mixed-operators
      (event.clientX - this.renderer.domElement.offsetLeft - viewport.offsetLeft + left + 5) /
      this.renderer.domElement.width
    // eslint-disable-next-line no-mixed-operators
    ) * 2 - 1; // NOTE: the +5 is a hack to get raycaster centered on point in nwjs
    this.mouse.y = -(
      // eslint-disable-next-line no-mixed-operators
      // eslint-disable-next-line max-len
      (event.clientY - this.renderer.domElement.offsetTop - viewport.offsetTop + viewport.scrollTop) /
    // eslint-disable-next-line no-mixed-operators
    this.renderer.domElement.height) * 2 + 1;
    // update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera(this.mouse, this.camera);
    // console.log('mouse', this.mouse);
    // calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects(this.intersectArray);
    if (intersects.length > 0) {
      const auid = intersects[0].object.pointNames[intersects[0].index];
      const intersection = (intersects.length) > 0 ? intersects[0] : null;
      // console.log('selecting point: ', auid );
      this.pointClickHandler(auid);
      if (this.pointIndicator(auid) === 1) {
        const index = this.pointCloud.pointNames.indexOf(auid);
        const pt = this.pointCloud.geometry.attributes.position.array.slice(index * 3, index * 3 + 3);
        this.distanceToHull(pt);
        this.group.add(this.lineGroup);
      }

      // this.pointCloud.geometry.attributes.size.array[intersects[0].index] = 80;
      // this.pointCloud.geometry.attributes.size.needsUpdate = true;
    }
  }

  onContextMenu(event) {
    event.preventDefault();
    const viewport = document.getElementById('viewport'); // boostrap fix
    // eslint-disable-next-line no-unused-vars
    const top = window.pageYOffset || document.documentElement.scrollTop;
    const left = window.pageXOffset || document.documentElement.scrollLeft;
    // viewport for scrolls + domElement in respect to sidebar, etc. + already scrolled
    this.mouse.x = (
      // eslint-disable-next-line no-mixed-operators
      (event.clientX - this.renderer.domElement.offsetLeft - viewport.offsetLeft + left + 5) /
      this.renderer.domElement.width
    // eslint-disable-next-line no-mixed-operators
    ) * 2 - 1; // NOTE: the +5 is a hack to get raycaster centered on point in nwjs
    this.mouse.y = -(
      // eslint-disable-next-line no-mixed-operators
      // eslint-disable-next-line max-len
      (event.clientY - this.renderer.domElement.offsetTop - viewport.offsetTop + viewport.scrollTop) /
    // eslint-disable-next-line no-mixed-operators
    this.renderer.domElement.height) * 2 + 1;
    // update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera(this.mouse, this.camera);
    // console.log('mouse', this.mouse);
    // calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects(this.intersectArray);
    if (intersects.length > 0) {
      const auid = this.pointCloud.pointNames[intersects[0].index];
      const intersection = (intersects.length) > 0 ? intersects[0] : null;
      // console.log('selecting point: ', auid );
      if (this.pointIndicator(intersection)) {
        const pt = this.pointCloud.geometry.attributes.position.array.slice(intersection.index * 3, intersection.index * 3 + 3);
        this.distanceToHull(pt);
        this.group.add(this.lineGroup);
      }
      this.pointClickHandler(auid);

      // this.pointCloud.geometry.attributes.size.array[intersects[0].index] = 80;
      // this.pointCloud.geometry.attributes.size.needsUpdate = true;
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  animate() {
    this.render();
    this.controls.update();
    requestAnimationFrame(() => this.animate());
  }

  // ****************** WORK IN PROGRESS **************************
  /*
  onKeyDown(event) {

    if (event.keyCode === 65) {
      const polar = this.toPolar(
        this.camera.position.x,
        this.camera.position.y,
        this.camera.position.z
      );
      const newPos = this.polarToVector3(polar.phi + 0.01, polar.theta, polar.radius);

      this.camera.position.set(
        newPos.x,
        newPos.y,
        newPos.z
      );


      // this.group.rotateY(0.01);
    }
    if (event.keyCode === 68) {
      const polar = this.toPolar(
        this.camera.position.x,
        this.camera.position.y,
        this.camera.position.z
      );
      const newPos = this.polarToVector3(polar.phi - 0.01, polar.theta, polar.radius);

      this.camera.position.set(
        newPos.x,
        newPos.y,
        newPos.z
      );
    }

    if (event.keyCode === 87) {
      // this.group.rotateX(0.01);
      // this.camera.rotateOnAxis(xAxis, -0.1);
    }
    if (event.keyCode === 83) {
      // this.group.rotateX(-0.01);
      // this.camera.rotateOnAxis(xAxis, 0.1);
    }
  }

  toPolar(x, y, z) {
    const sqrd = (x * x) + (y * y) + (z * z);
    const radius = Math.pow(sqrd, 0.5);
    const phi = Math.acos(z / radius);
    const theta = Math.atan2(y, x);
    const toReturn = {
      radius,
      theta,
      phi,
    };
    return toReturn;
  }


  polarToVector3(phi, theta, radius) {
    // var phi = (lat)*Math.PI/180;
    // var theta = (lon-180)*Math.PI/180;

    var x = (radius) * Math.sin(phi) * Math.cos(theta);
    var y = (radius) * Math.sin(phi) * Math.sin(theta);
    var z = (radius) * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
    }

    // ***************** END WORK IN PROGRESS ************************
    */

  destory() {
    /*
    this.renderer.forceContextLoss();
    this.renderer.context = null;
    this.renderer.domElement = null;
    this.renderer = null;

    this.renderer.domElement.addEventListener('dblclick', null, false); //remove listener to render
    this.scene = null;
    this.camera = null;
    this.controls = null;

    while(this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    */
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
  }

  removeEventListeners() {
    this.controls.removeEventListener('change', () => this.render());
    window.removeEventListener('resize', this.onWindowResize.bind(this), false);
    this.container.removeEventListener(
      'mousemove',
      this.onMouseMove.bind(this),
      false,
    );
    this.container.removeEventListener(
      'mousedown',
      this.onClick.bind(this),
      false,
    );
  }
}

export default TernaryHullRender;
