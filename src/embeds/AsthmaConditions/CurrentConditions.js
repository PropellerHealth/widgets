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

const explanationStyle = {
  textAlign: "left",
  fontSize: "0.85rem"
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
      <h2 style={{ margin: "0 0 0.5rem" }}>Local Asthma Conditions</h2>
      <div
        style={{
          marginBottom: "0.5rem",
          height: "2rem",
          MozTransition: "opacity 300ms",
          WebkitTransition: "opacity 300ms",
          OTransition: "opacity 300ms",
          transition: "opacity 300ms",
          opacity: forecastLocation ? 1 : 0
        }}
      >
        <img
          src={icon}
          alt="location icon"
          style={{ verticalAlign: "middle", marginRight: "5px" }}
          height="31"
          width="22"
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
        style={explanationStyle}
        dangerouslySetInnerHTML={{ __html: STATUS_TEXT[status] }}
      />
      <div className="signup">
        <button onClick={flipCard}>Get personal notifications</button>
      </div>
      <PoweredByPropeller />
    </figure>
  );
};

export default CurrentConditions;
