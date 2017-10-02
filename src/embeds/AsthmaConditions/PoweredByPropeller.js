import React from "react";
import logo from "../..//assets/images/propeller-dots.svg";

const styles = {
  wrapper : {
    position: "absolute",
    left: "0",
    right: "0",
    bottom: "0.5rem"
  },
  link: {
    color: "#20C3F3",
    textDecoration: "none",
    fontSize: "0.8rem"
  },
  icon: {
    verticalAlign: "middle",
    marginRight: "5px"
  }
};

const PoweredByPropeller = () => {
  return (
    <div style={styles.wrapper}>
      <a
        href="https://www.propellerhealth.com/air-by-propeller/"
        target="_blank"
        rel="noopener noreferrer"
        style={styles.link}
      >
        <img
          src={logo}
          alt="Propeller Logo"
          width="25"
          height="25"
          style={styles.icon}
        />
        Powered by Propeller
      </a>
    </div>
  );
};

export default PoweredByPropeller;
