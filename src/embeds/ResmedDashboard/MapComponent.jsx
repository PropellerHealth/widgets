import React from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

const MapComponent = withScriptjs(
  withGoogleMap(({ lat, lng, isMarkerShown }) => {
    return (
      <GoogleMap defaultZoom={8} defaultCenter={{ lat, lng }}>
        {isMarkerShown && <Marker position={{ lat, lng }} />}
      </GoogleMap>
    );
  })
);

export default MapComponent;