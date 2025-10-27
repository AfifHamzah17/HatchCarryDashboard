import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext'; 
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Snackbar,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import { CameraAlt as CameraIcon, ArrowBack, MyLocation } from '@mui/icons-material';
import reportService from '../services/reportService';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Import SEMUA data JSON dari file 1D
import dat1DAT from '../data/1DAT.json';
import dat1DJB from '../data/1DJB.json';
import dat1DL1 from '../data/1DL1.json';
import dat1DL2 from '../data/1DL2.json';
import dat1DL3 from '../data/1DL3.json';
import dat1DS1 from '../data/1DS1.json';

// Fix untuk default icon di Leaflet
delete L.Icon.Default.prototype._getIconUrl;

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Komponen untuk menangani event klik pada peta
function MapClickHandler({ updateCoordinates }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      updateCoordinates(lat, lng);
    },
  });
  return null;
}

// Pre-process data untuk memudahkan akses
const processedKebunData = {};

// Kumpulkan semua file data ke dalam satu array
const dataFiles = [dat1DAT, dat1DJB, dat1DL1, dat1DL2, dat1DL3, dat1DS1];

// Proses data HANYA dari file-file 1D
dataFiles.forEach(dataFile => {
  // Pastikan file data ada dan merupakan array
  if (dataFile && Array.isArray(dataFile)) {
    dataFile.forEach(kebun => {
      // Pastikan objek kebun dan properti yang diperlukan ada
      if (kebun && kebun.kebun && kebun.afdelings) {
        // Inisialisasi objek untuk kebun ini jika belum ada
        if (!processedKebunData[kebun.kebun]) {
          processedKebunData[kebun.kebun] = {
            afdelings: [],
            blocks: {}
          };
        }
        
        // Proses setiap afdeling dalam kebun
        kebun.afdelings.forEach(afdeling => {
          if (afdeling && afdeling.afdeling) {
            // Tambahkan afdeling ke daftar jika belum ada
            if (!processedKebunData[kebun.kebun].afdelings.includes(afdeling.afdeling)) {
              processedKebunData[kebun.kebun].afdelings.push(afdeling.afdeling);
            }
            
            // Inisialisasi array untuk blok di afdeling ini jika belum ada
            if (!processedKebunData[kebun.kebun].blocks[afdeling.afdeling]) {
              processedKebunData[kebun.kebun].blocks[afdeling.afdeling] = [];
            }
            
            // Proses setiap blok dalam afdeling
            if (afdeling.blocks && Array.isArray(afdeling.blocks)) {
              afdeling.blocks.forEach(block => {
                if (block && block.blok) {
                  // Tambahkan blok ke daftar jika belum ada
                  if (!processedKebunData[kebun.kebun].blocks[afdeling.afdeling].includes(block.blok)) {
                    processedKebunData[kebun.kebun].blocks[afdeling.afdeling].push(block.blok);
                  }
                }
              });
            }
          }
        });
      }
    });
  } else {
    console.warn('File data tidak valid atau tidak ditemukan:', dataFile);
  }
});

