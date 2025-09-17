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
// Import komponen GeoJson yang sudah dibuat
import GeoJson from '../components/geojson';
// Plugin yang kita butuhkan (pastikan ter-install)
import 'leaflet.gridlayer.googlemutant'; // google basemap as Leaflet layer
import 'leaflet-omnivore'; // untuk load KML (omnivore akan global/window.omnivore biasanya)
// Atur ikon marker Leaflet (tetap sama)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
// Ambil API key dari Vite env
const GOOGLE_API_KEY = import.meta.env.VITE_MAP_API || '';
// Load Google Maps JS API secara dinamis
function loadGoogleMapsScript(apiKey) {
  return new Promise((resolve, reject) => {
    if (!apiKey) {
      reject(new Error('Google Maps API key tidak ditemukan. Set environment variable VITE_MAP_API.'));
      return;
    }
    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      resolve(window.google);
      return;
    }
    const existing = document.querySelector(`script[data-google-maps-api="true"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google));
      existing.addEventListener('error', (e) => reject(e));
      return;
    }
    const script = document.createElement('script');
    script.setAttribute('data-google-maps-api', 'true');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && window.google.maps) resolve(window.google);
      else reject(new Error('Google Maps loaded but window.google not available'));
    };
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
}
// GoogleMutantLayer: menambahkan Google basemap ke Leaflet via gridlayer.googleMutant
function GoogleMutantLayer({ mapType = 'roadmap' }) {
  const map = useMap();
  const layerRef = useRef(null);
  useEffect(() => {
    let mounted = true;
    async function setup() {
      try {
        await loadGoogleMapsScript(GOOGLE_API_KEY);
        if (!L.gridLayer || !L.gridLayer.googleMutant) {
          console.error('googleMutant factory tidak ditemukan pada L.gridLayer. Pastikan paket leaflet.gridlayer.googlemutant terinstall.');
          return;
        }
        const gmLayer = L.gridLayer.googleMutant({
          type: mapType, // 'roadmap' | 'satellite' | 'hybrid' | 'terrain'
          maxZoom: 21,
        });
        if (mounted) {
          gmLayer.addTo(map);
          layerRef.current = gmLayer;
        } else {
          if (gmLayer && gmLayer.remove) gmLayer.remove();
        }
      } catch (err) {
        console.error('Gagal memuat Google Maps atau googleMutant:', err);
      }
    }
    setup();
    return () => {
      mounted = false;
      if (layerRef.current && map) {
        try {
          map.removeLayer(layerRef.current);
        } catch (e) {
          /* ignore */
        }
      }
      layerRef.current = null;
    };
  }, [map, mapType]);
  return null;
}
// FlyTo (tetap)
function FlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position && map) {
      map.flyTo(position, 14, { duration: 1.5 });
    }
  }, [position, map]);
  return null;
}
// Resizer (tetap)
function Resizer({ shouldResize }) {
  const map = useMap();
  useEffect(() => {
    if (shouldResize) {
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    }
  }, [shouldResize, map]);
  return null;
}
// === Komponen Utama MapView ===
export default function MapView() {
  const [flyInfo, setFlyInfo] = useState(null);
  const [showList, setShowList] = useState(false);
  const [expandedDistrik, setExpandedDistrik] = useState({});
  const [expandedKebun, setExpandedKebun] = useState({});
  // Tambah state untuk active basemap
  const [activeBasemap, setActiveBasemap] = useState('google_roadmap');
  // opsi basemap yang tersedia:
  // 'google_roadmap', 'google_satellite', 'opentopomap', 'osm', 'carto_positron'
  // Referensi untuk peta
  const mapRef = useRef(null);
  
  // Grouping (tetap sama)
  const grouped = useMemo(() => {
    const result = {};
    for (const item of kebunData) {
      const {
        singkatan_distrik,
        distrik,
        kode,
        nama_kebun,
        luas_ha,
        inventaris,
        rumah,
        coords,
      } = item;
      if (!result[singkatan_distrik]) {
        result[singkatan_distrik] = {
          label: distrik,
          kebuns: {},
        };
      }
      if (!result[singkatan_distrik].kebuns[kode]) {
        result[singkatan_distrik].kebuns[kode] = {
          label: nama_kebun,
          luas_ha,
          inventaris,
          rumahs: [],
        };
      }
      if (
        Array.isArray(coords) &&
        coords.length === 2 &&
        typeof coords[0] === 'number' &&
        typeof coords[1] === 'number'
      ) {
        result[singkatan_distrik].kebuns[kode].rumahs.push({
          id: rumah,
          coords,
        });
      }
    }
    return result;
  }, []);
  
  // Marker list (tetap sama)
  const markers = useMemo(() => {
    return kebunData
      .filter(
        (k) =>
          Array.isArray(k.coords) &&
          k.coords.length === 2 &&
          typeof k.coords[0] === 'number' &&
          typeof k.coords[1] === 'number'
      )
      .map((k) => ({
        kode: k.kode,
        nama: k.nama_kebun,
        rumah: k.rumah,
        position: k.coords,
        luas_ha: k.luas_ha,
        inventaris: k.inventaris,
      }));
  }, []);
  
  // helper render untuk TileLayer non-Google
  const renderNonGoogleLayer = () => {
    switch (activeBasemap) {
      case 'osm':
        return (
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        );
      case 'opentopomap':
        return (
          <TileLayer
            attribution='&copy; OpenTopoMap contributors'
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          />
        );
      case 'carto_positron':
        return (
          <TileLayer
            attribution='&copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="flex-1 h-full relative">
      {/* Basemap switcher (tombol) */}
      <div className="absolute z-[1100] top-4 left-4 bg-white rounded shadow-md p-2 flex gap-2">
        <button
          onClick={() => setActiveBasemap('google_roadmap')}
          className={`px-2 py-1 text-sm rounded ${activeBasemap === 'google_roadmap' ? 'bg-green-600 text-white' : 'bg-white text-black'}`}
          aria-pressed={activeBasemap === 'google_roadmap'}
          title="Google Roadmap"
        >
          Google
        </button>
        <button
          onClick={() => setActiveBasemap('google_satellite')}
          className={`px-2 py-1 text-sm rounded ${activeBasemap === 'google_satellite' ? 'bg-green-600 text-white' : 'bg-white text-black'}`}
          aria-pressed={activeBasemap === 'google_satellite'}
          title="Google Satellite"
        >
          Satellite
        </button>
        <button
          onClick={() => setActiveBasemap('opentopomap')}
          className={`px-2 py-1 text-sm rounded ${activeBasemap === 'opentopomap' ? 'bg-green-600 text-white' : 'bg-white text-black'}`}
          aria-pressed={activeBasemap === 'opentopomap'}
          title="OpenTopoMap (TOPO)"
        >
          TOPO
        </button>
        <button
          onClick={() => setActiveBasemap('osm')}
          className={`px-2 py-1 text-sm rounded ${activeBasemap === 'osm' ? 'bg-green-600 text-white' : 'bg-white text-black'}`}
          aria-pressed={activeBasemap === 'osm'}
          title="OpenStreetMap"
        >
          OSM
        </button>
        <button
          onClick={() => setActiveBasemap('carto_positron')}
          className={`px-2 py-1 text-sm rounded ${activeBasemap === 'carto_positron' ? 'bg-green-600 text-white' : 'bg-white text-black'}`}
          aria-pressed={activeBasemap === 'carto_positron'}
          title="Leaflet (CartoDB Positron)"
        >
          Leaflet
        </button>
      </div>
      
      {/* Toggle Button (sidebar) */}
      <button
        onClick={() => setShowList(!showList)}
        className="absolute z-[1000] top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg"
      >
        {showList ? '✕ Tutup Daftar' : '📍 Lihat Titik'}
      </button>
      
      {/* Sidebar List (tetap sama) */}
      {showList && (
        <div className="absolute z-[999] top-20 right-0 sm:right-4 w-full sm:w-80 max-h-[70vh] overflow-y-auto bg-white rounded-l-lg sm:rounded shadow-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-lg font-semibold mb-2">Daftar Titik Rumah</h3>
          {Object.entries(grouped).map(([distrikKey, distrik]) => {
            const totalKebun = Object.keys(distrik.kebuns).length;
            const totalRumah = Object.values(distrik.kebuns).reduce(
              (sum, k) => sum + k.rumahs.length,
              0
            );
            const isDistrikOpen = expandedDistrik[distrikKey] || false;
            return (
              <div key={distrikKey} className="mb-4">
                <div
                  className="flex justify-between items-center font-semibold mb-1 cursor-pointer"
                  onClick={() =>
                    setExpandedDistrik((prev) => ({
                      ...prev,
                      [distrikKey]: !prev[distrikKey],
                    }))
                  }
                >
                  <span>
                    {distrik.label} ({totalKebun} kebun, {totalRumah} rumah)
                  </span>
                  <span className="text-xl">{isDistrikOpen ? '−' : '+'}</span>
                </div>
                {isDistrikOpen && (
                  <ul className="ml-3 space-y-2">
                    {Object.entries(distrik.kebuns).map(([kode, kebun]) => {
                      const kebunKey = `${distrikKey}-${kode}`;
                      const isKebunOpen = expandedKebun[kebunKey] || false;
                      return (
                        <li key={kode}>
                          <div
                            className="flex justify-between items-center font-medium cursor-pointer"
                            onClick={() =>
                              setExpandedKebun((prev) => ({
                                ...prev,
                                [kebunKey]: !prev[kebunKey],
                              }))
                            }
                          >
                            <span>
                              {kebun.label} — {kode} ({kebun.rumahs.length} rumah)
                            </span>
                            <span className="text-base">
                              {isKebunOpen ? '−' : '+'}
                            </span>
                          </div>
                          {isKebunOpen && (
                            <ul className="ml-5 space-y-1 mt-1">
                              {kebun.rumahs.map((r) => (
                                <li
                                  key={r.id}
                                  className="cursor-pointer hover:text-blue-600"
                                  onClick={() => {
                                    setFlyInfo({
                                      position: r.coords,
                                      kode,
                                      nama: kebun.label,
                                      rumah: r.id,
                                      luas_ha: kebun.luas_ha,
                                      inventaris: kebun.inventaris,
                                    });
                                    setShowList(false);
                                  }}
                                >
                                  Rumah {r.id}
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
          <hr className="my-4" />
          <div className="text-sm">
            <p>
              <strong>Total Distrik:</strong> {Object.keys(grouped).length}
            </p>
            <p>
              <strong>Total Kebun:</strong>{' '}
              {Object.values(grouped).reduce(
                (sum, d) => sum + Object.keys(d.kebuns).length,
                0
              )}
            </p>
            <p>
              <strong>Total Rumah:</strong>{' '}
              {Object.values(grouped).reduce(
                (sum, d) =>
                  sum +
                  Object.values(d.kebuns).reduce(
                    (kSum, k) => kSum + k.rumahs.length,
                    0
                  ),
                0
              )}
            </p>
          </div>
        </div>
      )}
      
      <MapContainer 
        center={[4.76, 97.76]} 
        zoom={14} 
        className="h-full w-full"
        whenCreated={mapInstance => mapRef.current = mapInstance}
      >
        {(activeBasemap === 'google_roadmap' || activeBasemap === 'google_satellite') && (
          <GoogleMutantLayer mapType={activeBasemap === 'google_roadmap' ? 'roadmap' : 'satellite'} />
        )}
        {activeBasemap !== 'google_roadmap' && activeBasemap !== 'google_satellite' && renderNonGoogleLayer()}
        
        {/* Tambahkan komponen GeoJson di sini */}
        <GeoJson mapRef={mapRef} />
        
        {/* <TiffLayer /> */}
        {/* <TmsLayer /> ← Tile hasil gdal2tiles */}
        {markers.map((m, idx) => (
          <Marker key={idx} position={m.position}>
            <Popup>
              <strong>
                {m.kode} — Rumah {m.rumah}
              </strong>
              <br />
              {m.nama}
              <br />
              Koordinat: {m.position[0].toFixed(6)} N,{' '}
              {m.position[1].toFixed(6)} E
              <br />
              Luas : {m.luas_ha} ha
              <br />
              Inventaris: {m.inventaris} pohon
              <br />
              <a
                href={`https://www.google.com/maps?q=${m.position[0]},${m.position[1]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mt-1 inline-block"
              >
                View on Google Maps
              </a>
            </Popup>
          </Marker>
        ))}
        
        {flyInfo && <FlyTo position={flyInfo.position} />}
        <Resizer shouldResize={showList} />
      </MapContainer>
      
      <style>{`
        .afd-label {
          background: rgba(255,255,255,0.8);
          border: 1px solid #666;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: bold;
          font-size: 12px;
          pointer-events: none;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}