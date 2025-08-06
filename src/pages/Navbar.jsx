// src/pages/Navbar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b px-6 py-4 flex justify-between items-center shadow">
      <div className="text-2xl font-bold text-green-600">HatchCarry</div>

      <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
        <li>
          <a href="/app/dashboard" className="hover:text-green-600 transition">Dashboard</a>
        </li>
        <li>
          <a href="/app/map" className="hover:text-green-600 transition">Peta</a>
        </li>
        <li>
          <a href="/app/profile" className="hover:text-green-600 transition">Profil</a>
        </li>
        <li>
          <button onClick={handleLogout} className="hover:text-red-600 transition">
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
          onClick={handleLogout}
          className="text-gray-600 hover:text-red-600"
          aria-label="Logout"
        >
          ⎋
        </button>
      </div>
    </nav>
  );
}