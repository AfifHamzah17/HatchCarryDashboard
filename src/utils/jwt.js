// src/utils/jwt.js
export function parseJwt(token) {
  // Pastikan token adalah string
  if (!token || typeof token !== 'string') {
    console.error('Token tidak valid atau bukan string:', token);
    return null;
  }
  
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      console.error('Format token tidak valid');
      return null;
    }
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
}