import React from 'react';
import PropTypes from 'prop-types';
import SelectedPointsEntry from './SidebarSelectedPointsEntry';

const propTypes = {
  selectedEntriesAuids: PropTypes.array.isRequired,
  removeEntry: PropTypes.func.isRequired,
};

class SelectedPoints extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedEntries: [], // entryStore.getAll(),
    };
    this.fetchStore = this.fetchStore.bind(this);
  }

  componentWillMount() {
    // entryStore.on('change', this.fetchStore);
  }

  componentWillUnmount() {
    // entryStore.removeListener('change', this.fetchStore);
  }

  fetchStore() {
    this.setState({
      selectedHulls: [], // hullStore.getAll(),
    });
  }

  render() {
    const selectedEntries = this.props.selectedEntriesAuids.map(d => (
      <SelectedPointsEntry
        compound={d.compound}
        id={d.auid}
        key={d.auid}
        removeEntry={this.props.removeEntry}
      />
    ));
    return (
      <div className="info-div">
        <h3>Selected Points</h3>
        <div className="info-div-body">{selectedEntries}</div>
      </div>
    );
  }
}

SelectedPoints.propTypes = propTypes;

export default SelectedPoints;
