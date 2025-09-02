import React from 'react';
import Carousel from 'react-material-ui-carousel';
import {
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  Gauge,
  pieArcLabelClasses,
} from '@mui/x-charts';
import { Paper } from '@mui/material';
import { RadarChart } from '@mui/x-charts/RadarChart';
import { gaugeClasses } from '@mui/x-charts/Gauge';

export default function AllChartsExample() {
  const multiLineSeries = [
    { data: [2, -5.5, 2, -7.5, 1.5, 6], label: 'Series A', area: true, baseline: 'min' },
    { data: [1, 3, 2, 4, 3, 2], label: 'Series B', area: true, baseline: 'min' },
    { data: [-2, 1, -1, 2, -2, 1], label: 'Series C', area: true, baseline: 'min' },
  ];

  const dataset = [
    { month: 'Jan', london: 50, paris: 70, newYork: 90, seoul: 60 },
    { month: 'Feb', london: 80, paris: 50, newYork: 75, seoul: 40 },
    { month: 'Mar', london: 60, paris: 80, newYork: 65, seoul: 50 },
  ];

  const chartSetting = { width: 500, height: 300 };
  const valueFormatter = (value) => `${value}k`;

  const pieData = {
    data: [
      { id: 0, value: 40, label: 'A' },
      { id: 1, value: 30, label: 'B' },
      { id: 2, value: 20, label: 'C' },
      { id: 3, value: 10, label: 'D' },
    ],
  };

  const pieSize = { width: 300, height: 300 };

  const scatterPoints = [
    { x: -2, y: 4 }, { x: -1, y: 1 }, { x: 0, y: -1 },
    { x: 1, y: 2 }, { x: 2, y: -3 },
  ];

  const gaugeSettings = { value: 75, width: 300, height: 300 };

  const radarSeries = [
    {
      label: 'USA',
      data: [6.65, 2.76, 5.15, 0.19, 0.07, 0.12],
      valueFormatter,
    },
    {
      label: 'Australia',
      data: [5.52, 5.5, 3.19, 0.51, 0.15, 0.11],
      valueFormatter,
    },
    {
      label: 'United Kingdom',
      data: [2.26, 0.29, 2.03, 0.05, 0.04, 0.06],
      valueFormatter,
    },
  ];

  const radarMetrics = ['Oil', 'Coal', 'Gas', 'Flaring', 'Other\nindustry', 'Cement'];

  return (
    <div style={{ padding: 32 }}>
      <h2>Dashboard</h2>
      <Carousel
        navButtonsAlwaysVisible
        fullHeightHover={false}
        indicatorContainerProps={{
          style: { marginTop: '16px' }
        }}
      >
         {/* Slide 1: Image Placeholder */}
        <Paper style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img
              src="/public/1.png"
              alt="Image 1"
              width="500"
              height="300"
            />
          </div>
        </Paper>

        {/* Slide 2: Image Placeholder */}
        <Paper style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img
              src="https://www.masakapahariini.com/wp-content/uploads/2023/05/shutterstock_1967421388-500x300.jpg"
              alt="Image 2"
              width="500"
              height="300"
            />
          </div>
        </Paper>

        {/* Slide 3: Image Placeholder */}
        <Paper style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/59/500_x_300_Ramosmania_rodriguesii_%28Rubiaceae%29.jpg"
              alt="Image 3"
              width="500"
              height="300"
            />
          </div>
        </Paper>
      </Carousel>
        {/* Slide 1: LineChart + BarChart */}
        <Paper style={{ padding: 16 }}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <LineChart
              xAxis={[{ data: [1, 2, 3, 5, 8, 10], label: 'X Axis' }]}
              series={multiLineSeries}
              height={300}
              width={500}
            />
            <BarChart
              dataset={dataset}
              xAxis={[{ dataKey: 'month' }]}
              series={[
                { dataKey: 'london', label: 'London', valueFormatter },
                { dataKey: 'paris', label: 'Paris', valueFormatter },
                { dataKey: 'newYork', label: 'New York', valueFormatter },
                { dataKey: 'seoul', label: 'Seoul', valueFormatter },
              ]}
              {...chartSetting}
            />
          </div>
        </Paper>

        {/* Slide 2: PieChart + ScatterChart */}
        <Paper style={{ padding: 16 }}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <PieChart
              series={[
                {
                  arcLabel: (item) => `${item.value}%`,
                  arcLabelMinAngle: 35,
                  arcLabelRadius: '60%',
                  ...pieData,
                },
              ]}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fontWeight: 'bold',
                },
              }}
              {...pieSize}
            />

            <ScatterChart
              series={[{
                data: scatterPoints.map((pt) => ({ ...pt, z: pt.x + pt.y })),
              }]}
              xAxis={[{
                colorMap: {
                  type: 'piecewise',
                  thresholds: [-1.5, 0, 1.5],
                  colors: ['#d01c8b', '#f1b6da', '#b8e186', '#4dac26'],
                },
              }]}
              yAxis={[{}]}
              zAxis={[{}]}
              width={400}
              height={300}
            />
          </div>
        </Paper>

        {/* Slide 3: Gauge + RadarChart */}
        <Paper style={{ padding: 16 }}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            <Gauge
              {...gaugeSettings}
              cornerRadius="50%"
              sx={(theme) => ({
                [`& .${gaugeClasses.valueText}`]: {
                  fontSize: 40,
                },
                [`& .${gaugeClasses.valueArc}`]: {
                  fill: '#52b202',
                },
                [`& .${gaugeClasses.referenceArc}`]: {
                  fill: theme.palette.text.disabled,
                },
              })}
            />

            <RadarChart
              height={300}
              width={400}
              series={radarSeries}
              radar={{ metrics: radarMetrics }}
            />
          </div>
        </Paper>
    </div>
  );
}