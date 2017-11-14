import React, { Component }       from "react";
import Alert                      from "react-s-alert";
import { FormGroup, FormControl } from "react-bootstrap";

// import { checkResponse, extractJSON } from "../../utilities";
import { checkResponse, extractJSON, stateInputList } from "../../utilities";

const INPUT_FIELD = {
  doctor    : "Doctor's Name",
  specialty : "Specialty (optional)",
  location  : "State",
  city      : "City"
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
      location  : props.location, 
      specialty : "",
      city      : props.city,
      latitude  : props.latitude,
      longitude : props.longitude 
    };

    
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      location  : nextProps.location, 
      city      : nextProps.city 
    });  
  }
  
  buildRequest(doctor, specialty, location) {
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
    return `${BETTER_DOCTOR_API.url}?${queryParameters}&user_key=7cfd780736f7b59580de65b9bf25ba04`;
  }

  onChange(e, key) {
    this.setState({ [key] : e.target.value });
  }
  
  onSubmit(e) {
    const { goNext, updateOrSomethingLikeThat } = this.props;
    e.preventDefault();
    
    const data = {
      doctor    : this.state.doctor,
      specialty : this.state.specialty,
      location  : stateInputList.forEach(state => {
        if ( this.state.location === state.abbreviation ) {
          return state.name;
        }
      }),
      city      : this.state.city
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

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <fieldset>
          <FormGroup>
            <label
              style={{fontSize:"1.25rem"}}
            >
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
            <label
              style={{fontSize:"1.25rem"}}
            >
              {INPUT_FIELD.specialty}:
            </label>
            <FormControl
              id="specialty"
              value={this.state.specialty}
              onChange={(e) => this.onChange(e, "specialty")}
              title={ERRORS.specialty}
            />
          </FormGroup>
          <FormGroup>
            <label
              style={{fontSize:"1.25rem"}}
            >
              {INPUT_FIELD.city}:
            </label>
            <FormControl
              id="city"
              value={this.state.city}
              onChange={(e) => this.onChange(e, "city")}
              title={ERRORS.specialty}
            />
          </FormGroup>
          <FormGroup>
            <label
              style={{fontSize:"1.25rem"}}
            >
              {INPUT_FIELD.location}:
            </label>
            <select
              className="form-control"
              id="location"
              required
              value={this.state.location}
              onChange={(e) => this.onChange(e, "location")}
              title={ERRORS.location}
            >
              {stateInputList.map(state => <option key={state.name} value={state.abbreviation}>{state.name}</option>)}
            </select>
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