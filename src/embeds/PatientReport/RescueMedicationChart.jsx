import React from "react";
import { Col } from "react-bootstrap";
import { translate } from "react-i18next";
import BarChart from "../../components/BarChart";
import ColorMark from "../../components/ColorMark";
import GraphTitle from "./GraphTitle";

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
        <div style={{ display: "inline-block" }}>
          <span
            style={{
              color: COLORS.red,
              fontSize: "2.7rem",
              verticalAlign: "middle",
              fontWeight: "bold"
            }}
          >
            !
          </span>{" "}
          = {t(NOTIFICATION_TEXT)}
        </div>
        <ColorMark text={t("TOTAL")} color={COLORS.orange} right />
        <ColorMark text={t("NIGHTTIME_USAGE_LEGEND")} color={COLORS.brown} right />
        {baseline && <ColorMark text={t("RESCUE_BASELINE")} color={COLORS.green} right />}
        {incomplete && <ColorMark text={t("INCOMPLETE_DATA")} color={COLORS.lightGrey} right />}
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

  return (
    <BarChart baseline={baseline} lastSync={lastSync} {...rest}>
      <GraphTitle
        title={title}
        medications={medications}
        legend={
          <Legend medications={medications} disease={disease} baseline={baseline} incomplete={lastSync} t={t} />
        }
      />
    </BarChart>
  );
};

export default translate("patient-report")(RescueMedicationChart);
