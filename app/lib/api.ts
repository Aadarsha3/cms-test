// import axios from 'axios';

// // State to track if a refresh is currently in progress
// let isRefreshing = false;
// let failedQueue: any[] = [];

// /**
//  * Helper to process the queue of failed requests after a token refresh
//  */
// const processQueue = (error: any, token: string | null = null) => {
//     failedQueue.forEach((promise) => {
//         if (error) {
//             promise.reject(error);
//         } else {
//             promise.resolve(token);
//         }
//     });
//     failedQueue = [];
// };

// /**
//  * Soft re-auth: token expired but auth-server session is likely still active.
//  * We preserve authUser/rolePermissions so the callback can restore state,
//  * set a flag so LoginPage auto-triggers the OAuth flow, and redirect.
//  */
// const handleSessionExpired = () => {
//     // Clear all session data for a clean re-auth state
//     localStorage.removeItem('authUser');
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('id_token');
//     localStorage.removeItem('refresh_token');
//     localStorage.removeItem('rolePermissions');

//     localStorage.setItem('sessionExpired', 'true');
//     window.location.href = '/login';
// };

// // Helper to configure interceptors
// const configureInterceptors = (instance: any) => {
//     instance.interceptors.request.use(
//         (config: any) => {
//             const token = localStorage.getItem('access_token');
//             if (token) {
//                 config.headers['Authorization'] = `Bearer ${token}`;
//             }
//             return config;
//         },
//         (error: any) => {
//             return Promise.reject(error);
//         }
//     );

//     instance.interceptors.response.use(
//         (response: any) => {
//             return response;
//         },
//         async (error: any) => {
//             const originalRequest = error.config;

//             // Handle 401 Unauthorized errors (Token likely expired)
//             if (error.response && error.response.status === 401 && !originalRequest._retry) {

//                 // If we are already refreshing the token, add originalRequest to the queue
//                 if (isRefreshing) {
//                     return new Promise((resolve, reject) => {
//                         failedQueue.push({ resolve, reject });
//                     })
//                         .then((token) => {
//                             originalRequest.headers['Authorization'] = 'Bearer ' + token;
//                             return instance(originalRequest);
//                         })
//                         .catch((err) => {
//                             return Promise.reject(err);
//                         });
//                 }

//                 originalRequest._retry = true;
//                 isRefreshing = true;

//                 const refreshToken = localStorage.getItem('refresh_token');

//                 if (refreshToken) {
//                     try {
//                         // Exchange refresh_token for a new access_token/refresh_token
//                         // We use a clean axios instance to avoid infinite loops
//                         const refreshResponse = await axios.post(
//                             'http://localhost:8001/oauth2/token',
//                             new URLSearchParams({
//                                 grant_type: 'refresh_token',
//                                 refresh_token: refreshToken,
//                                 client_id: 'react-client',
//                             }),
//                             {
//                                 headers: {
//                                     'Content-Type': 'application/x-www-form-urlencoded',
//                                 },
//                             }
//                         );

//                         const { access_token, refresh_token: newRefreshToken } = refreshResponse.data;

//                         // Save new tokens to storage
//                         localStorage.setItem('access_token', access_token);
//                         if (newRefreshToken) {
//                             localStorage.setItem('refresh_token', newRefreshToken);
//                         }

//                         // Release the queue of pending requests
//                         processQueue(null, access_token);
//                         isRefreshing = false;

//                         // Retry the original request
//                         originalRequest.headers['Authorization'] = 'Bearer ' + access_token;
//                         return instance(originalRequest);
//                     } catch (refreshErr) {
//                         // Refresh failed — try silent re-auth
//                         processQueue(refreshErr, null);
//                         isRefreshing = false;
//                         handleSessionExpired();
//                         return Promise.reject(refreshErr);
//                     }
//                 } else {
//                     // No refresh token available — try silent re-auth
//                     handleSessionExpired();
//                 }
//             }

//             return Promise.reject(error);
//         }
//     );
// };

// // Dashboard API (Port 8000)
// export const dashboardApi = axios.create({
//     baseURL: 'http://localhost:8000/api/v1',
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });
// configureInterceptors(dashboardApi);

// // User Management API (Port 8001)
// export const userApi = axios.create({
//     baseURL: 'http://localhost:8001/api/v1',
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });
// configureInterceptors(userApi);


import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// State to track if a refresh is currently in progress
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
}> = [];

/**
 * Helper to process the queue of failed requests after a token refresh
 */
const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token!);
        }
    });
    failedQueue = [];
};

/**
 * DEBUG: Log token refresh attempts
 */
const logDebug = (message: string, data?: any) => {
    if (import.meta.env.DEV) {
        console.log(`[AUTH DEBUG] ${message}`, data || '');
    }
};

/**
 * Soft re-auth: token expired but auth-server session is likely still active.
 */
