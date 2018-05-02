// operating mode (relates to battery life)
// output air purity (device performance, remote alerting)
// respitory rate (breath quality, info for care teams)
// location services
// diagnostic info
// oxygen saturation

import React from "react";
import moment from "moment-timezone";

import { Grid, Row, Col } from "react-bootstrap";
import Persona from "./Persona";
import DeviceStatus from "./DeviceStatus";
import BatteryIndicator from "./BatteryIndicator";
import LastLocation from "./LastLocation";
import Runtime from "./RunTime";
import DeviceMetrics from "./DeviceMetrics";
import PlanInfo from "./PlanInfo";
import Subtitle from "../../components/Subtitle";
import RoundedBox from "../../components/RoundedBox";

import { checkResponse, extractJSON } from "../../utilities";
import propellerLogo from "../../assets/images/propeller-logo-white.svg";
import resMedLogo from "../../assets/images/ResMed.png";

import "./index.css";

const tzone = moment.tz.guess();
const env = typeof process !== "undefined" && process.env.NODE_ENV;

const style = {
  blockMargin: {
    marginTop: "0.8rem"
  }
};

const TopBar = () => {
  return (
    <Row>
      <Col xs={12} id="top-bar">
        <img src={propellerLogo} alt="Propeller Health Logo" height="70" />
        <img className="pull-right" src={resMedLogo} alt="ResMed Logo" height="180" />
      </Col>
    </Row>
  );
};

const POC = ({ timestamp, ...rest }) => {
  return (
    <RoundedBox>
      <h4>Portable Oxygen Concentrator</h4>
      {timestamp ? <POCContent timestamp={timestamp} {...rest} /> : "Loading..."}
    </RoundedBox>
  );
};

const POCContent = ({
  batt_volt = 0,
  charging = 0,
  runtime,
  timestamp,
  lat,
  lon,
  powered,
  running,
  temp,
  disconnected = false
}) => {
  return (
    // 32.825720 / -117.133553

    <div>
      <DeviceStatus powered={powered} running={running} disconnected={disconnected} />
      <Row style={style.blockMargin}>
        <Col xs={6}>
          <BatteryIndicator voltage={batt_volt} charging={charging} disconnected={disconnected} />
        </Col>
        <Col xs={6}>
          <Runtime time={runtime} />
        </Col>
        <Col xs={12} style={style.blockMargin}>

          <LastLocation lat={lat} lng={lon} temp={temp} />
        </Col>
        <Col xs={12} style={style.blockMargin}>
          <Subtitle>
            {timestamp &&
              `As of ${moment(timestamp * 1000)
                .tz(tzone)
                .format("lll")}`}
          </Subtitle>
        </Col>
      </Row>
    </div>
  );
};

class ResmedDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data         : props.data? [ props.data ] : [],
      disconnected : false
    };

    this.queryData = this.queryData.bind(this);
  }

  // API_URL = "http://test.wyzgyz.com/resmed/";
  API_URL = "development"  === env ? "http://test.wyzgyz.com/resmed/" : "/api/resmed-data";

  /**
   * timestamp: utc seconds
   * state: raw data
   * lat:
   * lon:
   * powered: 1 or 0
   * running: 1 or 0, actively pumping
   * charging: 1 or 0
   * runtime: seconds operating
   * batt: voltage
   * temp: celsius
   * batt_volt: voltage
   */

  queryData() {
    fetch(this.API_URL)
      .then(checkResponse)
      .then(extractJSON)
      .then(data => {
        const secondsNow = Number.parseInt(Date.now().toString().slice(0, -3), 10);
        const seconds    = Number.parseInt(data.timestamp, 10);
        const last       = this.state.data[0];
        const disconnect = secondsNow - seconds > 60;
        const updates    = {};

        if (this.state.disconnected !== disconnect) {
          updates.disconnected = disconnect;
        }

        if (!last || last.timestamp !== data.timestamp) {
          updates.data = [data].concat(this.state.data);
        }

        this.setState(updates);
      });
  }

  componentDidMount() {
    window.setInterval(this.queryData, 2000);
    document.documentElement.classList.add("resmed-demo");
    moment.locale("en-US");
  }

  render() {
    const { data = [], disconnected } = this.state;
    const [currentData = {}] = data;

    return (
      <Grid componentClass="section" id="resmed-demo" fluid>
        <TopBar />
        <main>
          <Row>
            <Col xs={12} sm={8}>
              <Persona />
              <Row>
                <Col xs={12}>
                  <DeviceMetrics {...currentData} />
                </Col>
                <Col xs={12}>
                  <PlanInfo />
                </Col>
              </Row>
            </Col>

            <Col xs={12} sm={4}>
              <POC {...currentData} disconnected={disconnected} />
            </Col>
          </Row>
        </main>
      </Grid>
    );
  }
}

export default ResmedDemo;
