import React from "react";
import AreaChart from "../../components/AreaChart";
import GraphTitle from "./GraphTitle";

const idxColors = [
  "#00B5F5",
  "#005786"
];

const ControllerMedicationChart = ({ medications, title, ...rest }) => (
  <AreaChart medications={medications} {...rest} colors={idxColors} >
    <GraphTitle title={title} medications={medications} />
  </AreaChart>
);

export default ControllerMedicationChart;
