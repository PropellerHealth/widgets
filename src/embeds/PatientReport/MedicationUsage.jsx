import React from "react";
import { translate } from "react-i18next";
import { scaleTime } from "d3-scale";
import { isoParse } from "d3-time-format";
import SectionHeader from "./SectionHeader";
import RescueMedicationChart from "./RescueMedicationChart";
import ControllerMedicationChart from "./ControllerMedicationChart";

import { COLORS } from "../../utilities";

const createTimeScale = (a, b, width) =>
  scaleTime()
    .domain([isoParse(a), isoParse(b)])
    .rangeRound([0, width])
    .clamp(true);

const MedicationUsage = function MedicationUsage({
  controller,
  rescue,
  range,
  rescueMeds = [],
  controllerMeds = [],
  transitionAlerts,
  t
}) {
  const width = 1090;
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
    new Date(range[0]),
    new Date(range[1]),
    graphWidth - xWidth
  );

  const alerts = transitionAlerts.map(a => new Date(a).toISOString());

  const rescueData = rescue.map(r => {
    r.date = new Date(r.date);
    r.alert = alerts.indexOf(r.date.toISOString()) > -1;
    return r;
  });

  return (
    <div style={{ margin: "2rem 0" }}>
      <SectionHeader text={t("MEDICATION_USAGE_FOR_LAST")} tab={t("NUM_DAYS", {number: 30})} />
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
        medications={rescueMeds}
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
        dScale={areaScale}
        colors={COLORS}
        medications={controllerMeds}
        title={t("CONTROLLER_MEDICATION_ADHERENCE")}
      />
    </div>
  );
};

export default translate("patient-report")(MedicationUsage);
