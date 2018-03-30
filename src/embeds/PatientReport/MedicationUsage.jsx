import React from "react";
import { translate } from "react-i18next";
import { scaleUtc } from "d3-scale";
import { utcDay } from "d3-time";
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

const MedicationUsage = function MedicationUsage({
  range,
  days,
  medications,
  alerts,
  disease,
  t
}) {
  const width  = 1090;
  const height = 240;
  const margin = { top: 10, right: 35, bottom: 20, left: 35 };
  const graphWidth  = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom - 18;
  const xWidth      = graphWidth / days.length / 2;

  const areaScale = createTimeScale(
    range[0],
    range[1],
    graphWidth + (xWidth * 2)
  );

  const xScale = createTimeScale(
    range[0],
    range[1],
    graphWidth
  );

  const alertDates = alerts[ALERT_FOR_DISEASE[disease]].map(a => new Date(a).toISOString());

  const rescueData = days.map(d => {
    d.date  = new Date(d.date);
    d.alert = alertDates.indexOf(d.date.toISOString()) > -1;
    return d;
  });

  return (
    <div style={{ margin: "2rem 0" }}>
      <SectionHeader
        text={t("MEDICATION_USAGE")}
        tab={t("LAST_NUM_DAYS", {number: 30})}
      />
      <RescueMedicationChart
        disease={disease}
        data={rescueData}
        alertDates={alertDates}
        width={width}
        height={height}
        margin={margin}
        graphHeight={graphHeight}
        graphWidth={graphWidth}
        xScale={xScale}
        xWidth={xWidth}
        dScale={areaScale}
        colors={COLORS}
        medications={medications.rescue}
        title={t("RESCUE_MEDICATION_USAGE")}
      />
      <ControllerMedicationChart
        width={width}
        height={height}
        margin={margin}
        graphHeight={graphHeight}
        graphWidth={graphWidth}
        xScale={xScale}
        xWidth={xWidth}
        dScale={xScale}
        colors={COLORS}
        medications={medications.controller}
        title={t("CONTROLLER_MEDICATION_ADHERENCE")}
      />
    </div>
  );
};

export default translate("patient-report")(MedicationUsage);
