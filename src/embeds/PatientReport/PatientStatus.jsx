import React from "react";
import { Row, Col } from "react-bootstrap";
import { translate } from "react-i18next";
import SectionHeader from "./SectionHeader";
import AsthmaStatus from "./AsthmaStatus";
import CopdStatus from "./CopdStatus";
import QuizScore from "./QuizScore";
import Subtitle from "../../components/Subtitle";
import RoundedBox from "../../components/RoundedBox";
import TimesOfDay from "../../components/TimesOfDay";
import DaysOfWeek from "../../components/DaysOfWeek";
import MetricScore from "../../components/MetricScore";

const PatientStatus = function PatientStatus({
  disease,
  days,
  period,
  rescueNights,
  medications,
  controlStatus,
  trends,
  quiz = {},
  t
}) {
  const controller = medications.controller || [];
  const { dayofweek, timeofday } = trends;

  const totalDays = period > 31 ? 30 : period;

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
        tab={t("LAST_NUM_DAYS", { number: totalDays })}
      />
      <div style={{ position: "relative" }}>
        <Row>
          <Col xs={6}>
            {disease === "asthma"
              ? (
                <AsthmaStatus
                  totalDays={totalDays}
                  controlStatus={controlStatus}
                  rescueNights={rescueNights}
                />
              ) : (
                <CopdStatus
                  totalDays={totalDays}
                  days={days}
                  rescueNights={rescueNights}
                />
              )
            }
          </Col>
          <Col xs={6}>
            <Row className="text-center" style={{marginTop: "1rem", marginBottom: "1rem"}}>
              <TimesOfDay data={ timeofday } width={280} height={210} />
              <DaysOfWeek data={ dayofweek } width={280} height={210} />
            </Row>
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <RoundedBox color="blue">
              <h4>
                {t("CONTROLLER_ADHERENCE")}{" "}
                <Subtitle>
                  {t("LAST_NUM_DAYS", { number: totalDays }).toLowerCase()}
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
          <Col xs={6}>
            <QuizScore quiz={quiz} disease={disease} />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default translate("patient-report")(PatientStatus);
