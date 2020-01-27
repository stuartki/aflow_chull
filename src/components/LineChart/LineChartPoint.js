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
      tielineClicked: false,
      tielineStay: false || this.props.defaultBehavior,
      text: false,
    };
    this.timer = null;
    this.onClick = this.onClick.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onLineClick = this.onLineClick.bind(this);
  }

  onClick() {
    this.setState({ tielineStay: false });
    this.props.pointClickHandler(this.props.auid);
  }

  onMouseOver() {
    this.setState({ tielineClicked: true, text: true });
  }

  onMouseOut() {
    // this.timer = setTimeout(() => {
    this.setState({ tielineClicked: false, text: false });
    // }, 1000);
  }

  onLineClick() {
    // clearTimeout(this.timer);
    this.setState({ tielineStay: !this.state.tielineStay });
    if (!this.state.tielineStay) {
      this.setState({ tielineClicked: false });
    }
  }

  render() {
    // find hull distance in scale of graph
    function hullDistance(endpoints, curX) {
      const m = (endpoints[1].y - endpoints[0].y) / (endpoints[1].x - endpoints[0].x);
      const b = endpoints[0].y - (m * endpoints[0].x);
      return ((m * curX) + b);
    }

    function makeDecompPointCircs(decomposition, fill, r, xScale, yScale) {
      const decomps = decomposition.map(d => (
        <circle
          className="point"
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

    // fixes pesky offset of line to circle center
    // function offset(points, xScale, yScale) {
    //   const norm = ((yScale(points[1].y - points[0].y) ** 2)
    //     + (xScale(points[1].x - points[0].x) ** 2)) ** (0.5);
    //   const xiVec = 6 * xScale(points[1].x - points[0].x) / norm;
    //   const yiVec = 6 * yScale(points[1].y - points[0].y) / norm;
    //   const offsetPoints = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
    //   offsetPoints[0].x = xScale.invert(xScale(points[0].x) + xiVec);
    //   offsetPoints[0].y = yScale.invert(yScale(points[0].y) + yiVec);
    //   offsetPoints[1].x = xScale.invert(xScale(points[1].x) - xiVec);
    //   offsetPoints[1].y = yScale.invert(yScale(points[1].y) - yiVec);
    //   return offsetPoints;
    // }

    // svg components
    let tieline = null;
    let point = null;
    let compound = null;
    let decompCircles = null;

    // if it is clicked and not a hull point
    if (this.props.isClicked && this.props.distanceToHull > 0) {
      // invert x back to local stoichiometric/enthalpy x/y coordinates
      const x = this.props.xScale.invert(this.props.cx);
      const y = this.props.yScale.invert(this.props.cy);

      // the math part
      // find the decomposition reaction
      let decompPoints = this.props.decompositionPoints;
      let pathToHull;
      if (decompPoints.length === 0) {
        decompPoints = this.props.vertices.filter(d => Math.abs(d.x - x) < 0.01);
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

      const s = makeDecompPointCircs(decompPoints, 'none', '7', this.props.xScale, this.props.yScale);
      // drawing the points
      if (this.state.tielineClicked || this.state.tielineStay) {
        let className = 'line shadow';
        if (this.state.tielineClicked) {
          className = 'hline shadow';
        }
        if (this.state.tielineStay) {
          className = 'tieline shadow';
        }
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

        tieline =
        (
          <g>
            <path
              className={className}
              d={this.props.line(pathToHull)}
              onClick={this.onLineClick}
              strokeLinecap="round"
              strokeDasharray="3, 10"
            />
            {makeDecompPointCircs(decompPoints, 'none', '7', this.props.xScale, this.props.yScale)}
            {/* <circle
              className="point"
              r="7"
              cx={this.props.xScale(decompPoints[0].x)}
              cy={this.props.yScale(decompPoints[0].y)}
              fill="none"
              stroke="#687BC9"
              strokeWidth="3"
            />
            <circle
              className="point"
              r="7"
              cx={this.props.xScale(decompPoints[1].x)}
              cy={this.props.yScale(decompPoints[1].y)}
              fill="none"
              stroke="#687BC9"
              strokeWidth="3"
            /> */}
          </g>
        );
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
              {/* <circle
                className="point"
                r="5"
                cx={this.props.xScale(decompPoints[0].x)}
                cy={this.props.yScale(decompPoints[0].y)}
                fill={this.props.fill}
              />
              <circle
                className="point"
                r="5"
                cx={this.props.xScale(decompPoints[1].x)}
                cy={this.props.yScale(decompPoints[1].y)}
                fill={this.props.fill}
              /> */}
            </g>
          );
        }
      }
    }

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
    return (
      <g>
        {compound}
        {tieline}
        {decompCircles}
        {point}
      </g>
    );
  }
}

Point.propTypes = propTypes;

export default Point;
