// API Configuration
export const API_CONFIG = {
  // Use a relative URL to work with the proxy in vite.config.ts
  BASE_URL: '/api',

  // Authentication endpoints
  AUTH: {
    SIGN_IN: '/auth/sign-in',
    SIGN_UP: '/auth/sign-up',
    SIGN_OUT: '/auth/logout',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    REFRESH_TOKEN: '/auth/refresh-token',
    VALIDATE_TOKEN: '/auth/validate-token',
    CLERK_AUTH: '/auth/clerk-auth',
    APPROVE_USER: '/auth/approve-user',
  },

  // User endpoints
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/update-profile',
    CHANGE_PASSWORD: '/user/change-password',
  },

  // Admin endpoints
  ADMIN: {
    USERS: '/admin/users',
    USER_DETAIL: '/admin/users/:id',
    PENDING_USERS: '/admin/users/pending',
  },

  // AI Services endpoints
  AI: {
    CHAT: '/ai/chat',
    BACKOFFICE: '/ai/backoffice',
    HEALTH: '/ai/health',
    SPEECH_TO_TEXT: '/ai/speech-to-text',
    TEXT_TO_SPEECH: '/ai/text-to-speech',
  },
}
