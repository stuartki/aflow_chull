import React from 'react';
import PropTypes from 'prop-types';
import TernaryHullRender from './render';

// import { connect } from 'react-redux';
// import { pointClickHandler } from '../../actions/hullActions.js';

import './ternaryHull.css';

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

class TernaryHull extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      THREEscene: new TernaryHullRender(
        this.props.hull,
        this.props.plotEntries,
        this.props.defaultColor,
        this.props.pointClickHandler,
      ),
      defaultBehavior: true,
    };
  }

  componentDidMount() {
    this.state.THREEscene.init(this.props.container);
    // if (this.props.plotEntries) {
    //   this.state.THREEscene.plotEntries(this.props.hull.entries);
    // }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.hull !== nextProps.hull) {
      const hull = new TernaryHullRender(
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

  // componentWillUpdate() {
  //   if (this.props.plotEntries) {
  //     if (this.props.hull.showHullPoints) {
  //       this.state.THREEscene.updatePlottedEntries(this.props.hull.entries);
  //     } else {
  //       this.state.THREEscene.updatePlottedEntries(this.props.hull.entries);
  //     }
  //   }
  // }

  componentDidUpdate(prevProps) {
    if (this.props.hull.name !== prevProps.hull.name) {
      this.div.innerHTML = '';
      this.state.THREEscene.init(this.props.container);
      // if (this.props.plotEntries) {
      //   this.state.THREEscene.plotEntries(this.props.hull.entries);
      // }
    } else {
      this.state.THREEscene.updatePlottedEntries(this.props.hull.entries, this.state.defaultBehavior);
    }
  }

  render() {
    // bootstrap way of fixing color with try and catch
    if (this.state.defaultBehavior) {
      try {
        document.getElementById('default').style.backgroundColor = 'green';
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        document.getElementById('default').style.backgroundColor = 'red';
      } catch (error) {
        console.log(error);
      }
    }
    return (
      <div id="container">
        <button
          id="default"
            // eslint-disable-next-line no-unused-vars
          onClick={(e) => {
            this.setState({ defaultBehavior: !this.state.defaultBehavior });
          }}
        >
          Default
        </button>
        <div id="buttons">
          <button
            // id="reset"
            className="camera-button"
            onClick={(e) => {
              this.state.THREEscene.setCamera('init');
              // this.state.THREEscene.render();
            }}
          >
          Reset Camera
          </button>
          <button
            // id="reset"
            className="camera-button"
            onClick={(e) => {
              this.state.THREEscene.THull.n1EnthalpyGain();
            }}
          >
          N+1 Enthalpy Gain
          </button>
          {/* <button
            // id="reset"
            className="camera-button"
            onClick={(e) => {
              this.state.THREEscene.setCamera(2);
            }}
          >
          2
          </button> */}
        </div>
        <div
          id={this.props.container}
          // ref={(c) => {
          //   this.div = c;
          // }}
          className="three-container"
        />
      </div>
    );
  }
}

TernaryHull.propTypes = propTypes;
TernaryHull.defaultProps = defaultProps;

export default TernaryHull;
