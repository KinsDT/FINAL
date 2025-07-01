import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { HeatmapLayer } from 'react-leaflet-heatmap-layer-v3';
import { CustomMarkerLayer } from './CustomMarkerLayer';
import L from 'leaflet';
import { Marker, Popup, DivIcon } from 'react-leaflet';
import {useNavigate} from 'react-router-dom';
import HeatmapSelector from './HeatmapSelector';

// ---- Gradient and Color Helpers ----
const gradient = [
  { stop: 0.0, color: '#0000ff' },   // blue
  { stop: 0.65, color: '#00ff00' },  // lime
  { stop: 1.0, color: '#ff0000' },   // red
];

function interpolateColor(color1, color2, factor) {
  const c1 = color1.match(/\w\w/g).map(x => parseInt(x, 16));
  const c2 = color2.match(/\w\w/g).map(x => parseInt(x, 16));
  const result = c1.map((c, i) => Math.round(c + (c2[i] - c) * factor));
  return `#${result.map(x => x.toString(16).padStart(2, '0')).join('')}`;
}

function getHeatmapColor(value, min, max) {
  if (max === min) return gradient[0].color;
  const norm = (value - min) / (max - min);
  for (let i = 1; i < gradient.length; i++) {
    if (norm <= gradient[i].stop) {
      const prev = gradient[i - 1];
      const next = gradient[i];
      const localNorm = (norm - prev.stop) / (next.stop - prev.stop);
      return interpolateColor(prev.color, next.color, localNorm);
    }
  }
  return gradient[gradient.length - 1].color;
}
function getAreaCenters(locations) {
  const areaGroups = {};
  locations.forEach(loc => {
    if (!loc.AREA) return;
    if (!areaGroups[loc.AREA]) areaGroups[loc.AREA] = [];
    areaGroups[loc.AREA].push(loc);
  });
  return Object.entries(areaGroups).map(([area, locs]) => {
    const lat = locs.reduce((sum, l) => sum + Number(l.lat), 0) / locs.length;
    const lng = locs.reduce((sum, l) => sum + Number(l.lng), 0) / locs.length;
    return { area, lat, lng };
  });
}


// ---- MeterMap Component ----
const MeterMap = ({
  center,
  locations,
  selectedParam,
  meterParamData,
  aggregation,
  heatmapAgg,
  heatmapData,
  setHeatmapAgg
}) => {
  // Find min and max for color normalization (for heatmap values)
  const navigate = useNavigate()
  const values = heatmapData.map(p => Number(p.value)).filter(v => !isNaN(v));
  const min = values.length > 0 ? Math.min(...values) : 0;
  const max = values.length > 0 ? Math.max(...values) : 1;

  return (
    <div style={{ position: 'relative', height: '80vh', width: '100%' }}>
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%',backgroundColor:'#ffffff' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="&copy; Esri"
        />

        <CustomMarkerLayer
          locations={locations}
          selectedParam={selectedParam}
          meterParamData={meterParamData}
          aggregation={aggregation}
          heatmapAgg={heatmapAgg}
          heatmapData={heatmapData}
          min={min}
          max={max}
          getHeatmapColor={getHeatmapColor}
        />


        {heatmapAgg && heatmapData && heatmapData.length > 0 && (
          <HeatmapLayer
            fitBoundsOnLoad
            fitBoundsOnUpdate
            points={heatmapData}
            longitudeExtractor={m => m.lng}
            latitudeExtractor={m => m.lat}
            intensityExtractor={m => Number(m.value)}
            max={max}
            radius={30}
            blur={20}
            gradient={{ 0.4: 'blue', 0.65: 'lime', 1.0: 'red' }}
          />
        )}
        {getAreaCenters(locations).map(({ area, lat, lng }, idx) => (
    <Marker
      key={idx}
      position={[lat, lng]}
      icon={L.divIcon({
        className: "",
        html: `<div style="padding:4px 12px;border-radius:8px;font-weight:bold;font-size:15px;color:#fff;font-family: 'GT Walsheim Pro';">${area}</div>`,
      })}
      interactive={false}
    />
  ))}
      </MapContainer>
      <HeatmapSelector selected={heatmapAgg} onChange={setHeatmapAgg} />
    </div>
  );
};

export default MeterMap;

