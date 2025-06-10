import React from 'react';
import { Layout } from 'antd';
import AggregationSelector from './AggregationSelector';
import MeterMap from './MeterMap';
import HeatmapSelector from './HeatmapSelector';

const { Content } = Layout;

export default function MainContent({
  center,
  locations,
  selectedParam,
  meterParamData,
  aggregation,
  setAggregation,
  heatmapAgg,
  setHeatmapAgg,
  heatmapData
}) {
  return (
    <Content style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Satellite Map of Meter Locations</h1>
      <AggregationSelector aggregation={aggregation} setAggregation={setAggregation} />
      <HeatmapSelector selected={heatmapAgg} onChange={setHeatmapAgg} />
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
  );
}
