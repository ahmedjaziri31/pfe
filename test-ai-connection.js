// Simple test script to verify Flask AI service connection
const testAIConnection = async () => {
  const AI_BASE_URL = 'http://localhost:5001/api'
  
  console.log('🔍 Testing AI Service Connection...')
  
  try {
    // Test 1: Health Check
    console.log('\n1️⃣ Testing Health Endpoint...')
    const healthResponse = await fetch(`${AI_BASE_URL}/health`)
    if (healthResponse.ok) {
      const healthData = await healthResponse.json()
      console.log('✅ Health Check:', healthData)
    } else {
      console.log('❌ Health Check failed:', healthResponse.status)
      return
    }
    
    // Test 2: Services List
    console.log('\n2️⃣ Testing Services Endpoint...')
    const servicesResponse = await fetch(`${AI_BASE_URL}/services`)
    if (servicesResponse.ok) {
      const servicesData = await servicesResponse.json()
      console.log('✅ Available Services:', servicesData.available_services)
    } else {
      console.log('❌ Services endpoint failed:', servicesResponse.status)
    }
    
    // Test 3: Sample Prediction
    console.log('\n3️⃣ Testing Prediction Endpoint...')
    const sampleData = {
      model_name: 'apartment_buying',
      total_area: 120,
      rooms: 3,
      bathrooms: 2,
      bedrooms: 2,
      floor: 2,
      terrace: 1,
      furnished: 0,
      air_conditioning: 1,
      heating: 0,
      security: 1,
      garage: 0,
      garden: 0,
      pool: 0,
      latitude: 36.8065,
      longitude: 10.1815,
      city: 'Tunis',
      governorate: 'Tunis'
    }
    
    const predictionResponse = await fetch(`${AI_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sampleData)
    })
    
    if (predictionResponse.ok) {
      const predictionData = await predictionResponse.json()
      console.log('✅ Sample Prediction Result:', predictionData)
      console.log(`💰 Predicted Price: ${predictionData.prediction} TND`)
    } else {
      const errorData = await predictionResponse.json()
      console.log('❌ Prediction failed:', errorData)
    }
    
    console.log('\n🎉 AI Service is ready for integration!')
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    console.log('\n📝 Make sure:')
    console.log('1. Flask server is running: python AI/main_app.py')
    console.log('2. Flask server is on port 5001')
    console.log('3. Required model files are in AI/prediction model/apis/')
  }
}

// Run the test if this file is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch')
  testAIConnection()
} else {
  // Browser environment
  window.testAIConnection = testAIConnection
  console.log('Run testAIConnection() in browser console')
} 
 
 