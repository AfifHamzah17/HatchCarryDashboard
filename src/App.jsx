import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AnimatePresence, motion } from 'framer-motion';

import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardLayout from './pages/DashboardLayout.jsx';
import MapView from './pages/MapView.jsx';
// import AdminPanel from './pages/AdminPanel.jsx';

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
            <Route index element={<Navigate to="map" replace />} />
            <Route path="map" element={<MapView />} />
            {/* <Route path="admin" element={<AdminPanel />} /> */}
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

// Wrapper component for page transitions
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