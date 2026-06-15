import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to add the auth token to headers
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth Services
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await api.post('/auth/login', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('user');
};

// Complaint Services
export const createComplaint = async (complaintData) => {
  // Uses multipart/form-data if image is included
  const response = await api.post('/complaints', complaintData);
  return response.data;
};

export const getMyComplaints = async () => {
  const response = await api.get('/complaints/my');
  return response.data;
};

export const getComplaintById = async (id) => {
  const response = await api.get(`/complaints/${id}`);
  return response.data;
};

export const getAllComplaints = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.category) params.append('category', filters.category);
  if (filters.ward) params.append('ward', filters.ward);
  if (filters.priority) params.append('priority', filters.priority);
  if (filters.status) params.append('status', filters.status);
  if (filters.search) params.append('search', filters.search);
  
  const response = await api.get(`/complaints?${params.toString()}`);
  return response.data;
};

export const updateComplaintStatus = async (id, status) => {
  const response = await api.put(`/complaints/${id}/status`, { status });
  return response.data;
};

export const deleteComplaint = async (id) => {
  const response = await api.delete(`/complaints/${id}`);
  return response.data;
};

// Analytics
export const getAnalytics = async () => {
  const response = await api.get('/complaints/analytics');
  return response.data;
};

export default api;
