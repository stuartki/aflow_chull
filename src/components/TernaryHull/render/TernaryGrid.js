import * as THREE from 'three';


export default class TernaryGrid {
  constructor(gridHeight = 300, triMargin = 0) {
    this.gridHeight = gridHeight;
    this.triMargin = triMargin;

    this.triSide = this.gridHeight * 2;
    this.triHeight = (Math.sqrt(3) / (2)) * this.triSide;
    this.triCenter = this.triCoord(33, 33, 34);
    this.grid = new THREE.Group();
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

  drawGrid() {
      // ++++++++++++++++++ DRAWING TRIANGULAR GRID ++++++++++++++++++++++++++++++
      //        this can be cleaner but for now it will do...

    const material = new THREE.LineBasicMaterial({
      color: 0x000000,
    });

      // lower geometry
    const gridLowerGeometry = new THREE.Geometry();
    gridLowerGeometry.vertices.push(
        new THREE.Vector3(0, 0, -this.gridHeight),
      );
    gridLowerGeometry.vertices.push(
        new THREE.Vector3(
          (this.triSide / 2) + this.triMargin,
          this.triHeight + this.triMargin,
          -this.gridHeight,
        ),
      );
    gridLowerGeometry.vertices.push(
        new THREE.Vector3(
          this.triSide + this.triMargin,
          0,
          -this.gridHeight,
        ),
      );
    gridLowerGeometry.vertices.push(
        new THREE.Vector3(0, 0, -this.gridHeight),
      );

      // mid geometry
    const gridMidGeometry = new THREE.Geometry();
    gridMidGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    gridMidGeometry.vertices.push(
        new THREE.Vector3(
          (this.triSide / 2) + this.triMargin,
          this.triHeight + this.triMargin,
          0,
        ),
      );
    gridMidGeometry.vertices.push(
        new THREE.Vector3(this.triSide + this.triMargin, 0, 0),
      );
    gridMidGeometry.vertices.push(new THREE.Vector3(0, 0, 0));

      // upper geometry
    const gridUpperGeometry = new THREE.Geometry();
    gridUpperGeometry.vertices.push(new THREE.Vector3(0, 0, this.gridHeight));
    gridUpperGeometry.vertices.push(
        new THREE.Vector3(
          (this.triSide / 2) + this.triMargin,
          this.triHeight + this.triMargin,
          this.gridHeight,
        ),
      );
    gridUpperGeometry.vertices.push(
        new THREE.Vector3(
          this.triSide + this.triMargin,
          0,
          this.gridHeight,
        ),
      );
    gridUpperGeometry.vertices.push(new THREE.Vector3(0, 0, this.gridHeight));

      // SIDE GEOMETRY (lines?)
      // side one
    const gridSideOneGeometry = new THREE.Geometry();
    gridSideOneGeometry.vertices.push(
        new THREE.Vector3(0, 0, -this.gridHeight),
      );
    gridSideOneGeometry.vertices.push(
        new THREE.Vector3(0, 0, this.gridHeight),
      );

      // side two
    const gridSideTwoGeometry = new THREE.Geometry();
    gridSideTwoGeometry.vertices.push(
        new THREE.Vector3(
          (this.triSide / 2) + this.triMargin,
          this.triHeight + this.triMargin,
          -this.gridHeight,
        ),
      );
    gridSideTwoGeometry.vertices.push(
        new THREE.Vector3(
          (this.triSide / 2) + this.triMargin,
          this.triHeight + this.triMargin,
          this.gridHeight,
        ),
      );

      // side three
    const gridSideThreeGeometry = new THREE.Geometry();
    gridSideThreeGeometry.vertices.push(
        new THREE.Vector3(
          this.triSide + this.triMargin,
          0,
          -this.gridHeight,
        ),
      );
    gridSideThreeGeometry.vertices.push(
        new THREE.Vector3(
          this.triSide + this.triMargin,
          0,
          this.gridHeight,
        ),
      );

      // constructing lines
    const gridLineLower = new THREE.Line(gridLowerGeometry, material);
    const gridLineMid = new THREE.Line(gridMidGeometry, material);
    const gridLineUpper = new THREE.Line(gridUpperGeometry, material);

    const gridLineSideOne = new THREE.Line(gridSideOneGeometry, material);
    const gridLineSideTwo = new THREE.Line(gridSideTwoGeometry, material);
    const gridLineSideThree = new THREE.Line(gridSideThreeGeometry, material);

    this.grid.add(gridLineLower);
    this.grid.add(gridLineMid);
    this.grid.add(gridLineUpper);
    this.grid.add(gridLineSideOne);
    this.grid.add(gridLineSideTwo);
    this.grid.add(gridLineSideThree);

    return this.grid;
  }
}
