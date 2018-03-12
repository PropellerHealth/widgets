import React from "react";
import { COLORS } from "../../utilities";

const PageHeader = ({ children }) => {
  return (
    <div
      className="text-center"
      style={{
        background: COLORS.blue,
        color: "white",
        padding: "0.5rem 0",
        margin: "1.2rem 0",
        fontSize: "2rem",
        textTransform: "uppercase"
      }}
    >
      <strong>{children}</strong>
    </div>
  );
};

export default PageHeader;
