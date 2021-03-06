import React from "react";
import { translate } from "react-i18next";
import { Row, Col } from "react-bootstrap";
import RoundedBox from "../../components/RoundedBox";
import MetricScore from "../../components/MetricScore";
import Subtitle from "../../components/Subtitle";

const asPercent = (num, den) => Math.round(100 * num / den);

const AsthmaStatus = ({ totalDays, controlStatus, rescueNights, t}) => {
  return (
    <Row>
      <Col xs={12}>
        <RoundedBox color="red">
          <h4>
            <strong>{t("ASTHMA_CONTROL_STATUS")}</strong>
          </h4>
          <div style={{fontSize: "16px"}}>
            {t("WELL_CONTROLLED")}:{" "}
            <MetricScore>
              {asPercent(controlStatus.good, totalDays)}%
            </MetricScore>
            <br />
            {t("NOT_WELL_CONTROLLED")}:{" "}
            <MetricScore>
              {asPercent(controlStatus.fair, totalDays)}%
            </MetricScore>
            <br />
            {t("VERY_POORLY_CONTROLLED")}:{" "}
            <MetricScore>
              {asPercent(controlStatus.poor, totalDays)}%
            </MetricScore>
          </div>
        </RoundedBox>
      </Col>
      <Col xs={12}>
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
    </Row>
  );
};

export default translate("patient-report")(AsthmaStatus);
