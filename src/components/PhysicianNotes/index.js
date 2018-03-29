import React from "react";
import { Col } from "react-bootstrap";
import { translate } from "react-i18next";

import RoundedBox from "../RoundedBox";
import COLORS from "../../utilities";
import GreyText from "../GreyText";

const PhysicianNotes = ({ t }) => {
  return (
    <Col
      xs={6}
      style={{
        position: "absolute",
        left: "50%",
        right: 0,
        bottom: 0,
        top: 0
      }}
    >
      <RoundedBox
        color="blue"
        style={{
          position: "absolute",
          bottom: 0,
          top: 0,
          right: 0,
          left: "15px"
        }}
      >
        <span
          style={{
            position: "absolute",
            display: "block",
            width: "50px",
            height: "50px",
            background: COLORS.blue,
            borderRadius: "50%",
            color: "white",
            textAlign: "center",
            lineHeight: "50px",
            fontSize: "4rem",
            fontWeight: "bold",
            right: "-10px",
            top: "-10px"
          }}
        >
          !
        </span>
        <h4>{t("PHYSICIAN_EVALUATION")}:</h4>
        <div
          style={{
            position: "absolute",
            bottom: "1.7rem",
            right: "1.2rem",
            left: "1.2rem"
          }}
        >
          <GreyText>{t("SIGN")}:</GreyText>
          <GreyText
            style={{
              borderBottom: "1px solid",
              position: "absolute",
              left: "6rem",
              right: "1.2rem",
              bottom: "4px"
            }}
          />
        </div>
      </RoundedBox>
    </Col>
  );
};

export default translate("patient-report")(PhysicianNotes)