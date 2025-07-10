/*import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import '../App.css';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const StepChart = ({ data }) => (
  <LineChart width={300} height={150} data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="block" 
    tickCount={10} 
    label={{ 
      value: 'Block Number', 
      position: 'insideBottom', 
      offset: -5 
    }} 
    />
    <YAxis dataKey="single_phasing" domain={[0, 1]} ticks={[0, 1]} />
    <Tooltip />
    <Line
      type="stepAfter"
      dataKey="single_phasing"
      stroke="#ff0000"
      strokeWidth={2}
      dot ={false}
    />
  </LineChart>
);
const LoadChart = ({ data }) => (
  <LineChart width={300} height={150} data={data} >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="block" 
    label={{ 
      value: 'Block Number', 
      position: 'insideBottom', 
      offset: -5 
    }} 
    />
    <YAxis domain={[0, 100]} 
      label={{
        value: '% of DT Capacity ',
        angle: -90,
        position: 'insideLeft',
        offset: 20,
        style: { fontSize: 10 },
        dy: 40,
        }}
    />
    <Tooltip />
    <Line type="monotone" dataKey="percentage_load" stroke="#1890ff" strokeWidth={2} dot={false} />
  </LineChart>
);

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

const ZOOM_THRESHOLD = 11;
const SimpleMap = ({ markers = [], parameter }) => {
  const center = markers.length > 0 ? [markers[0].lat, markers[0].long] : [20, 78];
  const [zoomLevel, setZoomLevel] = useState(6);

  // 👇 Determine if marker should blink
  const shouldBlink = (m) => m.flag >= 3 || m.shouldBlinkPhasing || m.shouldBlinkLoading;

  // 👇 Only show flagged if zoomed out
  const visibleMarkers = zoomLevel < ZOOM_THRESHOLD
    ? markers.filter(shouldBlink)
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

    
    {parameter === 'Single Phasing' && marker.singlePhasingProfile?.length > 0 && (
      <StepChart data={marker.singlePhasingProfile} />
    )}

    
    {parameter === 'Loading' && marker.loadingProfile?.length > 0 && (
      <LoadChart data={marker.loadingProfile} />
    )}

   
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
*/

import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import '../App.css';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// Chart for single phasing
const StepChart = ({ data }) => (
  <LineChart width={300} height={150} data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis
      dataKey="block"
      tickCount={10}
      label={{
        value: 'Block Number',
        position: 'insideBottom',
        offset: -5
      }}
    />
    <YAxis dataKey="single_phasing" domain={[0, 1]} ticks={[0, 1]} />
    <Tooltip />
    <Line
      type="stepAfter"
      dataKey="single_phasing"
      stroke="#ff0000"
      strokeWidth={2}
      dot={false}
    />
  </LineChart>
);

// Chart for loading
const LoadChart = ({ data }) => (
  <LineChart width={300} height={150} data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis
      dataKey="block"
      label={{
        value: 'Block Number',
        position: 'insideBottom',
        offset: -5
      }}
    />
    <YAxis
      domain={[0, 100]}
      label={{
        value: '% of DT Capacity',
        angle: -90,
        position: 'insideLeft',
        offset: 20,
        style: { fontSize: 10 },
        dy: 40,
      }}
    />
    <Tooltip />
    <Line type="monotone" dataKey="percentage_load" stroke="#1890ff" strokeWidth={2} dot={false} />
  </LineChart>
);

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

const ZOOM_THRESHOLD = 11;

const SimpleMap = ({ markers = [], parameter, centerTrigger }) => {
  const mapRef = useRef();
  const center = markers.length > 0 ? [markers[0].lat, markers[0].long] : [20, 78];
  const [zoomLevel, setZoomLevel] = useState(6);
  const [selectedMeterDetails, setSelectedMeterDetails] = useState({});

  // Fetch full meter details on marker click
  const fetchMeterDetails = async (meter_id) => {
    try {
      if (selectedMeterDetails[meter_id]) return; // already fetched
      const res = await fetch(`http://localhost:5000/api/meter-data/meter-by-id?meter_id=${meter_id}`);
      const data = await res.json();
      setSelectedMeterDetails(prev => ({ ...prev, [meter_id]: data }));
    } catch (err) {
      console.error('Error fetching meter details:', err);
    }
  };

  const shouldBlink = (m) => m.flag >= 3 || m.shouldBlinkPhasing || m.shouldBlinkLoading;

  const visibleMarkers = zoomLevel < ZOOM_THRESHOLD
    ? markers.filter(shouldBlink)
    : markers;
  useEffect(() => {
  if (mapRef.current && markers.length > 0) {
    const latitudes = markers.map(m => parseFloat(m.lat));
    const longitudes = markers.map(m => parseFloat(m.long));
    const avgLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
    const avgLong = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;

    mapRef.current.flyTo([avgLat, avgLong], 13); // Adjust zoom if needed
  }
}, [centerTrigger, markers]);

  return (
    <MapContainer
      center={center}
      zoom={zoomLevel}
      style={{ height: '90vh', width: '100%' }}
      scrollWheelZoom={true}
      ref = {mapRef}
    >
      <ZoomWatcher onZoomChange={setZoomLevel} />

      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />

      {visibleMarkers.map((marker, idx) => {
        const meterId = marker.source_meter_id || marker.meter_id;
        const extra = selectedMeterDetails[meterId];

        return (
          <Marker
            key={idx}
            position={[marker.lat, marker.long]}
            icon={shouldBlink(marker) ? blinkingIcon : defaultIcon}
            eventHandlers={{
              click: () => fetchMeterDetails(meterId),
            }}
          >
            <Popup>
              <div>
                <strong>Meter ID: {meterId}</strong><br />

                {/* ✅ Additional metadata */}
                {extra && (
                  <>
                    <span>DT Code: {extra.dt_code}</span><br />
                    <span>DT Capacity: {extra.dt_capacity}</span><br />
                  </>
                )}

                {/* ✅ Charts */}
                {parameter === 'Single Phasing' && marker.singlePhasingProfile?.length > 0 && (
                  <StepChart data={marker.singlePhasingProfile} />
                )}
                {parameter === 'Loading' && marker.loadingProfile?.length > 0 && (
                  <LoadChart data={marker.loadingProfile} />
                )}

                {/* ✅ Optional contextual info */}
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
        );
      })}
    </MapContainer>
  );
};

export default SimpleMap;
