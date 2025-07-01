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
  const [regionData, setRegionData] = useState(null);
  const [selectedSubdivision, setSelectedSubdivision] = useState(null);
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);

  const { locations } = useMeterData();
  const [reliabilityData, setReliabilityData] = useState([]);
  const [consumers, setConsumers] = useState({ a: 0, b: 0, c: 0 });
  const [load, setLoad] = useState({ a: 0, b: 0, c: 0 });
  const [pq_avg, setPQ_avg] = useState({});

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
    if (!showDashboard || !selectedParameter || !meterIdsCSV) return;

    fetch(`http://localhost:5000/api/region-data?table=${selectedParameter}&meterIds=${meterIdsCSV}`)
      .then((res) => res.json())
      .then(setRegionData)
      .catch(err => {
        console.error("Error fetching region data:", err);
        setRegionData(null);
      });
  }, [showDashboard, selectedParameter, meterIdsCSV]);

  return (
    <div style={{ padding: 24 }}>
      {!showDashboard ? (
        <>
          <h2>Area-wise Dashboard</h2>
          <label style={{ fontWeight: 500 }}>Sub-division</label>
          <Select
            style={{ width: 300, marginTop: 8 }}
            placeholder="Choose a subdivision"
            onChange={setSelectedSubdivision}
            value={selectedSubdivision}
          >
            <Option value="Lakhipur_bec">Lakhipur</Option>
            <Option value="Bijni">Bijni</Option>
            <Option value="Gossaigaon">Gossaigaon</Option>
          </Select>

          <div style={{ marginTop: 16 }}>
            <button
              onClick={() => setShowDashboard(true)}
              disabled={!selectedSubdivision}
              style={{
                padding: '8px 16px',
                backgroundColor: '#1677ff',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: selectedSubdivision ? 'pointer' : 'not-allowed'
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

          <div style={{ display: "flex", gap: "20px" }}>
            <Card
              title={<span style={{color: '#1e90ff'}}>All the Meter IDs:</span>}
              style={{
                width: "220px",
                maxHeight: "400px",
                overflowY: "auto",
                flexShrink: 0,
                backgroundColor: "#e6f4ff"
              }}
              bodyStyle={{ padding: 12 }}
            >
              {meterIdsForArea.length > 0 ? (
                meterIdsForArea.map((meterId, index) => (
                  <div key={index} style={{ marginBottom: "8px" }}>{meterId}</div>
                ))
              ) : (
                <div>No meter IDs found for this area.</div>
              )}
            </Card>

            <div style={{ flexGrow: 1 }}>
              <h2>Combined Data</h2>
              <div className="subdivision-container">
                <div className="pie-charts-box">
                  <PhasePieChart title="No. of Consumers Phase Wise" labels={["Phase a", "Phase b", "Phase c"]} data={[consumers.a, consumers.b, consumers.c]} />
                  <PhasePieChart title="Load Phase Wise" labels={["Phase a", "Phase b", "Phase c"]} data={[load.a, load.b, load.c]} />
                </div>
              </div>

              <Divider style={{ margin: "16px 0" }} />
              <Card title="Reliability Indices (Averages)" style={{ marginBottom: 16 }}>
                <Row gutter={24} wrap={false} style={{ overflowX: 'auto' }}>
                  {Object.entries(pq_avg).map(([key, value], index) => (
                    <Col key={index}><Tooltip title={key}><div>{key.replace(/_/g, ' ')}</div><div>{value.toFixed(3)}</div></Tooltip></Col>
                  ))}
                </Row>
              </Card>

              <h3>Select a parameter to view the aggregated values of the region</h3>
              <Select
                style={{ width: "100%", marginBottom: "24px" }}
                placeholder="-- Choose a parameter --"
                value={selectedParameter}
                onChange={setSelectedParameter}
              >
                {parameters.map((param) => (
                  <Option key={param.value} value={param.value}>{param.label}</Option>
                ))}
              </Select>

              {regionData && selectedParameter === "block_wise_qos_template" && <QualityOfSupplyAggregation data={regionData} />}
              {regionData && selectedParameter === "block_wise_pq_template" && <PowerQualityAggregation data={regionData} />}
              {regionData && selectedParameter === "daily_qos_cut_outage" && <VoltageInterruptionsAggregation data={regionData} />}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
