import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Minimap = ({ position, height = 200 }) => {
  const mapRef = useRef(null);
  
  useEffect(() => {
    if (mapRef.current && position) {
      mapRef.current.flyTo([position.lat, position.lng], 13);
    }
  }, [position]);
  
  if (!position) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e0e0e0' }}>
        <span>Lokasi tidak tersedia</span>
      </div>
    );
  }
  
  return (
    <MapContainer
      center={[position.lat, position.lng]}
      zoom={13}
      style={{ height, width: '100%' }}
      ref={mapRef}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[position.lat, position.lng]}>
        <Popup>
          Lokasi: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Minimap;