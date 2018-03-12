import React from "react";
import { COLORS } from "../../utilities";

const RoundedBox = props => {
  return (
    <div
      style={Object.assign(
        {},
        {
          border: "2px solid",
          borderRadius: "15px",
          borderColor: COLORS[props.color],
          boxSizing: "border-box",
          padding: "1.5rem",
          margin: "1rem auto"
        },
        props.style
      )}
    >
      {props.children}
    </div>
  );
};

export default RoundedBox;
