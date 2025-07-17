# API Configuration Guide

This document explains how to configure API endpoints for the mobile application.

## Environment Variables

The mobile app uses environment variables to configure API endpoints. This allows you to easily change the backend server IP without modifying code files.

### Primary Configuration

Create or update your `.env` file in the `front-mobile` directory:

```bash
# Primary API URL - change this to your backend server IP
EXPO_PUBLIC_API_URL=http://192.168.1.14:5000

# API Host and Port (used for fallback URL generation)
EXPO_PUBLIC_API_HOST=192.168.1.14
EXPO_PUBLIC_API_PORT=5000
```

### Fallback Configuration (Development Only)

For development environments, the app can automatically try alternative URLs if the primary URL fails:

```bash
# API Fallback Configuration (for development)
EXPO_PUBLIC_API_FALLBACK_HOST_1=10.0.2.2      # Android emulator
EXPO_PUBLIC_API_FALLBACK_HOST_2=192.168.1.11  # Alternative WiFi range
EXPO_PUBLIC_API_FALLBACK_HOST_3=localhost       # Local development
```

### Production Configuration

```bash
# Production API Configuration
EXPO_PUBLIC_API_URL_PROD=https://api.yourproductionapp.com
```

## How It Works

### 1. Environment Variable Priority

The app checks for API URLs in this order:

1. `EXPO_PUBLIC_API_URL` (if set, uses this directly)
2. Platform-specific fallbacks using individual host/port variables
3. Hardcoded defaults (as last resort)

### 2. Platform-Specific Behavior

#### Android Emulator
- Primary: Uses `EXPO_PUBLIC_API_FALLBACK_HOST_1` (default: `10.0.2.2`)
- Fallback: Uses `EXPO_PUBLIC_API_HOST` and `localhost`

#### iOS Simulator
- Primary: Uses `EXPO_PUBLIC_API_FALLBACK_HOST_3` (default: `localhost`)
- Fallback: Uses `EXPO_PUBLIC_API_HOST`

#### Physical Devices
- Primary: Uses `EXPO_PUBLIC_API_HOST` (default: `192.168.1.14`)
- Fallback: Uses alternative hosts if configured

### 3. Automatic Fallback System

The API services include automatic fallback functionality:

- If the primary URL fails, the app tries fallback URLs
- Fallback URLs are generated from environment variables
- Only works in development mode for security

## Quick Setup

### To Change API Server IP

1. **Update your `.env` file:**
   ```bash
   EXPO_PUBLIC_API_URL=http://NEW_IP_ADDRESS:5000
   EXPO_PUBLIC_API_HOST=NEW_IP_ADDRESS
   ```

2. **Restart your Expo development server:**
   ```bash
   npx expo start --clear
   ```

### Common IP Addresses

- **Your Computer's WiFi IP:** Usually `192.168.1.x` or `192.168.0.x`
- **Android Emulator:** `10.0.2.2`
- **iOS Simulator:** `localhost`
- **Local Development:** `localhost` or `127.0.0.1`

## Finding Your Computer's IP Address

### Windows
```cmd
ipconfig
```
Look for "IPv4 Address" under your WiFi adapter.

### macOS/Linux
```bash
ifconfig
```
Look for `inet` address under your WiFi interface.

### Alternative Method
```bash
# In your backend directory
node get-ip-address.js
```

## Testing API Connection

The app includes a connection test component that will:

1. Test the primary API URL
2. Try fallback URLs if primary fails
3. Show which URLs work
4. Provide recommendations for configuration

Access it through the app's development tools or test screens.

## Troubleshooting

### Common Issues

1. **"Network request failed"**
   - Check if backend server is running
   - Verify IP address is correct
   - Ensure phone/emulator can reach the IP

2. **"Connection refused"**
   - Backend server might not be running
   - Port might be blocked by firewall
   - Wrong port number in configuration

3. **"No response"**
   - IP address might be wrong
   - Network connectivity issues
   - Try alternative IPs from the same network range

### Debug Steps

1. **Check environment variables:**
   ```javascript
   console.log('API_URL:', process.env.EXPO_PUBLIC_API_URL);
   ```

2. **Test backend directly:**
   ```bash
   curl http://YOUR_IP:5000/health
   ```

3. **Use the connection test component**
   - It will try multiple URLs automatically
   - Shows which URLs work
   - Provides configuration recommendations

## Security Notes

- Fallback URLs only work in development mode (`__DEV__`)
- Production builds only use the configured production URL
- Never expose internal IPs in production builds
- Use HTTPS for production APIs

## File Structure

The API configuration is centralized in:

```
front-mobile/
├── .env                           # Environment variables
├── .env.example                   # Example configuration
├── src/shared/constants/api.tsx   # API URL logic
└── API_CONFIGURATION.md          # This documentation
```

All services import from `src/shared/constants/api.tsx` to ensure consistency. 