/**
 * Axios Instance
 * Single configured Axios instance with JWT interceptors
 * 
 * IMPORTANT: All HTTP requests MUST go through this instance.
 * Never use fetch() directly - always use this axios instance.
 */

import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/lib/stores/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Configured axios instance
 * - Base URL from environment
 * - Credentials included for cookie-based refresh token
 * - JSON content type default
 */
export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  withCredentials: true, // Required for cookie-based refresh token
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track if we're currently refreshing to prevent multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

/**
 * Request interceptor
 * - Attaches Authorization header with Bearer token from authStore
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * - Handles 401 errors by attempting token refresh
 * - Queues failed requests during refresh
 * - Clears auth if refresh fails
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry refresh or logout endpoints
      if (
        originalRequest.url?.includes('/auth/refresh') ||
        originalRequest.url?.includes('/auth/logout')
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh token
        // IMPORTANT: No body on refresh - it uses HTTP-only cookie
        const { data } = await api.post<{ access_token: string; refresh_token?: string }>(
          '/auth/refresh'
        );
        
        // Update tokens in store
        useAuthStore.getState().setTokens(data.access_token, data.refresh_token);
        
        processQueue(null);
        
        // Update the authorization header for the retry
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error);
        
        // Refresh failed - clear auth
        useAuthStore.getState().clearAuth();
        
        // Redirect to login if in browser
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Type-safe error extraction
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // Handle API error response
    const apiError = error.response?.data;
    if (typeof apiError === 'object' && apiError !== null) {
      if ('detail' in apiError && typeof apiError.detail === 'string') {
        return apiError.detail;
      }
      if ('message' in apiError && typeof apiError.message === 'string') {
        return apiError.message;
      }
    }
    // Fallback to status text
    return error.response?.statusText || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

export default api;
