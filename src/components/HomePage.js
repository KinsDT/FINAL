/*import React, { useState } from 'react';
import { Layout, Select, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import useMeterData from '../hooks/useMeterData';
import MainContent from './MainContent';
import { parameterOptions } from '../utils/constants';
import 'antd/dist/reset.css';
import 'leaflet/dist/leaflet.css';
import '../styles/HomePage.css';
import { GlobalOutlined, EnvironmentOutlined, BarChartOutlined } from '@ant-design/icons';
import Sidebar from '../components/Sidebar'; // Adjust path if needed

const { Option } = Select;
const { Sider, Content } = Layout;

export default function HomePage() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    locations,
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
  } = useMeterData();

  const center = locations.length ? [locations[0].lat, locations[0].lng] : [20, 78];

  // Helper to check if a button matches current route
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <Layout style={{ height: '100vh'}}>
        <Sider width={200}>
          <Sidebar />
        </Sider>

        <Layout style={{ padding: '0 0px 0px', width: '100%',backgroundColor:'#ffffff',fontFamily: 'GT Walsheim Pro'}}>
          <MainContent
            center={center}
            locations={locations}
            selectedArea ={selectedArea}
            setSelectedArea={setSelectedArea}
            selectedParam={selectedParam}
            setSelectedParam={setSelectedParam}
            meterParamData={meterParamData}
            aggregation={aggregation}
            setAggregation={setAggregation}
            heatmapAgg={heatmapAgg}
            setHeatmapAgg={setHeatmapAgg}
            heatmapData={heatmapData}
          />
        </Layout>
      </Layout>
    </>
  );
}
*/


import React, { useState } from 'react';
import { Layout } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import useMeterData from '../hooks/useMeterData';
import MainContent from './MainContent';
import Sidebar from '../components/Sidebar'; // Adjust path if needed
import 'antd/dist/reset.css';
import 'leaflet/dist/leaflet.css';
import '../styles/HomePage.css';

const { Sider } = Layout;

export default function HomePage() {
  const [collapsed, setCollapsed] = useState(false);
  const [fromDate, setFromDate] = useState(null); // <-- Moved up
  const [toDate, setToDate] = useState(null);     // <-- Moved up

  const navigate = useNavigate();
  const location = useLocation();

  // Convert to ISO string if not null, else undefined
  const isoFromDate = fromDate ? fromDate.format('YYYY-MM-DD') : undefined;
  const isoToDate = toDate ? toDate.format('YYYY-MM-DD') : undefined;

  // Pass dates to the hook
  const {
    locations,
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
  } = useMeterData(isoFromDate, isoToDate);

  const center = locations.length ? [locations[0].lat, locations[0].lng] : [20, 78];

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider width={200}>
        <Sidebar />
      </Sider>
      <Layout style={{ padding: '0 0px 0px', width: '100%', backgroundColor: '#ffffff', fontFamily: 'GT Walsheim Pro' }}>
        <MainContent
          center={center}
          locations={locations}
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
          selectedParam={selectedParam}
          setSelectedParam={setSelectedParam}
          meterParamData={meterParamData}
          aggregation={aggregation}
          setAggregation={setAggregation}
          heatmapAgg={heatmapAgg}
          setHeatmapAgg={setHeatmapAgg}
          heatmapData={heatmapData}
          fromDate={fromDate}
          toDate={toDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
        />
      </Layout>
    </Layout>
  );
}