// Daftar kebun (nanti bisa diambil dari API)
const kebunList = [
  { id: '1KSD', name: '1KSD' },
  { id: '1KTO', name: '1KTO' },
  { id: '1KSB', name: '1KSB' },
  { id: '1KSK', name: '1KSK' },
  { id: '1KAT', name: '1KAT' },
  { id: '1KAR', name: '1KAR' },
  { id: '1KSU', name: '1KSU' },
  { id: '1KAN', name: '1KAN' },
  { id: '1KAS', name: '1KAS' },
  { id: '1KRP', name: '1KRP' },
  { id: '1KMM', name: '1KMM' },
  { id: '1KLJ', name: '1KLJ' },
  { id: '1KMS', name: '1KMS' },
  { id: '1KDP', name: '1KDP' },
  { id: '1KPM', name: '1KPM' },
  { id: '1KAM', name: '1KAM' },
  { id: '1KSL', name: '1KSL' },
  { id: '1KHP', name: '1KHP' },
  { id: '1KBS', name: '1KBS' },
  { id: '1KDH', name: '1KDH' },
  { id: '1KBB', name: '1KBB' },
  { id: '1KBN', name: '1KBN' },
  { id: '1KGP', name: '1KGP' },
  { id: '1KGM', name: '1KGM' },
  { id: '1KSA', name: '1KSA' },
  { id: '1KGR', name: '1KGR' },
  { id: '1KSP', name: '1KSP' },
  { id: '1KSG', name: '1KSG' },
  { id: '1KTR', name: '1KTR' },
  { id: '1KRB', name: '1KRB' },
  { id: '1KHG', name: '1KHG' },
  { id: '1KBU', name: '1KBU' },
  { id: '1KMS', name: '1KMS' },
  { id: '1KBT', name: '1KBT' },
  { id: '1KKI', name: '1KKI' },
  { id: '1KLJ', name: '1KLJ' },
  { id: '1KCB', name: '1KCB' },
  { id: '1KBO', name: '1KBO' },
  { id: '1KPA', name: '1KPA' },
  { id: '1KKE', name: '1KKE' },
  { id: '1KTB', name: '1KTB' },
  { id: '1KCI', name: '1KCI' },
  { id: '1KKA', name: '1KKA' }
];

// Kondisi cuaca
const cuacaList = [
  'Cerah',
  'Panas',
  'Berawan',
  'Dingin',
  'Hujan',
  'Mendung',
  'Berangin'
];

const ppList = [];
for (let i = 1; i <= 35; i++) {
  ppList.push(i);
}

