import React from "react";

const Success = () => {
  return (
    <div className="jumbotron vertical-center">
      <div className="container">
        <h1 className="display-3"
          style={{marginTop: "150px"}}
        >
        Thank You!</h1>
        <p className="lead">Please watch your email for further information.</p>
        <hr/>
        <p>
          Having trouble? <a href="https://www.propellerhealth.com/contact/">Contact us</a>
        </p>
        <p className="lead">
          <a className="btn btn-primary btn-sm" href="https://propellerhealth.com/" role="button">Continue to Propeller Health</a>
        </p>
      </div>
    </div>
  );
};

export default Success;