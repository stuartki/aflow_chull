import React from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';

import './binaryHull.css';
import LineChart from '../LineChart';
// import * as hullActions from '../../actions/hullActions.js';
// import { resizeHullAxes } from '../../actions/hullActions.js';

const propTypes = {
  hull: PropTypes.object.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  showAxisLabels: PropTypes.bool,
  fullscreen: PropTypes.bool,
  resizeHullAxes: PropTypes.func.isRequired,
  pointClickHandler: PropTypes.func.isRequired,
  sidebarIsVisible: PropTypes.bool,
};

const defaultProps = {
  width: 780,
  height: 280,
  fullscreen: false,
  showAxisLabels: true,
  sidebarIsVisible: true,
};

class BinaryHull extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      yMin: this.props.hull.yMin,
      yMax: this.props.hull.yMax,
      defaultBehavior: true,
    };

    this.incrementMin = this.incrementMin.bind(this);
    this.incrementMax = this.incrementMax.bind(this);
    this.decrementMin = this.decrementMin.bind(this);
    this.decrementMax = this.decrementMax.bind(this);
  }

  incrementMin() {
    this.setState({
      yMin: this.state.yMin + 100,
    });

    this.props.resizeHullAxes(this.props.hull.name, this.state.yMin, this.state.yMax);
  }

  decrementMin() {
    this.setState({
      yMin: this.state.yMin - 100,
    });

    this.props.resizeHullAxes(this.props.hull.name, this.state.yMin, this.state.yMax);
  }

  incrementMax() {
    this.setState({
      yMax: this.state.yMax + 100,
    });

    this.props.resizeHullAxes(this.props.hull.name, this.state.yMin, this.state.yMax);
  }

  decrementMax() {
    this.setState({
      yMax: this.state.yMax - 100,
    });

    this.props.resizeHullAxes(this.props.hull.name, this.state.yMin, this.state.yMax);
  }

  render() {
    let xLabel = '';
    let yLabel = '';
    if (this.props.showAxisLabels) {
      xLabel = `composition ${this.props.hull.species[1]}`;
      yLabel = 'formation enthalpy (meV)';
    }

    // there is a better solution for this, but it is to catch first time render problem
    // default does not exist before rendered
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
      <div>
        <div>
          <button
            id="default"
              // eslint-disable-next-line no-unused-vars
            onClick={(e) => {
              this.setState({ defaultBehavior: !this.state.defaultBehavior });
            }}
          >
            Default
          </button>
        </div>
        <div className="axis-controls">
          <label htmlFor="yMax"> Y Max </label>
          <input
            id="yMax"
            className="axis-input"
            type="number"
            name="yMax"
            value={this.state.yMax}
            min="100"
            max="2000"
            onChange={(e) => {
              const val = e.target.value;
              this.setState({
                yMax: Number(val),
              });
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                this.props.resizeHullAxes(this.props.hull.name, this.state.yMin, this.state.yMax);
              }
            }}
          />
        </div>
        <LineChart
          defaultBehavior={this.state.defaultBehavior}
          color={this.props.hull.color}
          width={this.props.width}
          height={this.props.height}
          fullscreen={this.props.fullscreen}
          chartId={this.props.hull.name}
          vertices={this.props.hull.vertices}
          points={this.props.hull.entries}
          pointClickHandler={this.props.pointClickHandler}
          showAllPoints={this.props.hull.showAllPoints}
          yMin={this.props.hull.yMin}
          yMax={this.props.hull.yMax}
          xAxisLabel={xLabel}
          yAxisLabel={yLabel}
          sidebarIsVisible={this.props.sidebarIsVisible}
        />
        <div className="axis-controls">
          <label htmlFor="yMin"> Y Min </label>
          <input
            id="yMin"
            className="axis-input"
            type="number"
            name="yMin"
            value={this.state.yMin}
            min="-2000"
            max="-100"
            onChange={(e) => {
              const val = e.target.value;
              this.setState({
                yMin: Number(val),
              });
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.target.value <= -100) {
                this.props.resizeHullAxes(this.props.hull.name, this.state.yMin, this.state.yMax);
              }
            }}
          />
        </div>
        <div>
          <button
            id="reset"
            // eslint-disable-next-line no-unused-vars
            onClick={(e) => {
              this.props.resizeHullAxes(this.props.hull.name, Number(-1000), Number(1000));
              this.setState({
                yMax: Number(1000),
                yMin: Number(-1000),
              });
            }}
          >
            View Reset
          </button>
          <button
            id="hullresize"
            // eslint-disable-next-line no-unused-vars
            onClick={(e) => {
              const vertices = this.props.hull.vertices.map(v => v.y);
              const hullyMin = Math.min(...vertices);
              const hullyMax = Math.max(...vertices);
              const offset = 10;
              this.props.resizeHullAxes(this.props.hull.name,
                Math.min(Number(hullyMin) - offset, Number(-100)),
                Math.max(Number(hullyMax) + offset, Number(100)));
              // this.setState({
              //   yMax: Math.max(Number(hullyMax) + offset, Number(100)),
              //   yMin: Math.min(Number(hullyMin) - offset, Number(-100)),
              // });
            }}
          >
            View Hull
          </button>
        </div>
      </div>
    );
  }
}

BinaryHull.propTypes = propTypes;
BinaryHull.defaultProps = defaultProps;

/*
function mapStateToProps(state) {
  return {
    selectedHulls: state.hulls.selectedHulls,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    resizeHullAxes: (name, yMin, yMax) => dispatch(resizeHullAxes(name, yMin, yMax)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BinaryHull);
*/
export default BinaryHull;
