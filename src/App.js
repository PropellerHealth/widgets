import React from 'react';
// import logo from './logo.svg';
// import './App.css';

if (typeof window === 'undefined') {
  global.window = {}
}

const PROPELLER_API = "https://open.propellerhealth.com/prod/forecast";
const GOOGLE_KEY    = "AIzaSyBlk7LNk5oUhQ72IZ9N_b-SjqnPiSK0l0I";
const GOOGLE_API    = "https://maps.googleapis.com/maps/api/geocode/json";

const STATUS = {
  low    : "Good",
  medium : "Fair",
  high   : "Poor"
};

const STATUS_TEXT = {
  high: "Your AIR report is <strong>poor</strong>. People with asthma may experience asthma symptoms today so be sure to take extra precautions, like keeping your rescue inhaler handy.",
  medium: "Your AIR report is <strong>fair</strong>. Sensitive asthma sufferers may experience asthma symptoms today and should take extra precautions, like keeping your rescue inhaler handy.",
  low: "Your AIR report is <strong>good</strong>. Your environment isn’t likely to cause any asthma symptoms today but be sure to keep your rescue inhaler handy in case of emergencies."
};

const checkResponse = response => response.ok ? response : Promise.reject(response);
const extractJSON   = response => response.json();

const styles = {
  outerBar: {
    width: "100%",
    height: "50px",
    lineHeight: "50px",
    textAlign: "center"
  },
  innerBar: {
    position: "relative",
    float: "left",
    width: "33.333%",
    height: "100%",
    color: "white",
    boxSizing: "border-box",
    transition: "opacity 1s"
  },
  span: {
    verticalAlign: "center"
  }
};

const AsthmaScoreBar = props => {
  const { status } = props;
  return (
    <div
      className={`status-bar ${status}`}
      style={styles.outerBar}
    >
      <div
        className="status-good"
        style={Object.assign({backgroundColor : "rgb(141,198,65)", borderRadius: "5px 0 0 5px", opacity: `${status === "low" ? 1 : "0.5"}`}, styles.innerBar)}
      >
        <span style={Object.assign({opacity: `${status === "low" ? 1 : "0.5"}`}, styles.span)}>Good</span>
      </div>
      <div
        className="status-fair"
        style={Object.assign({backgroundColor : "rgb(247,146,38)", borderLeft: "2px solid white", borderRight: "2px solid white", opacity: `${status === "medium" ? 1 : "0.5"}`}, styles.innerBar)}
      >
        <span style={
          Object.assign({
            opacity: `${status === "medium" ? 1 : "0.5"}`
          }, styles.span)}>Fair</span>
      </div>
      <div
        className="status-poor"
        style={
          Object.assign({
            backgroundColor: "rgb(226,26,80)",
            borderRadius: "0 5px 5px 0",
            opacity: `${status === "high" ? 1 : "0.5"}`
          }, styles.innerBar)
        }
      >
        <span style={Object.assign({opacity: `${status === "high" ? 1 : "0.5"}`}, styles.span)}>Poor</span>
      </div>
    </div>
  );
};

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      status       : undefined,
      score        : undefined,
      location     : props.location,
      hasGeolocate : window.navigator && "geolocation" in window.navigator,
      latitude     : props.latitude,
      longitude    : props.longitude
    };
  }

  componentDidMount() {
    if (this.state.latitude && this.state.longitude) {
      window.fetch(`${PROPELLER_API}?latitude=${this.state.latitude}&longitude=${this.state.longitude}`)
        .then(checkResponse)
        .then(extractJSON)
        .then(data => {
          this.setState({
            score: data.properties.value,
            status: data.properties.code.toLowerCase()
          });
        })
        .catch(console.error);
    }

    if (this.state.hasGeolocate) {
      window.navigator.geolocation.getCurrentPosition(loc => {
        const { latitude, longitude} = loc.coords;

        window.fetch(`${PROPELLER_API}?latitude=${latitude}&longitude=${longitude}`)
          .then(checkResponse)
          .then(extractJSON)
          .then(data => {
            this.setState({
              score: data.properties.value,
              status: data.properties.code.toLowerCase()
            });
          })
          .catch(console.error);

        window.fetch(`${GOOGLE_API}?latlng=${latitude},${longitude}&location_type=APPROXIMATE&result_type=locality|administrative_area_level_3&key=${GOOGLE_KEY}`)
          .then(checkResponse)
          .then(extractJSON)
          .then(data => {
            if (data.results.length > 0) {
              this.setState({
                location: data.results[0].formatted_address
              });
            }
          });
      });
    }
  }

  render() {
    return (
      <div>
        <h2>Asthma Conditions</h2>
        <div>
          {this.state.location}
          <br/>
          <AsthmaScoreBar score={this.state.score} status={this.state.status} />
          <div
            className="ph-status-explanation"
            dangerouslySetInnerHTML={{__html: STATUS_TEXT[this.state.status]}}
          />
          <div>
            To learn more about Air by Propeller, visit our site <a href="https://www.propellerhealth.com" target="_blank">here</a>.
          </div>
        </div>
      </div>
    );
  }
}

export default App;
