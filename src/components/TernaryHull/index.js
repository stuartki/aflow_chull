import React from 'react';
import PropTypes from 'prop-types';
import TernaryHullRender from './render';

// import { connect } from 'react-redux';
// import { pointClickHandler } from '../../actions/hullActions.js';

import './ternaryHull.css';
import { $CombinedState } from 'redux';

const propTypes = {
  hull: PropTypes.object.isRequired,
  container: PropTypes.string.isRequired,
  plotEntries: PropTypes.bool.isRequired,
  defaultColor: PropTypes.bool,
  pointClickHandler: PropTypes.func.isRequired,
  sidebarIsVisible: PropTypes.bool,
  resetHull: PropTypes.func.isRequired,
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
        true,
        this.props.defaultColor,
        true,
        this.props.pointClickHandler,
      ),
    };
    this.defaultBehavior = true;
    this.onClick = this.onClick.bind(this);
    this.onCollapseClick = this.onCollapseClick.bind(this);
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
        this.showPointer,
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
        document.getElementsByClassName('default')[0].style.backgroundColor = 'green';
        document.getElementsByClassName('default')[0].textContent = 'DEFAULT';
      } catch (error) {
        console.log(error);
      }
    } else {
      this.defaultText = 'NON-DEFAULT';
      try {
        document.getElementsByClassName('default')[0].style.backgroundColor = 'red';
        document.getElementsByClassName('default')[0].textContent = 'NON-DEFAULT';
      } catch (error) {
        console.log(error);
      }
    }
  }

  onCollapseClick() {
    const content = document.getElementsByClassName('content')[0];
    if (content.style.display === 'block') {
      content.style.display = 'none';
    } else {
      content.style.display = 'block';
    }
  }

  render() {
    return (
      <div id="container">
        <button
          type="button"
          className="collapsible"
          onClick={this.onCollapseClick}
        >
          Options
        </button>
        <div className="content">
          <div id="buttons">
            <button
              className="camera-button default"
              onClick={this.onClick}
            >
              DEFAULT
            </button>
            <button
              className="camera-button"
              onClick={(e) => {
                this.state.THREEscene.setCamera('init');
              }}
            >
              Reset Camera
            </button>
            <button
              className="camera-button"
              onClick={(e) => {
                this.props.resetHull(this.props.hull.name);
              }}
            >
              Reset Points
            </button>

            <button
              className="camera-button"
              onClick={(e) => {
                this.state.THREEscene.switchPointer();
              }}
            >
              Show Pointer
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
          </div>
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
