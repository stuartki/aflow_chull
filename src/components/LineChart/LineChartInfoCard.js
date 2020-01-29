import React from 'react';
import PropTypes from 'prop-types';
// import * as hullActions from '../../actions/hullActions.js';
// import { removeEntry, pointClickHandler } from '../../actions/hullActions.js';


const propTypes = {
  data: PropTypes.object.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  yMin: PropTypes.number.isRequired,
  yMax: PropTypes.number.isRequired,
};


class InfoCard extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    this.x = this.props.xScale(this.props.x);
    this.y = this.props.yScale(this.props.y);
    this.width = this.props.xScale(0.25);
    // scales from top, so it is strangely more intuitive to scale with max - offset
    const scale = (this.props.yMax - this.props.yMin) / (2 * 10);
    this.titleHeight = this.props.yScale(this.props.yMax - 2 * scale);
    this.bodyHeight = this.props.yScale(this.props.yMax - 3 * scale);
    this.offset = this.width / 10;

    let boost = 0;
    if (this.props.data.distanceToHull * 1000 < (5 * scale)) {
      boost = this.titleHeight + this.bodyHeight - this.props.yScale(this.props.yMax - (this.props.data.distanceToHull * 1000 / 2));
    }

    const switchSide = (this.props.x > 0.5);
    const xStart = switchSide ? this.x - (this.width + this.offset) : this.x + this.offset;
    const yStart = this.y - (this.titleHeight / 4) - boost;
    const xMid = switchSide ? this.x - (this.width + this.offset) + this.width / 2 : this.x + this.width/2 + this.offset;

    const centeringBody = 4;

    let data1;
    let data1Title;
    let data2;
    let data2Title;
    if (this.props.data.distanceToHull === 0) {
      data1 = this.props.data.stabilityCriterion.toFixed(3);
      data1Title = 'Stability Criterion';
      data2 = this.props.data.n1EnthalpyGain.toFixed(3);
      data2Title = 'N+1 Enthalpy Gain';
    } else {
      data1 = this.props.data.enthalpyFormationAtom.toFixed(3);
      data1Title = 'Formation Enthalpy';
      data2 = (this.props.data.distanceToHull * 1000).toFixed(3);
      data2Title = 'Distance To Hull';
    }
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
        <line x1={xMid} y1={yStart + this.titleHeight} x2={xMid} y2={yStart + this.titleHeight + this.bodyHeight} stroke="black" />
        <text
          fontFamily="Roboto"
        >
          <tspan
            x={xStart + (this.width / 4)}
            y={yStart + (this.titleHeight) + (this.bodyHeight / centeringBody)}
            textAnchor="middle"
            alignmentBaseline="hanging"
            fontSize={(this.bodyHeight / 2) - (this.bodyHeight / centeringBody)}
            textLength={`${this.width / 2 - (this.offset)}`}
          >
            {data1}
          </tspan>
          <tspan
            className="attributeName"
            x={xStart + this.width / 4}
            dy={(this.bodyHeight / 2) - (this.bodyHeight / centeringBody)}
            textAnchor="middle"
            alignmentBaseline="hanging"
            fontSize={((this.bodyHeight / 2) - (this.bodyHeight / centeringBody)) / 2}
            textLength={`${this.width / 2 - (this.offset / 2)}`}
          >
            {data1Title}
          </tspan>
          <tspan
            className="attributeName"
            x={xStart + this.width / 4}
            dy={((this.bodyHeight / 2) - (this.bodyHeight / centeringBody)) / 2}
            textAnchor="middle"
            alignmentBaseline="hanging"
            fontSize={((this.bodyHeight / 2) - (this.bodyHeight / centeringBody)) / 2}
            textLength={`${this.width / 2 - (this.offset)}`}
          >
            (meV/atom)
          </tspan>
        </text>
        <text
          fontFamily="Roboto"
        >
          <tspan
            x={xStart + 3 * this.width / 4}
            y={yStart + (this.titleHeight) + (this.bodyHeight / centeringBody)}
            textAnchor="middle"
            alignmentBaseline="hanging"
            fontSize={(this.bodyHeight / 2) - (this.bodyHeight / centeringBody)}
            textLength={`${this.width / 2 - (this.offset)}`}
          >
            {data2}
          </tspan>
          <tspan
            className="attributeName"
            x={xStart + 3 * this.width / 4}
            dy={(this.bodyHeight / 2) - (this.bodyHeight / centeringBody)}
            textAnchor="middle"
            alignmentBaseline="hanging"
            fontSize={((this.bodyHeight / 2) - (this.bodyHeight / centeringBody)) / 2}
            textLength={`${this.width / 2 - (this.offset / 2)}`}
          >
            {data2Title}
          </tspan>
          <tspan
            className="attributeName"
            x={xStart + 3 * this.width / 4}
            dy={((this.bodyHeight / 2) - (this.bodyHeight / centeringBody)) / 2}
            textAnchor="middle"
            alignmentBaseline="hanging"
            fontSize={((this.bodyHeight / 2) - (this.bodyHeight / centeringBody)) / 2}
            textLength={`${this.width / 2 - (this.offset)}`}
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
