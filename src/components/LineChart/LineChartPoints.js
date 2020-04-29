/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import Point from './LineChartPoint';
import Vertex from './LineChartVertex';
import axios from 'axios';
import { packSiblings } from 'd3';

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
  defaultBehavior: PropTypes.bool.isRequired,
  hullName: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  line: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  pointClickHandler: PropTypes.func.isRequired,
  yMin: PropTypes.number.isRequired,
  yMax: PropTypes.number.isRequired,
  vertices: PropTypes.arrayOf(
    PropTypes.shape({
      x: React.PropTypes.number.isRequired,
      y: React.PropTypes.number.isRequired,
    }),
  ).isRequired,
};

const Points = (props) => {
  // click is a variable that indicates whether any element is clicked
  let click = false;

  // svg rendering order dictates the z-index
  // first order rendering
  const data = props.data;
  // second order rendering
  const selectedData = [];

  // first order rendering: general points
  const circles = data.map((d) => {
    let point;
    const fill = props.color;
    if (d.isClicked) {
      // push selected points to second order rendering
      selectedData.push(d);
      click = click || d.isClicked;
    } else if (d.distanceToHull === 0) {
      // if vertex, create Vertex component

      // getting ssHullVertices for stability criterion hull
      const vertex = props.vertices.filter(t => t.auid === d.auid);
      const thisSSHullVertices = vertex.length > 0 ? vertex[0].ssHullVertices : null;
      point = (
        <Vertex
          key={d.auid}
          defaultBehavior={props.defaultBehavior}
          entry={d}
          hullName={props.hullName}
          cx={props.xScale(d.composition[1])}
          xScale={props.xScale}
          cy={props.yScale(d.enthalpyFormationAtom)}
          yScale={props.yScale}
          yMin={props.yMin}
          yMax={props.yMax}
          fill={fill}
          auid={d.auid}
          compound={d.compound}
          ssHullVertices={thisSSHullVertices}
          isClicked={d.isClicked}
          line={props.line}
          pointClickHandler={props.pointClickHandler}
        />
      );
    } else {
      let decompositionPoints;
      if (d.decompositionAuids === null || d.decompositionAuids === undefined) {
        decompositionPoints = [];
      } else {
        decompositionPoints = data.filter(entry => d.decompositionAuids.includes(entry.auid));
        decompositionPoints = decompositionPoints.map(pt => ({
          x: pt.composition[1],
          y: pt.enthalpyFormationAtom,
        }));
      }
      if (decompositionPoints.length === 0) {
        decompositionPoints = props.vertices.filter(v => Math.abs(v.x - d.x) < 0.01);
        // if it is not a hull point
        if (decompositionPoints.length === 0) {
          decompositionPoints = props.data.filter(e => d.compound === e.compound);
          let minIndex = 0;
          for (let dp = 0; dp < decompositionPoints.length; dp ++) {
            if (decompositionPoints[dp].enthalpyFormationAtom < decompositionPoints[minIndex].enthalpyFormationAtom) {
              minIndex = dp;
            }
          }
          decompositionPoints = [decompositionPoints[minIndex]];
          decompositionPoints = decompositionPoints.map(pt => ({
            x: pt.composition[1],
            y: pt.enthalpyFormationAtom,
          }));
        }
      }
      point = (
        <Point
          key={d.auid}
          defaultBehavior={props.defaultBehavior}
          entry={d}
          cx={props.xScale(d.composition[1])}
          xScale={props.xScale}
          cy={props.yScale(d.enthalpyFormationAtom)}
          yScale={props.yScale}
          yMin={props.yMin}
          yMax={props.yMax}
          distanceToHull={d.distanceToHull}
          fill={fill}
          auid={d.auid}
          compound={d.compound}
          decompositionPoints={decompositionPoints}
          vertices={props.vertices}
          isClicked={d.isClicked}
          line={props.line}
          pointClickHandler={props.pointClickHandler}
        />
      );
    }
    return (point);
  });

  // if (props.defaultBehavior && click) {
  //   // circles = null;
  //   const x = document.getElementsByClassName('point');
  //   for (let i = 0; i < x.length; i++) {
  //     if (x[i].attributes[4].value === '#CA6F96') {
  //       continue;
  //     }
  //     x[i].style.opacity = 0.4;
  //   }
  //   const extra = document.getElementsByClassName('hull');
  //   const lenExtra = extra.length;
  //   for (let l = 0; l < lenExtra; l++) {
  //     extra[0].parentNode.removeChild(extra[0]);
  //   }
  // } else {
  //   const x = document.getElementsByClassName('point');
  //   for (let i = 0; i < x.length; i++) {
  //     x[i].style.opacity = 1;
  //   }
  // }

  // third order rendering: selected points
  const selectedCircles = selectedData.map((d) => {
    const fill = '#CA6F96';
    let point;
    if (d.distanceToHull === 0) {
      const f = props.vertices.filter(t => t.auid === d.auid);
      const thisSSHullVertices = f.length > 0 ? f[0].ssHullVertices : null;
      point = (
        <Vertex
          key={d.auid}
          defaultBehavior={props.defaultBehavior}
          entry={d}
          hullName={props.hullName}
          cx={props.xScale(d.composition[1])}
          xScale={props.xScale}
          cy={props.yScale(d.enthalpyFormationAtom)}
          yScale={props.yScale}
          yMin={props.yMin}
          yMax={props.yMax}
          fill={fill}
          auid={d.auid}
          compound={d.compound}
          ssHullVertices={thisSSHullVertices}
          isClicked={d.isClicked}
          line={props.line}
          pointClickHandler={props.pointClickHandler}
        />
      );
    } else {
      // handling decomposition points
      let decompositionPoints;

      // if no decomposition points are retrieved from AFLOW, still initialize an array
      if (d.decompositionAuids === null || d.decompositionAuids === undefined) {
        decompositionPoints = [];
      } else {
        // retrieve decomposition point data from entries
        decompositionPoints = data.filter(entry => d.decompositionAuids.includes(entry.auid));
        decompositionPoints = decompositionPoints.map(pt => ({
          x: pt.composition[1],
          y: pt.enthalpyFormationAtom,
        }));
      }
      if (decompositionPoints.length === 0) {
        // first case, find vertex of point directly underneath -> spacegroup decomposition
        decompositionPoints = props.vertices.filter(v => Math.abs(v.x - d.x) < 0.01);
        // if there is no hull points underneath point, find minimum decomposition point
        // that is the same compound as point
        if (decompositionPoints.length === 0) {
          decompositionPoints = props.data.filter(e => d.compound === e.compound);
          let minIndex = 0;
          for (let dp = 0; dp < decompositionPoints.length; dp++) {
            if (decompositionPoints[dp].enthalpyFormationAtom < decompositionPoints[minIndex].enthalpyFormationAtom) {
              minIndex = dp;
            }
          }
          decompositionPoints = [decompositionPoints[minIndex]];
          decompositionPoints = decompositionPoints.map(pt => ({
            x: pt.composition[1],
            y: pt.enthalpyFormationAtom,
          }));
        }
      }
      // if not vertex, the entry is a point
      point = (
        <Point
          key={d.auid}
          defaultBehavior={props.defaultBehavior}
          entry={d}
          cx={props.xScale(d.composition[1])}
          xScale={props.xScale}
          cy={props.yScale(d.enthalpyFormationAtom)}
          yScale={props.yScale}
          yMin={props.yMin}
          yMax={props.yMax}
          distanceToHull={d.distanceToHull}
          fill={fill}
          auid={d.auid}
          compound={d.compound}
          decompositionPoints={decompositionPoints}
          vertices={props.vertices}
          isClicked={d.isClicked}
          line={props.line}
          pointClickHandler={props.pointClickHandler}
        />
      );
    }
    return (point);
  });

  // Points also handles fading of points and deletion of previous LineChartInfoCards
  if (props.defaultBehavior && click) {
    // circles = null;
    const x = document.getElementsByClassName('point');
    for (let i = 0; i < x.length; i++) {
      if (x[i].attributes[4].value === '#CA6F96') {
        continue;
      }
      x[i].style.opacity = 0.4;
    }
    const extra = document.getElementsByClassName('hull');
    const lenExtra = extra.length;
    for (let l = 0; l < lenExtra; l++) {
      extra[0].parentNode.removeChild(extra[0]);
    }
  } else {
    const x = document.getElementsByClassName('point');
    for (let i = 0; i < x.length; i++) {
      x[i].style.opacity = 1;
    }
  }

  return (
    <g>
      {circles}
      {/* hull */}
      <path
        className="line shadow"
        stroke={props.color}
        d={props.line(props.vertices)}
        strokeLinecap="round"
      />
      {selectedCircles}
    </g>
  );
};

Points.propTypes = propTypes;
export default Points;
