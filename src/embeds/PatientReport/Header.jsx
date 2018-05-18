import React from "react";
import { translate } from "react-i18next";
import { Row, Col } from "react-bootstrap";
import PageHeader from "./PageHeader";
import { COLORS, displayedDate } from "../../utilities";
import logo from "../../assets/images/logo.svg";

const timeFrame = range => {
  const d1 = range[0];
  const d2 = range[1];

  if (
    d1.month() === d2.month() ||
    (d2.diff(d1, "months") === 1 && d2.date() === 1)
  ) {
    return displayedDate(d1, "ll");
  } else {
    return `${displayedDate(d1, "ll")} - ${displayedDate(d2, "ll")}`;
  }
};

const Header = ({ range, disease = "asthma", t }) => {
  return (
    <div>
      <Row>
        <Col xs={6}>
          <img src={logo} alt="Propeller Health" height={60} />
        </Col>
        <Col xs={6} style={{ lineHeight: "6rem" }}>
          <h1
            className="text-right"
            style={{
              color: COLORS.darkGrey,
              margin: 0,
              fontSize: "2rem",
              lineHeight: "2.5rem",
              display: "inline-block",
              textAlign: "right",
              width: "100%",
              verticalAlign: "bottom"
            }}
          >
            {t("DISEASE_REPORT", { disease: t(disease.toUpperCase()).toUpperCase() })}
            <br/>
            <strong>{timeFrame(range).toUpperCase()}</strong>
          </h1>
        </Col>
      </Row>
      <PageHeader></PageHeader>
    </div>
  );
};

export default translate("patient-report")(Header);
