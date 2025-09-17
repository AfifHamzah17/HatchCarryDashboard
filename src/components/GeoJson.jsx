// src/components/GeoJson.jsx
import React, { useEffect, useState, useRef } from 'react';
import { GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const GeoJson = ({ mapRef }) => {
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const blockColors = useRef({});

  useEffect(() => {
    // console.log('Fetching GeoJSON data...');
    setLoading(true);
    
    fetch('/data/1KKI_SAP.geojson')
      .then(response => {
        // console.log('Response status:', response.status);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        // console.log('GeoJSON loaded successfully:', data);
        // console.log('Number of features:', data.features?.length || 0);
        
        // Log properties dari fitur pertama untuk debugging
        if (data.features && data.features.length > 0) {
        //   console.log('First feature properties:', data.features[0].properties);
        }
        
        setGeoData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading GeoJSON:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // Generate warna random untuk setiap blok
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const styleFeature = (feature) => {
    const blockName = feature.properties?.BLOK;
    
    // Jika blok belum punya warna, buat warna random baru
    if (!blockColors.current[blockName]) {
      blockColors.current[blockName] = getRandomColor();
    //   console.log(`Assigned color ${blockColors.current[blockName]} to block ${blockName}`);
    }
    
    return {
      fillColor: blockColors.current[blockName],
      weight: 2,
      opacity: 1,
      color: 'black',
      fillOpacity: 0.2, // opacity kml
    };
  };

  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      const props = feature.properties;
    //   console.log('Adding popup for feature:', props);
      
      const popupContent = `
        <div>
          <h3><strong>Blok ${props.BLOK || 'N/A'}</strong></h3>
          <p><strong>Kebun:</strong> ${props.KEBUN || 'N/A'}</p>
          <p><strong>Afdeling:</strong> ${props.AFDELING || 'N/A'}</p>
          <p><strong>Tahun Tanam:</strong> ${props.TAHUNTANAM || 'N/A'}</p>
        </div>
      `;
      layer.bindPopup(popupContent);
      
      // Tambahkan label di centroid
      const centroid = getCentroid(feature);
      if (centroid && mapRef.current) {
        const blockName = props.BLOK || 'N/A';
        
        // Buat label dengan warna yang sama dengan blok
        const labelIcon = L.divIcon({
          className: 'block-label',
          html: `<div style="background-color: ${blockColors.current[blockName]}20; border: 2px solid ${blockColors.current[blockName]};">
                  <div class="block-name">${blockName}</div>
                </div>`,
          iconSize: [80, 30],
          iconAnchor: [40, 15]
        });
        
        // Tambahkan marker label ke peta
        L.marker(centroid, { icon: labelIcon, interactive: false }).addTo(mapRef.current);
      }
    }
  };

  // Fungsi untuk menghitung centroid dari poligon
  const getCentroid = (feature) => {
    if (!feature.geometry) return null;
    
    const geometry = feature.geometry;
    if (geometry.type === 'Polygon') {
      return calculatePolygonCentroid(geometry.coordinates[0]);
    } else if (geometry.type === 'MultiPolygon') {
      // Ambil poligon pertama dari MultiPolygon
      return calculatePolygonCentroid(geometry.coordinates[0][0]);
    }
    return null;
  };

  // Fungsi untuk menghitung centroid dari array koordinat
  const calculatePolygonCentroid = (coordinates) => {
    let totalLat = 0;
    let totalLng = 0;
    let count = 0;
    
    coordinates.forEach(coord => {
      totalLng += coord[0];
      totalLat += coord[1];
      count++;
    });
    
    return [totalLat / count, totalLng / count];
  };

  // Jika ada error, tampilkan pesan error
  if (error) {
    return (
      <div style={{ 
        height: '100%', 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        flexDirection: 'column'
      }}>
        <h2>Error Loading Map Data</h2>
        <p>{error}</p>
        <p>Please check the console for more details.</p>
      </div>
    );
  }

  return (
    <>
      {loading ? (
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255, 255, 255, 0.8)',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          zIndex: 1000
        }}>
          <p>Loading map data...</p>
        </div>
      ) : geoData ? (
        <GeoJSON 
          data={geoData}
          style={styleFeature}
          onEachFeature={onEachFeature}
        />
      ) : (
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255, 255, 255, 0.8)',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          zIndex: 1000
        }}>
          <p>No data available</p>
        </div>
      )}
      
      <style>{`
        .block-label {
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 4px;
          padding: 2px;
          font-weight: bold;
          text-shadow: 1px 1px 1px white;
          pointer-events: none;
        }
        
        .block-name {
          font-size: 12px;
          color: #000;
        }
      `}</style>
    </>
  );
};

export default GeoJson;