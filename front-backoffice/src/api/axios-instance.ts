import axios from 'axios'
import { API_CONFIG } from '@/config/api'
import { useAuthStore } from '@/stores/authStore'
import AuthService from './services/auth-service'

// Use the BASE_URL from our API config, fallback to environment variable or /api
const API_URL = API_CONFIG.BASE_URL || import.meta.env.VITE_API_URL || '/api'

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
})

// Request interceptor for adding auth token and checking expiration
axiosInstance.interceptors.request.use(
  (config) => {
    const auth = useAuthStore.getState().auth
    const accessToken = auth.accessToken

    // Skip auth header for token-related endpoints
    const isAuthEndpoint =
      config.url?.includes('/auth/sign-in') ||
      config.url?.includes('/auth/refresh-token')

    if (accessToken && !isAuthEndpoint) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Track if token refresh is in progress
let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

// Function to add callbacks to refresh subscriber queue
const subscribeToTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback)
}

// Function to notify all subscribers with the new token
const onTokenRefreshed = (newToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newToken))
  refreshSubscribers = []
}

// Response interceptor for handling authentication errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Prevent redirect loops and null errors
    if (!originalRequest) {
      return Promise.reject(error)
    }

    // Don't retry if it's a retry or a sign-in request already
    const isRetry = originalRequest._retry
    const isAuthRequest =
      originalRequest.url?.includes('/auth/sign-in') ||
      originalRequest.url?.includes('/auth/refresh-token') ||
      originalRequest.url?.includes('/auth/validate-token')

    // Handle 401 Unauthorized errors for token expiration
    if (error.response?.status === 401 && !isRetry && !isAuthRequest) {
      originalRequest._retry = true

      // If refresh already in progress, wait for new token
      if (isRefreshing) {
        try {
          const newToken = await new Promise<string>((resolve) => {
            subscribeToTokenRefresh((token) => resolve(token))
          })

          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return axiosInstance(originalRequest)
        } catch (err) {
          return Promise.reject(err)
        }
      }

      // Start token refresh process
      isRefreshing = true

      try {
        const auth = useAuthStore.getState().auth
        const refreshToken = auth.refreshToken

        // Skip if no refresh token
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        // Call refresh token API
        const response = await AuthService.refreshToken({ refreshToken })
        const newAccessToken = response.accessToken

        // Update tokens in store
        useAuthStore.getState().auth.setAccessToken(newAccessToken)
        if (response.refreshToken) {
          useAuthStore.getState().auth.setRefreshToken(response.refreshToken)
        }

        // Update authorization header and retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        onTokenRefreshed(newAccessToken)

        // Return the retry with updated token
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        // Handle refresh failure
        console.error('Token refresh failed:', refreshError)

        // Only clear auth and redirect if we're in a browser context
        if (typeof window !== 'undefined') {
          // Logout user
          useAuthStore.getState().auth.reset()

          // Redirect to login - but only if we're not already on the sign-in page
          const isSignInPage = window.location.pathname.includes('/sign-in')
          if (!isSignInPage) {
            window.location.href =
              '/sign-in?redirect=' + window.location.pathname
          }
        }

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Handle 403 Forbidden errors
    if (error.response?.status === 403) {
      // Only clear auth state and redirect if not already on auth page
      // and we're in a browser context
      if (
        typeof window !== 'undefined' &&
        !originalRequest.url?.includes('/auth/')
      ) {
        const isSignInPage = window.location.pathname.includes('/sign-in')

        useAuthStore.getState().auth.reset()

        if (!isSignInPage) {
          window.location.href = '/sign-in?redirect=' + window.location.pathname
        }
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
