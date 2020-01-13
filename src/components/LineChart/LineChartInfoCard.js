import React from 'react';
import PropTypes from 'prop-types';
// import * as hullActions from '../../actions/hullActions.js';
// import { removeEntry, pointClickHandler } from '../../actions/hullActions.js';


const propTypes = {
  data: PropTypes.object.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
};


class InfoCard extends React.Component {

  constructor(props) {
    super(props);
    this.x = this.props.x;
    this.y = this.props.y;
    this.width = 200;
    this.titleHeight = 50;
    this.bodyHeight = 80;
    this.offset = this.width / 10;
  }

  render() {
    const xStart = this.x - (this.width + this.offset);
    const yStart = this.y - (this.titleHeight / 4);
    const xMid = this.x - (this.width + this.offset) + this.width / 2;
    const yTop = this.y - (this.titleHeight / 4);

    const centeringBody = 4;
    return (
      <g width={this.width} height={this.titleHeight + this.bodyHeight}>
        <rect
          x={xStart}
          y={yStart}
          width={this.width}
          height={this.titleHeight}
          fill="#687BC9"
        />
        <text
          x={xStart + (this.offset / 4)}
          y={yStart + (this.titleHeight / 2)}
          alignmentBaseline="middle"
          fontFamily="Roboto"
          textLength={`${this.width - (this.offset / 2)}`}
          fill="white"
        >
          {`${this.props.data.compound} [${this.props.data.auid}]`}
        </text>
        {/* body rectangle */}
        <rect
          x={xStart}
          y={yStart + this.titleHeight}
          width={this.width}
          height={this.bodyHeight}
          fill="#FFFAFA"
        />
        <line x1={xMid} y1={yTop + this.titleHeight} x2={xMid} y2={yTop + this.titleHeight + this.bodyHeight} stroke="black" />
        <text
          fontFamily="Roboto"
        >
          <tspan
            x={xStart + (this.width / 4)}
            y={yStart + (this.titleHeight) + (this.bodyHeight / centeringBody)}
            textAnchor="middle"
            alignmentBaseline="hanging"
            fontSize={(this.bodyHeight / 2) - (this.bodyHeight / centeringBody)}
          >
            {this.props.data.enthalpyFormationAtom.toFixed(3)}
          </tspan>
          <tspan
            className="attributeName"
            x={this.x - (this.width + this.offset) + this.width / 4}
            dy={(this.bodyHeight / 2) - (this.bodyHeight / centeringBody)}
            textAnchor="middle"
            alignmentBaseline="hanging"
            fontSize={((this.bodyHeight / 2) - (this.bodyHeight / centeringBody)) / 2}
          >
            Formation Enthalpy
          </tspan>
          <tspan
            className="attributeName"
            x={this.x - (this.width + this.offset) + this.width / 4}
            dy={((this.bodyHeight / 2) - (this.bodyHeight / centeringBody)) / 2}
            textAnchor="middle"
            alignmentBaseline="hanging"
            fontSize={((this.bodyHeight / 2) - (this.bodyHeight / centeringBody)) / 2}
          >
            (meV/atom)
          </tspan>
        </text>
        <text
          fontFamily="Roboto"
        >
          <tspan
            x={this.x - (this.width + this.offset) + 3 * this.width / 4}
            y={yStart + (this.titleHeight) + (this.bodyHeight / centeringBody)}
            textAnchor="middle"
            alignmentBaseline="hanging"
            fontSize={(this.bodyHeight / 2) - (this.bodyHeight / centeringBody)}
          >
            {(this.props.data.distanceToHull * 1000).toFixed(3)}
          </tspan>
          <tspan
            className="attributeName"
            x={this.x - (this.width + this.offset) + 3 * this.width / 4}
            dy={(this.bodyHeight / 2) - (this.bodyHeight / centeringBody)}
            textAnchor="middle"
            alignmentBaseline="hanging"
            fontSize={((this.bodyHeight / 2) - (this.bodyHeight / centeringBody)) / 2}
          >
            Distance To Hull
          </tspan>
          <tspan
            className="attributeName"
            x={this.x - (this.width + this.offset) + 3 * this.width / 4}
            dy={((this.bodyHeight / 2) - (this.bodyHeight / centeringBody)) / 2}
            textAnchor="middle"
            alignmentBaseline="hanging"
            fontSize={((this.bodyHeight / 2) - (this.bodyHeight / centeringBody)) / 2}
          >
            (meV/atom)
          </tspan>
        </text>
      </g>
    );
  }
}

InfoCard.propTypes = propTypes;
export default InfoCard;
