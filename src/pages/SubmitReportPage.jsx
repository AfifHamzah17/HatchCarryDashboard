// src/pages/SubmitReportPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Alert, Paper, Breadcrumbs, Link as MuiLink } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ReportForm from '../components/ReportForm';
import { useAuth } from '../context/AuthContext'; 

export default function SubmitReportPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [success, setSuccess] = useState(false);

  const handleSuccess = (report) => {
    console.log('Report created successfully:', report);
    setSuccess(true);
    // Redirect to timeline after 2 seconds
    setTimeout(() => {
      navigate('/app/timeline');
    }, 2000);
  };

  const handleCancel = () => {
    console.log('Cancel clicked, navigating to timeline');
    navigate('/app/timeline');
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          Anda harus login untuk mengirim laporan
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <MuiLink 
            underline="hover" 
            color="inherit" 
            onClick={() => navigate('/app/dashboard')}
            style={{ cursor: 'pointer' }}
          >
            Dashboard
          </MuiLink>
          <MuiLink 
            underline="hover" 
            color="inherit" 
            onClick={() => navigate('/app/timeline')}
            style={{ cursor: 'pointer' }}
          >
            Timeline
          </MuiLink>
          <Typography color="text.primary">Submit Laporan</Typography>
        </Breadcrumbs>

        {/* Ganti "B" dengan informasi login pengguna */}
        <Typography variant="" component="h1" gutterBottom>
          Halo, {user.username || user.email || user.name || 'User'}
        </Typography>
        
        {success ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            Laporan berhasil dikirim! Anda akan diarahkan ke halaman timeline...
          </Alert>
        ) : (
          <ReportForm onSuccess={handleSuccess} onCancel={handleCancel} />
        )}
      </Paper>
    </Container>
  );
}