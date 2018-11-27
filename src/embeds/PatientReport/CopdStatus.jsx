import React from "react";
import { translate } from "react-i18next";
import { Row, Col } from "react-bootstrap";
import RoundedBox from "../../components/RoundedBox";
import MetricScore from "../../components/MetricScore";
import Subtitle from "../../components/Subtitle";

import { precisionRound, displayedDate } from "../../utilities";

const CopdStatus = ({ days, rescueNights, t }) => {
  const lastDay          = days[days.length - 1];
  const baseline30Days   = lastDay.rescue.baseline;
  const baseline24Hours  = lastDay.rescue.baseline24Hour || 0;
  const lastSevenDays    = days.slice(days.length - 7);
  const totalEvents7Days = lastSevenDays.reduce(
    (tot, day) => tot + day.rescue.totalEvents,
    0
  );

  return (
    <Row>
      <Col xs={12}>
        <RoundedBox color="red">
          <h4>
            <strong>
              {t("RESCUE_USE_TOTAL", { count: totalEvents7Days })}
            </strong>{" "}
            <br />
            <Subtitle>
              {t("LAST_NUM_DAYS", { number: 7 }).toLowerCase()}{" "}
              ({ displayedDate(lastSevenDays[0].date, "ll") } - { displayedDate(lastSevenDays[lastSevenDays.length - 1].date, "ll") })
            </Subtitle>
          </h4>
          <div>
            <ol className="rescue-last-seven">
              {lastSevenDays.map((day, i) => {
                const events   = day.rescue.totalEvents;
                const dayClass = events > 5 // day.rescue.baseline ???
                  ? "alert"
                  : events > 0
                    ? "warn"
                    : "";
                return (
                  <li
                    key={`rescue-day-${i}`}
                    className="rescue-day text-center"
                  >
                    <div
                      className={`rescue-day-count ${dayClass}`}
                    >
                      {events}
                    </div>
                    <div className="rescue-day-date">
                      {displayedDate(day.date, "ddd").toUpperCase()}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </RoundedBox>
      </Col>
      <Col xs={6} className="col-left">
        <RoundedBox color="purple">
          <h4>
            <strong>{t("NIGHTTIME_RESUCE_USE")}</strong>
            <br />
            <Subtitle>
              {t("LAST_NUM_DAYS", { number: 30 }).toLowerCase()}
            </Subtitle>
          </h4>
          <MetricScore>{t("NUM_NIGHT", { count: rescueNights })}</MetricScore>
        </RoundedBox>
      </Col>
      <Col xs={6} className="col-right">
        <RoundedBox color="orange">
          <h4>
            <strong>{t("RESCUE_BASELINE")}</strong>
          </h4>
          <div style={{display: "inline-block"}}>
            <MetricScore>
              {precisionRound(baseline30Days, 2)}
            </MetricScore>
            <br />
            <Subtitle>
              {t("LAST_NUM_DAYS", { number: 30 }).toLowerCase()}
            </Subtitle>
          </div>
          <div className="text-center" style={{display: "inline-block", padding: "0 0.5rem"}}>
            <MetricScore>→</MetricScore>
            <br />
            <Subtitle>→</Subtitle>
          </div>
          <div style={{display: "inline-block"}}>
            <MetricScore>
              {precisionRound(baseline24Hours, 2)}
            </MetricScore>
            <br />
            <Subtitle>
              {t("LAST_NUM_DAYS", { number: 2 }).toLowerCase()}
            </Subtitle>
          </div>
        </RoundedBox>
      </Col>
    </Row>
  );
};

export default translate("patient-report")(CopdStatus);
