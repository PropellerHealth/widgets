import React from "react";
import { translate } from "react-i18next";
import BarChart from "../../components/BarChart";
import GraphTitle from "./GraphTitle";

import { COLORS } from "../../utilities";

const RescueMedicationChart = function RescueMedicationChart({
  medications,
  title,
  disease,
  t,
  ...rest
}) {

  const includeBaseline   = disease === "copd";
  const NOTIFICATION_TEXT = disease === "copd"
    ? "AT_RISK_OF_COPD_EXACERBATION"
    : "CONTROL_STATUS_LEGEND";

  return (
    <BarChart includeBaseline={includeBaseline} {...rest}>
      <GraphTitle
        title={title}
        medications={medications}
        legend={
          <div
            className="text-right"
            style={{ fontSize: "1.5rem", lineHeight: "3.2rem" }}
          >
            <div style={{ display: "inline-block" }}>
              <span
                style={{
                  color: COLORS.red,
                  fontSize: "2.7rem",
                  verticalAlign: "bottom",
                  fontWeight: "bold"
                }}
              >
                !
              </span>{" "}
              = {t(NOTIFICATION_TEXT)}
            </div>
            <div style={{ display: "inline-block", paddingLeft: "3rem" }}>
              <span
                style={{
                  color: COLORS.brown,
                  fontSize: "2.2rem",
                  verticalAlign: "bottom"
                }}
              >
                ●
              </span>{" "}
              <strong>{t("NIGHTTIME_USAGE_LEGEND")}</strong>
            </div>
          </div>
        }
      />
    </BarChart>
  );
};

export default translate("patient-report")(RescueMedicationChart);
