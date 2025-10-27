// src/services/reportService.js
import axios from 'axios';
//jika api sudah ke google cloud run
const API_URL = import.meta.env.VITE_API_URL || 'https://ptpn4-n4r1-307703218179.asia-southeast2.run.app/api';
//jika api masih develop
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Helper untuk mendapatkan header dengan token autentikasi
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`
  };
};

// Helper untuk menyiapkan FormData dengan benar
const prepareFormData = (data, file = null) => {
  const formData = new FormData();
  
  // Append semua data dari objek
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    
    // Handle objek (seperti createdBy) dengan konversi ke JSON string
    if (typeof value === 'object' && !(value instanceof File)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });
  
  // Append file jika ada
  if (file) {
    formData.append('image', file);
  }
  
  return formData;
};

const reportService = {
  // Get all reports
  getReports: async (limit = 28) => {
    try {
      const response = await axios.get(`${API_URL}/reports`, {
        params: { limit },
        headers: getAuthHeaders()
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  },

  // Get report by ID
  getReportById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/reports/${id}`, {
        headers: getAuthHeaders()
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching report:', error);
      throw error;
    }
  },

  // Create report with base64 image
  createReport: async (reportData) => {
    try {
      const response = await axios.post(`${API_URL}/reports`, reportData, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  },

  // Create report with form-data (for file upload)
  createReportWithFile: async (reportData, imageFile) => {
    try {
      const formData = prepareFormData(reportData, imageFile);
      
      const response = await axios.post(`${API_URL}/reports/upload`, formData, {
        headers: {
          // Jangan set Content-Type untuk FormData, browser akan menanganinya
          ...getAuthHeaders()
        }
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Error creating report with file:', error);
      throw error;
    }
  },

  // Update report
  updateReport: async (id, reportData) => {
    try {
      const response = await axios.put(`${API_URL}/reports/${id}`, reportData, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Error updating report:', error);
      throw error;
    }
  },

  // Update report with file
  updateReportWithFile: async (id, reportData, imageFile) => {
    try {
      const formData = prepareFormData(reportData, imageFile);
      
      const response = await axios.put(`${API_URL}/reports/${id}`, formData, {
        headers: {
          // Jangan set Content-Type untuk FormData, browser akan menanganinya
          ...getAuthHeaders()
        }
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Error updating report with file:', error);
      throw error;
    }
  },

  // Delete report
  deleteReport: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/reports/${id}`, {
        headers: getAuthHeaders()
      });
      
      return response.data;
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  }
};

export default reportService;