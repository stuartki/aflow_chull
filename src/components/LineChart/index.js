import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import './lineChart.css';
import Points from './LineChartPoints';
import Axis from './LineChartAxis';
import Grid from './LineChartGrid';
import Gradient from './LineChartGradient';

const propTypes = {
  defaultBehavior: PropTypes.bool.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
  vertices: PropTypes.arrayOf(
    PropTypes.shape({
      x: React.PropTypes.number.isRequired,
      y: React.PropTypes.number.isRequired,
    }),
  ).isRequired,
  points: PropTypes.array.isRequired,
  yMin: PropTypes.number,
  yMax: PropTypes.number,
  xAxisLabel: PropTypes.string,
  yAxisLabel: PropTypes.string,
  chartId: PropTypes.string,
  fullscreen: PropTypes.bool,
  sidebarIsVisible: PropTypes.bool.isRequired,
  showAllPoints: PropTypes.bool.isRequired,
  pointClickHandler: PropTypes.func.isRequired,
};

const defaultProps = {
  width: 800,
  height: 300,
  chartId: 'v1_chart',
  yMin: -0.5,
  yMax: 0.5,
  color: '#687BC9',
  xAxisLabel: 'x',
  yAxisLabel: 'y',
  fullscreen: false,
};

class LineChart extends React.Component {
  /*
  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    color: React.PropTypes.string,
    vertices: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        x: React.PropTypes.number.isRequired,
        y: React.PropTypes.number.isRequired,
      })
    ).isRequired,
    points: React.PropTypes.array,
    yMin: React.PropTypes.number,
    yMax: React.PropTypes.number,
    xAxisLabel: React.PropTypes.string,
    yAxisLabel: React.PropTypes.string,
    chartId: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      width: 800,
      height: 300,
      chartId: 'v1_chart',
      yMin: -0.5,
      yMax: 0.5,
      fullScreen: false
    };
  },

  getInitialState: function() {
    return{
      width: this.props.width,
      height: this.props.height
    };
  },
  */

  constructor(props) {
    super(props);
    this.state = {
      width: props.width,
      height: props.height,
    };

    this.updateSize = this.updateSize.bind(this);
  }

  componentWillMount() {
    window.addEventListener('resize', () => {
      this.updateSize();
    });
  }

  componentDidMount() {
    this.updateSize();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.sidebarIsVisible !== nextProps.sidebarIsVisible) {
      this.updateSize();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSize());
  }

  updateSize() {
    // const node = ReactDOM.findDOMNode(this);
    const parentWidth = this.node.getBoundingClientRect().width;

    if (parentWidth < this.props.width) {
      this.setState({ width: parentWidth - 20 });
    } else {
      this.setState({ width: this.props.width });
    }

    if (this.props.fullscreen) {
      this.setState({ height: window.innerHeight - 200 });
    }
  }

  render() {
    if (!this.props.sidebarIsVisible) {
      // this.updateSize();
    }
    const margin = { top: 30, right: 50, bottom: 30, left: 70 };
    const w = this.state.width - (margin.left + margin.right);
    const h = this.state.height - (margin.top + margin.bottom);

    const vertices = this.props.vertices;

    const x = d3
      .scaleLinear()
      .domain([0, 1])
      .rangeRound([0, w]);

    const y = d3
      .scaleLinear()
      .domain([this.props.yMin, this.props.yMax])
      .range([h, 0]);
      // .clamp(true);

    const yAxis = d3.axisLeft(y);

    const xAxis = d3.axisBottom(x).ticks(5, 'c');
    // xAxis.tickValues(['0', '0.2', '0.4', '0.6', '0.8', '1']).tickFormat();

    const yGrid = d3
      .axisLeft(y)
      .tickSize(-w, 0, 0)
      .tickFormat('');

    const line = d3
      .line()
      .defined(d =>
        d.y > this.props.yMin && d.y < this.props.yMax,
      )
      .x(d => x(d.x))
      .y(d => y(d.y));

    const area = d3
      .area()
      .x(d => x(d.x))
      .y0(0)
      .y1(d => y(d.y));

    // var transform='translate(' + margin.left + ',' + margin.top + ')';
    const transform = `translate(${margin.left}, ${margin.top})`;
    let svgHeight = this.state.height + margin.bottom;

    if (!this.props.fullscreen) {
      svgHeight = this.state.height;
    }

    const containerStyle = {
      marginBottom: '-17px',
    };

    if (this.props.xAxisLabel !== '') {
      containerStyle.marginBottom = '-37px';
    }

    let points = null;
    if (this.props.showAllPoints) {
      points = (
        <Points
          defaultBehavior={this.props.defaultBehavior}
          hullName={this.props.chartId}
          data={this.props.points}
          xScale={x}
          yScale={y}
          yMin={this.props.yMin}
          yMax={this.props.yMax}
          color={this.props.color}
          line={line}
          vertices={vertices}
          pointClickHandler={this.props.pointClickHandler}
        />
      );
    }

    return (
      <div
        style={containerStyle}
        ref={(node) => {
          this.node = node;
        }}
      >
        <svg id={this.props.chartId} width={this.state.width} height={svgHeight}>
          <Gradient
            className="gradient"
            color1={this.props.color}
            color2="#fff"
            id={`area-${this.props.chartId}`}
          />
          <g transform={transform}>
            <Grid height={h} grid={yGrid} gridType="y" />
            <Axis height={h} axis={yAxis} axisType="y" />
            <text
              transform={'rotate(-90)'}
              x={-(this.state.height / 2) - margin.top}
              y={-(margin.left / 1.3)}
              fill="#757575"
            >
              {this.props.yAxisLabel}
            </text>
            <Axis height={h} axis={xAxis} axisType="x" />
            <text
              x={(this.state.width / 2) - margin.left - margin.right}
              y={this.state.height}
              fill="#757575"
            >
              {this.props.xAxisLabel}
            </text>
            {/* <path
              className="area"
              d={area(vertices)}
              key={1}
              fill={`url(#area-${this.props.chartId})`}
            /> */}
            <rect width={w} height={h} fill={`url(#area-${this.props.chartId})`} />
            {points}
          </g>
        </svg>
      </div>
    );
  }
}

LineChart.propTypes = propTypes;
LineChart.defaultProps = defaultProps;
export default LineChart;
