import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { scaleTime, scaleBand } from "d3-scale";
import { isoParse, timeFormat } from "d3-time-format";
import moment from "moment";
import BarChart from "../../components/BarChart";
import AreaChart from "../../components/AreaChart";
import Loading from "../../components/Loading";
import logo from "../../assets/images/logo.svg";
import { checkResponse, extractJSON, objectFromQueryString } from "../../utilities";

const COLORS = {
  blue     : "#20C3F3",
  purple   : "#6b1671",
  green    : "green",
  deepRed  : "#D70000",
  red      : "#EE0037",
  yellow   : "yellow",
  orange   : "#FF7500",
  grey     : "#888B8D",
  darkGrey : "#333"
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
        margin: "2rem 2rem",
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
      style={{
        margin: "1.5rem 0",
        color: COLORS.blue,
        borderColor: COLORS.blue
      }}
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
          <h1
            className="text-right"
            style={{
              color: COLORS.darkGrey,
              fontSize: "2.5rem",
              lineHeight: "5rem",
              display: "inline-block",
              textAlign: "right",
              width: "100%",
              verticalAlign: "bottom"
            }}>
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
  followers,
  rescueMeds,
  controllerMeds
}) => {
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
      return "As needed"
    }

    const puffs = usageList[0].doses;
    const times = usageList.map(
      u => moment().hour(u.hour).minute(u.minute).format("h:mma")
    );
    const scheduled = times.length === 0
      ? "taken as needed"
      : ` scheduled daily at ${times.join(", ")}`;

    return `${puffs} inhalation BID, ${scheduled}.`;
  }

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
            <GreyText style={{padding: "0 0.7rem"}}>|</GreyText> {age}, {displayedDate(birthDate)}, {disease}
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

const GraphTitle = ({ title, medications = [], legend }) => {

  const colWidth = legend ? 6 : 12
  const medNames = medications.map(m => m.medication.shortName).join(", ");
  const medName  = medNames && (<span>(<strong>{medNames}</strong>)</span>);

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
  return (
    <span
      style={Object.assign(
        {},
        {fontWeight: "bold", fontSize: "2rem", lineHeight: "2rem"},
        style)
      }
      {...rest}
    />
  );
}

