
import React, { useState } from 'react';
import { Layout, Select } from 'antd';
import useMeterData from '../hooks/useMeterData';
import MainContent from './MainContent';
import { parameterOptions } from '../utils/constants';
import 'antd/dist/reset.css';
import 'leaflet/dist/leaflet.css';
import '../styles/HomePage.css';
import { Button } from 'antd'

const { Option } = Select;
const{Sider,Content} = Layout
export default function HomePage() {
  const [collapsed, setCollapsed] = useState(false); // not used anymore
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
      

      <Layout style={{ height: '100vh' }}>
        <Sider
  width={200}
  style={{
    background: '#f7f7f7',
    padding: '16px 12px',
    borderRight: '1px solid #ddd',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  }}
>
  <div style={{ marginBottom: '24px' }}>
    <img
      src="/kimbal-logo.png"
      alt="Logo"
      style={{ width: '85%', objectFit: 'contain' }}
    />
  </div>

  <Button
    type="text"
    style={{
      width: '100%',
      textAlign: 'left',
      padding: '8px 12px',
      borderRadius: '8px',
      background: '#e6f7ff',
      fontWeight: 500
    }}
    onClick={() => window.location.href = '/Secondpage'}
  >
    Area Details
  </Button>

  <Button
    type="text"
    style={{
      width: '100%',
      textAlign: 'left',
      padding: '8px 12px',
      borderRadius: '8px',
      background: '#e6f7ff',
      fontWeight: 500
    }}
    onClick={() => window.location.href = '/Thirdpage'}
  >
    Meter Details
  </Button>
  <Button
    type="text"
    style={{
      width: '100%',
      textAlign: 'left',
      padding: '8px 12px',
      borderRadius: '8px',
      background: '#e6f7ff',
      fontWeight: 500
    }}
    onClick={() => window.location.href = ''}
  >
    HomePage
  </Button>
</Sider>
        <Layout style={{ padding: '0 24px 24px', width: '100%' }}>
          

          <MainContent
            center={center}
            locations={locations}
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
