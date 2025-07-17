import { authService } from "../auth/services/authService";
import API_URL, { getFallbackUrls } from "../../shared/constants/api";
import { Platform } from 'react-native';

// Types
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface ApiConfig {
  authenticated?: boolean;
  timeout?: number;
}

class ApiService {
  private baseUrl: string;
  private fallbackUrls: string[] = [];

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
    
    // Setup fallback URLs from shared configuration
    this.fallbackUrls = getFallbackUrls();
    
    console.log(`[ApiService] Base URL: ${this.baseUrl}`);
    console.log(`[ApiService] Fallback URLs: ${this.fallbackUrls.join(', ')}`);
  }

  // ... existing code ...
} 