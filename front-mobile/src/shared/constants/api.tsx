import { Platform } from 'react-native';

// API Configuration with Environment Variable Support
const getApiUrl = () => {
  // Use environment variable if available, otherwise fallback to hardcoded values
  const envApiUrl = process.env.EXPO_PUBLIC_API_URL;
  
  if (envApiUrl) {
    console.log("🔗 Using API URL from environment:", envApiUrl);
    return envApiUrl;
  }
  
  // Fallback configuration for different platforms using env vars
  if (__DEV__) {
    const apiHost = process.env.EXPO_PUBLIC_API_HOST || "192.168.1.14";
    const apiPort = process.env.EXPO_PUBLIC_API_PORT || "5000";
    
    // Development mode - platform-specific defaults
    if (Platform.OS === 'android') {
      // Android emulator uses 10.0.2.2 to access host machine
      return `http://${process.env.EXPO_PUBLIC_API_FALLBACK_HOST_1 || "10.0.2.2"}:${apiPort}`;
    } else if (Platform.OS === 'ios') {
      // iOS simulator uses localhost
      return `http://${process.env.EXPO_PUBLIC_API_FALLBACK_HOST_3 || "localhost"}:${apiPort}`;
    } else {
      // For physical devices, use the configured host IP
      return `http://${apiHost}:${apiPort}`;
    }
  } else {
    // Production mode
    return process.env.EXPO_PUBLIC_API_URL_PROD || "https://api.yourproductionapp.com";
  }
};

// Get fallback URLs for API service
export const getFallbackUrls = (): string[] => {
  if (!__DEV__) return [];
  
  const apiPort = process.env.EXPO_PUBLIC_API_PORT || "5000";
  const primaryHost = process.env.EXPO_PUBLIC_API_HOST || "192.168.1.14";
  const fallbackHost1 = process.env.EXPO_PUBLIC_API_FALLBACK_HOST_1 || "10.0.2.2";
  const fallbackHost2 = process.env.EXPO_PUBLIC_API_FALLBACK_HOST_2 || "192.168.1.11";
  const fallbackHost3 = process.env.EXPO_PUBLIC_API_FALLBACK_HOST_3 || "localhost";
  
  if (Platform.OS === 'android') {
    return [
      `http://${primaryHost}:${apiPort}`,      // Primary host (your computer's actual IP)
      `http://${fallbackHost1}:${apiPort}`,   // Android emulator (fallback)
      `http://${fallbackHost3}:${apiPort}`    // Last resort
    ];
  } else if (Platform.OS === 'ios') {
    return [
      `http://${fallbackHost3}:${apiPort}`,   // iOS simulator
      `http://${primaryHost}:${apiPort}`,     // Your computer's IP
    ];
  }
  
  return [
    `http://${primaryHost}:${apiPort}`,
    `http://${fallbackHost2}:${apiPort}`,
    `http://${fallbackHost3}:${apiPort}`
  ];
};

const API_URL = getApiUrl(); 

console.log("🔗 API_URL:", API_URL);
console.log("📱 Platform:", Platform.OS);
console.log("🏗️ Environment:", process.env.EXPO_PUBLIC_APP_ENV || 'development');
console.log("🔄 Fallback URLs:", getFallbackUrls());

export default API_URL;
