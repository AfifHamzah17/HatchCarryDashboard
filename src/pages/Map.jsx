// src/pages/Map.jsx
import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  useTheme,
  alpha,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Fab,
  Drawer,
  AppBar,
  Toolbar,
  Slide,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
  CalendarToday as CalendarIcon,
  DateRange as DateRangeIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Place as PlaceIcon,
  FlightTakeoff as FlightIcon,
  MyLocation as MyLocationIcon,
  List as ListIcon,
  Close as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import reportService from '../services/reportService';

// Atur ikon marker Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Komponen untuk mengatur peta ketika data berubah
function FlyTo({ position, zoom = 15 }) {
  const map = useMap();
  useEffect(() => {
    if (position && map) {
      map.flyTo(position, zoom, { duration: 1.5 });
    }
  }, [position, zoom, map]);
  return null;
}

// Komponen untuk menyesuaikan ukuran peta
function MapResizer({ shouldResize }) {
  const map = useMap();
  useEffect(() => {
    if (shouldResize) {
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    }
  }, [shouldResize, map]);
  return null;
}

export default function MapView() {
  const theme = useTheme();
  const mapRef = useRef(null);
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showList, setShowList] = useState(false);
  const [flyToPosition, setFlyToPosition] = useState(null);
  const [filter, setFilter] = useState({
    kebun: '',
    afdeling: '',
    blok: '',
    dateRange: false,
    startDate: null,
    endDate: null,
    month: null,
    year: null,
    showRadius: true,
  });
  const [filterOptions, setFilterOptions] = useState({
    kebun: [],
    afdeling: [],
    blok: []
  });
  const [mapCenter, setMapCenter] = useState([4.76, 97.76]); // Default center
  const [mapZoom, setMapZoom] = useState(10);
  const [selectedReport, setSelectedReport] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [expandedKebun, setExpandedKebun] = useState({});

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
      
      // Set map center to first report with coordinates if available
      const reportWithCoords = reportsData.find(r => r.koordinatX && r.koordinatY);
      if (reportWithCoords) {
        setMapCenter([parseFloat(reportWithCoords.koordinatY), parseFloat(reportWithCoords.koordinatX)]);
      }
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
  }, [searchTerm, filter, reports]);

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
      year: null,
      showRadius: true,
    });
    setSearchTerm('');
  };

  // Refresh data
  const refreshData = () => {
    fetchReports();
  };

  // Handle marker click
  const handleMarkerClick = (report) => {
    setSelectedReport(report);
    setDetailDialogOpen(true);
  };

  // Close detail dialog
  const closeDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedReport(null);
  };

  // Handle list item click (fly to position)
  const handleListItemClick = (report) => {
    if (report.koordinatX && report.koordinatY) {
      setFlyToPosition([parseFloat(report.koordinatY), parseFloat(report.koordinatX)]);
      setSelectedReport(report);
      setShowList(false); // Close drawer after selection
    }
  };

  // Toggle accordion for kebun
  const toggleKebunAccordion = (kebun) => {
    setExpandedKebun(prev => ({
      ...prev,
      [kebun]: !prev[kebun]
    }));
  };

  // Generate year options for filter
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i);

  // Group reports by kebun, afdeling, and blok
  const groupedReports = useMemo(() => {
    const result = {};
    
    filteredReports
      .filter(report => report.koordinatX && report.koordinatY)
      .forEach(report => {
        const kebun = report.kebun || 'Tidak Diketahui';
        const afdeling = report.afdeling || 'Tidak Diketahui';
        const blok = report.blok || 'Tidak Diketahui';
        
        if (!result[kebun]) {
          result[kebun] = {};
        }
        
        if (!result[kebun][afdeling]) {
          result[kebun][afdeling] = {};
        }
        
        if (!result[kebun][afdeling][blok]) {
          result[kebun][afdeling][blok] = [];
        }
        
        result[kebun][afdeling][blok].push(report);
      });
    
    return result;
  }, [filteredReports]);

  // Calculate map bounds based on filtered reports
  const calculateMapBounds = () => {
    if (filteredReports.length === 0) return null;
    
    const validReports = filteredReports.filter(r => r.koordinatX && r.koordinatY);
    if (validReports.length === 0) return null;
    
    const lats = validReports.map(r => parseFloat(r.koordinatY));
    const lngs = validReports.map(r => parseFloat(r.koordinatX));
    
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    return [[minLat, minLng], [maxLat, maxLng]];
  };

  // Fit map to bounds when filtered reports change
  useEffect(() => {
    if (mapRef.current && filteredReports.length > 0) {
      const bounds = calculateMapBounds();
      if (bounds) {
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [filteredReports]);

  return (
    <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.02), minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
          Peta Persebaran Laporan
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
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
            startIcon={<FilterIcon />}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Sembunyikan Filter' : 'Tampilkan Filter'}
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filters Panel */}
      {showFilters && (
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
              <FilterIcon sx={{ mr: 1 }} /> Filter Data
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
              
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={filter.showRadius}
                      onChange={(e) => handleFilterChange('showRadius', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Tampilkan Radius 200m"
                />
              </Grid>
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
      )}

      {/* Results Summary */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body1" color="textSecondary">
          Menampilkan <strong>{filteredReports.length}</strong> laporan dari total <strong>{reports.length}</strong> laporan
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Radius 200m menunjukkan jangkauan terbang serangga
        </Typography>
      </Box>

      {/* Map Container */}
      <Card 
        sx={{ 
          borderRadius: 2,
          boxShadow: theme.shadows[3],
          overflow: 'hidden',
          height: '70vh',
          position: 'relative'
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) : (
          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            className="h-full w-full"
            whenCreated={mapInstance => mapRef.current = mapInstance}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <FlyTo position={flyToPosition} />
            <MapResizer shouldResize={showFilters} />
            
            {/* Markers and Circles for each report */}
            {filteredReports
              .filter(report => report.koordinatX && report.koordinatY)
              .map((report) => (
                <div key={report.id}>
                  <Marker 
                    position={[parseFloat(report.koordinatY), parseFloat(report.koordinatX)]}
                    eventHandlers={{
                      click: () => handleMarkerClick(report),
                    }}
                  >
                    <Popup>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {report.kebun} - {report.afdeling} - {report.blok}
                      </Typography>
                      <Typography variant="body2">
                        Nomor PP: {report.nomorPP || '-'}
                      </Typography>
                      <Typography variant="body2">
                        Tanggal: {formatDate(report.tanggal)}
                      </Typography>
                      <Typography variant="body2">
                        Waktu: {formatTime(report.waktu)}
                      </Typography>
                      <Button 
                        size="small" 
                        variant="contained" 
                        onClick={() => handleMarkerClick(report)}
                        sx={{ mt: 1 }}
                      >
                        Lihat Detail
                      </Button>
                    </Popup>
                  </Marker>
                  
                  {/* Circle with 200m radius */}
                  {filter.showRadius && (
                    <Circle
                      center={[parseFloat(report.koordinatY), parseFloat(report.koordinatX)]}
                      radius={200} // 200 meters
                      pathOptions={{
                        color: theme.palette.primary.main,
                        fillColor: theme.palette.primary.main,
                        fillOpacity: 0.2,
                        weight: 2,
                      }}
                    />
                  )}
                </div>
              ))}
          </MapContainer>
        )}
        
        {/* Floating Action Button for List */}
        <Fab
          color="primary"
          aria-label="list"
          sx={{
            position: 'absolute',
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
          onClick={() => setShowList(true)}
        >
          <ListIcon />
        </Fab>
      </Card>

      {/* Drawer for List */}
      <Drawer
        anchor="right"
        open={showList}
        onClose={() => setShowList(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 400 },
            maxWidth: '100%',
          },
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <AppBar position="static" sx={{ boxShadow: 'none' }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setShowList(false)}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Daftar Titik Laporan
              </Typography>
              <Badge 
                badgeContent={filteredReports.filter(r => r.koordinatX && r.koordinatY).length} 
                color="secondary"
              >
                <PlaceIcon />
              </Badge>
            </Toolbar>
          </AppBar>
          
          <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
            {Object.entries(groupedReports).length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  Tidak ada data titik laporan
                </Typography>
              </Box>
            ) : (
              <List>
                {Object.entries(groupedReports).map(([kebun, afdelings]) => (
                  <div key={kebun}>
                    <Accordion 
                      expanded={!!expandedKebun[kebun]} 
                      onChange={() => toggleKebunAccordion(kebun)}
                      disableGutters
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography fontWeight="bold">Kebun {kebun}</Typography>
                        <Badge 
                          badgeContent={Object.values(afdelings).reduce((sum, afd) => 
                            sum + Object.values(afd).reduce((bSum, bloks) => bSum + bloks.length, 0), 0
                          )} 
                          color="primary"
                          sx={{ ml: 1 }}
                        >
                          <PlaceIcon />
                        </Badge>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 0 }}>
                        <List disablePadding>
                          {Object.entries(afdelings).map(([afdeling, bloks]) => (
                            <div key={`${kebun}-${afdeling}`}>
                              <ListItem sx={{ pl: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                                <ListItemText 
                                  primary={
                                    <Typography fontWeight="medium">
                                      {afdeling}
                                    </Typography>
                                  }
                                  secondary={
                                    <Typography variant="body2" color="text.secondary">
                                      {Object.values(bloks).reduce((sum, b) => sum + b.length, 0)} laporan
                                    </Typography>
                                  }
                                />
                              </ListItem>
                              <List disablePadding>
                                {Object.entries(bloks).map(([blok, reports]) => (
                                  <div key={`${kebun}-${afdeling}-${blok}`}>
                                    <ListItem sx={{ pl: 4 }}>
                                      <ListItemText 
                                        primary={
                                          <Typography variant="body2">
                                            Blok {blok}
                                          </Typography>
                                        }
                                        secondary={
                                          <Typography variant="caption" color="text.secondary">
                                            {reports.length} laporan
                                          </Typography>
                                        }
                                      />
                                    </ListItem>
                                    <List disablePadding>
                                      {reports.map((report) => (
                                        <ListItemButton 
                                          key={report.id} 
                                          sx={{ pl: 6 }}
                                          selected={selectedReport?.id === report.id}
                                          onClick={() => handleListItemClick(report)}
                                        >
                                          <ListItemAvatar>
                                            <Avatar sx={{ 
                                              width: 32, 
                                              height: 32,
                                              bgcolor: selectedReport?.id === report.id ? 'primary.main' : 'grey.300'
                                            }}>
                                              <PlaceIcon fontSize="small" />
                                            </Avatar>
                                          </ListItemAvatar>
                                          <ListItemText 
                                            primary={
                                              <Typography variant="body2" noWrap>
                                                No PP. {report.nomorPP || `Laporan ${report.id.substring(0, 6)}`}
                                              </Typography>
                                            }
                                            secondary={
                                              <Typography variant="caption" noWrap>
                                                {formatDate(report.tanggal)} • {formatTime(report.waktu)}
                                              </Typography>
                                            }
                                          />
                                          <Tooltip title="Lihat Detail">
                                            <IconButton 
                                              edge="end" 
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleMarkerClick(report);
                                              }}
                                            >
                                              <InfoIcon fontSize="small" />
                                            </IconButton>
                                          </Tooltip>
                                        </ListItemButton>
                                      ))}
                                    </List>
                                  </div>
                                ))}
                              </List>
                            </div>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  </div>
                ))}
              </List>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Detail Report Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={closeDetailDialog}
        aria-labelledby="detail-dialog-title"
        aria-describedby="detail-dialog-description"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="detail-dialog-title">
          Detail Laporan
        </DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="textSecondary">Kebun</Typography>
                <Typography variant="body1" gutterBottom>{selectedReport.kebun || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="textSecondary">Afdeling</Typography>
                <Typography variant="body1" gutterBottom>{selectedReport.afdeling || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="textSecondary">Blok</Typography>
                <Typography variant="body1" gutterBottom>{selectedReport.blok || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="textSecondary">Nomor PP</Typography>
                <Typography variant="body1" gutterBottom>{selectedReport.nomorPP || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="textSecondary">Tanggal</Typography>
                <Typography variant="body1" gutterBottom>{formatDate(selectedReport.tanggal)}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="textSecondary">Waktu</Typography>
                <Typography variant="body1" gutterBottom>{formatTime(selectedReport.waktu)}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="textSecondary">Longitude (X)</Typography>
                <Typography variant="body1" gutterBottom>{selectedReport.koordinatX || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="textSecondary">Latitude (Y)</Typography>
                <Typography variant="body1" gutterBottom>{selectedReport.koordinatY || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="textSecondary">Kondisi Cuaca</Typography>
                <Typography variant="body1" gutterBottom>{selectedReport.kondisiCuaca || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="textSecondary">Estimasi Jlh Serangga</Typography>
                <Typography variant="body1" gutterBottom>{selectedReport.estimasiSerangga || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="textSecondary">RBT saat ini (Kg/Tross)</Typography>
                <Typography variant="body1" gutterBottom>{selectedReport.rbt || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="textSecondary">Dibuat Oleh</Typography>
                <Typography variant="body1" gutterBottom>{selectedReport.createdBy?.name || '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="textSecondary">Tanggal Dibuat</Typography>
                <Typography variant="body1" gutterBottom>{formatDate(selectedReport.createdAt)}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="textSecondary">Waktu Dibuat</Typography>
                <Typography variant="body1" gutterBottom>{formatTime(selectedReport.createdAt)}</Typography>
              </Grid>
              {selectedReport.updatedAt && (
                <>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="textSecondary">Tanggal Diperbarui</Typography>
                    <Typography variant="body1" gutterBottom>{formatDate(selectedReport.updatedAt)}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="textSecondary">Waktu Diperbarui</Typography>
                    <Typography variant="body1" gutterBottom>{formatTime(selectedReport.updatedAt)}</Typography>
                  </Grid>
                </>
              )}
              {selectedReport.imageUrl && (
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="textSecondary">Gambar</Typography>
                  <Box sx={{ mt: 1, textAlign: 'center' }}>
                    <img 
                      src={selectedReport.imageUrl} 
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
          <Button onClick={closeDetailDialog} color="primary">
            Tutup
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