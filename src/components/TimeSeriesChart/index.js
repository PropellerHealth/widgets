import React from "react";

const TimeSeriesChart = ({ style = {}, ...rest }) => {
  return (
    <div
      style={Object.assign(
        { position: "relative", pageBreakInside: "avoid" },
        style
      )}
      {...rest}
    />
  );
};

export default TimeSeriesChart;
