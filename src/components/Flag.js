import React, { useState, useEffect } from 'react';
import { DatePicker, InputNumber, Select, Row, Col, Button } from 'antd';
import SimpleMap from './SimpleMap'; // Assuming the SimpleMap component is ready

const { Option } = Select;

const Flag = () => {
  const [date, setDate] = useState(null);
  const [block, setBlock] = useState(1);
  const [area, setArea] = useState('');
  const [parameter, setParameter] = useState('Loading');
  const [areas, setAreas] = useState([]);

  // Fetch the areas from the API
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/meter-data/areas');
        const data = await response.json();
        setAreas(data.areas);  // Set the areas received from the API
      } catch (error) {
        console.error('Error fetching areas:', error);
      }
    };
    fetchAreas();
  }, []);

  return (
    <div>
      <h1>Satellite Map of Meter Locations</h1>
      
      {/* The Four Bars */}
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col span={6}>
          <DatePicker
            format="DD/MM/YYYY"
            style={{ width: '100%' }}
            onChange={(date) => setDate(date)}
          />
        </Col>
        <Col span={6}>
          <InputNumber
            min={1}
            max={48}
            value={block}
            onChange={(value) => setBlock(value)}
            style={{ width: '100%' }}
            placeholder="Select Block"
          />
        </Col>
        <Col span={6}>
          <Select
            value={area}
            onChange={(value) => setArea(value)}
            placeholder="Select Area"
            style={{ width: '100%' }}
          >
            {areas.map((area, index) => (
              <Option key={index} value={area}>
                {area}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={6}>
          <Select
            value={parameter}
            onChange={(value) => setParameter(value)}
            placeholder="Select Parameter"
            style={{ width: '100%' }}
          >
            <Option value="Loading">Loading</Option>
            <Option value="Single Phasing">Single Phasing</Option>
          </Select>
        </Col>
      </Row>

      {/* Map */}
      <SimpleMap />
    </div>
  );
};

export default Flag;
