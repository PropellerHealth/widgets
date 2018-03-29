import React from "react";
import { translate } from "react-i18next";
import { Row, Col } from "react-bootstrap";
import RoundedBox from "../../components/RoundedBox";
import MetricScore from "../../components/MetricScore";
import Subtitle from "../../components/Subtitle";

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
              {t("NUM_DAY", { count: controlStatus.good })}
            </MetricScore>
            <br />
            {t("NOT_WELL_CONTROLLED")}:{" "}
            <MetricScore>
              {t("NUM_DAY", { count: controlStatus.fair })}
            </MetricScore>
            <br />
            {t("VERY_POORLY_CONTROLLED")}:{" "}
            <MetricScore>
              {t("NUM_DAY", { count: controlStatus.poor })}
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
              {t("LAST_NUM_DAYS", { number: totalDays }).toLowerCase()}
            </Subtitle>
          </h4>
          <MetricScore>{t("NUM_NIGHT", { count: rescueNights })}</MetricScore>
        </RoundedBox>
      </Col>
    </Row>
  );
};

export default translate("patient-report")(AsthmaStatus);
