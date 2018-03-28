import React from "react";
import "./index.css";

const RoundedBox = ({ color = "", style = {}, children}) => {
  return (
    <div
      className={`rounded-box ${color}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default RoundedBox;
