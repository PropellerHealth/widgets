import React from "react";
import moment from "moment";
import { translate } from "react-i18next";
import { scaleTime, scaleUtc } from "d3-scale";
import { utcDay, timeDay, utcMonth, timeMonth, utcMonday, timeMonday } from "d3-time";
import { axisBottom, axisTop } from "d3-axis";
import { timeFormat, isoParse } from "d3-time-format";
import SectionHeader from "./SectionHeader";
import RescueMedicationChart from "./RescueMedicationChart";
import ControllerMedicationChart from "./ControllerMedicationChart";

import { COLORS, HAS_WINDOW } from "../../utilities";

const createTimeScale = (a, b, width) =>
  scaleUtc()
    .domain([a, b])
    .range([0, width])
    .clamp(true)
    .nice(utcDay);

const ALERT_FOR_DISEASE = {
  asthma : "transition",
  copd   : "atrisk"
};

const isBeforeDate = (date, end)   => moment(date).diff(moment(end))   < 0 ? date : false;
const isAfterDate  = (date, start) => moment(date).diff(moment(start)) > 0 ? date : false;

class MedicationUsage extends React.Component {

  column = undefined;

  setWidth(evt, width) {
    this.setState({
      width: width || this.column.clientWidth
    });
  }

  setPrintWidth(evt) {
    // debugger;
    this.setWidth(evt, "1100");
  }

  constructor(props) {
    super(props);
    this.setColumnRef = el => { this.column = el; };
    this.state = { width: 1090 };
    this.setWidth = this.setWidth.bind(this);
    this.setPrintWidth = this.setPrintWidth.bind(this);
  }

  componentDidMount() {
    this.setWidth();

    if (HAS_WINDOW) {
      window.addEventListener("resize", this.setWidth);
      window.addEventListener("beforeprint", this.setPrintWidth);
      window.addEventListener("afterprint", this.setWidth);
    }
  }

  componentWillUnmount() {
    if (HAS_WINDOW) {
      window.removeEventListener("resize", this.setWidth);
      window.removeEventListener("beforeprint", this.setPrintWidth);
      window.removeEventListener("afterprint", this.setWidth);
    }
  }

  render() {
    const {
      disease,
      range,
      days,
      medications,
      alerts,
      sync,
      startDate,
      adherence,
      t
    } = this.props;

    const { width }   = this.state;
    const height      = 240;
    const margin      = { top: 10, right: 1, bottom: 20, left: 40 };
    const graphWidth  = width - margin.left - margin.right;
    const graphHeight = height - margin.top - margin.bottom - 18;
    const xWidth      = graphWidth / days.length / 2;

    const xFormatter     = timeFormat("%-d");
    const monthFormatter = timeFormat("%b");

    const lineScale = createTimeScale(
      range[0],
      range[1],
      graphWidth + (xWidth * 2)
    );

    const xScale = createTimeScale(
      range[0],
      range[1],
      graphWidth
    );

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
      .ticks(timeMonday)
      .tickSize(-(graphHeight - 1));

    const alertDates = alerts[ALERT_FOR_DISEASE[disease]].map(a => moment.utc(a).format("YYYY-MM-DD"));

    const rescueData = days.map(d => {
      d.alert = alertDates.indexOf(moment.utc(d.date).format("YYYY-MM-DD")) > -1;
      return d;
    });

    const lastRescue     = sync.lastRescue && isBeforeDate(sync.lastRescue, range[1]);
    const lastController = sync.lastController && isBeforeDate(sync.lastController, range[1]);
    const firstDate      = isAfterDate(startDate, range[0]);
    const hasRescue      = !!sync.firstRescue;
    const hasController  = !!sync.firstController;

    return (
      <div ref={this.setColumnRef} style={{ marginTop: "1rem" }}>
        <SectionHeader
          text={t("MEDICATION_USAGE")}
          tab={t("LAST_NUM_DAYS", {number: 30})}
        />
        {hasRescue && <RescueMedicationChart
          disease={disease}
          data={rescueData}
          firstDate={firstDate}
          lastSync={lastRescue}
          alertDates={alertDates}
          width={width}
          height={height}
          margin={margin}
          graphHeight={graphHeight}
          graphWidth={graphWidth}
          xScale={xScale}
          xWidth={xWidth}
          lineScale={lineScale}
          bottomAxis={bottomAxis}
          monthAxis={monthAxis}
          weekAxis={weekAxis}
          colors={COLORS}
          medications={medications.rescue}
          title={t("RESCUE_MEDICATION_USAGE")}
        />}
        {hasController && <ControllerMedicationChart
          data={adherence}
          firstDate={firstDate}
          lastSync={lastController}
          width={width}
          height={height}
          margin={margin}
          graphHeight={graphHeight}
          graphWidth={graphWidth}
          xScale={xScale}
          xWidth={xWidth}
          bottomAxis={bottomAxis}
          monthAxis={monthAxis}
          weekAxis={weekAxis}
          colors={COLORS}
          medications={medications.controller}
          title={t("CONTROLLER_MEDICATION_ADHERENCE")}
        />}
      </div>
    );
  }
}

export default translate("patient-report")(MedicationUsage);
