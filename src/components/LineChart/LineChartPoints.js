import React from 'react';
import PropTypes from 'prop-types';
import Point from './LineChartPoint';

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
};

const Points = (props) => {
  const data = props.data;
  const circles = data.map((d) => {
    let fill = props.color;
    if (d.isClicked) {
      fill = '#CA6F96';
    }
    return (
      <Point
        cx={props.xScale(d.composition[1])}
        cy={props.yScale(d.enthalpyFormationAtom)}
        fill={fill}
        key={d.auid}
        auid={d.auid}
        isClicked={d.isClicked}
        pointClickHandler={props.pointClickHandler}
      />
    );
  });

  return <g>{circles}</g>;
};

Points.propTypes = propTypes;
export default Points;
