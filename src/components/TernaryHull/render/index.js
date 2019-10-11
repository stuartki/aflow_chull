import * as THREE from 'three';
import TrackballControls from './TrackballControls';


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
      new THREE.Matrix4().makeTranslation(
        - this.triCenter[0],
        - this.triCenter[1],
        0
      )
    );
    // this.controls;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
  }

  init(containerID) {
    this.container = document.getElementById(containerID);
    this.width = this.container.getBoundingClientRect().width;
    this.height = this.container.getBoundingClientRect().height;

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      1,
      10000
    );
    this.camera.position.set(0, 0, 1500);

    this.camera.lookAt(this.scene.position);
    this.scene.add(this.camera);
    this.scene.add(this.group);

    this.controls = new TrackballControls(this.camera, this.container);
    this.controls.rotateSpeed = 1.0;


    // TODO: add tooltip stuff


    // Draw Triangular grid
    this.drawGrid();
    // Draw Axis Ticks
    this.drawAxis(-1.0, 1.0);
    // Draw hull mesh
    this.drawHull(this.hull);

    // if(this.showEntries) this.plotEntries(this.hull.entries);

    this.renderer.setClearColor(0xFFFFFF, 1);
    this.renderer.setSize(
      this.width,
      this.height
    );
    this.container.appendChild(this.renderer.domElement);

    // window.addEventListener('keydown', this.onKeyDown.bind(this), false); // part of work in progress

    this.controls.addEventListener('change', () => this.render());
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
    /*
    this.container.addEventListener(
      'mousemove',
      this.onMouseMove.bind(this),
      false
    );
    */
    this.container.addEventListener(
      'mousedown',
      this.onClick.bind(this),
      false
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
      pos[0] = corners[0][0] * x + corners[1][0] * y + corners[2][0] * z;
      pos[1] = corners[0][1] * x + corners[1][1] * y + corners[2][1] * z;
    }
    return pos;
  }

  createTextCanvas(text, color, font, size) {
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

  createText2D(text, color, font, size, segW, segH) {
    const canvas = this.createTextCanvas(text, color, font, size);
    const plane = new THREE.PlaneGeometry(
      canvas.width,
      canvas.height,
      segW,
      segH
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

  drawGrid() {
    // ++++++++++++++++++ DRAWING TRIANGULAR GRID ++++++++++++++++++++++++++++++
    //        this can be cleaner but for now it will do...

    const material = new THREE.LineBasicMaterial({
      color: 0x000000,
    });

    const gridLowerGeometry = new THREE.Geometry();
    gridLowerGeometry.vertices.push(
      new THREE.Vector3(0, 0, - this.gridHeight)
    );
    gridLowerGeometry.vertices.push(
      new THREE.Vector3(
        (this.triSide / 2) + this.triMargin,
        this.triHeight + this.triMargin,
        - this.gridHeight
      )
    );
    gridLowerGeometry.vertices.push(
      new THREE.Vector3(
        this.triSide + this.triMargin,
        0,
        - this.gridHeight
      )
    );
    gridLowerGeometry.vertices.push(
      new THREE.Vector3(0, 0, - this.gridHeight)
    );

    const gridMidGeometry = new THREE.Geometry();
    gridMidGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    gridMidGeometry.vertices.push(
      new THREE.Vector3(
        (this.triSide / 2) + this.triMargin,
        this.triHeight + this.triMargin,
        0
      )
    );
    gridMidGeometry.vertices.push(
      new THREE.Vector3(this.triSide + this.triMargin, 0, 0)
    );
    gridMidGeometry.vertices.push(new THREE.Vector3(0, 0, 0));

    const gridUpperGeometry = new THREE.Geometry();
    gridUpperGeometry.vertices.push(new THREE.Vector3(0, 0, this.gridHeight));
    gridUpperGeometry.vertices.push(
      new THREE.Vector3(
        (this.triSide / 2) + this.triMargin,
        this.triHeight + this.triMargin,
        this.gridHeight
      )
    );
    gridUpperGeometry.vertices.push(
      new THREE.Vector3(
        this.triSide + this.triMargin,
        0,
        this.gridHeight
      )
    );
    gridUpperGeometry.vertices.push(new THREE.Vector3(0, 0, this.gridHeight));

    const gridSideOneGeometry = new THREE.Geometry();
    gridSideOneGeometry.vertices.push(
      new THREE.Vector3(0, 0, - this.gridHeight)
    );
    gridSideOneGeometry.vertices.push(
      new THREE.Vector3(0, 0, this.gridHeight)
    );

    const gridSideTwoGeometry = new THREE.Geometry();
    gridSideTwoGeometry.vertices.push(
      new THREE.Vector3(
        (this.triSide / 2) + this.triMargin,
        this.triHeight + this.triMargin,
        -this.gridHeight
      )
    );
    gridSideTwoGeometry.vertices.push(
      new THREE.Vector3(
        (this.triSide / 2) + this.triMargin,
        this.triHeight + this.triMargin,
        this.gridHeight
      )
    );
    const gridSideThreeGeometry = new THREE.Geometry();
    gridSideThreeGeometry.vertices.push(
      new THREE.Vector3(
        this.triSide + this.triMargin,
        0,
        - this.gridHeight
      )
    );
    gridSideThreeGeometry.vertices.push(
      new THREE.Vector3(
        this.triSide + this.triMargin,
        0,
        this.gridHeight
      )
    );

    const gridLineLower = new THREE.Line(gridLowerGeometry, material);
    const gridLineMid = new THREE.Line(gridMidGeometry, material);
    const gridLineUpper = new THREE.Line(gridUpperGeometry, material);

    const gridLineSideOne = new THREE.Line(gridSideOneGeometry, material);
    const gridLineSideTwo = new THREE.Line(gridSideTwoGeometry, material);
    const gridLineSideThree = new THREE.Line(gridSideThreeGeometry, material);

    this.group.add(gridLineLower);
    this.group.add(gridLineMid);
    this.group.add(gridLineUpper);
    this.group.add(gridLineSideOne);
    this.group.add(gridLineSideTwo);
    this.group.add(gridLineSideThree);
  }


  drawAxis(axisMin, axisMax) {
    this.group.remove(this.axisTicks);
    this.group.remove(this.axisLabels);
    this.group.remove(this.axisName);
    this.axisTicks = new THREE.Group();
    this.axisLabels = new THREE.Group();

    const normalizationMin = Math.abs(
      this.gridHeight / (axisMin * this.gridHeight)
    );
    const normalizationMax = Math.abs(
      this.gridHeight / (axisMax * this.gridHeight)
    );

    const tickSize = 10;
    const axisMaterial = new THREE.LineBasicMaterial({
      color: 0xE75112,
      linewidth: 1,
    });
    const textPosX = 150;
    const textPosY = 75;
    const spritePosX = -25;
    const spritePosY = 5;


    for (let i = axisMin; i <= -0.1; i = i + 0.1) {
      const tickGeometry = new THREE.Geometry();
      tickGeometry.vertices.push(
        new THREE.Vector3(
          tickSize / 2,
          0,
          i * this.gridHeight * normalizationMin
        )
      );
      tickGeometry.vertices.push(
        new THREE.Vector3(
          -tickSize / 2,
          0,
          i * this.gridHeight * normalizationMin
        )
      );
      const tick = new THREE.Line(tickGeometry, axisMaterial);
      this.axisTicks.add(tick);

      const labelCanvas = document.createElement('canvas');
      const labelContext = labelCanvas.getContext('2d');

      labelContext.font = '16px Arial';
      labelContext.clearRect(0, 0, labelCanvas.width, labelCanvas.height);
      labelContext.fillStyle = '#E75112';
      let label;
      if (i < 0) label = i.toFixed(1) * 1000;
      if (i === 0) label = ' 0.0';
      if (i > 0) label = ` ${label}`;
      labelContext.fillText(label, textPosX, textPosY);

      const labelTexture = new THREE.Texture(labelCanvas);
      labelTexture.needsUpdate = true;
      const labelMaterial = new THREE.SpriteMaterial({ map: labelTexture });
      const labelSprite = new THREE.Sprite(labelMaterial);
      labelSprite.scale.set(200, 100, 1.0);
      labelSprite.position.set(
        spritePosX,
        spritePosY,
        i * this.gridHeight * normalizationMin
      );
      this.axisLabels.add(labelSprite);
    }

    for (let i = 0; i <= this.gridMax * 10; i++) {
      const tickGeometry = new THREE.Geometry();
      tickGeometry.vertices.push(
        new THREE.Vector3(
          tickSize / 2,
          0,
          i / 10 * this.gridHeight * normalizationMax
        )
      );
      tickGeometry.vertices.push(
        new THREE.Vector3(
          -tickSize / 2,
          0,
          i / 10 * this.gridHeight * normalizationMax
        )
      );
      const tick = new THREE.Line(tickGeometry, axisMaterial);
      this.axisTicks.add(tick);

      const labelCanvas = document.createElement('canvas');
      const labelContext = labelCanvas.getContext('2d');

      labelContext.font = '16px Arial';
      labelContext.clearRect(0, 0, labelCanvas.width, labelCanvas.height);
      labelContext.fillStyle = '#E75112';
      let label;
      if (i === 0) label = ' 0.0';
      if (i > 0) label = ` ${(i.toFixed(1) / 10) * 1000}`;
      if (i === 10) label = ' 1000';
      labelContext.fillText(label, textPosX, textPosY);

      const labelTexture = new THREE.Texture(labelCanvas);
      labelTexture.needsUpdate = true;
      const labelMaterial = new THREE.SpriteMaterial({
        map: labelTexture,
      });
      const labelSprite = new THREE.Sprite(labelMaterial);
      labelSprite.scale.set(200, 100, 1.0);
      labelSprite.position.set(
        spritePosX,
        spritePosY,
        i / 10 * this.gridHeight * normalizationMax
      );
      this.axisLabels.add(labelSprite);
    }

    // Axis Name Label
    const labelCanvas = document.createElement('canvas');
    const labelContext = labelCanvas.getContext('2d');

    labelContext.font = '16px Arial';
    labelContext.clearRect(0, 0, labelCanvas.width, labelCanvas.height);
    labelContext.fillStyle = '#000000';
    labelContext.fillText(
      'formation enthalpy (meV)',
      textPosX - 50,
      textPosY
    );

    const labelTexture = new THREE.Texture(labelCanvas);
    labelTexture.needsUpdate = true;
    const labelMaterial = new THREE.SpriteMaterial({
      map: labelTexture,
    });
    const labelSprite = new THREE.Sprite(labelMaterial);
    labelSprite.scale.set(200, 100, 1.0);
    labelSprite.position.set(spritePosX - 10, spritePosY, 0);


    this.group.add(this.axisTicks);
    this.group.add(this.axisLabels);

    this.axisName = this.createText2D('formation enthalpy (meV)', '#000000');
    this.axisName.position.set(-50, 0, 0);
    this.axisName.rotation.x = -(Math.PI) / 2;
    this.axisName.rotation.z = (Math.PI) / 2;

    this.group.add(this.axisName);
  }

  drawHull(data) {
    // console.log('passed data', hullData);
    const hullData = data;
    this.group.remove(this.hullMesh);
    this.group.remove(this.elementA);
    this.group.remove(this.elementB);
    this.group.remove(this.elementC);
    this.scene.remove(this.edges);

    // titles on graph
    let elemColor = this.color;
    if (this.defaultColor) {
      elemColor = '#FF0000';
    }
    this.elementA = this.createText2D(hullData.species[0], elemColor);
    this.elementA.position.set(-30, -30, 0);
    this.group.add(this.elementA);

    if (this.defaultColor) {
      elemColor = '#0000FF';
    }
    this.elementB = this.createText2D(hullData.species[1], elemColor);
    this.elementB.position.set(
      this.triCenter[0],
      this.triCenter[1] + this.triSide / 2 + 70,
      0
    );
    // this.elementB.position.x = this.triCenter[0];
    // this.elementB.position.y = this.triCenter[1] + this.triSide / 2 + 70;
    // this.elementB.position.z = 0;
    this.group.add(this.elementB);

    if (this.defaultColor) {
      elemColor = '#00FF00';
    }
    this.elementC = this.createText2D(hullData.species[2], elemColor);
    this.elementC.position.set(
      this.triSide + 30,
      this.triCenter[1] - this.triSide / 3 - 10,
      0
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


    for (let i = 0; i < hullData.vertices.length; i++) {
      if (hullData.vertices[i].composition[0] === 1 ||
          hullData.vertices[i].composition[1] === 1 ||
          hullData.vertices[i].composition[2] === 1) {
        hullData.vertices[i].enthalpyFormationAtom = 0.0;
      }
      const triPos = this.triCoord(
        hullData.vertices[i].composition[0],
        hullData.vertices[i].composition[2],
        hullData.vertices[i].composition[1]
      );
      geometry.vertices.push(
        new THREE.Vector3(
          triPos[0],
          triPos[1],
          hullData.vertices[i].enthalpyFormationAtom * this.gridHeight
        )
      );
    }

    for (let i = 0; i < hullData.faces.length; i++) {
      geometry.faces.push(
        new THREE.Face3(
          hullData.faces[i][0],
          hullData.faces[i][1],
          hullData.faces[i][2]
        )
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
    this.group.remove(this.pointCloud);
    const entries = this.filterByEnthalpy(data);
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
        (entries[i].enthalpyFormationAtom * this.gridHeight)
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
      new THREE.BufferAttribute(positions, 3)
    );
    pointsGeometry.addAttribute(
      'customColor',
      new THREE.BufferAttribute(colors, 3)
    );
    pointsGeometry.addAttribute(
      'size',
      new THREE.BufferAttribute(sizes, 1)
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

    const texture = new THREE.TextureLoader().load('textures/disc.png');
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
        (entries[i].enthalpyFormationAtom * this.gridHeight)
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

    c.setHSL(hsl.h, hsl.s, 1 - hsl.l * z);
    return c;
  }

  onMouseMove(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    const viewport = document.getElementById('viewport'); // boostrap fix
    const top = window.pageYOffset || document.documentElement.scrollTop;
    const left = window.pageXOffset || document.documentElement.scrollLeft;
    this.mouse.x = (
      (event.clientX - this.renderer.domElement.offsetLeft - viewport.offsetLeft + left + 5) /
      this.renderer.domElement.width
    ) * 2 - 1; // NOTE: the +5 is a hack to get raycaster centered on point in nwjs
    this.mouse.y = -(
      (event.clientY - this.renderer.domElement.offsetTop - viewport.offsetTop) /
    this.renderer.domElement.height) * 2 + 1;
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
    const top = window.pageYOffset || document.documentElement.scrollTop;
    const left = window.pageXOffset || document.documentElement.scrollLeft;
    this.mouse.x = (
      (event.clientX - this.renderer.domElement.offsetLeft - viewport.offsetLeft + left + 5) /
      this.renderer.domElement.width
    ) * 2 - 1; // NOTE: the +5 is a hack to get raycaster centered on point in nwjs
    this.mouse.y = -(
      (event.clientY - this.renderer.domElement.offsetTop - viewport.offsetTop + viewport.scrollTop) /
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
    while(this.scene.children.length > 0){ 
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
      false
    );
  }
}

export default TernaryHullRender;
