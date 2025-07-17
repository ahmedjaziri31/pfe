import { Platform } from "react-native";

// DEPRECATED: Use @/services/aiService instead
// This file is kept for backward compatibility only

console.warn(
  "⚠️ DEPRECATED: ChatbotApiService is deprecated. Please use @/services/aiService instead for enhanced AI features."
);

export interface ChatbotResponse {
  response?: string;
  error?: string;
}

/**
 * @deprecated Use aiService from @/services/aiService instead
 * This provides enhanced investment AI features with authentication and role-based access
 */
class ChatbotApiServiceClass {
  private baseUrl: string;
  private fallbackUrls: string[] = [];

  constructor() {
    // Configure the base URL based on platform
    if (Platform.OS === "android") {
      // For Android emulator, try multiple options
      this.baseUrl = "http://192.168.192.72:5002";
      this.fallbackUrls = ["http://10.0.2.2:5002", "http://localhost:5002"];
    } else if (Platform.OS === "ios") {
      // For iOS simulator, use localhost
      this.baseUrl = "http://localhost:5002";
    } else {
      // For web or other platforms
      this.baseUrl = "http://localhost:5002";
    }
  }

  /**
   * @deprecated Use aiService.checkHealth() instead
   */
  async checkHealth(): Promise<boolean> {
    console.warn("⚠️ DEPRECATED: Use aiService.checkHealth() instead");
    return false;
  }

  /**
   * @deprecated Use aiService.processQuery() instead for enhanced features
   */
  async sendMessage(query: string, voiceEnabled: boolean = false): Promise<string> {
    console.warn("⚠️ DEPRECATED: Use aiService.processQuery() instead");
    return "Please use the enhanced AI service for better investment assistance.";
  }

  /**
   * Get the current API URL being used
   */
  getApiUrl(): string {
    return this.baseUrl;
  }

  /**
   * Try to connect using fallback URLs
   */
  private async tryFallbackUrls(): Promise<string | null> {
    for (const url of this.fallbackUrls) {
      try {
        console.log(`🔄 Trying fallback URL: ${url}/api/health`);
        const response = await fetch(`${url}/api/health`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          console.log(`✅ Fallback URL works: ${url}`);
          return url;
        }
      } catch (error) {
        console.log(`❌ Fallback URL failed: ${url}`, error);
        continue;
      }
    }
    return null;
  }

  /**
   * Check if the chatbot API is healthy and reachable
   */
  async checkHealth(): Promise<boolean> {
    try {
      console.log(`🔍 Checking health at: ${this.baseUrl}/api/health`);

      const response = await fetch(`${this.baseUrl}/api/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // React Native doesn't support AbortSignal.timeout
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Health check successful:", data);
        return true;
      } else {
        console.log("❌ Health check failed with status:", response.status);
        return false;
      }
    } catch (error) {
      console.error("❌ Primary health check error:", error);

      // Try fallback URLs
      const workingUrl = await this.tryFallbackUrls();
      if (workingUrl) {
        console.log(`🔄 Switching to working URL: ${workingUrl}`);
        this.baseUrl = workingUrl;
        return true;
      }

      return false;
    }
  }

  /**
   * Send a message to the chatbot and get a response
   */
  async sendMessage(
    query: string,
    voiceEnabled: boolean = false
  ): Promise<string> {
    try {
      console.log(`📤 Sending message to: ${this.baseUrl}/api/chat`);
      console.log("📝 Query:", query);
      console.log("🔊 Voice enabled:", voiceEnabled);

      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
          voice_enabled: voiceEnabled,
        }),
        // React Native doesn't support AbortSignal.timeout
      });

      if (!response.ok) {
        console.error("❌ API request failed with status:", response.status);
        throw new Error(`API request failed with status ${response.status}`);
      }

      // The Python backend returns JSON with response field
      const responseData = await response.json();
      console.log("✅ Received response:", responseData);
      console.log("✅ Response type:", typeof responseData);
      console.log("✅ Response.response field:", responseData.response);

      const finalResponse = responseData.response || responseData;
      console.log("✅ Final response to return:", finalResponse);
      return finalResponse;
    } catch (error) {
      console.error("❌ Error sending message:", error);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error("Request timed out. Please try again.");
        } else if (error.message.includes("Network request failed")) {
          throw new Error(
            "Network error. Please check your connection and make sure the API server is running."
          );
        }
      }

      throw new Error("Failed to send message. Please try again later.");
    }
  }

  /**
   * Update the base URL (useful for different environments)
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url;
    console.log(`🔧 API base URL updated to: ${this.baseUrl}`);
  }
}

// Export a singleton instance
export const ChatbotApiService = new ChatbotApiServiceClass();
