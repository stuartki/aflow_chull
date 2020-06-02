import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  cx: PropTypes.number.isRequired,
  cy: PropTypes.number.isRequired,
  fill: PropTypes.string.isRequired,
  auid: PropTypes.string.isRequired,
  pointClickHandler: PropTypes.func.isRequired,
};

class Point extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.pointClickHandler(this.props.auid);
  }

  render() {
    return (
      <circle
        className="point"
        r="5"
        cx={this.props.cx}
        cy={this.props.cy}
        fill={this.props.fill}
        onClick={this.onClick}
        strokeWidth="2px"
      />
    );
  }
}

Point.propTypes = propTypes;

export default Point;
