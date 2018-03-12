import React from "react";
import moment from "moment";
import { Row, Col } from "react-bootstrap";
import PageHeader from "./PageHeader";

import { COLORS } from "../../utilities";
import logo from "../../assets/images/logo.svg";

const timeFrame = range => {
  const d1 = moment(range[0]);
  const d2 = moment(range[1]);

  if (
    d1.month() === d2.month() ||
    (d2.diff(d1, "months") === 1 && d2.date() === 1)
  ) {
    return d1.format("MMM Y");
  } else {
    return `${d1.format("MMM")}-${d2.format("MMM")} ${d2.format("Y")}`;
  }
};

const Header = ({ timeFrame: range, disease = "asthma" }) => {
  return (
    <div>
      <Row>
        <Col xs={6}>
          <img src={logo} alt="Propeller Health" height={80} />
        </Col>
        <Col xs={6} style={{lineHeight: "6rem"}}>
          <h1
            className="text-right"
            style={{
              color: COLORS.darkGrey,
              fontSize: "2.5rem",
              lineHeight: "5rem",
              display: "inline-block",
              textAlign: "right",
              width: "100%",
              verticalAlign: "bottom"
            }}>
            {disease.toUpperCase()} HEALTH REPORT -{" "}
            <strong>{timeFrame(range).toUpperCase()}</strong>
          </h1>
        </Col>
      </Row>
      <PageHeader>Summary</PageHeader>
    </div>
  );
};

export default Header;
