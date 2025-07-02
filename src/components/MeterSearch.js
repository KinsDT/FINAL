import React, { useState, useEffect, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Select } from 'antd';
import 'antd/dist/reset.css';
import '../styles/MeterSearch.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
);

const ToggleSwitch = ({ onChange, isChecked }) => (
  <label className="switch">
    <input
      type="checkbox"
      checked={isChecked}
      onChange={() => onChange(!isChecked)}
    />
    <span className="slider"></span>
  </label>
);

export default function MeterSearch() {
  const [tableName, setTableName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [data, setData] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [selectedMeterIds, setSelectedMeterIds] = useState([]);
  const [graphs, setGraphs] = useState([{ xAxis: "", yAxis: "" }]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [goToPageInput, setGoToPageInput] = useState("");
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [meterIds, setMeterIds] = useState([]);

  useEffect(() => {
    setCurrentPage(1);
    setGoToPageInput("");
  }, [data]);

  // Fetch table names
  useEffect(() => {
    fetch("http://localhost:5000/api/meter-data/tables")
      .then((res) => res.json())
      .then((json) => setTables(json.tables || []))
      .catch(() => setTables([]));
  }, []);

  // Fetch areas (sub-divisions)
  useEffect(() => {
    fetch('http://localhost:5000/api/meter-data/areas')
      .then(res => res.json())
      .then(data => setAreas(data.areas || []))
      .catch(() => setAreas([]));
  }, []);

  // Fetch meter IDs for selected area
  useEffect(() => {
    if (!selectedArea) {
      setMeterIds([]);
      setSelectedMeterIds([]);
      return;
    }
    fetch(`http://localhost:5000/api/meter-data/meter_ids?area=${encodeURIComponent(selectedArea)}`)
      .then(res => res.json())
      .then(data => {
        setMeterIds(data.meter_ids || []);
        setSelectedMeterIds([]); // reset selection
      })
      .catch(() => {
        setMeterIds([]);
        setSelectedMeterIds([]);
      });
  }, [selectedArea]);

  const tableDisplayNames = {
    daily_qos_undervoltage: "Under-Voltage",
    block_wise_pq_template: "Power Quality",
    daily_qos_overvoltage: "Over-Voltage",
    meter_mapping: "Meter Mapping",
    daily_qos_cut_outage: "Outage",
    reliability_indices: "Reliability Indices",
    dt_loading_pattern_unbalance: "Loading Pattern Unbalance",
    monthly_hosting_capacity_template: "Hosting Capacity",
    voltage_sag_swell_template: "Voltage Sag Swell",
    operational_template: "Operational",
    block_wise_qos_template: "Quality of Supply",
  };

  const columnDisplayNames = {
    date: "Date",
    meter_id: "Meter ID",
    block: "Block",
    block_name: "Block Name",
    cut_count: "Cut Count",
    cut_duration: "Cut Duration (mins)",
    occurrence_time: "Occurrence Time",
    outage_count: "Outage Count",
    outage_duration: "Outage Duration (mins)",
    restoration_time: "Restoration Time",
    iu_percent: "Current Unbalance (%)",
    pfavg3ph: "Power Factor Avg (3 Ph)",
    pfph_a: "Power Factor Phase A",
    pfph_b: "Power Factor Phase B",
    pfph_c: "Power Factor Phase C",
    v3ph_avg_percent: "3-Phase Voltage Avg (%)",
    v3ph_max_percent: "3-Phase Voltage Max (%)",
    va_avg_percent: "Voltage Phase A Avg (%)",
    va_max_percent: "Voltage Phase A Max (%)",
    vb_avg_percent: "Voltage Phase B Avg (%)",
    vb_max_percent: "Voltage Phase B Max (%)",
    vc_avg_percent: "Voltage Phase C Avg (%)",
    vc_max_percent: "Voltage Phase C Max (%)",
    vu_percent: "Voltage Unbalance (%)",
    datetime: "Date Time"
  };

  const fetchData = async () => {
    if (!tableName) {
      setError("Please select a table");
      setData([]);
      return;
    }
    if (!selectedMeterIds.length) {
      setError("Please select at least one Meter ID");
      setData([]);
      return;
    }

    setLoading(true);
    setError("");
    let combinedData = [];

    try {
      for (const rawId of selectedMeterIds) {
        const url = new URL("http://localhost:5000/api/meter-data/data");
        url.searchParams.append("table", tableName);
        url.searchParams.append("meter_id", rawId);
        url.searchParams.append("page", "1");
        url.searchParams.append("page_size", "1000");

        if (fromDate) url.searchParams.append("from_date", fromDate);
        if (toDate) url.searchParams.append("to_date", toDate);

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error(`Failed to fetch for Meter ID: ${rawId}`);

        const jsonData = await response.json();
        combinedData = combinedData.concat(jsonData);
      }

      if (combinedData.length === 0) {
        setError("No data found for these Meter IDs");
        setData([]);
      } else {
        combinedData.sort((a, b) => {
          const idA = (a.meter_id || "").toUpperCase();
          const idB = (b.meter_id || "").toUpperCase();
          if (idA < idB) return -1;
          if (idA > idB) return 1;
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          if (dateA < dateB) return -1;
          if (dateA > dateB) return 1;
          const blockA = Number(a.block) || 0;
          const blockB = Number(b.block) || 0;
          return blockA - blockB;
        });
        setData(combinedData);

        // Set default axes for all graphs
        const cols = Object.keys(combinedData[0]);
        let defaultX =
          cols.find(c => c.toLowerCase() === "time stamp".toLowerCase()) ||
          cols.find(c => c.toLowerCase() === "datetime") ||
          cols[0];
        let defaultY = cols.find(col => col !== defaultX) || cols[1] || "";
        setGraphs([{ xAxis: defaultX, yAxis: defaultY }]);
      }
    } catch (err) {
      setError(err.message || "Unknown error");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const allMeterIds = useMemo(() => {
    const ids = Array.from(new Set(data.map(row => row.meter_id).filter(Boolean)));
    return ids;
  }, [data]);

  useEffect(() => {
    if (allMeterIds.length > 0) {
      setSelectedMeterIds(allMeterIds.slice(0, 5));
    } else {
      setSelectedMeterIds([]);
    }
  }, [data]);

  const handleMeterIdCheckbox = (meterId) => {
    if (selectedMeterIds.includes(meterId)) {
      setSelectedMeterIds(selectedMeterIds.filter(id => id !== meterId));
    } else {
      if (selectedMeterIds.length < 5) {
        setSelectedMeterIds([...selectedMeterIds, meterId]);
      }
    }
  };

  const getColumnsByNonNullCount = (dataArray) => {
    if (!dataArray.length) return [];
    const allCols = Object.keys(dataArray[0]);
    const prioritized = ["date", "meter_id"];
    const otherCols = allCols.filter((c) => !prioritized.includes(c));
    const counts = otherCols.map((col) => {
      const nonNullCount = dataArray.reduce(
        (acc, row) => (row[col] !== null && row[col] !== undefined ? acc + 1 : acc),
        0
      );
      return { col, nonNullCount };
    });
    counts.sort((a, b) => b.nonNullCount - a.nonNullCount);
    return [...prioritized, ...counts.map((c) => c.col)];
  };

  const columns = getColumnsByNonNullCount(data);
  const totalRecords = data.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  const paginatedData = useMemo(() => {
    const startIdx = (currentPage - 1) * recordsPerPage;
    return data.slice(startIdx, startIdx + recordsPerPage);
  }, [data, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleGoToPage = (e) => {
    e.preventDefault();
    const page = Number(goToPageInput);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getChartData = (xAxis, yAxis) => {
    if (!xAxis || !yAxis || !data.length || !selectedMeterIds.length) return null;
    const grouped = {};
    data.forEach((row) => {
      const id = row.meter_id || "UNKNOWN";
      if (!selectedMeterIds.includes(id)) return;
      if (!grouped[id]) grouped[id] = [];
      grouped[id].push(row);
    });
    const datasets = Object.entries(grouped).map(([id, rows]) => {
      if (xAxis === "date") {
        const dailyMaxMap = {};
        rows.forEach((r) => {
          const dateKey = new Date(r.date).toISOString().split("T")[0];
          const yVal = parseFloat(r[yAxis]) || 0;
          if (!dailyMaxMap[dateKey] || dailyMaxMap[dateKey] < yVal) {
            dailyMaxMap[dateKey] = yVal;
          }
        });
        const sorted = Object.entries(dailyMaxMap)
          .map(([x, y]) => ({ x: new Date(x).toLocaleDateString(), y }))
          .sort((a, b) => new Date(a.x) - new Date(b.x));
        return {
          label: id,
          data: sorted,
          fill: false,
          borderColor: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`,
          tension: 0.2,
        };
      }
      const sorted = [...rows].sort((a, b) => {
        if (xAxis.toLowerCase() === "time stamp") {
          return new Date(a[xAxis]).getTime() - new Date(b[xAxis]).getTime();
        }
        if (xAxis.toLowerCase() === "datetime") {
          return new Date(a[xAxis]).getTime() - new Date(b[xAxis]).getTime();
        }
        const vA = parseFloat(a[xAxis]) || 0;
        const vB = parseFloat(b[xAxis]) || 0;
        return vA - vB;
      });
      return {
        label: id,
        data: sorted.map((r) => ({
          x:
            xAxis.toLowerCase() === "time stamp" || xAxis.toLowerCase() === "datetime"
              ? new Date(r[xAxis]).toLocaleString()
              : r[xAxis],
          y: parseFloat(r[yAxis]) || 0,
        })),
        fill: false,
        borderColor: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`,
        tension: 0.2,
      };
    });
    return { datasets };
  };

  const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * recordsPerPage + 1;
  const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);

  return (
    <div className="page" style={{ background: "#fff", minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: 1000, margin: "32px auto", padding: "0 24px" }}>
        <h1 className="heading" style={{
          fontFamily: "'GT Walsheim Pro', Arial, sans-serif",
          fontWeight: 700,
          fontSize: 28,
          marginBottom: 32,
          color: "#27272A"
        }}>
          Meter-wise Dashboard
        </h1>

        {/* Modern stacked controls */}
        <div style={{ marginBottom: 32 }}>
  <label style={{ fontWeight: 500, fontSize: 16, marginBottom: 10, display: "block", color: "#27272A", width: 360 }}>
    Parameter Name
  </label>
  <Select
    className="parameter-select"
    value={tableName || undefined}
    onChange={value => setTableName(value)}
    placeholder="Select Parameter"
    style={{
      width: 360,
      
      fontSize: 16,
      fontWeight: 400,
      color: "#27272A",
      background: "#fff"
    }}
    options={tables.map(table => ({
      value: table,
      label: tableDisplayNames[table] || table
    }))}
    allowClear
    showSearch
    filterOption={(input, option) =>
      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    }
  />
</div>

<div style={{ marginBottom: 32 }}>
  <label style={{ fontWeight: 500, fontSize: 16, marginBottom: 10, display: "block", color: "#27272A" }}>
    Meter IDs
  </label>
  <div style={{ display: "flex", gap: 0 }}>
    <Select
      className="subdivision-select"
      value={selectedArea || undefined}
      onChange={value => setSelectedArea(value)}
      placeholder="Select Sub-division"
      
      options={areas.map(area => ({
        value: area,
        label: area
      }))}
      allowClear
      showSearch
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
    />
    <Select
      className=".meter-select "
      mode="multiple"
      allowClear
      showSearch
      placeholder="Select Meter(s)"
      value={selectedMeterIds}
      onChange={setSelectedMeterIds}
      style={{
        flex: 2,
        minWidth: 0,
        padding: 0,
        border: "1.5px solid #E7E7EC",
        
        borderRadius: "0 12px 12px 0",
        background: "#fff",
        fontSize: 16,
        color: "#27272A"
      }}
      disabled={!selectedArea}
      options={meterIds.map(id => ({ label: id, value: id }))}
    />
  </div>
</div>

        <div style={{ marginBottom: 32 }}>
          <label style={{ fontWeight: 500, fontSize: 16, marginBottom: 10, display: "block", color: "#27272A" }}>
            Dates
          </label>
          <div style={{display:"flex", gap: 0 }}>
            <input
              type="date"
              placeholder="Select Start Date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              style={{
        
                width:"180px",
                padding: "12px",
                border: "1px solid #DDDDE3",
                borderRadius: "12px 0 0 12px",
                background: "#fff",
                fontSize: 16,
                color: "#27272A",
                
              }}
            />
            <input
              type="date"
              placeholder="Select End Date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              style={{
                
                padding: "12px",
                width:"180px",
                border: "1px solid #DDDDE3",
                borderLeft: "none",
                borderRadius: "0 12px 12px 0",
                background: "#fff",
                fontSize: 16,
                color: "#27272A",
                
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <label style={{ fontWeight: 500, fontSize: 16, marginBottom: 10, display: "block", color: "#27272A" }}>
            Data Format
          </label>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", fontSize: 16, color: "#27272A" }}>
              <input
                type="radio"
                name="dataFormat"
                checked={viewMode === "table"}
                onChange={() => setViewMode("table")}
                style={{ marginRight: 8 }}
              />
              Tabular Format
            </label>
            <label style={{ display: "flex", alignItems: "center", fontSize: 16, color: "#27272A" }}>
              <input
                type="radio"
                name="dataFormat"
                checked={viewMode === "graph"}
                onChange={() => setViewMode("graph")}
                style={{ marginRight: 8 }}
              />
              Graphical Format
            </label>
          </div>
        </div>

        {/* Search button */}
        <button
          onClick={fetchData}
          disabled={loading}
          style={{
            padding: "12px 32px",
            backgroundColor: "#1773BE",
            color: "#fff",
            borderRadius: 10,
            border: 1.5,
            fontSize: 16,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: 32,
            boxShadow: "0 2px 8px rgba(41,103,255,0.07)"
          }}
        >
          {loading ? "Loading..." : "Get Data"}
        </button>

        {error && <p style={{ color: "red", marginBottom: 24 }}>{error}</p>}

        {/* Table or Graph View */}
        {viewMode === "table" && data.length > 0 && (
          <div className="tableArea">
            <div className="tableWrapper">
              <table className="table">
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th key={col} className="th">
                        {columnDisplayNames[col] || col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row, idx) => (
                    <tr key={idx}>
                      {columns.map((col) => {
                        const val = row[col];
                        return (
                          <td key={col} className={`td${col === "date" ? " td-date" : ""}`}>
                            {col === "date" && val
                              ? (() => {
                                  const d = new Date(val);
                                  const day = d.getDate().toString().padStart(2, '0');
                                  const month = d.toLocaleString('en-GB', { month: 'short' });
                                  const year = d.getFullYear();
                                  return `${day} ${month} ${year}`;
                                })()
                              : (col.toLowerCase() === "time stamp" || col.toLowerCase() === "datetime") && val
                              ? new Date(val).toLocaleTimeString("en-GB", { hour12: false }) + ", " +
                                new Date(val).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                              : val === null || val === undefined
                              ? "-"
                              : val.toString()}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
            <div className="paginationBar">
              <div className="paginationControls">
                <button
                  className="pagination-btn arrow"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  aria-label="Previous"
                >
                  <span aria-hidden="true">&lt;</span>
                </button>
                <button
                  className={`pagination-btn${currentPage === 1 ? " active" : ""}`}
                  onClick={() => handlePageChange(1)}
                >
                  1
                </button>
                {currentPage > 3 && totalPages > 5 && (
                  <span className="pagination-ellipsis">…</span>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    pageNum =>
                      pageNum !== 1 &&
                      pageNum !== totalPages &&
                      pageNum >= currentPage - 1 &&
                      pageNum <= currentPage + 1
                  )
                  .map(pageNum => (
                    <button
                      key={pageNum}
                      className={`pagination-btn${currentPage === pageNum ? " active" : ""}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ))}
                {currentPage < totalPages - 2 && totalPages > 5 && (
                  <span className="pagination-ellipsis">…</span>
                )}
                {totalPages > 1 && (
                  <button
                    className={`pagination-btn${currentPage === totalPages ? " active" : ""}`}
                    onClick={() => handlePageChange(totalPages)}
                  >
                    {totalPages}
                  </button>
                )}
                <button
                  className="pagination-btn arrow"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  aria-label="Next"
                >
                  <span aria-hidden="true">&gt;</span>
                </button>
              </div>
              <div className="paginationMeta">
                <span>
                  {startRecord} - {endRecord} of {totalRecords}
                </span>
                <span className="pagination-goto-label">
                  Go to page
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={goToPageInput}
                    onChange={e => setGoToPageInput(e.target.value)}
                    className="pagination-goto-input"
                  />
                  / {totalPages}
                </span>
              </div>
            </div>
          </div>
        )}

        {viewMode === "graph" && (
          <>
            {allMeterIds.length > 1 && (
              <div style={{ marginBottom: 10 }}>
                <label>
                  Select Meter IDs to display (max 5):
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: 5 }}>
                    {allMeterIds.map(id => (
                      <label key={id} style={{ marginRight: 12, display: "flex", alignItems: "center" }}>
                        <input
                          type="checkbox"
                          checked={selectedMeterIds.includes(id)}
                          onChange={() => handleMeterIdCheckbox(id)}
                          disabled={
                            !selectedMeterIds.includes(id) && selectedMeterIds.length >= 5
                          }
                        />
                        <span style={{ marginLeft: 4 }}>{id}</span>
                      </label>
                    ))}
                  </div>
                  <span style={{ marginLeft: 8, color: "#bbb", fontSize: 12 }}>
                    ({selectedMeterIds.length}/5 selected)
                  </span>
                </label>
              </div>
            )}

            {data.length > 0 && (
              <div>
                {graphs.map((graph, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <select
                      value={graph.xAxis}
                      onChange={e => {
                        const newGraphs = [...graphs];
                        newGraphs[idx].xAxis = e.target.value;
                        setGraphs(newGraphs);
                      }}
                      className="select"
                    >
                      <option value="">Select X-Axis</option>
                      {columns.map((col) => (
                        <option key={col} value={col}>
                          {columnDisplayNames[col] || col}
                        </option>
                      ))}
                    </select>
                    <select
                      value={graph.yAxis}
                      onChange={e => {
                        const newGraphs = [...graphs];
                        newGraphs[idx].yAxis = e.target.value;
                        setGraphs(newGraphs);
                      }}
                      className="select"
                    >
                      <option value="">Select Y-Axis</option>
                      {columns.map((col) => (
                        <option key={col} value={col}>
                          {columnDisplayNames[col] || col}
                        </option>
                      ))}
                    </select>
                    {graphs.length > 1 && (
                      <button
                        className="button button-danger"
                        onClick={() => setGraphs(graphs.filter((_, i) => i !== idx))}
                        style={{ marginLeft: 8 }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  className="button"
                  onClick={() =>
                    setGraphs(prevGraphs => {
                      const firstXAxis = prevGraphs.length > 0 ? prevGraphs[0].xAxis : "";
                      return [...prevGraphs, { xAxis: firstXAxis, yAxis: "" }];
                    })
                  }
                  style={{ marginTop: 8 }}
                >
                  Add Another Graph
                </button>
              </div>
            )}
            <div style={{ display: "flex", gap: 24, marginTop: 24, flexWrap: "wrap" }}>
              {graphs.map((graph, idx) => {
                const chartData = getChartData(graph.xAxis, graph.yAxis);
                return (
                  <div key={idx} style={{ flex: 1, minWidth: 400 }}>
                    {graph.xAxis && graph.yAxis && chartData ? (
                      <Line
                        data={chartData}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: { position: "top", labels: { color: "#222" } },
                            title: {
                              display: true,
                              text: `${columnDisplayNames[graph.yAxis] || graph.yAxis} vs. ${columnDisplayNames[graph.xAxis] || graph.xAxis}`,
                              color: "#222",
                            },
                            tooltip: { mode: "index", intersect: false },
                          },
                          scales: {
                            x: {
                              ticks: { color: "#222" },
                              grid: { color: "#ececf1" },
                              title: {
                                display: true,
                                text: columnDisplayNames[graph.xAxis] || graph.xAxis,
                                color: "#222",
                              },
                            },
                            y: {
                              ticks: { color: "#222" },
                              grid: { color: "#ececf1" },
                              title: {
                                display: true,
                                text: columnDisplayNames[graph.yAxis] || graph.yAxis,
                                color: "#222",
                              },
                            },
                          },
                        }}
                      />
                    ) : (
                      <p style={{ color: "#bbb" }}>Select axes to display graph</p>
                    )}
                  </div>
                );
              })}
            </div>

            {data.length === 0 && (
              <p className="noData">
                No data to plot. Switch to Table View or fetch data.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
