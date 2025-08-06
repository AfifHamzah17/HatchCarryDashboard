// src/pages/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  const [userRole, setUserRole] = useState(null);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserRole(user.role);
      } catch {
        setUserRole(null);
      }
    }
  }, []);

  return (
    <nav
      className={`bg-white border-r p-4 space-y-2 transition-all duration-300
        ${isOpen ? 'w-64' : 'w-16 overflow-hidden'}
      `}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mb-4 p-2 rounded hover:bg-gray-200 focus:outline-none"
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      <Link
        to="dashboard"
        className="block px-3 py-2 rounded hover:bg-gray-100 whitespace-nowrap"
        title="Home"
      >
        {isOpen ? 'Home' : '🏠'}
      </Link>
      <Link
        to="map"
        className="block px-3 py-2 rounded hover:bg-gray-100 whitespace-nowrap"
        title="Peta Hatch & Carry"
      >
        {isOpen ? 'Peta Hatch & Carry' : '🗺️'}
      </Link>

      {userRole !== 'admin' && (
        <>
          <Link
            to="admin/users"
            className="block px-3 py-2 rounded hover:bg-gray-100 whitespace-nowrap"
            title="User Management"
          >
            {isOpen ? 'User Management' : '👥'}
          </Link>
          <Link
            to="admin"
            className="block px-3 py-2 rounded hover:bg-gray-100 whitespace-nowrap"
            title="Admin Panel"
          >
            {isOpen ? 'Admin Panel' : '⚙️'}
          </Link>
        </>
      )}

      <Link
        to="profile"
        className="block px-3 py-2 rounded hover:bg-gray-100 whitespace-nowrap"
        title="Profile"
      >
        {isOpen ? 'Profile' : '🙍'}
      </Link>
    </nav>
  );
}