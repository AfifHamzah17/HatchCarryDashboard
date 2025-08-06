// src/pages/DashboardLayout.jsx
import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Navbar from './navbar.jsx';

export default function DashboardLayout() {
  const [userRole, setUserRole] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const heightSidebar = 'h-auto md:h-[calc(100vh-64px)]';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={toggleSidebar} />

      <div className="flex flex-col md:flex-row pt-16">
        <aside
          className={`bg-white border-b md:border-r w-full md:w-64 p-4 space-y-2 overflow-auto transition-all duration-300 ${
            sidebarOpen ? 'block' : 'hidden'
          } md:block ${heightSidebar}`}
        >
          <Link to="dashboard" className="block px-3 py-2 rounded hover:bg-gray-100">
            Home
          </Link>
          <Link to="map" className="block px-3 py-2 rounded hover:bg-gray-100">
            Peta Hatch &amp; Carry
          </Link>
          {userRole === 'admin' && (
            <>
              <Link to="admin/users" className="block px-3 py-2 rounded hover:bg-gray-100">
                User Management
              </Link>
              <Link to="admin" className="block px-3 py-2 rounded hover:bg-gray-100">
                Admin Panel
              </Link>
            </>
          )}
          <Link to="profile" className="block px-3 py-2 rounded hover:bg-gray-100">
            Profile
          </Link>
        </aside>

        <main className="flex-1 p-4 overflow-auto" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}