import React from "react";
import { Card, Row, Col, Statistic } from "antd";

export default function VoltageInterruptionsAggregation({ data }) {
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