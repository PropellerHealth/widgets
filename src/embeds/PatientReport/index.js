import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { scaleTime, scaleBand } from "d3-scale";
import { isoParse, timeFormat } from "d3-time-format";
import moment from "moment";
import BarChart from "../../components/BarChart";
import AreaChart from "../../components/AreaChart";
import logo from "../../assets/images/logo.svg";

const COLORS = {
  blue   : "#20C3F3",
  purple : "#6b1671",
  green  : "green",
  deepRed: "#D70000",
  red    : "#EE0037",
  yellow : "yellow",
  orange : "#FF7500",
  grey   : "#888B8D"
};

const PATIENT = {
  id: "59e8d27bd61e10001c903142",
  age: 26,
  birthDate: "1991-06-03",
  createdDate: "2017-09-19T05:00:00.000Z",
  disease: "asthma",
  email: "ryan.gilles+armythreey@propellerhealth.com",
  familyName: "Threey",
  followers: [
    {
      id: "596fa767aef883073121222b",
      accessLevel: "modify",
      givenName: "Marc",
      familyName: "Brakken",
      role: "physician"
    }
  ],
  givenName: "Army",
  group: {
    id: "58e3e66c71893b190740a6a5",
    name: "meb-dev-1",
    displayName: "MEB-Devv"
  },
  language: "en-US",
  mailingAddress: {
    street: "634 W Main St",
    street2: "102",
    city: "Madison",
    postalCode: "53703",
    country: "ES",
    latitude: 43.0674874,
    longitude: -89.39268849999999
  },
  medicalIds: [
    { key: "study_arm_id", value: "arm-3" },
    { key: "test_key", value: "asdf" }
  ],
  membership: "premium",
  notifications: {
    digest: { email: true },
    notes: { email: true, push: true, sms: false },
    quietSensor: { email: true, push: true, sms: false },
    actInvite: { email: false, push: true, sms: false },
    missedDose: { email: false, push: true, sms: false },
    rescueUsage: { email: false, push: false, sms: false },
    transition: { email: true, push: true, sms: false }
  },
  plan: {
    medications: [
      {
        medication: {
          id: "es_ventolin",
          diseases: ["asthma", "copd"],
          formFactor: "mdi",
          name: "Ventolin",
          shortName: "Ventolin",
          type: "rescue",
          sensors: ["ble1"]
        },
        medicationId: "es_ventolin",
        sensors: [],
        usageList: []
      },
      {
        medication: {
          id: "es_relvar_ellipta",
          diseases: ["asthma"],
          formFactor: "ellipta",
          name: "Relvar Ellipta",
          shortName: "Relvar Ellipta",
          type: "controller",
          sensors: ["stingray"]
        },
        medicationId: "es_relvar_ellipta",
        sensors: [],
        usageList: [{ doses: 1, hour: 9, minute: 0 }]
      }
    ]
  },
  role: "patient",
  score: { code: "good", type: "naeep" },
  sync: {
    first: "2017-10-19T18:46:01.484Z",
    firstController: "2017-10-19T18:46:01.484Z",
    firstRescue: "2017-10-19T18:46:37.537Z",
    last: "2017-10-19T18:46:42.384Z",
    lastController: "2017-10-19T18:46:01.484Z",
    lastRescue: "2017-10-19T18:46:42.384Z"
  },
  event: {
    first: "2017-10-19T18:45:56.000Z",
    firstController: "2017-10-19T18:45:56.000Z",
    firstRescue: "2017-10-19T18:46:06.000Z",
    last: "2017-10-19T18:46:06.000Z",
    lastController: "2017-10-19T18:45:56.000Z",
    lastRescue: "2017-10-19T18:46:06.000Z"
  },
  timeZone: "America/Chicago"
};

