import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

import InfoCard from './InfoCard';
import { getSelectedEntries, removeEntry } from '../../actions/hullActions';
import './infoPage.css';



const propTypes = {
  selectedEntries: PropTypes.array.isRequired,
  selectedEntriesAuids: PropTypes.array.isRequired,
  fetchSelectedEntries: PropTypes.func.isRequired,
  removeEntry: PropTypes.func.isRequired,
};

class InfoPage extends React.Component {
  componentWillMount() {
    if (this.props.selectedEntriesAuids.length !== this.props.selectedEntries.length) {
      this.props.fetchSelectedEntries(this.props.selectedEntriesAuids.map(d => d.auid));
    }
  }

  componentWillUnmount() {
    // entryStore.removeListener('change', this.fetchStore);
  }

  render() {
    const infoCards = this.props.selectedEntries.map(entry => (
      <InfoCard
        data={entry}
        id={entry.auid}
        key={entry.auid}
        removeEntry={this.props.removeEntry}
      />
    ));
    return <div className="row info-row">{infoCards}</div>;
  }
}

InfoPage.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    selectedEntries: state.hulls.selectedEntries,
    selectedEntriesAuids: state.hulls.selectedEntriesAuids,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchSelectedEntries: (auids) => {
      dispatch(getSelectedEntries(auids));
    },
    removeEntry: (auid) => {
      dispatch(removeEntry(auid));
      // dispatch(pointClickHandler(auid));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoPage);
