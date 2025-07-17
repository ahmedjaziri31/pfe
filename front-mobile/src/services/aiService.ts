import { authStore } from '@/app/auth/services/authStore';
import API_URL from '@/shared/constants/api';

// Types based on backend AI routes
export interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  isAI?: boolean;
  isUser?: boolean;
  audioUrl?: string;
  autoPlay?: boolean;
}

export interface AIChatResponse {
  success: boolean;
  query: string;
  response: string;
  audio_file?: string;
  timestamp: string;
  conversation_id?: string;
  tokens_used?: number;
  response_time?: number;
  error?: string;
}

export interface InvestmentInsightResponse {
  success: boolean;
  query: string;
  response: string;
  sql_query?: string;
  data_count?: number;
  chart_data?: any;
  timestamp: string;
  error?: string;
}

export interface PricePredictionRequest {
  property_type: 'apartment' | 'house';
  transaction_type: 'buying' | 'renting';
  surface_area: number;
  rooms: number;
  city: string;
  governorate: string;
  additional_features?: {
    garage?: boolean;
    garden?: boolean;
    pool?: boolean;
    elevator?: boolean;
    furnished?: boolean;
  };
}

export interface PricePredictionResponse {
  success: boolean;
  predicted_price: number;
  currency: string;
  confidence_score?: number;
  price_range?: {
    min: number;
    max: number;
  };
  market_insights?: string[];
  error?: string;
}

export interface RecommendationRequest {
  user_preferences: {
    budget_range: {
      min: number;
      max: number;
    };
    property_type: string[];
    location_preferences: string[];
    features: string[];
  };
  investment_goal: 'rental_income' | 'capital_appreciation' | 'mixed';
}

export interface PropertyRecommendation {
  id: string;
  title: string;
  price: number;
  location: string;
  property_type: string;
  features: string[];
  investment_score: number;
  roi_estimate?: number;
  recommendation_reason: string;
  images?: string[];
}

export interface RecommendationResponse {
  success: boolean;
  recommendations: PropertyRecommendation[];
  total_found: number;
  filters_applied: any;
  error?: string;
}

