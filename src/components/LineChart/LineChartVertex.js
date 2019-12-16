import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const propTypes = {
  hullName: PropTypes.string.isRequired,
  cx: PropTypes.number.isRequired,
  xScale: PropTypes.func.isRequired,
  cy: PropTypes.number.isRequired,
  yScale: PropTypes.func.isRequired,
  fill: PropTypes.string.isRequired,
  auid: PropTypes.string.isRequired,
  compound: PropTypes.string.isRequired,
  isClicked: PropTypes.bool.isRequired,
  line: PropTypes.func.isRequired,
  pointClickHandler: PropTypes.func.isRequired,
};

class Vertex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sc: false,
    };
    this.onClick = this.onClick.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.findStabilityCriterion = this.findStabilityCriterion.bind(this);
    this.findStabilityCriterion(this.props.auid);
  }

  onClick() {
    this.props.pointClickHandler(this.props.auid);
  }

  onMouseOver() {
    this.setState({ sc: true });
  }

  onMouseOut() {
    this.setState({ sc: false });
  }

  findStabilityCriterion(auid) {
    const auidCode = auid.slice(6);
    const query = `${this.props.hullName}_n_${auidCode}`;
    // const url = 'http://localhost:4000/data';
    const url = `http://aflowlib.duke.edu/search/ui/API/chull/v1.2/?ss=${query}`;
    axios.get(url).then((res) => {
      this.scHullVertices = res.data.vertices.map(d => (
        { auid: d.auid,
          y: d.enthalpyFormationAtom * 1000,
          x: d.composition[1],
        }
      ));
    });
    setTimeout(() => console.log(this.scHullVertices), 100);
  }

  render() {
    let point = null;
    let ssHull = null;
    const xScale = this.props.xScale;
    const yScale = this.props.yScale;
    if (this.state.sc && this.props.isClicked) {
      const circles = this.scHullVertices.map(d => (
        <circle
          className="point"
          r="5"
          cx={xScale(d.x)}
          cy={yScale(d.y)}
          fill="none"
          strokeWidth="2px"
          stroke="#ff0000"
        />
      ));
      ssHull =
        (
          <g>
            <path
              className="line shadow"
              stroke="blue"
              d={this.props.line(this.scHullVertices)}
              strokeLinecap="round"
            />
            {circles}
          </g>
        );
    }
    point =
        (
          <g>
            <circle
              className="point"
              r="5"
              cx={this.props.cx}
              cy={this.props.cy}
              fill={this.props.fill}
              onClick={this.onClick}
              onMouseOver={this.onMouseOver}
              onMouseOut={this.onMouseOut}
              strokeWidth="2px"
            />
          </g>
        );
    return (
      <g>
        {ssHull}
        {point}
      </g>
    );
  }
}

Vertex.propTypes = propTypes;

export default Vertex;
