import React from "react";
import moment from "moment";
import { translate } from "react-i18next";
import { Row, Col } from "react-bootstrap";

import GreyText from "../../components/GreyText";

import { COLORS, displayedDate, capitalize } from "../../utilities";

const controllerSchedule = (usageList, t) => {
  if (!usageList || usageList.length === 0)  return t("AS_NEEDED");

  const doses = usageList[0].doses;
  const times = usageList.map(u =>
    displayedDate(
      moment().hour(u.hour).minute(u.minute),
      "LT"
    )
  );
  const schedule =
    times.length === 0
      ? t("TAKEN_AS_NEEDED")
      : `(${times.join(", ")})`;

  return `${t("NUM_INHALATION", { count: doses })}, ${t("DAY_FREQUENCY", {frequency: times.length})}, ${schedule}`;
};

const PatientInfo = function PatientInfo({ patient, medications, t }) {

  const {
    givenName,
    familyName,
    disease,
    age,
    birthDate
  } = patient;

  const { rescue, controller } = medications;

  return (
    <div>
      <Row>
        <Col xs={12}>
          <h2
            style={{
              margin: "1rem 0 2rem",
              fontSize: "2.8rem",
              color: COLORS.darkGrey
            }}
          >
            <strong>
              {givenName} {familyName}
            </strong>{" "}
            <GreyText style={{ padding: "0 0.7rem" }}>|</GreyText>{" "}
            {t("AGE_YEARS_OLD", { age })}, {displayedDate(birthDate, "ll")}{" "}
            <GreyText style={{ padding: "0 0.7rem" }}>|</GreyText>{" "}
            {capitalize(t(disease.toUpperCase()))}
          </h2>
        </Col>
      </Row>
      <Row>
        {rescue.map((m, i) => (
          <Col xs={4} key={`rescue-med-${i}`}>
            <GreyText>{t("CURRENT_RESCUE_MEDICATION")}:</GreyText>
            <br />
            {<strong>{m.medication.name}</strong>}
          </Col>
        ))}

        {controller.map((m, i) => (
          <Col xs={4} key={`controller-med-${i}`}>
            <div>
              <GreyText>{t("CURRENT_CONTROLLER_MEDICATION")}:</GreyText>
              <br />
              <strong>{m.medication.name}</strong>
              <br />
              {controllerSchedule(m.usageList, t)}
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default translate("patient-report")(PatientInfo);
