import React from 'react';
import PropTypes from 'prop-types';

// import * as hullActions from '../../actions/hullActions.js';
// import { removeHull } from '../../actions/hullActions.js';
// import { connect } from 'react-redux';

const propTypes = {
  hull: PropTypes.string.isRequired,
  removeHull: PropTypes.func.isRequired,
};

class CloseBtn extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // hullActions.removeHull(this.props.hull);
    this.props.removeHull(this.props.hull);
  }

  render() {
    return (
      <span onClick={this.handleClick}>
        <svg width="14" height="14">
          <circle className="close-btn" cx="7" cy="7" r="5" />
        </svg>
      </span>
    );
  }
}

CloseBtn.propTypes = propTypes;

export default CloseBtn;
