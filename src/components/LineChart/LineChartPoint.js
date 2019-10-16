import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  cx: PropTypes.number.isRequired,
  raw_cx: PropTypes.number.isRequired,
  cy: PropTypes.number.isRequired,
  fill: PropTypes.string.isRequired,
  auid: PropTypes.string.isRequired,
  vertices: PropTypes.arrayOf(
    PropTypes.shape({
      x: React.PropTypes.number.isRequired,
      y: React.PropTypes.number.isRequired,
    }),
  ).isRequired,
  isClicked: PropTypes.bool.isRequired,
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
    this.setState({ tielineClicked: false });
  }

  render() {
    let tieline = null;
    if (this.props.isClicked) {
      let i;
      let t;
      const ver = this.props.vertices;

      for (i = 0; i < ver.length; i++) {
        if (this.props.raw_cx < ver[i].x) {
          t = ver.slice(i - 1, i + 1);
          break;
        }
      }
      if (this.state.tielineClicked) {
        tieline =
        (<path
          className="line shadow"
          stroke="#ff0000"
          d={this.props.line(t)}
          strokeLinecap="round"
        />);
      }
    }
    return (
      <g>
        {tieline}
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
}

Point.propTypes = propTypes;

export default Point;
