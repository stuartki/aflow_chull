import * as THREE from 'three';
// drawing axis

export default class TernaryAxis {
  constructor(axisMin, axisMax, gridHeight) {
    this.axisMin = axisMin;
    this.axisMax = axisMax;
    this.gridHeight = gridHeight;
    this.axisGroup = new THREE.Group();
    this.axisTicks = new THREE.Group();
    this.axisLabels = new THREE.Group();
    this.elements = new THREE.Group();
    this.axisName = this.createText2D('formation enthalpy (meV / atom)', '#000000');
  }

  // eslint-disable-next-line class-methods-use-this
  createText2D(text, color, font, size, segW, segH) {
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
    // const plane = new THREE.PlaneGeometry(
    //     canvas.width,
    //     canvas.height,
    //     segW,
    //     segH,
    //   );
    const tex = new THREE.Texture(canvas);
    tex.needsUpdate = true;
    const spriteMat = new THREE.SpriteMaterial({
      map: tex,
      color: 0xffffff,
      transparent: true,
    });
    if (text === 'formation enthalpy (meV / atom)') {
      spriteMat.rotation = Math.PI / 2;
    }
    // const mesh = new THREE.Mesh(plane, planeMat);
    // mesh.scale.set(0.5, 0.5, 0.5);
    // mesh.doubleSided = true;
    // return mesh;
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(30, 30, 30);
    if (text === 'formation enthalpy (meV / atom)') {
      sprite.scale.set(200, 20, 1);
    }
    return sprite;
  }
  // offset is displacement of element to side
  // offset = 0 would be overlapping
  drawThreeElements(species, offset = 30, colors = ['#FF0000', '#0000FF', '#00FF00']) {
    const triSide = this.gridHeight * 2;
    const triPositions = [
      [-offset, -offset, 0],
      [triSide / 2, (offset * Math.sqrt(2)) + (triSide * (Math.sqrt(3) / 2)), 0],
      [triSide + offset, -offset, 0],
    ];
    for (let i = 0; i < 3; i++) {
      const element = this.createText2D(species[i], colors[i]);
      element.position.set(...triPositions[i]);
      this.elements.add(element);
    }
    this.axisGroup.add(this.elements);
    return this.elements;
  }

  drawAxis() {
    // huh? is this not just 1 / this.axisMin
    const normalizationMin = Math.abs(
        this.gridHeight / (this.axisMin * this.gridHeight),
      );
    const normalizationMax = Math.abs(
        this.gridHeight / (this.axisMax * this.gridHeight),
      );

    const tickSize = 10;
    const axisMaterial = new THREE.LineBasicMaterial({
      color: 0xE75112,
      linewidth: 1,
    });

      // text position within the canvas
    const textPosX = 150;
    const textPosY = 75;
      // sprite position in relative to the axis
    const spritePosX = -40;
    const spritePosY = 5;

    for (let i = this.axisMin; i <= -0.1; i += 0.2) {
      const tickGeometry = new THREE.Geometry();

        // add a tick on both sides of axes
      tickGeometry.vertices.push(
          new THREE.Vector3(
            tickSize / 2,
            0,
            i * this.gridHeight * normalizationMin,
          ),
        );
      tickGeometry.vertices.push(
          new THREE.Vector3(
            -tickSize / 2,
            0,
            i * this.gridHeight * normalizationMin,
          ),
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

        // 3D creation of sprite and canvas created above
      const labelTexture = new THREE.Texture(labelCanvas);
      labelTexture.needsUpdate = true;
      const labelMaterial = new THREE.SpriteMaterial({ map: labelTexture });
      const labelSprite = new THREE.Sprite(labelMaterial);
      labelSprite.scale.set(300, 150, 1.0);
      labelSprite.position.set(
          spritePosX,
          spritePosY,
          i * this.gridHeight * normalizationMin,
        );
      this.axisLabels.add(labelSprite);
    }

      // hm, they switched the for loop definiiton
    for (let i = 0; i <= this.axisMax * 10; i+=2) {
      const tickGeometry = new THREE.Geometry();
      tickGeometry.vertices.push(
          new THREE.Vector3(
            tickSize / 2,
            0,
            (i / 10) * this.gridHeight * normalizationMax,
          ),
        );
      tickGeometry.vertices.push(
          new THREE.Vector3(
            -tickSize / 2,
            0,
            (i / 10) * this.gridHeight * normalizationMax,
          ),
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
      labelSprite.scale.set(300, 150, 1.0);
      labelSprite.position.set(
          spritePosX,
          spritePosY,
          (i / 10) * this.gridHeight * normalizationMax,
        );
      this.axisLabels.add(labelSprite);
    }

      // Axis Name Label
    // const labelCanvas = document.createElement('canvas');
    // const labelContext = labelCanvas.getContext('2d');

    // labelContext.font = '16px Arial';
    // labelContext.clearRect(0, 0, labelCanvas.width, labelCanvas.height);
    // labelContext.fillStyle = '#000000';
    // labelContext.fillText(
    //     'formation enthalpy (meV)',
    //     textPosX - 50,
    //     textPosY,
    //   );

    // const labelTexture = new THREE.Texture(labelCanvas);
    // labelTexture.needsUpdate = true;
    // const labelMaterial = new THREE.SpriteMaterial({
    //   map: labelTexture,
    // });
    // const labelSprite = new THREE.Sprite(labelMaterial);
    // labelSprite.scale.set(200, 100, 1.0);
    // labelSprite.position.set(spritePosX - 10, spritePosY, 0);


    this.axisGroup.add(this.axisTicks);
    this.axisGroup.add(this.axisLabels);

    this.axisName.position.set(-50, 0, 150);
    // this.axisName.rotation.x = -(Math.PI) / 2;
    // this.axisName.rotation.z = (Math.PI) / 2;

    this.axisGroup.add(this.axisName);

    return this.axisGroup;
  }

  setVisibility(bool) {
    // eslint-disable-next-line no-param-reassign
    this.elements.children.forEach((element) => { element.visible = bool; });
    this.axisTicks.visible = bool;
    this.axisLabels.visible = bool;
    this.axisName.visible = bool;
  }
}
