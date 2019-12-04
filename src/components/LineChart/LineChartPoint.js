import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  cx: PropTypes.number.isRequired,
  xScale: PropTypes.func.isRequired,
  cy: PropTypes.number.isRequired,
  yScale: PropTypes.func.isRequired,
  fill: PropTypes.string.isRequired,
  auid: PropTypes.string.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
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
      tielineStay: false,
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
    this.setState({ tielineClicked: true });
  }

  onMouseOut() {
    this.timer = setTimeout(() => {
      this.setState({ tielineClicked: false });
    }, 1000);
  }

  onLineClick() {
    clearTimeout(this.timer);
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

    // find decomposition points
    // TODO: turn this into getting decomposition reaction
    function findDecomp(xPos, vertices) {
      let decompPoints;
      for (let i = 0; i < vertices.length; i++) {
        if (xPos < vertices[i].x) {
          const temp = vertices.slice(i - 1, i + 1);
          decompPoints = [
            { x: temp[0].x, y: temp[0].y },
            { x: temp[1].x, y: temp[1].y },
          ];
          break;
        }
      }
      return decompPoints;
    }

    // function hullLine(points) {
    //   continue;
    // }

    // svg components
    let tieline = null;
    let point = null;

    // if it is clicked and not a hull point
    if (this.props.isClicked && this.props.distanceToHull > 0) {
      // invert x back to local stoichiometric/enthalpy x/y coordinates
      const x = this.props.xScale.invert(this.props.cx);
      const y = this.props.yScale.invert(this.props.cy);

      // the math part
      // find the decomposition reaction
      const decompPoints = findDecomp(x, this.props.vertices);
      const pathToHull = [
        { x, y },
        { x, y: hullDistance(decompPoints, x) },
      ];

      // drawing the points
      if (this.state.tielineClicked || this.state.tielineStay) {
        let className = 'line shadow';
        if (this.state.tielineClicked) {
          className = 'hline shadow';
        }
        if (this.state.tielineStay) {
          className = 'tieline shadow';
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
            <path
              className={className}
              d={this.props.line(decompPoints)}
              onClick={this.onLineClick}
              strokeLinecap="round"
            />
            <circle
              className="point"
              r="6"
              cx={this.props.xScale(decompPoints[0].x)}
              cy={this.props.yScale(decompPoints[0].y)}
              fill="none"
              stroke="#ff0000"
            />
            <circle
              className="point"
              r="6"
              cx={this.props.xScale(decompPoints[1].x)}
              cy={this.props.yScale(decompPoints[1].y)}
              fill="none"
              stroke="#ff0000"
            />
          </g>
        );
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
        {tieline}
        {point}
      </g>
    );
  }
}

Point.propTypes = propTypes;

export default Point;
