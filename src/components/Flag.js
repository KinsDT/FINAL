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
  const [centerTrigger, setCenterTrigger] = useState(0);

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
      setCenterTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Error fetching meter data:', err);
    }
  };

  useEffect(() => {
    const fetchLoading = async () => {
      if (parameter === 'Loading' && area && date && meterMarkers.length > 0) {
        const meterIds = meterMarkers.map(m => m.meter_id).join(',');
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        try {
          const res = await fetch(
            `http://localhost:5000/api/loading-data?meterIds=${meterIds}&date=${formattedDate}`
          );
          const data = await res.json();
          const grouped = {};
        data.forEach(row => {
          const id = row.meter_id.toLowerCase();
          if (!grouped[id]) grouped[id] = [];
          grouped[id].push({
            block: Number(row.block),
            percentage_load: Number(row.percentage_load),
            flag: Number(row.flag)
          });
        });
          setLoadingData(grouped);
        } catch (err) {
          console.error('Error fetching loading data:', err);
        }
      }
    };
    fetchLoading();
  }, [parameter, area, date, meterMarkers]);

  useEffect(() => {
    const fetchSinglePhasing = async () => {
      if (parameter === 'Single Phasing' && area && date && block && meterMarkers.length > 0) {
        const meterIds = meterMarkers.map(m => m.meter_id).join(',');
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        try {
          const res = await fetch(
            `http://localhost:5000/api/meter-info?meter_id=${meterIds}&date=${formattedDate}`
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

        if (parameter === 'Loading') {
            const blockData = [...(loadingData[meterId] || [])].sort((a, b) => a.block - b.block);


            const shouldBlinkLoading = blockData.some(d => d.flag >= 3);

            return {
            ...marker,
            loadingProfile: blockData,      // for chart
            shouldBlinkLoading             // for red blinking
            };
        }

        // For Single Phasing
        const blockData = singlePhasingData
            .filter(d => d.source_meter_id?.toLowerCase() === meterId)
            .sort((a, b) => a.block - b.block);

        const hasAnyPhasing = blockData.some(b => b.single_phasing === 1);

        return {
            ...marker,
            singlePhasingProfile: blockData,      // for chart
            shouldBlinkPhasing: hasAnyPhasing     // for red blinking
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
          Loading and Single Phasing View
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <DatePicker
            format="DD/MM/YYYY"
            onChange={(d) => setDate(d)}
            style={{ width: 140,fontFamily: 'GT Walsheim Pro' }}
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

      <SimpleMap markers={enrichedMarkers} parameter={parameter} centerTrigger={centerTrigger} />
    </Content>
  );
};

export default Flag;