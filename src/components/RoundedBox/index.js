import React from "react";
import "./index.css";

const RoundedBox = ({ color = "", ...rest}) => (
  <div className={`rounded-box ${color}`} {...rest} />
);

export default RoundedBox;
