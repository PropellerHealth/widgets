import React, { Component } from "react";
import ReactFauxDOM from "react-faux-dom";
import { scaleLinear } from "d3-scale";
import { axisBottom, axisLeft, axisRight, axisTop} from "d3-axis";
import { timeDay, timeMonth, timeWeek } from "d3-time";
import { timeFormat, isoParse } from "d3-time-format";
import { max as d3Max } from "d3-array";
import { area as d3Area, line as d3Line, curveBasis } from "d3-shape";

import { buildChartFrame } from "../../chartUtils";

class AreaChart extends Component {
  constructor(props) {
    super(props);
    this.renderChart = this.renderChart.bind(this);
  }

  renderChart() {
    const {
      medications,
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
    const _yMax          = d3Max(
      medications.reduce((ary, med) => {
        ary = ary.concat(med.adherenceByWeek.map(day => day.values.percentActual));
        return ary;
      }, [])
    );
    const yMax = _yMax < 100 ? 100 : Math.ceil(_yMax / 20) * 20;

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

    const weekAxis = axisTop(xScale)
      .ticks(timeWeek)
      .tickSize(-graphHeight);

    // initialize the chart object
    let el = ReactFauxDOM.createElement("div");

    let svg = buildChartFrame(
      el,
      { leftAxis, rightAxis, bottomAxis, monthAxis, weekAxis },
      { height, width, margin, graphWidth, graphHeight, yLabel, xWidth }
    );

    let curve = curveBasis;

    medications.forEach((med, idx) => {
      let data = med.adherenceByWeek;

      let area = d3Area()
        .curve(curve)
        .x(d => dScale(d.date))
        .y0(yScale(0))
        .y1(d => yScale(Math.round(d.values.percentActual) || 0));

      let line = d3Line()
        .curve(curve)
        .x(d => dScale(d.date))
        .y(d => yScale(Math.round(d.values.percentActual) || 0));

      svg.append("path")
        .datum(data)
        .attr("fill", colors[idx])
        .attr("fill-opacity", "0.6")
        .attr("class", "area")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", area)
        .attr("transform", "translate(0, 0)");

      // add the valueline path.
      svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line)
        .attr("stroke", colors[idx])
        .attr("fill", "none")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2);
    });

    return el.toReact();
  }

  render() {
    const { children } = this.props;
    const chart = this.renderChart();
    return (
      <div
        className="areachart"
        style={{ position: "relative" }}
      >
        {children}
        {chart}
      </div>
    );
  }
}

export default AreaChart;
