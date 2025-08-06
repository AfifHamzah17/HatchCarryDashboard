// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginAPI } from '../utils/api.js';
import { parseJwt } from '../utils/jwt.js';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await loginAPI({ email, password });
    if (res.error) {
      toast.error(res.message);
    } else {
      // Simpan token ke localStorage
      localStorage.setItem('token', res.data.token);

      // Decode token untuk dapat user info
      const userData = parseJwt(res.data.token);

      if (userData) {
        // Simpan user info yang diambil dari token (email, role, dsb)
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        // Jika decode gagal, hapus token dan beri peringatan
        localStorage.removeItem('token');
        toast.error('Token tidak valid, login gagal.');
        return;
      }

      toast.success('Login berhasil!');
      navigate('/app/dashboard');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow-lg w-96 flex flex-col space-y-4"
    >
      <h2 className="text-2xl font-bold text-center">Login Hatch & Carry</h2>
      <img src="https://www.mendaftarkerja.com/wp-content/uploads/2024/09/IMG_3702.png" style={{ width: '30%', height: '20%', margin: '0 auto' }} />
      <br />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        required
      />
      <button
        type="submit"
        className="bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
      >
        Masuk
      </button>
      <p className="text-sm text-center">
        Belum punya akun?{' '}
        <Link to="/register" className="text-green-600 hover:underline">
          Register
        </Link>
      </p>
    </form>
  );
}