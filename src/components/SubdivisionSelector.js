import React, { useState } from "react";
import { Select, Card, Divider, Row, Col, Statistic } from "antd";
import useMeterData from "../hooks/useMeterData";
import PhasePieChart from "./PhasePieChart";
import "../styles/SubdivisionSelector.css";
import VoltageInterruptionsAggregation from "./VoltageInterruptionsAggregation";
import PowerQualityAggregation from "./PowerQualityAggregation";
import QualityOfSupplyAggregation from "./QualityOfSupplyAggregation";
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
          setPQ_avg({
            saifi_cons_avg: data.length > 0 ? data.reduce((sum, row) => sum + row.saifi_cons || 0, 0) / data.length : 0,
            saidi_cons_avg: data.length > 0 ? data.reduce((sum, row) => sum + row.saidi_cons || 0, 0) / data.length : 0,
            caifi_cons_avg: data.length > 0 ? data.reduce((sum, row) => sum + row.caifi_cons || 0, 0) / data.length : 0,
            caidi_cons_avg: data.length > 0 ? data.reduce((sum, row) => sum + row.caidi_cons || 0, 0) / data.length : 0,
            ciii_cons_avg:  data.length > 0 ? data.reduce((sum, row) => sum + row.ciii_cons || 0, 0) / data.length : 0,
            asai_cons_avg:  data.length > 0 ? data.reduce((sum, row) => sum + row.asai_cons || 0, 0) / data.length : 0,
            maifi_cons_avg: data.length > 0 ? data.reduce((sum, row) => sum + row.maifi_cons || 0, 0) / data.length : 0,
            maidi_cons_avg: data.length > 0 ? data.reduce((sum, row) => sum + row.maidi_cons || 0, 0) / data.length : 0,

            saifi_load_avg: data.length > 0 ? data.reduce((sum, row) => sum + row.saifi_load || 0, 0) / data.length : 0,
            saidi_load_avg: data.length > 0 ? data.reduce((sum, row) => sum + row.saidi_load || 0, 0) / data.length : 0,
            caifi_load_avg: data.length > 0 ? data.reduce((sum, row) => sum + row.caifi_load || 0, 0) / data.length : 0,
            caidi_load_avg: data.length > 0 ? data.reduce((sum, row) => sum + row.caidi_load || 0, 0) / data.length : 0,
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
        <Card title="Reliability Indices (Averages)" style={{ marginBottom: 16 }}>
          <Row gutter={16} wrap={false} style={{ overflowX: 'auto', flexWrap: 'nowrap' }}>
            <Col>
              <Statistic title="SAIFI (Consumers)" value={(pq_avg.saifi_cons_avg || 0).toFixed(3)} />
            </Col>
            <Col>
              <Statistic title="SAIDI (Consumers)" value={(pq_avg.saidi_cons_avg || 0).toFixed(3)} />
            </Col>
            <Col>
              <Statistic title="CAIFI (Consumers)" value={(pq_avg.caifi_cons_avg || 0).toFixed(3)} />
            </Col>
            <Col>
              <Statistic title="CAIDI (Consumers)" value={(pq_avg.caidi_cons_avg || 0).toFixed(3)} />
            </Col>
            <Col>
              <Statistic title="CIII (Consumers)" value={(pq_avg.ciii_cons_avg || 0).toFixed(3)} />
            </Col>
            <Col>
              <Statistic title="ASAI (Consumers)" value={(pq_avg.asai_cons_avg || 0).toFixed(3)} />
            </Col>
            <Col>
              <Statistic title="MAIFI (Consumers)" value={(pq_avg.maifi_cons_avg || 0).toFixed(3)} />
            </Col>
            <Col>
              <Statistic title="MAIDI (Consumers)" value={(pq_avg.maidi_cons_avg || 0).toFixed(3)} />
            </Col>
            
            
          </Row>
          <Row gutter={16} wrap={false} style={{ overflowX: 'auto', flexWrap: 'nowrap' }}>
            <Col>
              <Statistic title="SAIFI (Load)" value={(pq_avg.saifi_load_avg || 0).toFixed(3)} />
            </Col>
            <Col>
              <Statistic title="SAIDI (Load)" value={(pq_avg.saidi_load_avg || 0).toFixed(3)} />
            </Col>
            <Col>
              <Statistic title="CAIFI (Load)" value={(pq_avg.caifi_load_avg || 0).toFixed(3)} />
            </Col>
            <Col>
              <Statistic title="CAIDI (Load)" value={(pq_avg.caidi_load_avg || 0).toFixed(3)} />
            </Col>
            <Col>
              <Statistic title="CIII (Load)" value={(pq_avg.ciii_load_avg || 0).toFixed(3)} />
            </Col>
            <Col>
              <Statistic title="ASAI (Load)" value={(pq_avg.asai_load_avg || 0).toFixed(3)} />
            </Col>
            <Col>
              <Statistic title="MAIFI (Load)" value={(pq_avg.maifi_load_avg || 0).toFixed(3)} />
            </Col>
            <Col>
              <Statistic title="MAIDI (Load)" value={(pq_avg.maidi_load_avg || 0).toFixed(3)} />
            </Col>
          </Row>
          <Row gutter={16} wrap={false} style={{ overflowX: 'auto', flexWrap: 'nowrap' }}>
            <Col>
              <Statistic title="ENS" value={(pq_avg.ens_avg || 0).toFixed(3)} />
            </Col>
            <Col>
              <Statistic title="AENS" value={(pq_avg.aens_avg || 0).toFixed(3)} />
            </Col>
            <Col>
              <Statistic title="ORS" value={(pq_avg.ors_avg || 0).toFixed(3)} />
            </Col>
            <Col>
              <Statistic title="CA" value={(pq_avg.ca_avg || 0).toFixed(3)} />
            </Col>
          </Row>
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

