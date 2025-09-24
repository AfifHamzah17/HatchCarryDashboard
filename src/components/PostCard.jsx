// src/components/PostCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Box,
  Chip,
  Avatar,
  Stack
} from '@mui/material';
import { 
  Person, 
  CalendarToday, 
  LocationOn,
  Place
} from '@mui/icons-material';

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/app/timeline/${post.id}`);
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
        cursor: 'pointer',
        borderRadius: 2,
        overflow: 'hidden'
      }}
      onClick={handleClick}
    >
      {/* Gambar yang lebih besar dengan overlay */}
      <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
        <CardMedia
          component="img"
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          image={post.imageUrl || 'https://source.unsplash.com/random/300x200?oil,palm'}
          alt={post.kebun}
        />
        {/* Overlay gradient untuk keterbacaan teks */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
            color: 'white',
            p: 1.5
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar 
              src={post.createdBy?.avatar || '/default-avatar.png'} 
              alt={post.createdBy?.name || 'User'}
            />
            <Box>
              <Typography variant="body2" fontWeight="bold">
                {post.createdBy?.name || 'Unknown User'}
              </Typography>
              <Typography variant="caption">
                {new Date(post.tanggal).toLocaleDateString('id-ID')}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
      
      {/* Konten card */}
      <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
        <Stack spacing={1}>
          {/* Informasi kebun */}
          <Box display="flex" alignItems="center" mb={0.5}>
            <LocationOn fontSize="small" color="primary" />
            <Typography variant="h6" sx={{ ml: 1 }}>
              {post.kebun}
            </Typography>
          </Box>
          
          {/* Informasi lokasi */}
          <Box display="flex" alignItems="center" mb={1}>
            <Place fontSize="small" color="primary" />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {post.koordinatX && post.koordinatY 
                ? `${post.koordinatX.toFixed(3)}, ${post.koordinatY.toFixed(3)}` 
                : 'Lokasi tidak tersedia'}
            </Typography>
          </Box>
          
          {/* Chip estimasi serangga */}
          <Chip 
            label={`Estimasi Serangga: ${post.estimasiSerangga || 0}`}
            size="small" 
            color="primary" 
            variant="outlined"
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PostCard;