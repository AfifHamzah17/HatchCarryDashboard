import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Box, 
  Button,
  Grid,
  Paper,
  Chip,
  CircularProgress,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import reportService from '../services/reportService';
import { 
  ArrowBack,
  Layers,
  ZoomIn,
  ZoomOut,
  LocationOn,
  CalendarToday,
  Person
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function PostDetailPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { UID } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapLayer, setMapLayer] = useState('street');
  const [mapZoom, setMapZoom] = useState(15);
  
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const report = await reportService.getReportById(UID);
        setPost(report);
        // Debugging: Log data yang diterima
        // console.log('Data post:', report);
        // console.log('Tanggal:', report.tanggal, 'Tipe:', typeof report.tanggal);
        // console.log('Waktu:', report.waktu, 'Tipe:', typeof report.waktu);
      } catch (err) {
        // console.error('Error fetching report:', err);
        setError('Gagal memuat data. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };
    
    if (UID) {
      fetchPost();
    }
  }, [UID]);
  
  if (loading) {
    return (
      <Box sx={{ padding: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error || !post) {
    return (
      <Box sx={{ padding: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          {error || 'Post tidak ditemukan'}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/app/timeline')}
          sx={{ mt: 2 }}
        >
          Kembali ke Timeline
        </Button>
      </Box>
    );
  }
  
  // Prepare position for minimap
  const position = post.koordinatX && post.koordinatY 
    ? { lat: parseFloat(post.koordinatY), lng: parseFloat(post.koordinatX) } 
    : null;
  
  // Format tanggal dengan pengecekan validitas - PERBAIKAN
  const formatDate = (dateObj) => {
    // console.log('Processing date:', dateObj, 'Type:', typeof dateObj);
    
    if (!dateObj) {
      // console.log('Date object is empty');
      return 'Data tidak tersedia';
    }
    
    // Handle Firestore Timestamp format
    if (dateObj._seconds !== undefined) {
      // console.log('Date is Firestore Timestamp');
      // Konversi Firestore Timestamp ke JavaScript Date
      const date = new Date(dateObj._seconds * 1000);
      
      if (isNaN(date.getTime())) {
        // console.log('Invalid date after conversion');
        return 'Format tanggal tidak valid';
      }
      
      const formatted = date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      // console.log('Formatted date:', formatted);
      return formatted;
    }
    
    // Jika formatnya YYYY-MM-DD (dari form)
    if (typeof dateObj === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateObj)) {
      // console.log('Date format is YYYY-MM-DD string');
      const [year, month, day] = dateObj.split('-');
      const date = new Date(year, month - 1, day);
      
      if (isNaN(date.getTime())) {
        // console.log('Invalid date after parsing');
        return 'Format tanggal tidak valid';
      }
      
      const formatted = date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      // console.log('Formatted date:', formatted);
      return formatted;
    }
    
    // Format lainnya
    const date = new Date(dateObj);
    if (isNaN(date.getTime())) {
      // console.log('Invalid date for other format');
      return 'Format tanggal tidak valid';
    }
    
    const formatted = date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    // console.log('Formatted date (other format):', formatted);
    return formatted;
  };
  
  // Format waktu dengan pengecekan validitas - PERBAIKAN
  const formatTime = (timeObj) => {
    // console.log('Processing time:', timeObj, 'Type:', typeof timeObj);
    
    if (!timeObj) {
      // console.log('Time object is empty');
      return 'Data tidak tersedia';
    }
    
    // Handle Firestore Timestamp format
    if (timeObj._seconds !== undefined) {
      // console.log('Time is Firestore Timestamp');
      // Konversi Firestore Timestamp ke JavaScript Date
      const time = new Date(timeObj._seconds * 1000);
      
      if (isNaN(time.getTime())) {
        // console.log('Invalid time after conversion');
        return 'Format waktu tidak valid';
      }
      
      const formatted = time.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      });
      // console.log('Formatted time:', formatted);
      return formatted;
    }
    
    // Jika formatnya HH:MM (dari form)
    if (typeof timeObj === 'string' && /^\d{2}:\d{2}$/.test(timeObj)) {
      // console.log('Time format is HH:MM string');
      const [hours, minutes] = timeObj.split(':');
      const formatted = `${hours}:${minutes}`;
      // console.log('Formatted time:', formatted);
      return formatted;
    }
    
    // Format lainnya
    const time = new Date(timeObj);
    if (isNaN(time.getTime())) {
      // console.log('Invalid time for other format');
      return 'Format waktu tidak valid';
    }
    
    const formatted = time.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
    // console.log('Formatted time (other format):', formatted);
    return formatted;
  };
  
  // Handle map layer change
  const toggleMapLayer = () => {
    setMapLayer(mapLayer === 'street' ? 'topo' : 'street');
  };
  
  // Handle zoom in
  const zoomIn = () => {
    setMapZoom(prev => Math.min(prev + 1, 18));
  };
  
  // Handle zoom out
  const zoomOut = () => {
    setMapZoom(prev => Math.max(prev - 1, 10));
  };
  
  return (
    <Box sx={{ 
      padding: isMobile ? 2 : 4, 
      backgroundColor: 'background.default',
      minHeight: '100vh',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <Button 
        startIcon={<ArrowBack />}
        onClick={() => navigate('/app/timeline')}
        sx={{ mb: 3 }}
      >
        Kembali
      </Button>
      
      {/* PERBAIKAN: Card sekarang full width tanpa maxWidth */}
      <Card sx={{ 
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <CardContent sx={{ width: '100%', boxSizing: 'border-box' }}>
          {/* User Info */}
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar 
              src={post.createdBy?.avatarUrl} 
              alt={post.createdBy?.name || 'User'}
              sx={{ 
                width: 48, 
                height: 48,
                mr: 1.5,
                border: '2px solid',
                borderColor: 'primary.main'
              }}
            >
              {post.createdBy?.name ? post.createdBy.name.charAt(0) : 'U'}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {post.createdBy?.name || 'Unknown User'}
            </Typography>
          </Box>
          
          {/* Image */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <CardMedia
              component="img"
              image={post.imageUrl || 'https://source.unsplash.com/random/600x300?oil,palm'}
              alt={post.kebun}
              sx={{ 
                maxWidth: 600,
                width: '100%',
                height: 'auto',
                maxHeight: 400,
                objectFit: 'cover',
                borderRadius: 2
              }}
            />
          </Box>
          
{/* Information Grid - PERBAIKAN: Layout horizontal untuk card dalam satu baris */}
<Grid container spacing={3} sx={{ 
  display: 'flex', 
  flexDirection: 'row',
  width: '100%',
  flexWrap: 'nowrap' // Mencegah pembungkusan ke baris baru
}}>
  <Grid item sx={{ 
    width: '50%',
    flex: '0 0 50%' // Flex grow: 0, flex shrink: 0, flex basis: 50%
  }}>
    <Paper elevation={2} sx={{ 
      p: 3, 
      borderRadius: 2, 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid rgba(0, 0, 0, 0.12)'
    }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', mb: 2 }}>
        Informasi Kebun
      </Typography>
      
      <Box display="flex" alignItems="center" mb={2}>
        <LocationOn fontSize="small" color="primary" sx={{ mr: 1.5 }} />
        <Typography variant="body1">
          <strong>Kebun:</strong> {post.kebun || 'Data tidak tersedia'}
        </Typography>
      </Box>
      
      <Box display="flex" alignItems="center" mb={2}>
        <LocationOn fontSize="small" color="primary" sx={{ mr: 1.5 }} />
        <Typography variant="body1">
          <strong>Afdeling:</strong> {post.afdeling || 'Data tidak tersedia'}
        </Typography>
      </Box>
      
      <Box display="flex" alignItems="center" mb={2}>
        <LocationOn fontSize="small" color="primary" sx={{ mr: 1.5 }} />
        <Typography variant="body1">
          <strong>Blok:</strong> {post.blok || 'Data tidak tersedia'}
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" mb={2}>
        <LocationOn fontSize="small" color="primary" sx={{ mr: 1.5 }} />
        <Typography variant="body1">
          <strong>Tahun Tanam:</strong> {post.tahuntanam || 'Data tidak tersedia'}
        </Typography>
      </Box>
      
      <Box display="flex" alignItems="center" mb={2}>
        <LocationOn fontSize="small" color="primary" sx={{ mr: 1.5 }} />
        <Typography variant="body1">
          <strong>Longitude (X):</strong> {post.koordinatX ? parseFloat(post.koordinatX).toFixed(6) : 'Data tidak tersedia'}
        </Typography>
      </Box>
      
      <Box display="flex" alignItems="center" mb={0}>
        <LocationOn fontSize="small" color="primary" sx={{ mr: 1.5 }} />
        <Typography variant="body1">
          <strong>Latitude (Y):</strong> {post.koordinatY ? parseFloat(post.koordinatY).toFixed(6) : 'Data tidak tersedia'}
        </Typography>
      </Box>
    </Paper>
  </Grid>
  
  <Grid item sx={{ 
    width: '50%',
    flex: '0 0 50%' // Flex grow: 0, flex shrink: 0, flex basis: 50%
  }}>
    <Paper elevation={2} sx={{ 
      p: 3, 
      borderRadius: 2, 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid rgba(0, 0, 0, 0.12)'
    }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', mb: 2 }}>
        Informasi Pelaporan
      </Typography>
      
      <Box display="flex" alignItems="center" mb={2}>
        <CalendarToday fontSize="small" color="primary" sx={{ mr: 1.5 }} />
        <Typography variant="body1">
          <strong>Nomor PP:</strong> {post.nomorPP || 'Data tidak tersedia'}
        </Typography>
      </Box>
      
      <Box display="flex" alignItems="center" mb={2}>
        <CalendarToday fontSize="small" color="primary" sx={{ mr: 1.5 }} />
        <Typography variant="body1">
          <strong>Tanggal:</strong> {formatDate(post.tanggal)}
        </Typography>
      </Box>
      
      <Box display="flex" alignItems="center" mb={2}>
        <CalendarToday fontSize="small" color="primary" sx={{ mr: 1.5 }} />
        <Typography variant="body1">
          <strong>Waktu:</strong> {formatTime(post.waktu)}
        </Typography>
      </Box>
      
      <Box display="flex" alignItems="center" mb={2}>
        <CalendarToday fontSize="small" color="primary" sx={{ mr: 1.5 }} />
        <Typography variant="body1">
          <strong>Kondisi Cuaca:</strong> {post.kondisiCuaca || 'Data tidak tersedia'}
        </Typography>
      </Box>
      
      <Box display="flex" alignItems="center" mb={2}>
        <CalendarToday fontSize="small" color="primary" sx={{ mr: 1.5 }} />
        <Typography variant="body1">
          <strong>Estimasi Jlh Serangga:</strong> {post.estimasiSerangga || 'Data tidak tersedia'}
        </Typography>
      </Box>
      
      <Box display="flex" alignItems="center" mb={0}>
        <CalendarToday fontSize="small" color="primary" sx={{ mr: 1.5 }} />
        <Typography variant="body1">
          <strong>RBT saat ini (Kg/Tross):</strong> {post.rbt ? parseFloat(post.rbt).toFixed(2) : 'Data tidak tersedia'}
        </Typography>
      </Box>
    </Paper>
  </Grid>
</Grid>
          
          {/* Map Section */}
          <Box mt={3}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              Lokasi
            </Typography>
            
            <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden', width: '100%' }}>
              {position ? (
                <Box sx={{ position: 'relative', height: 400, width: '100%' }}>
                  <MapContainer 
                    center={[position.lat, position.lng]} 
                    zoom={mapZoom}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url={mapLayer === 'street' 
                        ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        : 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
                      }
                    />
                    <Marker position={[position.lat, position.lng]}>
                      <Popup>
                        <Typography variant="body2">
                          <strong>{post.kebun}</strong><br />
                          {post.afdeling} - {post.blok}<br />
                          Kabupaten: {post.kabupaten || 'Data tidak tersedia'}<br />
                          Kecamatan: {post.kecamatan || 'Data tidak tersedia'}
                        </Typography>
                      </Popup>
                    </Marker>
                  </MapContainer>
                  
                  {/* Map Controls */}
                  <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
                    <Paper elevation={3} sx={{ borderRadius: 1 }}>
                      <Tooltip title="Ganti Lapisan Peta">
                        <IconButton onClick={toggleMapLayer} size="small">
                          <Layers />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Perbesar">
                        <IconButton onClick={zoomIn} size="small">
                          <ZoomIn />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Perkecil">
                        <IconButton onClick={zoomOut} size="small">
                          <ZoomOut />
                        </IconButton>
                      </Tooltip>
                    </Paper>
                  </Box>
                </Box>
              ) : (
                <Box 
                  sx={{ 
                    height: 400, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: 'background.default',
                    width: '100%'
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    Data lokasi tidak tersedia
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}