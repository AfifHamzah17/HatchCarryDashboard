import React from 'react';

export default function DashboardMenu({ onSelectFeature }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-6">Pilih Fitur</h2>
      <button
        onClick={() => onSelectFeature('map')}
        className="mb-4 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Peta Hatch & Carry
      </button>
      <button
        onClick={() => onSelectFeature('admin')}
        className="px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        Admin Panel
      </button>
    </div>
  );
}