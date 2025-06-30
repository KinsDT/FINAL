import { useEffect } from 'react';

const AggregationSelector = ({ setAggregation }) => {
  useEffect(() => {
    setAggregation(['max', 'min', 'avg', 'stddev']);
  }, [setAggregation]);

  return null;
};

export default AggregationSelector;