const handleSessionExpired = () => {
    logDebug('Session expired, redirecting to login');

    // Check if already redirecting to prevent loops
    if (window.location.pathname === '/login') {
        return;
    }

    // Clear all session data for a clean re-auth state
    localStorage.removeItem('authUser');
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('rolePermissions');

    localStorage.setItem('sessionExpired', 'true');

    // Use window.location.replace to prevent back button issues
    window.location.replace('/login');
};

// Helper to configure interceptors
const configureInterceptors = (instance: AxiosInstance) => {
    instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const token = localStorage.getItem('access_token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
                logDebug(`Request to ${config.url} with token: ${token.substring(0, 20)}...`);
            } else {
                logDebug(`Request to ${config.url} WITHOUT token`);
            }
            return config;
        },
        (error: any) => {
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response) => {
            logDebug(`Success response from ${response.config.url}`);
            return response;
        },
        async (error: AxiosError) => {
            const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

            // Add null check for error.config
            if (!originalRequest) {
                logDebug('Error without config', error);
                return Promise.reject(error);
            }

            logDebug(`Error ${error.response?.status} from ${originalRequest.url}`);

            // Handle 401 Unauthorized errors (Token likely expired)
            if (error.response?.status === 401 && !originalRequest._retry) {
                logDebug('401 Unauthorized - attempting token refresh');

                // If we are already refreshing the token, add originalRequest to the queue
                if (isRefreshing) {
                    logDebug('Refresh already in progress, queuing request');
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            originalRequest.headers['Authorization'] = `Bearer ${token}`;
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
                    logDebug('Attempting to refresh token', { refreshToken: refreshToken.substring(0, 20) + '...' });
                    try {
                        const AUTH_SERVER_URL = import.meta.env.VITE_AUTH_SERVER_URL || 'http://localhost:8001';

                        // Exchange refresh_token for a new access_token/refresh_token
                        const refreshResponse = await axios.post(
                            `${AUTH_SERVER_URL}/oauth2/token`,
                            new URLSearchParams({
                                grant_type: 'refresh_token',
                                refresh_token: refreshToken,
                                client_id: 'react-client',
                            }),
                            {
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                timeout: 10000,
                            }
                        );

                        const { access_token, refresh_token: newRefreshToken, id_token } = refreshResponse.data;

                        logDebug('Token refresh successful', {
                            newAccessToken: access_token.substring(0, 20) + '...',
                            hasNewRefreshToken: !!newRefreshToken
                        });

                        // Save new tokens to storage
                        localStorage.setItem('access_token', access_token);
                        if (newRefreshToken) {
                            localStorage.setItem('refresh_token', newRefreshToken);
                        }
                        if (id_token) {
                            localStorage.setItem('id_token', id_token);
                        }

                        // Release the queue of pending requests
                        processQueue(null, access_token);
                        isRefreshing = false;

                        // Retry the original request
                        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
                        return instance(originalRequest);
                    } catch (refreshErr: any) {
                        logDebug('Token refresh FAILED', refreshErr.response?.data || refreshErr.message);
                        // Refresh failed — try silent re-auth
                        processQueue(refreshErr, null);
                        isRefreshing = false;
                        handleSessionExpired();
                        return Promise.reject(refreshErr);
                    }
                } else {
                    logDebug('No refresh token available');
                    isRefreshing = false;
                    handleSessionExpired();
                    return Promise.reject(error);
                }
            }

            return Promise.reject(error);
        }
    );
};

// Use environment variables for API URLs
const DASHBOARD_API_URL = import.meta.env.VITE_DASHBOARD_API_URL || 'http://localhost:8000/api/v1';
const USER_API_URL = import.meta.env.VITE_USER_API_URL || 'http://localhost:8001/api/v1';

logDebug('API Configuration', { DASHBOARD_API_URL, USER_API_URL });

// Dashboard API (Port 8000)
export const dashboardApi = axios.create({
    baseURL: DASHBOARD_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
    // Add withCredentials if you're using cookies
    withCredentials: true,
});
configureInterceptors(dashboardApi);

// User Management API (Port 8001)
export const userApi = axios.create({
    baseURL: USER_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
    withCredentials: true,
});
configureInterceptors(userApi);

// Export utility to manually clear tokens (useful for logout)
export const clearAuthTokens = () => {
    logDebug('Clearing all auth tokens');
    localStorage.removeItem('authUser');
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('rolePermissions');
    localStorage.removeItem('sessionExpired');
};

// Export utility to check token validity
export const isTokenExpired = (token: string): boolean => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000; // Convert to milliseconds
        const now = Date.now();
        const isExpired = now >= exp;
        logDebug('Token expiry check', {
            expiresAt: new Date(exp).toISOString(),
            now: new Date(now).toISOString(),
            isExpired
        });
        return isExpired;
    } catch {
        return true;
    }
};

// Export utility to get token expiry time
export const getTokenExpiryTime = (): string | null => {
    const token = localStorage.getItem('access_token');
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return new Date(payload.exp * 1000).toISOString();
    } catch {
        return null;
    }
};