import React from 'react';
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
import kebunData from '../data/kebun.json';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function DashboardChart() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Agregasi data per distrik
  const aggregatedData = {};
  kebunData.forEach(item => {
    const distrik = item.singkatan_distrik;
    if (!aggregatedData[distrik]) {
      aggregatedData[distrik] = {
        distrik,
        totalLuas: 0,
        totalInventaris: 0,
        totalRumah: 0,
        kebuns: []
      };
    }
    aggregatedData[distrik].totalLuas += item.luas_ha;
    aggregatedData[distrik].totalInventaris += item.inventaris;
    aggregatedData[distrik].totalRumah += 1;
    aggregatedData[distrik].kebuns.push(item);
  });
  
  // Hitung rata-rata per rumah per distrik
  Object.keys(aggregatedData).forEach(distrik => {
    const data = aggregatedData[distrik];
    data.avgLuasPerRumah = data.totalLuas / data.totalRumah;
    data.avgInventarisPerRumah = data.totalInventaris / data.totalRumah;
  });
  
  // Ubah ke array dan urutkan
  const aggregatedArray = Object.values(aggregatedData).sort((a, b) => b.totalLuas - a.totalLuas);
  
  // Ambil 5 distrik teratas untuk radar chart
  const top5Distrik = aggregatedArray.slice(0, 5);
  
  // Ambil 5 kebun terbesar untuk line chart
  const top5KebunByLuas = [...kebunData].sort((a, b) => b.luas_ha - a.luas_ha).slice(0, 5);
  const top5KebunByInventaris = [...kebunData].sort((a, b) => b.inventaris - a.inventaris).slice(0, 5);
  
  // Total inventaris untuk gauge chart
  const totalInventaris = kebunData.reduce((sum, item) => sum + item.inventaris, 0);
  const targetInventaris = 2000000; // Target 2 juta pohon
  const gaugeValue = Math.min(100, (totalInventaris / targetInventaris) * 100);
  
  // Data untuk BarChart (Luas per Distrik)
  const barChartData = aggregatedArray.map(item => ({
    distrik: item.distrik.length > (isMobile ? 6 : 15) ? item.distrik.substring(0, isMobile ? 6 : 15) + '...' : item.distrik,
    luas: Math.round(item.totalLuas),
    inventaris: item.totalInventaris
  }));
  
  // Data untuk PieChart (Proporsi Luas per Distrik)
  const pieChartData = aggregatedArray.map((item, index) => ({
    id: index,
    value: Math.round(item.totalLuas),
    label: item.distrik.length > (isMobile ? 5 : 10) ? item.distrik.substring(0, isMobile ? 5 : 10) + '...' : item.distrik
  }));
  
  // Data untuk ScatterChart (Luas vs Inventaris per Kebun)
  const scatterChartData = kebunData.map(item => ({
    x: item.luas_ha,
    y: item.inventaris,
    z: item.luas_ha + item.inventaris,
    name: item.kode.length > (isMobile ? 6 : 15) ? item.kode.substring(0, isMobile ? 6 : 15) + '...' : item.kode
  }));
  
  // Data untuk LineChart (5 Kebun Terbesar)
  const lineChartData = {
    labels: top5KebunByLuas.map(item => 
      item.kode.length > (isMobile ? 6 : 12) ? item.kode.substring(0, isMobile ? 6 : 12) + '...' : item.kode
    ),
    series: [
      {
        data: top5KebunByLuas.map(item => Math.round(item.luas_ha)),
        label: 'Luas (ha)',
        color: '#8884d8',
      },
      {
        data: top5KebunByLuas.map(item => item.inventaris),
        label: 'Inventaris',
        color: '#82ca9d',
      }
    ]
  };
  
  // Data untuk RadarChart (5 Distrik Teratas)
  const radarChartData = {
    series: top5Distrik.map(distrik => ({
      label: distrik.distrik.length > (isMobile ? 5 : 10) ? distrik.distrik.substring(0, isMobile ? 5 : 10) + '...' : distrik.distrik,
      data: [
        distrik.totalLuas / 1000, // Skala down untuk readability
        distrik.totalInventaris / 10000, // Skala down untuk readability
        distrik.totalRumah,
        distrik.avgLuasPerRumah,
        distrik.avgInventarisPerRumah
      ],
      valueFormatter: (value) => value.toFixed(1)
    })),
    metrics: ['Luas (ribu ha)', 'Inventaris (ribu pohon)', 'Jml Rumah', 'Rata-rata Luas/Rumah', 'Rata-rata Inventaris/Rumah']
  };
  
  // Data untuk BarChart di Card 7 (Top 5 Kebun by Luas)
  const barChartTop5Luas = {
    labels: top5KebunByLuas.map(item => 
      item.kode.length > (isMobile ? 6 : 12) ? item.kode.substring(0, isMobile ? 6 : 12) + '...' : item.kode
    ),
    series: [
      {
        data: top5KebunByLuas.map(item => Math.round(item.luas_ha)),
        label: 'Luas (ha)',
        color: '#8884d8',
      }
    ]
  };
  
  // Data untuk BarChart di Card 7 (Top 5 Kebun by Inventaris)
  const barChartTop5Inventaris = {
    labels: top5KebunByInventaris.map(item => 
      item.kode.length > (isMobile ? 6 : 12) ? item.kode.substring(0, isMobile ? 6 : 12) + '...' : item.kode
    ),
    series: [
      {
        data: top5KebunByInventaris.map(item => item.inventaris),
        label: 'Inventaris (pohon)',
        color: '#82ca9d',
      }
    ]
  };
  
  // Chart dimensions based on screen size
  const getChartDimensions = () => {
    if (isMobile) {
      return { width: 280, height: 200 };
    } else if (isTablet) {
      return { width: 350, height: 250 };
    } else {
      return { width: 400, height: 300 };
    }
  };
  
  const chartSetting = getChartDimensions();
  const pieSize = getChartDimensions();
  const gaugeSettings = { 
    value: gaugeValue, 
    width: chartSetting.width, 
    height: chartSetting.height,
    text: `${gaugeValue.toFixed(1)}%`
  };
  
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(400px, 1fr))', 
      gap: isMobile ? 15 : 20,
      marginBottom: 30,
      width: '100%'
    }}>
      {/* Card 1: BarChart */}
      <Paper style={{ 
        padding: isMobile ? 10 : 16, 
        borderRadius: 12,
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        height: isMobile ? '300px' : '400px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <h3 style={{ 
          textAlign: 'center', 
          marginBottom: isMobile ? 10 : 20, 
          color: '#1976d2',
          fontSize: isMobile ? '0.9rem' : '1.2rem'
        }}>
          Luas Kebun per Distrik
        </h3>
        <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BarChart
            dataset={barChartData}
            xAxis={[{ 
              dataKey: 'distrik', 
              scaleType: 'band',
              tickLabelStyle: { fontSize: isMobile ? 8 : 10 }
            }]}
            yAxis={[{ tickLabelStyle: { fontSize: isMobile ? 8 : 10 } }]}
            series={[
              { dataKey: 'luas', label: 'Luas (ha)', valueFormatter: (value) => `${value} ha` },
            ]}
            {...chartSetting}
            colors={['#8884d8']}
            margin={{ top: 20, right: 20, left: 20, bottom: isMobile ? 50 : 30 }}
          />
        </div>
      </Paper>
      
      {/* Card 2: PieChart */}
      <Paper style={{ 
        padding: isMobile ? 10 : 16, 
        borderRadius: 12,
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        height: isMobile ? '300px' : '400px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <h3 style={{ 
          textAlign: 'center', 
          marginBottom: isMobile ? 10 : 20, 
          color: '#1976d2',
          fontSize: isMobile ? '0.9rem' : '1.2rem'
        }}>
          Proporsi Luas per Distrik
        </h3>
        <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PieChart
            series={[
              {
                arcLabel: (item) => isMobile ? `${item.value}` : `${item.value} ha`,
                arcLabelMinAngle: 35,
                arcLabelRadius: '60%',
                data: pieChartData,
              },
            ]}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fontWeight: 'bold',
                fontSize: isMobile ? '0.6rem' : '0.8rem',
              },
            }}
            {...pieSize}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          />
        </div>
      </Paper>
      
      {/* Card 3: ScatterChart */}
      <Paper style={{ 
        padding: isMobile ? 10 : 16, 
        borderRadius: 12,
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        height: isMobile ? '300px' : '400px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <h3 style={{ 
          textAlign: 'center', 
          marginBottom: isMobile ? 10 : 20, 
          color: '#1976d2',
          fontSize: isMobile ? '0.9rem' : '1.2rem'
        }}>
          Produktivitas Kebun
        </h3>
        <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ScatterChart
            series={[{
              data: scatterChartData,
            }]}
            xAxis={[{ 
              label: 'Luas (ha)',
              min: 0,
              max: Math.max(...scatterChartData.map(d => d.x)) * 1.1,
              tickLabelStyle: { fontSize: isMobile ? 8 : 10 }
            }]}
            yAxis={[{ 
              label: 'Inventaris (pohon)',
              min: 0,
              max: Math.max(...scatterChartData.map(d => d.y)) * 1.1,
              tickLabelStyle: { fontSize: isMobile ? 8 : 10 }
            }]}
            zAxis={[{}]}
            tooltip={{ trigger: 'item' }}
            {...chartSetting}
            margin={{ top: 20, right: 20, left: 20, bottom: isMobile ? 50 : 30 }}
          />
        </div>
      </Paper>
      
      {/* Card 4: Gauge */}
      <Paper style={{ 
        padding: isMobile ? 10 : 16, 
        borderRadius: 12,
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        height: isMobile ? '300px' : '400px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <h3 style={{ 
          textAlign: 'center', 
          marginBottom: isMobile ? 10 : 20, 
          color: '#1976d2',
          fontSize: isMobile ? '0.9rem' : '1.2rem'
        }}>
          Pencapaian Target 
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
          <Gauge
            {...gaugeSettings}
            cornerRadius="50%"
            sx={(theme) => ({
              [`& .${gaugeClasses.valueText}`]: {
                fontSize: isMobile ? 24 : 40,
              },
              [`& .${gaugeClasses.valueArc}`]: {
                fill: '#52b202',
              },
              [`& .${gaugeClasses.referenceArc}`]: {
                fill: theme.palette.text.disabled,
              },
            })}
          />
          <p style={{ marginTop: 10, fontWeight: 'bold', color: '#1976d2', fontSize: isMobile ? '0.8rem' : '1rem' }}>
            Pencapaian Target Hatch & Carry
          </p>
          <p style={{ fontSize: isMobile ? '0.7rem' : '0.9rem', textAlign: 'center' }}>
            {totalInventaris.toLocaleString()} / 1000000 juta pohon dari {targetInventaris / 1000000} juta target
          </p>
        </div>
      </Paper>
      
      {/* Card 5: LineChart */}
      <Paper style={{ 
        padding: isMobile ? 10 : 16, 
        borderRadius: 12,
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        height: isMobile ? '300px' : '400px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <h3 style={{ 
          textAlign: 'center', 
          marginBottom: isMobile ? 10 : 20, 
          color: '#1976d2',
          fontSize: isMobile ? '0.9rem' : '1.2rem'
        }}>
          3 Kebun Terbesar
        </h3>
        <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LineChart
            xAxis={[{ 
              data: lineChartData.labels,
              scaleType: 'band',
              tickLabelStyle: { fontSize: isMobile ? 8 : 10 }
            }]}
            yAxis={[{ tickLabelStyle: { fontSize: isMobile ? 8 : 10 } }]}
            series={lineChartData.series}
            {...chartSetting}
            margin={{ top: 20, right: 20, left: 20, bottom: isMobile ? 50 : 30 }}
          />
        </div>
      </Paper>
      
      {/* Card 6: RadarChart */}
      <Paper style={{ 
        padding: isMobile ? 10 : 16, 
        borderRadius: 12,
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        height: isMobile ? '300px' : '400px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <h3 style={{ 
          textAlign: 'center', 
          marginBottom: isMobile ? 10 : 20, 
          color: '#1976d2',
          fontSize: isMobile ? '0.9rem' : '1.2rem'
        }}>
          Performa Distrik Teratas
        </h3>
        <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RadarChart
            {...chartSetting}
            series={radarChartData.series}
            radar={{ metrics: radarChartData.metrics }}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          />
        </div>
      </Paper>

