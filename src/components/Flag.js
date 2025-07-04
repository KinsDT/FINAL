/*import React, { useState, useEffect } from 'react';
import { DatePicker, InputNumber, Select, Row, Col } from 'antd';
import SimpleMap from './SimpleMap';
import dayjs from 'dayjs'; // if not already installed, install it

const { Option } = Select;


const Flag = () => {
  const [date, setDate] = useState(null);
  const [block, setBlock] = useState(1);
  const [area, setArea] = useState('');
  const [parameter, setParameter] = useState('Loading');
  const [areas, setAreas] = useState([]);
  const [meterMarkers, setMeterMarkers] = useState([]); // { meter_id, lat, long }
  const [loadingData, setLoadingData] = useState([]);
  const [singlePhasingData, setSinglePhasingData] = useState([]);

  // Fetch area names
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/meter-data/areas');
        const data = await res.json();
        setAreas(data.areas);
      } catch (err) {
        console.error('Error fetching areas:', err);
      }
    };
    fetchAreas();
  }, []);

  // Fetch meter coordinates when area changes
  const handleAreaChange = async (selectedArea) => {
    setArea(selectedArea);
    setMeterMarkers([]); // clear on change
    setLoadingData([]);
    setSinglePhasingData([]);
    try {
      const res = await fetch(`http://localhost:5000/api/meter-data/meters-by-area?area=${selectedArea}`);
      const data = await res.json();
      setMeterMarkers(data); // array of { meter_id, lat, long }
    } catch (err) {
      console.error('Error fetching meter data:', err);
    }
  };

  // Fetch Loading Data
  useEffect(() => {
    const fetchLoading = async () => {
      if (
        parameter === 'Loading' &&
        area &&
        date &&
        block &&
        meterMarkers.length > 0
      ) {
        const meterIds = meterMarkers.map(m => m.meter_id).join(',');
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        try {
          const res = await fetch(
            `http://localhost:5000/api/loading-data?meterIds=${meterIds}&date=${formattedDate}&block=${block}`
          );
          const data = await res.json();
          setLoadingData(data);
        } catch (err) {
          console.error('Error fetching loading data:', err);
        }
      }
    };
    fetchLoading();
  }, [parameter, area, date, block, meterMarkers]);

  // Fetch Single Phasing Data
  useEffect(() => {
    const fetchSinglePhasing = async () => {
      if (
        parameter === 'Single Phasing' &&
        area &&
        date &&
        block &&
        meterMarkers.length > 0
      ) {
        const meterIds = meterMarkers.map(m => m.meter_id).join(',');
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        try {
          const res = await fetch(
            `http://localhost:5000/api/meter-info?meter_id=${meterIds}&date=${formattedDate}&block=${block}`
          );
          const data = await res.json();
          setSinglePhasingData(data);
        } catch (err) {
          console.error('Error fetching single phasing data:', err);
        }
      }
    };
    fetchSinglePhasing();
  }, [parameter, area, date, block, meterMarkers]);

  // Merge selected data
  const enrichedMarkers = meterMarkers.map(marker => {
    const meterId = marker.meter_id.toLowerCase();
    const extraData =
      parameter === 'Loading'
        ? loadingData.find(d => d.meter_id?.toLowerCase() === meterId)
        : singlePhasingData.find(d => d.source_meter_id?.toLowerCase() === meterId);

    return {
      ...marker,
      ...extraData,
    };
  });

  return (
    
    <div>
      <h1>Satellite Map of Meter Locations</h1>

      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col span={6}>
          <DatePicker
            format="DD/MM/YYYY"
            style={{ width: '100%' }}
            onChange={(d) => setDate(d)}
          />
        </Col>
        <Col span={6}>
          <InputNumber
            min={1}
            max={48}
            value={block}
            onChange={(v) => setBlock(v)}
            style={{ width: '100%' }}
          />
        </Col>
        <Col span={6}>
          <Select
            value={area}
            onChange={handleAreaChange}
            placeholder="Select Area"
            style={{ width: '100%' }}
          >
            {areas.map((a, idx) => (
              <Option key={idx} value={a}>
                {a}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={6}>
          <Select
            value={parameter}
            onChange={(v) => setParameter(v)}
            placeholder="Select Parameter"
            style={{ width: '100%' }}
          >
            <Option value="Loading">Loading</Option>
            <Option value="Single Phasing">Single Phasing</Option>
          </Select>
        </Col>
      </Row>

      <SimpleMap markers={enrichedMarkers} />
    </div>
    
  );
};

export default Flag;
*/

