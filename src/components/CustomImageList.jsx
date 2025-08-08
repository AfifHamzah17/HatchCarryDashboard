import * as React from 'react';
import { Card, CardMedia, CardContent, Typography, IconButton, Grid, Box } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';

function CustomImageList() {
  return (
    <Grid
      container
      spacing={4} // Adjust spacing between cards
      sx={{ justifyContent: 'center', padding: 2 }}
    >
      {itemData.map((item) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={item.img}>
          <Card sx={{ maxWidth: 345, position: 'relative', boxShadow: 3, transition: 'transform 0.3s ease' }}>
            <CardMedia
              component="img"
              image={item.img}
              alt={item.title}
              sx={{
                height: 200,
                objectFit: 'cover',
                '&:hover': {
                  transform: 'scale(1.05)', // Zoom effect on hover
                },
              }}
            />
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                {item.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {item.author}
              </Typography>
            </CardContent>
            <IconButton
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background for better visibility on hover
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', // Hover effect on icon button
                },
              }}
              aria-label={`star ${item.title}`}
            >
              <StarBorderIcon />
            </IconButton>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
    author: '@bkristastucchio',
    featured: true,
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
    author: '@rollelflex_graphy726',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
    author: '@helloimnik',
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: 'Coffee',
    author: '@nolanissac',
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
    author: '@hjrc33',
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
    author: '@arwinneil',
    featured: true,
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    title: 'Basketball',
    author: '@tjdragotta',
  },
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: 'Fern',
    author: '@katie_wasserman',
  },
  {
    img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    title: 'Mushrooms',
    author: '@silverdalex',
  },
  {
    img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
    title: 'Tomato basil',
    author: '@shelleypauls',
  },
  {
    img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
    title: 'Sea star',
    author: '@peterlaster',
  },
  {
    img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
    title: 'Bike',
    author: '@southside_customs',
  },
];

export default CustomImageList;
