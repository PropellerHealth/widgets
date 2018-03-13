import React from "react";
import moment from "moment";
import { translate } from "react-i18next";
import { Row, Col } from "react-bootstrap";
import GreyText from "./GreyText";
import Hr from "./Hr";

import { COLORS } from "../../utilities";

const displayedDate = (date, fmt = "L") => moment(date).format(fmt);

const PatientInfo = function PatientInfo({
  givenName,
  familyName,
  disease,
  age,
  birthDate,
  sync,
  plan,
  followers,
  rescueMeds,
  controllerMeds,
  t
}) {
  const careTeam = followers
    .filter(f => "physician" === f.role)
    .map(f => `${f.givenName} ${f.familyName}`);

  // console.log(controllerMeds);
  // console.log(moment);
  // const rx = /[-/\s]/;
  // m = birthDate.match(rx)
  //

  const controllerSchedule = usageList => {
    if (!usageList || usageList.length === 0) {
      return t("AS_NEEDED");
    }

    const puffs = usageList[0].doses;
    const times = usageList.map(u =>
      moment()
        .hour(u.hour)
        .minute(u.minute)
        .format("LT")
    );
    const schedule =
      times.length === 0
        ? t("TAKEN_AS_NEEDED")
        : t("SCHEDULED_DAILY_AT", {times: times.join(", ")});

    return `${t("NUM_INHALATION", {number: puffs})}, ${schedule}`;
  };

  return (
    <div>
      <Row>
        <Col xs={12}>
          <h2
            style={{
              margin: "1rem 0",
              fontSize: "2.8rem",
              color: COLORS.darkGrey
            }}
          >
            <strong>
              {givenName} {familyName}
            </strong>{" "}
            <GreyText style={{ padding: "0 0.7rem" }}>|</GreyText> {age},{" "}
            {displayedDate(birthDate)}, {t(disease.toUpperCase())}
          </h2>
        </Col>
      </Row>
      <Hr />
      <Row>
        <Col xs={6}>
          <GreyText>{t("CARE_TEAM")}:</GreyText> <strong>{careTeam.join(", ")}</strong>
        </Col>
        <Col xs={6} className="text-right">
          <GreyText>{t("LAST_SENSOR_SYNC")}:</GreyText>{" "}
          <strong>{displayedDate(sync.last, "ll")}</strong>
        </Col>
      </Row>
      <Hr />
      <Row>
        <Col xs={6}>
          <GreyText>{t("CURRENT_RESCUE_MEDICATION")}:</GreyText>
          <br />
          {rescueMeds[0] && <strong>{rescueMeds[0].medication.name}</strong>}
        </Col>
        <Col xs={6}>
          <GreyText>{t("CURRENT_CONTROLLER_MEDICATION")}:</GreyText>
          {controllerMeds.map((m, i) => (
            <div key={`controller-med-${i}`}>
              <strong>{m.medication.name}</strong>
              <br />
              {controllerSchedule(m.usageList)}
            </div>
          ))}
        </Col>
      </Row>
      <Hr />
    </div>
  );
};

export default translate("patient-report")(PatientInfo);