export default function ReportForm({ onSuccess, onCancel }) {
  const { user } = useAuth(); 

  const [formData, setFormData] = useState({
    kebun: user?.kebun?.id || '', // Otomatis diisi dengan kebun user
    afdeling: '',
    blok: '',
    koordinatX: '',
    koordinatY: '',
    nomorPP: '',
    estimasiSerangga: '',
    tanggal: new Date().toISOString().split('T')[0],
    waktu: new Date().toTimeString().slice(0, 5),
    kondisiCuaca: '',
    rbt: '',
    tahuntanam: '', // Tambah field tahun tanam
    image: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [mapPosition, setMapPosition] = useState([-6.2088, 106.8456]); // Default Jakarta
  const [userLocation, setUserLocation] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationDetails, setLocationDetails] = useState(null);
  const [loadingLocationDetails, setLoadingLocationDetails] = useState(false);
  const [availableAfdelings, setAvailableAfdelings] = useState([]);
  const [availableBlocks, setAvailableBlocks] = useState([]);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const mapRef = useRef(null);
  const animationRef = useRef(null);

  // Update map position when coordinates change
  useEffect(() => {
    if (formData.koordinatX && formData.koordinatY) {
      const newPosition = [parseFloat(formData.koordinatY), parseFloat(formData.koordinatX)];
      setMapPosition(newPosition);
      
      // Animasi flyTo langsung tanpa timeout
      if (mapRef.current && mapInitialized) {
        flyToLocation(newPosition[0], newPosition[1], 18, 2500);
      }
    }
  }, [formData.koordinatX, formData.koordinatY, mapInitialized]);

  // Update available afdelings when kebun changes
  useEffect(() => {
    if (formData.kebun) {
      if (processedKebunData[formData.kebun]) {
        const afdelings = processedKebunData[formData.kebun].afdelings;
        setAvailableAfdelings(afdelings);
        // Reset afdeling and blok
        setFormData(prev => ({
          ...prev,
          afdeling: '',
          blok: '',
          tahuntanam: '' // Reset tahun tanam juga
        }));
        setAvailableBlocks([]);
      } else {
        // Kebun tidak ada di data detail
        setAvailableAfdelings([]);
        setAvailableBlocks([]);
      }
    } else {
      setAvailableAfdelings([]);
      setAvailableBlocks([]);
    }
  }, [formData.kebun]);

  // Update available blocks when afdeling changes
  useEffect(() => {
    if (formData.kebun && formData.afdeling) {
      if (processedKebunData[formData.kebun]?.blocks[formData.afdeling]) {
        const blocks = processedKebunData[formData.kebun].blocks[formData.afdeling];
        setAvailableBlocks(blocks);
        // Reset blok
        setFormData(prev => ({
          ...prev,
          blok: '',
          tahuntanam: '' // Reset tahun tanam juga
        }));
      } else {
        setAvailableBlocks([]);
      }
    } else {
      setAvailableBlocks([]);
    }
  }, [formData.kebun, formData.afdeling]);

  // Update tahun tanam when blok changes
  useEffect(() => {
    if (formData.kebun && formData.afdeling && formData.blok) {
      let blockData = null;
      
      // Cari HANYA di file-file 1D
      for (const dataFile of dataFiles) {
        const kebun = dataFile.find(k => k.kebun === formData.kebun);
        if (kebun) {
          const afdeling = kebun.afdelings.find(a => a.afdeling === formData.afdeling);
          if (afdeling) {
            blockData = afdeling.blocks.find(b => b.blok === formData.blok);
            if (blockData) break; // Berhenti mencari jika sudah ditemukan
          }
        }
      }
      
      if (blockData) {
        setFormData(prev => ({
          ...prev,
          tahuntanam: blockData.tahuntanam || ''
        }));
      }
    }
  }, [formData.kebun, formData.afdeling, formData.blok]);

  // Fungsi untuk animasi "fly to" dengan easing function (dari FlyToMap)
  const flyToLocation = (targetLat, targetLng, targetZoom = 15, duration = 2000) => {
    if (!mapRef.current) return;
    
    if (isAnimating) {
      // Hentikan animasi yang sedang berjalan
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    setIsAnimating(true);
    
    const startCenter = mapRef.current.getCenter();
    const startLat = startCenter.lat;
    const startLng = startCenter.lng;
    const startZoom = mapRef.current.getZoom();
    
    const startTime = performance.now();
    
    // Easing function untuk animasi yang lebih natural (ease-in-out)
    const easeInOutCubic = (t) => {
      return t < 0.5 
        ? 4 * t * t * t 
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };
    
    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const rawProgress = Math.min(elapsedTime / duration, 1);
      const progress = easeInOutCubic(rawProgress);
      
      // Interpolasi lat, lng, dan zoom
      const currentLat = startLat + (targetLat - startLat) * progress;
      const currentLng = startLng + (targetLng - startLng) * progress;
      const currentZoom = startZoom + (targetZoom - startZoom) * progress;
      
      // Update peta tanpa animasi bawaan Leaflet
      mapRef.current.setView([currentLat, currentLng], currentZoom, { animate: false });
      
      if (rawProgress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Pastikan posisi akhir tepat di target
        mapRef.current.setView([targetLat, targetLng], targetZoom);
        setIsAnimating(false);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };

  // Cleanup animation saat component unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Function to update coordinates from map click
  const updateCoordinatesFromMap = (lat, lng) => {
    setFormData(prev => ({
      ...prev,
      koordinatX: lng.toFixed(6),
      koordinatY: lat.toFixed(6)
    }));
    
    // Animasi flyTo langsung setelah klik peta
    if (mapRef.current && mapInitialized) {
      flyToLocation(lat, lng, 18, 2500);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openCamera = () => {
    // Membuka kamera secara langsung
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'camera'; // Ini akan membuka kamera secara langsung di perangkat mobile
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setFormData(prev => ({
          ...prev,
          image: file
        }));

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };

  const fetchLocationDetails = async (lat, lng) => {
    setLoadingLocationDetails(true);
    try {
      // Fetch address details using Nominatim (OpenStreetMap)
      const addressResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const addressData = await addressResponse.json();
      
      // Fetch elevation data using Open Elevation API
      const elevationResponse = await fetch(
        `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`
      );
      const elevationData = await elevationResponse.json();
      
      // Extract relevant information
      const address = addressData.address || {};
      const elevation = elevationData.results?.[0]?.elevation || 0;
      
      return {
        kota: address.city || address.town || address.village || 'Tidak diketahui',
        kecamatan: address.suburb || address.county || 'Tidak diketahui',
        kabupaten: address.state_district || 'Tidak diketahui',
        provinsi: address.state || 'Tidak diketahui',
        elevation: elevation
      };
    } catch (error) {
      console.error('Error fetching location details:', error);
      return {
        kota: 'Tidak diketahui',
        kecamatan: 'Tidak diketahui',
        kabupaten: 'Tidak diketahui',
        provinsi: 'Tidak diketahui',
        elevation: 0
      };
    } finally {
      setLoadingLocationDetails(false);
    }
  };

  const getCurrentLocation = () => {
    setGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          
          // Update form with current coordinates
          setFormData(prev => ({
            ...prev,
            koordinatX: longitude.toFixed(6),
            koordinatY: latitude.toFixed(6)
          }));
          
          // Animasi flyTo langsung tanpa timeout
          if (mapRef.current) {
            flyToLocation(latitude, longitude, 18, 2500);
          }
          
          // Fetch location details
          const details = await fetchLocationDetails(latitude, longitude);
          setLocationDetails(details);
          
          setGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setSnackbarMessage('Tidak dapat mendapatkan lokasi Anda. Pastikan GPS telah diaktifkan.');
          setSnackbarOpen(true);
          setGettingLocation(false);
        }
      );
    } else {
      setSnackbarMessage('Browser Anda tidak mendukung geolocation.');
      setSnackbarOpen(true);
      setGettingLocation(false);
    }
  };

// Di handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    // Pastikan semua field required terisi
    if (!formData.tahuntanam) {
      setError('Tahun tanam harus diisi');
      setLoading(false);
      return;
    }

    const reportData = {
      kebun: formData.kebun,
      afdeling: formData.afdeling,
      blok: formData.blok,
      tahuntanam: formData.tahuntanam, 
      koordinatX: parseFloat(formData.koordinatX),
      koordinatY: parseFloat(formData.koordinatY),
      nomorPP: parseInt(formData.nomorPP),
      estimasiSerangga: parseInt(formData.estimasiSerangga),
      tanggal: formData.tanggal,
      waktu: `${formData.tanggal}T${formData.waktu}:00`, 
      kondisiCuaca: formData.kondisiCuaca,
      rbt: parseFloat(formData.rbt)
    };

    let response;
    
    if (formData.image instanceof File) {
      response = await reportService.createReportWithFile(reportData, formData.image);
    } else if (previewImage) {
      reportData.image = previewImage;
      response = await reportService.createReport(reportData);
    } else {
      response = await reportService.createReport(reportData);
    }
    
    if (onSuccess) {
      onSuccess(response);
    }
  } catch (err) {
    console.error('Error submitting report:', err);
    setError(err.response?.data?.message || err.message || 'Gagal mengirim laporan');
    setSnackbarMessage(err.response?.data?.message || err.message || 'Gagal mengirim laporan');
    setSnackbarOpen(true);
  } finally {
    setLoading(false);
  }
};

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Custom style untuk menghilangkan tombol increment pada input number
  const numberInputStyle = {
    '& input[type=number]': {
      MozAppearance: 'textfield',
    },
    '& input[type=number]::-webkit-outer-spin-button': {
      WebkitAppearance: 'none',
      margin: 0,
    },
    '& input[type=number]::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
      margin: 0,
    },
  };

  // Check if we have data for selected kebun
  const hasKebunData = processedKebunData.hasOwnProperty(formData.kebun);
  // Check if we have data for selected afdeling
  const hasAfdelingData = hasKebunData && 
                         processedKebunData[formData.kebun].blocks.hasOwnProperty(formData.afdeling);

  // Function to handle when map is initialized
  const handleMapReady = (map) => {
    mapRef.current = map;
    setMapInitialized(true);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom textAlign="center" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
        Buat Laporan Baru
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        {/* Kebun (Dropdown) - Disabled karena sudah otomatis terisi */}
        <Box mb={2}>
          <FormControl fullWidth disabled>
            <InputLabel id="kebun-label">Kebun</InputLabel>
            <Select
              labelId="kebun-label"
              name="kebun"
              value={formData.kebun}
              onChange={handleChange}
              required
            >
              {kebunList.map((kebun) => (
                <MenuItem key={kebun.id} value={kebun.id}>
                  {kebun.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Afdeling */}
        <Box mb={2}>
          {hasKebunData ? (
            <FormControl fullWidth required>
              <InputLabel id="afdeling-label">Afdeling</InputLabel>
              <Select
                labelId="afdeling-label"
                name="afdeling"
                value={formData.afdeling}
                onChange={handleChange}
                required
              >
                {availableAfdelings.map((afdeling) => (
                  <MenuItem key={afdeling} value={afdeling}>
                    {afdeling}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <TextField
              name="afdeling"
              label="Afdeling"
              value={formData.afdeling}
              onChange={handleChange}
              fullWidth
              required
            />
          )}
        </Box>

        {/* Blok */}
        <Box mb={2}>
          {hasAfdelingData ? (
            <FormControl fullWidth required>
              <InputLabel id="blok-label">Blok</InputLabel>
              <Select
                labelId="blok-label"
                name="blok"
                value={formData.blok}
                onChange={handleChange}
                required
              >
                {availableBlocks.map((blok) => (
                  <MenuItem key={blok} value={blok}>
                    {blok}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <TextField
              name="blok"
              label="Blok"
              value={formData.blok}
              onChange={handleChange}
              fullWidth
              required
            />
          )}
        </Box>

        {/* Tahun Tanam - ReadOnly karena otomatis terisi */}
        <Box mb={2}>
          <TextField
            name="tahuntanam"
            label="Tahun Tanam"
            value={formData.tahuntanam}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </Box>

        {/* RBT */}
        <Box mb={2}>
          <TextField
            name="rbt"
            label="RBT Saat Ini (Kg/Tross)"
            type="number"
            step={0.01}
            value={formData.rbt}
            onChange={handleChange}
            fullWidth
            required
            sx={numberInputStyle}
          />
        </Box>

        {/* Nomor PP */}
        <Box mb={2}>
          <TextField
            name="nomorPP"
            label="Nomor PP"
            select
            value={formData.nomorPP}
            onChange={handleChange}
            fullWidth
            required
            sx={numberInputStyle}
          >
            {ppList.map((pp) => (
              <MenuItem key={pp} value={pp}>
                {pp}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Estimasi Jlh Serangga */}
        <Box mb={2}>
          <TextField
            name="estimasiSerangga"
            label="Estimasi Jumlah Serangga"
            type="number"
            value={formData.estimasiSerangga}
            onChange={handleChange}
            fullWidth
            required
            sx={numberInputStyle}
          />
        </Box>

        {/* Tanggal */}
        <Box mb={2}>
          <TextField
            name="tanggal"
            label="Tanggal"
            type="date"
            value={formData.tanggal}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        {/* Waktu */}
        <Box mb={2}>
          <TextField
            name="waktu"
            label="Waktu"
            type="time"
            value={formData.waktu}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        {/* Kondisi Cuaca */}
        <Box mb={2}>
          <FormControl fullWidth required>
            <InputLabel id="cuaca-label">Kondisi Cuaca</InputLabel>
            <Select
              labelId="cuaca-label"
              name="kondisiCuaca"
              value={formData.kondisiCuaca}
              onChange={handleChange}
              required
            >
              {cuacaList.map((cuaca) => (
                <MenuItem key={cuaca} value={cuaca}>
                  {cuaca}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Minimap dengan Tombol Lokasi */}
        <Box mb={3}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1">Lokasi</Typography>
                <IconButton 
                  onClick={getCurrentLocation} 
                  disabled={gettingLocation}
                  color="primary"
                  aria-label="Gunakan lokasi saya"
                >
                  {gettingLocation ? <CircularProgress size={20} /> : <MyLocation />}
                </IconButton>
              </Box>
              <Box sx={{ height: 200, width: '100%' }}>
                <MapContainer 
                  center={mapPosition} 
                  zoom={13} 
                  style={{ height: '100%', width: '100%' }}
                  whenCreated={handleMapReady}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {/* Handler untuk klik pada peta */}
                  <MapClickHandler updateCoordinates={updateCoordinatesFromMap} />
                  
                  {/* Marker untuk lokasi laporan - hanya ada satu marker */}
                  {formData.koordinatX && formData.koordinatY && (
                    <Marker 
                      position={[parseFloat(formData.koordinatY), parseFloat(formData.koordinatX)]}
                      eventHandlers={{
                        click: async () => {
                          // Fly to marker position langsung tanpa delay
                          flyToLocation(
                            parseFloat(formData.koordinatY), 
                            parseFloat(formData.koordinatX), 
                            18, 
                            2500
                          );
                          
                          // Fetch location details
                          const details = await fetchLocationDetails(
                            parseFloat(formData.koordinatY),
                            parseFloat(formData.koordinatX)
                          );
                          setLocationDetails(details);
                        }
                      }}
                    >
                      <Popup>
                        <div>
                          <strong>Lokasi Laporan</strong><br />
                          Koordinat: {formData.koordinatY}, {formData.koordinatX}<br />
                          {loadingLocationDetails ? (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <CircularProgress size={16} style={{ marginRight: 8 }} />
                              <span>Memuat detail lokasi...</span>
                            </div>
                          ) : locationDetails ? (
                            <>
                              Kota: {locationDetails.kota}<br />
                              Kecamatan: {locationDetails.kecamatan}<br />
                              Kabupaten: {locationDetails.kabupaten}<br />
                              Provinsi: {locationDetails.provinsi}<br />
                              Ketinggian: {locationDetails.elevation} meter
                            </>
                          ) : (
                            <span>Klik untuk melihat detail lokasi</span>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>

        
        {/* Koordinat X */}
        <Box mb={2}>
          <TextField
            name="koordinatX"
            label="Koordinat X"
            type="number"
            step={0.001}
            value={formData.koordinatX}
            onChange={handleChange}
            fullWidth
            required
            sx={numberInputStyle}
          />
        </Box>

        {/* Koordinat Y */}
        <Box mb={2}>
          <TextField
            name="koordinatY"
            label="Koordinat Y"
            type="number"
            step={0.001}
            value={formData.koordinatY}
            onChange={handleChange}
            fullWidth
            required
            sx={numberInputStyle}
          />
        </Box>

        {/* Camera Button */}
        <Box mb={3}>
          <Card variant="outlined" sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Button
                variant="outlined"
                onClick={openCamera}
                startIcon={<CameraIcon />}
                sx={{ mb: 2 }}
              >
                Ambil Gambar
              </Button>

              {previewImage && (
                <Box mt={1} sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '200px', 
                      objectFit: 'contain',
                      borderRadius: 1,
                      border: '1px solid #e0e0e0'
                    }}
                  />
                </Box>
              )}
            </Box>
          </Card>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          {onCancel && (
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={loading}
              startIcon={<ArrowBack />}
              sx={{ px: 3 }}
            >
              Batal
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{ px: 3 }}
          >
            {loading ? 'Mengirim...' : 'Kirim'}
          </Button>
        </Box>
      </Box>

      {/* Animation indicator */}
      {isAnimating && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          zIndex: 1000
        }}>
          Flying...
        </div>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Paper>
  );
}