import axios from 'axios';

// State to track if a refresh is currently in progress
let isRefreshing = false;
let failedQueue: any[] = [];

/**
 * Helper to process the queue of failed requests after a token refresh
 */
const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }
    });
    failedQueue = [];
};

/**
 * Shared logout helper
 */
const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('authUser');
    localStorage.removeItem('id_token');
    localStorage.removeItem('rolePermissions');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
};

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
        async (error: any) => {
            const originalRequest = error.config;

            // Handle 401 Unauthorized errors (Token likely expired)
            if (error.response && error.response.status === 401 && !originalRequest._retry) {
                
                // If we are already refreshing the token, add originalRequest to the queue
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            originalRequest.headers['Authorization'] = 'Bearer ' + token;
                            return instance(originalRequest);
                        })
                        .catch((err) => {
                            return Promise.reject(err);
                        });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                const refreshToken = localStorage.getItem('refresh_token');

                if (refreshToken) {
                    try {
                        // Exchange refresh_token for a new access_token/refresh_token
                        // We use a clean axios instance to avoid infinite loops
                        const refreshResponse = await axios.post(
                            'http://localhost:8001/oauth2/token',
                            new URLSearchParams({
                                grant_type: 'refresh_token',
                                refresh_token: refreshToken,
                                client_id: 'react-client',
                            }),
                            {
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                },
                            }
                        );

                        const { access_token, refresh_token: newRefreshToken } = refreshResponse.data;

                        // Save new tokens to storage
                        localStorage.setItem('access_token', access_token);
                        if (newRefreshToken) {
                            localStorage.setItem('refresh_token', newRefreshToken);
                        }

                        // Release the queue of pending requests
                        processQueue(null, access_token);
                        isRefreshing = false;

                        // Retry the original request
                        originalRequest.headers['Authorization'] = 'Bearer ' + access_token;
                        return instance(originalRequest);
                    } catch (refreshErr) {
                        // Refresh failed, clean up and logout
                        processQueue(refreshErr, null);
                        isRefreshing = false;
                        handleLogout();
                        return Promise.reject(refreshErr);
                    }
                } else {
                    // No refresh token available
                    handleLogout();
                }
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
