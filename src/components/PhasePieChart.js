import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

export default function PhasePieChart({ title, labels, data, colors }) {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors || ['#36A2EB', '#FF6384', '#FFCE56'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: 220, margin: '0 16px' }}>
      <div style={{ textAlign: 'center', fontWeight: 600, marginBottom: 8 }}>{title}</div>
      <Pie data={chartData} options={{ plugins: { legend: { display: true, position: 'bottom' } } }} />
    </div>
  );
}
