import React from "react";
import { Row, Col } from "react-bootstrap";
import { COLORS } from "../../utilities";

const SectionHeader = props => {
  return (
    <Row>
      <Col xs={12}>
        <h3
          style={{
            borderBottom: "3px solid",
            borderColor: COLORS.blue,
            textTransform: "uppercase",
            fontSize: "2rem",
            fontWeight: "bold",
            paddingBottom: "1.2rem",
            lineHeight: "2rem"
          }}
        >
          {props.text}{" "}
          <span
            style={{
              background: COLORS.blue,
              color: "white",
              padding: "0.7rem 1.2rem 1.2rem",
              borderRadius: "10px 10px 0 0",
              margin: "0 0.7rem"
            }}
          >
            {props.tab}
          </span>
        </h3>
      </Col>
    </Row>
  );
};

export default SectionHeader;
