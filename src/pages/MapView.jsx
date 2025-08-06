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

// Fix ikon default
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function FlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 14, { duration: 1.5 });
    }
  }, [position]);
  return null;
}

export default function MapView() {
  const [flyPos, setFlyPos] = useState(null);
  const [showList, setShowList] = useState(false);

  // Grouping by distrik
  const grouped = useMemo(() => {
    return kebunData.reduce((acc, kebun) => {
      const key = kebun.singkatan_distrik;
      if (!acc[key]) {
        acc[key] = {
          label: kebun.distrik,
          items: [],
        };
      }
      acc[key].items.push(kebun);
      return acc;
    }, {});
  }, []);

  const markers = useMemo(() => {
    return kebunData
      .filter((k) => k.coords?.length > 0)
      .flatMap((k) =>
        k.coords.map((c) => ({
          kode: k.kode,
          nama: k.nama_kebun,
          position: [c[0], c[1]],
        }))
      );
  }, []);

  return (
    <div className="flex-1 h-full relative">
      <button
        onClick={() => setShowList(!showList)}
        className="absolute z-[1000] top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg"
      >
        {showList ? '✕ Tutup Daftar' : '📍 Lihat Titik'}
      </button>

      {showList && (
        <div className="absolute z-[999] top-20 right-4 w-80 max-h-[70vh] overflow-y-auto bg-white rounded shadow-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-lg font-semibold mb-2">Daftar Titik Kebun</h3>
          {Object.entries(grouped).map(([key, grp]) => (
            <div key={key} className="mb-2">
              <h4 className="font-medium mb-1">{grp.label} ({key})</h4>
              <ul className="ml-3 space-y-1">
                {grp.items.map((kebun, i) => (
                  <li
                    key={i}
                    className="cursor-pointer hover:text-blue-600"
                    onClick={() => {
                      if (kebun.coords.length > 0) {
                        setFlyPos([kebun.coords[0][0], kebun.coords[0][1]]);
                        setShowList(false);
                      }
                    }}
                  >
                    {kebun.kode} — {kebun.nama_kebun}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <MapContainer center={[-0.5, 100]} zoom={6} className="h-full w-full">
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m, i) => (
          <Marker key={i} position={m.position}>
            <Popup>
              <strong>{m.kode} — {m.nama}</strong>
            </Popup>
          </Marker>
        ))}
        {flyPos && <FlyTo position={flyPos} />}
      </MapContainer>
    </div>
  );
}