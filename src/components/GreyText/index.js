import React from "react";
import "./index.css";

const GreyText = ({ className = "", ...rest }) => (
  <span className={`grey-text ${className}`} {...rest} />
);

export default GreyText;
