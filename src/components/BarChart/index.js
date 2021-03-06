import { Component } from "react";
import ReactFauxDOM from "react-faux-dom";
import { scaleLinear } from "d3-scale";
import { max as d3Max } from "d3-array";
import { axisLeft, axisRight } from "d3-axis";
import { line as d3Line, curveBasis } from "d3-shape";

import { buildChartFrame, finalizeChart } from "../../chartUtils";

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
      lineScale,
      colors,
      baseline,
      firstDate,
      lastSync,
      weekAxis,
      monthAxis,
      bottomAxis
    } = this.props;

    const yMax    = d3Max(data.map(d => d.rescue.totalEvents));
    const yHeight = yMax < 5 ? 5 : yMax + 1;

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
            xScale(d.date),
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
            xScale(d.date),
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
      .attr("transform", `translate(${xWidth/2}, 0)`)
      .attr("x", d => xScale(d.date))
      .attr("y", d => yScale(d.rescue.totalEvents) - 10)
      .attr("fill", colors.red)
      .style("fontSize", "2.5rem")
      .style("text-anchor", "middle")
      .text((d) => d.alert ? "!" : undefined);

    if (baseline) {
      let line = d3Line()
        .curve(curveBasis)
        .x(d => xScale(d.date))
        .y(d => yScale(d.rescue.baseline));

      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", colors.green)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("transform", `translate(${xWidth},0)`)
        .attr("d", line);
    }

    finalizeChart(svg, { lastSync, firstDate, height: graphHeight, width: graphWidth, xScale });

    return el.toReact();
  }

  // componentDidMount() {
  //   this.renderChart();
  // }

  // componentDidUpdate() {
  //   this.renderChart();
  // }

  render() {
    return this.renderChart();
  }
}

export default BarChart;
