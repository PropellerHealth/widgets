import React from "react";
import { Glyphicon} from "react-bootstrap";
import { COLORS } from "../../utilities";

const DeviceStatus = ({ powered, running, disconnected = false }) => {
  const isPowered  = !disconnected && powered === 1;
  const isRunning  = !disconnected && running === 1;
  const powerColor = isPowered ? COLORS.green : COLORS.lightGrey;
  const runColor   = isRunning ? COLORS.blue : COLORS.lightGrey;

  return (
    <div>
      <h3>
        ResMed Mobi
        <Glyphicon
          glyph="off"
          style={{ marginLeft: "10px", color: powerColor, fontSize: "20px" }}
        />
        <span
          style={{
            marginLeft: "10px",
            color: runColor,
            fontSize: "4rem",
            lineHeight: "0rem"
          }}
        >
          ≋
        </span>
      </h3>
    </div>
  );
};

export default DeviceStatus;
