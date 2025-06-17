import React, { useState } from "react";
import { Select, Card, Divider, Row, Col, Statistic } from "antd";
import useMeterData from "../hooks/useMeterData";
import PhasePieChart from "./PhasePieChart";
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

// Combined Data Box as a functional component
function CombinedDataBox() {
  return (
    <div className="combined-data-box">
      <div style={{ fontWeight: 600, marginBottom: 8 }}>
        Number of Consumers Phase Wise
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <span>Phase a:</span>
        <span></span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <span>Phase b:</span>
        <span></span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <span>Phase c:</span>
        <span></span>
      </div>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Load Phase Wise</div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <span>Phase a:</span>
        <span></span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <span>Phase b:</span>
        <span></span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Phase c:</span>
        <span></span>
      </div>
    </div>
  );
}

// Voltage Interruptions Aggregation Component
function VoltageInterruptionsAggregation({ data }) {
  if (!data || data.length === 0) return <div>No data available</div>;

  // Filter for non-zero cut_duration values
  const cutDurationFiltered = data.filter(
    (row) => row.cut_duration != null && parseFloat(row.cut_duration) !== 0
  );

  // Filter for non-zero outage_duration values
  const outageDurationFiltered = data.filter(
    (row) => row.outage_duration != null && parseFloat(row.outage_duration) !== 0 &&parseFloat(row.outage_duration) <1440//testing 1 day
  );

  // Calculate average cut_duration
  const avgCutDuration =
    cutDurationFiltered.length > 0
      ? cutDurationFiltered.reduce((sum, row) => sum + parseFloat(row.cut_duration), 0) /
        cutDurationFiltered.length
      : 0;

  // Calculate average outage_duration
  const avgOutageDuration =
    outageDurationFiltered.length > 0
      ? outageDurationFiltered.reduce((sum, row) => sum + parseFloat(row.outage_duration), 0) /
        outageDurationFiltered.length
      : 0;

  // Calculate maximum cut_duration
  const maxCutDuration =
    data.length > 0
      ? Math.max(...data.map(row => parseFloat(row.cut_duration) || 0))
      : 0;

  // Calculate maximum outage_duration
  const maxOutageDuration =
    outageDurationFiltered.length > 0
      ? Math.max(...outageDurationFiltered.map(row => parseFloat(row.outage_duration) || 0))
      : 0;

  // Calculate total counts for additional context
  const totalCutCount = cutDurationFiltered.length;
  const totalOutageCount = outageDurationFiltered.length;

  return (
    <div style={{ marginTop: "16px" }}>
      <h3>Voltage Interruptions - Aggregated Data</h3>
      
      {/* Cut Duration Section */}
      <Card title="Cut Duration Analysis" style={{ marginBottom: "16px"}}>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic 
              title="Average Cut Duration" 
              value={avgCutDuration.toFixed(2)}
              suffix="minutes"   
            />
          </Col>
          <Col span={8}>
            <Statistic 
              title="Maximum Cut Duration" 
              value={maxCutDuration.toFixed(2)} 
              suffix="minutes"
            />
          </Col>
          <Col span={8}>
            <Statistic 
              title="Total Cut Count" 
              value={totalCutCount} 
              suffix="events"
            />
          </Col>
        </Row>
      </Card>

      {/* Outage Duration Section */}
      <Card title="Outage Duration Analysis" style={{ marginBottom: "16px" }}>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic 
              title="Average Outage Duration" 
              value={avgOutageDuration.toFixed(2)} 
              suffix="minutes"
            />
          </Col>
          <Col span={8}>
            <Statistic 
              title="Maximum Outage Duration" 
              value={maxOutageDuration.toFixed(2)} 
              suffix="minutes"
            />
          </Col>
          <Col span={8}>
            <Statistic 
              title="Total Outage Count" 
              value={totalOutageCount} 
              suffix="events"
            />
          </Col>
        </Row>
      </Card>

      {/* Summary Section */}
      <Card title="Summary Statistics">
        <Row gutter={16}>
          <Col span={12}>
            <Statistic 
              title="Records with Cut Events" 
              value={cutDurationFiltered.length} 
              suffix={`of ${data.length}`}
            />
          </Col>
          <Col span={12}>
            <Statistic 
              title="Records with Outage Events" 
              value={outageDurationFiltered.length} 
              suffix={`of ${data.length}`}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
}

// Power Quality Aggregation Component
function PowerQualityAggregation({ data }) {
  if (!data || data.length === 0) return <div>No data available</div>;

  // Filter for non-zero voltage phase values
  const voltagePhaseFiltered = data.filter(
    (row) =>
      row.voltage_pha != null && row.voltage_pha !== 0 &&
      row.voltage_phb != null && row.voltage_phb !== 0 &&
      row.voltage_phc != null && row.voltage_phc !== 0
  );

  // Filter for non-zero symmetrical components
  const v1Filtered = data.filter((row) => row.v1 != null && row.v1 !== 0);
  const v2Filtered = data.filter((row) => row.v2 != null && row.v2 !== 0);
  const v0Filtered = data.filter((row) => row.v0 != null && row.v0 !== 0);

  // Filter for non-zero voltage unbalance factor
  const vufFiltered = data.filter((row) => row.vuf != null && row.vuf !== 0);

  // Calculate averages for voltage phases
  const avgVoltagePhA =
    voltagePhaseFiltered.length > 0
      ? voltagePhaseFiltered.reduce((sum, row) => sum + row.voltage_pha, 0) /
        voltagePhaseFiltered.length
      : 0;
  const avgVoltagePhB =
    voltagePhaseFiltered.length > 0
      ? voltagePhaseFiltered.reduce((sum, row) => sum + row.voltage_phb, 0) /
        voltagePhaseFiltered.length
      : 0;
  const avgVoltagePhC =
    voltagePhaseFiltered.length > 0
      ? voltagePhaseFiltered.reduce((sum, row) => sum + row.voltage_phc, 0) /
        voltagePhaseFiltered.length
      : 0;

  // Calculate averages for symmetrical components
  const avgV1 =
    v1Filtered.length > 0
      ? v1Filtered.reduce((sum, row) => sum + row.v1, 0) / v1Filtered.length
      : 0;
  const avgV2 =
    v2Filtered.length > 0
      ? v2Filtered.reduce((sum, row) => sum + row.v2, 0) / v2Filtered.length
      : 0;
  const avgV0 =
    v0Filtered.length > 0
      ? v0Filtered.reduce((sum, row) => sum + row.v0, 0) / v0Filtered.length
      : 0;

  // Calculate average for voltage unbalance factor
  const avgVuf =
    vufFiltered.length > 0
      ? vufFiltered.reduce((sum, row) => sum + row.vuf, 0) / vufFiltered.length
      : 0;

  return (
    <div style={{ marginTop: "16px" }}>
      <h3>Power Quality - Aggregated Data</h3>
      
      {/* Voltage Phase Section */}
      <Card title="Phase Voltage Averages (V)" style={{ marginBottom: "16px" }}>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic title="Average voltage_pha" value={avgVoltagePhA.toFixed(2)} suffix="V" />
          </Col>
          <Col span={8}>
            <Statistic title="Average voltage_phb" value={avgVoltagePhB.toFixed(2)} suffix="V" />
          </Col>
          <Col span={8}>
            <Statistic title="Average voltage_phc" value={avgVoltagePhC.toFixed(2)} suffix="V" />
          </Col>
        </Row>
      </Card>

      {/* Symmetrical Components Section */}
      <Card title="Symmetrical Components Averages (V)" style={{ marginBottom: "16px" }}>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic title="Average v1 (Positive)" value={avgV1.toFixed(2)} suffix="V" />
          </Col>
          <Col span={8}>
            <Statistic title="Average v2 (Negative)" value={avgV2.toFixed(2)} suffix="V" />
          </Col>
          <Col span={8}>
            <Statistic title="Average v0 (Zero)" value={avgV0.toFixed(2)} suffix="V" />
          </Col>
        </Row>
      </Card>

      {/* Voltage Unbalance Factor Section */}
      <Card title="Voltage Unbalance Factor">
        <Row gutter={16}>
          <Col span={24}>
            <Statistic title="Average VUF" value={avgVuf.toFixed(4)} />
          </Col>
        </Row>
      </Card>
    </div>
  );
}

// Quality of Supply Aggregation Component
function QualityOfSupplyAggregation({ data }) {
  const [nominalVoltage, setNominalVoltage] = useState('');
  const [adjustedVoltages, setAdjustedVoltages] = useState(null);
  if (!data || data.length === 0) return <div>No data available</div>;

  // Filter for pfph values where pfph_a, pfph_b, pfph_c are all != 0
  const pfphFiltered = data.filter(
    (row) =>
      row.pfph_a !== 0 && row.pfph_b !== 0 && row.pfph_c !== 0
  );

  // Filter for voltage values where va_avg_percent, vb_avg_percent, vc_avg_percent are all != -100
  const voltageFiltered = data.filter(
    (row) =>
      row.va_avg_percent > -25 &&
      row.vb_avg_percent > -25 && //undervoltage threshold 180V ....so -25 percent deviation from nominal 240V.
      row.vc_avg_percent > -25
  );

  // Filter for vu_percent and iu_percent (not null, not 0, not 100, not 200)
  const vuIuFiltered = data.filter(
    (row) =>
      row.vu_percent != null &&
      row.vu_percent > 0 &&
      row.vu_percent < 100 &&
      row.iu_percent != null &&
      row.iu_percent > 0 &&
      row.iu_percent < 100
  );

  // Calculate averages
  const avgPfavg3ph =
    pfphFiltered.length > 0
      ? pfphFiltered.reduce((sum, row) => sum + row.pfavg3ph, 0) /
        pfphFiltered.length
      : 0;
  const avgPfphA =
    pfphFiltered.length > 0
      ? pfphFiltered.reduce((sum, row) => sum + row.pfph_a, 0) /
        pfphFiltered.length
      : 0;
  const avgPfphB =
    pfphFiltered.length > 0
      ? pfphFiltered.reduce((sum, row) => sum + row.pfph_b, 0) /
        pfphFiltered.length
      : 0;
  const avgPfphC =
    pfphFiltered.length > 0
      ? pfphFiltered.reduce((sum, row) => sum + row.pfph_c, 0) /
        pfphFiltered.length
      : 0;

  const avgV3phAvgPercent =
    voltageFiltered.length > 0
    ? voltageFiltered.reduce((sum, row) => sum + row.v3ph_avg_percent, 0) /
      voltageFiltered.length
    : 0;
  const avgVaAvgPercent =
    voltageFiltered.length > 0
      ? voltageFiltered.reduce((sum, row) => sum + row.va_avg_percent, 0) /
        voltageFiltered.length
      : 0;
  const avgVbAvgPercent =
    voltageFiltered.length > 0
      ? voltageFiltered.reduce((sum, row) => sum + row.vb_avg_percent, 0) /
        voltageFiltered.length
      : 0;
  const avgVcAvgPercent =
    voltageFiltered.length > 0
      ? voltageFiltered.reduce((sum, row) => sum + row.vc_avg_percent, 0) /
        voltageFiltered.length
      : 0;

  const avgVuPercent =
    vuIuFiltered.length > 0
      ? vuIuFiltered.reduce((sum, row) => sum + row.vu_percent, 0) /
        vuIuFiltered.length
      : 0;
  const avgIuPercent =
    vuIuFiltered.length > 0
      ? vuIuFiltered.reduce((sum, row) => sum + row.iu_percent, 0) /
        vuIuFiltered.length
      : 0;

  function handleNominalVoltageChange(e) {
    const V = Number(e.target.value);
    setNominalVoltage(e.target.value);

    if (!V) {
      setAdjustedVoltages(null);
      return;
    }

    // Use the previously calculated averages
    setAdjustedVoltages({
      v3ph: ((avgV3phAvgPercent * 240 / 100 + 240 - V) / V) * 100,
      va: ((avgVaAvgPercent * 240 / 100 + 240 - V) / V) * 100,
      vb: ((avgVbAvgPercent * 240 / 100 + 240 - V) / V) * 100,
      vc: ((avgVcAvgPercent * 240 / 100 + 240 - V) / V) * 100,
    });
  }
  return (
    <div style={{ marginTop: "16px" }}>
      <h3>Quality of Supply - Aggregated Data</h3>
      {/* Power Factor Section */}
      <Card title="Power Factor Averages" style={{ marginBottom: "16px" }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic title="Average pfavg3ph" value={avgPfavg3ph.toFixed(4)} />
          </Col>
          <Col span={6}>
            <Statistic title="Average pfph_a" value={avgPfphA.toFixed(4)} />
          </Col>
          <Col span={6}>
            <Statistic title="Average pfph_b" value={avgPfphB.toFixed(4)} />
          </Col>
          <Col span={6}>
            <Statistic title="Average pfph_c" value={avgPfphC.toFixed(4)} />
          </Col>
        </Row>
      </Card>
      {/* Voltage Section */}
      <Card title="Voltage Averages (%)" style={{ marginBottom: "16px",position: "relative" }} extra={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span>Nominal Voltage:</span>
      <input
        type="number"
        value={nominalVoltage}
        onChange={handleNominalVoltageChange}
        style={{ width: 70, marginRight: 8 }}
        placeholder="240V"
        min={1}
      />
    </div>
      }>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="Average v3ph_avg_percent"
              value={
                adjustedVoltages
                  ? adjustedVoltages.v3ph.toFixed(2)
                  :avgV3phAvgPercent.toFixed(2)}
              suffix="%"
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Average va_avg_percent"
              value={
                adjustedVoltages
                ? adjustedVoltages.va.toFixed(2)
                : avgVaAvgPercent.toFixed(2)}
              suffix="%"
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Average vb_avg_percent"
              value={
                adjustedVoltages
                ? adjustedVoltages.vb.toFixed(2)
                : avgVbAvgPercent.toFixed(2)}
              suffix="%"
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Average vc_avg_percent"
              value={
                adjustedVoltages
                ? adjustedVoltages.vc.toFixed(2)
                : avgVcAvgPercent.toFixed(2)}
              suffix="%"
            />
          </Col>
        </Row>
      </Card>
      {/* VU/IU Section */}
      <Card title="VU/IU Averages (%)">
        <Row gutter={16}>
          <Col span={12}>
            <Statistic
              title="Average vu_percent"
              value={avgVuPercent.toFixed(2)}
              suffix="%"
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="Average iu_percent"
              value={avgIuPercent.toFixed(2)}
              suffix="%"
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default function SubdivisionSelector() {
  const [regionData, setRegionData] = useState(null);
  const [selectedSubdivision, setSelectedSubdivision] = useState(null);
  const { locations } = useMeterData();
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [reliabilityData, setReliabilityData] = useState([]);
  const [consumers, setConsumers] = useState({ a: 0, b: 0, c: 0 });
  const [load, setLoad] = useState({ a: 0, b: 0, c: 0 });

  const meterIdsForArea = selectedSubdivision
    ? locations.filter((loc) => loc.AREA === selectedSubdivision).map((loc) => loc.meterId)
    : [];
  React.useEffect(() => {
    if (selectedSubdivision) {
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
        })
        .catch(console.error);
    }
  }, [selectedSubdivision]);

  const fetchRegionData = async (table) => {
    if (!table || !meterIdsForArea.length) return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/region-data?table=${table}&meterIds=${meterIdsForArea.join(",")}`
      );
      const data = await response.json();
      setRegionData(data);
    } catch (err) {
      console.error("Error fetching region data:", err);
      setRegionData(null);
    }
  };

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Meter IDs Box (Left) */}
      <Card
        title="Total Meter IDs:"
        style={{
          width: "220px",
          maxHeight: "400px",
          overflowY: "auto",
          flexShrink: 0,
        }}
        bodyStyle={{ padding: 12 }}
      >
        {meterIdsForArea.length > 0 ? (
          meterIdsForArea.map((meterId, index) => (
            <div key={index} style={{ marginBottom: "8px" }}>
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
          style={{ width: "100%", marginBottom: 16 }}
          placeholder="Choose a subdivision"
          onChange={setSelectedSubdivision}
          value={selectedSubdivision}
        >
          <Option value="Lakhipur_bec">Lakhipur</Option>
          <Option value="Bijni">Bijni</Option>
          <Option value="Gossaigaon">Gossaigaon</Option>
        </Select>

        <Divider style={{ margin: "16px 0" }} />

        <div>
          <h2 style={{ marginBottom: 12 }}>Combined Data</h2>
          <div className="subdivision-container">
            <CombinedDataBox />
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
        </div>
        <Divider style={{ margin: "16px 0" }} />
        <Card title="Aggregated Reliability Indices" style={{ marginBottom: 16 }}>
          <div>
            <strong>Number of Consumers Phase Wise</strong>
            <div>Phase a: {consumers.a}</div>
            <div>Phase b: {consumers.b}</div>
            <div>Phase c: {consumers.c}</div>
          </div>
          <Divider />
          <div>
            <strong>Load Phase Wise (kW)</strong>
            <div>Phase a: {load.a}</div>
            <div>Phase b: {load.b}</div>
            <div>Phase c: {load.c}</div>
          </div>
        </Card>
        <h3>Select a parameter to view the aggregated values of the region</h3>
        <Select
          style={{ width: "100%", marginBottom: "24px" }}
          placeholder="-- Choose a parameter --"
          value={selectedParameter}
          onChange={(value) => {
            setSelectedParameter(value);
            fetchRegionData(value);
          }}
        >
          {parameters.map((param) => (
            <Option key={param.value} value={param.value}>
              {param.label}
            </Option>
          ))}
        </Select>
        {regionData && selectedParameter === "block_wise_qos_template" && (
          <QualityOfSupplyAggregation data={regionData} />
        )}
        {regionData && selectedParameter === "block_wise_pq_template"&&(
          <PowerQualityAggregation data={regionData}/>
        )
        }
        {regionData && selectedParameter === "daily_qos_cut_outage" && (
          <VoltageInterruptionsAggregation data={regionData}/>
        )}
      </div>
    </div>
  );
}
