// src/components/Timeline.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Grid, 
  Box, 
  Button,
  Chip,
  CircularProgress,
  Alert,
  Fab,
  Avatar,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  LocationOn, 
  AccessAlarm,
  Festival,
  CalendarToday, 
  Person,
  Refresh,
  Add
} from '@mui/icons-material';
import reportService from '../services/reportService';

const PostCard = ({ post }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/app/timeline/${post.id}`);
  };
  
  // Format tanggal dengan pengecekan validitas - PERBAIKAN
  const formatDate = (dateObj) => {
    if (!dateObj) {
      return 'Data tidak tersedia';
    }
    
    // Handle Firestore Timestamp format
    if (dateObj._seconds !== undefined) {
      // Konversi Firestore Timestamp ke JavaScript Date
      const date = new Date(dateObj._seconds * 1000);
      
      if (isNaN(date.getTime())) {
        return 'Format tanggal tidak valid';
      }
      
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    
    // Jika formatnya YYYY-MM-DD (dari form)
    if (typeof dateObj === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateObj)) {
      const [year, month, day] = dateObj.split('-');
      const date = new Date(year, month - 1, day);
      
      if (isNaN(date.getTime())) {
        return 'Format tanggal tidak valid';
      }
      
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    
    // Format lainnya
    const date = new Date(dateObj);
    if (isNaN(date.getTime())) {
      return 'Format tanggal tidak valid';
    }
    
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Format waktu dengan pengecekan validitas - PERBAIKAN
  const formatTime = (timeObj) => {
    if (!timeObj) {
      return 'Data tidak tersedia';
    }
    
    // Handle Firestore Timestamp format
    if (timeObj._seconds !== undefined) {
      // Konversi Firestore Timestamp ke JavaScript Date
      const time = new Date(timeObj._seconds * 1000);
      
      if (isNaN(time.getTime())) {
        return 'Format waktu tidak valid';
      }
      
      return time.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    // Jika formatnya HH:MM (dari form)
    if (typeof timeObj === 'string' && /^\d{2}:\d{2}$/.test(timeObj)) {
      const [hours, minutes] = timeObj.split(':');
      return `${hours}:${minutes}`;
    }
    
    // Format lainnya
    const time = new Date(timeObj);
    if (isNaN(time.getTime())) {
      return 'Format waktu tidak valid';
    }
    
    return time.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Card 
      sx={{ 
        maxWidth: 280, // Batasi lebar maksimum card
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
        },
        cursor: 'pointer',
        borderRadius: 3,
        overflow: 'hidden',
        m: 'auto' // Pusatkan card
      }}
      onClick={handleClick}
    >
      <CardMedia
        component="img"
        height="140" // Kurangi tinggi gambar
        image={post.imageUrl || 'https://source.unsplash.com/random/300x200?oil,palm'}
        alt={post.kebun}
        sx={{ 
          objectFit: 'cover',
          transition: 'transform 0.5s',
          '&:hover': {
            transform: 'scale(1.03)'
          }
        }}
      />
      
      <CardContent sx={{ flexGrow: 1, p: 1.5 }}> 
        {/* User Info */}
        <Box display="flex" alignItems="center" mb={1}>
          <Avatar 
            src={post.createdBy?.avatarUrl} 
            alt={post.createdBy?.name || 'User'}
            sx={{ 
              width: 32, // Perkecil avatar
              height: 32,
              mr: 1,
              border: '1.5px solid',
              borderColor: 'primary.main'
            }}
          >
            {post.createdBy?.name ? post.createdBy.name.charAt(0) : 'U'}
          </Avatar>
          <Typography variant="subtitle2" sx={{ // Perkecil font username
            fontWeight: 'bold',
            color: 'text.primary'
          }}>
            {post.createdBy?.name || 'Unknown User'}
          </Typography>
        </Box>
        
        {/* Date */}
        <Box display="flex" alignItems="center" mb={0.5}>
          <CalendarToday fontSize="small" color="primary" sx={{ mr: 0.5 }} />
          <Typography variant="caption" color="text.secondary"> 
            Dibuat: {formatDate(post.tanggal)}
          </Typography>
        </Box>
        
        {/* Time - PERBAIKAN: Menambahkan waktu */}
        <Box display="flex" alignItems="center" mb={0.5}>
          <AccessAlarm fontSize="small" color="primary" sx={{ mr: 0.5 }} />
          <Typography variant="caption" color="text.secondary"> 
            Pukul: {formatTime(post.waktu)}
          </Typography>
        </Box>
        
        {/* Location */}
        <Box display="flex" alignItems="center" mb={0.5}>
          <Festival fontSize="small" color="primary" sx={{ mr: 0.5 }} />
          <Typography variant="caption" color="text.secondary"> 
            Lokasi: {post.kebun}
          </Typography>
        </Box>
        
        {/* Coordinates */}
        <Box display="flex" alignItems="center" mb={0.5}>
          <LocationOn fontSize="small" color="primary" sx={{ mr: 0.5 }} />
          {post.koordinatX && post.koordinatY && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: 0 }}>
            X: {post.koordinatX}, Y: {post.koordinatY}
          </Typography>
          )}
        </Box> 
        
  
        
        {/* Insect Estimate */}
        {post.estimasiSerangga && (
          <Box mt={1}>
            <Chip 
              label={`Estimasi Serangga: ${post.estimasiSerangga}`} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default function Timeline() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const reports = await reportService.getReports();
      setPosts(reports);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Gagal memuat data. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  return (
    <Box sx={{ 
      padding: isMobile ? 1.5 : 3, // Kurangi padding
      backgroundColor: 'background.default',
      minHeight: '100vh'
    }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        textAlign="center"
        sx={{ 
          mb: 3, // Kurangi margin
          color: 'primary.main',
          fontWeight: 'bold'
        }}
      >
        Laporan Pelepasan Serangga Terbaru
      </Typography>
      
      {/* Floating Action Button untuk menambah laporan */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={() => navigate('/app/report/submit')}
      >
        <Add />
      </Fab>
      
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button 
          startIcon={<Refresh />}
          onClick={fetchPosts}
          disabled={loading}
          size="small" // Perkecil tombol
        >
          Refresh
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box display="flex" justifyContent="center" py={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}> 
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={post.id}>
              <PostCard post={post} />
            </Grid>
          ))}
        </Grid>
      )}
      
      {posts.length === 0 && !loading && !error && (
        <Box textAlign="center" py={5}>
          <Typography variant="h6" color="text.secondary">
            Belum ada cerita yang tersedia
          </Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            onClick={() => navigate('/app/report/submit')}
          >
            Buat Cerita Pertama Anda
          </Button>
        </Box>
      )}
    </Box>
  );
}