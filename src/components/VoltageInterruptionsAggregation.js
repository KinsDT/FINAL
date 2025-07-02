import React from "react";
import { Select,Spin,Card, Row, Col, Statistic } from "antd";

export default function VoltageInterruptionsAggregation({ data,loading }) {
  if (loading){
    return(
      <div style={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" tip="Loading..."/>
      </div>
    );
  }
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
    <Card
      title="Voltage Interruptions - Aggregated Data"
      style={{ marginTop: 16, marginBottom: 24,borderColor:'#DDDDE3',borderRadius:16 }}
    >
      <div
        style={{
          fontFamily: 'GT Walsheim Pro',
          fontWeight: 500,
          fontSize: 18,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px 40px',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        {/* Cut Duration Analysis */}
        <div className="stat-group">
          <div className="label">Average Cut Duration</div>
          <div className="value">{avgCutDuration.toFixed(2)} minutes</div>
        </div>
        <div className="stat-group">
          <div className="label">Maximum Cut Duration</div>
          <div className="value">{maxCutDuration.toFixed(2)} minutes</div>
        </div>
        <div className="stat-group">
          <div className="label">Total Cut Count</div>
          <div className="value">{totalCutCount} events</div>
        </div>

        {/* Outage Duration Analysis */}
        <div className="stat-group">
          <div className="label">Average Outage Duration</div>
          <div className="value">{avgOutageDuration.toFixed(2)} minutes</div>
        </div>
        <div className="stat-group">
          <div className="label">Maximum Outage Duration</div>
          <div className="value">{maxOutageDuration.toFixed(2)} minutes</div>
        </div>
        <div className="stat-group">
          <div className="label">Total Outage Count</div>
          <div className="value">{totalOutageCount} events</div>
        </div>

        {/* Summary Statistics */}
        <div className="stat-group">
          <div className="label">Records with Cut Events</div>
          <div className="value">{cutDurationFiltered.length} of {data.length}</div>
        </div>
        <div className="stat-group">
          <div className="label">Records with Outage Events</div>
          <div className="value">{outageDurationFiltered.length} of {data.length}</div>
        </div>
      </div>
    </Card>
  );
}