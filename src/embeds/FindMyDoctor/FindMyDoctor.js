import React, { Component } from "react";

import FirstScreen    from "./FirstScreen";
import SearchList     from "./SearchList";
import ConfirmDoctor  from "./ConfirmDoctor";
import Success        from "./Success";
import propellerLogo  from "../../assets/images/propeller-logo-white.svg";

import { checkStatus, extractJSON } from "../../utilities";

import "./FindMyDoctor.css";
import "../../assets/styles/bootstrap.css";

const ORDER = [
  FirstScreen,
  SearchList,
  ConfirmDoctor,
  Success
];

const GOOGLE_KEY = "AIzaSyBlk7LNk5oUhQ72IZ9N_b-SjqnPiSK0l0I";
const GOOGLE_API = "https://maps.googleapis.com/maps/api/geocode/json";

class FindMyDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idx           : 0,
      doctors       : [],
      doctor        : {},
      latitude      : props.latitude,
      longitude     : props.longitude,
      hasGeolocate  : window.navigator && "geolocation" in window.navigator,
      location      : props.state,
      city          : props.city
    };
    this.goNext                     = this.goNext.bind(this);
    this.goToStart                  = this.goToStart.bind(this);
    this.updateOrSomethingLikeThat  = this.updateOrSomethingLikeThat.bind(this);
    this.passThatDocAlong           = this.passThatDocAlong.bind(this);
    this.loadConditions             = this.loadConditions.bind(this);
  }

  loadConditions(latitude, longitude) {
    this.setState({
      latitude,
      longitude
    });
  }

  componentDidMount() {
    const { state } = this;
    if ( state.latitude && state.longitude ) {
      this.loadConditions(state.latitude, state.longitude);
    } else {
      if ( state.hasGeolocate ) {
        window.navigator.geolocation.getCurrentPosition(loc =>  {
          console.log('your geolocation updating is embarrassingly slow, fix it');
          const { latitude, longitude } = loc.coords;
          this.loadConditions(latitude, longitude);
          window
          .fetch(
            `${GOOGLE_API}?latlng=${latitude},${longitude}&location_type=APPROXIMATE&result_type=locality|administrative_area_level_3&key=${GOOGLE_KEY}`
          )
          .then(checkStatus)
          .then(extractJSON)
          .then(data => {
            if ( data.results.length > 0 ) {
              this.setState({
                location  : data.results[0].address_components[2].short_name,
                city      : data.results[0].address_components[0].long_name
              });
            }
          });
        });
      }
    }
  }

  goNext() {
    this.setState({idx: this.state.idx + 1 });
  }

  goToStart() {
    this.setState({idx: 0});
  }

  updateOrSomethingLikeThat(doctors) {
    this.setState({doctors});
  }

  passThatDocAlong(doctor) {
    this.setState({doctor});
  }

  render() {
    const ToRender = ORDER[this.state.idx];

    return (
      <div>
        <div className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <div className="navbar-header">
              <img src={propellerLogo} alt="" height="54" width="180"/>
            </div>
          </div>
        </div>
        <div style={{marginBottom: "250px"}}>
        <ToRender
          goNext={this.goNext} 
          goToStart={this.goToStart} 
          updateOrSomethingLikeThat={this.updateOrSomethingLikeThat} 
          passThatDocAlong={this.passThatDocAlong}
          loadConditions={this.loadConditions}
          {...this.state} 
        />
        </div>
        <br/>
        <footer>
          <div className="container">
          </div>
        </footer>
      </div>
    );
  }
}

export default FindMyDoctor;