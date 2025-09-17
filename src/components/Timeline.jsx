import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Grid, 
  Box, 
  Button,
  Chip
} from '@mui/material';
import { 
  LocationOn, 
  CalendarToday, 
  Person 
} from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// Data dummy untuk post
const dummyPosts = [
  {
    id: 1,
    username: 'user1',
    kebun: 'Kebun Sawit A',
    tanggal: '2023-05-15',
    lokasi: { x: -6.2088, y: 106.8456 },
    imageUrl: 'https://source.unsplash.com/random/300x200?oil,palm',
    afdeling: 'Afdeling 1',
    blok: 'Blok A',
    nomorPP: 12345,
    estimasiSerangga: 150,
    kondisiCuaca: 'Cerah',
    rbt: 2.5
  },
  {
    id: 2,
    username: 'user2',
    kebun: 'Kebun Sawit B',
    tanggal: '2023-05-14',
    lokasi: { x: -6.1751, y: 106.8650 },
    imageUrl: 'https://source.unsplash.com/random/300x200?plantation',
    afdeling: 'Afdeling 2',
    blok: 'Blok B',
    nomorPP: 12346,
    estimasiSerangga: 200,
    kondisiCuaca: 'Berawan',
    rbt: 3.2
  },
  {
    id: 3,
    username: 'user3',
    kebun: 'Kebun Sawit C',
    tanggal: '2023-05-13',
    lokasi: { x: -6.1944, y: 106.8229 },
    imageUrl: 'https://source.unsplash.com/random/300x200?palm,trees',
    afdeling: 'Afdeling 3',
    blok: 'Blok C',
    nomorPP: 12347,
    estimasiSerangga: 175,
    kondisiCuaca: 'Hujan',
    rbt: 2.8
  },
  // Tambahkan data dummy lainnya hingga 28 post
];

const PostCard = ({ post }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
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
        }
      }}
    >
      <CardMedia
        component="img"
        height="160"
        image={post.imageUrl}
        alt={post.kebun}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" alignItems="center" mb={1}>
          <Person fontSize="small" color="primary" />
          <Typography variant="h6" component={Link} to={`/timeline?UID=${post.id}`} sx={{ 
            ml: 1, 
            textDecoration: 'none', 
            color: 'primary.main',
            fontWeight: 'bold'
          }}>
            {post.username}
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
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    // Di sini nanti akan fetch data dari API
    // Untuk sementara, kita gunakan data dummy
    setPosts(dummyPosts);
  }, []);
  
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
      
      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={post.id}>
            <PostCard post={post} />
          </Grid>
        ))}
      </Grid>
      
      {posts.length === 0 && (
        <Box textAlign="center" py={5}>
          <Typography variant="h6" color="text.secondary">
            Belum ada post yang tersedia
          </Typography>
        </Box>
      )}
    </Box>
  );
}