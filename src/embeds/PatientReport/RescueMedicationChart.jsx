import React from "react";
import { Col } from "react-bootstrap";
import { translate } from "react-i18next";
import BarChart from "../../components/BarChart";
import ColorMark from "../../components/ColorMark";
import GraphTitle from "./GraphTitle";
import TimeSeriesChart from "../../components/TimeSeriesChart";

import { COLORS } from "../../utilities";

const Legend = ({ medications, disease, baseline, incomplete, t }) => {
  const NOTIFICATION_TEXT = disease === "copd"
    ? "AT_RISK_OF_COPD_EXACERBATION"
    : "CONTROL_STATUS_LEGEND";

  return (
    <Col xs={12} style={{ verticalAlign: "middle", lineHeight: "2rem", fontSize: "1.5rem" }}>
      <div style={{ display: "inline-block" }}>
        <strong>{ medications.map(m => m.medication.shortName).join(", ") }</strong>
      </div>
      <div
        className="text-right"
        style={{ float: "right" }}
      >
        <ColorMark text={`= ${t(NOTIFICATION_TEXT)}`} color={COLORS.red} mark="!" />
        <ColorMark text={t("TOTAL")} color={COLORS.orange} right />
        <ColorMark text={t("NIGHTTIME_USAGE_LEGEND")} color={COLORS.brown} right />
        {baseline && <ColorMark text={t("RESCUE_BASELINE")} color={COLORS.green} right mark="—" />}
        {incomplete && <ColorMark text={t("INCOMPLETE_DATA")} color={COLORS.lightestGrey} right />}
      </div>
    </Col>
  );
};

const RescueMedicationChart = function RescueMedicationChart({
  medications,
  title,
  disease,
  t,
  lastSync,
  ...rest
}) {

  const baseline = disease === "copd";
  const label = t("EVENTS");

  return (
    <TimeSeriesChart>
      <GraphTitle
        title={title}
        medications={medications}
        legend={
          <Legend medications={medications} disease={disease} baseline={baseline} incomplete={lastSync} t={t} />
        }
      />
      <BarChart baseline={baseline} lastSync={lastSync} yLabel={label} {...rest} />
    </TimeSeriesChart>
  );
};

export default translate("patient-report")(RescueMedicationChart);