const CONTROLLER_ADHERENCE = [
  { date: "2017-11-27T00:00:00.000-06:00", values: { adherencePercent: 25 } },
  { date: "2017-11-20T00:00:00.000-06:00", values: { adherencePercent: 10 } },
  { date: "2017-11-13T00:00:00.000-06:00", values: { adherencePercent: 10 } },
  { date: "2017-11-06T00:00:00.000-06:00", values: { adherencePercent: 5 } },
  { date: "2017-10-30T00:00:00.000-05:00", values: { adherencePercent: 0 } }
];

const CONTROLLER_USE = [
  {
    date: "2017-11-30T00:00:00.000-06:00",
    values: { eventsControllerAdministered: 2, eventsControllerPrescribed: 3 }
  },
  {
    date: "2017-11-29T00:00:00.000-06:00",
    values: { eventsControllerAdministered: 0, eventsControllerPrescribed: 3 }
  },
  {
    date: "2017-11-28T00:00:00.000-06:00",
    values: { eventsControllerAdministered: 0, eventsControllerPrescribed: 3 }
  },
  {
    date: "2017-11-27T00:00:00.000-06:00",
    values: { eventsControllerAdministered: 1, eventsControllerPrescribed: 3 }
  },
  {
    date: "2017-11-26T00:00:00.000-06:00",
    values: { eventsControllerAdministered: 0, eventsControllerPrescribed: 3 }
  },
  {
    date: "2017-11-25T00:00:00.000-06:00",
    values: { eventsControllerAdministered: 0, eventsControllerPrescribed: 3 }
  },
  {
    date: "2017-11-24T00:00:00.000-06:00",
    values: { eventsControllerAdministered: 0, eventsControllerPrescribed: 3 }
  },
  {
    date: "2017-11-23T00:00:00.000-06:00",
    values: { eventsControllerAdministered: 0, eventsControllerPrescribed: 3 }
  },
  {
    date: "2017-11-22T00:00:00.000-06:00",
    values: { eventsControllerAdministered: 1, eventsControllerPrescribed: 3 }
  },
  {
    date: "2017-11-21T00:00:00.000-06:00",
    values: { eventsControllerAdministered: 0, eventsControllerPrescribed: 3 }
  },
  {
    date: "2017-11-20T00:00:00.000-06:00",
    values: { eventsControllerAdministered: 1, eventsControllerPrescribed: 3 }
  },
  {
    date: "2017-11-19T00:00:00.000-06:00",
    values: { eventsControllerAdministered: 0, eventsControllerPrescribed: 3 }
  },
  {
    date: "2017-11-18T00:00:00.000-06:00",
    values: { eventsControllerAdministered: 0, eventsControllerPrescribed: 3 }
  },
  {
    date: "2017-11-17T00:00:00.000-06:00",
    values: { eventsControllerAdministered: 0, eventsControllerPrescribed: 3 }
  },
  {
    date: "2017-11-16T00:00:00.000-06:00",
    values: { eventsControllerAdministered: 0, eventsControllerPrescribed: 3 }
  },
  {
    date: "2017-11-15T00:00:00.000-06:00",
    values: { eventsControllerAdministered: 1, eventsControllerPrescribed: 3 }
  },
  {
    date: "2017-11-14T00:00:00.000-06:00",
    values: { eventsControllerAdministered: 1, eventsControllerPrescribed: 3 }
  },
  {
    date: "2017-11-13T00:00:00.000-06:00",
    values: { eventsControllerAdministered: 0, eventsControllerPrescribed: 3 }
  },
  {
    date: "2017-11-12T00:00:00.000-06:00",
    values: { eventsControllerAdministered: 0, eventsControllerPrescribed: 3 }
  },
  {
    date: "2017-11-11T00:00:00.000-06:00",
    values: { eventsControllerAdministered: 1, eventsControllerPrescribed: 3 }
  }
];

