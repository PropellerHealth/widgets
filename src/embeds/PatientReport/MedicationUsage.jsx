import React from "react";
import { translate } from "react-i18next";
import { scaleTime, scaleUtc } from "d3-scale";
import { utcParse } from "d3-time-format";
import { utcDay, timeDay } from "d3-time";
import SectionHeader from "./SectionHeader";
import RescueMedicationChart from "./RescueMedicationChart";
import ControllerMedicationChart from "./ControllerMedicationChart";

import { COLORS } from "../../utilities";

const createTimeScale = (a, b, width) =>
  scaleUtc()
    .domain([
      new Date(a),
      utcDay.offset(new Date(b), + 1)
    ])
    .range([0, width])
    .clamp(true)
    .nice(utcDay);

const MedicationUsage = function MedicationUsage({
  range,
  days,
  medications,
  controller,
  transitionAlerts,
  t
}) {
  const width  = 1090;
  const height = 240;
  const margin = { top: 10, right: 35, bottom: 30, left: 60 };
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom - 18;
  const xWidth = graphWidth / rescue.length / 2;

  const areaScale = createTimeScale(
    new Date(range[0]),
    new Date(range[1]),
    graphWidth
  );

  const xScale = createTimeScale(
    range[0],
    range[1],
    graphWidth
  );

  const alerts = transitionAlerts.map(a => new Date(a).toISOString());

  const rescueData = days.map(d => {
    let newDate = new Date(d.date.split("T")[0]);
    d.date  = newDate;
    d.alert = alerts.indexOf(newDate.toISOString()) > -1;
    return d;
  });

  return (
    <div style={{ margin: "2rem 0" }}>
      <SectionHeader text={t("MEDICATION_USAGE")} tab={t("LAST_NUM_DAYS", {number: 30})} />
      <RescueMedicationChart
        data={rescueData}
        width={width}
        height={height}
        margin={margin}
        graphHeight={graphHeight}
        graphWidth={graphWidth}
        xScale={xScale}
        xWidth={xWidth}
        dScale={xScale}
        colors={COLORS}
        medications={medications.rescue}
        title={t("RESCUE_MEDICATION_USAGE")}
      />
      <ControllerMedicationChart
        data={controller}
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
