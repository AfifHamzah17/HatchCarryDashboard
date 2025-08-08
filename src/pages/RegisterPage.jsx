// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerAPI } from '../utils/api.js';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await registerAPI({ email, username, password });
    if (res.error) {
      toast.error(res.message);
    } else {
      toast.success('Registrasi berhasil! Silakan login.');
      navigate('/login');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow-lg w-96 flex flex-col space-y-4"
    >
      <h2 className="text-2xl font-bold text-center">Register Hatch & Carry</h2>
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
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
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
        Daftar
      </button>
      <p className="text-sm text-center">
        Sudah punya akun?{' '}
        <Link to="/login" className="text-green-600 hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}