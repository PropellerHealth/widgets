import React from "react";
import { Row, Col } from "react-bootstrap";
import { translate } from "react-i18next";
import SectionHeader from "./SectionHeader";
import GreyText from "./GreyText";
import RoundedBox from "../../components/RoundedBox";
import MetricScore from "./MetricScore";

import { COLORS } from "../../utilities";

const Subtitle = ({ children }) => (
  <GreyText style={{ fontSize: "15px" }}>{children}</GreyText>
);

const PatientStatus = function PatientStatus({
  rescueNights,
  medications,
  controlStatus,
  trends,
  t
}) {
  const controller = medications.controller || [];
  const { dayofweek, timeofday } = trends;

  const adherence = controller.map(med => {
    const items = med.adherence;

    return {
      name: med.medication.name,
      adherence: Math.round(
        items.reduce((total, item) => total + item.values.percent, 0) /
          items.length
      )
    };
  });

  return (
    <div style={{ margin: "2rem 0" }}>
      <SectionHeader
        text={t("HEALTH_STATUS")}
        tab={t("LAST_NUM_DAYS", { number: 30 })}
      />
      <div style={{ position: "relative" }}>
        <Row>
          <Col xs={6}>
            <Row>
              <Col xs={12}>
                <RoundedBox color="red">
                  <h4>{t("ASTHMA_CONTROL_STATUS")}</h4>
                  {t("WELL_CONTROLLED")}:{" "}
                  <MetricScore>
                    {t("NUM_DAY", { count: controlStatus.good })}
                  </MetricScore>
                  <br />
                  {t("NOT_WELL_CONTROLLED")}:{" "}
                  <MetricScore>
                    {t("NUM_DAY", { count: controlStatus.fair })}
                  </MetricScore>
                  <br />
                  {t("POORLY_CONTROLLED")}:{" "}
                  <MetricScore>
                    {t("NUM_DAY", { count: controlStatus.poor })}
                  </MetricScore>
                </RoundedBox>
              </Col>
              <Col xs={12}>
                <RoundedBox color="purple">
                  <h4>
                    {t("NIGHTTIME_RESUCE_USE")}
                    <br />
                    <Subtitle>
                      {t("LAST_NUM_DAYS", { number: 30 }).toLowerCase()}
                    </Subtitle>
                  </h4>
                  <MetricScore>{t("NUM_NIGHT", { count: nights })}</MetricScore>
                </RoundedBox>
              </Col>
              <Col xs={12}>
                <RoundedBox color="blue">
                  <h4>
                    {t("CONTROLLER_ADHERENCE")}{" "}
                    <Subtitle>
                      {t("LAST_NUM_DAYS", { number: 30 }).toLowerCase()}
                    </Subtitle>
                  </h4>
                  <Row>
                    {adherence.map((med, i) => (
                      <Col xs={6} key={`adherence-${i}`}>
                        <strong>{med.name}</strong>
                        <br />
                        <MetricScore>{med.adherence}%</MetricScore>
                      </Col>
                    ))}
                  </Row>
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
        </Row>
      </div>
    </div>
  );
};

export default translate("patient-report")(PatientStatus);
