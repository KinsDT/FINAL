import React from "react";
import { Card, Row, Col, Statistic } from "antd";

export default function VoltageInterruptionsAggregation({ data }) {
  if (!Array.isArray(data)) {
  console.error("Invalid data passed to VoltageInterruptionsAggregation:", data);
  return <div>Invalid data format</div>;
}

if (data.length > 100000) {
  console.error("Too much data passed to VoltageInterruptionsAggregation:", data.length);
  return <div>Data too large to render</div>;
}
  console.log("Rendering VoltageInterruptionsAggregation", data?.length);

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
  //const maxCutDuration = Math.max(...data.map(row => parseFloat(row.cut_duration) || 0));
const maxCutDuration = data.reduce((max, row) => {
  const val = parseFloat(row.cut_duration);
  return val > max ? val : max;
}, 0);
  // Calculate maximum outage_duration
const maxOutageDuration = outageDurationFiltered.reduce((max, row) => {
  const val = parseFloat(row.outage_duration);
  return val > max ? val : max;
}, 0);

  // Calculate total counts for additional context
  const totalCutCount = cutDurationFiltered.length;
  const totalOutageCount = outageDurationFiltered.length;

  return (
    <div style={{ marginTop: "16px" }}>
      <h3>Voltage Interruptions - Aggregated Data</h3>
      
      {/* Cut Duration Section */}
      <Card title={<span style={{color: '#1e90ff'}}>Cut Duration Analysis</span>} style={{marginBottom: "16px"}}>
        <Row gutter={16}>
          <Col span={8}>
          <Card style={{ backgroundColor: '#e6f4ff' }}>
            <Statistic 
              title="Average Cut Duration" 
              value={avgCutDuration.toFixed(2)}
              suffix="minutes"   
            />
          </Card>
          </Col>
          <Col span={8}>
          <Card style={{ backgroundColor: '#e6f4ff' }}>
            <Statistic 
              title="Maximum Cut Duration" 
              value={maxCutDuration.toFixed(2)} 
              suffix="minutes"
            />
          </Card>
          </Col>
          <Col span={8}>
          <Card style={{ backgroundColor: '#e6f4ff' }}>
            <Statistic 
              title="Total Cut Count" 
              value={totalCutCount} 
              suffix="events"
            />
          </Card>
          </Col>
        </Row>
      </Card>

      {/* Outage Duration Section */}
      <Card title={<span style={{color: '#1e90ff'}}>Outage Duration Analysis</span>} style={{ marginBottom: "16px" }}>
        <Row gutter={16}>
          <Col span={8}>
          <Card style={{ backgroundColor: '#e6f4ff' }}>
            <Statistic 
              title="Average Outage Duration" 
              value={avgOutageDuration.toFixed(2)} 
              suffix="minutes"
            />
          </Card>
          </Col>
          <Col span={8}>
          <Card style={{ backgroundColor: '#e6f4ff' }}>
            <Statistic 
              title="Maximum Outage Duration" 
              value={maxOutageDuration.toFixed(2)} 
              suffix="minutes"
            />
          </Card>
          </Col>
          <Col span={8}>
          <Card style={{ backgroundColor: '#e6f4ff' }}>
            <Statistic 
              title="Total Outage Count" 
              value={totalOutageCount} 
              suffix="events"
            />
          </Card>
          </Col>
        </Row>
      </Card>

      {/* Summary Section */}
      <Card title={<span style={{color: '#1e90ff'}}>Summary Statistics</span>}>
        <Row gutter={16}>
          <Col span={12}>
          <Card style={{ backgroundColor: '#e6f4ff' }}>
            <Statistic 
              title="Records with Cut Events" 
              value={cutDurationFiltered.length} 
              suffix={`of ${data.length}`}
            />
          </Card>
          </Col>
          <Col span={12}>
          <Card style={{ backgroundColor: '#e6f4ff' }}>
            <Statistic 
              title="Records with Outage Events" 
              value={outageDurationFiltered.length} 
              suffix={`of ${data.length}`}
            />
          </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}