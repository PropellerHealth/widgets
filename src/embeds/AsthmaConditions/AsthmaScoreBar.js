import React from "react";

const STATUS_MAP = {
  low: "good",
  medium: "fair",
  high: "poor"
};

const AsthmaScoreBar = ({ status }) => {
  return (
    <div className={`status-bar status-${STATUS_MAP[status]}`}>
      <div className="status-section good">
        <span>Good</span>
      </div>
      <div className="status-section fair">
        <span>Fair</span>
      </div>
      <div className="status-section poor">
        <span>Poor</span>
      </div>
    </div>
  );
};

export default AsthmaScoreBar;
