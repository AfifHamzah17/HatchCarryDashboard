import React, { useState, useEffect } from 'react';
import { validKebunList } from '../utils/kebunList.js';
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
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Switch,
  Divider,
  Stack
} from '@mui/material';
import {
  Search as SearchIcon,
  GetApp as ExportIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
  Home,
  CalendarToday as CalendarIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import * as XLSX from 'xlsx';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import reportService from '../services/reportService';

export default function AdminPanel() {
  const theme = useTheme();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState({
    kebun: '',
    afdeling: '',
    blok: '',
    dateRange: false,
    startDate: null,
    endDate: null,
    month: null,
    year: null
  });
  const [filterOptions, setFilterOptions] = useState({
    kebun: [],
    afdeling: [],
    blok: []
  });
  
  // State untuk modal
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [reportToView, setReportToView] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [reportToEdit, setReportToEdit] = useState(null);

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
      showSnackbar('Gagal memuat data laporan', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Show snackbar notification
  const showSnackbar = (message, severity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Fungsi untuk mengonversi berbagai format tanggal ke objek Date
  const parseDate = (dateObj) => {
    if (!dateObj) return null;
    
    // Handle Firestore Timestamp format
    if (dateObj._seconds !== undefined) {
      return new Date(dateObj._seconds * 1000);
    }
    
    // Handle string format YYYY-MM-DD
    if (typeof dateObj === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateObj)) {
      const [year, month, day] = dateObj.split('-');
      return new Date(year, month - 1, day);
    }
    
    // Handle string format ISO
    if (typeof dateObj === 'string') {
      return new Date(dateObj);
    }
    
    // Handle other formats
    return new Date(dateObj);
  };

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

    // Filter based on date range
    if (filter.dateRange && filter.startDate && filter.endDate) {
      result = result.filter(report => {
        const reportDate = parseDate(report.tanggal);
        if (!reportDate) return false;
        
        // Set time to start and end of day for proper comparison
        const startDate = new Date(filter.startDate);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(filter.endDate);
        endDate.setHours(23, 59, 59, 999);
        
        return reportDate >= startDate && reportDate <= endDate;
      });
    }

    // Filter based on month
    if (filter.month !== null && filter.month !== undefined) {
      result = result.filter(report => {
        const reportDate = parseDate(report.tanggal);
        if (!reportDate) return false;
        
        return reportDate.getMonth() === filter.month;
      });
    }

    // Filter based on year
    if (filter.year !== null && filter.year !== undefined) {
      result = result.filter(report => {
        const reportDate = parseDate(report.tanggal);
        if (!reportDate) return false;
        
        return reportDate.getFullYear() === filter.year;
      });
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

  // Format tanggal dengan pengecekan validitas
  const formatDate = (dateObj) => {
    if (!dateObj) {
      return 'Data tidak tersedia';
    }
    
    const date = parseDate(dateObj);
    if (!date || isNaN(date.getTime())) {
      return 'Format tanggal tidak valid';
    }
    
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Format waktu dengan pengecekan validitas
  const formatTime = (timeObj) => {
    if (!timeObj) {
      return 'Data tidak tersedia';
    }
    
    // Handle Firestore Timestamp format
    if (timeObj._seconds !== undefined) {
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
      return timeObj;
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

  // Format koordinat
  const formatKoordinat = (x, y) => {
    if (x === undefined || y === undefined) return '-';
    return `{${x}, ${y}}`;
  };

  // Export to Excel - Dikelompokkan berdasarkan kebun saja
  const exportToExcel = () => {
    // Prepare data for export - Data Lengkap
    const exportData = filteredReports.map(report => ({
      'ID': report.id,
      'Kebun': report.kebun || '-',
      'Afdeling': report.afdeling || '-',
      'Blok': report.blok || '-',
      'Tahun Tanam': report.tahuntanam || '-',
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
    
    // Create worksheet for Data Lengkap
    const wsData = XLSX.utils.json_to_sheet(exportData);
    
    // Set column widths for Data Lengkap
    const colWidths = [
      { wch: 15 }, // ID
      { wch: 10 }, // Kebun
      { wch: 10 }, // Afdeling
      { wch: 10 }, // Blok
      { wch: 12 }, // Tahun Tanam
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
    wsData['!cols'] = colWidths;
    
    // Add Data Lengkap worksheet to workbook
    XLSX.utils.book_append_sheet(wb, wsData, 'Data Lengkap');
    
    // Prepare data for Rekap per Kebun
    // Sort reports based on validKebunList order
    const sortedReports = [...filteredReports].sort((a, b) => {
      // Get index in validKebunList
      const indexA = validKebunList.findIndex(k => k.id === a.kebun);
      const indexB = validKebunList.findIndex(k => k.id === b.kebun);
      
      // Sort by kebun order
      return indexA - indexB;
    });
    
    // Create grouped data
    const groupedData = [];
    let currentKebun = null;
    
    // Add header for grouped data
    groupedData.push([
      'Kebun',
      'Tahun Tanam',
      'Blok',
      'ID',
      'Nomor PP',
      'Tanggal Laporan',
      'Waktu Laporan',
      'Cuaca',
      'Estimasi Serangga',
      'RBT (Kg/Tross)',
      'Koordinat',
      'Dibuat Oleh'
    ]);
    
    // Process sorted reports
    sortedReports.forEach(report => {
      // Check if we need to add a kebun header
      if (report.kebun !== currentKebun) {
        currentKebun = report.kebun;
        
        // Add kebun header row
        const kebunDetail = validKebunList.find(k => k.id === report.kebun);
        const kebunName = kebunDetail ? kebunDetail.name : report.kebun;
        groupedData.push([
          `KEBUN: ${kebunName} (${report.kebun})`,
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          ''
        ]);
      }
      
      // Add the actual report data
      groupedData.push([
        report.kebun || '-',
        report.tahuntanam || '-',
        report.blok || '-',
        report.id,
        report.nomorPP || '-',
        formatDate(report.tanggal),
        formatTime(report.waktu),
        report.kondisiCuaca || '-',
        report.estimasiSerangga || '-',
        report.rbt || '-',
        formatKoordinat(report.koordinatX, report.koordinatY),
        report.createdBy?.name || '-'
      ]);
      
      // Add empty row after each report for better readability
      groupedData.push([
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
      ]);
    });
    
    // Create worksheet for Rekap per Kebun
    const wsGrouped = XLSX.utils.aoa_to_sheet(groupedData);
    
    // Set column widths for Rekap per Kebun
    const colWidthsGrouped = [
      { wch: 20 }, // Kebun
      { wch: 15 }, // Tahun Tanam
      { wch: 10 }, // Blok
      { wch: 15 }, // ID
      { wch: 10 }, // Nomor PP
      { wch: 15 }, // Tanggal Laporan
      { wch: 10 }, // Waktu Laporan
      { wch: 15 }, // Cuaca
      { wch: 20 }, // Estimasi Serangga
      { wch: 15 }, // RBT
      { wch: 15 }, // Koordinat
      { wch: 20 }  // Dibuat Oleh
    ];
    wsGrouped['!cols'] = colWidthsGrouped;
    
    // Add Rekap per Kebun worksheet to workbook
    XLSX.utils.book_append_sheet(wb, wsGrouped, 'Rekap per Kebun');
    
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
      blok: '',
      dateRange: false,
      startDate: null,
      endDate: null,
      month: null,
      year: null
    });
    setSearchTerm('');
  };

  // Refresh data
  const refreshData = () => {
    fetchReports();
  };

  // Handle back to dashboard
  const handleBackToDashboard = () => {
    try {
      window.location.href = '/app/dashboard';
    } catch (err) {
      console.error('Navigation error:', err);
      showSnackbar('Gagal kembali ke dashboard', 'error');
    }
  };

  // Handle delete dialog
  const openDeleteDialog = (report) => {
    setReportToDelete(report);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setReportToDelete(null);
  };

  const handleDeleteReport = async () => {
    if (!reportToDelete) return;
    
    try {
      await reportService.deleteReport(reportToDelete.id);
      showSnackbar('Laporan berhasil dihapus', 'success');
      fetchReports(); // Refresh data
    } catch (err) {
      console.error('Error deleting report:', err);
      showSnackbar('Gagal menghapus laporan', 'error');
    } finally {
      closeDeleteDialog();
    }
  };

  // Handle view dialog
  const openViewDialog = (report) => {
    setReportToView(report);
    setViewDialogOpen(true);
  };

  const closeViewDialog = () => {
    setViewDialogOpen(false);
    setReportToView(null);
  };

  // Handle edit dialog
  const openEditDialog = (report) => {
    setReportToEdit(report);
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setReportToEdit(null);
  };

  const handleEditReport = async () => {
    if (!reportToEdit) return;
    
    try {
      await reportService.updateReport(reportToEdit.id, reportToEdit);
      showSnackbar('Laporan berhasil diperbarui', 'success');
      fetchReports(); // Refresh data
    } catch (err) {
      console.error('Error updating report:', err);
      showSnackbar('Gagal memperbarui laporan', 'error');
    } finally {
      closeEditDialog();
    }
  };

  // Handle edit form change
  const handleEditFormChange = (field, value) => {
    setReportToEdit(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Generate year options for filter
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i);

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
          
          {/* Date Filters */}
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" fontWeight="medium" mb={2} display="flex" alignItems="center">
            <DateRangeIcon sx={{ mr: 1 }} /> Filter Tanggal
          </Typography>
          
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={filter.dateRange}
                    onChange={(e) => handleFilterChange('dateRange', e.target.checked)}
                    color="primary"
                  />
                }
                label="Rentang Tanggal"
              />
            </Grid>
            
            {filter.dateRange && (
              <>
                <Grid size={{ xs: 12, md: 4 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={idLocale}>
                    <DatePicker
                      label="Tanggal Mulai"
                      value={filter.startDate}
                      onChange={(newValue) => handleFilterChange('startDate', newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          size="medium"
                          sx={{ borderRadius: 2 }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                
                <Grid size={{ xs: 12, md: 4 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={idLocale}>
                    <DatePicker
                      label="Tanggal Akhir"
                      value={filter.endDate}
                      onChange={(newValue) => handleFilterChange('endDate', newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          size="medium"
                          sx={{ borderRadius: 2 }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
              </>
            )}
            
            {!filter.dateRange && (
              <>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth size="medium">
                    <InputLabel id="month-label">Bulan</InputLabel>
                    <Select
                      labelId="month-label"
                      value={filter.month === null ? '' : filter.month}
                      onChange={(e) => handleFilterChange('month', e.target.value !== '' ? parseInt(e.target.value) : null)}
                      input={<OutlinedInput label="Bulan" />}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="">Semua Bulan</MenuItem>
                      {Array.from({ length: 12 }, (_, i) => (
                        <MenuItem key={i} value={i}>
                          {format(new Date(2000, i, 1), 'MMMM', { locale: idLocale })}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth size="medium">
                    <InputLabel id="year-label">Tahun</InputLabel>
                    <Select
                      labelId="year-label"
                      value={filter.year === null ? '' : filter.year}
                      onChange={(e) => handleFilterChange('year', e.target.value !== '' ? parseInt(e.target.value) : null)}
                      input={<OutlinedInput label="Tahun" />}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="">Semua Tahun</MenuItem>
                      {yearOptions.map(year => (
                        <MenuItem key={year} value={year}>{year}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
          </Grid>
          
          {/* Filter Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="text"
              color="primary"
              startIcon={<ClearIcon />}
              onClick={clearFilters}
              disabled={!searchTerm && !filter.kebun && !filter.afdeling && !filter.blok && !filter.dateRange && filter.month === null && filter.year === null}
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
                  <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Cuaca</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Serangga</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 2 }}>RBT</TableCell>
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
                        <TableCell sx={{ py: 2 }}>
                          <Chip 
                            label={report.kondisiCuaca || '-'} 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>{report.estimasiSerangga || '-'}</TableCell>
                        <TableCell sx={{ py: 2 }}>{report.rbt || '-'}</TableCell>
                        <TableCell sx={{ py: 2 }}>{report.createdBy?.name || '-'}</TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="Lihat Detail">
                              <IconButton 
                                onClick={() => openViewDialog(report)}
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
                            {/* <Tooltip title="Edit">
                              <IconButton 
                                onClick={() => openEditDialog(report)}
                                color="warning"
                                sx={{ 
                                  '&:hover': { 
                                    bgcolor: alpha(theme.palette.warning.main, 0.1) 
                                  } 
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip> */}
                            <Tooltip title="Hapus">
                              <IconButton 
                                onClick={() => openDeleteDialog(report)}
                                color="error"
                                sx={{ 
                                  '&:hover': { 
                                    bgcolor: alpha(theme.palette.error.main, 0.1) 
                                  } 
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={12} align="center" sx={{ py: 6 }}>
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Konfirmasi Hapus Laporan
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Apakah Anda yakin ingin menghapus laporan ini? Tindakan ini tidak dapat dibatalkan.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Batal
          </Button>
          <Button onClick={handleDeleteReport} color="error" autoFocus>
            Hapus
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Report Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={closeViewDialog}
        aria-labelledby="view-dialog-title"
        aria-describedby="view-dialog-description"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="view-dialog-title">
          Detail Laporan
        </DialogTitle>
        <DialogContent>
          {reportToView && (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="textSecondary">ID Laporan</Typography>
                <Typography variant="body1" gutterBottom>{reportToView.id}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="textSecondary">Nomor PP</Typography>
                <Typography variant="body1" gutterBottom>{reportToView.nomorPP || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="textSecondary">Kebun</Typography>
                <Typography variant="body1" gutterBottom>{reportToView.kebun || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="textSecondary">Afdeling</Typography>
                <Typography variant="body1" gutterBottom>{reportToView.afdeling || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="textSecondary">Blok</Typography>
                <Typography variant="body1" gutterBottom>{reportToView.blok || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="textSecondary">Tanggal Laporan</Typography>
                <Typography variant="body1" gutterBottom>{formatDate(reportToView.tanggal)}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="textSecondary">Waktu Laporan</Typography>
                <Typography variant="body1" gutterBottom>{formatTime(reportToView.waktu)}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="textSecondary">Kondisi Cuaca</Typography>
                <Typography variant="body1" gutterBottom>{reportToView.kondisiCuaca || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="textSecondary">Estimasi Serangga</Typography>
                <Typography variant="body1" gutterBottom>{reportToView.estimasiSerangga || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="textSecondary">RBT (Kg/Tross)</Typography>
                <Typography variant="body1" gutterBottom>{reportToView.rbt || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="textSecondary">Koordinat</Typography>
                <Typography variant="body1" gutterBottom>
                  {formatKoordinat(reportToView.koordinatX, reportToView.koordinatY)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="textSecondary">Dibuat Oleh</Typography>
                <Typography variant="body1" gutterBottom>{reportToView.createdBy?.name || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="textSecondary">Tanggal Dibuat</Typography>
                <Typography variant="body1" gutterBottom>{formatDate(reportToView.createdAt)}</Typography>
              </Grid>
              {reportToView.imageUrl && (
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="textSecondary">Gambar</Typography>
                  <Box sx={{ mt: 1, textAlign: 'center' }}>
                    <img 
                      src={reportToView.imageUrl} 
                      alt="Laporan" 
                      style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
                    />
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeViewDialog} color="primary">
            Tutup
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Report Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={closeEditDialog}
        aria-labelledby="edit-dialog-title"
        aria-describedby="edit-dialog-description"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="edit-dialog-title">
          Edit Laporan
        </DialogTitle>
        <DialogContent>
          {reportToEdit && (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Nomor PP"
                  value={reportToEdit.nomorPP || ''}
                  onChange={(e) => handleEditFormChange('nomorPP', e.target.value)}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Kebun"
                  value={reportToEdit.kebun || ''}
                  onChange={(e) => handleEditFormChange('kebun', e.target.value)}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Afdeling"
                  value={reportToEdit.afdeling || ''}
                  onChange={(e) => handleEditFormChange('afdeling', e.target.value)}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Blok"
                  value={reportToEdit.blok || ''}
                  onChange={(e) => handleEditFormChange('blok', e.target.value)}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={idLocale}>
                  <DatePicker
                    label="Tanggal Laporan"
                    value={reportToEdit.tanggal ? parseDate(reportToEdit.tanggal) : null}
                    onChange={(newValue) => handleEditFormChange('tanggal', newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        margin="normal"
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Waktu Laporan"
                  type="time"
                  value={reportToEdit.waktu || ''}
                  onChange={(e) => handleEditFormChange('waktu', e.target.value)}
                  variant="outlined"
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Kondisi Cuaca</InputLabel>
                  <Select
                    value={reportToEdit.kondisiCuaca || ''}
                    onChange={(e) => handleEditFormChange('kondisiCuaca', e.target.value)}
                    label="Kondisi Cuaca"
                  >
                    <MenuItem value="Cerah">Cerah</MenuItem>
                    <MenuItem value="Berawan">Berawan</MenuItem>
                    <MenuItem value="Hujan">Hujan</MenuItem>
                    <MenuItem value="Kabut">Kabut</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Estimasi Serangga"
                  value={reportToEdit.estimasiSerangga || ''}
                  onChange={(e) => handleEditFormChange('estimasiSerangga', e.target.value)}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="RBT (Kg/Tross)"
                  type="number"
                  value={reportToEdit.rbt || ''}
                  onChange={(e) => handleEditFormChange('rbt', e.target.value)}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Koordinat X"
                  type="number"
                  value={reportToEdit.koordinatX || ''}
                  onChange={(e) => handleEditFormChange('koordinatX', e.target.value)}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Koordinat Y"
                  type="number"
                  value={reportToEdit.koordinatY || ''}
                  onChange={(e) => handleEditFormChange('koordinatY', e.target.value)}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog} color="primary">
            Batal
          </Button>
          <Button onClick={handleEditReport} color="primary" autoFocus>
            Simpan Perubahan
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}