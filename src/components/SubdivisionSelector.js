import React, { useState, useMemo } from "react";
import { Select, Card, Divider, Row, Col, Tooltip } from "antd";
import useMeterData from "../hooks/useMeterData";
import PhasePieChart from "./PhasePieChart";
import VoltageInterruptionsAggregation from "./VoltageInterruptionsAggregation";
import PowerQualityAggregation from "./PowerQualityAggregation";
import QualityOfSupplyAggregation from "./QualityOfSupplyAggregation";
import "../styles/SubdivisionSelector.css";

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
      .catch(console.error);
  }, [showDashboard, selectedSubdivision]);

  React.useEffect(() => {
    if (!showDashboard || !meterIdsCSV) return;

    const fetchData = async () => {
    try {
      const [voltageRes, pqRes, qosRes] = await Promise.all([
        fetch(`http://localhost:5000/api/region-data?table=daily_qos_cut_outage&meterIds=${meterIdsCSV}`),
        fetch(`http://localhost:5000/api/region-data?table=block_wise_pq_template&meterIds=${meterIdsCSV}`),
        fetch(`http://localhost:5000/api/region-data?table=block_wise_qos_template&meterIds=${meterIdsCSV}`)
      ]);

      const voltageJson = await voltageRes.json();
      const pqJson = await pqRes.json();
      const qosJson = await qosRes.json();

      setVoltageData(voltageJson);
      setPqData(pqJson);
      setQosData(qosJson);
    } catch (error) {
      console.error("Error fetching region data:", error);
    }
  };

  fetchData();
}, [showDashboard, meterIdsCSV]);

  return (
    <div style={{ padding: 24,backgroundColor: '#FFFFFF' }}>
      {!showDashboard ? (
        <>
          <h2 style={{fontFamily:'GT Walsheim Pro',fontWeight:500,fontSize:20,marginBottom:16}}>Area-wise Dashboard</h2>
          <label style={{ fontFamily:'GT Walsheim Pro',fontWeight: 500,fontSize:16,display:'block'}}>Sub-division</label>
          <Select
            style={{ width: 300, marginTop: 8,display:'block' }}
            placeholder="Choose a subdivision"
            onChange={setSelectedSubdivision}
            value={selectedSubdivision}
          >
            <Option value="Lakhipur_bec">Lakhipur</Option>
            <Option value="Bijni">Bijni</Option>
            <Option value="Gossaigaon">Gossaigaon</Option>
          </Select>

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
                backgroundColor: '#1677ff',
                color: 'white',
                border: 'none',
                borderRadius: 4,
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
              color: '#1677ff',
              fontSize: 16,
              marginBottom: 16,
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>
        
            <div style={{ flexGrow: 1,maxWidth:2000 }}>
              <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: 'GT Walsheim Pro',fontWeight:500,fontSize:'18px',color:'#27272A',letterSpacing:'0px'}}>
              Showing details for sub-division {selectedSubdivision}
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
                    fontWeight:500,
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
              <Card title="Combined Data" style={{ marginBottom: 24 }}>
                <div className="subdivision-container">
                  <div className="pie-charts-box">
                    <PhasePieChart
                      title="No. of Consumers Phase Wise"
                      labels={["Phase a", "Phase b", "Phase c"]}
                      data={[consumers.a, consumers.b, consumers.c]}
                    />
                    <PhasePieChart
                      title="Load Phase Wise"
                      labels={["Phase a", "Phase b", "Phase c"]}
                      data={[load.a, load.b, load.c]}
                    />
                  </div>
                </div>
              </Card>

              
              <Card title="Reliability Indices" style={{ marginBottom: 24}}>
                <div
                  style={{
                    fontFamily: 'GT Walsheim Pro',
                    fontWeight: 500,
                    fontSize: 18,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '24px 40px',
                    justifyContent: 'flex-start',
                  }}
                >
                  <div className="stat-group">
                    <Tooltip title="System Average Interruption Frequency Index">
                      <div className="label">SAIFI (Consumers)</div>
                    </Tooltip>
                    <div className="value">{(pq_avg.saifi_cons_avg || 0).toFixed(3)}</div>
                  </div>
                  <div className = "stat-group">
                    <Tooltip title="System Average Interruption Frequency Index">
                      <div className="label">SAIFI (Load)</div>
                    </Tooltip>
                    <div className="value">{(pq_avg.saifi_load_avg || 0).toFixed(3)}</div>
                  </div>

                  <div className="stat-group">
                    <Tooltip title="Energy Not Supplied">
                      <div className="label">ENS</div>
                    </Tooltip>
                    <div className="value">{(pq_avg.ens_avg || 0).toFixed(3)}</div>
                  </div>
                  <div className = "stat-group">
                    <Tooltip title="Average Energy Not Supplied">
                      <div className="label">AENS</div>
                    </Tooltip>
                    <div className="value">{(pq_avg.aens_avg || 0).toFixed(3)}</div>
                  </div>

                  <div className="stat-group">
                    <Tooltip title="System Average Interruption Duration Index">
                      <div className="label">SAIDI (Consumers)</div>
                    </Tooltip>
                    <div className="value">{(pq_avg.saidi_cons_avg || 0).toFixed(3)}</div>
                  </div>
                  <div className = "stat-group">
                    <Tooltip title="System Average Interruption Duration Index">
                      <div className="label">SAIDI (Load)</div>
                    </Tooltip>
                    <div className="value">{(pq_avg.saidi_load_avg || 0).toFixed(3)}</div>
                  </div>

                  <div className="stat-group">
                    <Tooltip title="Customer Average Interruption Frequency Index">
                      <div className="label">CAIFI (Consumers)</div>
                    </Tooltip>
                    <div className="value">{(pq_avg.caifi_cons_avg || 0).toFixed(3)}</div>
                  </div>
                  <div className = "stat-group">
                    <Tooltip title="Customer Average Interruption Frequency Index (Load)">
                      <div className="label">CAIFI (Load)</div>
                    </Tooltip>
                    <div className="value">{(pq_avg.caifi_load_avg || 0).toFixed(3)}</div>
                  </div>

                  <div className="stat-group">
                    <Tooltip title="Overall Reliability of System">
                      <div className="label">ORS</div>
                    </Tooltip>
                    <div className="value">{(pq_avg.ors_avg || 0).toFixed(3)}</div>
                  </div>

                  <div className="stat-group">
                    <Tooltip title="Customer Average Interruption Duration Index">
                      <div className="label">CAIDI (Consumers)</div>
                    </Tooltip>
                    <div className="value">{(pq_avg.caidi_cons_avg || 0).toFixed(3)}</div>
                  </div>
                  <div className = "stat-group">
                    <Tooltip title="Customer Average Interruption Duration Index (Load)">
                      <div className="label">CAIDI (Load)</div>
                    </Tooltip>
                    <div className="value">{(pq_avg.caidi_load_avg || 0).toFixed(3)}</div>
                  </div>

                  <div className="stat-group">
                    <Tooltip title="Consumer Interruption Impact Index">
                      <div className="label">CIII (Consumers)</div>
                    </Tooltip>
                    <div className="value">{(pq_avg.ciii_cons_avg || 0).toFixed(3)}</div>
                  </div>
                  <div className = "stat-group">
                    <Tooltip title="Consumer Interruption Impact Index (Load)">
                      <div className="label">CIII (Load)</div>
                    </Tooltip>
                    <div className="value">{(pq_avg.ciii_load_avg || 0).toFixed(3)}</div>
                  </div>

                  <div className="stat-group">
                    <Tooltip title="Average Service Availability Index">
                      <div className="label">ASAI (Consumers)</div>
                    </Tooltip>
                    <div className="value">{(pq_avg.asai_cons_avg || 0).toFixed(3)}</div>
                  </div>
                  <div className = "stat-group">
                    <Tooltip title="Average Service Availability Index (Load)">
                      <div className="label">ASAI (Load)</div>
                    </Tooltip>
                    <div className="value">{(pq_avg.asai_load_avg || 0).toFixed(3)}</div>
                  </div>

                  <div className="stat-group">
                    <Tooltip title="Momentary Average Interruption Frequency Index">
                      <div className="label">MAIFI (Consumers)</div>
                    </Tooltip>
                    <div className="value">{(pq_avg.maifi_cons_avg || 0).toFixed(3)}</div>
                  </div>
                  <div className = "stat-group">
                    <Tooltip title="Momentary Average Interruption Frequency Index (Load)">
                      <div className="label">MAIFI (Load)</div>
                    </Tooltip>
                    <div className="value">{(pq_avg.maifi_load_avg || 0).toFixed(3)}</div>
                  </div>

                  <div className="stat-group">
                    <Tooltip title="Momentary Average Interruption Duration Index">
                      <div className="label">MAIDI (Consumers)</div>
                    </Tooltip>
                    <div className="value">{(pq_avg.maidi_cons_avg || 0).toFixed(3)}</div>
                  </div>
                  <div className = "stat-group">
                    <Tooltip title="Momentary Average Interruption Duration Index (Load)">
                      <div className="label">MAIDI (Load)</div>
                    </Tooltip>
                    <div className="value">{(pq_avg.maidi_load_avg || 0).toFixed(3)}</div>
                  </div>
                </div>
              </Card>

                {qosData && (
                  
                    <QualityOfSupplyAggregation data={qosData} />
                  
                )}

                {pqData && (
                  
                    <PowerQualityAggregation data={pqData} />
                  
                )}

                {voltageData && (
                  
                    <VoltageInterruptionsAggregation data={voltageData} />
                  
                )}
              </div>
            
        </>
      )}
    </div>
  );
}
