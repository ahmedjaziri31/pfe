import axiosInstance from '../axios-instance'

export interface PredictionFormData {
  // Basic property info
  total_area: number
  rooms: number
  bathrooms?: number // Optional for some models
  bedrooms: number
  floor?: number // For apartments
  floor_number?: number // For apartment rent
  bathrooms_number?: number // For rent models
  
  // Amenities (boolean)
  terrace: boolean
  elevator?: boolean // For apartments
  furnished: boolean
  air_conditioning: boolean
  heating: boolean
  security: boolean
  garage: boolean
  garden: boolean
  pool: boolean
  
  // Location
  latitude: number
  longitude: number
  city: string
  governorate: string
  
  // Rent-specific fields
  payment_period_Mois?: number
  payment_period_Semaine?: number
}

export interface PredictionResponse {
  success: boolean
  prediction?: number[]
  error?: string
  model_name: string
  currency: string
  confidence?: number
}

export interface ModelParameters {
  model_name: string
  required_parameters: string[]
}

class PredictionService {
  private readonly AI_BASE_URL = 'http://localhost:5001/api'

  /**
   * Get required parameters for a specific model
   */
  async getModelParameters(modelName: string): Promise<ModelParameters> {
    try {
      const response = await fetch(`${this.AI_BASE_URL}/predict/parameters/${modelName}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error: any) {
      console.error('Error fetching model parameters:', error)
      throw new Error(`Failed to fetch model parameters: ${error.message}`)
    }
  }

  /**
   * Predict property price using AI model
   */
  async predictPrice(
    modelName: string, 
    data: PredictionFormData
  ): Promise<PredictionResponse> {
    try {
      // Map model names to match Flask API
      const modelMapping: Record<string, string> = {
        'apartment_buying': 'apartment_buying',
        'apartment_sell': 'apartment_buying',
        'apartment_rent': 'apartment_rent',
        'apartment_renting': 'apartment_rent',
        'house_buying': 'house_buying',
        'house_sell': 'house_buying',
        'house_rent': 'house_rent',
        'house_renting': 'house_rent'
      }

      const flaskModelName = modelMapping[modelName] || modelName

      // Prepare data for Flask API - ensure all required fields are present
      const requestData = {
        model_name: flaskModelName,
        ...data,
        // Convert boolean to int for Flask API
        terrace: data.terrace ? 1 : 0,
        elevator: data.elevator ? 1 : 0,
        furnished: data.furnished ? 1 : 0,
        air_conditioning: data.air_conditioning ? 1 : 0,
        heating: data.heating ? 1 : 0,
        security: data.security ? 1 : 0,
        garage: data.garage ? 1 : 0,
        garden: data.garden ? 1 : 0,
        pool: data.pool ? 1 : 0,
        // Ensure payment periods are numbers for rent models
        payment_period_Mois: data.payment_period_Mois || 1,
        payment_period_Semaine: data.payment_period_Semaine || 0
      }

      console.log('🚀 Sending prediction request to Flask AI:', {
        url: `${this.AI_BASE_URL}/predict`,
        model: flaskModelName,
        data: requestData
      })

      const response = await fetch(`${this.AI_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ Flask AI API Error:', errorData)
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ Flask AI Response:', result)
      
      return {
        success: true,
        prediction: result.prediction,
        model_name: flaskModelName,
        currency: 'TND', // Tunisian Dinar
        confidence: 0.85 // Default confidence, could be returned by API
      }
    } catch (error: any) {
      console.error('❌ Prediction error:', error)
      
      return {
        success: false,
        error: error.message || 'Failed to get prediction from AI service',
        model_name: modelName,
        currency: 'TND'
      }
    }
  }

  /**
   * Check if AI service is available
   */
  async checkHealth(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔍 Checking AI service health...')
      const response = await fetch(`${this.AI_BASE_URL}/health`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('✅ AI Service is healthy:', data)
      
      return {
        success: true,
        message: data.message || 'AI service is available'
      }
    } catch (error: any) {
      console.error('❌ AI Health check failed:', error)
      
      return {
        success: false,
        message: error.message || 'AI service is unavailable'
      }
    }
  }

  /**
   * Get available AI services
   */
  async getServices(): Promise<any> {
    try {
      const response = await fetch(`${this.AI_BASE_URL}/services`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error: any) {
      console.error('Error fetching services:', error)
      throw new Error(`Failed to fetch services: ${error.message}`)
    }
  }

  /**
   * Validate prediction data based on model requirements
   */
  validatePredictionData(modelName: string, data: PredictionFormData): string[] {
    const errors: string[] = []

    // Basic validations
    if (!data.total_area || data.total_area <= 0) {
      errors.push('Total area must be greater than 0')
    }

    if (!data.rooms || data.rooms <= 0) {
      errors.push('Number of rooms must be greater than 0')
    }

    if (!data.bedrooms || data.bedrooms <= 0) {
      errors.push('Number of bedrooms must be greater than 0')
    }

    if (!data.city || data.city.trim() === '') {
      errors.push('City is required')
    }

    if (!data.governorate || data.governorate.trim() === '') {
      errors.push('Governorate is required')
    }

    if (!data.latitude || !data.longitude) {
      errors.push('Location coordinates are required')
    }

    // Model-specific validations
    if (modelName.includes('apartment')) {
      if (data.floor === undefined || data.floor < 0) {
        errors.push('Floor number is required for apartments')
      }
    }

    // For rent models, payment periods will be handled automatically with defaults
    // No need to validate since we provide defaults in the service

    return errors
  }

  /**
   * Test the connection to Flask AI service
   */
  async testConnection(): Promise<boolean> {
    try {
      const health = await this.checkHealth()
      return health.success
    } catch (error) {
      console.error('Connection test failed:', error)
      return false
    }
  }
}

export default new PredictionService() 
 
 