const DATA = {
  rescue: [
    {
      date: "2017-11-30T00:00:00.000-06:00",
      values: { eventsRescue: 2, eventsRescueNight: 0 }
    },
    {
      date: "2017-11-29T00:00:00.000-06:00",
      values: { eventsRescue: 0, eventsRescueNight: 0 }
    },
    {
      date: "2017-11-28T00:00:00.000-06:00",
      values: { eventsRescue: 1, eventsRescueNight: 0 }
    },
    {
      date: "2017-11-27T00:00:00.000-06:00",
      values: { eventsRescue: 0, eventsRescueNight: 0 }
    },
    {
      date: "2017-11-26T00:00:00.000-06:00",
      values: { eventsRescue: 0, eventsRescueNight: 0 }
    },
    {
      date: "2017-11-25T00:00:00.000-06:00",
      values: { eventsRescue: 0, eventsRescueNight: 0 }
    },
    {
      date: "2017-11-24T00:00:00.000-06:00",
      values: { eventsRescue: 0, eventsRescueNight: 0 }
    },
    {
      date: "2017-11-23T00:00:00.000-06:00",
      values: { eventsRescue: 0, eventsRescueNight: 0 }
    },
    {
      date: "2017-11-22T00:00:00.000-06:00",
      values: { eventsRescue: 0, eventsRescueNight: 0 }
    },
    {
      date: "2017-11-21T00:00:00.000-06:00",
      values: { eventsRescue: 0, eventsRescueNight: 0 }
    },
    {
      date: "2017-11-20T00:00:00.000-06:00",
      values: { eventsRescue: 0, eventsRescueNight: 0 }
    },
    {
      date: "2017-11-19T00:00:00.000-06:00",
      values: { eventsRescue: 0, eventsRescueNight: 0 }
    },
    {
      date: "2017-11-18T00:00:00.000-06:00",
      values: { eventsRescue: 0, eventsRescueNight: 0 }
    },
    {
      date: "2017-11-17T00:00:00.000-06:00",
      values: { eventsRescue: 0, eventsRescueNight: 0 }
    },
    {
      date: "2017-11-16T00:00:00.000-06:00",
      values: { eventsRescue: 0, eventsRescueNight: 0 }
    },
    {
      date: "2017-11-15T00:00:00.000-06:00",
      values: { eventsRescue: 0, eventsRescueNight: 0 }
    },
    {
      date: "2017-11-14T00:00:00.000-06:00",
      values: { eventsRescue: 0, eventsRescueNight: 0 }
    },
    {
      date: "2017-11-13T00:00:00.000-06:00",
      values: { eventsRescue: 0, eventsRescueNight: 0 }
    },
    {
      date: "2017-11-12T00:00:00.000-06:00",
      values: { eventsRescue: 0, eventsRescueNight: 0 }
    },
    {
      date: "2017-11-11T00:00:00.000-06:00",
      values: { eventsRescue: 0, eventsRescueNight: 0 }
    }
  ],
  controller: CONTROLLER_ADHERENCE
};

const incrementToDays = (toCopy, days) => {
  const ary = new Array(days);
  for (let i = 0; i < days; i++) {
    ary[i] = Object.assign({}, toCopy, {
      date: moment(toCopy.date)
        .add(i, "days")
        .toDate()
    });
  }
  return ary;
};

const frozenCopy = (dst, src, ...rest) =>
  Object.freeze(Object.assign(dst, Object.freeze(src), ...rest));

const createTimeScale = (a, b, width) =>
  scaleTime()
    .domain([isoParse(a), isoParse(b)])
    .rangeRound([0, width])
    .clamp(true);

// const createBandScale = (data, width) => scaleBand()
//   .domain(data.map(d => d.date))
//   .rangeRound([0, width])
//   .paddingInner(0.5)

const sortDates = (a, b) => {
  const _a = a.date,
    _b = b.date;
  return _a > _b ? 1 : _a < _b ? -1 : 0;
};

const exists = a => !!a;

