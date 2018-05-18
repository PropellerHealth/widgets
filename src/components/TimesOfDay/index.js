import React, { Component } from "react";
import { Col } from "react-bootstrap";
import { translate } from "react-i18next";
// import { timeFormat } from "d3-time-format";
import moment from "moment";
import PieChart from "../PieChart";

const formatTime = localeData => time => {
  const _t =  moment(time, "H").format(localeData.longDateFormat("LT"));
  // const meridiem = _t.match(localeData._meridiemParse);
  return _t.replace(/:00/g, "").toLowerCase(); // /:00|\s/g to remove whitespace too
};

// do we need to format these time ranges?
const buildChartData = (data, t) => {
  const formatter = formatTime(moment.localeData());
  return [
    {
      period  : "evening",
      label   : t("EVENING"),
      percent : data.evening,
      color   : "#2B63A9",
      times   : [formatter("17"), formatter("22")]
    },
    {
      period  : "night",
      label   : t("NIGHT"),
      percent : data.night,
      color   : "#000000",
      times   : [formatter("22"), formatter("6")]
    },
    {
      period  : "morning",
      label   : t("MORNING"),
      percent : data.morning,
      color   : "#A8E5FE",
      times   : [formatter("6"), formatter("12")]
    },
    {
      period  : "afternoon",
      label   : t("AFTERNOON"),
      percent : data.afternoon,
      color   : "#00BDF7",
      times   : [formatter("12"), formatter("17")]
    },
    {
      period: "none",
      label: "No usages",
      percent: data.evening + data.night + data.morning + data.afternoon === 0 ? 100 : 0,
      color: "#DDD",
      times: []
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
