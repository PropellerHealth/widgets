import React from "react";
import { Row, Col } from "react-bootstrap";
import moment from "moment-timezone";
import ReactFauxDOM from "react-faux-dom";
import { scaleUtc } from "d3-scale";
import { select as d3Select } from "d3-selection";
import { utcDay, timeDay, timeHour } from "d3-time";
import { axisBottom } from "d3-axis";
import { timeFormat, isoParse } from "d3-time-format";
import { format } from "d3-format";
import { scaleLinear } from "d3-scale";
import { axisLeft } from "d3-axis";
import { line as d3Line, curveBasis } from "d3-shape";

import { COLORS, displayedDate, capitalize, HAS_WINDOW } from "../../utilities";
import Subtitle from "../../components/Subtitle";

const tzone = moment.tz.guess();

const renderChart = (args) => {
  const {
    data,
    height = 150,
    margin = {left: 35, right: 0, top: 20, bottom: 20},
    yTickLabel = "",
    width,
    yMin = 80,
    yMax = 100,
    type = "o2",
    average = 90
  } = args;

  const graphHeight = height - margin.top - margin.bottom;
  const graphWidth  = width - margin.left - margin.right;
  const DARK_GREY  = COLORS.darkGrey;

  const x = scaleUtc()
    .domain([data[0].date, data[data.length - 1].date])
    .range([0, graphWidth])
    .clamp(true);

  const y = scaleLinear()
    .domain([yMin, yMax])
    .range([graphHeight, 0]);

  const bottomAxis = axisBottom(x)
    .ticks(timeHour)
    .tickSize(0)
    .tickPadding(10)
    .ticks(6)
    .tickFormat(timeFormat("%-I %p"));

  const leftAxis = axisLeft(y)
    .ticks(5)
    .tickPadding(5)
    .tickSize(0)
    .tickFormat(val => `${val}${yTickLabel}`);

  let el = ReactFauxDOM.createElement("div");

  let svg = d3Select(el)
    .append("svg")
      .attr("height", height)
      .attr("width", width)
      .attr("transform", `translate(${-margin.left}, ${0})`)
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  svg.append("g")
    .attr("class", "y axis left-axis")
    .attr("transform", "translate(0, 0)")
    .call(g => {
      g.call(leftAxis);
      g.select(".domain")
        .attr("stroke", DARK_GREY);
      g.selectAll(".tick text")
        .attr("fill", DARK_GREY);
    });

  svg.append("g")
    .attr("class", "x axis bottom-axis")
    .attr("transform", `translate(0, ${graphHeight})`)
    .call(g => {
      g.call(bottomAxis);
      g.select(".domain")
        .attr("stroke", DARK_GREY);
    });

  let line = d3Line()
    .curve(curveBasis)
    .x(d =>  x(d.date))
    .y(d => y(d.value));

  svg.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line)
    .attr("stroke", COLORS.blue)
    .attr("fill", "none")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 2);


  const baseline = d3Line()
    .curve(curveBasis)
    .x(d =>  x(d.date))
    .y(d => y(average));

  svg.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", baseline)
    .attr("stroke", COLORS.green)
    .attr("fill", "none")
    .attr("stroke-dasharray", "5, 5")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1);


  if (type === "o2") {
    const minLine = d3Line()
      .curve(curveBasis)
      .x(d =>  x(d.date))
      .y(d => y(87));

    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", minLine)
      .attr("stroke", COLORS.red)
      .attr("fill", "none")
      .attr("stroke-dasharray", "5, 5")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1);
  } else if (type === "breath") {
    const minLine = d3Line()
      .curve(curveBasis)
      .x(d =>  x(d.date))
      .y(d => y(10));

    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", minLine)
      .attr("stroke", COLORS.orange)
      .attr("fill", "none")
      .attr("stroke-dasharray", "5, 5")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1);

    const maxLine = d3Line()
      .curve(curveBasis)
      .x(d =>  x(d.date))
      .y(d => y(25));

    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", maxLine)
      .attr("stroke", COLORS.orange)
      .attr("fill", "none")
      .attr("stroke-dasharray", "5, 5")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1);
  }

  return el.toReact();
};

class BreathRate extends React.Component {
  column = undefined;

  setWidth() {
    this.setState({
      width: this.column.clientWidth
    });
  }

  constructor(props) {
    super(props);
    this.setColumnRef = el => { this.column = el; };

    let data = new Array(12);
    for (let i = 11; i > -1; i--) {
      const value = 10 + Math.ceil(Math.random() * 15);
      data[i] = {
        date: moment().tz(tzone).subtract(i, "hours"),
        value
      };
    }

    data = data.reverse();

    this.state = { width: 0, data };
  }

  componentDidMount() {
    this.setWidth();

    if (HAS_WINDOW) {
      window.addEventListener("resize", this.setWidth.bind(this));
    }
  }

  componentWillUnmount() {
    if (HAS_WINDOW) {
      window.removeEventListener("resize", this.setWidth.bind(this));
    }
  }

  render() {
    const { data, width } = this.state;
    const average = data.reduce((tot, d) => tot + d.value, 0) / data.length;
    return (
      <div>
        <h3 ref={this.setColumnRef}>Breath Rate <Subtitle>last 24 hours</Subtitle></h3>
        {renderChart({ data, width, yMin: 0, yMax: 30, type: "breath", average })}
      </div>
    );
  }
}


class OxygenConcentration extends React.Component {

  column = undefined;

  setWidth() {
    this.setState({
      width: this.column.clientWidth
    });
  }

  constructor(props) {
    super(props);
    this.setColumnRef = el => { this.column = el; };

    let data = new Array(12);
    for (let i = 11; i > -1; i--) {
      const value = 85 + Math.ceil(Math.random() * 12);
      data[i] = {
        date: moment().tz(tzone).subtract(i, "hours"),
        value
      };
    }

    data = data.reverse();

    this.state = { width: 0, data };
  }

  componentDidMount() {
    this.setWidth();

    if (HAS_WINDOW) {
      window.addEventListener("resize", this.setWidth.bind(this));
    }
  }

  componentWillUnmount() {
    if (HAS_WINDOW) {
      window.removeEventListener("resize", this.setWidth.bind(this));
    }
  }

  render() {
    const { data, width } = this.state;
    return (
      <div>
        <h3 ref={this.setColumnRef}>Oxygen Purity <Subtitle>last 24 hours</Subtitle></h3>
        {renderChart({ data, width, yMin: 80, yMax: 100, type: "o2" })}
      </div>
    );
  }
}

class DeviceMetrics extends React.Component {

  render() {
    return <Row className="chart-wrapper">
      <Col xs={12}>
        <h4>POC Status</h4>
      </Col>
      <Col xs={12} sm={6}>
        <OxygenConcentration />
      </Col>
      <Col xs={12} sm={6}>
        <BreathRate />
      </Col>
    </Row>;
  }
}

export default DeviceMetrics;
