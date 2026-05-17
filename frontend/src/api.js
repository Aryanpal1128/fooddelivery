import axios from 'axios';
import store from './redux/store';
import { clearUserData } from './redux/userSlice';

// Configure Axios defaults globally
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://fooddelivery-qhnw.onrender.com';
axios.defaults.withCredentials = true;

// Request Interceptor: Attach JWT to protected API requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors like 401 Unauthorized
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redux state
      localStorage.removeItem('token');
      store.dispatch(clearUserData());
      
      // Redirect to signin if not already there
      if (!window.location.pathname.includes('/signin') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
