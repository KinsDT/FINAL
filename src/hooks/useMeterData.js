import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { paramToColumnMap } from '../utils/constants';

export default function useMeterData() {
  const [locations, setLocations] = useState([]);
  const [selectedParam, setSelectedParam] = useState(null);
  const [meterParamData, setMeterParamData] = useState({});
  const [aggregation, setAggregation] = useState(['avg']);
  const [heatmapAgg, setHeatmapAgg] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);

  // Load Excel coordinates
  useEffect(() => {
    fetch('/LOCATION_with_dtcapacity_checked.xlsx')
      .then(res => res.arrayBuffer())
      .then(data => {
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        const coords = jsonData
          .filter(row => row.LAT && row.LONG)
          .map(row => ({
            lat: row.LAT,
            lng: row.LONG,
            meterId: row.METER_ID ? row.METER_ID.toString().trim().toLowerCase() : 'unknown',
            AREA: row.AREA
          }));
        setLocations(coords);
      })
      .catch(err => console.error('Error loading Excel file:', err));
  }, []);

  useEffect(() => {
    if (!heatmapAgg || !selectedParam || locations.length === 0) {
      setHeatmapData([]);
      return;
    }
    const column = paramToColumnMap[selectedParam];
    const meterIds = locations.map(loc => loc.meterId).join(',');
    fetch(`http://localhost:5000/api/meters?param=${column}&meterIds=${meterIds}&aggregation=${heatmapAgg}`)
      .then(res => res.json())
      .then(data => {
        const points = locations.map(loc => {
          const aggVal = data.find(d => d.meter_id === loc.meterId && d.aggregation === heatmapAgg)?.parameter_value;
          return aggVal !== undefined ? { lat: loc.lat, lng: loc.lng, value: aggVal, meterId: loc.meterId } : null;
        }).filter(Boolean);
        setHeatmapData(points);
      });
  }, [heatmapAgg, selectedParam, locations]);

  useEffect(() => {
    if (!selectedParam || locations.length === 0 || aggregation.length === 0) {
      setMeterParamData({});
      return;
    }
    const column = paramToColumnMap[selectedParam];
    if (!column) return;
    const meterIds = locations.map(loc => loc.meterId).join(',');
    const aggQuery = aggregation.join(',');
    fetch(`http://localhost:5000/api/meters?param=${column}&meterIds=${meterIds}&aggregation=${aggQuery}`)
      .then(res => res.json())
      .then(data => {
        const paramMap = {};
        data.forEach(({ meter_id, parameter_value, aggregation }) => {
          const key = meter_id.toString().trim().toLowerCase();
          if (!paramMap[key]) paramMap[key] = {};
          paramMap[key][aggregation] = parameter_value;
        });
        setMeterParamData(paramMap);
      })
      .catch(console.error);
  }, [selectedParam, locations, aggregation]);

  return {
    locations,
    selectedParam,
    setSelectedParam,
    meterParamData,
    aggregation,
    setAggregation,
    heatmapAgg,
    setHeatmapAgg,
    heatmapData
  };
}
