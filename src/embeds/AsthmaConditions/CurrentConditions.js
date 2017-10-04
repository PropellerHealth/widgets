import React from "react";
import AsthmaScoreBar from "./AsthmaScoreBar";
import PoweredByPropeller from "./PoweredByPropeller";
import icon from "../../assets/images/img_location.png";
import goodImg from "../../assets/images/conditions-good.svg";

const STATUS_IMG = {
  high: goodImg,
  medium: goodImg,
  low: goodImg
};

const STATUS_TEXT = {
  high:
    "Your local asthma conditions are <strong>poor</strong>. People with asthma may experience asthma symptoms today so be sure to take extra precautions, like keeping your rescue inhaler handy.",
  medium:
    "Your local asthma conditions are <strong>fair</strong>. Sensitive asthma sufferers may experience asthma symptoms today and should take extra precautions, including  keeping your rescue inhaler handy to treat unexpected symptoms of your asthma.",
  low:
    "Your local asthma conditions are <strong>good</strong>. Your environment isn’t likely to cause any asthma symptoms today but be sure to keep your rescue inhaler handy in case of other triggers of your asthma or emergencies."
};

const styles = {
  explanation: {
    textAlign: "left",
    fontSize: "0.85rem",
    lineHeight: "1rem"
  },
  buttonWrapper: {
    position: "absolute",
    left: "0",
    right: "0",
    bottom: "55px"
  },
  actionButton : {
    display: "inline-block",
    padding: "0.3rem 0.5rem 0.4rem",
    border: "1px solid",
    background: "white",
    borderRadius: "3px",
    color: "#20C3F3",
    cursor: "pointer",
    outline: "none"
  }
};

const CurrentConditions = ({
  score,
  status,
  forecastLocation,
  style,
  flipCard
}) => {
  return (
    <figure style={style}>
      <h1 style={{ margin: "0 0 0.5rem", fontSize: "21px" }}>Local Asthma Conditions</h1>
      <div
        style={{
          marginBottom: "0.5rem",
          MozTransition: "opacity 300ms",
          WebkitTransition: "opacity 300ms",
          OTransition: "opacity 300ms",
          transition: "opacity 300ms",
          height: "22px",
          opacity: forecastLocation ? 1 : 0
        }}
      >
        <img
          src={icon}
          alt="location icon"
          style={{ verticalAlign: "middle", marginRight: "5px" }}
          height="20"
          width="14"
        />
        {forecastLocation}
      </div>
      <div style={{ height: "80px", marginBottom: "0.5rem" }}>
        <img
          src={STATUS_IMG[status]}
          height="100%"
          alt={`status ${status}`}
          style={{
            MozTransition: "opacity 300ms",
            WebkitTransition: "opacity 300ms",
            OTransition: "opacity 300ms",
            transition: "opacity 300ms",
            opacity: status ? 1 : 0
          }}
        />
      </div>
      <AsthmaScoreBar score={score} status={status} />
      <div
        style={styles.explanation}
        dangerouslySetInnerHTML={{ __html: STATUS_TEXT[status] }}
      />
      <div style={styles.buttonWrapper}>
        <button className="toggle-button signup" onClick={flipCard}>
          Get personal notifications
        </button>
      </div>
      <PoweredByPropeller />
    </figure>
  );
};

export default CurrentConditions;
