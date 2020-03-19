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
        true,
        this.props.pointClickHandler,
      ),
    };
    this.defaultBehavior = true;
    this.onClick = this.onClick.bind(this);
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
        this.defaultBehavior,
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
      this.state.THREEscene.updatePlottedEntries(this.props.hull.entries, this.defaultBehavior);
    }
  }

  onClick() {
    this.defaultBehavior = !this.defaultBehavior;
    this.state.THREEscene.switchDefault();
    if (this.defaultBehavior) {
      try {
        document.getElementById('default').style.backgroundColor = 'green';
        document.getElementById('default').textContent = 'DEFAULT';
      } catch (error) {
        console.log(error);
      }
    } else {
      this.defaultText = 'NON-DEFAULT';
      try {
        document.getElementById('default').style.backgroundColor = 'red';
        document.getElementById('default').textContent = 'NON-DEFAULT';
      } catch (error) {
        console.log(error);
      }
    }
  }

  render() {
    return (
      <div id="container">
        <button
          id="default"
            // eslint-disable-next-line no-unused-vars
          onClick={this.onClick}
        >
          DEFAULT
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
