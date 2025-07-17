import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { create } from 'zustand'

const ACCESS_TOKEN = 'accessToken'
const REFRESH_TOKEN = 'refreshToken'
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds

interface AuthUser {
  accountNo: number
  email: string
  role: string[]
  exp: number
}

// JWT payload interface
interface JwtPayload {
  userId: number
  email: string
  role: string | string[]
  exp: number
  [key: string]: unknown
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    refreshToken: string
    setAccessToken: (accessToken: string, rememberMe?: boolean) => void
    setRefreshToken: (refreshToken: string, rememberMe?: boolean) => void
    resetAccessToken: () => void
    reset: () => void
    isAuthenticated: () => boolean
  }
}

// Helper function to decode and create user from token
const getUserFromToken = (token: string): AuthUser | null => {
  if (!token) return null

  try {
    const decoded = jwtDecode<JwtPayload>(token)

    // Convert role to array if it's a string
    let role = Array.isArray(decoded.role) ? decoded.role : [decoded.role]

    // Normalize role values
    role = role.map((r) => {
      // Handle shorthand roles
      if (r === 's') return 'superadmin'
      if (r === 'a') return 'admin'
      if (r === 'u') return 'user'
      return r
    })

    return {
      accountNo: decoded.userId, // Use userId as accountNo
      email: decoded.email,
      role: role,
      exp: decoded.exp,
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to decode token:', e)
    return null
  }
}

export const useAuthStore = create<AuthState>()((set, get) => {
  // Get tokens from cookies if available
  const accessTokenCookie = Cookies.get(ACCESS_TOKEN)
  const refreshTokenCookie = Cookies.get(REFRESH_TOKEN)

  const initAccessToken = accessTokenCookie ? JSON.parse(accessTokenCookie) : ''
  const initRefreshToken = refreshTokenCookie
    ? JSON.parse(refreshTokenCookie)
    : ''

  // Initialize user from access token if available
  const initialUser = getUserFromToken(initAccessToken)

  return {
    auth: {
      user: initialUser,
      setUser: (user) =>
        set((state) => ({ ...state, auth: { ...state.auth, user } })),
      accessToken: initAccessToken,
      refreshToken: initRefreshToken,
      setAccessToken: (accessToken, rememberMe = false) =>
        set((state) => {
          const options = rememberMe
            ? { expires: new Date(Date.now() + THIRTY_DAYS) }
            : undefined // Default to session cookie

          Cookies.set(ACCESS_TOKEN, JSON.stringify(accessToken), options)

          // Automatically update the user when setting a new token
          const user = getUserFromToken(accessToken)

          return {
            ...state,
            auth: {
              ...state.auth,
              accessToken,
              user: user || state.auth.user,
            },
          }
        }),
      setRefreshToken: (refreshToken, rememberMe = false) =>
        set((state) => {
          const options = rememberMe
            ? { expires: new Date(Date.now() + THIRTY_DAYS) }
            : { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } // 7 days default for refresh token

          Cookies.set(REFRESH_TOKEN, JSON.stringify(refreshToken), options)
          return { ...state, auth: { ...state.auth, refreshToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          // Clear all auth-related cookies
          Cookies.remove(ACCESS_TOKEN)
          Cookies.remove(REFRESH_TOKEN)

          // Clear any other auth-related storage
          localStorage.removeItem('user-settings')
          sessionStorage.clear()

          return {
            ...state,
            auth: {
              ...state.auth,
              user: null,
              accessToken: '',
              refreshToken: '',
            },
          }
        }),
      isAuthenticated: () => {
        const state = get()
        const user = state.auth.user
        const token = state.auth.accessToken

        if (!user || !token) {
          return false
        }

        // Check if token is expired
        if (user.exp && user.exp * 1000 < Date.now()) {
          // Don't reset here, let axios interceptor handle refresh
          return false
        }

        return true
      },
    },
  }
})

// export const useAuth = () => useAuthStore((state) => state.auth)
