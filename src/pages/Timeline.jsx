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
  Snackbar
} from '@mui/material';
import { 
  LocationOn, 
  CalendarToday, 
  Person,
  Refresh,
  Add,
  Home
} from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import reportService from '../services/reportService';
import { useAuth } from '../context/AuthContext'; 

const PostCard = ({ post }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  const handleClick = () => {
    console.log('Navigating to post detail:', post.id);
    navigate(`/timeline/${post.id}`);
  };
  
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
        },
        cursor: 'pointer'
      }}
      onClick={handleClick}
    >
      <CardMedia
        component="img"
        height="160"
        image={post.imageUrl || 'https://source.unsplash.com/random/300x200?oil,palm'}
        alt={post.kebun}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" alignItems="center" mb={1}>
          <Person fontSize="small" color="primary" />
          <Typography variant="h6" sx={{ 
            ml: 1, 
            color: 'primary.main',
            fontWeight: 'bold'
          }}>
            {post.createdBy?.name || 'Unknown User'}
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" component="div">
          <Box display="flex" alignItems="center" mb={0.5}>
            <LocationOn fontSize="small" />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {post.kebun}
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center">
            <CalendarToday fontSize="small" />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {new Date(post.tanggal).toLocaleDateString('id-ID')}
            </Typography>
          </Box>
        </Typography>
      </CardContent>
      
      <Box sx={{ p: 1, bgcolor: 'background.paper' }}>
        <Chip 
          label={`Estimasi Serangga: ${post.estimasiSerangga}`} 
          size="small" 
          color="primary" 
          variant="outlined"
        />
      </Box>
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
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
  
  const handleAddReport = () => {
    console.log('Add report button clicked');
    try {
      navigate('/report/submit');
    } catch (err) {
      console.error('Navigation error:', err);
      setSnackbarMessage('Gagal membuka halaman submit laporan');
      setSnackbarOpen(true);
    }
  };

  const handleBackToDashboard = () => {
    console.log('Back to dashboard clicked');
    try {
      navigate('/dashboard');
    } catch (err) {
      console.error('Navigation error:', err);
      setSnackbarMessage('Gagal kembali ke dashboard');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  return (
    <Box sx={{ 
      padding: isMobile ? 2 : 4, 
      backgroundColor: 'background.default',
      minHeight: '100vh'
    }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        textAlign="center"
        sx={{ 
          mb: 4, 
          color: 'primary.main',
          fontWeight: 'bold'
        }}
      >
        Timeline Pelaporan
      </Typography>
      
      {/* Tombol kembali ke dashboard */}
      <Button
        variant="outlined"
        startIcon={<Home />}
        onClick={handleBackToDashboard}
        sx={{ mb: 2 }}
      >
        Kembali ke Dashboard
      </Button>
      
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button 
          startIcon={<Refresh />}
          onClick={fetchPosts}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>
      
      {/* Floating Action Button untuk menambah laporan */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={handleAddReport}
      >
        <Add />
      </Fab>
      
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
        <Grid container spacing={3}>
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
            Belum ada post yang tersedia
          </Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            onClick={handleAddReport}
          >
            Buat Laporan Pertama Anda
          </Button>
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Box>
  );
}