import React, { useState } from 'react';
import { Select, Card, Divider } from 'antd';
import useMeterData from '../hooks/useMeterData';
import PhasePieChart from './PhasePieChart';
import '../styles/SubdivisionSelector.css';

const { Option } = Select;
const parameters = [
  { value: 'voltage', label: 'Quality of Supply' },
  { value: 'current', label: 'Power Quality' },
  { value: 'powerfactor', label: 'Voltage Interruptions' },
];

// Combined Data Box as a functional component
function CombinedDataBox() {
  return (
    <div className="combined-data-box">
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Number of Consumers Phase Wise</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>Phase a:</span>
        <span></span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>Phase b:</span>
        <span></span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <span>Phase c:</span>
        <span></span>
      </div>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Load Phase Wise</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>Phase a:</span>
        <span></span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>Phase b:</span>
        <span></span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Phase c:</span>
        <span></span>
      </div>
    </div>
  );
}

export default function SubdivisionSelector() {
  const [selectedSubdivision, setSelectedSubdivision] = useState(null);
  const { locations } = useMeterData();
  const [selectedParameter, setSelectedParameter] = useState(null);
  const meterIdsForArea = selectedSubdivision
    ? locations.filter(loc => loc.AREA === selectedSubdivision).map(loc => loc.meterId)
    : [];

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Meter IDs Box (Left) */}
      <Card
        title="Total Meter IDs:"
        style={{
          width: '220px',
          maxHeight: '400px',
          overflowY: 'auto',
          flexShrink: 0,
        }}
        bodyStyle={{ padding: 12 }}
      >
        {meterIdsForArea.length > 0 ? (
          meterIdsForArea.map((meterId, index) => (
            <div key={index} style={{ marginBottom: '8px' }}>
              {meterId}
            </div>
          ))
        ) : (
          <div>No meter IDs found for this area.</div>
        )}
      </Card>

      {/* Subdivision Selector and Combined Data (Right) */}
      <div style={{ flexGrow: 1 }}>
        <h1>Please select a subdivision:</h1>
        <Select
          style={{ width: '100%', marginBottom: 16 }}
          placeholder="Choose a subdivision"
          onChange={setSelectedSubdivision}
          value={selectedSubdivision}
        >
          <Option value="Lakhipur_bec">Lakhipur</Option>
          <Option value="Bijni">Bijni</Option>
          <Option value="Gossaigaon">Gossaigaon</Option>
        </Select>

        <Divider style={{ margin: '16px 0' }} />

        <div>
          <h2 style={{ marginBottom: 12 }}>Combined Data</h2>
          <div className="subdivision-container">
            <CombinedDataBox />
            <div className="pie-charts-box">
              <PhasePieChart
                title="No. of Consumers Phase Wise"
                labels={['Phase a', 'Phase b', 'Phase c']}
                data={[10, 15, 20]}
              />
              <PhasePieChart
                title="Load Phase Wise"
                labels={['Phase a', 'Phase b', 'Phase c']}
                data={[20, 5, 10]}
              />
            </div>
          </div>
        </div>
        <Divider style={{ margin: '16px 0' }} />
        <h3>Select a parameter to view the aggregated values of the region</h3>
        <Select
          style={{ width: '100%', marginBottom: '24px' }}
          placeholder="-- Choose a parameter --"
          value={selectedParameter}
          onChange={setSelectedParameter}
        >
          {parameters.map((param) => (
            <Option key={param.value} value={param.value}>
              {param.label}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  );
}
