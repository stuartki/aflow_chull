import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

// import { connect } from 'react-redux';
// import { removeEntry, pointClickHandler } from '../../actions/hullActions.js';

// import * as hullActions from '../../actions/hullActions.js';

const propTypes = {
  id: PropTypes.string.isRequired,
  compound: PropTypes.string.isRequired,
  removeEntry: PropTypes.func.isRequired,
};

class SelectedPointsEntry extends React.Component {
  constructor(props) {
    super(props);
    this.removeOnClick = this.removeOnClick.bind(this);
  }

  removeOnClick() {
    // While the remove entry action could be called, the selected points will
    // still appear highlighted on the hulls. Therefore, the point click action
    // is called instead which will handle everything.

    // hullActions.pointClickHandler(this.props.id);
    this.props.removeEntry(this.props.id);
  }

  render() {
    return (
      <div className="info-element">
        <div className="info-element-inner">
          <Link to={`info#${this.props.id}`}>
            {this.props.compound}
          </Link>
          <span onClick={this.removeOnClick} className="pull-right">
            <svg width="14" height="14" style={{ paddingTop: '2px', marginRight: '6px' }}>
              <circle className="close-btn" cx="7" cy="7" r="5" />
            </svg>
          </span>
        </div>
      </div>

    );
  }
}

SelectedPointsEntry.propTypes = propTypes;


/*
function mapStateToProps() {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
    removeEntry: (auid) => {
      dispatch(removeEntry(auid));
      // dispatch(pointClickHandler(auid));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectedPointsEntry);
*/
export default SelectedPointsEntry;
