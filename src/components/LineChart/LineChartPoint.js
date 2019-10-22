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
    }, 2000);
  }

  onLineClick() {
    clearTimeout(this.timer);
    this.setState({ tielineStay: !this.state.tielineStay });
  }
  // already inverted
  // eslint-disable-next-line class-methods-use-this
  hullDistance(endpoints, curX) {
    const m = (endpoints[1].y - endpoints[0].y) / (endpoints[1].x - endpoints[0].x);
    const b = endpoints[0].y - (m * endpoints[0].x);
    return ((m * curX) + b);
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
      if (this.state.tielineClicked || this.state.tielineStay) {
        const stroke = '#ff0000';
        let className = 'line shadow';
        if (this.state.tielineStay) {
          className = 'tieline shadow';
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
              strokeDasharray="3"
            />
            <path
              className={className}
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
