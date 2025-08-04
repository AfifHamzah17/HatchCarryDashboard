// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginAPI } from '../utils/api.js';

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
      localStorage.setItem('token', res.data.token);
      toast.success('Login berhasil!');
      navigate('/app');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow-lg w-96 flex flex-col space-y-4"
    >
      <h2 className="text-2xl font-bold text-center">Login</h2>
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