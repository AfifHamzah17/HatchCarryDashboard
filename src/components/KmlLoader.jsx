
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

// KML Loader memakai omnivore (tetap)
function KmlLoader() {
  const map = useMap();

  useEffect(() => {
    if (!window.omnivore) {
      console.error('Leaflet omnivore is not loaded (window.omnivore). Pastikan paket leaflet-omnivore terimport.');
      return;
    }

    const layerGroup = L.layerGroup().addTo(map);
    const colors = ['red', 'green', 'blue', 'orange', 'purple', 'cyan'];

    const kmlFiles = [
      // daftar KML (sama seperti sebelumnya)
      { file: 'DASAH/KAMBT.kml', label: '1KAM' },
      { file: 'DASAH/KBDSL.kml', label: '1KSL' },
      { file: 'DASAH/KHTPD.kml', label: '1KHP' },
      { file: 'DASAH/KPMDI.kml', label: '1KPM' },
      { file: 'DASAH/KSDDP.kml', label: '1KDP' },
      { file: 'DASAH/KSSIL.kml', label: '1KSL' },
      { file: 'DLAB 1/KBUTU.kml', label: 'KBUTU' },
      { file: 'DLAB 1/KSDAN.kml', label: '1KSD' },
      { file: 'DLAB 1/KSMTI.kml', label: 'KSMTI' },
      { file: 'DLAB 1/KTORA.kml', label: 'KTO' },
      { file: 'DLAB 2/KATOR.kml', label: 'KATOR' },
      { file: 'DLAB 2/KPARO.kml', label: 'KPARO' },
      { file: 'DLAB 2/KSBAR.kml', label: 'KSBAR' },
      { file: 'DLAB 2/KSKAR.kml', label: 'KSKAR' },
      { file: 'DLAB 3/KANAS.kml', label: 'KANAS' },
      { file: 'DLAB 3/KANAU.kml', label: 'KANAU' },
      { file: 'DLAB 3/KLAJI.kml', label: 'KLAJI' },
      { file: 'DLAB 3/KMMDA.kml', label: 'KMMDA' },
      { file: 'DLAB 3/KMSTN.kml', label: 'KMSTN' },
      { file: 'DLAB 3/KRPPT.kml', label: 'KRPPT' },
      { file: 'DLAB 3/KSSUT.kml', label: 'KSSUT' },
      { file: 'DSER 1/KBANG.kml', label: 'KBANG' },
      { file: 'DSER 1/KBDBY.kml', label: 'KBDBY' },
      { file: 'DSER 1/KDSHU.kml', label: 'KDSHU' },
      { file: 'DSER 1/KGMNO.kml', label: 'KGMNO' },
      { file: 'DSER 1/KGPAR.kml', label: 'KGPAR' },
      { file: 'DSER 1/KGPMA.kml', label: 'KGPMA' },
      { file: 'DSER 1/KSDUN.kml', label: 'KSDUN' },
      { file: 'DSER 2/KGBTU.kml', label: 'KGBTU' },
      { file: 'DSER 2/KHPSG.kml', label: 'KHPSG' },
      { file: 'DSER 2/KRBTN.kml', label: 'KRBTN' },
      { file: 'DSER 2/KSGGI.kml', label: 'KSGGI' },
      { file: 'DSER 2/KSPTH.kml', label: 'KSPTH' },
      { file: 'DSER 2/KTARA.kml', label: 'KTARA' },
    ];

    kmlFiles.forEach(({ file, label }, idx) => {
      const color = colors[idx % colors.length];
      const fullPath = `/${file}`;

      const kmlLayer = window.omnivore.kml(fullPath);

      kmlLayer.on('ready', function () {
        const group = this;

        group.eachLayer((layer) => {
          if (layer.setStyle) {
            layer.setStyle({
              color,
              weight: 2,
              fillColor: color,
              fillOpacity: 0.3,
            });
          }
        });

        const bounds = group.getBounds();
        if (bounds.isValid()) {
          const center = bounds.getCenter();
          const labelIcon = L.divIcon({
            className: 'afd-label',
            html: `<strong>${label}</strong>`,
            iconSize: [100, 20],
            iconAnchor: [50, 10],
          });
          const labelMarker = L.marker(center, { icon: labelIcon, interactive: false });
          layerGroup.addLayer(labelMarker);
        }

        group.eachLayer((layer) => layerGroup.addLayer(layer));
      });

      kmlLayer.on('error', (err) => {
        console.error('Gagal load KML:', fullPath, err);
      });
    });

    return () => {
      layerGroup.clearLayers();
      if (map.hasLayer(layerGroup)) map.removeLayer(layerGroup);
    };
  }, [map]);

  return null;
}

  <KmlLoader />