const PatientStatus = ({ controlStatus, rescue, controllerAvg=0 }) => {
  const nights = rescue.filter(r => r.values.eventsRescueNight > 0).length;
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
                  <MetricScore>{controlStatus.good} days</MetricScore>
                  <br />
                  Not Well Controlled:{" "}
                  <MetricScore>{controlStatus.fair} days</MetricScore>
                  <br />
                  Poorly Controlled:{" "}
                  <MetricScore>{controlStatus.poor} days</MetricScore>
                </RoundedBox>
              </Col>
            </Row>
            <Row>
              <Col xs={6} style={{paddingRight: "8px"}}>
                <RoundedBox color="orange">
                  Controller adherence:
                  <br />
                  <MetricScore>{controllerAvg}%</MetricScore>
                </RoundedBox>
              </Col>
              <Col xs={6} style={{paddingLeft: "8px"}}>
                <RoundedBox color="purple">
                  Nighttime rescue usage:
                  <br />
                  <MetricScore>{nights} nights</MetricScore>
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

const RescueMedicationChart = ({ data, medications, title, ...rest }) => {
  return (
    <BarChart xLabel="Days" yLabel="Puffs" data={data} {...rest} >
      <GraphTitle
        title={title}
        medications={medications}
        legend={
          <div className="text-right" style={{fontSize: "1.5rem", lineHeight: "3.2rem"}}>
            <div style={{display: "inline-block"}}>
              <span
                style={{
                  color: COLORS.red,
                  fontSize: "2.7rem",
                  verticalAlign: "bottom",
                  fontWeight: "bold"
                }}
              >!</span> = Notification sent for change in control status
            </div>
            <div style={{display: "inline-block", paddingLeft: "3rem"}}>
              <span style={{color: COLORS.deepRed, fontSize: "2.2rem", verticalAlign: "bottom"}}>●</span> <strong>Nighttime</strong>
            </div>
          </div>}
      />
    </BarChart>
  );
};

const ControllerMedicationChart = ({ data, medications, title, ...rest }) => {
  return (
    <AreaChart data={data} {...rest} >
      <GraphTitle
        title={title}
        medications={medications}
      />
    </AreaChart>
  );
};

const MedicationUsage = ({ controller, rescue, range, rescueMeds = [], controllerMeds = [], transitionAlerts, ...rest }) => {
  const width  = 1090;
  const height = 240;
  const margin = { top: 10, right: 35, bottom: 30, left: 60 };
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

  const alerts = transitionAlerts.map(a => new Date(a).toISOString());

  const rescueData = rescue.map(r => {
    r.date = new Date(r.date);
    r.alert = alerts.indexOf(r.date.toISOString()) > -1;
    return r;
  });

  return (
    <div style={{margin: "2rem 0"}}>
      <SectionHeader text="Medication usage for the last" tab="30 Days" />
      <RescueMedicationChart
        data={rescueData}
        width={width}
        height={height}
        margin={margin}
        graphHeight={graphHeight}
        graphWidth={graphWidth}
        xScale={xScale}
        xWidth={xWidth}
        dScale={xScale}
        colors={COLORS}
        medications={rescueMeds}
        title="Rescue Medication Usage"
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
        medications={controllerMeds}
        title="Controller Medication Adherence"
      />
    </div>
  );
};

const PatientSummary = function PatientSummary({
  range,
  patient,
  rescue,
  controller = [],
  controlStatus,
  transitionAlerts
}) {
  const _controller = controller
    .map(d => frozenCopy({}, d, { date: new Date(d.date) }))
    .sort(sortDates)
    .reduce((arr, d) => arr.concat(incrementToDays(d, 7)), []);

  const meds           = patient.plan.medications || [];
  const controllerMeds = meds.filter(m => "controller" === m.medication.type);
  const rescueMeds     = meds.filter(m => "rescue" === m.medication.type);
  const controllerAvg  = Math.floor(_controller.reduce((tot, item) => tot + item.values.adherencePercent ,0) / _controller.length);

  return (
    <Page first>
      <Header timeFrame={range} disease={patient.disease} />
      <PatientInfo {...patient} rescueMeds={rescueMeds} controllerMeds={controllerMeds} />
      <PatientStatus rescue={rescue} controlStatus={controlStatus} controller={_controller} controllerAvg={controllerAvg} />
      <MedicationUsage
        rescue={rescue}
        controller={_controller}
        range={range}
        transitionAlerts={transitionAlerts}
        rescueMeds={rescueMeds}
        controllerMeds={controllerMeds}
        controllerAvg={controllerAvg}
      />
    </Page>
  );
};

class PatientReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patient              : props.patient,
      transitionAlertDates : props.transitionAlertDates,
      dailySummary         : props.dailySummary,
      controllerAdherence  : props.controllerAdherence,
      locale               : props.locale
    };
    this.loadData = this.loadData.bind(this);
  }

  loadData() {
    const { API_HOST = "http://localhost:8081", match, location } = this.props;
    const { reportId }    = match.params;
    const { accessToken, host = API_HOST } = objectFromQueryString(location.search);
    const url = `${host}/api/reports/${reportId}/data?accessToken=${accessToken}`;

    window.fetch(url, { headers : { "x-ph-api-version": "3.25.0" } })
      .then(checkResponse)
      .then(extractJSON)
      .then(data => this.setState({ ...data }))
      .catch(console.error);
  }

  componentDidMount() {
    if (!this.state.patient) {
      this.loadData();
    }
  }

  render() {
    const { patient, transitionAlertDates, dailySummary = {}, controllerAdherence = [] } = this.state;

    if (!patient) return <Loading />;

    const { controlStatus = [], rescueUsage = [] } = dailySummary;
    const rescue     = rescueUsage.sort(sortDates);
    const controller = controllerAdherence.sort(sortDates);
    const range = [rescue[0], rescue[rescue.length - 1]]
      .sort(sortDates)
      .map(m => m.date);

    return (
      <PatientSummary
        range={range}
        patient={patient}
        rescue={rescue}
        controller={controller}
        controlStatus={controlStatus}
        transitionAlerts={transitionAlertDates}
      />
    );
  }
}

export default PatientReport;
