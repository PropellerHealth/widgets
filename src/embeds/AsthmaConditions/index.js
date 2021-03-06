import React, { Component } from "react";
import CurrentConditions from "./CurrentConditions";
import Signup from "./Signup";
import { checkStatus, extractJSON, headers, isIE11, HAS_GEOLOCATE, HAS_WINDOW } from "../../utilities";
// import logo from './logo.svg';
import "./style.css";

const GOOGLE_KEY = "AIzaSyBlk7LNk5oUhQ72IZ9N_b-SjqnPiSK0l0I";
const GOOGLE_API = "https://maps.googleapis.com/maps/api/geocode/json";
const PROPELLER_API = "https://open.propellerhealth.com/prod/forecast";

const styles = Object.freeze({
  container: {
    width   : "350px",
    height  : "400px",
    position: "relative",
    color   : "#5c5c5c"
  },
  card: {
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
  },
  content: {
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
  }
});

class AsthmaConditions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status           : props.status,
      score            : props.score,
      latitude         : props.latitude,
      longitude        : props.longitude,
      forecastLocation : props.forecastLocation,
      hasGeolocate     : HAS_GEOLOCATE,
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
      .fetch(`${PROPELLER_API}?latitude=${lat}&longitude=${lng}`, {
        headers: headers
      })
      .then(checkStatus)
      .then(extractJSON)
      .then(data => {
        this.setState({
          score: data.properties.value,
          status: data.properties.code.toLowerCase()
        });
      })
      .catch(console.error);
  }

  componentWillMount() {
    if ("undefined" !== typeof document) {
      document.documentElement.className = "asthma-conditions";
    }
  }

  componentDidMount() {
    if (!HAS_WINDOW) return;

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
            .then(checkStatus)
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
    const shouldFlip = flipped && !isIE11;
    return (
      <div style={styles.container}>
        <div
          style={Object.assign({}, styles.card, {
            OTransform: shouldFlip ? "rotateY(180deg)" : "",
            WebkitTransform: shouldFlip ? "rotateY(180deg)" : "",
            MozTransform: shouldFlip ? "rotateY(180deg)" : "",
            msTransform: shouldFlip ? "rotateY(180deg)" : "",
            transform: shouldFlip ? "rotateY(180deg)" : ""
          })}
        >
          <CurrentConditions
            score={this.state.score}
            status={this.state.status}
            forecastLocation={this.state.forecastLocation}
            style={styles.content}
            flipCard={this.flipCard}
          />
          <Signup
            style={
              isIE11
                ? Object.assign({
                  msTransform: `translateX(${flipped ? 0 : 100}%)`,
                  transform: `translateX(${flipped ? 0 : 100}%)`,
                  msTransition: "transform 1s",
                  transition: "transform 1s"
                }, styles.content)
                : styles.content
            }
            flipCard={this.flipCard} />
        </div>
      </div>
    );
  }
}

export default AsthmaConditions;
