import React, { Component }           from "react";
import Alert                          from "react-s-alert";
import { FormGroup, FormControl, 
  InputGroup, Glyphicon, Button }     from "react-bootstrap";
import { checkResponse, extractJSON } from "../../utilities";

const GOOGLE_KEY        = "AIzaSyBlk7LNk5oUhQ72IZ9N_b-SjqnPiSK0l0I";

const INPUT_FIELD = {
  doctor          : "Doctor's Name",
  specialty       : "Specialty (optional)",
  location        : "Location",
  currentLocation : "Current Location"
};

const ERRORS = {
  doctor    : "Please provide the name of your physician",
  location  : "Please provide a state",
  both      : "Please provide the name of your physician and a location"
};

const BETTER_DOCTOR_API = {
  url     : "https://api.betterdoctor.com/2016-03-01/doctors",
  userKey : "7cfd780736f7b59580de65b9bf25ba04"
};

const styles = Object({
  formButton: {
    display         : "inline-block",
    float           : "right",
    width           : "100%",
    marginTop       : "25px",
    padding         : "12px 0",
    fontSize        : "1.75rem",
    textAlign       : "center",
    backgroundColor : "#78be20",
    color           : "#FFF",
    border          : "2px solid #78be20",
    borderRadius    : "3px",
    cursor          : "pointer"
  }
});

class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searching : false,
      doctor    : "", 
      specialty : "",
      latitude  : props.latitude,
      longitude : props.longitude, 
      geoLocation  : props.forecastLocation,
      location  : "",
      uid       : props.uid,
      showing   : "true"
    };

    this.onChange           = this.onChange.bind(this);
    this.onSubmit           = this.onSubmit.bind(this);
    this.showLocationSearch = this.showLocationSearch.bind(this);
    this.initAutocomplete   = this.initAutocomplete.bind(this);
  }

  autocomplete  = ""

  showLocationSearch () {
    this.setState({ showing : !this.state.showing});
  }

  componentWillMount () {
    const script  = document.createElement("script");

    script.src    = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&libraries=places`
    script.async  = true;
    script.addEventListener("load", this.initAutocomplete);
    
    document.body.appendChild(script);
  }

  componentWillUnmount () {
    document.body.removeEventListener("load", this.initAutocomplete);
  }

  initAutocomplete () {
    this.autocomplete = new window.google.maps.places
      .Autocomplete((document.getElementById('location')),{types: ['(cities)']})
      .setComponentRestrictions({'country': ['us']});
  };

  componentWillReceiveProps (nextProps) {
    this.setState({
      geoLocation  : nextProps.geoLocation
    });  
  }

  buildRequest (doctor, specialty, location) {
    let allOfTheNames       =   `name=${doctor.trim().split(" ").join("%20")}`;
    let allOfTheLocations   =   "";
    let allOfTheSpecialties =   "";

    if ( this.state.latitude && this.state.longitude ) {
      allOfTheLocations = `&location=${this.state.latitude}%2C${this.state.latitude}`;
    } else {
      allOfTheLocations = `&location=${location.trim().split(" ").join("%20")}`;
    }

    if (specialty) {
      allOfTheSpecialties = `&specialty_uid=${specialty.trim().split(" ").join("%20")}`;
    }

    const queryParameters = allOfTheNames + allOfTheLocations + allOfTheSpecialties;
    return `${BETTER_DOCTOR_API.url}?${queryParameters}&user_key=${BETTER_DOCTOR_API.userKey}`;
  }

  onChange (e, key) {
    console.log("onchange to check value: ", this.autocomplete)
    this.setState({ [key] : e.target.value });
  }
  
  onSubmit (e) {
    const { goNext, updateOrSomethingLikeThat } = this.props;
    e.preventDefault();
    
    const data = {
      doctor    : this.state.doctor,
      specialty : this.state.specialty,
      location  : this.state.location
    };
    
    if (!data.doctor && !data.location) {
      this.setState({ searching: false });
      Alert.warning(ERRORS.both);
      return;
    }
    else if (!data.doctor) {
      this.setState({ searching: false });
      Alert.warning(ERRORS.doctor);
      return;
    }
    else if (!data.location) {
      this.setState({ searching: false });
      Alert.warning(ERRORS.location);
      return;
    }
    else {
      this.setState({ searching : true });

      fetch(this.buildRequest(data.doctor, data.specialty, data.location))
        .then(checkResponse)
        .then(extractJSON)
        .then( json => updateOrSomethingLikeThat(json.data))
        .then(goNext)
        .catch(err => {
          console.error(err);
          this.setState({ searching : false });
        });
    }
  }

  render () {
    const { showing } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <fieldset>
          <FormGroup>
            <label style={{fontSize:"1.25rem"}}>
                {INPUT_FIELD.doctor}:
            </label>
            <FormControl
              id="doctor"
              value={this.state.doctor}
              onChange={(e) => this.onChange(e, "doctor")}
              title={ERRORS.doctor}
            />
          </FormGroup>
          <FormGroup>
            <label style={{fontSize:"1.25rem"}}>
              {INPUT_FIELD.specialty}:
            </label>
            <FormControl
              id="specialty"
              value={this.state.specialty}
              onChange={(e) => this.onChange(e, "specialty")}
              title={ERRORS.specialty}
            />
          </FormGroup>
          <FormGroup
            style={{ display: `${showing ? "block" : "none"}`}}
          >
            <label style={{fontSize:"1.25rem"}}>
              {INPUT_FIELD.currentLocation}:
            </label>
            <InputGroup>
              <FormControl 
                type="text"
                value={this.state.geoLocation}
              />
              <InputGroup.Button onClick={() => this.showLocationSearch()}>
                <Button>
                  <Glyphicon glyph="remove" />
                </Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
          <FormGroup
            style={{ display: `${showing ? "none" : "block"}`}}
          >
            <label style={{fontSize:"1.25rem"}}>
              {INPUT_FIELD.location}:
            </label>
            <InputGroup>
              <FormControl 
                type="text"
                id="location"
              />
                <InputGroup.Button onClick={() => this.showLocationSearch()}>
                  <Button>
                    <Glyphicon glyph="globe" />
                  </Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
          <br/>
          <input
            style={
              this.state.searching
              ? Object.assign({}, styles.formButton, {opacity: "0.5"})
              : styles.formButton
            }
            type="submit"
            value={this.state.searching ? "Searching..." : "Search"}
            disabled={this.state.searching}
          />
        </fieldset>
      </form>
      );
    }
  }
  
  export default SearchScreen;