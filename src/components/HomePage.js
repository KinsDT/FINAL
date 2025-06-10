import React, { useState } from 'react';
import { Layout } from 'antd';
import useMeterData from '../hooks/useMeterData';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import 'antd/dist/reset.css';
import 'leaflet/dist/leaflet.css';
import '../styles/HomePage.css';

export default function HomePage() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    locations,
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

  return (
    <>
      <img
        src="/kimbal-logo.png"
        alt="Logo"
        className="logo"
      />

      <Layout style={{ height: '100vh' }}>
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          selectedParam={selectedParam}
          onRadioChange={(e) => setSelectedParam(e.target.value)}

        />

        <Layout>
          <MainContent
            center={center}
            locations={locations}
            selectedParam={selectedParam}
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
