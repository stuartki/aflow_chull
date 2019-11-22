/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import Point from './LineChartPoint';
import Vertex from './LineChartVertex';

/*
const propTypes = {
  cx: React.PropTypes.number,
  cy: React.PropTypes.number,
  fill: React.PropTypes.string,
  auid: React.PropTypes.string,
};


class Point extends React.Component {
  propTypes: {
    cx: React.PropTypes.number,
    cy: React.PropTypes.number,
    fill: React.PropTypes.string,
    auid: React.PropTypes.string,
  },
  onClick: function(){
    hullActions.pointClickHandler(this.props.auid);
  },
  render: function() {
    return (
      <circle
        className="dot"
        r="5"
        cx={this.props.cx}
        cy= {this.props.cy}
        fill={this.props.fill}
        onClick={this.onClick}
        strokeWidth="2px"
      />
    );
  }
});
*/

const propTypes = {
  data: PropTypes.array.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  pointClickHandler: PropTypes.func.isRequired,
  pointHoverHandler: PropTypes.func.isRequired,
  vertices: PropTypes.arrayOf(
    PropTypes.shape({
      x: React.PropTypes.number.isRequired,
      y: React.PropTypes.number.isRequired,
    }),
  ).isRequired,
};

const Points = (props) => {
  // svg rendering order dictates the z-index
  // first order rendering
  const data = props.data;
  // second order rendering
  const vertexData = [];
  // third order rendering
  const selectedData = [];
  const scHull = ['aflow:05636011068d8aed', 'aflow:b470c4d5c2656c07', 'aflow:7fc6963bdde3fe0f', 'aflow:17f59ed82fc797fa', 'aflow:edde65439f6a128f', 'aflow:f7a8e64312435b20', 'aflow:8d7250321f32196e'];
  const scHullVertices = data.filter(vertex => scHull.includes(vertex.auid))
    .map(d => (
      { auid: d.auid,
        y: d.enthalpyFormationAtom,
        x: d.composition[1],
      }
    ));

  // first order rendering: general points
  const circles = data.map((d) => {
    let point;
    const fill = props.color;
    if (d.distanceToHull === 0) {
      vertexData.push(d);
    } else if (d.isClicked) {
      selectedData.push(d);
    } else {
      point = (
        <Point
          cx={props.xScale(d.composition[1])}
          xScale={props.xScale}
          cy={props.yScale(d.enthalpyFormationAtom)}
          yScale={props.yScale}
          distanceToHull={d.distanceToHull}
          fill={fill}
          auid={d.auid}
          vertices={props.vertices}
          isClicked={d.isClicked}
          line={props.line}
          pointClickHandler={props.pointClickHandler}
        />
      );
    }
    return (point);
  });

  // second order rendering: hull points
  const vertexCircles = vertexData.map((d) => {
    let fill = props.color;
    if (d.isClicked) {
      fill = '#CA6F96';
    }
    const point = (
      <Vertex
        cx={props.xScale(d.composition[1])}
        xScale={props.xScale}
        cy={props.yScale(d.enthalpyFormationAtom)}
        yScale={props.yScale}
        fill={fill}
        auid={d.auid}
        scHullVertices={scHullVertices}
        isClicked={d.isClicked}
        line={props.line}
        pointClickHandler={props.pointClickHandler}
      />
    );
    return (point);
  });

  // third order rendering: selected points
  const selectedCircles = selectedData.map((d) => {
    const fill = '#CA6F96';
    const point = (
      <Point
        cx={props.xScale(d.composition[1])}
        xScale={props.xScale}
        cy={props.yScale(d.enthalpyFormationAtom)}
        yScale={props.yScale}
        distanceToHull={d.distanceToHull}
        fill={fill}
        auid={d.auid}
        vertices={props.vertices}
        scHullVertices={scHullVertices}
        isClicked={d.isClicked}
        line={props.line}
        pointClickHandler={props.pointClickHandler}
      />
    );
    return (point);
  });
  return (
    <g>
      {circles}
      {vertexCircles}
      {selectedCircles}
    </g>
  );
};

Points.propTypes = propTypes;
export default Points;
