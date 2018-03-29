import React from "react";
import { Grid } from "react-bootstrap";
import "./index.css";

const Page = ({ className = "", ...rest }) => (
  <Grid className={`page ${className}`} {...rest} />
);

export default Page;
