import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Child components
import Searchbox from './SidebarSearchbox';
import HullOptions from './SidebarHullOptions';
import SelectedPoints from './SidebarSelectedPoints';

import { addElements, fetchAvailableElements } from '../../actions/periodicTableActions';
import {
  fetchHull,
  removeEntry,
  setHullPointsVisibility,
  showAllPoints,
  resetHull,
  toggleLabels,
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
  removeEntry: PropTypes.func.isRequired,
  isVisible: PropTypes.bool,
  selectedElements: PropTypes.string.isRequired,
  selectedHulls: PropTypes.array.isRequired,
  selectedEntriesAuids: PropTypes.array.isRequired,
};

const defaultProps = {
  isVisible: true,
};

const contextTypes = {
  router: PropTypes.object,
};

const Sidebar = function render(props) {
  let hullOptions = null;
  if (props.pathname.match(/^\/hull\/\w+\/?$/) && props.pathname !== '/hull/noSelection') {
    hullOptions = (
      <HullOptions
        selectedHull={props.selectedHull}
        toggleHullPoints={props.toggleHullPoints}
        showAllPoints={props.showAllPoints}
        toggleLabels={props.toggleLabels}
        resetHull={props.resetHull}
      />
    );
  }
  let className = 'sidebar';
  if (props.isVisible) {
    if (window.innerWidth <= 768) {
      className += ' sidebar-show';
    }
  } else {
    className += ' sidebar-hide';
  }
  return (
    <div className={className}>
      <div className="sidebar-body">
        <Searchbox
          pathname={props.pathname}
          selectedElements={props.selectedElements}
          addElements={props.addElements}
          addHull={props.addHull}
          selectedHulls={props.selectedHulls}
        />
        <SelectedPoints
          selectedEntriesAuids={props.selectedEntriesAuids}
          removeEntry={props.removeEntry}
        />
        {hullOptions}
      </div>
    </div>
  );
};

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
    removeEntry: (auid) => {
      dispatch(removeEntry(auid));
      // dispatch(pointClickHandler(auid));
    },
    toggleHullPoints: () => dispatch(setHullPointsVisibility()),
    showAllPoints: name => dispatch(showAllPoints(name)),
    toggleLabels: name => dispatch(toggleLabels(name)),
    resetHull: name => dispatch(resetHull(name)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
