import axios from 'axios';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((p) => error ? p.reject(error) : p.resolve(token));
    failedQueue = [];
};

const handleSessionExpired = () => {
    localStorage.removeItem('authUser');
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('rolePermissions');
    localStorage.setItem('sessionExpired', 'true');
    window.location.href = '/login';
};

const configureInterceptors = (instance: any) => {
    // Attach Bearer token to every outgoing request
    instance.interceptors.request.use(
        (config: any) => {
            const token = localStorage.getItem('access_token');
            if (token) config.headers['Authorization'] = `Bearer ${token}`;
            return config;
        },
        (error: any) => Promise.reject(error)
    );

    // Handle token refresh on 401 responses
    instance.interceptors.response.use(
        (response: any) => response,
        async (error: any) => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            originalRequest.headers['Authorization'] = 'Bearer ' + token;
                            return instance(originalRequest);
                        })
                        .catch((err) => Promise.reject(err));
                }

                originalRequest._retry = true;
                isRefreshing = true;

                const refreshToken = localStorage.getItem('refresh_token');

                if (refreshToken) {
                    try {
                        const res = await axios.post(
                            `${import.meta.env.VITE_AUTH_SERVER_URL}/oauth2/token`,
                            new URLSearchParams({
                                grant_type: 'refresh_token',
                                refresh_token: refreshToken,
                                client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
                            }),
                            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
                        );

                        const { access_token, refresh_token: newRefreshToken } = res.data;
                        localStorage.setItem('access_token', access_token);
                        if (newRefreshToken) localStorage.setItem('refresh_token', newRefreshToken);

                        processQueue(null, access_token);
                        isRefreshing = false;

                        originalRequest.headers['Authorization'] = 'Bearer ' + access_token;
                        return instance(originalRequest);
                    } catch (refreshErr) {
                        processQueue(refreshErr, null);
                        isRefreshing = false;
                        handleSessionExpired();
                        return Promise.reject(refreshErr);
                    }
                } else {
                    handleSessionExpired();
                }
            }

            return Promise.reject(error);
        }
    );
};

export const dashboardApi = axios.create({
    baseURL: import.meta.env.VITE_DASHBOARD_API_URL,
    headers: { 'Content-Type': 'application/json' },
});
configureInterceptors(dashboardApi);

export const userApi = axios.create({
    baseURL: import.meta.env.VITE_USER_API_URL,
    headers: { 'Content-Type': 'application/json' },
});
configureInterceptors(userApi);

