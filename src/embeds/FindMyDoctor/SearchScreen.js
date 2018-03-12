import React, { Component }           from "react";
import Alert                          from "react-s-alert";
import {
  FormGroup,
  FormControl,
  InputGroup,
  Glyphicon,
  Button
} from "react-bootstrap";
import Autosuggest from "react-autosuggest";

import { checkResponse, extractJSON, HAS_WINDOW } from "../../utilities";
import specialties from "../../specialties";

const GOOGLE_KEY  = "AIzaSyBlk7LNk5oUhQ72IZ9N_b-SjqnPiSK0l0I";

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
  url           : "https://api.betterdoctor.com/2016-03-01/doctors",
  userKey       : "7cfd780736f7b59580de65b9bf25ba04",
  searchRadius  : 50
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

const theme = {
  container: {
    position  : 'relative'
  },
  inputFocused: {
    outline: 'none'
  },
  inputOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  suggestionsContainer: {
    display: 'none'
  },
  suggestionsContainerOpen: {
    display: 'block',
    maxHeight : "300px",
    overflow  : "auto",
    position: 'absolute',
    // top: 51,
    // width: 280,
    border: '1px solid #aaa',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    zIndex: 10
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  suggestion: {
    cursor: 'pointer',
    padding: '10px 20px'
  },
  suggestionHighlighted: {
    backgroundColor: '#ddd'
  }
};

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : specialties.filter(specialty =>
    specialty.name.toLowerCase().slice(0, inputLength) === inputValue
  );
 };

 // When suggestion is clicked, Autosuggest needs to populate the input
 // based on the clicked suggestion. Teach Autosuggest how to calculate the
 // input value for every given suggestion.
 const getSuggestionValue = suggestion => suggestion.name;

 // Use your imagination to render suggestions.
 const renderSuggestion = suggestion => (
  <span>{suggestion.name}</span>
 );

class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searching     : false,
      doctor        : props.searchedDoctor || "",
      specialty     : props.searchedSpecialty || "",
      latitude      : props.latitude,
      longitude     : props.longitude,
      geoLocation   : props.forecastLocation || "",
      location      : props.searchedLocation || "",
      uid           : props.uid,
      showing       : true,
      autocomplete  : "",
      value         : props.searchedSpecialty || "",
      suggestions   : [],
      mapsLoaded    : props.mapsLoaded
    };

    this.onChange           = this.onChange.bind(this);
    this.onSubmit           = this.onSubmit.bind(this);
    this.showLocationSearch = this.showLocationSearch.bind(this);
    this.initAutocomplete   = this.initAutocomplete.bind(this);
    this.setLatLong         = this.setLatLong.bind(this);
    this.setSpecialty       = this.setSpecialty.bind(this);
  }


  onChange2 = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  setSpecialty ( specialtyName ) {
    let uid;
    specialties.forEach( specialty => {
      if ( specialtyName === specialty.name ) {
        uid = specialty.uid;
      }
    })
    return uid;
  }

  showLocationSearch () {
    this.setState({ showing : !this.state.showing});
    this.initAutocomplete();
  }

  componentWillMount () {
    if (HAS_WINDOW && !this.state.mapsLoaded) {
      const script  = document.createElement("script");

      script.src    = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&libraries=places`;
      script.async  = true;
      script.addEventListener("load", this.initAutocomplete);

      document.body.appendChild(script);
    } else if (HAS_WINDOW) {
      this.initAutocomplete();
    }
  }

  componentWillUnmount () {
    document.body.removeEventListener("load", this.initAutocomplete);
  }

  initAutocomplete () {
    const { mapsScriptLoaded } =  this.props;

    if ( document.getElementById("location") ) {
      this.setState({
        autocomplete  : new window.google.maps.places.Autocomplete((document.getElementById('location')),{types: ['(cities)']})
      });
    }
    mapsScriptLoaded();
      // currently breaks everything
    // this.setState({ autocomplete : autocomplete.setComponentRestrictions({'country': ['us']})});
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      geoLocation : nextProps.geoLocation,
      latitude    : nextProps.latitude,
      longitude   : nextProps.longitude
    });
  }

  setLatLong () {
    let latitude, longitude;
    if ( this.state.showing ) {
      latitude  = this.state.latitude;
      longitude = this.state.longitude;
    } else {
      const wait = () => {
        let condition = this.state.autocomplete;
        if ( condition !== undefined && condition.getPlace() !== undefined) {
          let place   = condition.getPlace();
          latitude    = place.geometry.location.lat();
          longitude   = place.geometry.location.lng();
        } else {
          setTimeout(()=>wait(condition), 500);
        }
      };
      wait();
    }
    return { latitude, longitude };
  }

  buildRequest (doctor, specialty, location) {
    const { searchedParams } = this.props;
    searchedParams(doctor, specialty, location);

    let allOfTheNames       =   `name=${doctor.trim().split(" ").join("%20")}`;
    let allOfTheLocations   =   `&location=${location.latitude}%2C${location.longitude}%2C${BETTER_DOCTOR_API.searchRadius}`;
    let allOfTheSpecialties =   "";

    if ( specialty ) {
      allOfTheSpecialties = `&specialty_uid=${this.setSpecialty(specialty)}`;
    }

    const queryParameters = allOfTheNames + allOfTheLocations + allOfTheSpecialties;
    return `${BETTER_DOCTOR_API.url}?${queryParameters}&user_key=${BETTER_DOCTOR_API.userKey}`;
  }

  onChange (e, key) {
    this.setState({ [key] : e.target.value });
  }

  onSubmit (e) {
    const { goNext, updateOrSomethingLikeThat } = this.props;
    e.preventDefault();

    const location  = this.setLatLong();
    const data      = {
      doctor    : this.state.doctor,
      specialty : this.state.value,
      location
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
    else if ( !data.location.latitude || !data.location.longitude ) {
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

    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      value,
      onChange: this.onChange2
    };

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
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
              theme={theme}
              renderInputComponent={inputProps => (<FormControl
                // id="value"
                // value={this.state.value}
                // onChange={(e) => this.onChange(e, "value")}
                // title={ERRORS.specialty}
                {...inputProps}
              />)}
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
                readOnly
                type="text"
                value={this.state.geoLocation}
              />
              <InputGroup.Button onClick={this.showLocationSearch}>
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
                <InputGroup.Button onClick={this.showLocationSearch}>
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

