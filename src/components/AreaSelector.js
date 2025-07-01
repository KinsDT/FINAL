// components/AreaSelector.js
import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

export default function AreaSelector({ selectedArea, setSelectedArea, availableAreas }) {
  return (
    <div style={{ display: 'inline-block', marginRight: '12px' }}>
      <span style={{ marginRight: 8, fontWeight: 500 }}>Area:</span>
      <Select
        placeholder="Select area"
        style={{ width: 160,fontFamily:'GT Walsheim Pro' }}
        value={selectedArea}
        onChange={setSelectedArea}
        allowClear
      >
        {availableAreas.map(area => (
          <Option key={area} value={area}>
            {area}
          </Option>
        ))}
      </Select>
    </div>
  );
}
