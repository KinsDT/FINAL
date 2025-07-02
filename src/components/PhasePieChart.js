/*import React from 'react';
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
      <div style={{ textAlign: 'center' , marginBottom: 8, fontFamily: 'GT Walsheim Pro',fontWeight: 500, fontSize:'16px'}}>{title}</div>
      <Pie data={chartData} options={{ plugins: { legend: { display: true, position: 'bottom' } } }} />
    </div>
  );
}
*/
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

  const chartOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          font: {
            family: 'GT Walsheim Pro',
            size: 14,
            weight: '400',
          },
          color: '#808089',
          padding: 12,
          boxWidth: 12,
        },
      },
    },
  };

  return (
    <div style={{ width: 220, margin: '0 16px' }}>
      <div
        style={{
          textAlign: 'center',
          marginBottom: 8,
          fontFamily: 'GT Walsheim Pro',
          fontWeight: 500,
          fontSize: '16px',
        }}
      >
        {title}
      </div>
      <Pie data={chartData} options={chartOptions} />
    </div>
  );
}
