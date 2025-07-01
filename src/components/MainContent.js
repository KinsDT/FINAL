import React from 'react';
import { Layout } from 'antd';
import AggregationSelector from './AggregationSelector';
import MeterMap from './MeterMap';
import HeatmapSelector from './HeatmapSelector';
import { Select } from 'antd';
import { parameterOptions } from '../utils/constants'; // adjust if needed
const { Option } = Select;

const { Content } = Layout;

export default function MainContent({
  center,
  locations,
  selectedParam,
  setSelectedParam,
  meterParamData,
  aggregation,
  setAggregation,
  heatmapAgg,
  setHeatmapAgg,
  heatmapData
}) {
  return (
    <Content style={{ padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 10px 20px',
        flexWrap: 'wrap',
        
      }}>
        <h1 style={{ margin: 0,fontFamily: 'GT Walsheim Pro',fontStyle:'Bold' }}>Satellite Map of Meter Locations</h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', }}>
          <label style={{ fontWeight: 600,fontFamily: 'GT Walsheim Pro' }}>Parameter:</label>
          <Select
            value={selectedParam}
            onChange={value => setSelectedParam(value)}
            style={{ width: 250,fontFamily: 'GT Walsheim Pro' }}
            placeholder="Select parameter"
          >
            {parameterOptions.map((param) => (
              <Option key={param} value={param}>{param}</Option>
            ))}
          </Select>
        </div>
      </div>

      <AggregationSelector aggregation={aggregation} setAggregation={setAggregation} />
      <MeterMap
        center={center}
        locations={locations}
        selectedParam={selectedParam}
        meterParamData={meterParamData}
        aggregation={aggregation}
        heatmapAgg={heatmapAgg}
        heatmapData={heatmapData}
        setHeatmapAgg={setHeatmapAgg}
      />
    </Content>
  );
}
