import React, { useState } from "react";
import { MapContainer as LeafletMap, TileLayer } from "react-leaflet";
import { showDataOnMap } from "../../util";
import "./Map.css";

const Map = ({ countries, casesType, center, zoom }) => {
  const [map, setmap] = useState(null);
  if (map) {
    map.flyTo(center);
  }
  return (
    <div className="map">
      <LeafletMap
        center={center}
        zoom={zoom}
        whenCreated={setmap}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {showDataOnMap(countries, casesType)}
      </LeafletMap>
    </div>
  );
};

export default Map;