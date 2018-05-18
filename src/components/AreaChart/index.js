import { Component } from "react";
import moment from "moment";
import ReactFauxDOM from "react-faux-dom";
import { scaleLinear } from "d3-scale";
import { axisLeft, axisRight } from "d3-axis";
import { max as d3Max } from "d3-array";
import { area as d3Area, line as d3Line, curveBasis } from "d3-shape";
import { bisector } from "d3-array";
import { COLORS } from "../../utilities";

import { buildChartFrame, finalizeChart } from "../../chartUtils";

const TIME_BISECTOR_LEFT = bisector(d => d.date).left;

const graphableControllerData = (data, lastSync) => {
  const idx = TIME_BISECTOR_LEFT(data, lastSync);

  return data
    .slice(0, idx)
    .concat({
      date: moment(lastSync),
      values: Object.assign({}, data[idx].values)
    });
};

const areaBuilder = (svg, xScale, yScale, curve, lastSync) => (data, color) => {
  const toGraph = graphableControllerData(data, lastSync);

  let area = d3Area()
    .curve(curve)
    .defined(d => d.values && "number" === typeof d.values.percent)
    .x(d => xScale(d.date))
    .y0(yScale(0))
    .y1(d => yScale(scaleForY(d.values ? d.values.percent : 0)));

  let line = d3Line()
    .curve(curve)
    .defined(d => d.values && "number" === typeof d.values.percent)
    .x(d => xScale(d.date))
    .y(d => yScale(scaleForY(d.values ? d.values.percent : 0)));

  svg.append("path")
    .datum(toGraph)
    .attr("fill", color)
    .attr("fill-opacity", "0.35")
    .attr("class", "area")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", area);

  // add the valueline path.
  svg.append("path")
    .datum(toGraph)
    .attr("class", "line")
    // .attr("transform", "translate(0, -1)")
    .attr("d", line)
    .attr("stroke", color)
    .attr("fill", "none")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5);
};

const scaleForY = percent => Math.round(percent || 0);

class AreaChart extends Component {
  constructor(props) {
    super(props);
    this.renderChart = this.renderChart.bind(this);
  }

  renderChart() {
    const {
      data,
      medications,
      width,
      height,
      margin,
      graphHeight,
      graphWidth,
      xWidth,
      xScale,
      yLabel,
      colors,
      firstDate,
      lastSync,
      bottomAxis,
      monthAxis,
      weekAxis
    } = this.props;

    const _yMax = d3Max(
      medications.reduce((ary, med) => {
        ary = ary.concat(med.adherenceByWeek.map(day => day.values ? day.values.percent : 0));
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

    // initialize the chart object
    let el = ReactFauxDOM.createElement("div");

    let svg = buildChartFrame(
      el,
      { leftAxis, rightAxis, bottomAxis, monthAxis, weekAxis },
      { height, width, margin, graphWidth, graphHeight, yLabel, xWidth }
    );

    const buildArea = areaBuilder(svg, xScale, yScale, curveBasis, lastSync);

    buildArea(data, COLORS.grey);

    medications.forEach((med, idx) => {
      let _data = med.adherenceByWeek;
      buildArea(_data, colors[idx]);
    });

    finalizeChart(svg, { lastSync, firstDate, height: graphHeight, width: graphWidth, xScale });

    return el.toReact();
  }

  render() {
    return this.renderChart();
  }
}

export default AreaChart;
