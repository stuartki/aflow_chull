import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  cx: PropTypes.number.isRequired,
  raw_cx: PropTypes.number.isRequired,
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
      doubleClicked: true,
    };
    this.onClick = this.onClick.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);
  }

  onClick() {
    this.props.pointClickHandler(this.props.auid);
    this.setState({ doubleClicked: false });
  }

  onDoubleClick() {
    this.setState({ doubleClicked: !this.state.doubleClicked });
  }

  onMouseOver() {
    this.setState({ tielineClicked: true });
  }

  onMouseOut() {
    if (!this.state.doubleClicked) {
      this.setState({ tielineClicked: false });
    }
  }

  render() {
    let tieline = null;
    let point = null;
    if (this.props.isClicked) {
      let i;
      let t;
      let tielineClicked;
      const ver = this.props.vertices;

      for (i = 0; i < ver.length; i++) {
        if (this.props.raw_cx < ver[i].x) {
          t = ver.slice(i - 1, i + 1);
          tielineClicked = ver[i].tielineClicked;
          break;
        }
      }
      const pathToHull = [this.props.cy,
        this.props.cy + this.props.yScale(this.props.distanceToHull)];
      if (this.state.tielineClicked) {
        tieline =
        (
          <g>
            <path
              className="line shadow"
              stroke="#ff0000"
              d={this.props.line(t)}
              strokeLinecap="round"
            />
            <path
              className="line shadow"
              stroke="#ff0000"
              d={this.props.line(pathToHull)}
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
                onDoubleClick={this.onDoubleClick}
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
<<<<<<< HEAD
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
=======
        {point}
>>>>>>> local_tieline
      </g>
    );
  }
}

Point.propTypes = propTypes;

export default Point;
