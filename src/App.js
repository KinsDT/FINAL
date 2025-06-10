/*import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import * as XLSX from 'xlsx';
import Sidebar from './components/Sidebar';
import AggregationSelector from './components/AggregationSelector';
import MeterMap from './components/MeterMap';
import { paramToColumnMap } from './utils/constants';
import 'antd/dist/reset.css';
import 'leaflet/dist/leaflet.css';
import HeatmapSelector from './components/HeatmapSelector';

const { Content } = Layout;

function App() {
  const [locations, setLocations] = useState([]);
  const [selectedParam, setSelectedParam] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [meterParamData, setMeterParamData] = useState({});
  const [aggregation, setAggregation] = useState(['avg']);
  const [heatmapAgg, setHeatmapAgg] = useState(null); // e.g., 'max', 'min', etc.
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

  const center = locations.length ? [locations[0].lat, locations[0].lng] : [20, 78];
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
      // Map to [{lat, lng, value}]
      const points = locations.map(loc => {
        const aggVal = data.find(d => d.meter_id === loc.meterId && d.aggregation === heatmapAgg)?.parameter_value;
        return aggVal !== undefined ? { lat: loc.lat, lng: loc.lng, value: aggVal,meterId: loc.meterId } : null;
      }).filter(Boolean);
      setHeatmapData(points);
    });
}, [heatmapAgg, selectedParam, locations]);
  // Fetch parameter data when relevant values change
  useEffect(() => {
    if (!selectedParam || locations.length === 0 || aggregation.length === 0) {
      setMeterParamData({});
      return;
    }

    const column = paramToColumnMap[selectedParam];
    if (!column) return;

    const meterIds = locations.map(loc => loc.meterId).join(',');
    const aggQuery = aggregation.join(','); // "avg,min" etc.

    fetch(`http://localhost:5000/api/meters?param=${column}&meterIds=${meterIds}&aggregation=${aggQuery}`)
      .then(res => res.json())
      .then(data => {
        const paramMap = {}; // { meterId: { avg: val, max: val, ... } }

        data.forEach(({ meter_id, parameter_value, aggregation }) => {
          const key = meter_id.toString().trim().toLowerCase();
          if (!paramMap[key]) paramMap[key] = {};
          paramMap[key][aggregation] = parameter_value;
        });

        setMeterParamData(paramMap);
      })
      .catch(console.error);
  }, [selectedParam, locations, aggregation]);

  const onRadioChange = e => setSelectedParam(e.target.value);
  

  return (
    <>
      <img
        src="/kimbal-logo.png"
        alt="Logo"
        style={{
          position: 'fixed',
          top: 10,
          right: 10,
          width: 150,
          height: 'auto',
          zIndex: 1000,
        }}
      />

      <Layout style={{ height: '100vh' }}>
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          selectedParam={selectedParam}
          onRadioChange={onRadioChange}
        />

        <Layout>
          <Content style={{ padding: '20px' }}>
            <h1 style={{ textAlign: 'center' }}>Satellite Map of Meter Locations</h1>

            <AggregationSelector aggregation={aggregation} setAggregation={setAggregation} />
            <HeatmapSelector selected={heatmapAgg} onChange={setHeatmapAgg}/>
            <MeterMap
              center={center}
              locations={locations}
              selectedParam={selectedParam}
              meterParamData={meterParamData}
              aggregation={aggregation}
              heatmapAgg={heatmapAgg}
              heatmapData={heatmapData}
            />
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default App;
*/
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Thirdpage from './pages/Thirdpage'
function App() {
  return (
  <Routes>
    <Route path= "/" element={<HomePage/>} />
    <Route path="/Thirdpage" element={<Thirdpage/>}/>

  </Routes>
  );
}

export default App;
