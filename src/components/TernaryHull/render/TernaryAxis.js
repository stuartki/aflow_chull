import * as THREE from 'three';
import Canvas2D from './Canvas2D';
// drawing axis

export class TernaryAxis {
  constructor(axisMin, axisMax, gridHeight) {
    this.axisMin = axisMin;
    this.axisMax = axisMax;
    this.gridHeight = gridHeight;
  }
}
  function drawAxis(axisMin, axisMax, gridHeight) {
    const axisGroup = new THREE.Group();
    const axisTicks = new THREE.Group();
    const axisLabels = new THREE.Group();

    const normalizationMin = Math.abs(
        gridHeight / (axisMin * gridHeight),
      );
    const normalizationMax = Math.abs(
        gridHeight / (axisMax * gridHeight),
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
    const spritePosX = -25;
    const spritePosY = 5;

    for (let i = axisMin; i <= -0.1; i += 0.1) {
      const tickGeometry = new THREE.Geometry();

        // add a tick on both sides of axes
      tickGeometry.vertices.push(
          new THREE.Vector3(
            tickSize / 2,
            0,
            i * gridHeight * normalizationMin,
          ),
        );
      tickGeometry.vertices.push(
          new THREE.Vector3(
            -tickSize / 2,
            0,
            i * gridHeight * normalizationMin,
          ),
        );

      const tick = new THREE.Line(tickGeometry, axisMaterial);
      axisTicks.add(tick);

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
      labelSprite.scale.set(200, 100, 1.0);
      labelSprite.position.set(
          spritePosX,
          spritePosY,
          i * gridHeight * normalizationMin,
        );
      axisLabels.add(labelSprite);
    }

      // hm, they switched the for loop definiiton
    for (let i = 0; i <= axisMax * 10; i++) {
      const tickGeometry = new THREE.Geometry();
      tickGeometry.vertices.push(
          new THREE.Vector3(
            tickSize / 2,
            0,
            (i / 10) * gridHeight * normalizationMax,
          ),
        );
      tickGeometry.vertices.push(
          new THREE.Vector3(
            -tickSize / 2,
            0,
            (i / 10) * gridHeight * normalizationMax,
          ),
        );
      const tick = new THREE.Line(tickGeometry, axisMaterial);
      axisTicks.add(tick);

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
          (i / 10) * gridHeight * normalizationMax,
        );
      axisLabels.add(labelSprite);
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
        textPosY,
      );

    const labelTexture = new THREE.Texture(labelCanvas);
    labelTexture.needsUpdate = true;
    const labelMaterial = new THREE.SpriteMaterial({
      map: labelTexture,
    });
    const labelSprite = new THREE.Sprite(labelMaterial);
    labelSprite.scale.set(200, 100, 1.0);
    labelSprite.position.set(spritePosX - 10, spritePosY, 0);


    axisGroup.add(axisTicks);
    axisGroup.add(axisLabels);

    const axisName = Canvas2D('formation enthalpy (meV)', '#000000');
    axisName.position.set(-50, 0, 0);
    axisName.rotation.x = -(Math.PI) / 2;
    axisName.rotation.z = (Math.PI) / 2;

    axisGroup.add(axisName);

    return axisGroup;
  }

  export function setVisibility(bool) {
    this.axisTicks.visible = bool;
    this.axisLabels.visible = bool;
    this.axisName.visible = bool;
  }