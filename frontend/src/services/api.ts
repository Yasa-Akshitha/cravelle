import axios from 'axios';

// Read API base URL from Vite environment variable
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// Request interceptor: attach JWT bearer token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cravelle_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: seamlessly unwrap ApiResponse envelope and handle 401
apiClient.interceptors.response.use(
  (response) => {
    // If backend wrapped in standard ApiResponse { success, data, message }
    if (
      response.data &&
      typeof response.data === 'object' &&
      'data' in response.data &&
      'success' in response.data
    ) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthEndpoint =
        error.config.url?.includes('/api/auth/login') ||
        error.config.url?.includes('/api/auth/register');
      if (!isAuthEndpoint) {
        localStorage.removeItem('cravelle_token');
        localStorage.removeItem('cravelle_user');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
