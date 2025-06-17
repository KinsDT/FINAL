import React, { useState } from "react";
import { Card, Row, Col, Statistic } from "antd";

export default function QualityOfSupplyAggregation({ data }) {
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