import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { authStorageKey, backendUrl } from '../constants/constants.js';

const api = axios.create({
  baseURL: backendUrl,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// ✅ Add access token to every outgoing request
api.interceptors.request.use(async config => {
  try {
    const value = await SecureStore.getItemAsync(authStorageKey);
    if (value) {
      const auth = JSON.parse(value);
      if (auth?.authToken) {
        config.headers.Authorization = `Bearer ${auth.authToken}`;
      }
    }
  } catch (err) {
    console.log('Error reading token from SecureStore:', err);
  }
  return config;
});

// ✅ Handle 401s and refresh flow with userType awareness
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Only handle 401 once per request
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for ongoing refresh to finish
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 🪣 Load the full auth object from SecureStore
        const stored = await SecureStore.getItemAsync(authStorageKey);
        const parsed = stored ? JSON.parse(stored) : null;

        const refreshToken = parsed?.refreshToken;
        const userType = parsed?.userType;

        if (!refreshToken || userType === undefined || userType === null) {
          throw new Error('Missing refreshToken or userType');
        }

        // ⚙️ Attempt refresh; handle 401 explicitly
        let data;
        try {
          const res = await axios.post(`${api.defaults.baseURL}/auth/refresh/${userType}`, {
            refreshToken,
          });
          data = res.data;
        } catch (refreshErr) {
          if (refreshErr.response?.status === 401) {
            console.warn('Refresh token invalid or expired — logging out user.');
            await SecureStore.deleteItemAsync(authStorageKey);
            isRefreshing = false;
            processQueue(refreshErr, null);
            return Promise.reject(refreshErr);
          }
          throw refreshErr; // bubble up other errors (network, etc.)
        }

        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken;

        // 🧠 Update SecureStore with both tokens
        const updatedAuth = {
          ...parsed,
          authToken: newAccessToken,
          refreshToken: newRefreshToken,
        };

        await SecureStore.setItemAsync(authStorageKey, JSON.stringify(updatedAuth));

        // Apply new access token globally
        api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        // Retry the failed request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        console.log('Token refresh failed:', err);

        // 🔒 If refresh fails, clear storage so user gets logged out
        await SecureStore.deleteItemAsync(authStorageKey);

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
