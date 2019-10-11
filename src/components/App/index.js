import React from 'react';
import PropTypes from 'prop-types';

// Global styles
import '../../css/bootstrap.min.css';
import '../../css/font-awesome.min.css';
import './app.css';

// Child components
import Navbar from '../../containers/Navbar';
import Sidebar from '../../containers/Sidebar';


const propTypes = {
  location: PropTypes.object.isRequired,
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSidebar: true,
    };
    this.toggleSidebar = this.toggleSidebar.bind(this);
  }

  getVisibility() {
    return this.state.showSidebar;
  }

  toggleSidebar() {
    this.setState({
      showSidebar: !this.state.showSidebar,
    });
  }

  render() {
    let viewportClass = 'container-fluid viewport';
    if (this.state.showSidebar) {
      viewportClass += ' sidebar-offset';
    }
    return (
      <div>
        <Sidebar pathname={this.props.location.pathname} isVisible={this.state.showSidebar} />
        <Navbar toggleSidebar={this.toggleSidebar} />
        <div id="viewport" className={viewportClass}>
          {React.cloneElement(this.props.children, { sidebarIsVisible: this.state.showSidebar })}
        </div>
      </div>
    );
  }
}

App.propTypes = propTypes;

export default App;
