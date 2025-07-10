import React from 'react';
import { Layout, Select } from 'antd';
import AggregationSelector from './AggregationSelector';
import MeterMap from './MeterMap';
import HeatmapSelector from './HeatmapSelector';
import { parameterOptions } from '../utils/constants';

const { Option } = Select;
const { Content } = Layout;

export default function MainContent({
  center,
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
}) {
  // extract unique areas
  const availableAreas = [...new Set(locations.map(loc => loc.AREA).filter(Boolean))];

  // filter locations based on selected area
  const filteredLocations = selectedArea
    ? locations.filter(loc => loc.AREA === selectedArea)
    : locations;

  return (
    <Content style={{ padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 10px 20px',
        flexWrap: 'wrap'
      }}>
        <h1 style={{
  color: "var(--text-primary, #27272A)",
  fontFamily: "'GT Walsheim Pro'",
  fontSize: 20,
  fontStyle: "normal",
  fontWeight: 500,
  lineHeight: "normal"
}
}>DT Performance Map</h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontWeight: 600,fontFamily:'GT Walsheim Pro' }}></label>
          <Select
            value={selectedArea}
            onChange={value => setSelectedArea(value)}
            placeholder="Filter by Area"
            style={{ 
  border: "1px solid var(--stroke-grey-subtle, #DDDDE3)",
  background: "var(--surface-background-white, #FFF)",
  fontFamily:'GT Walsheim Pro'

 }}
            allowClear
          >
            {availableAreas.map(area => (
              <Option key={area} value={area}>{area}</Option>
            ))}
          </Select>

          <label style={{ fontWeight: 600 }}></label>
          <Select
            value={selectedParam}
            onChange={value => setSelectedParam(value)}
            style={{
  border: "1px solid var(--stroke-grey-subtle, #DDDDE3)",
  background: "var(--surface-background-white, #FFF)",
  fontFamily:'GT Walsheim Pro'
}
}
            placeholder="Filter by Monitoring Parameter"
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
        locations={filteredLocations} // ✅ filtered by area
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
