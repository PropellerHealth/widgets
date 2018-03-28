import React, { Component } from "react";
import { Col } from "react-bootstrap";
import { translate } from "react-i18next";
import ReactFauxDOM from "react-faux-dom";
import { scaleOrdinal, scaleLinear, scaleBand } from "d3-scale";
import { select as d3Select } from "d3-selection";
import { axisBottom, axisLeft } from "d3-axis";
import moment from "moment";

// console.log("scaleOrdinal", scaleOrdinal);

// import { timeFormat } from "d3-time-format";
// import moment from "moment";

// console.log(moment);
// data === { fri:23, mon:15, sat:0, sun:0, thu:31, tue:0, wed:31 }

// at some point we should rethink this so we show days
// in order of the locale, eg. arabic starts with saturday
const ORDER = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const structureData = data => {
  return ORDER.map((day, i) => {
    return {
      value : data[day] / 100,
      key   : day,
      label : moment(day, "ddd").format("dd")
    };
  });
};

class DaysOfWeek extends Component {

  renderChart = function() {
    const { data, width, height } = this.props;

    const _data = structureData(data);

    const barWidth = (width - 80) / _data.length;

    const xScale = scaleOrdinal()
      .domain(_data.map(d => d.key))
      .range([0, width - 80]);

    const yScale = scaleLinear()
      .domain([0, 1])
      .range([height - 30, 0]);

    // const leftAxis = axisLeft(yScale)
    //   .ticks(10)
    //   .tickSize(0);

    let el  = ReactFauxDOM.createElement("div");

    let svg = d3Select(el)
      .append("svg")
        .attr("height", height)
        .attr("width", width)
      .append("g")
        .attr("transform", "translate(40, 10)");

    svg.append("g")
      .attr("class", "axis axis--x bottom-axis")
      .attr("transform", `translate(0, ${height - 30})`)
      .call(
        axisBottom(xScale)
          .ticks(_data.length)
          .tickValues(_data.map(d => d.label))
      );

    svg.append("g")
      .attr("class", "axis axis--y left-axis")
      .attr("transform", "translate(0, 0)")
      .call(axisLeft(yScale).ticks(10, "%"));

    let bars = svg.selectAll(".bars")
      .data(_data)
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(${i * barWidth}, 10)`);

    bars.append("rect")
      .attr("y", d => yScale(d.value))
      .attr("height", d  => height - 40 - yScale(d.value))
      .attr("width", barWidth / 2);



    // let bars = svg.selectAll(".bars")
    //   .data(data)
    //   .enter()
    //   .append("g");

    // bars.append()


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
