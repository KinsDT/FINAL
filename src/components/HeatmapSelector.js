// src/components/HeatmapSelector.js
import React from 'react';
import { Radio } from 'antd';

const options = [
  { label: 'Max', value: 'max' },
  { label: 'Min', value: 'min' },
  { label: 'Avg', value: 'avg' },
  { label: 'Standard Deviation', value: 'stddev' },
];

export default function HeatmapSelector({ selected, onChange }) {
  return (
    <div style={{
      position: 'absolute',
      top: 100,
      right: 20,
      zIndex: 1002,
      background: '#fff',
      padding: 12,
      borderRadius: 0,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    }}>
      <Radio.Group
        options={options}
        onChange={e => onChange(e.target.value)}
        value={selected}
        optionType="button"
        buttonStyle="solid"
      />
    </div>
  );
}
