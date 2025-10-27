// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerAPI } from '../utils/api.js';
import { validKebunList } from '../utils/kebunList.js'; // Import daftar kebun

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [kebun, setKebun] = useState('');
  const navigate = useNavigate();

  // Fungsi validasi password sesuai backend
  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[-=+!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumber && hasSymbol,
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSymbol
    };
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Validasi password match
    if (password !== confirmPassword) {
      toast.error('Password dan konfirmasi password tidak cocok');
      return;
    }
    
    // Validasi kriteria password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      toast.error('Password tidak memenuhi kriteria keamanan');
      return;
    }
    
    if (!kebun) {
      toast.error('Silakan pilih kebun');
      return;
    }
    
    const res = await registerAPI({ email, username, password, kebun });
    if (res.error) {
      toast.error(res.message);
    } else {
      toast.success('Registrasi berhasil! Silakan login.');
      navigate('/login');
    }
  };

  // Dapatkan hasil validasi password
  const passwordValidation = validatePassword(password);
  
  // Fungsi untuk mengecek kecocokan password
  const isPasswordMatch = password === confirmPassword && password !== '';
  const isPasswordMismatch = password !== confirmPassword && confirmPassword !== '';

  // Logika untuk menampilkan indikator password secara bergantian
  const getPasswordIndicator = () => {
    if (password === '') return null;
    
    if (!passwordValidation.hasUpperCase) {
      return { text: 'Huruf besar (A-Z)', valid: false };
    } else if (!passwordValidation.hasSymbol) {
      return { text: 'Simbol (!@#$%^&*)', valid: false };
    } else if (!passwordValidation.minLength) {
      return { text: 'Minimal 8 karakter', valid: false };
    } else {
      return { text: 'Password kuat', valid: true };
    }
  };

  const passwordIndicator = getPasswordIndicator();

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow-lg w-96 flex flex-col space-y-4"
    >
      <h2 className="text-2xl font-bold text-center">Register Hatch & Carry</h2>
      <img 
        src="https://www.mendaftarkerja.com/wp-content/uploads/2024/09/IMG_3702.png" 
        style={{ width: '30%', height: '20%', margin: '0 auto' }} 
        alt="Logo"
      />
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
      <div className="flex flex-col">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        {/* Indikator kriteria password - hanya satu yang ditampilkan */}
        {passwordIndicator && (
          <div className="flex items-center text-sm mt-1">
            {passwordIndicator.valid ? (
              <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            )}
            <span className={passwordIndicator.valid ? "text-green-600" : "text-red-600"}>
              {passwordIndicator.text}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <input
          type="password"
          placeholder="Konfirmasi Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        {/* Indikator kecocokan password */}
        {isPasswordMatch && (
          <p className="text-green-600 text-sm mt-1 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Password cocok
          </p>
        )}
        {isPasswordMismatch && (
          <p className="text-red-600 text-sm mt-1 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Password tidak cocok
          </p>
        )}
      </div>
      <div className="relative">
        <select
          value={kebun}
          onChange={e => setKebun(e.target.value)}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
          required
        >
          <option value="">Pilih Kebun</option>
          {validKebunList.map(kebun => (
            <option key={kebun.id} value={kebun.id}>
              {kebun.name} ({kebun.regional})
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
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