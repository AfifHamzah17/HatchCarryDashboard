// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AnimatePresence, motion } from 'framer-motion';
import LoginPage from './pages/LoginPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AdminRoute from './pages/AdminRoute.jsx';
import DashboardLayout from './pages/DashboardLayout.jsx';
import DashboardMenu from './pages/DashboardMenu.jsx';
import MapView from './pages/MapView.jsx';
import UserManagement from './pages/UserManagement.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import GalleryPage from './pages/GaleryPage.jsx';
import TimelinePage from './pages/TimelinePage.jsx';
import PostDetailPage from './pages/PostDetailPage.jsx';
import SubmitReportPage from './pages/SubmitReportPage.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

export default function App() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cek autentikasi saat aplikasi dimuat
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };
    
    checkAuth();
    
    // Tambahkan event listener untuk perubahan storage
    const handleStorageChange = () => checkAuth();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/app" replace />
              ) : (
                <PageWrapper>
                  <LoginPage setIsAuthenticated={setIsAuthenticated} />
                </PageWrapper>
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/app" replace />
              ) : (
                <PageWrapper>
                  <RegisterPage />
                </PageWrapper>
              )
            }
          />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/app" element={<DashboardLayout />}>
              <Route index element={<DashboardMenu />} />
              <Route path="dashboard" element={<DashboardMenu />} />
              <Route path="map" element={<MapView />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="timeline" element={<TimelinePage />} />
              <Route path="timeline/:UID" element={<PostDetailPage />} />
              <Route path="report/submit" element={<SubmitReportPage />} />
              
              {/* Admin-only routes */}
              <Route element={<AdminRoute />}>
                <Route path="admin" element={<AdminPanel />} />
                <Route path="admin/users" element={<UserManagement />} />
              </Route>
            </Route>
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  );
}

// ProtectedRoute component
function ProtectedRoute({ isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="h-screen w-full flex items-center justify-center bg-gray-50"
    >
      {children}
    </motion.div>
  );
}