import React, { useState, useMemo } from "react";
import { Select, Card, Divider, Row, Col, Statistic } from "antd";
import useMeterData from "../hooks/useMeterData";
import PhasePieChart from "./PhasePieChart";
import "../styles/SubdivisionSelector.css";
import VoltageInterruptionsAggregation from "./VoltageInterruptionsAggregation";
import PowerQualityAggregation from "./PowerQualityAggregation";
import QualityOfSupplyAggregation from "./QualityOfSupplyAggregation";
import {Tooltip} from 'antd';
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
/*function CombinedDataBox() {
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
}*/

export default function SubdivisionSelector() {
  const [regionData, setRegionData] = useState(null);
  const [selectedSubdivision, setSelectedSubdivision] = useState(null);
  const { locations } = useMeterData();
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [reliabilityData, setReliabilityData] = useState([]);
  const [consumers, setConsumers] = useState({ a: 0, b: 0, c: 0 });
  const [load, setLoad] = useState({ a: 0, b: 0, c: 0 });
  const [pq_avg, setPQ_avg] = useState({
  saifi_cons: 0,
  saidi_cons: 0,
  caifi_cons: 0,
  caidi_cons: 0,
  ciii_cons: 0,
  asai_cons: 0,
  maifi_cons: 0,
  maidi_cons: 0,

  saifi_load: 0,
  saidi_load: 0,
  caifi_load: 0,
  caidi_load: 0,
  ciii_load: 0,
  asai_load: 0,
  maifi_load: 0,
  maidi_load: 0,

  ens: 0,
  aens: 0,
  ors: 0,
  ca: 0
  });

  const meterIdsForArea = useMemo(() => {
    return selectedSubdivision
      ? locations.filter((loc) => loc.AREA === selectedSubdivision).map((loc) => loc.meterId)
      : [];
  }, [selectedSubdivision, locations]);

  const meterIdsCSV = useMemo(() => meterIdsForArea.join(","), [meterIdsForArea]);
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
          setPQ_avg({
            saifi_cons_avg: data.length > 0 ? data.reduce((sum, row) => sum + row.saifi_cons || 0, 0)*0.69 / data.length : 0,
            saidi_cons_avg: data.length > 0 ? data.reduce((sum, row) => sum + row.saidi_cons || 0, 0)*0.69 / data.length : 0,
            caifi_cons_avg: data.length > 0 ? data.reduce((sum, row) => sum + row.caifi_cons || 0, 0)*0.9 / data.length : 0,
            caidi_cons_avg: data.length > 0 ? data.reduce((sum, row) => sum + row.caidi_cons || 0, 0)/5.2 / data.length : 0,
            ciii_cons_avg:  data.length > 0 ? data.reduce((sum, row) => sum + row.ciii_cons || 0, 0)*0.69/ data.length : 0,
            asai_cons_avg:  data.length > 0 ? data.reduce((sum, row) => sum + row.asai_cons || 0, 0)*0.69 / data.length : 0,
            maifi_cons_avg: data.length > 0 ? data.reduce((sum, row) => sum + row.maifi_cons || 0, 0)*0.69 / data.length : 0,
            maidi_cons_avg: data.length > 0 ? data.reduce((sum, row) => sum + row.maidi_cons || 0, 0)*0.69/ data.length : 0,

            saifi_load_avg: data.length > 0 ? data.reduce((sum, row) => sum + row.saifi_load || 0, 0) / data.length : 0,
            saidi_load_avg: data.length > 0 ? data.reduce((sum, row) => sum + row.saidi_load || 0, 0) / data.length : 0,
            caifi_load_avg: data.length > 0 ? data.reduce((sum, row) => sum + row.caifi_load || 0, 0)*1.20 / data.length : 0,
            caidi_load_avg: data.length > 0 ? data.reduce((sum, row) => sum + row.caidi_load || 0, 0)/5 / data.length : 0,
            ciii_load_avg:  data.length > 0 ? data.reduce((sum, row) => sum + row.ciii_load || 0, 0) / data.length : 0,
            asai_load_avg:  data.length > 0 ? data.reduce((sum, row) => sum + row.asai_load || 0, 0) / data.length : 0,
            maifi_load_avg: data.length > 0 ? data.reduce((sum, row) => sum + row.maifi_load || 0, 0) / data.length : 0,
            maidi_load_avg: data.length > 0 ? data.reduce((sum, row) => sum + row.maidi_load || 0, 0) / data.length : 0,

            ens_avg:        data.length > 0 ? data.reduce((sum, row) => sum + row.ens || 0, 0) / data.length : 0,
            aens_avg:       data.length > 0 ? data.reduce((sum, row) => sum + row.aens || 0, 0) / data.length : 0,
            ors_avg:        data.length > 0 ? data.reduce((sum, row) => sum + row.ors || 0, 0) / data.length : 0,
            ca_avg:         data.length > 0 ? data.reduce((sum, row) => sum + row.ca || 0, 0) / data.length : 0
          });

          
        })
        .catch(console.error);
    }
  }, [selectedSubdivision]);

  React.useEffect(() => {
    if (!selectedParameter || !meterIdsCSV) return;

    fetch(
      `http://localhost:5000/api/region-data?table=${selectedParameter}&meterIds=${meterIdsCSV}`
    )
      .then((res) => res.json())
      .then((data) => setRegionData(data))
      .catch((err) => {
        console.error("Error fetching region data:", err);
        setRegionData(null);
      });
  }, [selectedParameter, meterIdsCSV]);


  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
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
            <div key={index} style={{ marginBottom: "8px" }}>
              {meterId}
            </div>
          ))
        ) : (
          <div>No meter IDs found for this area.</div>
        )}
      </Card>

      
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
        <Card title="Reliability Indices (Averages)" style={{ marginBottom: 16 }}>
          <Row gutter={24} wrap={false} style={{ overflowX: 'auto' }}>
            <Col>
              <div className="stat-group">
                <Tooltip title = "System Average Interruption Frequency Index">
                  <div className="label">SAIFI (Consumers)</div>
                </Tooltip>
                <div className="value">{(pq_avg.saifi_cons_avg || 0).toFixed(3)}</div>
                <Tooltip title = "System Average Interruption Frequency Index">
                  <div className="label">SAIFI (Load)</div>
                </Tooltip>
                <div className="value">{(pq_avg.saifi_load_avg || 0).toFixed(3)}</div>
                <Tooltip title = "Energy Not Supplied">
                  <div className="label">ENS</div>
                </Tooltip>
                <div className="value">{(pq_avg.ens_avg || 0).toFixed(3)}</div>
              </div>
            </Col>
            <Col>
              <div className="stat-group">
                <Tooltip title = "System Average Interruption Duration Index">
                  <div className="label">SAIDI (Consumers)</div>
                </Tooltip>
                <div className="value">{(pq_avg.saidi_cons_avg || 0).toFixed(3)}</div>
                <Tooltip title = "System Average Interruption Duration Index">
                  <div className="label">SAIDI (Load)</div>
                </Tooltip>
                <div className="value">{(pq_avg.saidi_load_avg || 0).toFixed(3)}</div>
                <Tooltip title = "Average Energy Not Supplied">
                  <div className="label">AENS</div>
                </Tooltip>
                <div className="value">{(pq_avg.aens_avg || 0).toFixed(3)}</div>
              </div>
            </Col>
            <Col>
              <div className="stat-group">
                <Tooltip title="Customer Average Interruption Frequency Index">
                  <div className="label" style={{ cursor: 'help' }}>CAIFI (Consumers)</div>
                </Tooltip>
                <div className="value">{(pq_avg.caifi_cons_avg || 0).toFixed(3)}</div>

                <Tooltip title="Customer Average Interruption Frequency Index (Load)">
                  <div className="label" style={{ cursor: 'help' }}>CAIFI (Load)</div>
                </Tooltip>
                <div className="value">{(pq_avg.caifi_load_avg || 0).toFixed(3)}</div>

                <Tooltip title="Overall Reliability of System">
                  <div className="label" style={{ cursor: 'help' }}>ORS</div>
                </Tooltip>
                <div className="value">{(pq_avg.ors_avg || 0).toFixed(3)}</div>
              </div>
            </Col>

            <Col>
              <div className="stat-group">
                <Tooltip title="Customer Average Interruption Duration Index">
                  <div className="label" style={{ cursor: 'help' }}>CAIDI (Consumers)</div>
                </Tooltip>
                <div className="value">{(pq_avg.caidi_cons_avg || 0).toFixed(3)}</div>

                <Tooltip title="Customer Average Interruption Duration Index (Load)">
                  <div className="label" style={{ cursor: 'help' }}>CAIDI (Load)</div>
                </Tooltip>
                <div className="value">{(pq_avg.caidi_load_avg || 0).toFixed(3)}</div>
              </div>
            </Col>

            <Col>
              <div className="stat-group">
                <Tooltip title="Consumer Interruption Impact Index">
                  <div className="label" style={{ cursor: 'help' }}>CIII (Consumers)</div>
                </Tooltip>
                <div className="value">{(pq_avg.ciii_cons_avg || 0).toFixed(3)}</div>

                <Tooltip title="Consumer Interruption Impact Index (Load)">
                  <div className="label" style={{ cursor: 'help' }}>CIII (Load)</div>
                </Tooltip>
                <div className="value">{(pq_avg.ciii_load_avg || 0).toFixed(3)}</div>
              </div>
            </Col>

            <Col>
              <div className="stat-group">
                <Tooltip title="Average Service Availability Index">
                  <div className="label" style={{ cursor: 'help' }}>ASAI (Consumers)</div>
                </Tooltip>
                <div className="value">{(pq_avg.asai_cons_avg || 0).toFixed(3)}</div>

                <Tooltip title="Average Service Availability Index (Load)">
                  <div className="label" style={{ cursor: 'help' }}>ASAI (Load)</div>
                </Tooltip>
                <div className="value">{(pq_avg.asai_load_avg || 0).toFixed(3)}</div>
              </div>
            </Col>

            <Col>
              <div className="stat-group">
                <Tooltip title="Momentary Average Interruption Frequency Index">
                  <div className="label" style={{ cursor: 'help' }}>MAIFI (Consumers)</div>
                </Tooltip>
                <div className="value">{(pq_avg.maifi_cons_avg || 0).toFixed(3)}</div>

                <Tooltip title="Momentary Average Interruption Frequency Index (Load)">
                  <div className="label" style={{ cursor: 'help' }}>MAIFI (Load)</div>
                </Tooltip>
                <div className="value">{(pq_avg.maifi_load_avg || 0).toFixed(3)}</div>
              </div>
            </Col>

            <Col>
              <div className="stat-group">
                <Tooltip title="Momentary Average Interruption Duration Index">
                  <div className="label" style={{ cursor: 'help' }}>MAIDI (Consumers)</div>
                </Tooltip>
                <div className="value">{(pq_avg.maidi_cons_avg || 0).toFixed(3)}</div>

                <Tooltip title="Momentary Average Interruption Duration Index (Load)">
                  <div className="label" style={{ cursor: 'help' }}>MAIDI (Load)</div>
                </Tooltip>
                <div className="value">{(pq_avg.maidi_load_avg || 0).toFixed(3)}</div>
              </div>
            </Col>

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

