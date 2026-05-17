import axios from 'axios';
import store from './redux/store';
import { clearUserData } from './redux/userSlice';

const backendURL = import.meta.env.VITE_API_URL || 'https://fooddelivery-qhnw.onrender.com';

// Do NOT set withCredentials globally, as it breaks external APIs (like Geoapify)
axios.defaults.baseURL = backendURL;

// Request Interceptor: Attach JWT and config ONLY to backend API requests
axios.interceptors.request.use(
  (config) => {
    // Check if the URL belongs to our backend
    const isBackend = config.url && (
      config.url.startsWith(backendURL) || 
      config.url.startsWith('/api') || 
      !config.url.startsWith('http')
    );

    if (isBackend) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.withCredentials = true; // Send cookies to backend if needed
    } else {
      // Clean request configurations for external APIs
      config.withCredentials = false;
      if (config.headers) {
        delete config.headers.Authorization;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors like 401 Unauthorized for backend
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Determine if it was a backend request
    const isBackend = error.config && error.config.url && (
      error.config.url.startsWith(backendURL) || 
      error.config.url.startsWith('/api') || 
      !error.config.url.startsWith('http')
    );

    if (isBackend && error.response && error.response.status === 401) {
      // Clear token and redux state
      localStorage.removeItem('token');
      store.dispatch(clearUserData());
      
      // Redirect to signin if not already on a public path
      const publicPaths = ['/', '/signin', '/signup', '/forgotpassword'];
      const isPublicPath = publicPaths.includes(window.location.pathname);
      
      if (!isPublicPath) {
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
