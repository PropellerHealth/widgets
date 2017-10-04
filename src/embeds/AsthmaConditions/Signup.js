import React, { Component } from "react";
import PoweredByPropeller from "./PoweredByPropeller";
import { checkStatus, extractJSON, headers } from "../../utilities";

const FORECAST_SIGNUP = "/api/forecast-signup";

const styles = {
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
};

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email      : undefined,
      sms        : undefined,
      postalCode : undefined,
      submitting : false,
      error      : undefined,
      success    : undefined
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e, key) {
    this.setState({
      [key]   : e.target.value,
      error   : undefined,
      success : undefined
    });
  }

  onSubmit(e) {
    e.preventDefault();
    console.log("signup", this.state);

    const data = {
      zip   : this.state.postalCode,
      email : this.state.email,
      sms   : this.state.sms
    };

    if (!data.email && !data.sms) {
      this.setState({
        submitting : false,
        error      : "Please include a valid email or phone number."
      });
      return;
    }

    this.setState({
      submitting : true,
      error      : undefined,
      success    : undefined
    });

    window
      .fetch(FORECAST_SIGNUP, {
        method  : "POST",
        body    : JSON.stringify(data),
        headers : headers
      })
      .then(checkStatus)
      .then(() => {
        this.setState({
          submitting : false,
          success    : "Thanks for signing up. You should get a confirmation message soon."
        });
      })
      .catch(err => {
        console.log(err);
        console.log(err.toString()); // "Bad Request"
        err.json().then(console.log) // {id: "string.email", message: ""to" must be a valid email"}

        this.setState({
          submitting : false,
          error      : err.toString()
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
            <legend style={{ fontSize: "0.9rem", textAlign: "center" }}>
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
              />
            </div>
            <input style={styles.formButton} type="submit" value="Sign Up"/>
          </fieldset>
        </form>
        <div style={styles.backWrapper}>
          <button className="toggle-button go-back" onClick={flipCard}>
            Back to Forecast
          </button>
          {/* <PoweredByPropeller /> */}
        </div>
      </figure>
    );
  }
}

export default Signup;
