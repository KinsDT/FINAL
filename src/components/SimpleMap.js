/*import React, { useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import '../App.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const blinkingIcon = new L.DivIcon({
  className: 'blinking-marker',
  iconSize: [25, 41],
  html: `<div class="blinking-marker-inner"></div>`,
});

// Custom hook to track zoom level
const ZoomWatcher = ({ onZoomChange }) => {
  useMapEvents({
    zoomend: (e) => {
      const zoom = e.target.getZoom();
      onZoomChange(zoom);
    }
  });
  return null;
};

const SimpleMap = ({ markers = [] }) => {
  const center = markers.length > 0 ? [markers[0].lat, markers[0].long] : [20, 78];
  const [zoomLevel, setZoomLevel] = useState(6); // Default

  // ✅ Filter: only flagged markers when zoomed out
  const visibleMarkers = zoomLevel < 12
    ? markers.filter(m => m.flag >= 3)
    : markers;

  return (
    <MapContainer
      center={center}
      zoom={6}
      style={{ height: '90vh', width: '100%' }}
      scrollWheelZoom={true}
    >
      <ZoomWatcher onZoomChange={setZoomLevel} />

      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />

      {visibleMarkers.map((marker, idx) => (
        <Marker
          key={idx}
          position={[marker.lat, marker.long]}
          icon={marker.flag >= 3 ? blinkingIcon : defaultIcon}
        >
          <Popup>
            <div>
              <strong>Meter ID: {marker.meter_id}</strong><br />
              {marker.dt_capacity !== undefined && (
                <>
                  <span>DT Capacity: {marker.dt_capacity}</span><br />
                  <span>Percentage Load: {marker.percentage_load}</span><br />
                  <span>Flag: {marker.flag}</span>
                </>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default SimpleMap;
*/

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import '../App.css';

// Fix leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const blinkingIcon = new L.DivIcon({
  className: 'blinking-marker',
  iconSize: [25, 41],
  html: `<div class="blinking-marker-inner"></div>`,
});

const ZoomWatcher = ({ onZoomChange }) => {
  useMapEvents({
    zoomend: (e) => {
      onZoomChange(e.target.getZoom());
    }
  });
  return null;
};

const SimpleMap = ({ markers = [] }) => {
  const center = markers.length > 0 ? [markers[0].lat, markers[0].long] : [20, 78];
  const [zoomLevel, setZoomLevel] = useState(6);

  // 👇 Determine if marker should blink
  const shouldBlink = (m) => m.flag >= 3 || m.single_phasing === 1;

  // 👇 Only show flagged if zoomed out
  const visibleMarkers = zoomLevel < 12
    ? markers.filter(m => m.flag >= 3 || m.single_phasing === 1)
    : markers;

  return (
    <MapContainer
      center={center}
      zoom={zoomLevel}
      style={{ height: '90vh', width: '100%' }}
      scrollWheelZoom={true}
    >
      <ZoomWatcher onZoomChange={setZoomLevel} />

      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />

      {visibleMarkers.map((marker, idx) => (
        <Marker
          key={idx}
          position={[marker.lat, marker.long]}
          icon={shouldBlink(marker) ? blinkingIcon : defaultIcon}
        >
          <Popup>
            <div>
              <strong>Meter ID: {marker.source_meter_id || marker.meter_id}</strong><br />

              {marker.dt_capacity !== undefined && (
                <>
                  <span>DT Capacity: {marker.dt_capacity}</span><br />
                  <span>Percentage Load: {marker.percentage_load}</span><br />
                  <span>Flag: {marker.flag}</span><br />
                </>
              )}

              {marker.net_kw !== undefined && (
                <>
                  <span>Neutral Current: {marker.neutral_current}</span><br />
                  <span>Net kW: {marker.net_kw}</span><br />
                  <span>Net kVA: {marker.net_kva}</span><br />
                  <span>Net kVAR: {marker.net_kvar}</span><br />
                  <span>Single Phasing: {marker.single_phasing}</span>
                </>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default SimpleMap;
