/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  showAllPoints: PropTypes.func.isRequired,
  selectedHull: PropTypes.object.isRequired,
  toggleHullPoints: PropTypes.func.isRequired,
  toggleLabels: PropTypes.func.isRequired,
  resetHull: PropTypes.func.isRequired,
};

class HullOptions extends React.Component {
  constructor(props) {
    super(props);
    const hull = {}; // hullStore.getLastSelected();
    this.state = {
      hull,
    };
    this.fetchStore = this.fetchStore.bind(this);
    this.onShowAll = this.onShowAll.bind(this);
    this.onShowHull = this.onShowHull.bind(this);
    this.onTogglelabels = this.onTogglelabels.bind(this);
    this.onReset = this.onReset.bind(this);
  }

  componentWillMount() {
    // hullStore.on('change', this.fetchStore);
  }

  onShowAll() {
    // hullActions.setPointsVisibility(this.state.hull, true);
    this.props.showAllPoints(this.props.selectedHull.name);
  }

  onTogglelabels() {
    this.props.toggleLabels(this.props.selectedHull.name);
  }

  onShowHull() {
    this.props.toggleHullPoints();
  }

  onReset() {
    // hullActions.setPointsVisibility(this.state.hull, true);
    this.props.resetHull(this.props.selectedHull.name);
  }

  fetchStore() {
    const hull = {}; // hullStore.getLastSelected();
    this.setState({
      hull,
    });
  }

  render() {
    return (
      <div className="button-group">
        <div className="button-group-child" onClick={this.onShowAll}>
          Toggle Points
        </div>
        <div className="button-group-child" onClick={this.onTogglelabels}>
          Toggle Labels
        </div>
        <div className="button-group-child" onClick={this.onShowHull}>
          Highlight Hull Points
        </div>
        <div className="button-group-child" onClick={this.onReset}>
          Reset
        </div>
      </div>
    );
  }
}

HullOptions.propTypes = propTypes;

export default HullOptions;
