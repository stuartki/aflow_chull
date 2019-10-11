import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import './navbar.css';

// import hullStore from '../../stores/hullStore.js';

const propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  lastSelected: PropTypes.string.isRequired,
};

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastSelected: {}, // hullStore.getLastSelected(),
    };
    this.fetchLastSelectedHull = this.fetchLastSelectedHull.bind(this);
  }

  componentWillMount() {
    // hullStore.on('change', this.fetchLastSelectedHull);
  }

  componentWillUnmount() {
    // hullStore.removeListener('change', this.fetchLastSelectedHull);
  }

  fetchLastSelectedHull() {
    this.setState({
      lastSelected: {}, // hullStore.getLastSelected(),
    });
  }

  render() {
    return (
      <header className="nav">
        <div className="float-left sidebar-toggle">
          <i
            className="fa fa-bars sidebar-toggle-btn"
            aria-hidden="true"
            onClick={this.props.toggleSidebar}
          />
        </div>
        <div className="nav-brand float-left">
          <Link to="/periodic-table">
            <img
              src="http://aflowlib.org/images/logo.png"
              alt=""
              height="50"
              width="179"
            />
          </Link>
        </div>
        <div className="navlink float-right">
          <Link to="/history">
            <div className="nav-tooltip">
              <i className="fa fa-info-circle fa-history nav-btn-default" />
              <span className="nav-tooltip__text">Hull History</span>
            </div>
          </Link>
        </div>
        <div className="navlink float-right">
          <Link to="/info">
            <div className="nav-tooltip">
              <i className="fa fa-info-circle fa-2x nav-btn-default" />
              <span className="nav-tooltip__text">Selected Points</span>
            </div>
          </Link>
        </div>
        <div className="navlink float-right">
          <Link to={`/hull/${this.props.lastSelected}`}>
            <div className="nav-tooltip">
              <i className="fa fa-area-chart fa-2x nav-btn-default" />
              <span className="nav-tooltip__text">Selected Hull</span>
            </div>
          </Link>
        </div>
        <div className="navlink float-right">
          <Link to="/periodic-table">
            <div className="nav-tooltip">
              <i className="fa fa-table fa-2x nav-btn-default" />
              <span className="nav-tooltip__text">Periodic Table</span>
            </div>
          </Link>
        </div>
      </header>
    );
  }
}

Navbar.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    lastSelected: state.hulls.lastSelected,
  };
}

export default connect(mapStateToProps)(Navbar);
