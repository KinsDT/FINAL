import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

const SimpleMap = () => {
  return (
    <MapContainer
      center={[20, 78]}  // Default center (you can change it as needed)
      zoom={12}           // Default zoom level
      style={{ height: '90vh', width: '100%' }}
      scrollWheelZoom={true}  // Allow zooming with the mouse wheel
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        // You can change this URL to another tile provider if needed
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />
    </MapContainer>
  );
};

export default SimpleMap;
