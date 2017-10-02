import React from "react";
import PoweredByPropeller from "./PoweredByPropeller";

const PROPELLER_SIGNUP = "https://forecast-subscription.appspot.com/subscribe";

const styles = {
  label: {
    display: "inline-block",
    maxWidth: "100%",
    marginBottom: "5px",
    fontWeight: "700",
    fontSize: "0.9rem"
  },

  orDivider : {
    textAlign: "center"
  }
};

const inputStyle = {
  boxSizing: "border-box",
  border: "1px solid #CEC9C9",
  background: "#FFF",
  color: "#888B8D",
  borderRadius: "3px",
  padding: "10px 16px",
  height: "46px",
  width: "100%",
  lineHeight: "1.3333333",
  fontSize: "1rem"
};

const buttonStyle = {
  backgroundColor: "#78be20",
  borderWidth: 0,
  width: "210px",
  border: "2px solid #fff",
  display: "inline-block",
  paddingTop: "14px",
  paddingBottom: "14px",
  marginTop: "14px",
  textAlign: "center",
  color: "#FFF",
  borderRadius: "6px"
};

const Signup = ({ style, flipCard }) => {
  return (
    <figure style={Object.assign({}, style, { transform: "rotateY(180deg)", zIndex: -1})}>
      <h2 style={{margin: "0 0 0.5rem"}}>Signup for notifications</h2>
      <form style={{textAlign: "left"}}>
        <fieldset style={{border: "none", margin: 0, padding: 0}}>
          <legend style={{fontSize: "0.9rem"}}>
            Sign up to receive a quick text or email when your local asthma conditions are either fair or poor.
          </legend>
          <div className="clearfix">
            <div>
              <label for="email" style={styles.label}>Email</label>
              <input
                id="email"
                style={inputStyle}
                autocomplete="email"
                type="email"
              />
            </div>
            <div className="or-divider" style={styles.orDivider}>
              or
            </div>
            <div>
              <label for="sms" style={styles.label}>SMS Number</label>
              <input
                id="sms"
                style={inputStyle}
                autocomplete="tel-national"
                pattern="\d{10}"
                type="tel"
              />
            </div>
          </div>
          <div style={{width: "50%", float: "left"}}>
            <label for="postalCode" style={styles.label}>Zip Code </label>
            <input
              id="postalCode"
              style={inputStyle}
              required
              type="tel"
            />
          </div>
          <input
            style={buttonStyle}
            type="submit"
          />
        </fieldset>
      </form>
      <button onClick={flipCard}>Back to forecast</button>
      {/* <PoweredByPropeller /> */}
    </figure>
  );
};

export default Signup;
