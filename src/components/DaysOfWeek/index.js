import React, { Component } from "react";
import { Col } from "react-bootstrap";
import { translate } from "react-i18next";
import ReactFauxDOM from "react-faux-dom";
import { min, max } from "d3-array";
import { scaleLinear, scaleBand } from "d3-scale";
import { select as d3Select } from "d3-selection";
import { axisBottom, axisLeft } from "d3-axis";
import moment from "moment";

import { COLORS } from "../../utilities";

const rectangle = (x, y, w, h, rad) => {
  const diam = 2 * rad;
  return `
    M${x+rad},${y}
    h${w-diam}
    a${rad},${rad} 0 0 1 ${rad},${rad}
    v${h-diam}
    h${diam-w}
    a${rad},${rad} 0 0 1 ${-diam},0
    v${diam-h}
    a${rad},${rad} 0 0 1 ${rad},${-rad}
    z`;
};

// data === { fri:23, mon:15, sat:0, sun:0, thu:31, tue:0, wed:31 }

// at some point we should rethink this so we show days
// in order of the locale, eg. arabic starts with saturday
const ORDER = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const structureData = data => {
  const localeOrder = moment.weekdaysMin(true);

  return ORDER.map((day, i) => {
    return {
      value : data[day] / 100,
      key   : day,
      label : moment(day, "ddd").format("dd")
    };
  }).sort((day1, day2) => {
    const A = day1.label, B = day2.label;

    return localeOrder.indexOf(A) > localeOrder.indexOf(B)
      ? 1
      : -1;
  });
};

class DaysOfWeek extends Component {

  renderChart = function() {
    const { data, width, height } = this.props;

    const _data  = structureData(data);
    const values = _data.map(d => d.value);
    const vMax   = max(values);
    const vMin   = min(values);
    let maxLabeled, minLabeled = false;

    // disgusting
    _data.forEach(d => {
      if (!minLabeled && (d.value === vMin)) {
        d.minmax = true;
        minLabeled = true;
      } else if (!maxLabeled && (d.value === vMax)) {
        d.minmax = true;
        maxLabeled = true;
      }
    });

    const yMax = Math.ceil(vMax * 10) * 10;

    const heightOffset = 80;
    const widthOffset  = 80;
    const chartWidth   = width - 80;
    const chartHeight  = height - heightOffset;

    const xScale = scaleBand()
      .domain(_data.map(d => d.label))
      .range([0, chartWidth])
      .padding(0.3);

    const yScale = scaleLinear()
      .domain([0, yMax / 100])
      .range([chartHeight, 0]);

    const xWidth = xScale.bandwidth();

    let el  = ReactFauxDOM.createElement("div");

    let svg = d3Select(el)
      .append("svg")
        .attr("height", height)
        .attr("width", width)
      .append("g")
        .attr("transform", `translate(${widthOffset / 2}, ${heightOffset - 30})`);

    svg.append("g")
      .attr("class", "axis axis--x bottom-axis")
      .attr("font-family", "Circular-Pro-Book")
      .attr("transform", `translate(0, ${chartHeight})`)
      .style("fontFamily", "Circular-Pro-Book")
      .call(g => {
        g.call(
          axisBottom()
            .scale(xScale)
            .tickSize(0)
            .tickPadding(10)
        );
        g.select(".domain").remove();
        g.selectAll(".tick text")
          .attr("fill", COLORS.darkGrey);
      });

    svg.append("g")
      .attr("class", "axis axis--y left-axis")
      .attr("transform", "translate(0, 0)")
      .style("fontFamily", "Circular-Pro-Book")
      .style("fontSize", "12px")
      .call(g => {
        g.call(
          axisLeft(yScale)
            .ticks(yMax / 10, "%")
            .tickSize(0)
        );
        g.selectAll(".tick text")
          .attr("fill", COLORS.darkGrey)
          .attr("dy", -3);;
        g.select(".domain").remove();
      });

    let bars = svg.selectAll(".bar")
      .data(_data)
      .enter()
      .append("g");

    bars.append("path")
      .attr("shape-rendering", "geometricPrecision")
      .attr(
        "d",
        (d, i) => {
          const y = yScale(d.value);
          return rectangle(
            xScale(d.label),
            y,
            xWidth,
            (chartHeight - y),
            d.value > 0 ? xWidth/2 : 0
          );
        }
      )
      .style("fill", COLORS.orange);

    bars.append("text")
      .attr("class", "value")
      .attr("x", d => xScale(d.label) + (xWidth / 2))
      .attr("y", d => yScale(d.value) - 5)
      .attr("fill", COLORS.darkGrey)
      .style("fontSize", "16px")
      .style("text-anchor", "middle")
      .text((d) => d.minmax ? `${d.value * 100}%` : "");

    return el.toReact();
  }

  render(){
    const { t } = this.props;
    const chart = this.renderChart();

    return (
      <Col xs={6} >
        <h4>{t("RESCUE_TIME_OF_WEEK")}</h4>
        <div className="days-of-week-chart">
          { chart }
        </div>
      </Col>
    );
  }
}

export default translate("patient-report")(DaysOfWeek);
