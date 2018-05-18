import React from "react";
import { Row, Col } from "react-bootstrap";

const GraphTitle = ({ title, medications = [], legend }) => {
  return (
    <Row style={{ paddingLeft: "3.5rem" }}>
      <Col xs={12}>
        <h4 style={{ fontSize: "1.8rem", textTransform: "uppercase" }}>
          {title}
        </h4>
      </Col>
      {legend}
    </Row>
  );
};

export default GraphTitle;
