import React, { Component }               from "react";
import { Button, FormControl, FormGroup } from "react-bootstrap";
import Alert                              from "react-s-alert";

import doctorDecison   from "../../assets/images/img_docicon.png";
import { API_HEADER }  from "../../utilities";

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

const ERRORS = {
  email : "Please provide your email so we can connect you with your doctor",
  name  : "Please provide your name so we can connect you with your doctor"
};

const INPUT_FIELD = {
  email             : "Your email address",
  firstName         : "First name",
  lastName          : "Last name",
  hiddenSpamFilter  : ""
};

const SALESFORCE_LEAD_CONSTANTS = {
  URL       : "https://test.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8",
  npiKey    : "00N21000000o78g",
  oid       : "00D210000000hej",
  lastName  : "last_name",
  firstName : "first_name",
  email     : "email"
};

class ConfirmDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doctor      : props.doctor,
      showing     : false,
      firstName   : "",
      lastName    : "",
      email       : "",
      npi         : props.doctor.npi,
      submitting  : false
    };
    this.showForm = this.showForm.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  showForm() {
    this.setState({ showing : !this.state.showing });
  }

  onChange(e, key) {
    this.setState({ [key] : e.target.value });
  }

  handleClick(doctor) {
    const { goToStart } = this.props;
    goToStart();
  }

  onSubmit(e) {
    const { goNext } = this.props;

    e.preventDefault();

    const data = {
      [SALESFORCE_LEAD_CONSTANTS.email]     : this.state.email,
      [SALESFORCE_LEAD_CONSTANTS.npiKey]    : this.state.npi,
      [SALESFORCE_LEAD_CONSTANTS.lastName]  : this.state.lastName,
      [SALESFORCE_LEAD_CONSTANTS.firstName] : this.state.firstName,
      oid                                   : SALESFORCE_LEAD_CONSTANTS.oid,
      submit                                : "Submit"
    };
    
    if (!data.email) {
      this.setState({ submitting  : false });
      Alert.warning(ERRORS.both);
      return;
    }
    else if (!data["00N21000000o78g"]) {
      this.setState({ submitting  : false });
      Alert.warning(ERRORS.doctor);
      return;
    }
    else if (!data.first_name || !data.last_name) {
      this.setState({ submitting  : false });
      Alert.warning(ERRORS.name);
      return;
    }
    
    const formArray = [];
    Object.keys(data).forEach(key => {
      formArray.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
    });

    this.setState({ submitting  : true });

    window
      .fetch(SALESFORCE_LEAD_CONSTANTS.URL, {
        method  : "POST",
        // body    : JSON.parse(JSON.stringify(data).replace(/":"/gi, "=").replace(/","/gi,"&").slice(1, -1)),
        body    : formArray.join("&"),
        headers : API_HEADER,
        mode    : "no-cors"
      })
      .then(() => {
        this.setState({ submitting  : false });
        goNext();
      })
      .catch(err => {
        console.error(err);
        this.setState({ submitting : false });
      });
  }

  render() {
    const doctor = this.state.doctor;
    const { showing } = this.state;

    return (
      <div className="row">
        <div className="col-md-6 col-md-offset-3">
          <br/>
          <h1
            style={{fontSize: "2.75rem", textAlign: "center", width: "100%"}}
          >
            Please confirm your doctor&#39;s <br/> details.
          </h1>
          <div
            style={{textAlign: "center", width: "100%"}}
          >
            <h2 style={{ fontSize: "1.75rem", textAlign: "center", width: "100%", fontColor:"black"}}>
              {doctor.profile.first_name} {doctor.profile.last_name}
              <br/>{doctor.specialties[0].name}
            </h2>
            {doctor.practices[0]   && <p>{doctor.practices[0].visit_address.street}, {doctor.practices[0].visit_address.street2} <br/>
              {doctor.practices[0].visit_address.city}, {doctor.practices[0].visit_address.state} {doctor.practices[0].visit_address.zip}</p>}
            {<img src={doctorDecison} alt="DoctorDecision"/>}
            <br/>
            <br/>
            
            <Button
              style={{
                display         : `${showing ? "none" : "inline-block"}`,
                float           : "right",
                width           : "100%",
                marginTop       : "25px",
                padding         : "12px 0",
                fontSize        : "1.75rem",
                textAlign       : "center",
                backgroundColor : "#78be20",
                color           : "#FFF",
                cursor          : "pointer"
              }}
              bsStyle="success" 
              bsSize="large"
              onClick={this.showForm}>
              This is my doctor
            </Button>
            <form 
              onSubmit={this.onSubmit}
              style={{
                display: `${showing ? "block" : "none"}`,
              }}>
              <fieldset
                style={{
                  fontSize  : "2.25rem",
                  padding   : "0.5rem",
                  margin    : "0.7rem 0 0.5rem",
                  textAlign : "left"
                }}
              >
                <FormGroup>
                  <label
                  >
                    {INPUT_FIELD.email}:
                  </label>
                  <FormControl
                    id="emailAdress"
                    autoComplete="email"
                    type="email"
                    value={this.state.email}
                    onChange={(e) => this.onChange(e, "email")}
                    title={ERRORS.email}
                  />
                </FormGroup>
                <FormGroup>
                  <label
                  >
                    {INPUT_FIELD.firstName}:
                  </label>
                  <FormControl
                    id="firstName"
                    value={this.state.firstName}
                    onChange={(e) => this.onChange(e, "firstName")}
                    title={ERRORS.name}
                  />
                </FormGroup>
                <FormGroup>
                  <label
                  >
                    {INPUT_FIELD.lastName}:
                  </label>
                  <FormControl
                    id="lastName"
                    value={this.state.lastName}
                    onChange={(e) => this.onChange(e, "lastName")}
                    title={ERRORS.name}
                  />
                </FormGroup>
                <FormGroup
                  style={{display: "none"}}>
                  <label>
                    {INPUT_FIELD.hiddenSpamFilter}:
                  </label>
                  <FormControl
                    id="hiddenSpamFilter"
                    value={this.state.hiddenSpamFilter}
                    onChange={(e) => this.onChange(e, "hiddenSpamFilter")}
                  />
                </FormGroup>
                <input
                  style={
                    this.state.searching
                      ? Object.assign({}, styles.formButton, {opacity: "0.5"})
                      : styles.formButton
                  }
                  type="submit"
                  value={this.state.searching ? "Submitting..." : "Submit"}
                  disabled={this.state.searching}
                />
              </fieldset>
            </form>
            <Button
              style={{
                display         : "inline-block",
                float           : "right",
                width           : "100%",
                marginTop       : "5px",
                padding         : "12px 0",
                fontSize        : "1.75rem",
                textAlign       : "center",
                backgroundColor : "gray",
                color           : "#FFF",
                cursor          : "pointer"
              }}
              onClick={() => this.handleClick()}>
              Back to Search
            </Button>
          </div>
        </div>
      </div>
    );
  }
} 

export default ConfirmDoctor;