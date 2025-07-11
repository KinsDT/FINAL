/*import React, { useEffect, useState } from 'react';
import { useMapEvents, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// ... rest of your code ...


function createColoredIcon(color, radius = 15) {
  return L.divIcon({
    html: `<div style="background:${color}; width:${radius}px; height:${radius}px; border-radius:${radius/2}px; border:2px solid #000; display:flex; align-items:center; justify-content:center; color:#000; font-weight:bold; font-size:${radius/2}px;"></div>`,
    className: '',
    iconSize: [radius, radius],
  });
}

export function CustomMarkerLayer({
  locations,
  selectedParam,
  meterParamData,
  aggregation,
  heatmapAgg,
  heatmapData,
  min,
  max,
  getHeatmapColor,
}) {
  const [currentZoom, setCurrentZoom] = useState(12);

  const map = useMapEvents({
    zoomend: () => {
      setCurrentZoom(map.getZoom());
    },
  });

  useEffect(() => {
    setCurrentZoom(map.getZoom());
  }, []);

  return (
    <>
      {currentZoom >= 12 && locations.map(({ lat, lng, meterId }, idx) => {
        let fillColor = 'white';
        if (heatmapAgg && heatmapData && heatmapData.length > 0) {
          const pt = heatmapData.find(p => p.meterId === meterId);
          if (
            pt &&
            pt.value !== undefined &&
            pt.value !== null &&
            !isNaN(Number(pt.value)) &&
            min !== max
          ) {
            fillColor = getHeatmapColor(Number(pt.value), min, max);
          }
        }
        const icon = createColoredIcon(fillColor, 15);
        return (
          <Marker
            key={idx}
            position={[lat, lng]}
            icon={icon}
          >
            <Popup>
              Meter ID: {meterId === "unknown" ? "(Missing)" : meterId}
              <br />
              {selectedParam ? (
                <>
                  <div><strong>{selectedParam}:</strong></div>
                  <div><strong>MAX:</strong> {meterParamData[meterId]?.max ?? 'N/A'}</div>
                  <div><strong>MIN:</strong> {meterParamData[meterId]?.min ?? 'N/A'}</div>
                  <div><strong>AVG:</strong> {meterParamData[meterId]?.avg != null ? Number(meterParamData[meterId].avg).toFixed(2) : 'N/A'}</div>
                  <div><strong>STDDEV:</strong> {meterParamData[meterId]?.stddev != null ? Number(meterParamData[meterId].stddev).toFixed(2) : 'N/A'}</div>

                </>
              ) : (
                'Select a parameter'
              )}
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
*/

import React, { useEffect, useState } from 'react';
import { useMapEvents, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

function createColoredIcon(color, radius = 15) {
  return L.divIcon({
    html: `<div style="background:${color}; width:${radius}px; height:${radius}px; border-radius:${radius / 2}px; border:2px solid #000; display:flex; align-items:center; justify-content:center; color:#000; font-weight:bold; font-size:${radius / 2}px;"></div>`,
    className: '',
    iconSize: [radius, radius],
  });
}

export function CustomMarkerLayer({
  locations,
  selectedParam,
  meterParamData,
  aggregation,
  heatmapAgg,
  heatmapData,
  min,
  max,
  getHeatmapColor,
  fromDate,
  toDate
}) {
  const [currentZoom, setCurrentZoom] = useState(12);

  const map = useMapEvents({
    zoomend: () => {
      setCurrentZoom(map.getZoom());
    },
  });

  useEffect(() => {
    setCurrentZoom(map.getZoom());
  }, [map]);

  return (
    <>
      {currentZoom >= 12 && locations.map(({ lat, lng, meterId }, idx) => {
        let fillColor = 'white';

        if (heatmapAgg && heatmapData?.length > 0) {
          const pt = heatmapData.find(p => p.meterId === meterId);
          if (
            pt &&
            pt.value !== undefined &&
            !isNaN(Number(pt.value)) &&
            min !== max
          ) {
            fillColor = getHeatmapColor(Number(pt.value), min, max);
          }
        }

        const icon = createColoredIcon(fillColor, 15);

        return (
          <Marker key={idx} position={[lat, lng]} icon={icon}>
            <Popup>
              <div><strong>Meter ID:</strong> {meterId === 'unknown' ? '(Missing)' : meterId}</div>
              {selectedParam ? (
                <>
                  <div><strong>{selectedParam}</strong></div>
                  <div><strong>MAX:</strong> {meterParamData[meterId]?.max ?? 'N/A'}</div>
                  <div><strong>MIN:</strong> {meterParamData[meterId]?.min ?? 'N/A'}</div>
                  <div><strong>AVG:</strong> {meterParamData[meterId]?.avg != null ? Number(meterParamData[meterId].avg).toFixed(2) : 'N/A'}</div>
                  <div><strong>STDDEV:</strong> {meterParamData[meterId]?.stddev != null ? Number(meterParamData[meterId].stddev).toFixed(2) : 'N/A'}</div>
                  {fromDate && toDate && (
                    <div style={{ marginTop: 4, fontSize: 12 }}>
                      From: {fromDate.format('YYYY-MM-DD')}<br />
                      To: {toDate.format('YYYY-MM-DD')}
                    </div>
                  )}
                </>
              ) : (
                'Select a parameter'
              )}
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
