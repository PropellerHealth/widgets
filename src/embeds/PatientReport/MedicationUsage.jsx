import React from "react";
import moment from "moment";
import { translate } from "react-i18next";
import { scaleUtc } from "d3-scale";
import { utcDay, timeDay, timeMonth, utcMonday } from "d3-time";
import { axisBottom, axisTop } from "d3-axis";
import { timeFormat, isoParse } from "d3-time-format";
import SectionHeader from "./SectionHeader";
import RescueMedicationChart from "./RescueMedicationChart";
import ControllerMedicationChart from "./ControllerMedicationChart";

import { COLORS } from "../../utilities";

const createTimeScale = (a, b, width) =>
  scaleUtc()
    .domain([a, utcDay.offset(b, + 1)])
    .range([0, width])
    .clamp(true)
    .nice(utcDay);

const ALERT_FOR_DISEASE = {
  asthma : "transition",
  copd   : "atrisk"
};

const lastSync = (date, end) => moment(date).diff(moment(end), "d") < 0 ? date : false;
const prehistoryDate = (date, start) => moment(date).diff(moment(start), "d") > 0 ? date : false;

const MedicationUsage = function MedicationUsage({
  disease,
  range,
  days,
  medications,
  alerts,
  sync,
  startDate,
  t
}) {
  const width  = 1090;
  const height = 240;
  const margin = { top: 10, right: 35, bottom: 20, left: 35 };
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
    .ticks(utcMonday)
    .tickSize(-graphHeight);

  const alertDates = alerts[ALERT_FOR_DISEASE[disease]].map(a => new Date(a).toISOString());

  const rescueData = days.map(d => {
    d.date  = new Date(d.date);
    d.alert = alertDates.indexOf(d.date.toISOString()) > -1;
    return d;
  });

  const lastRescue     = lastSync(sync.lastRescue, range[1]);
  const lastController = lastSync(sync.lastController, range[1]);
  console.log('startDate', startDate);
  const firstDate      = prehistoryDate(startDate, range[0]);
  console.log('firstDate', firstDate);

  return (
    <div style={{ marginTop: "1rem" }}>
      <SectionHeader
        text={t("MEDICATION_USAGE")}
        tab={t("LAST_NUM_DAYS", {number: 30})}
      />
      <RescueMedicationChart
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
        dScale={lineScale}
        bottomAxis={bottomAxis}
        monthAxis={monthAxis}
        weekAxis={weekAxis}
        colors={COLORS}
        medications={medications.rescue}
        title={t("RESCUE_MEDICATION_USAGE")}
      />
      <ControllerMedicationChart
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
      />
    </div>
  );
};

export default translate("patient-report")(MedicationUsage);
