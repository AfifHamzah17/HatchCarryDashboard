
// src/components/MapView.jsx
import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import kebunData from '../data/kebun.json';
import GeoRasterLayer from 'georaster-layer-for-leaflet';
import georaster from 'georaster';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Plugin yang kita butuhkan (pastikan ter-install)
import 'leaflet.gridlayer.googlemutant'; // google basemap as Leaflet layer
import 'leaflet-omnivore'; // untuk load KML (omnivore akan global/window.omnivore biasanya)


function TmsLayer() {
  const map = useMap();

  useEffect(() => {
    // Ganti URL ini dengan lokasi folder tiles kamu
    const tmsUrl = '/tiles_ortos/{z}/{x}/{y}.png';

const tmsLayer = L.tileLayer(tmsUrl, {
  tms: true,
  minZoom: 0,
  maxZoom: 19,
  opacity: 0.8,
  zIndex: 1000, // tambah zIndex agar muncul di atas basemap
});

    tmsLayer.addTo(map);

    // Optional: sesuaikan ke extent tile
    map.fitBounds([
      [3.12566245801292, 99.29001512056041], // SW
      [3.2460123936050747, 99.19129882409926], // NE
    ]);

    return () => {
      map.removeLayer(tmsLayer);
    };
  }, [map]);

  return null;
}

function TiffLayer() {
  const map = useMap();

  useEffect(() => {
    const url = 'https://storage.googleapis.com/ptpn4-n4r1/orto-map-storage/test.tif';  // URL dari cloud storage

    let layer = null;

    async function loadTiff() {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch GeoTIFF: ${response.status} ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();

        const raster = await georaster(arrayBuffer);

        // Buat layer GeoRaster untuk ditampilkan di peta
        layer = new GeoRasterLayer({
          georaster: raster,
          opacity: 0.7,
          resolution: 256,
        });

        // Tambahkan layer ke peta dan sesuaikan batasnya
        layer.addTo(map);
        map.fitBounds(layer.getBounds());
      } catch (error) {
        console.error('GeoTIFF Load Error:', error);
      }
    }

    loadTiff();

    return () => {
      if (layer && map) {
        map.removeLayer(layer);
      }
    };
  }, [map]);

  return null;
}

 {/* <TmsLayer /> ← Tile hasil gdal2tiles */}