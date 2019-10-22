import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  cx: PropTypes.number.isRequired,
  xScale: PropTypes.func.isRequired,
  cy: PropTypes.number.isRequired,
  yScale: PropTypes.func.isRequired,
  fill: PropTypes.string.isRequired,
  auid: PropTypes.string.isRequired,
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
    };
    this.onClick = this.onClick.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
  }

  onClick() {
    this.props.pointClickHandler(this.props.auid);
  }

  onMouseOver() {
    this.setState({ tielineClicked: true });
  }

  onMouseOut() {
    setTimeout(() => {
      this.setState({ tielineClicked: false });
    }, 3000);
  }
  // already inverted
  hullDistance(endpoints, curX) {
    const m = (endpoints[1].y - endpoints[0].y) / (endpoints[1].x - endpoints[0].x);
    const b = endpoints[0].y - (m * endpoints[0].x);
    return ((m * curX) + b);
  }
  render() {
    let tieline = null;
    let point = null;
    if (this.props.isClicked) {
      let i;
      let t;
      const ver = this.props.vertices;

      for (i = 0; i < ver.length; i++) {
        if (this.props.xScale.invert(this.props.cx) < ver[i].x) {
          t = ver.slice(i - 1, i + 1);
          break;
        }
      }
      const x = this.props.xScale.invert(this.props.cx);
      const y = this.props.yScale.invert(this.props.cy);
      const pathToHull = [
        { x, y },
        { x, y: this.hullDistance(t, x) },
      ];
      console.log(pathToHull);
      if (this.state.tielineClicked) {
        tieline =
        (
          <g>
            <path
              className="line shadow"
              stroke="#ff0000"
              d={this.props.line(pathToHull)}
              strokeLinecap="round"
              strokeDasharray="3"
            />
            <path
              className="line shadow"
              stroke="#ff0000"
              d={this.props.line(t)}
              strokeLinecap="round"
            />
            <circle
              className="point"
              r="6"
              cx={this.props.xScale(t[1].x)}
              cy={this.props.yScale(t[1].y)}
              fill="none"
              stroke="#ff0000"
            />
            <circle
              className="point"
              r="6"
              cx={this.props.xScale(t[0].x)}
              cy={this.props.yScale(t[0].y)}
              fill="none"
              stroke="#ff0000"
            />

          </g>
        );
      }
    }
    // validation if we have already mapped this point with hover
    if (this.props.distanceToHull > -1) {
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
        {tieline}
        {point}
      </g>
    );
  }
}

Point.propTypes = propTypes;

export default Point;
