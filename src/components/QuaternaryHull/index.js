import React from 'react';
import PropTypes from 'prop-types';
import QuaternaryHullRender from './render';

// import { connect } from 'react-redux';
// import { pointClickHandler } from '../../actions/hullActions.js';

import './quaternaryHull.css';

const propTypes = {
  hull: PropTypes.object.isRequired,
  container: PropTypes.string.isRequired,
  plotEntries: PropTypes.bool.isRequired,
  defaultColor: PropTypes.bool,
  pointClickHandler: PropTypes.func.isRequired,
  sidebarIsVisible: PropTypes.bool,
};

const defaultProps = {
  defaultColor: true,
  sidebarIsVisible: true,
};

class QuaternaryHull extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      THREEscene: new QuaternaryHullRender(
        this.props.hull,
        this.props.plotEntries,
        this.props.defaultColor,
        this.props.pointClickHandler,
      ),
    };
  }

  componentDidMount() {
    this.state.THREEscene.init(this.props.container);
    if (this.props.plotEntries) {
      this.state.THREEscene.plotEntries(this.props.hull.entries);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.hull !== nextProps.hull) {
      const hull = new QuaternaryHullRender(
        nextProps.hull,
        nextProps.plotEntries,
        nextProps.defaultColor,
        nextProps.pointClickHandler,
      );
      this.state.THREEscene.removeEventListeners();
      this.setState({
        THREEscene: hull,
      });
    }

    if (this.props.sidebarIsVisible !== nextProps.sidebarIsVisible) {
      this.state.THREEscene.onWindowResize();
    }
    if (nextProps.hull.showAllPoints === false) {
      this.state.THREEscene.togglePointCloudVisibility(false);
    } else {
      this.state.THREEscene.togglePointCloudVisibility(true);
    }

    if (nextProps.hull.showLabels === false) {
      this.state.THREEscene.toggleLabels(false);
    } else {
      this.state.THREEscene.toggleLabels(true);
    }
  }

  componentWillUpdate() {
    if (this.props.plotEntries) {
      if (this.props.hull.showHullPoints) {
        this.state.THREEscene.updatePlottedEntries(this.props.hull.entries);
      } else {
        this.state.THREEscene.updatePlottedEntries(this.props.hull.entries);
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.hull.name !== prevProps.hull.name) {
      this.div.innerHTML = '';
      this.state.THREEscene.init(this.props.container);
      if (this.props.plotEntries) {
        this.state.THREEscene.plotEntries(this.props.hull.entries);
      }
    }
  }

  render() {
    return (
      <div
        id={this.props.container}
        ref={(c) => {
          this.div = c;
        }}
        className="three-container"
      />
    );
  }
}

QuaternaryHull.propTypes = propTypes;
QuaternaryHull.defaultProps = defaultProps;

export default QuaternaryHull;
