import React from "react";

const STATUS_MAP = {
  low: "good",
  medium: "fair",
  high: "poor"
};

const THRESHOLDS = {
  fair: 0.4,
  poor: 0.55
};

const HEIGHT = "40px";

const styles = {
  wrapper: {
    width: "100%",
    height: HEIGHT,
    lineHeight: HEIGHT,
    marginBottom: "0.75rem"
  }
};

// const markerPosition = score => {
//   console.log(typeof score);
//   if ("number" !== typeof score) return;

//   let position;
//   if (score > THRESHOLDS.fair) {
//     position = 0.33333 / (score / THRESHOLDS.fair);
//   } else if (score > THRESHOLDS.poor) {
//     position = 0.66667 + (0.3333 / ( 1 - score));
//   }

//   console.log(position);
//   return position;
// };

const isActive = bool => bool ? "active" : "";

const AsthmaScoreBar = ({ status, score }) => {
  const _status = STATUS_MAP[status];
  return (
    <div
      className="status-bar"
      style={styles.wrapper}
    >
      <div className={`status-section good ${isActive("good" === _status)}`}>
        <span>Good</span>
      </div>
      <div className={`status-section fair ${isActive("fair" === _status)}`}>
        <span>Fair</span>
      </div>
      <div className={`status-section poor ${isActive("poor" === _status)}`}>
        <span>Poor</span>
      </div>
    </div>
  );
};

export default AsthmaScoreBar;
