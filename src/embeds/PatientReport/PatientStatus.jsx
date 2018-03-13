import React from "react";
import { Row, Col } from "react-bootstrap";
import { translate } from "react-i18next";
import SectionHeader from "./SectionHeader";
import GreyText from "./GreyText";
import RoundedBox from "./RoundedBox";
import MetricScore from "./MetricScore";

import { COLORS } from "../../utilities";

const PatientStatus = function PatientStatus({
  controlStatus,
  rescue,
  controllerAvg = 0,
  t
}) {
  const nights = rescue.filter(r => r.values.eventsRescueNight > 0).length;
  return (
    <div style={{ margin: "2rem 0" }}>
      <SectionHeader
        text={t("PATIENT_STATUS_HEADER")}
        tab={t("NUM_DAYS", { number: 30 })}
      />
      <div style={{ position: "relative" }}>
        <Row>
          <Col xs={6}>
            <Row>
              <Col xs={12}>
                <RoundedBox color="red">
                  {t("WELL_CONTROLLED")}:{" "}
                  <MetricScore>
                    {t("NUM_DAYS", { number: controlStatus.good })}
                  </MetricScore>
                  <br />
                  {t("NOT_WELL_CONTROLLED")}:{" "}
                  <MetricScore>
                    {t("NUM_DAYS", { number: controlStatus.fair })}
                  </MetricScore>
                  <br />
                  {t("POORLY_CONTROLLED")}:{" "}
                  <MetricScore>
                    {t("NUM_DAYS", { number: controlStatus.poor })}
                  </MetricScore>
                </RoundedBox>
              </Col>
            </Row>
            <Row>
              <Col xs={6} style={{ paddingRight: "8px" }}>
                <RoundedBox color="orange">
                  {t("CONTROLLER_ADHERENCE")}:
                  <br />
                  <MetricScore>{controllerAvg}%</MetricScore>
                </RoundedBox>
              </Col>
              <Col xs={6} style={{ paddingLeft: "8px" }}>
                <RoundedBox color="purple">
                  {t("NIGHTTIME_RESUCE_USAGE")}:
                  <br />
                  <MetricScore>
                    {t("NUM_NIGHTS", { number: nights })}
                  </MetricScore>
                </RoundedBox>
              </Col>
            </Row>
          </Col>
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
              {t("PHYSICIAN_EVALUATION")}:
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
        </Row>
      </div>
    </div>
  );
};

export default translate("patient-report")(PatientStatus);
