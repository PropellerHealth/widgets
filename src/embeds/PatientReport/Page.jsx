import React from "react";
import { Grid } from "react-bootstrap";

const Page = props => {
  return (
    <Grid
      style={{
        margin: "2rem 2rem",
        pageBreakAfter: "always",
        pageBreakInside: "avoid"
      }}
    >
      {props.children}
    </Grid>
  );
};

export default Page;
