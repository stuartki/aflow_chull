import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import InfoCard from './LineChartInfoCard';

const propTypes = {
  defaultBehavior: PropTypes.bool.isRequired,
  cx: PropTypes.number.isRequired,
  xScale: PropTypes.func.isRequired,
  cy: PropTypes.number.isRequired,
  yScale: PropTypes.func.isRequired,
  yMin: PropTypes.number.isRequired,
  yMax: PropTypes.number.isRequired,
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
      scStay: false || this.props.defaultBehavior,
    };
    this.onClick = this.onClick.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onLineClick = this.onLineClick.bind(this);
    this.findStabilityCriterion = this.findStabilityCriterion.bind(this);
    this.findStabilityCriterion();
  }

  onClick() {
    this.setState({ scStay: false });
    this.props.pointClickHandler(this.props.auid);
  }

  onMouseOver() {
    this.setState({ sc: true });
  }

  onMouseOut() {
    this.setState({ sc: false });
  }

  onLineClick() {
    this.setState({ scStay: !this.state.scStay });
    if (!this.state.scStay) {
      this.setState({ sc: false });
    }
  }

  findStabilityCriterion() {
    // catch if no stability criterion
    // eslint-disable-next-line react/prop-types
    if (this.props.ssHullVertices === undefined || this.props.ssHullVertices === null) {
      this.scHullVertices = [];
    } else {
      // eslint-disable-next-line react/prop-types
      this.scHullVertices = this.props.ssHullVertices.map(d => (
        { auid: d.auid,
          y: d.enthalpyFormationAtom * 1000,
          x: d.composition[1],
        }
      ));
    }
  }

  render() {
    function ssHullDistance(vertices, curX) {
      let endpoints;
      if (vertices[0].x === curX) {
        endpoints = vertices[0];
      }
      for (let i = 1; i < vertices.length; i++) {
        if (vertices[i].x > curX && vertices[i - 1].x < curX) {
          endpoints = vertices.slice(i - 1, i + 1);
        }
        if (vertices[i] === curX) {
          endpoints = vertices[i];
        }
      }
      if (endpoints.length > 1) {
        const m = (endpoints[1].y - endpoints[0].y) / (endpoints[1].x - endpoints[0].x);
        const b = endpoints[0].y - (m * endpoints[0].x);
        return ((m * curX) + b);
      }
      return (endpoints.y);
    }

    let point = null;
    let ssHull = null;
    let compound = null;
    let filledCircles;

    const xScale = this.props.xScale;
    const yScale = this.props.yScale;
    const x = this.props.xScale.invert(this.props.cx);
    const y = this.props.yScale.invert(this.props.cy);

    if ((this.state.sc || this.state.scStay) && this.props.isClicked) {
      const pathToHull = [
        { x, y },
        { x, y: ssHullDistance(this.scHullVertices, x) },
      ];

      // make new hull circles
      const circles = this.scHullVertices.map(d => (
        <circle
          key={`${d.x.toString()}`}
          className="point"
          r="7"
          cx={xScale(d.x)}
          cy={yScale(d.y)}
          fill="none"
          strokeWidth="3px"
          stroke="#687BC9"
        />
      ));
      if (this.props.defaultBehavior) {
        filledCircles = this.scHullVertices.map(d => (
          <circle
            key={`${d.x.toString()}`}
            className="point"
            r="5"
            cx={xScale(d.x)}
            cy={yScale(d.y)}
            fill={this.props.fill}
          />
        ));
      }

      if (this.props.defaultBehavior) {
        compound =
        (
          <InfoCard
            // eslint-disable-next-line react/prop-types
            data={this.props.entry}
            x={x}
            y={y}
            xScale={this.props.xScale}
            yScale={this.props.yScale}
            yMin={this.props.yMin}
            yMax={this.props.yMax}
          />
        );
      }

      ssHull =
        (
          <g>
            <path
              className="line shadow"
              stroke="#687BC9"
              d={this.props.line(this.scHullVertices)}
              onClick={this.onLineClick}
              strokeLinecap="round"
              strokeDasharray="3, 10"
            />
            <path
              className="line shadow"
              stroke="#687BC9"
              d={this.props.line(pathToHull)}
              onClick={this.onLineClick}
              strokeLinecap="round"
            />
            {circles}
            {filledCircles}
          </g>
        );
    }
    if (y > this.props.yMin && this.props.yMax > y) {
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
    }
    return (
      <g>
        {ssHull}
        {point}
        {/* {compound} */}
      </g>
    );
  }
}

Vertex.propTypes = propTypes;

export default Vertex;
