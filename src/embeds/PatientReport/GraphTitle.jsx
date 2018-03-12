import React from "react";
import { Row, Col } from "react-bootstrap";

const GraphTitle = ({ title, medications = [], legend }) => {
  const colWidth = legend ? 6 : 12;
  const medNames = medications.map(m => m.medication.shortName).join(", ");
  const medName = medNames && (
    <span>
      (<strong>{medNames}</strong>)
    </span>
  );

  return (
    <Row style={{ paddingLeft: "6rem" }}>
      <Col xs={colWidth}>
        <h4 style={{ fontSize: "1.8rem" }}>
          <span style={{ textTransform: "uppercase" }}>{title}</span> {medName}
        </h4>
      </Col>
      {legend && <Col xs={colWidth}>{legend}</Col>}
    </Row>
  );
};

export default GraphTitle;
