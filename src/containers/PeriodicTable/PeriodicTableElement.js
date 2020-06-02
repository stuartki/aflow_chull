import React from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import * as pTableActions from '../../actions/pTableActions.js';
// import { addElement, fetchAvailableElements } from '../../actions/periodicTableActions.js';

const propTypes = {
  name: PropTypes.string,
  available: PropTypes.bool,
  addElement: PropTypes.func.isRequired,
  reliability: PropTypes.number,
};

const defaultProps = {
  name: 'X',
  available: false,
  reliability: null,
};

class Element extends React.Component {
  constructor(props) {
    super(props);
    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler() {
    this.props.addElement(this.props.name);
    // pTableActions.addElement(this.props.name);
  }

  render() {
    if (this.props.available) {
      let className = ' periodic-table-element available';
      if (this.props.reliability !== null) {
        if (this.props.reliability >= 200) {
          className += ' periodic-table-element__reliable';
        }
        if (this.props.reliability < 200 && this.props.reliability >= 100) {
          className += ' periodic-table-element__semi-reliable';
        }
        if (this.props.reliability < 100 && this.props.reliability >= 0) {
          className += ' periodic-table-element__unreliable';
        }
      }

      return (
        <div className={className} onClick={this.clickHandler}>
          {this.props.name}
        </div>
      );
    }
    return <div className="periodic-table-element unavailable">{this.props.name}</div>;
  }
}

Element.propTypes = propTypes;
Element.defaultProps = defaultProps;

/*
function mapStateToProps() {
  return {

  };
}

function mapDispatchToProps(dispatch) {
  return {
    addElement: (name) => {
      dispatch(addElement(name));
      dispatch(fetchAvailableElements());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Element);
*/

export default Element;
