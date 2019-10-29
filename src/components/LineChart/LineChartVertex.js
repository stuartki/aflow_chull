import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  cx: PropTypes.number.isRequired,
  xScale: PropTypes.func.isRequired,
  cy: PropTypes.number.isRequired,
  yScale: PropTypes.func.isRequired,
  fill: PropTypes.string.isRequired,
  auid: PropTypes.string.isRequired,
  scHullVertices: PropTypes.arrayOf(
    PropTypes.shape({
      auid: React.PropTypes.string.isRequired,
      x: React.PropTypes.number.isRequired,
      y: React.PropTypes.number.isRequired,
    }),
  ).isRequired,
  isClicked: PropTypes.bool.isRequired,
  line: PropTypes.func.isRequired,
  pointClickHandler: PropTypes.func.isRequired,
};

class Vertex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sc: false,
    };
    this.onClick = this.onClick.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
  }

  onClick() {
    this.props.pointClickHandler(this.props.auid);
  }

  onMouseOver() {
    this.setState({ sc: true });
  }

  onMouseOut() {
    this.setState({ sc: false });
  }

  render() {
    let newHull = null;
    let point = null;
    if (this.state.sc && this.props.isClicked) {
      const circles = this.props.scHullVertices.map(d => (
        <circle
          className="point"
          r="5"
          cx={this.props.xScale(d.x)}
          cy={this.props.yScale(d.y)}
          fill="none"
          strokeWidth="2px"
          stroke="#ff0000"
        />
      ));
      newHull =
        (
          <g>
            <path
              className="line shadow"
              stroke="blue"
              d={this.props.line(this.props.scHullVertices)}
              strokeLinecap="round"
            />
            {circles}
          </g>
        );
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
        {newHull}
        {point}
      </g>
    );
  }
}

Vertex.propTypes = propTypes;

export default Vertex;
