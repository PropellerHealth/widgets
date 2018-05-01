import React from "react";

const ColorMark = ({ text, color, left, right, style = {}, mark = "●" }) => {
  const padding = left
    ? { paddingRight: "1.5rem" }
    : right
      ? { paddingLeft: "1.5rem "}
      : {};

  return (
    <div style={Object.assign({ display: "inline-block" }, padding, style)}>
      <span
        style={{
          color: color,
          fontSize: "2.2rem",
          verticalAlign: "bottom"
        }}
      >
        {mark}
      </span>{" "}
      <strong>{text}</strong>
    </div>
  );
};

export default ColorMark;
