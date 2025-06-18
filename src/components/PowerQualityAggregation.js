import React from "react";
import { Card, Row, Col, Statistic } from "antd";

export default function PowerQualityAggregation({ data }) {
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
      <Card title={<span style={{color: '#1e90ff'}}>Phase Voltage Averages (V)</span>} style={{ marginBottom: "16px" }}>
        <Row gutter={16}>
          <Col span={8}>
          <Card style={{ backgroundColor: '#e6f4ff' }}>
            <Statistic title="Average Voltage of Phase A" value={avgVoltagePhA.toFixed(2)} suffix="V" />
          </Card>
          </Col>
          <Col span={8}>
          <Card style={{ backgroundColor: '#e6f4ff' }}>
            <Statistic title="Average Voltage of Phase B" value={avgVoltagePhB.toFixed(2)} suffix="V" />
          </Card>
          </Col>
          <Col span={8}>
          <Card style={{ backgroundColor: '#e6f4ff' }}>
            <Statistic title="Average Voltage of Phase C" value={avgVoltagePhC.toFixed(2)} suffix="V" />
          </Card>
          </Col>
        </Row>
      </Card>

      {/* Symmetrical Components Section */}
      <Card title={<span style={{color: '#1e90ff'}}>Symmetrical Components Averages (V)</span>} style={{ marginBottom: "16px" }}>
        <Row gutter={16}>
          <Col span={8}>
          <Card style={{ backgroundColor: '#e6f4ff' }}>
            <Statistic title="Average Positive Sequence" value={avgV1.toFixed(2)} suffix="V" />
          </Card>
          </Col>
          <Col span={8}>
          <Card style={{ backgroundColor: '#e6f4ff' }}>
            <Statistic title="Average Negative Sequence" value={avgV2.toFixed(2)} suffix="V" />
          </Card>
          </Col>
          <Col span={8}>
          <Card style={{ backgroundColor: '#e6f4ff' }}>
            <Statistic title="Average Zero Sequence" value={avgV0.toFixed(2)} suffix="V" />
          </Card>
          </Col>
        </Row>
      </Card>

      {/* Voltage Unbalance Factor Section */}
      <Card title={<span style={{color: '#1e90ff'}}>Voltage Unbalance Factor</span>}>
        <Row gutter={16}>
          <Col span={8}>
          <Card style={{ backgroundColor: '#e6f4ff' }}>
            <Statistic title="Average Voltage Unbalance Factor" value={avgVuf.toFixed(4)} />
          </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}