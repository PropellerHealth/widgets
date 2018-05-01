import React from "react";
import { Col } from "react-bootstrap";
import { translate } from "react-i18next";
import AreaChart from "../../components/AreaChart";
import ColorMark from "../../components/ColorMark";
import GraphTitle from "./GraphTitle";
import TimeSeriesChart from "../../components/TimeSeriesChart";

import { COLORS } from "../../utilities";

const idxColors = [
  "#20C3F3",
  "#006C98",
  "#9B9B9B",
  "#8ADFCC"
];

const Legend = ({ medications, incomplete, t }) => {
  return (
    <Col xs={12} style={{ fontSize: "1.5rem", lineHeight: "2rem", verticalAlign: "middle", margin: "0.5rem 0" }}>
      { medications.map((m, i) => (
        <ColorMark
          key={`controller-med-${i}`}
          text={m.medication.shortName}
          color={idxColors[i]}
          left
        />
      ))}
      <div
        className="text-right"
        style={{ float: "right" }}
      >
        {incomplete && <ColorMark text={t("INCOMPLETE_DATA")} color={COLORS.lightGrey} right />}
      </div>
    </Col>
  );
};

const ControllerMedicationChart = ({ medications, title, lastSync, t, ...rest }) => (
  <TimeSeriesChart>
    <GraphTitle
      title={title}
      medications={medications}
      legend={
        <Legend medications={medications} incomplete={lastSync} t={t}/>
      }
    />
    <AreaChart medications={medications} lastSync={lastSync} {...rest} colors={idxColors} />
  </TimeSeriesChart>
);

export default translate("patient-report")(ControllerMedicationChart);
