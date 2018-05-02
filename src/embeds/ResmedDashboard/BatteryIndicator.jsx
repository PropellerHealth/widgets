import React from "react";
import { Glyphicon } from "react-bootstrap";

const style =  {
  fontSize: "2.5rem",
  position: "absolute",
  left: "-2px",
  top: "6px"
};

const BatteryIndicator = ({ voltage, charging }) => {
  const bars = [4, 3, 2, 1];
  const voltageMin = 12;
  const percent = (voltage - voltageMin) / 4 * 100;
  const level = Math.round(percent / 25 * 10) / 10;
  const warn = percent <= 5 ? "battery-warn" : "";
  const isCharging = charging === 1;

  return (
    <div>
      <h5>Battery Status</h5>
      <div className={`battery-indicator ${warn}`}>
        <div className="battery-icon">
          <span className="battery-cap" />
          {isCharging ? (
            <Glyphicon glyph="flash" style={style} />
          ) : (
            bars.map(n => {
              const lvl = n <= level ? "charged" : "";
              return (
                <span
                  key={`battery-level-${n}`}
                  className={`battery-level ${lvl}`}
                />
              );
            })
          )}
        </div>
        <div className="battery-percent">{Math.round(percent)}%</div>
      </div>
    </div>
  );
};

export default BatteryIndicator;