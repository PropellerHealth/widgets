import React from "react";
import BarChart from "../../components/BarChart";
import GraphTitle from "./GraphTitle";

import { COLORS } from "../../utilities";

const RescueMedicationChart = function RescueMedicationChart({
  data,
  medications,
  title,
  ...rest
}) {
  return (
    <BarChart xLabel="Days" yLabel="Puffs" data={data} {...rest}>
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
              = Notification sent for change in control status
            </div>
            <div style={{ display: "inline-block", paddingLeft: "3rem" }}>
              <span
                style={{
                  color: COLORS.deepRed,
                  fontSize: "2.2rem",
                  verticalAlign: "bottom"
                }}
              >
                ●
              </span>{" "}
              <strong>Nighttime</strong>
            </div>
          </div>
        }
      />
    </BarChart>
  );
};

export default RescueMedicationChart;