{/* Card 7: Dua BarChart - MODIFIED */}
<Paper style={{ 
  padding: isMobile ? 10 : 16, 
  borderRadius: 12  ,
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  height: isMobile ? '600px' : '700px', // Tinggi ditingkatkan karena ada 2 chart
  display: 'flex',
  flexDirection: 'column',
  gridColumn: '1 / -1', // Ini yang membuat card menempati lebar penuh
  overflow: 'hidden'
}}>
  <h3 style={{ 
    textAlign: 'center', 
    marginBottom: isMobile ? 10 : 20, 
    color: '#1976d2',
    fontSize: isMobile ? '0.9rem' : '1.2rem'
  }}>
    Top 3 Kebun
  </h3>
  
  <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
    {/* Chart Berdasarkan Luas */}
    <div style={{ 
      width: '100%', 
      marginBottom: isMobile ? 10 : 15,
      flex: 1
    }}>
      <h4 style={{ textAlign: 'center', marginBottom: 5, fontSize: isMobile ? '0.8rem' : '0.9rem' }}>Berdasarkan Luas</h4>
      <div style={{ height: 'calc(100% - 25px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <BarChart
          xAxis={[{ 
            data: barChartTop5Luas.labels,
            scaleType: 'band',
            tickLabelStyle: { fontSize: isMobile ? 7 : 9 }
          }]}
          yAxis={[{ tickLabelStyle: { fontSize: isMobile ? 7 : 9 } }]}
          series={barChartTop5Luas.series}
          width={isMobile ? 280 : 700} // Lebar diperbesar untuk mengisi container
          height={isMobile ? 200 : 250}
          margin={{ top: 10, right: 10, left: 10, bottom: isMobile ? 40 : 20 }}
        />
      </div>
    </div>
    
    {/* Chart Berdasarkan Inventaris */}
    <div style={{ 
      width: '100%', 
      flex: 1
    }}>
      <h4 style={{ textAlign: 'center', marginBottom: 5, fontSize: isMobile ? '0.8rem' : '0.9rem' }}>Berdasarkan Inventaris</h4>
      <div style={{ height: 'calc(100% - 25px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <BarChart
          xAxis={[{ 
            data: barChartTop5Inventaris.labels,
            scaleType: 'band',
            tickLabelStyle: { fontSize: isMobile ? 7 : 9 }
          }]}
          yAxis={[{ tickLabelStyle: { fontSize: isMobile ? 7 : 9 } }]}
          series={barChartTop5Inventaris.series}
          width={isMobile ? 280 : 700} // Lebar diperbesar untuk mengisi container
          height={isMobile ? 200 : 250}
          margin={{ top: 10, right: 10, left: 10, bottom: isMobile ? 40 : 20 }}
        />
      </div>
    </div>
  </div>
</Paper>
    </div>
  );
}