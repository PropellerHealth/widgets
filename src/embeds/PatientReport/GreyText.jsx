import React from "react";
import { COLORS } from "../../utilities";

const GreyText = ({ style, ...rest }) => (
  <span style={Object.assign({}, { color: COLORS.grey }, style)} {...rest} />
);

export default GreyText;
