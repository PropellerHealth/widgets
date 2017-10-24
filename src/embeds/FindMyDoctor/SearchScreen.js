import React, { Component }       from "react";
import Alert                      from "react-s-alert";
import { FormGroup, FormControl } from "react-bootstrap";

// import { checkResponse, extractJSON } from "../../utilities";
import { checkResponse, extractJSON } from "../../utilities";

const INPUT_FIELD = {
  doctor    :  "Doctor's Name",
  specialty :  "Specialty (optional)",
  location  :  "State"
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
      location  : "", 
      specialty : "" 
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  buildRequest(doctor, specialty, location) {
    let allOfTheNames       =   `name=${doctor.trim().split(" ").join("%20")}`;
    let allOfTheLocations   =   `&location=${location.trim().split(" ").join("%20")}`;
    let allOfTheSpecialties =   "";

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
              <option value=""></option>
              <option value="AK">Alaska</option>
              <option value="AL">Alabama</option>
              <option value="AR">Arkansas</option>
              <option value="AZ">Arizona</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DC">District of Columbia</option>
              <option value="DE">Delaware</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="IA">Iowa</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="MA">Massachusetts</option>
              <option value="MD">Maryland</option>
              <option value="ME">Maine</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MO">Missouri</option>
              <option value="MS">Mississippi</option>
              <option value="MT">Montana</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="NE">Nebraska</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NV">Nevada</option>
              <option value="NY">New York</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="PR">Puerto Rico</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VA">Virginia</option>
              <option value="VT">Vermont</option>
              <option value="WA">Washington</option>
              <option value="WI">Wisconsin</option>
              <option value="WV">West Virginia</option>
              <option value="WY">Wyoming</option>
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