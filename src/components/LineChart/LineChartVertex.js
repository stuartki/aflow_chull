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
  scHullVertices: PropTypes.arrayOf(
    PropTypes.shape({
      auid: React.PropTypes.string.isRequired,
      x: React.PropTypes.number.isRequired,
      y: React.PropTypes.number.isRequired,
    }),
  ).isRequired,
  isClicked: PropTypes.bool.isRequired,
  distanceToHull: PropTypes.number.isRequired,
  line: PropTypes.func.isRequired,
  pointClickHandler: PropTypes.func.isRequired,
};

class Vertex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sc: true,
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.pointClickHandler(this.props.auid);
  }

  // onDragStart() {
    
  // }

  render() {
    let point = null;
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
        <path
          className="line shadow"
          stroke="blue"
          d={this.props.line(this.props.scHullVertices)}
          strokeLinecap="round"
        />
        {point}
      </g>
    );
  }
}

Vertex.propTypes = propTypes;

export default Vertex;
