import React, { useState, useEffect } from 'react';
import Carousel from 'react-material-ui-carousel';
import { Paper } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import DashboardChart from '../components/DashboardChart';

export default function DashboardMenu() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [carouselLoaded, setCarouselLoaded] = useState(false);
  
  useEffect(() => {
    // Set carouselLoaded ke true setelah komponen mount
    setCarouselLoaded(true);
  }, []);
  
  return (
    <div style={{ 
      padding: isMobile ? 12 : 32, 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    }}>
      {/* <h2 style={{ 
        textAlign: 'center', 
        marginBottom: isMobile ? 15 : 30, 
        color: '#1976d2',
        fontSize: isMobile ? '1.5rem' : '2.5rem',
        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
      }}>
        Dashboard Hatch & Carry
      </h2> */}
      
      {/* Carousel Hanya Berisi Gambar */}
      <div style={{ 
        marginBottom: isMobile ? 15 : 30,
        position: 'relative',
        overflow: 'hidden',
        height: isMobile ? '320px' : '520px'
      }}>
        <Carousel
          navButtonsAlwaysVisible={!isMobile}
          fullHeightHover={false}
          indicatorContainerProps={{
            style: { marginTop: '1px' }
          }}
          animation="slide"
          timeout={500}
          height={isMobile ? '320px' : '520px'}
          key={carouselLoaded ? "loaded" : "loading"}
        >
          {/* Slide 1: Image Placeholder */}
          <Paper key="slide1" style={{ 
            padding: isMobile ? 10 : 16, 
            borderRadius: 12,
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            height: isMobile ? '320px' : '520px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ 
              textAlign: 'center', 
              marginBottom: isMobile ? 10 : 20, 
              color: '#1976d2',
              fontSize: isMobile ? '1rem' : '1.5rem'
            }}>
              Galeri Kebun
            </h3>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 8,
              flex: 1
            }}>
              <img
                src="/1.png"
                alt="Poster"
                style={{ 
                  width: '100%', 
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                color: 'white',
                padding: isMobile ? '10px' : '20px',
                fontSize: isMobile ? '0.9rem' : '1.2rem',
                fontWeight: 'bold'
              }}>
                Kebun Sawit Terluas
              </div>
            </div>
          </Paper>
          
          {/* Slide 2: Image Placeholder */}
          <Paper key="slide2" style={{ 
            padding: isMobile ? 10 : 16, 
            borderRadius: 12,
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            height: isMobile ? '320px' : '520px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ 
              textAlign: 'center', 
              marginBottom: isMobile ? 10 : 20, 
              color: '#1976d2',
              fontSize: isMobile ? '1rem' : '1.5rem'
            }}>
              Pelepasan Elaeidobius
            </h3>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 8,
              flex: 1
            }}>
              <img
                src="/3.jpg"
                alt="Elaeidobius"
                style={{ 
                  width: '100%', 
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                color: 'white',
                padding: isMobile ? '10px' : '20px',
                fontSize: isMobile ? '0.9rem' : '1.2rem',
                fontWeight: 'bold'
              }}>
                Pelepasan Ek 1KSL 
              </div>
            </div>
          </Paper>
          
          {/* Slide 3: Image Placeholder */}
          <Paper key="slide3" style={{ 
            padding: isMobile ? 10 : 16, 
            borderRadius: 12,
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            height: isMobile ? '320px' : '520px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ 
              textAlign: 'center', 
              marginBottom: isMobile ? 10 : 20, 
              color: '#1976d2',
              fontSize: isMobile ? '1rem' : '1.5rem'
            }}>
              Rumah Hatch & Carry
            </h3>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 8,
              flex: 1
            }}>
              <img
                src="/4.jpg"
                alt="Rumah HC"
                style={{ 
                  width: '100%', 
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                color: 'white',
                padding: isMobile ? '10px' : '20px',
                fontSize: isMobile ? '0.9rem' : '1.2rem',
                fontWeight: 'bold'
              }}>
                Kebun 1KLJ Titik 1
              </div>
            </div>
          </Paper>

          {/* Slide 4: Image Placeholder */}
          <Paper key="slide3" style={{ 
            padding: isMobile ? 10 : 16, 
            borderRadius: 12,
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            height: isMobile ? '320px' : '520px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ 
              textAlign: 'center', 
              marginBottom: isMobile ? 10 : 20, 
              color: '#1976d2',
              fontSize: isMobile ? '1rem' : '1.5rem'
            }}>
              Rumah Hatch & Carry
            </h3>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 8,
              flex: 1
            }}>
              <img
                src="/5.jpg"
                alt="Rumah HC"
                style={{ 
                  width: '100%', 
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                color: 'white',
                padding: isMobile ? '10px' : '20px',
                fontSize: isMobile ? '0.9rem' : '1.2rem',
                fontWeight: 'bold'
              }}>
                Kebun 1KLJ Titik 2
              </div>
            </div>
          </Paper>
        </Carousel>
      </div>
      
      {/* Container untuk Chart */}
      <div style={{ 
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <DashboardChart />
      </div>
    </div>
  );
}