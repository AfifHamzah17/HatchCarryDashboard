const BASE_API = 'https://ptpn4-n4r1-307703218179.asia-southeast2.run.app/api';
// const BASE_API = 'http://localhost:8080/api';

function authFetch(path, options = {}) {
  const token = localStorage.getItem('token');
  return fetch(`${BASE_API}${path}`, {
    ...options,
    headers: {
      // Jangan set 'Content-Type' kalau body-nya FormData (uploadAvatar)
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      Authorization: token ? `Bearer ${token}` : '',
      ...options.headers,
    },
  });
}

// Auth API
export async function registerAPI({ email, username, password, kebun }) {
  const res = await fetch(`${BASE_API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, password, kebun }),
  });
  return res.json();
}

export async function loginAPI({ identifier, password }) {
  const res = await fetch(`${BASE_API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });
  return res.json();
}

// Profile API
export async function getProfile() {
  const res = await authFetch('/profile', { method: 'GET' });
  return res.json();
}

export async function uploadAvatar(file) {
  const form = new FormData();
  form.append('avatar', file);
  const res = await fetch(`${BASE_API}/profile/avatar`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      // Jangan set Content-Type karena formData otomatis set headernya
    },
    body: form,
  });
  return res.json();
}

// Admin API (example)
export async function getAdmin() {
  const res = await authFetch('/admin', { method: 'GET' });
  return res.json();
}

// User Management API
export async function fetchUsers() {
  const res = await authFetch('/users', { method: 'GET' });
  return res.json();
}

export async function createUserAPI(user) {
  const res = await authFetch('/users', {
    method: 'POST',
    body: JSON.stringify(user),
  });
  return res.json();
}

export async function updateUserAPI(email, updates) {
  const res = await authFetch(`/users/${encodeURIComponent(email)}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  return res.json();
}

export async function deleteUserAPI(email) {
  const res = await authFetch(`/users/${encodeURIComponent(email)}`, {
    method: 'DELETE',
  });
  return res.json();
}