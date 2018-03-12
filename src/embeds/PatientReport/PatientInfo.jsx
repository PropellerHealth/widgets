import React from "react";
import moment from "moment";
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
  controllerMeds
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
      return "As needed";
    }

    const puffs = usageList[0].doses;
    const times = usageList.map(u =>
      moment()
        .hour(u.hour)
        .minute(u.minute)
        .format("h:mma")
    );
    const scheduled =
      times.length === 0
        ? "taken as needed"
        : ` scheduled daily at ${times.join(", ")}`;

    return `${puffs} inhalation BID, ${scheduled}.`;
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
            {displayedDate(birthDate)}, {disease}
          </h2>
        </Col>
      </Row>
      <Hr />
      <Row>
        <Col xs={6}>
          <GreyText>Care Team:</GreyText> <strong>{careTeam.join(", ")}</strong>
        </Col>
        <Col xs={6} className="text-right">
          <GreyText>Last Sensor Sync:</GreyText>{" "}
          <strong>{displayedDate(sync.last, "D MMM YYYY")}</strong>
        </Col>
      </Row>
      <Hr />
      <Row>
        <Col xs={6}>
          <GreyText>Current Rescue Medication:</GreyText>
          <br />
          {rescueMeds[0] && <strong>{rescueMeds[0].medication.name}</strong>}
        </Col>
        <Col xs={6}>
          <GreyText>Current Controller Medication:</GreyText>
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

export default PatientInfo;
