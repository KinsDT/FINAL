import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import * as XLSX from 'xlsx';
import L from 'leaflet';

// Fix leaflet marker icon issue in React:
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapView = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Load and parse Excel file (you can put the file in public folder)
    fetch('/LOCATION_with_dtcapacity_checked.xlsx')
      .then((res) => res.arrayBuffer())
      .then((data) => {
        const workbook = XLSX.read(data);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        // Extract LAT and LONG columns along with Meter_Id if exists
        const coords = jsonData.map((row) => ({
          lat: row.LAT,
          lng: row.LONG,
          meterId: row.Meter_Id || row.meterId || 'Unknown',
        }));
        setLocations(coords);
      })
      .catch((err) => {
        console.error('Error loading Excel file:', err);
      });
  }, []);

  // Default center position (if you want, calculate center from data)
  const center = locations.length
    ? [locations[0].lat, locations[0].lng]
    : [20, 78]; // fallback somewhere in India

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: '90vh', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        // Use satellite tiles from Esri
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />
      {locations.map(({ lat, lng, meterId }, idx) => (
        <Marker key={idx} position={[lat, lng]}>
          <Popup>Meter ID: {meterId}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
