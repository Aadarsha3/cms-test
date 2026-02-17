import axios from 'axios';

// Create an Axios instance with default configuration
const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the access token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle common errors (optional but good practice)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // You can handle 401 Unauthorized here, e.g., redirect to login or refresh token
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('authUser');
            localStorage.removeItem('id_token');
            localStorage.removeItem('rolePermissions');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
