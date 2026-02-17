import axios from 'axios';

// Create an Axios instance with default configuration
// Helper to configure interceptors
const configureInterceptors = (instance: any) => {
    instance.interceptors.request.use(
        (config: any) => {
            const token = localStorage.getItem('access_token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error: any) => {
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response: any) => {
            return response;
        },
        (error: any) => {
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
};

// Dashboard API (Port 8000)
export const dashboardApi = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});
configureInterceptors(dashboardApi);

// User Management API (Port 8001)
export const userApi = axios.create({
    baseURL: 'http://localhost:8001/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});
configureInterceptors(userApi);
