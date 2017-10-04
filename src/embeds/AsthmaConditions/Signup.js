import React, { Component } from "react";
import Alert from 'react-s-alert';
import { checkStatus, headers } from "../../utilities";

import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/flip.css';

const FORECAST_SIGNUP = "/api/forecast-signup";

const ERRORS = {
  email: "Please enter a valid email address",
  postalCode: "Zip code should be 5 numbers",
  phone: "SMS number should contain 10 numbers, ex. 6085551212"
};

const styles = Object.freeze({
  inputWrapper : {
    padding      : "0.5rem",
    border       : "1px solid #DDD",
    borderRadius : "4px",
    background   : "#FAFAFA",
    margin       : "0.7rem 0 0.5rem"
  },

  orDivider: {
    textAlign: "center"
  },

  formButton: {
    display         : "inline-block",
    float           : "right",
    width           : "48%",
    marginTop       : "25px",
    padding         : "12px 0",
    fontSize        : "1rem",
    textAlign       : "center",
    backgroundColor : "#78be20",
    color           : "#FFF",
    border          : "2px solid #78be20",
    borderRadius    : "3px",
    cursor          : "pointer"
  },
  backWrapper: {
    position : "absolute",
    left     : "0",
    right    : "0",
    bottom   : "8px"
  }
});

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email      : undefined,
      sms        : undefined,
      postalCode : undefined,
      submitting : false
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e, key) {
    this.setState({ [key] : e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const data = {
      zip   : this.state.postalCode,
      email : this.state.email,
      sms   : this.state.sms
    };

    if (!data.email && !data.sms) {
      this.setState({ submitting : false });
      Alert.warning("Please include a valid email or phone number.");
      return;
    }

    this.setState({ submitting : true });

    window
      .fetch(FORECAST_SIGNUP, {
        method  : "POST",
        body    : JSON.stringify(data),
        headers : headers
      })
      .then(checkStatus)
      .then(() => {
        this.setState({ submitting : false });
        Alert.success("Thanks for signing up. You should get a confirmation message soon.")
      })
      .catch(err => {
        this.setState({ submitting : false });

        err.json()
          .then(data => {
            // data = {id: "string.email", message: ""to" must be a valid email"}
            const attr = data.id.split(".");
            Alert.error(`Please enter a valid ${attr[attr.length - 1]}`);
          })
          .catch(() => {
            Alert.error(err.toString()); // "Bad Request"
          });
      });
  }

  render() {
    const { style, flipCard } = this.props;
    return (
      <figure className="signup-form" style={Object.assign({}, style, { transform: "rotateY(180deg)" })}>
        <h2 style={{ margin: "0 0 0.5rem",  fontSize: "21px" }}>
          Sign Up for Notifications
        </h2>
        <form style={{ textAlign: "left" }} onSubmit={this.onSubmit}>
          <fieldset style={{ border: "none", margin: 0, padding: 0 }}>
            <legend style={{ fontSize: "0.9rem", textAlign: "center", width: "100%"}}>
              Receive a text or email when your
              <br/>
              local asthma conditions are fair or poor.
            </legend>
            <div className="clearfix" style={styles.inputWrapper}>
              <div>
                <label for="email">
                  Email
                </label>
                <input
                  id="email"
                  autocomplete="email"
                  type="email"
                  value={this.state.email}
                  onChange={(e) => this.onChange(e, "email")}
                  title={ERRORS.email}
                  onIn
                />
              </div>
              <div className="or-divider" style={styles.orDivider}>
                — or —
              </div>
              <div>
                <label for="sms">
                  SMS Number
                </label>
                <input
                  id="sms"
                  autocomplete="tel-national"
                  pattern="\d{10}"
                  minLength="10"
                  maxLength="10"
                  type="tel"
                  value={this.state.sms}
                  onChange={(e) => this.onChange(e, "sms")}
                  title={ERRORS.phone}
                />
              </div>
            </div>
            <div style={{ width: "48%", float: "left" }}>
              <label for="postalCode">
                Zip Code
              </label>
              <input
                id="postalCode"
                required
                type="tel"
                pattern="\d{5}"
                minLength="5"
                maxLength="5"
                autocomplete="postal-code"
                value={this.state.postalCode}
                onChange={(e) => this.onChange(e, "postalCode")}
                title={ERRORS.postalCode}
              />
            </div>
            <input
              style={
                this.state.submitting
                  ? Object.assign({}, styles.formButton, {opacity: "0.5"})
                  : styles.formButton
              }
              type="submit"
              value={this.state.submitting ? "Submitting..." : "Sign Up"}
              disabled={this.state.submitting}
            />
          </fieldset>
        </form>
        <div style={styles.backWrapper}>
          <button className="toggle-button go-back" onClick={flipCard}>
            Back to Forecast
          </button>
        </div>
        <Alert stack={{ limit: 3 }} position="top" effect="flip" timeout={5000} />
      </figure>
    );
  }
}

export default Signup;
