import React from "react";
import MapComponent from "./MapComponent";
import { GOOGLE_MAP_API_KEY } from "../../utilities";

const LastLocation = ({ lat, lng, temp }) => {
  return (
    <div>
      <h5>Last known location</h5>
      <MapComponent
        lat={Number.parseFloat(lat.replace("_", "."))}
        lng={Number.parseFloat(lng.replace("_", "."))}
        isMarkerShown
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
        loadingElement={<div style={{ height: "100%" }} />}
        containerElement={<div style={{ height: "350px" }} />}
        mapElement={<div style={{ height: "100%" }} />}
      />
    </div>
  );
};

export default LastLocation;
