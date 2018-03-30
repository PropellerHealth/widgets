import React, { Component } from "react";
import ReactFauxDOM from "react-faux-dom";
import { scaleLinear } from "d3-scale";
import { max as d3Max } from "d3-array";
import { axisBottom, axisLeft, axisRight, axisTop } from "d3-axis";
import { timeDay, timeMonth, timeWeek } from "d3-time";
import { timeFormat, isoParse } from "d3-time-format";
import { line as d3Line, curveBasis } from "d3-shape";

import { buildChartFrame } from "../../chartUtils";

const rectangle = (x, y, w, h, r) => {
  const r2 = 2 * r;
  return `
    M${x + r},${y}
    h${w - r2}
    a${r},${r} 0 0 1 ${r},${r}
    v${h - r2}
    v${r}
    h${-r}
    h${r2 - w}
    h${-r}
    v${-r}
    v${r2 - h}
    a${r},${r} 0 0 1 ${r},${-r}
    z`;
};

class BarChart extends Component {
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
      yLabel,
      dScale,
      colors,
      baseline
    } = this.props;

    const yMax           = d3Max(data.map(d => d.rescue.totalEvents));
    const yHeight        = yMax < 5 ? 5 : yMax + 1;
    const xFormatter     = timeFormat("%-d");
    const monthFormatter = timeFormat("%b");

    const yScale = scaleLinear()
      .domain([0, yHeight])
      .range([graphHeight, 0]);

    // prepare our axes
    // const YAxis = (<LeftAxis yMax={yMax} label={yLabel} />);
    const leftAxis = axisLeft(yScale)
      .ticks(yHeight > 10 ? 5 : yHeight)
      .tickPadding(5)
      .tickSize(0);

    const rightAxis = axisRight(yScale)
      .ticks(yHeight > 10 ? 5 : yHeight)
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

    let el = ReactFauxDOM.createElement("div");

    // initialize the chart object
    let svg = buildChartFrame(
      el,
      { leftAxis, rightAxis, bottomAxis, monthAxis, weekAxis },
      { height, width, margin, graphWidth, graphHeight, yLabel, xWidth }
    );

    let bars = svg.selectAll(".bars")
      .data(data)
      .enter()
      .append("g");

    bars.append("path")
      .attr("class", "all-rescue")
      .attr("shape-rendering", "geometricPrecision")
      .attr(
        "d",
        (d, i) => {
          const count = d.rescue.totalEvents;
          const yPos  = yScale(count);
          return rectangle(
            xScale(d.date) + (xWidth/2),
            yPos,
            xWidth,
            (graphHeight - yPos),
            count > 0 ? xWidth/2 : 0
          );
        }
      )
      .style("fill", colors.orange);

    bars.append("path")
      .attr("class", "night-rescue")
      .attr("shape-rendering", "geometricPrecision")
      .attr(
        "d",
        (d, i) => {
          const count = d.rescue.nightEvents;
          const yPos  = yScale(count);
          return rectangle(
            xScale(d.date) + (xWidth/2),
            yPos,
            xWidth,
            (graphHeight - yPos),
            count > 0 ? xWidth/2 : 0
          );
        }
      )
      .style("fill", colors.brown);

    bars.append("text")
      .attr("class", "alert-sent")
      .attr("transform", `translate(${xWidth}, 0)`)
      .attr("x", d => xScale(d.date))
      .attr("y", d => yScale(d.rescue.totalEvents) - 10)
      .attr("fill", colors.red)
      .style("fontSize", "20px")
      .style("text-anchor", "middle")
      .text((d) => d.alert ? "!" : undefined);

    if (baseline) {
      let line = d3Line()
        .curve(curveBasis)
        .x(d => dScale(d.date))
        .y(d => yScale(d.rescue.baseline));

      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", colors.green)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);
    }

    return el.toReact();
  }

  // componentDidMount() {
  //   this.renderChart();
  // }

  // componentDidUpdate() {
  //   this.renderChart();
  // }

  render() {
    const { children } = this.props;
    const chart = this.renderChart();

    return (
      <div
        className="barchart"
        style={{ position: "relative" }}
      >
        {children}
        {chart}
      </div>
    );
  }
}

export default BarChart;
