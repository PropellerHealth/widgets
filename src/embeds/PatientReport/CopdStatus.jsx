import React from "react";
import { translate } from "react-i18next";
import { Row, Col } from "react-bootstrap";
import RoundedBox from "../../components/RoundedBox";
import MetricScore from "../../components/MetricScore";
import Subtitle from "../../components/Subtitle";

import { precisionRound } from "../../utilities";

const CopdStatus = ({ days, totalDays, rescueNights, t }) => {
  const baseline30Days   = days.slice(days.length - totalDays).reduce((tot, day) => tot + day.rescue.baseline, 0) / totalDays;
  const baseline24Hours  = days[totalDays - 1].rescue.baseline;
  const lastSevenDays    = days.slice(days.length - 7);
  const totalEvents7Days = lastSevenDays.reduce((tot, day) => tot + day.rescue.totalEvents, 0);

  return (
    <Row>
      <Col xs={12}>
        <RoundedBox color="red">
          <h4>
            <strong>{t("RESCUE_USE_TOTAL", { count: totalEvents7Days })}</strong>{" "}
            <br />
            <Subtitle>
              {t("LAST_NUM_DAYS", { number: 7 }).toLowerCase()}
            </Subtitle>
          </h4>
          <div>
            <ol className="rescue-last-seven">
              {lastSevenDays.map((day, i) => {
                let aboveBaseline = day.rescue.totalEvents > day.rescue.baseline;
                return (
                  <li
                    key={`rescue-day-${i}`}
                    className="rescue-day text-center"
                  >
                    <div  className={`rescue-day-count ${aboveBaseline ? "above-baseline" : ""}`}>
                      {day.rescue.totalEvents}
                    </div>
                    <div className="rescue-day-date">
                      {moment(day.date).format("ddd").toUpperCase()}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </RoundedBox>
      </Col>
      <Col xs={6}>
        <RoundedBox color="purple">
          <h4>
            <strong>{t("NIGHTTIME_RESUCE_USE")}</strong>
            <br />
            <Subtitle>
              {t("LAST_NUM_DAYS", { number: totalDays }).toLowerCase()}
            </Subtitle>
          </h4>
          <MetricScore>{t("NUM_NIGHT", { count: rescueNights })}</MetricScore>
        </RoundedBox>
      </Col>
      <Col xs={6}>
        <RoundedBox color="orange">
          <h4>
            <strong>{t("RESCUE_BASELINE")}</strong>
            <br />
            <Subtitle>
              {t("LAST_NUM_DAYS", { number: totalDays }).toLowerCase()} → {t("LAST_NUM_HOURS", { number: 24 }).toLowerCase()}
            </Subtitle>
          </h4>
          <MetricScore>{precisionRound(baseline30Days, 2)} → {precisionRound(baseline24Hours, 2)}</MetricScore>
        </RoundedBox>
      </Col>
    </Row>
  );
};

export default translate("patient-report")(CopdStatus);
