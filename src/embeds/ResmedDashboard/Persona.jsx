import React from "react";
import { Media } from "react-bootstrap";
import GreyText from "../../components/GreyText";

import bob from "../../assets/images/bob.jpeg";


const Persona = () => {
  return (
    <Media className="persona-wrapper">
      <Media.Left className="profile-info">
        <div className="image-wrapper">
          <img className="profile-image" src={bob} alt="Bob Baddeley" />
        </div>
      </Media.Left>
      <Media.Right>
        <h1 className="name">Bob Baddeley</h1>
        <h2
          style={{
            margin: "1rem 0 2rem",
            fontSize: "2.8rem",
            color: "#555"
          }}
        >
          62 <GreyText style={{ padding: "0 0.7rem" }}>|</GreyText> Male{" "}
          <GreyText style={{ padding: "0 0.7rem" }}>|</GreyText> COPD
        </h2>
      </Media.Right>
    </Media>
  );
};

export default Persona;
