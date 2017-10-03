import React, { Component } from "react";
import CurrentConditions from "./CurrentConditions";
import Signup from "./Signup";
// import logo from './logo.svg';
import "./style.css";

if (typeof window === "undefined") {
  global.window = {};
}

const GOOGLE_KEY = "AIzaSyBlk7LNk5oUhQ72IZ9N_b-SjqnPiSK0l0I";
const GOOGLE_API = "https://maps.googleapis.com/maps/api/geocode/json";
const PROPELLER_API = "https://open.propellerhealth.com/prod/forecast";

const checkResponse = response =>
  response.ok ? response : Promise.reject(response);
const extractJSON = response => response.json();

const containerStyle = {
  width   : "350px",
  height  : "400px",
  position: "relative",
  color   : "#5c5c5c"
};

const cardStyle = {
  width         : "100%",
  height        : "100%",
  position      : "absolute",
  border        : "1px solid #DDD",
  boxSizing     : "border-box",
  WebkitTransformStyle : "preserve-3d",
  MozTransformStyle    : "preserve-3d",
  transformStyle       : "preserve-3d",
  WebkitTransition : "transform 1s",
  MozTransition    : "transform 1s",
  OTransition      : "transform 1s",
  transition       : "transform 1s"
};

const contentStyle = {
  position   : "absolute",
  boxSizing  : "border-box",
  padding    : "0.5rem 1rem",
  top        : "0",
  bottom     : "0",
  left       : "0",
  right      : "0",
  margin     : "0",
  textAlign  : "center",
  background : "#FFF",
  zIndex     : 1,
  WebkitBackfaceVisibility : "hidden",
  MozBackfaceVisibility    : "hidden",
  backfaceVisibility       : "hidden"
};

class AsthmaConditions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status           : props.status,
      score            : props.score,
      latitude         : props.latitude,
      longitude        : props.longitude,
      forecastLocation : props.forecastLocation,
      hasGeolocate     : window.navigator && "geolocation" in window.navigator,
      flipped          : false
    };
    this.loadConditions = this.loadConditions.bind(this);
    this.flipCard = this.flipCard.bind(this);
  }

  flipCard() {
    this.setState({ flipped: !this.state.flipped });
  }

  loadConditions(lat, lng) {
    window
      .fetch(`${PROPELLER_API}?latitude=${lat}&longitude=${lng}`)
      .then(checkResponse)
      .then(extractJSON)
      .then(data => {
        console.log(data);
        this.setState({
          score: data.properties.value,
          status: data.properties.code.toLowerCase()
        });
      })
      .catch(console.error);
  }

  componentDidMount() {
    const { state } = this;
    if (state.latitude && state.longitude) {
      if (!(state.status && state.score)) {
        this.loadConditions(state.latitude, state.longitude);
      }
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
    const { flipped } = this.state;
    return (
      <div style={containerStyle}>
        <div
          style={Object.assign({}, cardStyle, {
            OTransform: flipped ? "rotateY( 180deg )" : "",
            WebkitTransform: flipped ? "rotateY( 180deg )" : "",
            MozTransform: flipped ? "rotateY( 180deg )" : "",
            msTransform: flipped ? "rotateY( 180deg )" : "",
            transform: flipped ? "rotateY( 180deg )" : ""
          })}
        >
          <CurrentConditions
            score={this.state.score}
            status={this.state.status}
            forecastLocation={this.state.forecastLocation}
            style={contentStyle}
            flipCard={this.flipCard}
          />
          <Signup style={contentStyle} flipCard={this.flipCard} />
        </div>
      </div>
    );
  }
}

export default AsthmaConditions;
