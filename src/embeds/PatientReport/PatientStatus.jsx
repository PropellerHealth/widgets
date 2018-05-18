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

import { displayedDate } from "../../utilities";

const PatientStatus = function PatientStatus({
  disease,
  days,
  rescueNights,
  medications,
  controlStatus,
  trends,
  quiz = {},
  lastSync,
  sensors = [],
  t
}) {

  const { dayofweek, timeofday } = trends;

  const controller = medications.controller || [];

  const adherence = controller.map(med => {
    const items = med.adherenceByDay.filter(item => item.values && "number" === typeof item.values.percent);

    return {
      name      : med.medication.name,
      adherence : Math.round(
        items.reduce(
          (tot, item) => tot + item.values.percent,
          0
        ) / items.length
      )
    };
  });

  return (
    <div style={{ marginTop: "1rem" }}>
      <SectionHeader
        text={t("HEALTH_STATUS")}
        tab={t("LAST_NUM_DAYS", { number: 30 })}
      />
      <div style={{ position: "relative" }}>
        <Row>
          <Col xs={6} className="col-left">
            {disease === "asthma"
              ? (
                <AsthmaStatus
                  controlStatus={controlStatus}
                  rescueNights={rescueNights}
                />
              ) : (
                <CopdStatus
                  days={days}
                  rescueNights={rescueNights}
                />
              )
            }
          </Col>
          <Col xs={6} className="col-right">
            <Row className="text-center" style={{marginTop: "1rem", marginBottom: "1rem"}}>
              <TimesOfDay data={ timeofday } width={280} height={210} />
              <DaysOfWeek data={ dayofweek } width={280} height={210} />
            </Row>
          </Col>
        </Row>
        <Row>
          <Col xs={6} className="col-left">
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
          <Col xs={6} className="col-right">
            <QuizScore quiz={quiz} disease={disease} />
            <div className="text-right" dangerouslySetInnerHTML={
              {
                __html : t("LAST_SENSOR_SYNC", {
                  count : sensors.length,
                  date  : lastSync ? displayedDate(lastSync, "ll") : t("N_A")
                })
              }
            }/>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default translate("patient-report")(PatientStatus);