const timeFrame = range => {
  const d1 = moment(range[0]);
  const d2 = moment(range[1]);

  if (
    d1.month() === d2.month() ||
    (d2.diff(d1, "months") === 1 && d2.date() === 1)
  ) {
    return d1.format("MMM Y");
  } else {
    return `${d1.format("MMM")}-${d2.format("MMM")} ${d2.format("Y")}`;
  }
};

const displayedDate = (date, fmt = "L") =>
  moment(date).format(fmt);

const Page = props => {
  return (
    <Grid
      style={{
        marginTop: "1rem",
        marginBottom: "1rem",
        pageBreakAfter: "always",
        pageBreakInside: "avoid"
      }}
    >
      {props.children}
    </Grid>
  );
};

const GreyText = ({ style, ...rest }) => {
  return (
    <span style={Object.assign({}, { color: COLORS.grey }, style)} {...rest} />
  );
};

const Hr = () => {
  return (
    <hr
      style={{ margin: "1.5rem 0", color: COLORS.blue, borderColor: COLORS.blue }}
    />
  );
};

const PageHeader = ({ children }) => {
  return (
    <div
      className="text-center"
      style={{
        background: COLORS.blue,
        color: "white",
        padding: "0.5rem 0",
        margin: "1.2rem 0",
        fontSize: "2rem",
        textTransform: "uppercase"
      }}
    >
      <strong>{children}</strong>
    </div>
  );
};

const Header = ({ timeFrame: range, disease = "asthma" }) => {
  return (
    <div>
      <Row>
        <Col xs={6}>
          <img src={logo} alt="Propeller Health" height={80} />
        </Col>
        <Col xs={6} style={{lineHeight: "6rem"}}>
          <h1 className="text-right" style={{ fontSize: "2.5rem", lineHeight: "5rem", display: "inline-block", textAlign: "right", width: "100%", verticalAlign: "bottom" }}>
            {disease.toUpperCase()} HEALTH REPORT -{" "}
            <strong>{timeFrame(range).toUpperCase()}</strong>
          </h1>
        </Col>
      </Row>
      <PageHeader>Summary</PageHeader>
    </div>
  );
};

