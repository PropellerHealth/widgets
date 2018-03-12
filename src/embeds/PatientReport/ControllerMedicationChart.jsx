import React from "react";
import AreaChart from "../../components/AreaChart";
import GraphTitle from "./GraphTitle";

const ControllerMedicationChart = ({ data, medications, title, ...rest }) => (
  <AreaChart data={data} {...rest}>
    <GraphTitle title={title} medications={medications} />
  </AreaChart>
);

export default ControllerMedicationChart;
