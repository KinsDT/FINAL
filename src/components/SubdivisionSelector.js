import React, { useState } from 'react';
import { Select, Card } from 'antd';
import useMeterData from '../hooks/useMeterData';

const { Option } = Select;

export default function SubdivisionSelector() {
  const [selectedSubdivision, setSelectedSubdivision] = useState(null);
  const { locations } = useMeterData();

  // Filter meterIds for the selected AREA
  const meterIdsForArea = selectedSubdivision
    ? locations
        .filter(loc => loc.AREA === selectedSubdivision)
        .map(loc => loc.meterId)
    : [];

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px',maxWidth: '1000px', margin: '0 auto' }}>
      {/* Meter IDs Box (Left) */}
      <Card
        title="Total Meter IDs:"
        style={{
          width: '200px',
          left: '-160px',
          top:'-20px',
          maxHeight: '400px',
          overflowY: 'auto',
          flexShrink: 0,
        }}
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

      {/* Subdivision Selector (Right) */}
      <div style={{ flexGrow: 1 }}>
        <h1>Please select a subdivision:</h1>
        <Select
          style={{ width: '100%', marginBottom: '16px' }}
          placeholder="Choose a subdivision"
          onChange={setSelectedSubdivision}
          value={selectedSubdivision}
        >
          <Option value="Lakhipur_bec">Lakhipur</Option>
          <Option value="Bijni">Bijni</Option>
          <Option value="Gossaigaon">Gossaigaon</Option>
          {/* Add more as needed */}
        </Select>
      </div>
    </div>
  );
}
