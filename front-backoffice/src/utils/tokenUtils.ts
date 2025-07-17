/**
 * Decodes a JWT token without verifying it
 * @param token JWT token string to decode
 * @returns Decoded token payload or null if invalid
 */
export function decodeJWT(token: string): any {
  try {
    // JWT tokens are in the format header.payload.signature
    // We only need to decode the payload part which is base64 encoded
    const base64Url = token.split('.')[1]
    if (!base64Url) return null

    // Convert base64url to base64
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')

    // Decode the base64 string
    const payload = JSON.parse(
      decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
    )

    return payload
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

/**
 * Checks if a token is expired
 * @param token JWT token to check
 * @returns True if expired, false if still valid
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = decodeJWT(token)
    if (!decoded || !decoded.exp) return true

    // exp is in seconds, convert to milliseconds for Date
    const expiryDate = new Date(decoded.exp * 1000)
    return expiryDate < new Date()
  } catch (error) {
    console.error('Error checking token expiry:', error)
    return true // Assume expired if we can't verify
  }
}

/**
 * Returns formatted details about a token for debugging
 * @param token JWT token
 * @returns Object with token details
 */
export function getTokenDetails(token: string): Record<string, any> {
  try {
    const decoded = decodeJWT(token)
    if (!decoded) return { valid: false, message: 'Invalid token format' }

    const now = Math.floor(Date.now() / 1000)
    const expiryTime = decoded.exp ? new Date(decoded.exp * 1000) : undefined
    const issuedTime = decoded.iat ? new Date(decoded.iat * 1000) : undefined

    return {
      valid: true,
      subject: decoded.sub,
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      issuedAt: issuedTime?.toLocaleString(),
      expiresAt: expiryTime?.toLocaleString(),
      timeRemaining: decoded.exp
        ? `${Math.max(0, decoded.exp - now)} seconds`
        : 'Unknown',
      isExpired: decoded.exp ? now > decoded.exp : true,
    }
  } catch (error) {
    console.error('Error getting token details:', error)
    return {
      valid: false,
      message: 'Error parsing token',
      error: error.message,
    }
  }
}
