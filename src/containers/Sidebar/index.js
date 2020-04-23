import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Child components
import Searchbox from './SidebarSearchbox';
import HullOptions from './SidebarHullOptions';
import SelectedPoints from './SidebarSelectedPoints';
import InfoCard from './SidebarInfoCard';

import { addElements, fetchAvailableElements } from '../../actions/periodicTableActions';
import {
  fetchHull,
  // removeEntry,
  highlightPoint,
  pointClickHandler,
  setHullPointsVisibility,
  showAllPoints,
  resetHull,
  toggleLabels,
  getSelectedEntries,
} from '../../actions/hullActions';
import './sidebar.css';

// Written as a pure function rather than react component due to stateless-ness

const propTypes = {
  pathname: PropTypes.string.isRequired,
  selectedHull: PropTypes.object.isRequired,
  toggleHullPoints: PropTypes.func.isRequired,
  showAllPoints: PropTypes.func.isRequired,
  toggleLabels: PropTypes.func.isRequired,
  resetHull: PropTypes.func.isRequired,
  addElements: PropTypes.func.isRequired,
  addHull: PropTypes.func.isRequired,
  // removeEntry: PropTypes.func.isRequired,
  highlightPoint: PropTypes.func.isRequired,
  pointClickHandler: PropTypes.func.isRequired,
  isVisible: PropTypes.bool,
  selectedElements: PropTypes.string.isRequired,
  selectedHulls: PropTypes.array.isRequired,
  selectedEntriesAuids: PropTypes.array.isRequired,
  selectedEntries: PropTypes.array.isRequired,
  fetchSelectedEntries: PropTypes.func.isRequired,
};

const defaultProps = {
  isVisible: true,
};

const contextTypes = {
  router: PropTypes.object,
};

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.selectedEntriesAuids.length !== this.props.selectedEntries.length) {
      this.props.fetchSelectedEntries(this.props.selectedEntriesAuids.map(d => d.auid));
    }

    let hullOptions = null;
    if (this.props.pathname.match(/^\/hull\/\w+\/?$/) && this.props.pathname !== '/hull/noSelection') {
      hullOptions = (
        <HullOptions
          selectedHull={this.props.selectedHull}
          toggleHullPoints={this.props.toggleHullPoints}
          showAllPoints={this.props.showAllPoints}
          toggleLabels={this.props.toggleLabels}
          resetHull={this.props.resetHull}
        />
      );
    }
    let className = 'sidebar';
    if (this.props.isVisible) {
      if (window.innerWidth <= 768) {
        className += ' sidebar-show';
      }
    } else {
      className += ' sidebar-hide';
    }
    const infoCard =
      // this.props.selectedEntries.length === this.props.selectedEntriesAuids.length ?
      (<InfoCard
        fetchSelectedEntries={getSelectedEntries}
        selectedEntriesAuids={this.props.selectedEntriesAuids}
        selectedEntries={this.props.selectedEntries}
        selectedHull={this.props.selectedHull}
      />);

    return (
      <div className={className}>
        <div className="sidebar-body">
          <Searchbox
            pathname={this.props.pathname}
            selectedElements={this.props.selectedElements}
            addElements={this.props.addElements}
            addHull={this.props.addHull}
            selectedHulls={this.props.selectedHulls}
            pointClickHandler={this.props.pointClickHandler}
          />
          <SelectedPoints
            selectedEntriesAuids={this.props.selectedEntriesAuids}
            // removeEntry={this.props.removeEntry}
            pointClickHandler={this.props.pointClickHandler}
            highlightPoint={this.props.highlightPoint}
          />
          {infoCard}
          {hullOptions}
        </div>
      </div>
    );
  }
}

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;
Sidebar.contextTypes = contextTypes;

function mapStateToProps(state) {
  return {
    lastSelected: state.hulls.lastSelected,
    selectedElements: state.periodicTable.selectedElements.join(''),
    selectedEntries: state.hulls.selectedEntries,
    selectedEntriesAuids: state.hulls.selectedEntriesAuids,
    selectedHulls: state.hulls.selectedHulls,
    selectedHull: state.hulls.selectedHull,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addElements: (elements) => {
      dispatch(addElements(elements));
      dispatch(fetchAvailableElements());
    },
    addHull: (name, selectedHulls) => dispatch(fetchHull(name, selectedHulls)),
    // removeEntry: (auid) => {
    //   dispatch(removeEntry(auid));
    //   // dispatch(pointClickHandler(auid));
    // },
    pointClickHandler: auid => dispatch(pointClickHandler(auid)),
    highlightPoint: auid => dispatch(highlightPoint(auid)),
    toggleHullPoints: () => dispatch(setHullPointsVisibility()),
    showAllPoints: name => dispatch(showAllPoints(name)),
    toggleLabels: name => dispatch(toggleLabels(name)),
    resetHull: name => dispatch(resetHull(name)),

    fetchSelectedEntries: (auids) => {
      dispatch(getSelectedEntries(auids));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
