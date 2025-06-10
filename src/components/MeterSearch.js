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
import '../styles/MeterSearch.css';
 // Import the CSS file

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
);

const ToggleSwitch = ({ onChange, isChecked }) => {
  const handleToggleChange = () => {
    onChange(!isChecked);
  };

  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleToggleChange}
      />
      <span className="slider"></span>
    </label>
  );
};

export default function MeterSearch() {
  const [tableName, setTableName] = useState("");
  const [meterIdsInput, setMeterIdsInput] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [data, setData] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [selectedMeterIds, setSelectedMeterIds] = useState([]);

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
    datetime: "Datetime",
    "Time Stamp": "Time Stamp"
  };

  useEffect(() => {
    fetch("http://10.21.2.108:5000/tables")
      .then((res) => res.json())
      .then((json) => setTables(json.tables || []))
      .catch(() => setTables([]));
  }, []);

  const fetchData = async () => {
    if (!tableName) {
      setError("Please select a table");
      setData([]);
      return;
    }
    const ids = meterIdsInput
      .split(",")
      .map((id) => id.trim().toUpperCase())
      .filter(Boolean);

    if (ids.length === 0) {
      setError("Please enter at least one Meter ID");
      setData([]);
      return;
    }

    setLoading(true);
    setError("");
    let combinedData = [];

    try {
      for (const rawId of ids) {
        const url = new URL("http://10.21.2.108:5000/data");
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

        // Set default axes for graph if available
        const cols = Object.keys(combinedData[0]);
        let defaultX =
          cols.find(c => c.toLowerCase() === "time stamp".toLowerCase()) ||
          cols.find(c => c.toLowerCase() === "datetime") ||
          cols[0];
        let defaultY = cols.find(col => col !== defaultX) || cols[1] || "";

        setXAxis(defaultX);
        setYAxis(defaultY);
      }
    } catch (err) {
      setError(err.message || "Unknown error");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // All unique meter IDs in the current data
  const allMeterIds = useMemo(() => {
    const ids = Array.from(new Set(data.map(row => row.meter_id).filter(Boolean)));
    return ids;
  }, [data]);

  // Set default selectedMeterIds to first 5 when data changes
  useEffect(() => {
    if (allMeterIds.length > 0) {
      setSelectedMeterIds(allMeterIds.slice(0, 5));
    } else {
      setSelectedMeterIds([]);
    }
    // eslint-disable-next-line
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

  // Prepare chart data when in graph mode and both axes are chosen
  const chartData = useMemo(() => {
    if (
      viewMode !== "graph" ||
      !xAxis ||
      !yAxis ||
      !data.length ||
      !selectedMeterIds.length
    )
      return null;

    const grouped = {};
    data.forEach((row) => {
      const id = row.meter_id || "UNKNOWN";
      if (!selectedMeterIds.includes(id)) return;
      if (!grouped[id]) grouped[id] = [];
      grouped[id].push(row);
    });

    const datasets = Object.entries(grouped).map(([id, rows]) => {
      const sorted = [...rows].sort((a, b) => {
        if (xAxis === "date") {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
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
            xAxis === "date"
              ? new Date(r.date).toLocaleDateString()
              : xAxis.toLowerCase() === "time stamp" || xAxis.toLowerCase() === "datetime"
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
  }, [viewMode, xAxis, yAxis, data, selectedMeterIds]);

  return (
    <div className="page">
      <img src="/kimbal-logo.png" alt="Kimbal Logo" className="logo" />

      <div className="container">
        <h1 className="heading">Meter Data Search</h1>

        {/* View toggle: Table View vs. Graphical View */}
        <div className="controls" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ToggleSwitch
            onChange={(checked) => setViewMode(checked ? "graph" : "table")}
            isChecked={viewMode === "graph"}
          />
          <span>
            {viewMode === "table" ? "Switch to graphical view" : "Switch to Tabular view"}
          </span>
        </div>

        {viewMode === "table" && (
          <div className="controls">
            <select
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              className="select"
            >
              <option value="">Select Table</option>
              {tables.map((table) => (
                <option key={table} value={table}>
                  {tableDisplayNames[table] || table}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Enter Meter IDs (comma-separated)"
              value={meterIdsInput}
              onChange={(e) => setMeterIdsInput(e.target.value)}
              className="input"
            />

            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="dateInput"
            />

            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="dateInput"
            />

            <button
              onClick={fetchData}
              disabled={loading}
              className={loading ? "buttonDisabled" : "button"}
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </div>
        )}

        {error && <p className="error">{error}</p>}

        {/* TABLE VIEW */}
        {viewMode === "table" && data.length > 0 && (
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
                {data.map((row, idx) => (
                  <tr key={idx}>
                    {columns.map((col) => {
                      const val = row[col];
                      return (
                        <td key={col} className="td">
                          {col === "date" && val
                            ? new Date(val).toLocaleDateString()
                            : (col.toLowerCase() === "time stamp" || col.toLowerCase() === "datetime") && val
                            ? new Date(val).toLocaleString()
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
        )}

        {/* GRAPHICAL VIEW */}
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
              <div className="controls">
                <select
                  value={xAxis}
                  onChange={(e) => setXAxis(e.target.value)}
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
                  value={yAxis}
                  onChange={(e) => setYAxis(e.target.value)}
                  className="select"
                >
                  <option value="">Select Y-Axis</option>
                  {columns.map((col) => (
                    <option key={col} value={col}>
                      {columnDisplayNames[col] || col}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {xAxis && yAxis && chartData && (
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top", labels: { color: "#e0e0e0" } },
                    title: {
                      display: true,
                      text: `${columnDisplayNames[yAxis] || yAxis} vs. ${columnDisplayNames[xAxis] || xAxis}`,
                      color: "#e0e0e0",
                    },
                    tooltip: { mode: "index", intersect: false },
                  },
                  scales: {
                    x: {
                      ticks: { color: "#e0e0e0" },
                      grid: { color: "#444" },
                      title: {
                        display: true,
                        text: columnDisplayNames[xAxis] || xAxis,
                        color: "#e0e0e0",
                      },
                    },
                    y: {
                      ticks: { color: "#e0e0e0" },
                      grid: { color: "#444" },
                      title: {
                        display: true,
                        text: columnDisplayNames[yAxis] || yAxis,
                        color: "#e0e0e0",
                      },
                    },
                  },
                }}
              />
            )}

            {data.length === 0 && (
              <p className="noData">
                No data to plot. Switch to Table View or fetch data.
              </p>
            )}
            {data.length > 0 && (!xAxis || !yAxis) && (
              <p className="noData">
                Please select both X-axis and Y-axis to see the graph.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}