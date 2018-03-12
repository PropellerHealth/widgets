import React from "react";

const MetricScore = ({ style, ...rest }) => {
  return (
    <span
      style={Object.assign(
        {},
        { fontWeight: "bold", fontSize: "2rem", lineHeight: "2rem" },
        style
      )}
      {...rest}
    />
  );
};

export default MetricScore;
