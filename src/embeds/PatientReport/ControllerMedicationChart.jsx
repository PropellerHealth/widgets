import React from "react";
import { Col } from "react-bootstrap";
import AreaChart from "../../components/AreaChart";
import ColorMark from "../../components/ColorMark";
import GraphTitle from "./GraphTitle";

const idxColors = [
  "#20C3F3",
  "#006C98",
  "#9B9B9B",
  "#8ADFCC"
];

const Legend = ({ medications }) => {
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
    </Col>
  );
};

const ControllerMedicationChart = ({ medications, title, ...rest }) => (
  <AreaChart medications={medications} {...rest} colors={idxColors} >
    <GraphTitle
      title={title}
      medications={medications}
      legend={<Legend medications={medications}/>}
    />
  </AreaChart>
);

export default ControllerMedicationChart;
