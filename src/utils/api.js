const BASE_URL = 'http://localhost:3000/api/auth';

export async function registerAPI({ email, username, password }) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, password }),
  });
  return res.json();
}

export async function loginAPI({ email, password }) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

function authFetch(path, options = {}) {
  const token = localStorage.getItem('token');
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
      ...options.headers,
    },
  });
}

export async function getProfile() {
  const res = await authFetch('/profile', { method: 'GET' });
  return res.json();
}

export async function getAdmin() {
  const res = await authFetch('/admin', { method: 'GET' });
  return res.json();
}