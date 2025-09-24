import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  useTheme,
  alpha,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Search as SearchIcon,
  GetApp as ExportIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
  Home
} from '@mui/icons-material';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import * as XLSX from 'xlsx';
import reportService from '../services/reportService';

export default function AdminPanel() {
  const theme = useTheme();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState({
    kebun: '',
    afdeling: '',
    blok: ''
  });
  const [filterOptions, setFilterOptions] = useState({
    kebun: [],
    afdeling: [],
    blok: []
  });

  // Fetch data from API using reportService
  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const reportsData = await reportService.getReports();
      setReports(reportsData);
      setFilteredReports(reportsData);
      
      // Extract unique values for filter options
      const kebunValues = [...new Set(reportsData.map(r => r.kebun).filter(Boolean))];
      const afdelingValues = [...new Set(reportsData.map(r => r.afdeling).filter(Boolean))];
      const blokValues = [...new Set(reportsData.map(r => r.blok).filter(Boolean))];
      
      setFilterOptions({
        kebun: kebunValues,
        afdeling: afdelingValues,
        blok: blokValues
      });
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Gagal memuat data. Silakan coba lagi.');
      setSnackbarMessage('Gagal memuat data laporan');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Filter data based on search term and filter
  useEffect(() => {
    let result = reports;

    // Filter based on search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(report => 
        report.kebun?.toLowerCase().includes(term) ||
        report.afdeling?.toLowerCase().includes(term) ||
        report.blok?.toLowerCase().includes(term) ||
        report.nomorPP?.toString().includes(term) ||
        report.createdBy?.name?.toLowerCase().includes(term)
      );
    }

    // Filter based on kebun, afdeling, blok
    if (filter.kebun) {
      result = result.filter(report => report.kebun === filter.kebun);
    }
    if (filter.afdeling) {
      result = result.filter(report => report.afdeling === filter.afdeling);
    }
    if (filter.blok) {
      result = result.filter(report => report.blok === filter.blok);
    }

    setFilteredReports(result);
    setPage(0); // Reset to first page after filter
  }, [searchTerm, filter, reports]);

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
      
      const formatted = date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      return formatted;
    }
    
    // Jika formatnya YYYY-MM-DD (dari form)
    if (typeof dateObj === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateObj)) {
      const [year, month, day] = dateObj.split('-');
      const date = new Date(year, month - 1, day);
      
      if (isNaN(date.getTime())) {
        return 'Format tanggal tidak valid';
      }
      
      const formatted = date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      return formatted;
    }
    
    // Format lainnya
    const date = new Date(dateObj);
    if (isNaN(date.getTime())) {
      return 'Format tanggal tidak valid';
    }
    
    const formatted = date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return formatted;
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
      
      const formatted = time.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      });
      return formatted;
    }
    
    // Jika formatnya HH:MM (dari form)
    if (typeof timeObj === 'string' && /^\d{2}:\d{2}$/.test(timeObj)) {
      const [hours, minutes] = timeObj.split(':');
      const formatted = `${hours}:${minutes}`;
      return formatted;
    }
    
    // Format lainnya
    const time = new Date(timeObj);
    if (isNaN(time.getTime())) {
      return 'Format waktu tidak valid';
    }
    
    const formatted = time.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return formatted;
  };

  // Format koordinat
  const formatKoordinat = (x, y) => {
    if (x === undefined || y === undefined) return '-';
    return `{${x}, ${y}}`;
  };

  // Export to Excel
  const exportToExcel = () => {
    // Prepare data for export
    const exportData = filteredReports.map(report => ({
      'ID': report.id,
      'Kebun': report.kebun || '-',
      'Afdeling': report.afdeling || '-',
      'Blok': report.blok || '-',
      'Nomor PP': report.nomorPP || '-',
      'Tanggal Laporan': formatDate(report.tanggal),
      'Waktu Laporan': formatTime(report.waktu),
      'Tanggal Dibuat': formatDate(report.createdAt),
      'Waktu Dibuat': formatTime(report.createdAt),
      'Kondisi Cuaca': report.kondisiCuaca || '-',
      'Estimasi Serangga': report.estimasiSerangga || '-',
      'RBT (Kg/Tross)': report.rbt || '-',
      'Koordinat': formatKoordinat(report.koordinatX, report.koordinatY),
      'Dibuat Oleh': report.createdBy?.name || '-',
      'Gambar': report.imageUrl || '-'
    }));

    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const colWidths = [
      { wch: 15 }, // ID
      { wch: 10 }, // Kebun
      { wch: 10 }, // Afdeling
      { wch: 10 }, // Blok
      { wch: 10 }, // Nomor PP
      { wch: 15 }, // Tanggal Laporan
      { wch: 10 }, // Waktu Laporan
      { wch: 15 }, // Tanggal Dibuat
      { wch: 10 }, // Waktu Dibuat
      { wch: 15 }, // Kondisi Cuaca
      { wch: 20 }, // Estimasi Serangga
      { wch: 15 }, // RBT
      { wch: 15 }, // Koordinat
      { wch: 20 }, // Dibuat Oleh
      { wch: 50 }  // Gambar
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan');

    // Generate filename with current date
    const fileName = `Laporan_Pelaporan_${format(new Date(), 'dd-MM-yyyy')}.xlsx`;

    // Save file
    XLSX.writeFile(wb, fileName);
  };

  // Handle filter change
  const handleFilterChange = (field, value) => {
    setFilter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilter({
      kebun: '',
      afdeling: '',
      blok: ''
    });
    setSearchTerm('');
  };

  // Refresh data
  const refreshData = () => {
    fetchReports();
  };

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Handle back to dashboard
  const handleBackToDashboard = () => {
    try {
      window.location.href = '/app/dashboard';
    } catch (err) {
      console.error('Navigation error:', err);
      setSnackbarMessage('Gagal kembali ke dashboard');
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.02), minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
          Admin Panel - Data Laporan
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Home />}
            onClick={handleBackToDashboard}
          >
            Kembali ke Dashboard
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={refreshData}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ExportIcon />}
            onClick={exportToExcel}
            disabled={filteredReports.length === 0}
            sx={{ boxShadow: theme.shadows[2] }}
          >
            Export to Excel
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Search and Filter Card */}
      <Card 
        sx={{ 
          mb: 4, 
          borderRadius: 2,
          boxShadow: theme.shadows[3],
          overflow: 'visible'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="medium" mb={3} display="flex" alignItems="center">
            <FilterIcon sx={{ mr: 1 }} /> Filter & Search
          </Typography>
          
          <Grid container spacing={3}>
            {/* Search Field */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                placeholder="Cari laporan berdasarkan kebun, afdeling, blok, nomor PP, atau pembuat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                    },
                    '&.Mui-focused': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }
                }}
                variant="outlined"
                size="medium"
              />
            </Grid>
            
            {/* Filter Fields */}
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth size="medium">
                <InputLabel id="kebun-label">Kebun</InputLabel>
                <Select
                  labelId="kebun-label"
                  value={filter.kebun}
                  onChange={(e) => handleFilterChange('kebun', e.target.value)}
                  input={<OutlinedInput label="Kebun" />}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">Semua Kebun</MenuItem>
                  {filterOptions.kebun.map(kebun => (
                    <MenuItem key={kebun} value={kebun}>{kebun}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth size="medium">
                <InputLabel id="afdeling-label">Afdeling</InputLabel>
                <Select
                  labelId="afdeling-label"
                  value={filter.afdeling}
                  onChange={(e) => handleFilterChange('afdeling', e.target.value)}
                  input={<OutlinedInput label="Afdeling" />}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">Semua Afdeling</MenuItem>
                  {filterOptions.afdeling.map(afdeling => (
                    <MenuItem key={afdeling} value={afdeling}>{afdeling}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth size="medium">
                <InputLabel id="blok-label">Blok</InputLabel>
                <Select
                  labelId="blok-label"
                  value={filter.blok}
                  onChange={(e) => handleFilterChange('blok', e.target.value)}
                  input={<OutlinedInput label="Blok" />}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">Semua Blok</MenuItem>
                  {filterOptions.blok.map(blok => (
                    <MenuItem key={blok} value={blok}>{blok}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          {/* Filter Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="text"
              color="primary"
              startIcon={<ClearIcon />}
              onClick={clearFilters}
              disabled={!searchTerm && !filter.kebun && !filter.afdeling && !filter.blok}
            >
              Clear Filters
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body1" color="textSecondary">
          Menampilkan <strong>{filteredReports.length}</strong> laporan dari total <strong>{reports.length}</strong> laporan
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Halaman {page + 1} dari {Math.ceil(filteredReports.length / rowsPerPage)}
        </Typography>
      </Box>

      {/* Data Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : (
        <Card 
          sx={{ 
            borderRadius: 2,
            boxShadow: theme.shadows[3],
            overflow: 'hidden'
          }}
        >
          <TableContainer component={Paper} elevation={0}>
            <Table sx={{ minWidth: 1200 }}>
              <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', py: 2 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Kebun</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Afdeling</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Blok</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Nomor PP</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Tanggal Laporan</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Waktu Laporan</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Tanggal Dibuat</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Waktu Dibuat</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Cuaca</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Serangga</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 2 }}>RBT</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Koordinat</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Dibuat Oleh</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReports.length > 0 ? (
                  filteredReports
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((report) => (
                      <TableRow 
                        key={report.id} 
                        hover
                        sx={{ 
                          '&:nth-of-type(odd)': { 
                            bgcolor: alpha(theme.palette.primary.main, 0.02) 
                          },
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <TableCell sx={{ py: 2 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {report.id.substring(0, 8)}...
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Chip 
                            label={report.kebun || '-'} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>{report.afdeling || '-'}</TableCell>
                        <TableCell sx={{ py: 2 }}>{report.blok || '-'}</TableCell>
                        <TableCell sx={{ py: 2 }}>{report.nomorPP || '-'}</TableCell>
                        <TableCell sx={{ py: 2 }}>{formatDate(report.tanggal)}</TableCell>
                        <TableCell sx={{ py: 2 }}>{formatTime(report.waktu)}</TableCell>
                        <TableCell sx={{ py: 2 }}>{formatDate(report.createdAt)}</TableCell>
                        <TableCell sx={{ py: 2 }}>{formatTime(report.createdAt)}</TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Chip 
                            label={report.kondisiCuaca || '-'} 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>{report.estimasiSerangga || '-'}</TableCell>
                        <TableCell sx={{ py: 2 }}>{report.rbt || '-'}</TableCell>
                        <TableCell sx={{ py: 2 }}>
                          {formatKoordinat(report.koordinatX, report.koordinatY)}
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>{report.createdBy || '-'}</TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Tooltip title="Lihat Detail">
                            <IconButton 
                              component={Link} 
                              to={`/app/timeline/${report.id}`}
                              color="primary"
                              sx={{ 
                                '&:hover': { 
                                  bgcolor: alpha(theme.palette.primary.main, 0.1) 
                                } 
                              }}
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={15} align="center" sx={{ py: 6 }}>
                      <Typography variant="body1" color="textSecondary">
                        Tidak ada data laporan yang tersedia
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredReports.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Baris per halaman:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} dari ${count}`}
            sx={{ borderTop: '1px solid rgba(0, 0, 0, 0.05)' }}
          />
        </Card>
      )}

      {/* Footer */}
      <Box sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} PTPN4 N4R1 - Admin Panel
        </Typography>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Box>
  );
}