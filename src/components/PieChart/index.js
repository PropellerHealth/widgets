import React, { Component } from "react";
import ReactFauxDOM from "react-faux-dom";
import { arc as d3Arc, pie } from "d3-shape";
import { select as d3Select } from "d3-selection";
import { scaleOrdinal } from "d3-scale";

class PieChart extends Component {

  renderChart = function() {

    const { data, height, width } = this.props;

    const radius = Math.min(width, height) / 2;
    const color  = scaleOrdinal(data.map(d => d.color));
    const angles = pie()
      .value(d => d.percent)
      .sort(null);

    // initialize the chart object
    let el  = ReactFauxDOM.createElement("div");

    let svg = d3Select(el)
      .append("svg")
        .attr("height", height)
        .attr("width", width)
      .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const path = d3Arc()
      .innerRadius(0)
      .outerRadius(radius - 40);

    const innerLabel = d3Arc()
      .innerRadius((radius - 40) * 0.66)
      .outerRadius((radius - 40) * 0.66);

    const outerLabel = d3Arc()
      .innerRadius(radius - 15)
      .outerRadius(radius - 15);

    // setup our elements
    const arc = svg.selectAll(".arc")
      .data(angles(data))
      .enter()
      .append("g")
        .attr("class", "arc");

    // append the pie slices
    arc.append("path")
      .attr("d", path)
      .attr("fill", d => color(d.data.period));

    // append the inner labels
    arc.append("text")
      .attr("transform", d => `translate(${innerLabel.centroid(d)})`)
      .attr("dy", "0.35em")
      .text(d => `${d.data.percent}%`)
      .attr("fill", "#FFF")
      .style("fontSize", "16px")
      .style("text-anchor", "middle");

    // append the outer labels
    arc.append("text")
      .attr("class", "arc-label")
      .attr("transform", d => `translate(${outerLabel.centroid(d)})`)
      .style("fontSize", "12px")
      .style("text-anchor", "middle");

    // use tspans for multi-line
    const label = arc.select(".arc-label");

    label
      .append("tspan")
      .attr("x", "0")
      .style("text-anchor", "middle")
      .text(d => d.data.label);

    label
      .append("tspan")
      .attr("x", "0")
      .attr("dy", "13px")
      .style("text-anchor", "middle")
      .text(d => d.data.times.join("-"));

    return el.toReact();
  }

  render() {
    const chart = this.renderChart();

    return (
      <div className="pie-chart">
        { chart }
      </div>
    );
  }
}

export default PieChart;
