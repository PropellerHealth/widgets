import React from "react";
import logo from "../../assets/images/img_air_logo_tag.png";

const styles = {
  wrapper: {
    position: "absolute",
    left: "0",
    right: "0",
    bottom: "0.25rem",
    textAlign: "center"
  }
};

const PoweredByPropeller = () => {
  return (
    <div style={styles.wrapper}>
      <a
        href="https://www.propellerhealth.com/air-by-propeller/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={logo}
          alt="Propeller Logo"
          width="100"
          height="30"
        />
      </a>
    </div>
  );
};

export default PoweredByPropeller;
