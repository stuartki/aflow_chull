import * as THREE from 'three';
import TrackballControls from './TrackballControls';
import Canvas2D from './Canvas2D';
import TernaryGrid from './TernaryGrid';
import TernaryAxis from './TernaryAxis';
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

    // grid attributes
    this.gridHeight = 300;
    this.gridMin = -1.0;
    this.gridMax = 1.0;
    this.triSide = 600;
    this.triMargin = 0;
    this.triHeight = (Math.sqrt(3) / (2)) * this.triSide;
    this.triCenter = this.triCoord(33, 33, 34);

    // this.axisTicks;
    // this.axisLabels;
    // this.axisName;
    this.pointCloud = null;
    this.intersectArray = [];
    // this.hullMesh;
    // this.elementA;
    // this.elementB;
    // this.elementC;
    // this.edges;
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Points.threshold = 15;
    // this.container;
    // this.width;
    // this.height;
    // this.camera;
    this.scene = new THREE.Scene();
    this.group = new THREE.Group();
    this.group.applyMatrix(
      new THREE.Matrix4().makeTranslation(-this.triCenter[0], -this.triCenter[1], 0),
    );
    // this.controls;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    // pointer
    const sphereGeometry = new THREE.SphereBufferGeometry(2, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    this.scene.add(this.sphere);
  }

  init(containerID) {
    this.container = document.getElementById(containerID);
    this.width = this.container.getBoundingClientRect().width;
    this.height = this.container.getBoundingClientRect().height;

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      1,
      10000,
    );
    this.camera.position.set(0, 0, 1500);

    this.camera.lookAt(this.scene.position);
    this.scene.add(this.camera);
    this.scene.add(this.group);

    this.controls = new TrackballControls(this.camera, this.container);
    this.controls.rotateSpeed = 1.0;


    // TODO: add tooltip stuff


    // Draw Triangular grid
    this.group.add(TernaryGrid(this.gridHeight, this.triSide, this.triMargin, this.triHeight));
    // Draw Axis Ticks
    this.group.add(TernaryAxis(-1.0, 1.0));
    // Draw hull mesh
    this.drawHull(this.hull);

    // if(this.showEntries) this.plotEntries(this.hull.entries);

    this.renderer.setClearColor(0xFFFFFF, 1);
    this.renderer.setSize(
      this.width,
      this.height,
    );
    this.container.appendChild(this.renderer.domElement);

    // eslint-disable-next-line max-len
    // window.addEventListener('keydown', this.onKeyDown.bind(this), false); // part of work in progress

    this.controls.addEventListener('change', () => this.render());
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

  triCoord(a, b, c) {
    let sum = [0, 0];
    const pos = [0, 0];
    const corners = [
      [this.triMargin, 0],
      [this.triSide + this.triMargin, 0],
      [(this.triSide / 2) + this.triMargin, this.triHeight + this.triMargin],
    ];
    sum = a + b + c;
    if (sum !== 0) {
      const x = a / sum;
      const y = b / sum;
      const z = c / sum;
      pos[0] = (corners[0][0] * x) + (corners[1][0] * y) + (corners[2][0] * z);
      pos[1] = (corners[0][1] * x) + (corners[1][1] * y) + (corners[2][1] * z);
    }
    return pos;
  }

  drawHull(data) {
    // console.log('passed data', hullData);
    const hullData = data;

    // clean previous elements
    this.group.remove(this.hullMesh);
    this.group.remove(this.elementA);
    this.group.remove(this.elementB);
    this.group.remove(this.elementC);
    this.scene.remove(this.edges);

    // ELEMENT TITLES
    let elemColor = this.color;
    if (this.defaultColor) {
      elemColor = '#FF0000';
    }
    this.elementA = Canvas2D(hullData.species[0], elemColor);
    this.elementA.position.set(-30, -30, 0);
    this.group.add(this.elementA);

    if (this.defaultColor) {
      elemColor = '#0000FF';
    }
    this.elementB = Canvas2D(hullData.species[1], elemColor);
    this.elementB.position.set(
      this.triCenter[0],
      this.triCenter[1] + (this.triSide / 2) + 70,
      0,
    );
    // this.elementB.position.x = this.triCenter[0];
    // this.elementB.position.y = this.triCenter[1] + this.triSide / 2 + 70;
    // this.elementB.position.z = 0;
    this.group.add(this.elementB);

    if (this.defaultColor) {
      elemColor = '#00FF00';
    }
    this.elementC = Canvas2D(hullData.species[2], elemColor);
    this.elementC.position.set(
      this.triSide + 30,
      // bottom is because midpoint is localized below midpoint
      this.triCenter[1] - (this.triSide / 3) - 10,
      0,
    );
    // this.elementC.position.x = this.triSide + 30;
    // this.elementC.position.y = this.triCenter[1] - this.triSide / 3 - 10;
    // this.elementC.position.z = 0;
    this.group.add(this.elementC);


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
      const triPos = this.triCoord(
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
      face.vertexColors[0] = this.colorVertex(geometry.vertices[face.a]);
      face.vertexColors[1] = this.colorVertex(geometry.vertices[face.b]);
      face.vertexColors[2] = this.colorVertex(geometry.vertices[face.c]);
    }

    this.hullMesh = new THREE.Mesh(geometry, material);
    // =======================  END DRAWING CONVEX HULL ==========================

    this.group.add(this.hullMesh);
    // COMMENTED OUT BELOW IS THE DECREPRED WAY TO DRAW EDGES
    // this.edges = new THREE.EdgesHelper(this.hullMesh, this.color, 0.05);
    // this.edges.material.linewidth = 2;
    const edgesGeometry = new THREE.EdgesGeometry(geometry, 0.05);
    this.edges = new THREE.LineSegments(
      edgesGeometry,
      new THREE.LineBasicMaterial({
        color: this.color,
        linewidth: 2,
      }),
    );
    this.group.add(this.edges);
  }


  plotEntries(data) {
    // clear points
    this.group.remove(this.pointCloud);

    const entries = this.filterByEnthalpy(data);

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
      const pCoord = this.triCoord(pX, pY, pZ);

      const datapoint = new THREE.Vector3(
        pCoord[0],
        pCoord[1],
        (entries[i].enthalpyFormationAtom * this.gridHeight),
      );
      let pointColor;
      if (this.defaultColor) {
        pointColor = new THREE.Color(pX / 100, pY / 100, pZ / 100);
      } else {
        pointColor = this.colorVertex(datapoint);
      }
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
    this.intersectArray = [];
    this.intersectArray.push(this.pointCloud);
    this.group.add(this.pointCloud);
  }

  updatePlottedEntries(data) {
    const entries = this.filterByEnthalpy(data);
    const positions = new Float32Array(entries.length * 3);
    const colors = new Float32Array(entries.length * 3);
    const sizes = new Float32Array(entries.length);

    const auids = [];
    // const sprite = THREE.ImageUtils.loadTexture('textures/disc.png');

    for (let i = 0; i < entries.length; i++) {
      const pX = entries[i].composition[0] * 100;
      const pY = entries[i].composition[2] * 100;
      const pZ = entries[i].composition[1] * 100;
      const pCoord = this.triCoord(pX, pY, pZ);

      const datapoint = new THREE.Vector3(
        pCoord[0],
        pCoord[1],
        (entries[i].enthalpyFormationAtom * this.gridHeight),
      );
      let pointColor;
      if (this.defaultColor) {
        pointColor = new THREE.Color(pX / 100, pY / 100, pZ / 100);
      } else {
        pointColor = this.colorVertex(datapoint);
      }
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

    this.pointCloud.geometry.attributes.size.set(sizes);
    this.pointCloud.geometry.attributes.size.needsUpdate = true;

    this.pointCloud.geometry.attributes.customColor.set(colors);
    this.pointCloud.geometry.attributes.customColor.needsUpdate = true;

    this.pointCloud.geometry.attributes.position.set(positions);
    this.pointCloud.geometry.attributes.position.needsUpdate = true;

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
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    this.render();
  }

  filterByEnthalpy(data) {
    return data.filter((row) => {
      let bool;
      if (row.enthalpyFormationAtom >= this.gridMin &&
          row.enthalpyFormationAtom <= this.gridMax) {
        bool = true;
      } else {
        bool = false;
      }
      return bool;
    });
  }

  colorVertex(vertex) {
    let z;
    let c;
    if (this.defaultColor) {
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
    c = new THREE.Color(this.color);
    if (vertex.z > 0) {
      return c;
    }
    z = 1 - Math.abs(vertex.z / this.gridHeight);
    const hsl = c.getHSL();

    c.setHSL(hsl.h, hsl.s, 1 - (hsl.l * z));
    return c;
  }

  findFacet(point) {
    function inEdge(pt, v1, v2) {
      const thisPoint = { x: pt[0], y: pt[1] };
      function distance(one, two) {
        const a = one.x - two.x;
        const b = one.y - two.y;
        // eslint-disable-next-line no-mixed-operators
        return Math.sqrt(a * a + b * b);
      }
      // eslint-disable-next-line no-mixed-operators
      if (distance(thisPoint, v1) + distance(thisPoint, v2) - distance(v2, v1) < 0.01) {
        return true;
      }
      return false;
    }

    function makeLine(v1, v2) {
      const geometry = new THREE.Geometry();
      geometry.vertices.push(
        v1, v2,
      );
      const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
      return new THREE.Line(geometry, material);
    }
    const faces = this.hullMesh.geometry.faces;
    const vertices = this.hullMesh.geometry.vertices;
    let vertex1;
    let vertex2;
    let vertex3;
    for (let i = 0; i < faces.length; i++) {
      vertex1 = vertices[faces[i].a];
      vertex2 = vertices[faces[i].b];
      vertex3 = vertices[faces[i].c];
      if (inEdge(point, vertex1, vertex2)) {
        this.group.add(makeLine(vertex1, vertex2));
      }
      if (inEdge(point, vertex2, vertex3)) {
        this.group.add(makeLine(vertex2, vertex3));
      }
      if (inEdge(point, vertex3, vertex1)) {
        this.group.add(makeLine(vertex3, vertex1));
      }
    }
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
      
      this.findFacet(this.pointCloud.geometry.attributes.position.array.slice(intersection.index * 3, intersection.index * 3 + 3));
    }
    this.render();
  }


  togglePointCloudVisibility(bool) {
    if (this.pointCloud) {
      this.pointCloud.visible = bool;
    }
  }

  toggleLabels(bool) {
    this.elementA.visible = bool;
    this.elementB.visible = bool;
    this.elementC.visible = bool;
    this.axisTicks.visible = bool;
    this.axisLabels.visible = bool;
    this.axisName.visible = bool;
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
      const auid = this.pointCloud.pointNames[intersects[0].index];
      // console.log('selecting point: ', auid );

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
    /*
    this.container.removeEventListener(
      'mousemove',
      this.onMouseMove.bind(this),
      false
    );
    */
    this.container.removeEventListener(
      'mousedown',
      this.onClick.bind(this),
      false,
    );
  }
}

export default TernaryHullRender;
