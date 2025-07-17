import { API_CONFIG } from '@/config/api'
import axiosInstance from '../axios-instance'

// Error types for specific authentication scenarios
export enum AuthErrorType {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  TOO_MANY_ATTEMPTS = 'TOO_MANY_ATTEMPTS',
  ACCOUNT_DISABLED = 'ACCOUNT_DISABLED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INVALID_TOKEN = 'INVALID_TOKEN',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
}

export interface AuthError {
  type: AuthErrorType
  message: string
  remainingAttempts?: number
  lockoutDuration?: number
  suggestedAction?: string
}

// Type definitions for API requests and responses
export interface SignInRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface SignUpRequest {
  name: string
  surname: string
  email: string
  password: string
  birthdate: string
}

export interface VerifyEmailRequest {
  email: string
  code: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  email: string
  code: string
  newPassword: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface ClerkAuthRequest {
  token: string
  userId: string
  emailAddress: string
  firstName?: string
  lastName?: string
  imageUrl?: string
}

export interface UserResponse {
  accountNo: number
  name: string
  surname: string
  email: string
  profilePicture?: string
}

export interface SignInResponse {
  message: string
  accessToken: string
  refreshToken: string
  user: UserResponse
  role?: string
  privileges?: string[]
  dashboardRoute?: string
  lastLogin?: Date
  deviceInfo?: {
    deviceId: string
    browser: string
    os: string
    location?: string
  }
}

export interface BaseResponse {
  message: string
}

export interface SignUpResponse extends BaseResponse {
  accountNo: number
}

export interface ValidateTokenResponse {
  valid: boolean
  user: {
    userId: string
    email: string
    role: string
  }
}

// Auth service methods
const AuthService = {
  signIn: async (data: SignInRequest): Promise<SignInResponse> => {
    try {
      const response = await axiosInstance.post<SignInResponse>(
        API_CONFIG.AUTH.SIGN_IN,
        data
      )
      return response.data
    } catch (error: any) {
      if (error.response?.status === 401) {
        const errorData = error.response.data
        throw {
          type: AuthErrorType.INVALID_CREDENTIALS,
          message: 'Invalid email or password',
          remainingAttempts: errorData.remainingAttempts,
          suggestedAction:
            errorData.remainingAttempts <= 2
              ? 'Consider resetting your password'
              : undefined,
        }
      } else if (error.response?.status === 423) {
        throw {
          type: AuthErrorType.ACCOUNT_LOCKED,
          message: 'Account temporarily locked due to too many failed attempts',
          lockoutDuration: error.response.data.lockoutDuration,
          suggestedAction: 'Try again later or reset your password',
        }
      } else if (error.response?.status === 403) {
        throw {
          type: AuthErrorType.EMAIL_NOT_VERIFIED,
          message: 'Please verify your email address before signing in',
          suggestedAction: 'Check your email for verification instructions',
        }
      } else if (!error.response && error.request) {
        throw {
          type: AuthErrorType.NETWORK_ERROR,
          message: 'Unable to connect to the server',
          suggestedAction: 'Check your internet connection and try again',
        }
      }
      throw error
    }
  },

  signUp: async (data: SignUpRequest): Promise<SignUpResponse> => {
    const response = await axiosInstance.post<SignUpResponse>(
      API_CONFIG.AUTH.SIGN_UP,
      data
    )
    return response.data
  },

  verifyEmail: async (data: VerifyEmailRequest): Promise<BaseResponse> => {
    const response = await axiosInstance.post<BaseResponse>(
      API_CONFIG.AUTH.VERIFY_EMAIL,
      data
    )
    return response.data
  },

  forgotPassword: async (
    data: ForgotPasswordRequest
  ): Promise<BaseResponse> => {
    const response = await axiosInstance.post<BaseResponse>(
      API_CONFIG.AUTH.FORGOT_PASSWORD,
      data
    )
    return response.data
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<BaseResponse> => {
    const response = await axiosInstance.post<BaseResponse>(
      API_CONFIG.AUTH.RESET_PASSWORD,
      data
    )
    return response.data
  },

  refreshToken: async (data: RefreshTokenRequest): Promise<SignInResponse> => {
    const response = await axiosInstance.post<SignInResponse>(
      API_CONFIG.AUTH.REFRESH_TOKEN,
      data
    )
    return response.data
  },

  validateToken: async (): Promise<ValidateTokenResponse> => {
    try {
      const response = await axiosInstance.get<ValidateTokenResponse>(
        API_CONFIG.AUTH.VALIDATE_TOKEN
      )
      return response.data
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw {
          type: AuthErrorType.INVALID_TOKEN,
          message: 'Your session has expired',
          suggestedAction: 'Please sign in again',
        }
      }
      throw error
    }
  },

  signOut: async (): Promise<BaseResponse> => {
    const response = await axiosInstance.post<BaseResponse>(
      API_CONFIG.AUTH.SIGN_OUT
    )
    return response.data
  },

  // Handle Clerk OAuth (preferred OAuth method)
  handleClerkAuth: async (data: ClerkAuthRequest): Promise<SignInResponse> => {
    try {
      const response = await axiosInstance.post<SignInResponse>(
        API_CONFIG.AUTH.CLERK_AUTH,
        data
      )
      return response.data
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw {
          type: AuthErrorType.ACCOUNT_DISABLED,
          message:
            error.response.data.message || 'Your account is pending approval',
          suggestedAction:
            'Please wait for an administrator to approve your account',
        }
      } else if (!error.response && error.request) {
        throw {
          type: AuthErrorType.NETWORK_ERROR,
          message: 'Unable to connect to the server',
          suggestedAction: 'Check your internet connection and try again',
        }
      }
      throw error
    }
  },
}

export default AuthService
