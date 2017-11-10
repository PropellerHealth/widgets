import React from "react";

const TEXT = {
  thanks      : "Thank You",
  watchEmail  : "Please watch your email for further information",
  trouble     : "Having trouble",
  contact     : "Contact us"
};

const Success = () => {
  return (
    <div className="jumbotron vertical-center">
      <div className="container">
        <h1 className="display-3"
          style={{marginTop: "150px"}}
        >
        {TEXT.thanks}!</h1>
        <p className="lead">{TEXT.watchEmail}.</p>
        <hr/>
        <p>
          {TEXT.trouble}? <a href="https://www.propellerhealth.com/contact/">{TEXT.contact}</a>
        </p>
        <p className="lead">
          <a className="btn btn-primary btn-sm" href="https://propellerhealth.com/" role="button">Continue to Propeller Health</a>
        </p>
      </div>
    </div>
  );
};

export default Success;