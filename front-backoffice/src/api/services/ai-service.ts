import axiosInstance from '../axios-instance'
import voiceService, { type SpeechToTextResponse, type TextToSpeechResponse } from './voice-service'

export interface ChatMessage {
  id: string
  sender: string
  message: string
  timestamp: string
  isAI?: boolean
  isUser?: boolean
  audioUrl?: string
  autoPlay?: boolean
}

export interface AIChatResponse {
  success: boolean
  query: string
  response: string
  audio_file?: string
  timestamp: string
  error?: string
}

export interface BackofficeQueryResponse {
  success: boolean
  query: string
  response: string
  sql_query?: string
  data_count?: number
  timestamp: string
  error?: string
}

class AIService {
  /**
   * Send a message to the AI chatbot
   */
  async sendChatMessage(
    query: string,
    voiceEnabled: boolean = false
  ): Promise<AIChatResponse> {
    try {
      const response = await axiosInstance.post('/ai/chat', {
        query,
        voice_enabled: voiceEnabled
      })

      return response.data
    } catch (error: any) {
      console.error('AI Chat Error:', error)
      
      // Return a structured error response
      return {
        success: false,
        query,
        response: '',
        timestamp: new Date().toISOString(),
        error: error.response?.data?.error || error.message || 'Failed to send message'
      }
    }
  }

  /**
   * Convert speech to text using voice service
   */
  async speechToText(audioBlob: Blob): Promise<SpeechToTextResponse> {
    return voiceService.speechToText(audioBlob)
  }

  /**
   * Convert text to speech using voice service
   */
  async textToSpeech(text: string): Promise<TextToSpeechResponse> {
    return voiceService.textToSpeech(text)
  }

  /**
   * Check if voice features are supported
   */
  isVoiceSupported(): boolean {
    return voiceService.isVoiceSupported()
  }

  /**
   * Request microphone permission
   */
  async requestMicrophonePermission(): Promise<boolean> {
    return voiceService.requestMicrophonePermission()
  }

  /**
   * Start voice recording
   */
  async startVoiceRecording(): Promise<boolean> {
    return voiceService.startRecording()
  }

  /**
   * Stop voice recording
   */
  async stopVoiceRecording(): Promise<Blob | null> {
    return voiceService.stopRecording()
  }

  /**
   * Get voice recording status
   */
  isRecording(): boolean {
    return voiceService.getRecordingStatus()
  }

  /**
   * Cancel current recording
   */
  cancelRecording(): void {
    voiceService.cancelRecording()
  }

  /**
   * Send a natural language query to the backoffice AI for database insights
   */
  async sendBackofficeQuery(query: string): Promise<BackofficeQueryResponse> {
    try {
      const response = await axiosInstance.post('/ai/backoffice', {
        query
      })

      return response.data
    } catch (error: any) {
      console.error('Backoffice AI Error:', error)
      
      // Return a structured error response
      return {
        success: false,
        query,
        response: error.response?.data?.response || 'Sorry, I couldn\'t process your request.',
        timestamp: new Date().toISOString(),
        error: error.response?.data?.error || error.message || 'Failed to process query'
      }
    }
  }

  /**
   * Check AI service health
   */
  async checkHealth(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosInstance.get('/ai/health')
      
      return {
        success: true,
        message: 'AI service is available'
      }
    } catch (error: any) {
      console.error('AI Health Check Error:', error)
      
      return {
        success: false,
        message: error.response?.data?.error || 'AI service is unavailable'
      }
    }
  }

  /**
   * Create a chat message object from AI response
   */
  createAIMessage(response: AIChatResponse): ChatMessage {
    return {
      id: `ai-${Date.now()}`,
      sender: 'AI Assistant',
      message: response.response || response.error || 'No response received',
      timestamp: response.timestamp,
      isAI: true
    }
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
      isUser: true
    }
  }

  /**
   * Format a backoffice response for display
   */
  formatBackofficeResponse(response: BackofficeQueryResponse): string {
    let formattedResponse = response.response

    if (response.success && response.sql_query) {
      formattedResponse += `\n\n**SQL Query Generated:**\n\`\`\`sql\n${response.sql_query}\n\`\`\``
    }

    if (response.success && response.data_count !== undefined) {
      formattedResponse += `\n\n**Records Found:** ${response.data_count}`
    }

    return formattedResponse
  }

  /**
   * Determine if this is a backoffice query based on keywords
   */
  isBackofficeQuery(query: string): boolean {
    const backofficeKeywords = [
      'data', 'database', 'users', 'investments', 'transactions', 'projects',
      'analytics', 'revenue', 'profit', 'statistics', 'count', 'total',
      'average', 'sum', 'report', 'insights', 'analysis', 'financial',
      'portfolio', 'performance', 'metrics', 'sql', 'query', 'table',
      'how many', 'show me', 'list all', 'find', 'search', 'filter'
    ]

    const lowerQuery = query.toLowerCase()
    return backofficeKeywords.some(keyword => lowerQuery.includes(keyword))
  }
}

export const aiService = new AIService()
export default aiService 
 
 