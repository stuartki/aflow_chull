import * as THREE from 'three';

export default function drawGrid(gridHeight, triSide, triMargin, triHeight) {
    // ++++++++++++++++++ DRAWING TRIANGULAR GRID ++++++++++++++++++++++++++++++
    //        this can be cleaner but for now it will do...

  const material = new THREE.LineBasicMaterial({
    color: 0x000000,
  });

    // lower geometry
  const gridLowerGeometry = new THREE.Geometry();
  gridLowerGeometry.vertices.push(
      new THREE.Vector3(0, 0, -gridHeight),
    );
  gridLowerGeometry.vertices.push(
      new THREE.Vector3(
        (triSide / 2) + triMargin,
        triHeight + triMargin,
        -gridHeight,
      ),
    );
  gridLowerGeometry.vertices.push(
      new THREE.Vector3(
        triSide + triMargin,
        0,
        -gridHeight,
      ),
    );
  gridLowerGeometry.vertices.push(
      new THREE.Vector3(0, 0, -gridHeight),
    );

    // mid geometry
  const gridMidGeometry = new THREE.Geometry();
  gridMidGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
  gridMidGeometry.vertices.push(
      new THREE.Vector3(
        (triSide / 2) + triMargin,
        triHeight + triMargin,
        0,
      ),
    );
  gridMidGeometry.vertices.push(
      new THREE.Vector3(triSide + triMargin, 0, 0),
    );
  gridMidGeometry.vertices.push(new THREE.Vector3(0, 0, 0));

    // upper geometry
  const gridUpperGeometry = new THREE.Geometry();
  gridUpperGeometry.vertices.push(new THREE.Vector3(0, 0, gridHeight));
  gridUpperGeometry.vertices.push(
      new THREE.Vector3(
        (triSide / 2) + triMargin,
        triHeight + triMargin,
        gridHeight,
      ),
    );
  gridUpperGeometry.vertices.push(
      new THREE.Vector3(
        triSide + triMargin,
        0,
        gridHeight,
      ),
    );
  gridUpperGeometry.vertices.push(new THREE.Vector3(0, 0, gridHeight));

    // SIDE GEOMETRY (lines?)
    // side one
  const gridSideOneGeometry = new THREE.Geometry();
  gridSideOneGeometry.vertices.push(
      new THREE.Vector3(0, 0, -gridHeight),
    );
  gridSideOneGeometry.vertices.push(
      new THREE.Vector3(0, 0, gridHeight),
    );

    // side two
  const gridSideTwoGeometry = new THREE.Geometry();
  gridSideTwoGeometry.vertices.push(
      new THREE.Vector3(
        (triSide / 2) + triMargin,
        triHeight + triMargin,
        -gridHeight,
      ),
    );
  gridSideTwoGeometry.vertices.push(
      new THREE.Vector3(
        (triSide / 2) + triMargin,
        triHeight + triMargin,
        gridHeight,
      ),
    );

    // side three
  const gridSideThreeGeometry = new THREE.Geometry();
  gridSideThreeGeometry.vertices.push(
      new THREE.Vector3(
        triSide + triMargin,
        0,
        -gridHeight,
      ),
    );
  gridSideThreeGeometry.vertices.push(
      new THREE.Vector3(
        triSide + triMargin,
        0,
        gridHeight,
      ),
    );

    // constructing lines
  const gridLineLower = new THREE.Line(gridLowerGeometry, material);
  const gridLineMid = new THREE.Line(gridMidGeometry, material);
  const gridLineUpper = new THREE.Line(gridUpperGeometry, material);

  const gridLineSideOne = new THREE.Line(gridSideOneGeometry, material);
  const gridLineSideTwo = new THREE.Line(gridSideTwoGeometry, material);
  const gridLineSideThree = new THREE.Line(gridSideThreeGeometry, material);

  const group = new THREE.Group();
  group.add(gridLineLower);
  group.add(gridLineMid);
  group.add(gridLineUpper);
  group.add(gridLineSideOne);
  group.add(gridLineSideTwo);
  group.add(gridLineSideThree);

  return group;
}
