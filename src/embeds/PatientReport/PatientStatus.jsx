import React from "react";
import { Row, Col } from "react-bootstrap";
import { translate } from "react-i18next";
import SectionHeader from "./SectionHeader";
import GreyText from "../../components/GreyText";
import RoundedBox from "../../components/RoundedBox";
import TimesOfDay from "../../components/TimesOfDay";
import DaysOfWeek from "../../components/DaysOfWeek";
import MetricScore from "../../components/MetricScore";

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
                  <MetricScore>{t("NUM_NIGHT", { count: rescueNights })}</MetricScore>
                </RoundedBox>
              </Col>
            </Row>
          </Col>
          <Col xs={6}>
            <Row className="text-center" style={{marginTop: "1rem", marginBottom: "1rem"}}>
              <TimesOfDay data={ timeofday } width={280} height={210} />
              <DaysOfWeek data={ dayofweek } width={280} height={210} />
            </Row>
          </Col>
        </Row>
        <Row>
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
      </div>
    </div>
  );
};

export default translate("patient-report")(PatientStatus);
