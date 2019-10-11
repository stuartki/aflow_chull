import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './hullCompare.css';

// Child components
import THREEhull from '../../components/TernaryHull';
import BinaryHull from '../../components/BinaryHull';
import QuaternaryHull from '../../components/QuaternaryHull'; //wws16
import Card from './HullCompareCard';

import {
  fetchHull,
  removeHull,
  setSelectedHull,
  resizeHullAxes,
  pointClickHandler,
} from '../../actions/hullActions';

const propTypes = {
  selectedHulls: PropTypes.array.isRequired,
  removeHull: PropTypes.func.isRequired,
  resizeHullAxes: PropTypes.func.isRequired,
  pointClickHandler: PropTypes.func.isRequired,
  sidebarIsVisible: PropTypes.bool,
};

const defaultProps = {
  sidebarIsVisible: true,
};

class HullCompare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
    // this.fetchStore = this.fetchStore.bind(this);
  }

  componentWillMount() {
    // hullStore.on('change', this.fetchStore);
  }

  componentWillUnmount() {
    // hullStore.removeListener('change', this.fetchStore);
  }


  //wws16 added a if dim === 4 block...
  render() {
    const { selectedHulls } = this.props;
    const selectedHullComponents = selectedHulls.map((hull) => {
      const d = new Date();
      const timestamp = d.getTime(); // TODO: come up with better id
      if (hull.dim === 2) {
        return (
          <div className="col-md-6 custom-padding" key={hull.name}>
            <Card title={hull.name} color={'#687BC9'} removeHull={this.props.removeHull}>
              <BinaryHull
                hull={hull}
                showAxisLabels={false}
                resizeHullAxes={this.props.resizeHullAxes}
                pointClickHandler={this.props.pointClickHandler}
                sidebarIsVisible={this.props.sidebarIsVisible}
              />
            </Card>
          </div>
        );
      }
      if (hull.dim === 3) {
        return (
          <div className="col-md-6 custom-padding">
            <Card title={hull.name} color={'#687BC9'} removeHull={this.props.removeHull}>
              <THREEhull
                hull={hull}
                container={hull.name + timestamp}
                showEntries={false}
                defaultColor={false}
                pointClickHandler={this.props.pointClickHandler}
                sidebarIsVisible={this.props.sidebarIsVisible}
              />
            </Card>
          </div>
        );
      }
      if (hull.dim === 4) {
        return (
          <div className="col-md-6 custom-padding">
            <Card title={hull.name} color={'#687BC9'} removeHull={this.props.removeHull}>
              <QuaternaryHull
                hull={hull}
                container={hull.name + timestamp}
                showEntries={false}
                defaultColor={false}
                pointClickHandler={this.props.pointClickHandler}
                sidebarIsVisible={this.props.sidebarIsVisible}
              />
            </Card>
          </div>
        );
      }
      if (hull.dim > 4) {
        return (
          <div className="col-md-6 custom-padding" key={hull.name}>
            <Card title={hull.name} color={'#687BC9'} removeHull={this.props.removeHull}>
              <div className="no-viz">
                No visualization for hulls with dimensions greater than 4.
              </div>
            </Card>
          </div>
        );
      }
      return null;
    });
    return <div className="row hull-compare-row">{selectedHullComponents}</div>;
  }
}

HullCompare.propTypes = propTypes;
HullCompare.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    selectedHulls: state.hulls.selectedHulls,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addHull: (hull, selectedHulls) => {
      dispatch(fetchHull(hull, selectedHulls));
    },
    removeHull: (hull) => {
      dispatch(removeHull(hull));
    },
    setLastSelectedHull: hull => dispatch(setSelectedHull(hull)),
    pointClickHandler: auid => dispatch(pointClickHandler(auid)),
    resizeHullAxes: (name, yMin, yMax) => {
      dispatch(resizeHullAxes(name, yMin, yMax));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HullCompare);
