import React from 'react';
import { Checkbox } from 'antd';
import { aggregationOptions } from '../utils/constants';

const AggregationSelector = ({ aggregation, setAggregation }) => {
  return (
      <div style={{ marginBottom: '12px', textAlign: 'center' }}>
        <Checkbox.Group
          options={aggregationOptions}
          value={aggregation}
          onChange={setAggregation}
          style={{ display: 'inline-flex', gap: '12px' }}
        />
    </div>
  );
};

export default AggregationSelector;
