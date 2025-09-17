import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export default function DashboardChart() {
  // Contoh data suhu (misalnya dalam derajat Celcius)
  const suhuData = [100, 200, 250, 300, 350, 400, 420];
  const waktu = [0, 1, 2, 3, 4, 5, 6]; // Misalnya menit

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Grafik Monitoring Suhu</h2>
      <LineChart
        xAxis={[{ label: 'Menit', data: waktu }]}
        series={[
          {
            data: suhuData,
            label: 'Suhu (°C)',
            color: '#1e40af', // biru gelap
          },
        ]}
        width={600}
        height={300}
      />
    </div>
  );
}