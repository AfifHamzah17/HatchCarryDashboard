import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import kebunData from '../data/kebun.json';
import L from 'leaflet';

// (Optional) perbaiki icon default Leaflet di Vite
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
      map.flyTo(position, 12, { duration: 1.5 });
    }
  }, [position]);
  return null;
}

export default function MapView({ selectedKebun }) {
  // kumpulkan semua marker dari kebunData
  const markers = kebunData
    .filter((k) => k.coords?.length > 0)
    .flatMap((k) =>
      k.coords.map((c) => ({
        kode: k.kode,
        nama: k.nama_kebun,
        position: [c[0], c[1]],
      }))
    );

  // Posisi kebun terpilih untuk flyTo
  const flyPos =
    selectedKebun && selectedKebun.coords.length
      ? [selectedKebun.coords[0][0], selectedKebun.coords[0][1]]
      : null;

  return (
    <div className="flex-1 h-full">
      <MapContainer
        center={[-0.5, 100]}
        zoom={6}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m, i) => (
          <Marker key={i} position={m.position}>
            <Popup>
              <strong>
                {m.kode} — {m.nama}
              </strong>
            </Popup>
          </Marker>
        ))}
        {flyPos && <FlyTo position={flyPos} />}
      </MapContainer>
    </div>
  );
}   