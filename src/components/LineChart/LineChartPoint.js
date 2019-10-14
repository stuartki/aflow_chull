import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  cx: PropTypes.number.isRequired,
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
  pointHoverHandler: PropTypes.func.isRequired,
};

class Point extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
  }

  onClick() {
    this.props.pointClickHandler(this.props.auid);
  }

  onMouseOver() {
    this.props.pointHoverHandler(this.props.auid);
  }

  render() {
    let tieline = null;
    if (this.props.isClicked) {
      let i;
      let t;
      for (i = 0; i < this.props.vertices.length; i++) {
        if (this.cx < this.props.vertices[i]) {
          t = this.props.vertices.slice(i - 1, i);
          console.log(t);
        }
      }
      tieline =
      (<path
        className="line shadow"
        stroke="#ff0000"
        d={this.props.line(t)}
        strokeLinecap="round"
      />);
    }
    return (
      <circle
        className="point"
        r="5"
        cx={this.props.cx}
        cy={this.props.cy}
        fill={this.props.fill}
        onClick={this.onClick}
        onMouseOver={this.onMouseOver}
        strokeWidth="2px"
      />
    );
  }
}

Point.propTypes = propTypes;

export default Point;
