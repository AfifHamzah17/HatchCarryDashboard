// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { getProfile, uploadAvatar } from '../utils/api.js';
import { toast } from 'react-toastify';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await getProfile();
        console.log('Profile response:', response);
        
        if (!response.error) {
          setProfile(response.data);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Gagal memuat profil');
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = e => {
    const f = e.target.files[0];
    if (f) {
      setPreview(URL.createObjectURL(f));
      setFile(f);
    }
  };

  const handleUpload = async () => {
    if (!file) return toast.error('Pilih file dulu');
    
    try {
      const response = await uploadAvatar(file);
      
      if (response.error) {
        toast.error(response.message);
      } else {
        toast.success(response.message);
        setProfile(p => ({ ...p, avatarUrl: response.data.avatarUrl }));
        setPreview(null);
        setFile(null);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Gagal mengunggah avatar');
    }
  };

  // Debug log untuk melihat struktur data
  useEffect(() => {
    if (profile) {
      console.log('Profile data:', profile);
      console.log('Kebun data:', profile.kebun);
    }
  }, [profile]);

  if (!profile) return <div className="text-center">Memuat profil…</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow flex flex-col items-center space-y-6">
      <h1 className="text-2xl font-bold text-center">Profil Saya</h1>
      <img
        src={preview || profile.avatarUrl || '/default-avatar.png'}
        alt="Avatar"
        className="w-32 h-32 rounded-full object-cover mx-auto"
      />
      <div className="flex flex-col items-center space-y-2 w-full">
        {/* Menampilkan informasi user*/}
        {profile.kebun ? (
          <div className="mt-2 p-3 bg-green-50 rounded-lg w-full">
            <p className="font-semibold text-green-800 mb-2">Informasi Kebun</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-sm text-gray-600">Email:</span>
                <p className="text-green-700 font-medium">{profile.email}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Username:</span>
                <p className="text-green-700 font-medium">{profile.username}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Role:</span>
                <p className="text-green-700 font-medium">{profile.role}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">ID Kebun:</span>
                <p className="text-green-700 font-medium">{profile.kebun.id}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Nama Kebun:</span>
                <p className="text-green-700 font-medium">{profile.kebun.name}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Regional Kebun:</span>
                <p className="text-green-700 font-medium">{profile.kebun.regional}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-2 p-3 bg-yellow-50 rounded-lg w-full text-center">
            <p className="text-yellow-700">Informasi kebun tidak tersedia</p>
          </div>
        )}
      </div>
      
      <div className="space-y-2 flex flex-col items-center w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ganti Avatar
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-green-50 file:text-green-700
            hover:file:bg-green-100
          "
        />
        {preview && (
          <button
            onClick={handleUpload}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Upload Avatar
          </button>
        )}
      </div>
    </div>
  );
}