class AIService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;
  }

  /**
   * Get authentication headers for API calls
   */
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const { accessToken } = authStore.getState();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return headers;
  }

  /**
   * Make authenticated API request with error handling
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Send a message to the AI chatbot with role-based context
   */
  async sendChatMessage(
    query: string,
    voiceEnabled: boolean = false
  ): Promise<AIChatResponse> {
    try {
      console.log('🤖 Sending chat message:', query);
      
      const response = await this.makeRequest<AIChatResponse>('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          query: query.trim(),
          voice_enabled: voiceEnabled,
        }),
      });

      console.log('✅ Chat response received:', response);
      return response;
    } catch (error: any) {
      console.error('❌ AI Chat Error:', error);
      
      return {
        success: false,
        query,
        response: '',
        timestamp: new Date().toISOString(),
        error: error.message || 'Failed to send message',
      };
    }
  }

  /**
   * Get investment insights and database analytics
   */
  async getInvestmentInsights(query: string): Promise<InvestmentInsightResponse> {
    try {
      console.log('📊 Getting investment insights for:', query);
      
      const response = await this.makeRequest<InvestmentInsightResponse>('/api/ai/analytics', {
        method: 'POST',
        body: JSON.stringify({
          query: query.trim(),
        }),
      });

      console.log('✅ Investment insights received:', response);
      return response;
    } catch (error: any) {
      console.error('❌ Investment Insights Error:', error);
      
      return {
        success: false,
        query,
        response: 'Sorry, I couldn\'t retrieve investment insights at the moment.',
        timestamp: new Date().toISOString(),
        error: error.message || 'Failed to get investment insights',
      };
    }
  }

  /**
   * Get price prediction for a property
   */
  async getPricePrediction(request: PricePredictionRequest): Promise<PricePredictionResponse> {
    try {
      console.log('💰 Getting price prediction for:', request);
      
      const response = await this.makeRequest<PricePredictionResponse>('/api/predict', {
        method: 'POST',
        body: JSON.stringify(request),
      });

      console.log('✅ Price prediction received:', response);
      return response;
    } catch (error: any) {
      console.error('❌ Price Prediction Error:', error);
      
      return {
        success: false,
        predicted_price: 0,
        currency: 'TND',
        error: error.message || 'Failed to predict price',
      };
    }
  }

  /**
   * Get property recommendations based on user preferences
   */
  async getPropertyRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
    try {
      console.log('🏠 Getting property recommendations for:', request);
      
      const response = await this.makeRequest<RecommendationResponse>('/api/recommendations', {
        method: 'POST',
        body: JSON.stringify(request),
      });

      console.log('✅ Property recommendations received:', response);
      return response;
    } catch (error: any) {
      console.error('❌ Property Recommendations Error:', error);
      
      return {
        success: false,
        recommendations: [],
        total_found: 0,
        filters_applied: {},
        error: error.message || 'Failed to get recommendations',
      };
    }
  }

  /**
   * Check AI service health
   */
  async checkHealth(): Promise<{ success: boolean; message: string }> {
    try {
      await this.makeRequest('/api/health');
      return {
        success: true,
        message: 'AI service is available',
      };
    } catch (error: any) {
      console.error('❌ AI Health Check Error:', error);
      
      return {
        success: false,
        message: error.message || 'AI service is unavailable',
      };
    }
  }

  /**
   * Create a chat message object from AI response
   */
  createAIMessage(response: AIChatResponse | InvestmentInsightResponse): ChatMessage {
    return {
      id: `ai-${Date.now()}`,
      sender: 'AI Investment Assistant',
      message: response.response || response.error || 'No response received',
      timestamp: response.timestamp,
      isAI: true,
      audioUrl: 'audio_file' in response ? response.audio_file : undefined,
    };
  }

  /**
   * Create a user message object
   */
  createUserMessage(message: string): ChatMessage {
    return {
      id: `user-${Date.now()}`,
      sender: 'You',
      message,
      timestamp: new Date().toISOString(),
      isUser: true,
    };
  }

  /**
   * Format investment insight response for display
   */
  formatInvestmentResponse(response: InvestmentInsightResponse): string {
    let formattedResponse = response.response;

    if (response.success && response.sql_query) {
      formattedResponse += `\n\n**Data Query:**\n\`${response.sql_query}\``;
    }

    if (response.success && response.data_count !== undefined) {
      formattedResponse += `\n\n*Found ${response.data_count} records*`;
    }

    return formattedResponse;
  }

  /**
   * Detect if query is asking for investment insights vs general chat
   */
  isInvestmentInsightQuery(query: string): boolean {
    const investmentKeywords = [
      'show me', 'how many', 'list', 'find', 'search', 'data', 'statistics',
      'analyze', 'report', 'dashboard', 'users', 'investments', 'projects',
      'properties', 'revenue', 'profit', 'roi', 'performance', 'trends',
      'portfolio', 'market analysis', 'financial data'
    ];
    
    const lowerQuery = query.toLowerCase();
    return investmentKeywords.some(keyword => lowerQuery.includes(keyword));
  }

  /**
   * Process query and route to appropriate AI service
   */
  async processQuery(query: string, voiceEnabled: boolean = false): Promise<ChatMessage> {
    try {
      let response: AIChatResponse | InvestmentInsightResponse;
      
      if (this.isInvestmentInsightQuery(query)) {
        console.log('🔍 Routing to investment insights service');
        response = await this.getInvestmentInsights(query);
      } else {
        console.log('💬 Routing to general chat service');
        response = await this.sendChatMessage(query, voiceEnabled);
      }

      return this.createAIMessage(response);
    } catch (error: any) {
      console.error('❌ Query Processing Error:', error);
      
      return {
        id: `error-${Date.now()}`,
        sender: 'AI Investment Assistant',
        message: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString(),
        isAI: true,
      };
    }
  }
}

// Export singleton instance
export const aiService = new AIService();
export default aiService; 