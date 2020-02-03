import React from 'react';
import PropTypes from 'prop-types';
import './tutorial.css';
// import * as hullActions from '../../actions/hullActions.js';
// import { removeEntry, pointClickHandler } from '../../actions/hullActions.js';


const propTypes = {
  tutorialMode: PropTypes.bool.isRequired,
  parentNode: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};

const defaultProps = {
  width: 800,
  height: 300,
};

class Tutorial2D extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: props.width,
      height: props.height,
      counter: 0,
    };
    this.counter = 0;
    this.updateSize = this.updateSize.bind(this);

    this.nextOnClick = this.nextOnClick.bind(this);
    this.previousOnClick = this.previousOnClick.bind(this);
  }

  componentDidMount() {

  }

  nextOnClick() {
    this.setState({ counter: this.state.counter + 1 });
  }

  previousOnClick() {
    this.setState({ counter: this.state.counter - 1 });
  }

  updateSize() {
    // const node = ReactDOM.findDOMNode(this);
    // eslint-disable-next-line max-len
    const parentWidth = this.props.nodes[1].getBoundingClientRect().width;

    if (parentWidth < this.props.width) {
      this.setState({ width: parentWidth - 20 });
    } else {
      this.setState({ width: this.props.width });
    }

    // if (this.props.fullscreen) {
    //   this.setState({ height: window.innerHeight - 200 });
    // }
  }

  render() {
    if (this.state.counter === 1 || this.state.counter === 5 || this.state.counter === 6) {
      this.props.nodes[1].style.opacity = 1;
    } else {
      this.props.nodes[1].style.opacity = 0.5;
    }

    return (
      <div>
        {this.state.counter === 0 ?
          <div id="intro">
            Welcome to the 2D Tutorial!
          </div>
        : null}

        {this.state.counter === 1 ?
          <div id="clickIntro">
            Click on one of the points. Then hit NEXT.
          </div>
        : null}

        {this.state.counter === 2 ?
          <div id="clickIntro">
            It selects the point, and lists the formation enthalpy and the distance to the hull in meV.
            You can view the point in the sidebar as well.
          </div>
        : null}

        {this.state.counter === 3 ?
          <div id="clickIntro">
            You can also see which compounds the selected compound decomposes to.
          </div>
        : null}
        
        {this.state.counter === 4 ?
          <div id="clickIntro">
            You can deselect the point by clicking the point again,
            or opening the sidebar and clicking the red dot next to the point selected.
          </div>
        : null}

        {this.state.counter === 5 ?
          <div id="clickIntro">
            Deselect the point now.
          </div>
        : null}

        {this.state.counter === 6 ?
          <div id="clickIntro">
            Next, click a point on the hull.
          </div>
        : null}

        {this.state.counter === 7 ?
          <div id="clickIntro">
            Next, click a point on the hull.
          </div>
        : null}
        <div
          id="tut"
        >
          <button id="next" onClick={this.nextOnClick}>
            Next
          </button>
          <button id="previous" onClick={this.previousOnClick}>
            Previous
          </button>
        </div>
      </div>
    );
  }
}

Tutorial2D.propTypes = propTypes;
Tutorial2D.defaultProps = defaultProps;
export default Tutorial2D;
