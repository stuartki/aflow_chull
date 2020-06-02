/* eslint-disable no-mixed-operators */
/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import InfoCard from './LineChartInfoCard';

const propTypes = {
  defaultBehavior: PropTypes.bool.isRequired,
  cx: PropTypes.number.isRequired,
  xScale: PropTypes.func.isRequired,
  cy: PropTypes.number.isRequired,
  yScale: PropTypes.func.isRequired,
  yMin: PropTypes.number.isRequired,
  yMax: PropTypes.number.isRequired,
  fill: PropTypes.string.isRequired,
  auid: PropTypes.string.isRequired,
  compound: PropTypes.string.isRequired,
  decompositionPoints: PropTypes.arrayOf(
    PropTypes.shape({
      x: React.PropTypes.number.isRequired,
      y: React.PropTypes.number.isRequired,
    }),
  ).isRequired,
  vertices: PropTypes.arrayOf(
    PropTypes.shape({
      x: React.PropTypes.number.isRequired,
      y: React.PropTypes.number.isRequired,
    }),
  ).isRequired,
  isClicked: PropTypes.bool.isRequired,
  distanceToHull: PropTypes.number.isRequired,
  line: PropTypes.func.isRequired,
  pointClickHandler: PropTypes.func.isRequired,
};

class Point extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // triggered when mouseover
      tielineClicked: false,
      // triggered when clicked (will stay true if state is defaultBehavior)
      tielineStay: false || this.props.defaultBehavior,
      // for LineChartInfoCard
      text: false,
    };
    this.timer = null;
    this.onClick = this.onClick.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    // this.onLineClick = this.onLineClick.bind(this);
  }

  onClick() {
    this.setState({ tielineStay: false });
    this.props.pointClickHandler(this.props.auid);
  }

  onMouseOver() {
    this.setState({ tielineClicked: true, text: true });
  }

  onMouseOut() {
    this.setState({ tielineClicked: false, text: false });
  }

  // onContextMenu() {
  //   // this.timer = setTimeout(() => {
  //   this.setState({ tielineClicked: false, text: false });
  //   // }, 1000);
  // }

  // OLD -> allows triggering tielineStay by clicking line...does not work because of
  // breaking state changes
  // onLineClick() {
  //   this.setState({ tielineStay: !this.state.tielineStay });
  //   if (!this.state.tielineStay) {
  //     this.setState({ tielineClicked: false });
  //   }
  // }

  render() {
    // find distance to hull of curPoint -> curX in the scale of graph
    // endpoints are decomposition points on hull
    function hullDistance(endpoints, curX) {
      const m = (endpoints[1].y - endpoints[0].y) / (endpoints[1].x - endpoints[0].x);
      const b = endpoints[0].y - (m * endpoints[0].x);
      return ((m * curX) + b);
    }

    // quick function to make svg circles with decomposition points
    function makeDecompPointCircs(decomposition, fill, r, xScale, yScale) {
      const decomps = decomposition.map(d => (
        <circle
          key={`${d.x.toString()}`}
          className="hull point"
          r={r}
          cx={xScale(d.x)}
          cy={yScale(d.y)}
          fill={fill}
          stroke={fill === 'none' ? '#687BC9' : 'none'}
          strokeWidth={fill === 'none' ? '3' : 'none'}
        />
      ));
      return decomps;
    }

    // svg components
    let tieline = null;
    let point = null;
    let decompCircles = null;
    // OLD
    let compound = null;

    // invert x back to local stoichiometric/enthalpy x/y coordinates
    const x = this.props.xScale.invert(this.props.cx);
    const y = this.props.yScale.invert(this.props.cy);

    // DECOMPOSITION POINT HANDLING

    // if it is clicked and not a hull point
    if (this.props.isClicked) {
      // find the decomposition points
      let decompPoints = this.props.decompositionPoints;
      let pathToHull;

      // logic to handle single/null decomposition points can be found in LineChartPoints
      if (decompPoints.length === 1) {
        pathToHull = [
          { x, y },
          { x, y: decompPoints[0].y },
        ];
      } else {
        pathToHull = [
          { x, y },
          { x, y: hullDistance(decompPoints, x) },
        ];
      }

      // DRAWING POINTS
      if (this.state.tielineClicked || this.state.tielineStay) {
        // deciding css class depending on selection type, default behavior
        let className = 'hull line shadow';
        if (this.state.tielineClicked) {
          className = 'hull hline shadow';
        }
        if (this.state.tielineStay) {
          className = 'hull tieline shadow';
        }

        // draws LineChartInfoCard (DEPRECEATED NEXT VERSION)
        if (this.props.defaultBehavior) {
          compound =
          (
            <InfoCard
              // eslint-disable-next-line react/prop-types
              data={this.props.entry}
              x={x}
              y={y}
              xScale={this.props.xScale}
              yScale={this.props.yScale}
              yMin={this.props.yMin}
              yMax={this.props.yMax}
            />
          );
        }

        //  draw distance to hull line / decomppsition point borders
        tieline =
        (
          <g>
            <path
              className={className}
              d={this.props.line(pathToHull)}
              // onClick={this.onLineClick}
              strokeLinecap="round"
              strokeDasharray="3, 10"
            />
            {makeDecompPointCircs(decompPoints, 'none', '7', this.props.xScale, this.props.yScale)}
          </g>
        );

        // decomposition line between decomposition points
        // filled in decomposition circles
        // only occurs under default behavior
        if (this.props.defaultBehavior) {
          decompCircles =
          (
            <g>
              <path
                className={className}
                d={this.props.line(decompPoints)}
                onClick={this.onLineClick}
                strokeLinecap="round"
                strokeDasharray="3, 10"
              />
              {makeDecompPointCircs(decompPoints, 'red', '5', this.props.xScale, this.props.yScale)}
            </g>
          );
        }
      }
    }

    // added boundary conditions (improve)
    // drawing the point
    if (y > this.props.yMin && this.props.yMax > y) {
      point =
          (
            <g>
              <circle
                className="point"
                r="5"
                cx={this.props.cx}
                cy={this.props.cy}
                fill={this.props.fill}
                onClick={this.onClick}
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut}
                strokeWidth="2px"
              />
            </g>
          );
    }
    return (
      <g>
        {/* {compound} */}
        {tieline}
        {decompCircles}
        {point}
      </g>
    );
  }
}

Point.propTypes = propTypes;

export default Point;
