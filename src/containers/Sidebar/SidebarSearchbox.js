import React from 'react';
import PropTypes from 'prop-types';
import { hashHistory } from 'react-router';
// import '../css/searchbox.css';

// import { connect } from 'react-redux';
// import { addElements, fetchAvailableElements } from '../../actions/periodicTableActions.js';
// import { fetchHull } from '../../actions/hullActions.js';

// import pTableStore from '../../stores/pTableStore.js';
// import * as pTableActions from '../../actions/pTableActions.js';

// import hullStore from '../../stores/hullStore.js';
// import * as hullActions from '../../actions/hullActions.js';

const propTypes = {
  pathname: PropTypes.string.isRequired,
  addHull: PropTypes.func.isRequired,
  addElements: PropTypes.func.isRequired,
  selectedHulls: PropTypes.array.isRequired,
  selectedElements: PropTypes.string.isRequired,
  pointClickHandler: PropTypes.func.isRequired,
};

class Searchbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedElements: [], // pTableStore.getSelectedElements().join(''),
    };

    this.handleChange = this.handleChange.bind(this);
    this.onEnter = this.onEnter.bind(this);
    this.onClick = this.onClick.bind(this);
    this.fetchStore = this.fetchStore.bind(this);
  }

  componentWillMount() {
    // pTableStore.on('change', this.fetchStore);
  }

  componentWillUnmount() {
    // pTableStore.removeListener('change', this.fetchStore);
  }

  onEnter(e) {
    if (e.charCode === 13 && e.target.value !== '') {
      if (e.target.value.charAt(0) === 'c') {
        // eslint-disable-next-line max-len
        const thisHull = this.props.pathname.split('/')[-1];
        let index = 0;
        for (let i = 0; i < this.props.selectedHulls.length; i++) {
          if (thisHull === this.props.selectedHulls[i].name) {
            index = i;
          }
        }
        const entry = this.props.selectedHulls[index].entries.filter(d => d.compound === e.target.value.slice(1));
        if (entry.length > 0) {
          this.props.pointClickHandler(entry[0].auid);
        }
      } else if (e.target.value.includes('aflow:')) {
        this.props.pointClickHandler(e.target.value);
      } else if (this.props.pathname === '/history') {
        /*
        if (hullStore.getHullFromStore(this.state.selectedElements) === null) {
          hullActions.addHull(this.state.selectedElements);
        }
        */
        this.props.addHull(e.target.value, this.props.selectedHulls);
      } else {
        hashHistory.push(`hull/${e.target.value}`); // change route
      }
      e.target.value = '';
      // pTableActions.addElements([]);
      this.props.addElements([]);
    }
  }

  onClick() {
    if (this.props.selectedElements !== '') {
      if (this.props.pathname === '/history') {
        /*
        if (hullStore.getHullFromStore(this.state.selectedElements) === null) {
          hullActions.addHull(this.state.selectedElements);
        }
        */
        this.props.addHull(this.props.selectedElements, this.props.selectedHulls);
      } else {
        hashHistory.push(`hull/${this.props.selectedElements}`); // change route
      }
      // pTableActions.addElements([]);
      this.props.addElements([]);
    }
  }

  handleChange(event) {
    this.setState({ selectedElements: event.target.value });
    if (event.target.value.length) {
      // pTableActions.addElements(event.target.value.split(/(?=[A-Z])/));
      this.props.addElements(event.target.value.split(/(?=[A-Z])/));
    } else {
      // pTableActions.addElements([]);
      this.props.addElements([]);
    }
  }

  fetchStore() {
    this.setState({
      selectedElements: [], // pTableStore.getSelectedElements().join(''),
    });
  }

  render() {
    return (
      <div className="search-group">
        <input
          autoComplete="off"
          className="hull-input inline"
          placeholder="Search"
          value={this.props.selectedElements}
          onChange={this.handleChange}
          onKeyPress={this.onEnter}
          type="text"
        />
        <div className="input-icon-container inline" onClick={this.onClick}>
          <i data-toggle="tooltip" title="submit" className="fa fa-search fa-2x search-btn" />
        </div>
      </div>
    );
  }
}

Searchbox.propTypes = propTypes;

/*
function mapStateToProps(state) {
  return {
    selectedElements: state.periodicTable.selectedElements.join(''),
    availableElements: state.periodicTable.availableElements,
    lastSelected: state.hulls.lastSelected,
    selectedHulls: state.hulls.selectedHulls,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addElements: (elements) => {
      dispatch(addElements(elements));
      dispatch(fetchAvailableElements());
    },
    addHull: (name, selectedHulls) => dispatch(fetchHull(name, selectedHulls)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Searchbox);
*/
export default Searchbox;
