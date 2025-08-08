// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

export default function App() {
  const location = useLocation();

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/login"
            element={
              <PageWrapper>
                <LoginPage />
              </PageWrapper>
            }
          />
          <Route
            path="/register"
            element={
              <PageWrapper>
                <RegisterPage />
              </PageWrapper>
            }
          />
<Route path="/app" element={<DashboardLayout />}>
  {/* Protected admin routes dibungkus AdminRoute */}
  <Route index element={<DashboardMenu />} />
  <Route path="dashboard" element={<DashboardMenu />} />
  <Route path="map" element={<MapView />} />
  <Route path="profile" element={<ProfilePage />} />
  <Route path="gallery" element={<GalleryPage />} />

  {/* Admin-only routes */}
  <Route element={<AdminRoute />}>
    <Route path="admin" element={<AdminPanel />} />
    <Route path="admin/users" element={<UserManagement />} />
  </Route>
</Route>
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
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