import React, { useState, useEffect } from 'react';
import { DatePicker, InputNumber, Select, Row, Col, Layout } from 'antd';
import SimpleMap from './SimpleMap';
import dayjs from 'dayjs';

const { Option } = Select;
const { Content } = Layout;

const Flag = () => {
  const [date, setDate] = useState(null);
  const [block, setBlock] = useState(1);
  const [area, setArea] = useState('');
  const [parameter, setParameter] = useState('Loading');
  const [areas, setAreas] = useState([]);
  const [meterMarkers, setMeterMarkers] = useState([]);
  const [loadingData, setLoadingData] = useState([]);
  const [singlePhasingData, setSinglePhasingData] = useState([]);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/meter-data/areas');
        const data = await res.json();
        setAreas(data.areas);
      } catch (err) {
        console.error('Error fetching areas:', err);
      }
    };
    fetchAreas();
  }, []);

  const handleAreaChange = async (selectedArea) => {
    setArea(selectedArea);
    setMeterMarkers([]);
    setLoadingData([]);
    setSinglePhasingData([]);
    try {
      const res = await fetch(`http://localhost:5000/api/meter-data/meters-by-area?area=${selectedArea}`);
      const data = await res.json();
      setMeterMarkers(data);
    } catch (err) {
      console.error('Error fetching meter data:', err);
    }
  };

  useEffect(() => {
    const fetchLoading = async () => {
      if (parameter === 'Loading' && area && date && block && meterMarkers.length > 0) {
        const meterIds = meterMarkers.map(m => m.meter_id).join(',');
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        try {
          const res = await fetch(
            `http://localhost:5000/api/loading-data?meterIds=${meterIds}&date=${formattedDate}&block=${block}`
          );
          const data = await res.json();
          setLoadingData(data);
        } catch (err) {
          console.error('Error fetching loading data:', err);
        }
      }
    };
    fetchLoading();
  }, [parameter, area, date, block, meterMarkers]);

  useEffect(() => {
    const fetchSinglePhasing = async () => {
      if (parameter === 'Single Phasing' && area && date && block && meterMarkers.length > 0) {
        const meterIds = meterMarkers.map(m => m.meter_id).join(',');
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        try {
          const res = await fetch(
            `http://localhost:5000/api/meter-info?meter_id=${meterIds}&date=${formattedDate}&block=${block}`
          );
          const data = await res.json();
          setSinglePhasingData(data);
        } catch (err) {
          console.error('Error fetching single phasing data:', err);
        }
      }
    };
    fetchSinglePhasing();
  }, [parameter, area, date, block, meterMarkers]);

  const enrichedMarkers = meterMarkers.map(marker => {
    const meterId = marker.meter_id.toLowerCase();
    const extraData =
      parameter === 'Loading'
        ? loadingData.find(d => d.meter_id?.toLowerCase() === meterId)
        : singlePhasingData.find(d => d.source_meter_id?.toLowerCase() === meterId);
    return {
      ...marker,
      ...extraData,
    };
  });

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
        }}>
          Satellite Map of Meter Locations
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <DatePicker
            format="DD/MM/YYYY"
            onChange={(d) => setDate(d)}
            style={{ width: 140 }}
          />
          <InputNumber
            min={1}
            max={48}
            value={block}
            onChange={v => setBlock(v)}
            style={{ width: 100 }}
          />
          <Select
            value={area}
            onChange={handleAreaChange}
            placeholder="Select Area"
            style={{
              width: 160,
              border: "1px solid var(--stroke-grey-subtle, #DDDDE3)",
              background: "var(--surface-background-white, #FFF)",
              fontFamily: 'GT Walsheim Pro'
            }}
          >
            {areas.map((a, idx) => (
              <Option key={idx} value={a}>{a}</Option>
            ))}
          </Select>
          <Select
            value={parameter}
            onChange={setParameter}
            placeholder="Select Parameter"
            style={{
              width: 160,
              border: "1px solid var(--stroke-grey-subtle, #DDDDE3)",
              background: "var(--surface-background-white, #FFF)",
              fontFamily: 'GT Walsheim Pro'
            }}
          >
            <Option value="Loading">Loading</Option>
            <Option value="Single Phasing">Single Phasing</Option>
          </Select>
        </div>
      </div>

      <SimpleMap markers={enrichedMarkers} />
    </Content>
  );
};

export default Flag;
