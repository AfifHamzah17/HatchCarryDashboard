import React from 'react';
import CustomImageList from '../components/CustomImageList'; // pastikan path sesuai

export default function GalleryPage() {
  return (
      <div>
      {/* Membuat jarak setelah navbar */}
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Gallery</h1>
      <div className="flex justify-center w-full px-4 md:px-8">
        <div className="flex-1 h-full relative">
          <CustomImageList />
        </div>
      </div>
    </div>
  );
}