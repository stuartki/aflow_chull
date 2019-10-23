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
      tielineStay: false,
    };
    this.timer = null;
    this.onClick = this.onClick.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onLineClick = this.onLineClick.bind(this);
  }

  onClick() {
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

  // fade(element) {
  //   var op = 1;  // initial opacity
  //   var timer = setInterval(function () {
  //       if (op <= 0.1){
  //           clearInterval(timer);
  //           element.style.display = 'none';
  //       }
  //       element.style.opacity = op;
  //       element.style.filter = 'alpha(opacity=' + op * 100 + ")";
  //       op -= op * 0.1;
  //   }, 50);
  // }

  render() {
    // already inverted in scale
    function hullDistance(endpoints, curX) {
      const m = (endpoints[1].y - endpoints[0].y) / (endpoints[1].x - endpoints[0].x);
      const b = endpoints[0].y - (m * endpoints[0].x);
      return ((m * curX) + b);
    }
    let tieline = null;
    let point = null;
    if (this.props.isClicked && this.props.distanceToHull > 0) {
      let i;
      let t;
      let m;
      const ver = this.props.vertices;

      for (i = 0; i < ver.length; i++) {
        if (this.props.xScale.invert(this.props.cx) < ver[i].x) {
          m = ver.slice(i - 1, i + 1);
          // to format tieline we add radius of circle
          t = [
            { x: m[0].x + this.props.xScale.invert(5), y: m[0].y },
            { x: m[1].x, y: m[1].y },
          ];
          break;
        }
      }
      const x = this.props.xScale.invert(this.props.cx);
      const y = this.props.yScale.invert(this.props.cy);
      const pathToHull = [
        { x, y },
        { x, y: hullDistance(t, x) },
      ];
      if (this.state.tielineClicked || this.state.tielineStay) {
        let stroke = '#ff0000';
        let className = 'line shadow';
        if (this.state.tielineClicked) {
          className = 'hline shadow';
        }
        if (this.state.tielineStay) {
          className = 'tieline shadow';
          stroke = 'green';
        }
        tieline =
        (
          <g>
            <path
              className={className}
              stroke={stroke}
              d={this.props.line(pathToHull)}
              onClick={this.onLineClick}
              strokeLinecap="round"
              strokeDasharray="3, 10"
            />
            <path
              className={className}
              stroke={stroke}
              d={this.props.line(t)}
              strokeLinecap="round"
            />
            <circle
              className="point"
              r="6"
              cx={this.props.xScale(m[1].x)}
              cy={this.props.yScale(m[1].y)}
              fill="none"
              stroke="#ff0000"
            />
            <circle
              className="point"
              r="6"
              cx={this.props.xScale(m[0].x)}
              cy={this.props.yScale(m[0].y)}
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
