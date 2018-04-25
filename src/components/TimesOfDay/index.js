import React, { Component } from "react";
import { Col } from "react-bootstrap";
import { translate } from "react-i18next";
// import { timeFormat } from "d3-time-format";
// import moment from "moment";
import PieChart from "../PieChart";

// do we need to format these time ranges?
const buildChartData = (data, t) => {
  return [
    {
      period  : "evening",
      label   : t("EVENING"),
      percent : data.evening,
      color   : "#2B63A9",
      times   : ["5pm", "10pm"]
    },
    {
      period  : "night",
      label   : t("NIGHT"),
      percent : data.night,
      color   : "#000000",
      times   : ["10pm", "6am"]
    },
    {
      period  : "morning",
      label   : t("MORNING"),
      percent : data.morning,
      color   : "#A8E5FE",
      times   : ["6am", "12pm"]
    },
    {
      period  : "afternoon",
      label   : t("AFTERNOON"),
      percent : data.afternoon,
      color   : "#00BDF7",
      times   : ["12pm", "5pm"]
    }
  ];
};

// data === { afternoon: 15, evening:15, morning:15, night:54 }

class TimesOfDay extends Component {
  render() {
    const { data, t, width, height } = this.props;

    const chartData = buildChartData(data, t);

    return (
      <Col xs={6} >
        <h4>{t("RESCUE_TIME_OF_DAY")}</h4>
        <PieChart data={chartData}  width={width} height={height}/>
      </Col>
    );
  }
}

export default translate("patient-report")(TimesOfDay);
