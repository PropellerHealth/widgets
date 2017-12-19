import React, { Component } from "react";
import ReactFauxDOM from "react-faux-dom";
import { scaleBand, scaleLinear, scaleTime } from "d3-scale";
import { axisBottom, axisTop, axisLeft, axisRight } from "d3-axis";
import { timeDay, timeMonth } from "d3-time";
import { timeFormat, isoParse } from "d3-time-format";
import { max as d3Max } from "d3-array";
import { area as d3Area, curveBasis, curveCardinal, curveCatmullRom, curveBundle, curveNatural, curveStep, curveMonotoneX, curveLinear } from "d3-shape";

import { buildChartFrame } from "../../chartUtils";

class AreaChart extends Component {
  constructor(props) {
    super(props);
    this.renderChart = this.renderChart.bind(this);
  }

  renderChart() {
    const {
      data,
      width,
      height,
      margin,
      graphHeight,
      graphWidth,
      xWidth,
      xScale,
      dScale,
      yLabel,
      colors
    } = this.props;

    const xFormatter     = timeFormat("%-d");
    const monthFormatter = timeFormat("%b");
    const _yMax          = d3Max(data.map(d => d.values.adherencePercent));
    const yMax           = _yMax < 100 ? 100 : Math.ceil(_yMax / 20) * 20;

    const yScale = scaleLinear()
      .domain([0, yMax])
      .range([graphHeight, 0]);

    // prepare our axes
    // const YAxis = (<LeftAxis yMax={yMax} label={yLabel} />);
    const leftAxis = axisLeft(yScale)
      .ticks(5)
      .tickPadding(5)
      .tickSize(0)
      .tickFormat(val => `${val}%`);

    const rightAxis = axisRight(yScale)
      .ticks(5)
      .tickSize(-graphWidth);

    const bottomAxis = axisBottom(xScale)
      .ticks(timeDay)
      .tickSize(0)
      .tickPadding(10)
      .tickFormat(d => xFormatter(isoParse(d)));

    const monthAxis = axisBottom(xScale)
      .ticks(timeMonth)
      .tickSize(0)
      .tickPadding(25)
      .tickFormat(d => monthFormatter(d).toUpperCase());

    // initialize the chart object
    let el = ReactFauxDOM.createElement('div');

    let svg = buildChartFrame(
      el,
      { leftAxis, rightAxis, bottomAxis, monthAxis },
      { height, width, margin, graphWidth, graphHeight, yLabel, xWidth }
    );

    let area = d3Area()
      .x(d => dScale(d.date))
      .y0(yScale(0))
      .y1(d => yScale(Math.round(d.values.adherencePercent) || 0))
      .curve(curveBasis);
      // .curve(curveCatmullRom.alpha(1));
      // .curve(curveMonotoneX);

    svg.append('path')
      .datum(data)
      .attr("fill", colors.blue)
      .attr('class', 'area')
      .attr('d', area)
      .attr('transform', `translate(0, 0)`);

    return el.toReact();
  }

  render() {
    const { children } = this.props;
    const chart = this.renderChart();
    return (
      <div
        className="areachart"
        style={{ position: "relative", margin: "1rem 0" }}
      >
        {children}
        {chart}
      </div>
    )
  }
}

export default AreaChart;