const PatientInfo = ({
  givenName,
  familyName,
  disease,
  age,
  birthDate,
  sync,
  plan,
  followers
}) => {
  const careTeam = followers
    .filter(f => "physician" === f.role)
    .map(f => `${f.givenName} ${f.familyName}`);

  const meds = plan.medications;
  const controllerMeds = meds.filter(m => "controller" === m.medication.type);
  const rescueMeds = meds.filter(m => "rescue" === m.medication.type);
  // console.log(controllerMeds);
  // console.log(moment);
  // const rx = /[-/\s]/;
  // m = birthDate.match(rx)
  //

  const controllerSchedule = usageList => {
    if (!usageList || usageList.length === 0) {
      return "As needed"
    }

    const puffs = usageList[0].doses;
    const times = usageList.map(u => moment().hour(u.hour).minute(u.minute).format("h:mma"));
    const scheduled = times.length === 0 ? "taken as needed" : ` scheduled daily at ${times.join(", ")}`;

    return `${puffs} inhalation BID, ${scheduled}.`;
  }

  return (
    <div>
      <Row>
        <Col xs={12}>
          <h2
            style={{
              margin: "1rem 0",
              fontSize: "2.8rem"
            }}
          >
            <strong>
              {givenName} {familyName}
            </strong>{" "}
            <GreyText style={{padding: "0 0.7rem"}}>|</GreyText> {age}yo, {displayedDate(birthDate)}, {disease}
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
          {rescueMeds[0] && <strong>rescueMeds[0].medication.name</strong>}
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

const SectionHeader = props => {
  return (
    <Row>
      <Col xs={12}>
        <h3
          style={{
            borderBottom: "3px solid",
            borderColor: COLORS.blue,
            textTransform: "uppercase",
            fontSize: "2rem",
            fontWeight: "bold",
            paddingBottom: "1.2rem",
            lineHeight: "2rem"
          }}
        >
          {props.text}{" "}
          <span
            style={{
              background: COLORS.blue,
              color: "white",
              padding: "0.7rem 1.2rem 1.2rem",
              borderRadius: "10px 10px 0 0",
              margin: "0 0.7rem"
            }}
          >
            {props.tab}
          </span>
        </h3>
      </Col>
    </Row>
  );
};

const RoundedBox = props => {
  return (
    <div
      style={Object.assign(
        {},
        {
          border: "2px solid",
          borderRadius: "15px",
          borderColor: COLORS[props.color],
          boxSizing: "border-box",
          padding: "1.5rem",
          margin: "1rem auto"
        },
        props.style
      )}
    >
      {props.children}
    </div>
  );
};

const GraphTitle = ({ title, medication = {shortName : "MedName"}, legend }) => {

  const colWidth = legend ? 6 : 12
  const medName = medication && (<span>(<strong>{medication.shortName}</strong>)</span>);

  return (
    <Row style={{paddingLeft: "6rem"}}>
      <Col xs={colWidth}>
        <h4 style={{ fontSize: "1.8rem" }}>
          <span style={{textTransform: "uppercase"}}>{title}</span> {medName}
        </h4>
      </Col>
      {legend && <Col xs={colWidth}>{legend}</Col>}
    </Row>
  );
};

const MetricScore = ({ style, ...rest}) => {
  return <span style={Object.assign({}, {fontWeight: "bold", fontSize: "2.4rem", lineHeight: "1.4rem"}, style)} {...rest} />
}

const PatientStatus = props => {
  return (
    <div style={{margin: "2rem 0"}}>
      <SectionHeader text="Patient status for the most recent" tab="30 Days" />
      <div style={{ position: "relative" }}>
        <Row>
          <Col xs={6}>
            <Row>
              <Col xs={12}>
                <RoundedBox color="red">
                  Well Controlled:{" "}
                  <MetricScore>{props.daysWellControlled} days</MetricScore>
                  <br />
                  Not Well Controlled:{" "}
                  <MetricScore>{props.daysNotWellControlled} days</MetricScore>
                  <br />
                  Poorly Controlled:{" "}
                  <MetricScore>{props.daysPoorlyControlled} days</MetricScore>
                </RoundedBox>
              </Col>
            </Row>
            <Row>
              <Col xs={6} style={{paddingRight: "8px"}}>
                <RoundedBox color="orange">
                  Controller adherence:
                  <br />
                  <MetricScore>{props.controllerAdherence}%</MetricScore>
                </RoundedBox>
              </Col>
              <Col xs={6} style={{paddingLeft: "8px"}}>
                <RoundedBox color="purple">
                  Nighttime rescue usage:
                  <br />
                  <MetricScore>{props.nightTimeRescue} nights</MetricScore>
                </RoundedBox>
              </Col>
            </Row>
          </Col>
          <Col
            xs={6}
            style={{
              position: "absolute",
              left: "50%",
              right: 0,
              bottom: 0,
              top: 0
            }}
          >
            <RoundedBox
              color="blue"
              style={{
                position: "absolute",
                bottom: 0,
                top: 0,
                right: 0,
                left: "15px"
              }}
            >
              <span
                style={{
                  position: "absolute",
                  display: "block",
                  width: "50px",
                  height: "50px",
                  background: COLORS.blue,
                  borderRadius: "50%",
                  color: "white",
                  textAlign: "center",
                  lineHeight: "50px",
                  fontSize: "4rem",
                  fontWeight: "bold",
                  right: "-10px",
                  top: "-10px"
                }}
              >
                !
              </span>
              PHYSICIAN EVALUATION:
              <div
                style={{
                  position: "absolute",
                  bottom: "1.7rem",
                  right: "1.2rem",
                  left: "1.2rem"
                }}
              >
                <GreyText>Sign:</GreyText>
                <GreyText
                  style={{
                    borderBottom: "1px solid",
                    position: "absolute",
                    left: "6rem",
                    right: "1.2rem",
                    bottom: "4px"
                  }}
                />
              </div>
            </RoundedBox>
          </Col>
        </Row>
      </div>
    </div>
  );
};

const RescueMedicationChart = ({ data, medication, ...rest }) => {
  const _data = data.map(d => {
    d.date = new Date(d.date);
    return d;
  });

  return (
    <BarChart xLabel="Days" yLabel="Puffs" data={_data} {...rest} >
      <GraphTitle
        title="Rescue Medication Usage Graph"
        medication={medication}
        legend={
          <div className="text-right" style={{fontSize: "1.5rem", lineHeight: "3.2rem"}}>
            <div style={{display: "inline-block"}}>
              <span style={{color: COLORS.red, fontSize: "2.7rem", verticalAlign: "bottom", fontWeight: "bold"}}>!</span> = Notification sent for change in control status
            </div>
            <div style={{display: "inline-block", paddingLeft: "3rem"}}>
              <span style={{color: COLORS.deepRed, fontSize: "2.2rem", verticalAlign: "bottom"}}>●</span> <strong>Nighttime</strong>
            </div>
          </div>}
      />
    </BarChart>
  );
};

const ControllerMedicationChart = ({ data, medication, ...rest }) => {
  const _data = data
    .map(d => frozenCopy({}, d, { date: new Date(d.date) }))
    .sort(sortDates)
    .reduce((arr, d) => arr.concat(incrementToDays(d, 7)), []);

  return (
    <AreaChart data={_data} {...rest} >
      <GraphTitle
        title="Rescue Medication Usage Graph"
        medication={medication}
      />
    </AreaChart>
  );
};

const MedicationUsage = ({ controller, rescue, range, ...rest }) => {
  const width  = 1090;
  const height = 240;
  const margin = { top: 10, right: 10, bottom: 30, left: 60 };
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom - 18;
  const xWidth = graphWidth / rescue.length / 2;

  const areaScale = createTimeScale(
    new Date(range[0]),
    new Date(range[1]),
    graphWidth
  );

  const xScale = createTimeScale(
    new Date(range[0]),
    new Date(range[1]),
    graphWidth - xWidth
  );

  return (
    <div style={{margin: "2rem 0"}}>
      <SectionHeader text="Medication usage for the last" tab="30 Days" />
      <RescueMedicationChart
        data={rescue}
        width={width}
        height={height}
        margin={margin}
        graphHeight={graphHeight}
        graphWidth={graphWidth}
        xScale={xScale}
        xWidth={xWidth}
        dScale={xScale}
        colors={COLORS}
      />
      <ControllerMedicationChart
        data={controller}
        width={width}
        height={height}
        margin={margin}
        graphHeight={graphHeight}
        graphWidth={graphWidth}
        xScale={xScale}
        xWidth={xWidth}
        dScale={areaScale}
        colors={COLORS}
        title="Controller Medication Adherence Graph"
      />
    </div>
  );
};

class PatientReport extends Component {

  componentWillMount() {
    document.body.className = "patient-report"
  }

  render() {
    const { patient = PATIENT, data = DATA } = this.props;
    const _rescue = data.rescue.sort(sortDates);
    const _controller = data.controller.sort(sortDates);

    const _range = [
      _rescue[0],
      _controller[0],
      _rescue[_rescue.length - 1],
      _controller[_controller.length - 1]
    ]
      .filter(exists)
      .sort(sortDates);

    const range = [_range[0].date, _range[_range.length - 1].date];

    return (
      <div>
        <Page first>
          <Header timeFrame={range} disease={patient.disease} />
          <PatientInfo {...patient} />
          <PatientStatus />
          <MedicationUsage
            rescue={_rescue}
            controller={_controller}
            range={range}
          />
        </Page>
      </div>
    );
  }
}

export default PatientReport;
