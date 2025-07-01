/*import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { paramToColumnMap } from '../utils/constants';

export default function useMeterData() {
  const [locations, setLocations] = useState([]);
  const [selectedParam, setSelectedParam] = useState(null);
  const [meterParamData, setMeterParamData] = useState({});
  const [aggregation, setAggregation] = useState(['avg']);
  const [heatmapAgg, setHeatmapAgg] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [selectedArea,setSelectedArea] = useState(null)
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

  // Fetch heatmap data
  useEffect(() => {
    if (!heatmapAgg || !selectedParam || locations.length === 0) {
      setHeatmapData([]);
      return;
    }

    const column = paramToColumnMap[selectedParam];
    if (!column) return;

    // Debug log before fetch
    console.log('🔍 Heatmap fetch:', {
      param: column,
      meterIdsCount: locations.length,
      aggregation: heatmapAgg,
    });

    fetch('http://localhost:5000/api/meters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        param: column,
        meterIds: locations.map(loc => loc.meterId),
        aggregation: heatmapAgg
      }),
    })
      .then(async res => {
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Failed to fetch heatmap data');
        }
        return res.json();
      })
      .then(data => {
        const points = locations.map(loc => {
          const aggVal = data.find(d => d.meter_id === loc.meterId && d.aggregation === heatmapAgg)?.parameter_value;
          return aggVal !== undefined ? {
            lat: loc.lat,
            lng: loc.lng,
            value: aggVal,
            meterId: loc.meterId
          } : null;
        }).filter(Boolean);
        setHeatmapData(points);
      })
      .catch(console.error);
  }, [heatmapAgg, selectedParam, locations]);

  // Fetch parameter data for meters
  useEffect(() => {
    if (!selectedParam || locations.length === 0 || aggregation.length === 0) {
      setMeterParamData({});
      return;
    }

    const column = paramToColumnMap[selectedParam];
    if (!column) return;

    // Debug log before fetch
    console.log('📊 Meter param fetch:', {
      param: column,
      meterIdsCount: locations.length,
      aggregation: aggregation.join(','),
    });

    fetch('http://localhost:5000/api/meters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        param: column,
        meterIds: locations.map(loc => loc.meterId),
        aggregation: aggregation.join(','),
      }),
    })
      .then(async res => {
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Failed to fetch meter param data');
        }
        return res.json();
      })
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
*/

import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { paramToColumnMap } from '../utils/constants';

export default function useMeterData() {
  const [locations, setLocations] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [filteredLocations, setFilteredLocations] = useState([]);
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

  // Filter locations based on selected area
  useEffect(() => {
    if (!selectedArea) {
      setFilteredLocations(locations);
    } else {
      setFilteredLocations(locations.filter(loc => loc.AREA === selectedArea));
    }
  }, [selectedArea, locations]);

  // Fetch heatmap data
  useEffect(() => {
    if (!heatmapAgg || !selectedParam || filteredLocations.length === 0) {
      setHeatmapData([]);
      return;
    }

    const column = paramToColumnMap[selectedParam];
    if (!column) return;

    console.log('🔍 Heatmap fetch:', {
      param: column,
      meterIdsCount: filteredLocations.length,
      aggregation: heatmapAgg,
    });

    fetch('http://localhost:5000/api/meters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        param: column,
        meterIds: filteredLocations.map(loc => loc.meterId),
        aggregation: heatmapAgg
      }),
    })
      .then(async res => {
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Failed to fetch heatmap data');
        }
        return res.json();
      })
      .then(data => {
        const points = filteredLocations.map(loc => {
          const aggVal = data.find(d => d.meter_id === loc.meterId && d.aggregation === heatmapAgg)?.parameter_value;
          return aggVal !== undefined ? {
            lat: loc.lat,
            lng: loc.lng,
            value: aggVal,
            meterId: loc.meterId
          } : null;
        }).filter(Boolean);
        setHeatmapData(points);
      })
      .catch(console.error);
  }, [heatmapAgg, selectedParam, filteredLocations]);

  // Fetch parameter data
  useEffect(() => {
    if (!selectedParam || filteredLocations.length === 0 || aggregation.length === 0) {
      setMeterParamData({});
      return;
    }

    const column = paramToColumnMap[selectedParam];
    if (!column) return;

    console.log('📊 Meter param fetch:', {
      param: column,
      meterIdsCount: filteredLocations.length,
      aggregation: aggregation.join(','),
    });

    fetch('http://localhost:5000/api/meters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        param: column,
        meterIds: filteredLocations.map(loc => loc.meterId),
        aggregation: aggregation.join(','),
      }),
    })
      .then(async res => {
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Failed to fetch meter param data');
        }
        return res.json();
      })
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
  }, [selectedParam, filteredLocations, aggregation]);

  return {
    locations,
    filteredLocations,
    selectedArea,
    setSelectedArea,
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
