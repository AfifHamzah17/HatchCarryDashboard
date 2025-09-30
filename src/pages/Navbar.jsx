// src/pages/Navbar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactModal from 'react-modal';

// Set root element untuk modal (penting untuk aksesibilitas)
ReactModal.setAppElement('#root');

export default function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const handleLogout = () => {
    // Hapus token dan data user dari localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect ke halaman login
    navigate('/', { replace: true });
    
    // Refresh halaman untuk memastikan semua state direset
    window.location.reload();
  };

  const openLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  // Custom styles untuk modal
  const customModalStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.5)', // Efek glass dengan transparansi
      backdropFilter: 'blur(5px)', // Efek blur untuk glassmorphism
      WebkitBackdropFilter: 'blur(5px)', // Untuk Safari
      zIndex: 9999, // Z-index sangat tinggi
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      position: 'relative',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      maxWidth: '500px',
      width: '90%',
      padding: '30px',
      inset: 'auto', // Override posisi default
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-1000 bg-white border-b px-6 py-4 flex justify-between items-center shadow">
        <a href="/">
          <div className="text-2xl font-bold text-green-600">HatchCarry</div>
        </a>
        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <li>
            <a href="/" className="hover:text-green-600 transition">Dashboard</a>
          </li>
          <li>
            <a href="/map" className="hover:text-green-600 transition">Peta</a>
          </li>
          <li>
            <a href="/profile" className="hover:text-green-600 transition">Profil</a>
          </li>
          <li>
            <button onClick={openLogoutModal} className="hover:text-red-600 transition">
              Logout
            </button>
          </li>
        </ul>
        {/* Burger icon (mobile only) */}
        <div className="md:hidden flex items-center space-x-4">
          <button
            className="text-xl text-gray-600"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            ☰
          </button>
          <button
            onClick={openLogoutModal}
            className="text-gray-600 hover:text-red-600"
            aria-label="Logout"
          >
            ⎋
          </button>
        </div>
      </nav>

      {/* Modal Konfirmasi Logout */}
      <ReactModal
        isOpen={showLogoutModal}
        onRequestClose={closeLogoutModal}
        contentLabel="Konfirmasi Logout"
        style={customModalStyles}
        closeTimeoutMS={300} // Animasi transisi
      >
        <div style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#2d3748',
          marginBottom: '1rem'
        }}>
          Konfirmasi Logout
        </div>
        <p style={{
          color: '#4a5568',
          marginBottom: '1.5rem'
        }}>
          Apakah Anda yakin ingin keluar dari akun Anda?
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.75rem'
        }}>
          <button
            onClick={closeLogoutModal}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #e2e8f0',
              borderRadius: '0.375rem',
              backgroundColor: 'white',
              color: '#4a5568',
              fontWeight: '500',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f7fafc'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
          >
            Batal
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '0.375rem',
              backgroundColor: '#e53e3e',
              color: 'white',
              fontWeight: '500',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#c53030'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#e53e3e'}
          >
            Ya, Logout
          </button>
        </div>
      </ReactModal>
    </>
  );
}