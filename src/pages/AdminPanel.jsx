import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminPanel() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <Link
        to="users"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Manage Users
      </Link>
    </div>
  );
}