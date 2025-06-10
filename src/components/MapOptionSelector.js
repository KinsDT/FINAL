import React from 'react';
import { Radio } from 'antd';

const options = [
  { label: 'One', value: 'one' },
  { label: 'Two', value: 'two' },
  { label: 'Three', value: 'three' },
  { label: 'Four', value: 'four' }
];

function MapOptionSelector({ selectedOption, setSelectedOption }) {
  return (
    <div style={{
      position: 'absolute',
      right: 30,
      top: 100,
      zIndex: 1001,
      background: '#fff',
      padding: 16,
      borderRadius: 8,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    }}>
      <Radio.Group
        options={options}
        onChange={e => setSelectedOption(e.target.value)}
        value={selectedOption}
        optionType="button"
        buttonStyle="solid"
      />
    </div>
  );
}

export default MapOptionSelector;
