/// <reference types="vite/client" />
import axios from 'axios';

import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => {
    // Show success toast if the response contains a 'message' field (and it's not a GET request)
    if (response.config.method !== 'get' && response.data && response.data.message) {
      toast.success(response.data.message);
    }
    return response;
  },
  (error) => {
    const message = 
      error.response?.data?.error || 
      error.response?.data?.message || 
      error.message || 
      'An error occurred';
      
    // Display error toast
    toast.error(message);
    
    return Promise.reject(error);
  }
);

export default api;
