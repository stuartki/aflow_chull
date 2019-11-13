import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

const propTypes = {
  height: PropTypes.number.isRequired,
  axis: PropTypes.func.isRequired,
  axisType: PropTypes.oneOf(['x', 'y']).isRequired,
};

class Axis extends React.Component {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }

  componentDidMount() {
    this.renderAxis();
  }

  componentDidUpdate() {
    this.renderAxis();
  }

  renderAxis() {
    // const node = ReactDOM.findDOMNode(this);
    d3.select(this.node).call(this.props.axis);
  }

  render() {
    const translate = `translate(0, ${this.props.height})`;
    return (
      <g
        className="axis"
        transform={this.props.axisType === 'x' ? translate : ''}
        ref={(node) => {
          this.node = node;
        }}
      />
    );
  }
}

Axis.propTypes = propTypes;
export default Axis;
