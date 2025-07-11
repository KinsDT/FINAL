import React, { useState, useMemo } from "react";
import { Select,Spin, Card, Divider, Row, Col, Tooltip,Radio,DatePicker } from "antd";
import useMeterData from "../hooks/useMeterData";
import PhasePieChart from "./PhasePieChart";
import VoltageInterruptionsAggregation from "./VoltageInterruptionsAggregation";
import PowerQualityAggregation from "./PowerQualityAggregation";
import QualityOfSupplyAggregation from "./QualityOfSupplyAggregation";
import "../styles/SubdivisionSelector.css";
import dayjs from "dayjs";
const { Option } = Select;

const parameters = [
  { value: "block_wise_qos_template", label: "Quality of Supply" },
  { value: "block_wise_pq_template", label: "Power Quality" },
  { value: "daily_qos_cut_outage", label: "Voltage Interruptions" },
];

const areaMap = {
  Lakhipur_bec: 11,
  Bijni: 12,
  Gossaigaon: 13,
};

export default function SubdivisionSelector() {
  const [voltageData, setVoltageData] = useState(null);
  const [pqData, setPqData] = useState(null);
  const [qosData, setQosData] = useState(null);

  const [selectedSubdivision, setSelectedSubdivision] = useState(null);
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('daily'); // 'daily' or 'monthly'
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const { locations } = useMeterData();
  const [reliabilityData, setReliabilityData] = useState([]);
  const [consumers, setConsumers] = useState({ a: 0, b: 0, c: 0 });
  const [load, setLoad] = useState({ a: 0, b: 0, c: 0 });
  const [pq_avg, setPQ_avg] = useState({});
  const [showAllMeters, setShowAllMeters] = useState(false);

  const meterIdsForArea = useMemo(() => {
    return selectedSubdivision
      ? locations.filter((loc) => loc.AREA === selectedSubdivision).map((loc) => loc.meterId)
      : [];
  }, [selectedSubdivision, locations]);

  const meterIdsCSV = useMemo(() => meterIdsForArea.join(","), [meterIdsForArea]);

  React.useEffect(() => {
    if (!showDashboard || !selectedSubdivision) return;
      // Start loading

    fetch(`http://localhost:5000/api/reliability-indices?area=${areaMap[selectedSubdivision]}`)
      .then((res) => res.json())
      .then((data) => {
        setReliabilityData(data);
        setConsumers({
          a: data.reduce((sum, row) => sum + (row.ca || 0), 0),
          b: data.reduce((sum, row) => sum + (row.cb || 0), 0),
          c: data.reduce((sum, row) => sum + (row.cc || 0), 0),
        });
        setLoad({
          a: data.reduce((sum, row) => sum + (row.la || 0), 0),
          b: data.reduce((sum, row) => sum + (row.lb || 0), 0),
          c: data.reduce((sum, row) => sum + (row.lc || 0), 0),
        });

        const avg = (key) => data.length ? data.reduce((sum, r) => sum + (r[key] || 0), 0) / data.length : 0;

        setPQ_avg({
          saifi_cons_avg: avg("saifi_cons"),
          saidi_cons_avg: avg("saidi_cons"),
          caifi_cons_avg: avg("caifi_cons"),
          caidi_cons_avg: avg("caidi_cons"),
          ciii_cons_avg:  avg("ciii_cons"),
          asai_cons_avg:  avg("asai_cons"),
          maifi_cons_avg: avg("maifi_cons"),
          maidi_cons_avg: avg("maidi_cons"),

          saifi_load_avg: avg("saifi_load"),
          saidi_load_avg: avg("saidi_load"),
          caifi_load_avg: avg("caifi_load"),
          caidi_load_avg: avg("caidi_load"),
          ciii_load_avg:  avg("ciii_load"),
          asai_load_avg:  avg("asai_load"),
          maifi_load_avg: avg("maifi_load"),
          maidi_load_avg: avg("maidi_load"),

          ens_avg:        avg("ens"),
          aens_avg:       avg("aens"),
          ors_avg:        avg("ors"),
          ca_avg:         avg("ca"),
        });
      })
      .catch(console.error)
  }, [showDashboard, selectedSubdivision]);

  React.useEffect(() => {
    if (!showDashboard || !meterIdsCSV) return;
    setLoading(true);
const fetchData = async () => {
  try {
    const baseUrl = 'http://localhost:5000/api/region-data';
    const commonParams = `&meterIds=${meterIdsCSV}&mode=${mode}`;
    
    // Determine date/month param
    const timeParam =
      mode === 'daily' && selectedDate
        ? `&date=${dayjs(selectedDate).format('YYYY-MM-DD')}`
        : mode === 'monthly' && selectedMonth
        ? `&month=${dayjs(selectedMonth).format('YYYY-MM')}`
        : '';

    const voltageUrl = `${baseUrl}?table=daily_qos_cut_outage${commonParams}${timeParam}`;
    const pqUrl = `${baseUrl}?table=block_wise_pq_template${commonParams}${timeParam}`;
    const qosUrl = `${baseUrl}?table=block_wise_qos_template${commonParams}${timeParam}`;

    const [voltageRes, pqRes, qosRes] = await Promise.all([
      fetch(voltageUrl),
      fetch(pqUrl),
      fetch(qosUrl)
    ]);

    const voltageJson = await voltageRes.json();
    const pqJson = await pqRes.json();
    const qosJson = await qosRes.json();

    setVoltageData(voltageJson);
    setPqData(pqJson);
    setQosData(qosJson);
  } catch (error) {
    console.error("Error fetching region data:", error);
  } finally {
    setLoading(false);
  }
};

  fetchData();
}, [showDashboard, meterIdsCSV,mode,selectedDate,selectedMonth]);
    const styles = {
  fontFamily: 'GT Walsheim Pro',
  fontWeight: 500,
  fontSize: 18,
  display: 'flex',
  flexWrap: 'wrap',
  gap: '24px 40px',
  justifyContent: 'flex-start',
};
  return (
    <div style={{ padding: 24,backgroundColor: '#FFFFFF' }}>
      
      {!showDashboard ? (
        <>
          <h2 style={{fontFamily:'GT Walsheim Pro',fontWeight:500,fontSize:20,marginBottom:16}}>DT Health Insights</h2>
          
          <Select
            style={{ width: 300, marginTop: 8,display:'block' }}
            placeholder="Choose an Area"
            onChange={setSelectedSubdivision}
            value={selectedSubdivision}
          >
            <Option value="Lakhipur_bec">Lakhipur</Option>
            <Option value="Bijni">Bijni</Option>
            <Option value="Gossaigaon">Gossaigaon</Option>
          </Select>
          <div style={{ marginTop: 16 }}>
  <Radio.Group
    value={mode}
    onChange={(e) => setMode(e.target.value)}
    style={{ display: 'flex', gap: 16 }}
  >
    <Radio value="daily">Daily</Radio>
    <Radio value="monthly">Monthly</Radio>
  </Radio.Group>
</div>

{/* Conditional Date or Month Picker */}
<div style={{ marginTop: 12 }}>
  {mode === 'daily' ? (
    <DatePicker
      style={{ width: 240 }}
      placeholder="Select Date"
      value={selectedDate ? dayjs(selectedDate) : null}
      onChange={(d) => setSelectedDate(d)}
    />
  ) : (
    <DatePicker
      picker="month"
      style={{ width: 240 }}
      placeholder="Select Month"
      value={selectedMonth ? dayjs(selectedMonth) : null}
      onChange={(d) => setSelectedMonth(d)}
    />
  )}
</div>
          <div style={{ marginTop:600}}>
            <button
              onClick={() =>{ 
                setVoltageData(null);
                setPqData(null);
                setQosData(null);
                setReliabilityData([]);
                setConsumers({ a: 0, b: 0, c: 0 });
                setLoad({ a: 0, b: 0, c: 0 });
                setShowDashboard(true);
              }}
              disabled={!selectedSubdivision}
              style={{
                position:'fixed',
                right:60,
                bottom:24,
                padding: '8px 16px',
                backgroundColor: '#1773BE',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: selectedSubdivision ? 'pointer' : 'not-allowed',
                zIndex:100,
              }}
            >
              Get Data →
            </button>
          </div>
        </>
      ) : (
        <>
          <button
            onClick={() => setShowDashboard(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#27272A',
              fontSize: 20,
              marginBottom: 16,
              cursor: 'pointer',
              fontFamily:'GT Walsheim Pro',
              fontWeight:500,
            }}
          >
            ← DT Health Insights
          </button>
        
            <div style={{ flexGrow: 1,maxWidth:2000 }}>
              <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: 'GT Walsheim Pro',fontWeight:500,fontSize:'18px',color:'#27272A',letterSpacing:'0px'}}>
              Showing details for {selectedSubdivision}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px',padding: '16px 0px 0px' }}>
              {(showAllMeters ? meterIdsForArea : meterIdsForArea.slice(0, 20)).map((meterId, index) => (
                <div
                  key={index}
                  style={{
                    padding: '4px 12px 4px 12px',
                    display:"flex",
                    backgroundColor: '#EBEBF0',
                    borderRadius: '30px',
                    fontSize: 16,
                    fontFamily: 'GT Walsheim Pro',
                    fontWeight:400,
                    letterSpacing:'0px',
                    color:'#27272A',
                    width:'125px',
                    height:'32px',
                    justifyContent:"center",
                    alignItems:"center"
                  }}
                >
                  {meterId.replace(/^sc/,'SC')}
                </div>
              ))}
              {meterIdsForArea.length > 20 && (
                <div
                  style={{
                    padding: '4px 12px',
                    cursor: 'pointer',
                    color: '#1677ff',
                    fontSize: 14,
                  }}
                  onClick={() => setShowAllMeters(!showAllMeters)}
                >
                  {showAllMeters ? 'Show Less' : 'Show All'}
                </div>
              )}
            </div>
          </div>
          
              <Card title="Combined Data" style={{ marginBottom: 24,borderColor:'#DDDDE3',borderRadius:16 }}>
                
                <div className="subdivision-container">
                  <div className="pie-charts-box">
                    <PhasePieChart
                      title="Phase Wise Consumers"
                      labels={["Phase R", "Phase Y", "Phase B"]}
                      data={[consumers.a, consumers.b, consumers.c]}
                    />
                    <PhasePieChart
                      title="Phase Wise Load"
                      labels={["Phase R", "Phase Y", "Phase B"]}
                      data={[load.a, load.b, load.c]}
                    />
                  </div>
                </div>
                
              </Card>

              
              <Card title="Reliability Indices" style={{ marginBottom: 24, borderColor: '#DDDDE3', borderRadius: 16 }}>

  {/* Consumer Specific */}
  <Card type="inner" title="Consumer Specific" style={{ marginBottom: 16 }}>
    <div style={styles}>
      <div className="stat-group">
        <Tooltip title="System Average Interruption Frequency Index">
          <div className="label">SAIFI</div>
        </Tooltip>
        <div className="value">{(pq_avg.saifi_cons_avg || 0).toFixed(2)} (Nos.)</div>
      </div>
      <div className="stat-group">
        <Tooltip title="System Average Interruption Duration Index">
          <div className="label">SAIDI</div>
        </Tooltip>
        <div className="value">{(pq_avg.saidi_cons_avg || 0).toFixed(2)} (Mins.)</div>
      </div>
      <div className="stat-group">
        <Tooltip title="Customer Average Interruption Frequency Index">
          <div className="label">CAIFI</div>
        </Tooltip>
        <div className="value">{(pq_avg.caifi_cons_avg || 0).toFixed(2)} (Nos.)</div>
      </div>
      <div className="stat-group">
        <Tooltip title="Customer Average Interruption Duration Index">
          <div className="label">CAIDI</div>
        </Tooltip>
        <div className="value">{(pq_avg.caidi_cons_avg || 0).toFixed(2)} (Mins.)</div>
      </div>
      <div className="stat-group">
        <Tooltip title="Consumer Interruption Impact Index">
          <div className="label">CIII</div>
        </Tooltip>
        <div className="value">{(pq_avg.ciii_cons_avg || 0).toFixed(2)} (Nos.)</div>
      </div>
      <div className="stat-group">
        <Tooltip title="Average Service Availability Index">
          <div className="label">ASAI</div>
        </Tooltip>
        <div className="value">{(pq_avg.asai_cons_avg || 0).toFixed(2)} %</div>
      </div>
      <div className="stat-group">
        <Tooltip title="Momentary Average Interruption Frequency Index">
          <div className="label">MAIFI</div>
        </Tooltip>
        <div className="value">{(pq_avg.maifi_cons_avg || 0).toFixed(2)} (Nos.)</div>
      </div>
      <div className="stat-group">
        <Tooltip title="Momentary Average Interruption Duration Index">
          <div className="label">MAIDI</div>
        </Tooltip>
        <div className="value">{(pq_avg.maidi_cons_avg || 0).toFixed(2)} (Mins.)</div>
      </div>
    </div>
  </Card>

  {/* Load Specific */}
  <Card type="inner" title="Load Specific" style={{ marginBottom: 16 }}>
    <div style={styles}>
      <div className="stat-group">
        <Tooltip title="System Average Interruption Frequency Index">
          <div className="label">SAIFI</div>
        </Tooltip>
        <div className="value">{(pq_avg.saifi_load_avg || 0).toFixed(2)} (Nos.)</div>
      </div>
      <div className="stat-group">
        <Tooltip title="System Average Interruption Duration Index">
          <div className="label">SAIDI</div>
        </Tooltip>
        <div className="value">{(pq_avg.saidi_load_avg || 0).toFixed(2)} (Mins.)</div>
      </div>
      <div className="stat-group">
        <Tooltip title="Customer Average Interruption Frequency Index (Load)">
          <div className="label">CAIFI</div>
        </Tooltip>
        <div className="value">{(pq_avg.caifi_load_avg || 0).toFixed(2)} (Nos.)</div>
      </div>
      <div className="stat-group">
        <Tooltip title="Customer Average Interruption Duration Index (Load)">
          <div className="label">CAIDI</div>
        </Tooltip>
        <div className="value">{(pq_avg.caidi_load_avg || 0).toFixed(2)} (Mins.)</div>
      </div>
      <div className="stat-group">
        <Tooltip title="Consumer Interruption Impact Index (Load)">
          <div className="label">CIII</div>
        </Tooltip>
        <div className="value">{(pq_avg.ciii_load_avg || 0).toFixed(2)} (Nos.)</div>
      </div>
      <div className="stat-group">
        <Tooltip title="Average Service Availability Index (Load)">
          <div className="label">ASAI</div>
        </Tooltip>
        <div className="value">{(pq_avg.asai_load_avg || 0).toFixed(2)} %</div>
      </div>
      <div className="stat-group">
        <Tooltip title="Momentary Average Interruption Frequency Index (Load)">
          <div className="label">MAIFI</div>
        </Tooltip>
        <div className="value">{(pq_avg.maifi_load_avg || 0).toFixed(2)} (Nos.)</div>
      </div>
      <div className="stat-group">
        <Tooltip title="Momentary Average Interruption Duration Index (Load)">
          <div className="label">MAIDI</div>
        </Tooltip>
        <div className="value">{(pq_avg.maidi_load_avg || 0).toFixed(2)} (Mins.)</div>
      </div>
    </div>
  </Card>

  {/* System Specific */}
  <Card type="inner" title="System Specific">
    <div style={styles}>
      <div className="stat-group">
        <Tooltip title="Energy Not Supplied">
          <div className="label">ENS</div>
        </Tooltip>
        <div className="value">{(pq_avg.ens_avg || 0).toFixed(2)} kWh</div>
      </div>
      <div className="stat-group">
        <Tooltip title="Average Energy Not Supplied">
          <div className="label">AENS</div>
        </Tooltip>
        <div className="value">{(pq_avg.aens_avg || 0).toFixed(2)} kWh</div>
      </div>
      <div className="stat-group">
        <Tooltip title="Overall Reliability of System">
          <div className="label">ORS</div>
        </Tooltip>
        <div className="value">{(pq_avg.ors_avg || 0).toFixed(2)} %</div>
      </div>
    </div>
  </Card>
</Card>


              
              <Spin spinning={loading} tip="Loading Data...">
                {qosData && (
                    <QualityOfSupplyAggregation data={qosData} loading={loading}/>
                )}
                {pqData && (
                    <PowerQualityAggregation data={pqData} loading={loading} />
                )}
                {voltageData && (
                    <VoltageInterruptionsAggregation data={voltageData} loading={loading} />
                )}
              </Spin>
              </div>
            
        </>
      )}
    </div>
  );
}
