import React, { useEffect, useState, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import kebunData from '../data/kebun.json';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Atur ikon marker Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Komponen untuk flyTo map
function FlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 14, { duration: 1.5 });
    }
  }, [position, map]);
  return null;
}

// Komponen untuk resize otomatis map ketika sidebar dibuka/tutup
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

export default function MapView() {
  const [flyInfo, setFlyInfo] = useState(null);
  const [showList, setShowList] = useState(false);
  const [expandedDistrik, setExpandedDistrik] = useState({});
  const [expandedKebun, setExpandedKebun] = useState({});

  // Grouping berdasarkan distrik > kebun > rumah
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

      // Tambahkan rumah hanya jika koordinat valid
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

  // Marker list
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

  return (
    <div className="flex-1 h-full relative">
      {/* Toggle Button */}
      <button
        onClick={() => setShowList(!showList)}
        className="absolute z-[1000] top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg"
      >
        {showList ? '✕ Tutup Daftar' : '📍 Lihat Titik'}
      </button>

      {/* Sidebar List */}
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
                {/* Distrik Header */}
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

                {/* Kebun List */}
                {isDistrikOpen && (
                  <ul className="ml-3 space-y-2">
                    {Object.entries(distrik.kebuns).map(([kode, kebun]) => {
                      const kebunKey = `${distrikKey}-${kode}`;
                      const isKebunOpen = expandedKebun[kebunKey] || false;

                      return (
                        <li key={kode}>
                          {/* Kebun Header */}
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

                          {/* Rumah List */}
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

          {/* Ringkasan Total */}
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

      {/* Map */}
      <MapContainer center={[-0.5, 100]} zoom={6} className="h-full w-full">
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

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
    </div>
  );
}