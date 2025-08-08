// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { getProfile, uploadAvatar } from '../utils/api.js';
import { toast } from 'react-toastify';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    getProfile().then(r => {
      if (!r.error) setProfile(r.data);
      else toast.error(r.message);
    });
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
    const r = await uploadAvatar(file);
    if (r.error) toast.error(r.message);
    else {
      toast.success(r.message);
      setProfile(p => ({ ...p, avatarUrl: r.data.avatarUrl }));
      setPreview(null);
      setFile(null);
    }
  };

  if (!profile) return <div className="text-center">Memuat profil…</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow flex flex-col items-center space-y-6">
      <h1 className="text-2xl font-bold text-center">Profil Saya</h1>
      <img
        src={preview || profile.avatarUrl || '/default-avatar.png'}
        alt="Avatar"
        className="w-32 h-32 rounded-full object-cover mx-auto"
      />
      <div className="flex flex-col items-center">
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Role:</strong> {profile.role}</p>
      </div>
      <div className="space-y-2 flex flex-col items-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
        />
        {preview && (
          <button
            onClick={handleUpload}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Upload Avatar
          </button>
        )}
      </div>
    </div>
  );
}
