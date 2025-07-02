/*import React, { useState } from "react";
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
      
      <Card title={<span style={{color: '#1e90ff'}}>Power Factor Averages</span>} style={{ marginBottom: "16px" }}>
        <Row gutter={16}>
          <Col span={6}>
            <Card style={{ backgroundColor: '#e6f4ff' }}>
              <Statistic title="Average Power Factor of 3 Phases" value={avgPfavg3ph.toFixed(4)} />
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ backgroundColor: '#e6f4ff' }}>
              <Statistic title="Average Power Factor of Phase A" value={avgPfphA.toFixed(4)} />
            </Card>  
          </Col>
          <Col span={6}>
            <Card style={{ backgroundColor: '#e6f4ff' }}>
              <Statistic title="Average Power Factor of Phase B" value={avgPfphB.toFixed(4)} />
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ backgroundColor: '#e6f4ff' }}>
              <Statistic title="Average Power Factor of Phase C" value={avgPfphC.toFixed(4)} />
            </Card>
          </Col>
        </Row>
      </Card>

      <Card title={<span style={{color: '#1e90ff'}}>Voltage Variation Averages (%)</span>} style={{ marginBottom: "16px",position: "relative" }} extra={
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
            <Card style={{ backgroundColor: '#e6f4ff' }}>
              <Statistic
                title="Average 3 Phase Voltage Variation"
                value={
                  adjustedVoltages
                    ? adjustedVoltages.v3ph.toFixed(2)
                    :avgV3phAvgPercent.toFixed(2)}
                suffix="%"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ backgroundColor: '#e6f4ff' }}>
              <Statistic
                title="Average Phase A Voltage Variation"
                value={
                  adjustedVoltages
                  ? adjustedVoltages.va.toFixed(2)
                  : avgVaAvgPercent.toFixed(2)}
                suffix="%"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ backgroundColor: '#e6f4ff' }}>
              <Statistic
                title="Average Phase B Voltage Variation"
                value={
                  adjustedVoltages
                  ? adjustedVoltages.vb.toFixed(2)
                  : avgVbAvgPercent.toFixed(2)}
                suffix="%"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ backgroundColor: '#e6f4ff' }}>
              <Statistic
                title="Average Phase C Voltage Variation"
                value={
                  adjustedVoltages
                  ? adjustedVoltages.vc.toFixed(2)
                  : avgVcAvgPercent.toFixed(2)}
                suffix="%"
              />
            </Card>
          </Col>
        </Row>
      </Card>

      <Card title={<span style={{color: '#1e90ff'}}>Voltage and Current Unbalance Averages (%)</span>}>
        <Row gutter={16}>
          <Col span={6}>
          <Card style={{ backgroundColor: '#e6f4ff' }}>
            <Statistic
              title="Average Voltage Unbalance Percent"
              value={avgVuPercent.toFixed(2)}
              suffix="%"
            />
          </Card>
          </Col>
          <Col span={6}>
          <Card style={{ backgroundColor: '#e6f4ff' }}>
            <Statistic
              title="Average Current Unbalance Percent"
              value={avgIuPercent.toFixed(2)}
              suffix="%"
            />
          </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
*/
import React, { useState } from "react";
import { Spin, Card, Row, Col, Statistic } from "antd";

export default function QualityOfSupplyAggregation({ data, loading }) {
  
  const [nominalVoltage, setNominalVoltage] = useState('');
  const [adjustedVoltages, setAdjustedVoltages] = useState(null);
  if (loading){
    return(
          <div style={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Spin size="large" tip="Loading..."/>
          </div>
        );
  }
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
    <Card title="Quality of Supply" style={{ marginBottom: 24,borderColor:'#DDDDE3',borderRadius:16}} extra ={
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
      <span style={{ fontWeight: 600 }}>Nominal Voltage:</span>
      <input
        type="number"
        value={nominalVoltage}
        onChange={handleNominalVoltageChange}
        style={{
          width: '100px',
          marginRight: 8,
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
        placeholder="240V"
        min={1}
      />
    </div>
    }>
    <div
                  style={{
                    fontFamily: 'GT Walsheim Pro',
                    fontWeight: 500,
                    fontSize: 18,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '24px 40px',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start'
                    
                  }}
                >             
      
            <div className="stat-group">
              <div className="label">Avg Power Factor of 3 Phases</div>
              <div className="value">{avgPfavg3ph.toFixed(4)}</div>
            </div>
          
            <div className="stat-group">
              <div className="label">Avg Power Factor of Phase A</div>
              <div className="value">{avgPfphA.toFixed(4)}</div>
            </div>
          
            <div className="stat-group">
              <div className="label">Avg Power Factor of Phase B</div>
              <div className="value">{avgPfphB.toFixed(4)}</div>
            </div>
          
            <div className="stat-group">
              <div className="label">Avg Power Factor of Phase C</div>
              <div className="value">{avgPfphC.toFixed(4)}</div>
            </div>
          

     
      
            <div className="stat-group">
              <div className="label">Avg 3 Phase Voltage Variation</div>
              <div className="value">{adjustedVoltages ? adjustedVoltages.v3ph.toFixed(2) : avgV3phAvgPercent.toFixed(2)}%</div>
            </div>
          
            <div className="stat-group">
              <div className="label">Avg Phase A Voltage Variation</div>
              <div className="value">{adjustedVoltages ? adjustedVoltages.va.toFixed(2) : avgVaAvgPercent.toFixed(2)}%</div>
            </div>
          
            <div className="stat-group">
              <div className="label">Avg Phase B Voltage Variation</div>
              <div className="value">{adjustedVoltages ? adjustedVoltages.vb.toFixed(2) : avgVbAvgPercent.toFixed(2)}%</div>
            </div>
            <div className="stat-group">
              <div className="label">Avg Phase C Voltage Variation</div>
              <div className="value">{adjustedVoltages ? adjustedVoltages.vc.toFixed(2) : avgVcAvgPercent.toFixed(2)}%</div>
            </div>
          

      
      
            <div className="stat-group">
              <div className="label">Avg Voltage Unbalance Percent</div>
              <div className="value">{avgVuPercent.toFixed(2)}%</div>
            </div>
          
            <div className="stat-group">
              <div className="label">Avg Current Unbalance Percent</div>
              <div className="value">{avgIuPercent.toFixed(2)}%</div>
            </div>
          </div>
      </Card>
      
    
  );
}
