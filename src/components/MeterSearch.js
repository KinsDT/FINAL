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
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
    setGoToPageInput("");
  }, [data]);

  useEffect(() => {
    fetch("http://localhost:5000/api/meter-data/tables")
      .then((res) => res.json())
      .then((json) => setTables(json.tables || []))
      .catch(() => setTables([]));
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/meter-data/areas')
      .then(res => res.json())
      .then(data => setAreas(data.areas || []))
      .catch(() => setAreas([]));
  }, []);

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
        setSelectedMeterIds([]);
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
    "": ""
  };

  const columnDisplayNames = {
    date: "Date",
    meter_id: "Meter ID",
    block_name: "Block Name",
    block: "Block",
    voltage_pha: "voltage_pha",
    voltage_phb: "voltage_phb",
    voltage_phc: "voltage_phc",
    v1: "v1",
    v2: "v2",
    v3: "v3",
    vuf: "vuf",
    datetime: "Date Time",
    pfavg3ph: "Power Factor Avg 3 Phase",
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
        setShowTable(false);
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
        setShowTable(true);
      }
    } catch (err) {
      setError(err.message || "Unknown error");
      setData([]);
      setShowTable(false);
    } finally {
      setLoading(false);
    }
  };

  const allMeterIds = useMemo(() => {
    const ids = Array.from(new Set(data.map(row => row.meter_id).filter(Boolean)));
    return ids;
  }, [data]);

  const getColumnsByNonNullCount = (dataArray) => {
    if (!dataArray.length) return [];
    const allCols = Object.keys(dataArray[0]);
    const prioritized = ["date", "meter_id", "block_name", "voltage_pha", "voltage_phb", "voltage_phc", "v1", "v2", "v3", "vuf", "datetime"];
    const otherCols = allCols.filter((c) => !prioritized.includes(c));
    const counts = otherCols.map((col) => {
      const nonNullCount = dataArray.reduce(
        (acc, row) => (row[col] !== null && row[col] !== undefined ? acc + 1 : acc),
        0
      );
      return { col, nonNullCount };
    });
    counts.sort((a, b) => b.nonNullCount - a.nonNullCount);
    return [...prioritized.filter(col => allCols.includes(col)), ...counts.map((c) => c.col)];
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

  const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * recordsPerPage + 1;
  const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  // --- GRAPH DATA LOGIC ---
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
      const sorted = [...rows].sort((a, b) => {
        if (xAxis.toLowerCase() === "time stamp" || xAxis.toLowerCase() === "datetime") {
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

  return (
    <div className="page" style={{ background: "#fff", minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: 1000, margin: "32px auto", padding: "0 24px" }}>
        <h1 className="heading" style={{
          fontFamily: "'GT Walsheim Pro', Arial, sans-serif",
          fontWeight: 700,
          fontSize: 24,
          marginBottom: 24,
          color: "#27272A"
        }}>
          Meter-wise Dashboard
        </h1>

        {!showTable ? (
          <>
            {/* --- SEARCH FORM --- */}
            {/* ... (same as previous code, omitted for brevity) ... */}
            {/* Use the search form code from the previous answer */}
            {/* ... */}
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
                  style={{
                    flex: 1,
                    minWidth: 0,
                    borderRadius: "12px 0 0 12px",
                    fontSize: 16,
                    color: "#27272A",
                    background: "#fff"
                  }}
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
                  className="meter-select"
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
              <div style={{ display: "flex", gap: 0 }}>
                <input
                  type="date"
                  placeholder="Select Start Date"
                  value={fromDate}
                  onChange={e => setFromDate(e.target.value)}
                  style={{
                    width: "180px",
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
                    width: "180px",
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
                  Table View
                </label>
                <label style={{ display: "flex", alignItems: "center", fontSize: 16, color: "#27272A" }}>
                  <input
                    type="radio"
                    name="dataFormat"
                    checked={viewMode === "graph"}
                    onChange={() => setViewMode("graph")}
                    style={{ marginRight: 8 }}
                  />
                  Graphical View
                </label>
              </div>
            </div>
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
          </>
        ) : (
          <>
            {/* --- BACK BUTTON --- */}
            <button
              onClick={() => setShowTable(false)}
              style={{
                position: "relative",
                top: -84,
                left: -8,
                marginBottom: 12,
                background: "none",
                border: "none",
                color: "#1773BE",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center"
              }}
            >
              <span style={{ fontSize: 22, marginRight: 8 }}>&larr;</span>
              
            </button>
            {/* --- SUMMARY HEADER --- */}
            <div className="table-summary" style={{
    display: "flex",
    position: "relative",
    top: -64,
    alignItems: "center",
    gap: 48,
    marginBottom: 32,
    whiteSpace: "nowrap",
    fontSize: 16,
    fontFamily: "'GT Walsheim Pro', Arial, sans-serif",
    fontWeight: 400
  }}
>
  <div>
    <div style={{ color: "#B0B0B0", fontSize: 16, marginBottom: 2 }}>Parameter Name</div>
    <div style={{ color: "#27272A", fontWeight: 500, fontSize: 16 }}>
      {tableDisplayNames[tableName] || tableName}
    </div>
  </div>
  <div>
    <div style={{ color: "#B0B0B0", fontSize: 16, marginBottom: 2 }}>Sub-division</div>
    <div style={{ color: "#27272A", fontWeight: 500, fontSize: 16 }}>
      {selectedArea}
    </div>
  </div>
  <div>
    <div style={{ color: "#B0B0B0", fontSize: 16, marginBottom: 2 }}>Meter IDs</div>
    <div style={{ color: "#27272A", fontWeight: 500, fontSize: 16 }}>
      {selectedMeterIds.join(", ")}
    </div>
  </div>
  <div>
    <div style={{ color: "#B0B0B0", fontSize: 16, marginBottom: 2 }}>Dates</div>
    <div style={{ color: "#27272A", fontWeight: 500, fontSize: 16 }}>
      {formatDate(fromDate)}{fromDate && toDate ? " - " : ""}{formatDate(toDate)}
    </div>
  </div>
              <div
  style={{
    display: "flex",
    alignItems: "center",
    borderRadius: 10,
    border: "1.5px solid #E7E7EC",
    background: "#fff",
    overflow: "hidden",
    width: 284,
    height: 48,
    padding: 4,
    marginLeft: "auto",
    position: "relative",
  }}
>
  <button
    onClick={() => setViewMode("table")}
    style={{
      flex: 1,
      border: 1,
      outline: "none",
      background: viewMode === "table" ? "#E9F3FF" : "transparent",
      color: viewMode === "table" ? "#1773BE" : "#27272A",
      fontWeight: 500,
      fontSize: 16,
      height: 48,
      width: "100%",
      cursor: "pointer",
      transition: "background 0.2s, color 0.2s",
      boxShadow: "0 4 12 0 rgba(0, 0, 0, 0.08)",
      borderRadius: 6,
      zIndex: 10,
    }}
  >
    Table View
  </button>
  <button
    onClick={() => setViewMode("graph")}
    style={{
      flex: 1,
      border: "none",
      outline: "none",
      background: viewMode === "graph" ? "#E9F3FF" : "transparent",
      color: viewMode === "graph" ? "#1773BE" : "#27272A",
      fontWeight: 500,
      fontSize: 17,
      height: 44,
      cursor: "pointer",
      transition: "background 0.2s, color 0.2s",
      boxShadow: "none",
      borderRadius: 0,
      zIndex: 1,
    }}
  >
    Graphical View
  </button>
</div>

            </div>
            {/* --- TABLE --- */}
            {viewMode === "table" && (
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
            {/* --- GRAPHICAL VIEW --- */}
            {viewMode === "graph" && (
              <div style={{ marginTop: 24 }}>
                {graphs.map((graph, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <Select
                      value={graph.xAxis}
                      onChange={value => {
                        const newGraphs = [...graphs];
                        newGraphs[idx].xAxis = value;
                        setGraphs(newGraphs);
                      }}
                      placeholder="Select X-Axis"
                      style={{ minWidth: 180 }}
                      options={columns.map(col => ({
                        value: col,
                        label: columnDisplayNames[col] || col
                      }))}
                      allowClear
                      showSearch
                    />
                    <Select
                      value={graph.yAxis}
                      onChange={value => {
                        const newGraphs = [...graphs];
                        newGraphs[idx].yAxis = value;
                        setGraphs(newGraphs);
                      }}
                      placeholder="Select Y-Axis"
                      style={{ minWidth: 180 }}
                      options={columns.map(col => ({
                        value: col,
                        label: columnDisplayNames[col] || col
                      }))}
                      allowClear
                      showSearch
                    />
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
                  style={{ marginTop: 8, marginBottom: 24 }}
                >
                  Add Another Graph
                </button>
                <div style={{ display: "flex", gap: 24, marginTop: 24, flexWrap: "wrap" }}>
                  {graphs.map((graph, idx) => {
                    const chartData = getChartData(graph.xAxis, graph.yAxis);
                    return (
                      <div key={idx} style={{ flex: 1, minWidth: 400, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(41,103,255,0.04)", padding: 24 }}>
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
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
