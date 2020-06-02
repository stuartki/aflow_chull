import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

const propTypes = {
  height: PropTypes.number.isRequired,
  grid: PropTypes.func.isRequired,
  gridType: PropTypes.oneOf(['x', 'y']).isRequired,
};

class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.renderGrid = this.renderGrid.bind(this);
  }

  componentDidMount() {
    this.renderGrid();
  }

  componentDidUpdate() {
    this.renderGrid();
  }

  renderGrid() {
    // const node = ReactDOM.findDOMNode(this);
    d3.select(this.node).call(this.props.grid);
  }

  render() {
    const translate = `translate(0, ${this.props.height})`;
    return (
      <g
        className="y-grid"
        transform={this.props.gridType === 'x' ? translate : ''}
        ref={(node) => {
          this.node = node;
        }}
      />
    );
  }
}

Grid.propTypes = propTypes;
export default Grid;
