import React from "react";
// import logo from './logo.svg';
import "./style.css";

if (typeof window === "undefined") {
  global.window = {};
}

const GOOGLE_KEY       = "AIzaSyBlk7LNk5oUhQ72IZ9N_b-SjqnPiSK0l0I";
const GOOGLE_API       = "https://maps.googleapis.com/maps/api/geocode/json";
const PROPELLER_API    = "https://open.propellerhealth.com/prod/forecast";
const PROPELLER_SIGNUP = "https://forecast-subscription.appspot.com/subscribe";
const STATUS_MAP = {
  low: "good",
  medium: "fair",
  high: "poor"
};

const STATUS_TEXT = {
  high:
    "Your AIR report is <strong>poor</strong>. People with asthma may experience asthma symptoms today so be sure to take extra precautions, like keeping your rescue inhaler handy.",
  medium:
    "Your AIR report is <strong>fair</strong>. Sensitive asthma sufferers may experience asthma symptoms today and should take extra precautions, like keeping your rescue inhaler handy.",
  low:
    "Your AIR report is <strong>good</strong>. Your environment isn’t likely to cause any asthma symptoms today but be sure to keep your rescue inhaler handy in case of emergencies."
};

const checkResponse = response => response.ok ? response : Promise.reject(response);
const extractJSON   = response => response.json();

const AsthmaScoreBar = props => {
  const { status } = props;
  return (
    <div className={`status-bar status-${STATUS_MAP[status]}`}>
      <div className="status-section good">
        <span>Good</span>
      </div>
      <div className="status-section fair" >
        <span>Fair</span>
      </div>
      <div className="status-section poor">
        <span>Poor</span>
      </div>
    </div>
  );
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status           : undefined,
      score            : undefined,
      forecastLocation : props.forecastLocation,
      hasGeolocate     : window.navigator && "geolocation" in window.navigator,
      latitude         : props.latitude,
      longitude        : props.longitude
    };
    this.loadConditions = this.loadConditions.bind(this);
  }

  loadConditions(lat,lng){
    window
      .fetch(`${PROPELLER_API}?latitude=${lat}&longitude=${lng}`)
      .then(checkResponse)
      .then(extractJSON)
      .then(data => {
        console.log(data);
        this.setState({
          score  : data.properties.value,
          status : data.properties.code.toLowerCase()
        });
      })
      .catch(console.error);
  }

  componentDidMount() {
    const { state } = this;
    console.log(state);
    if (state.latitude && state.longitude) {
      this.loadConditions(state.latitude, state.longitude);
    } else {
      if (state.hasGeolocate) {
        window.navigator.geolocation.getCurrentPosition(loc => {
          const { latitude, longitude } = loc.coords;
          this.loadConditions(latitude, longitude);
          window
            .fetch(
              `${GOOGLE_API}?latlng=${latitude},${longitude}&location_type=APPROXIMATE&result_type=locality|administrative_area_level_3&key=${GOOGLE_KEY}`
            )
            .then(checkResponse)
            .then(extractJSON)
            .then(data => {
              if (data.results.length > 0) {
                this.setState({
                  forecastLocation: data.results[0].formatted_address
                });
              }
            });
        });
      }
    }
  }

  render() {
    return (
      <div className="text-center">
        <h2>Asthma Conditions</h2>
        <div>
          {this.state.forecastLocation}
          <br />
          <AsthmaScoreBar score={this.state.score} status={this.state.status} />
          <div
            className="ph-status-explanation"
            dangerouslySetInnerHTML={{ __html: STATUS_TEXT[this.state.status] }}
          />
          <div>
            To learn more about Air by Propeller, visit our site{" "}
            <a
              href="https://www.propellerhealth.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>.
          </div>
        </div>
      </div>
    );
  }
}

export default App;
