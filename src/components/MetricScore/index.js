import React from "react";
import "./index.css";

const MetricScore = ({ className = "", ...rest }) => (
  <span className={`metric-score ${className}`} {...rest} />
);

export default MetricScore;
