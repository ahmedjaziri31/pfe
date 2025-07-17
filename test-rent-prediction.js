// Test script for rent prediction
const testRentPrediction = async () => {
  const AI_BASE_URL = 'http://localhost:5001/api'
  
  console.log('🏠 Testing Rent Prediction...')
  
  // Test data for apartment rent
  const apartmentRentData = {
    model_name: 'apartment_rent',
    total_area: 120,
    rooms: 3,
    terrace: 1,
    elevator: 1,
    furnished: 0,
    air_conditioning: 1,
    heating: 0,
    security: 1,
    floor_number: 2,
    latitude: 36.8065,
    longitude: 10.1815,
    bedrooms: 2,
    garage: 0,
    garden: 0,
    pool: 0,
    bathrooms_number: 2,
    payment_period_Mois: 1,      // Monthly payment
    payment_period_Semaine: 0,   // No weekly payment
    city: 'Tunis',
    governorate: 'Tunis'
  }
  
  try {
    console.log('📤 Sending apartment rent prediction request...')
    console.log('Data:', apartmentRentData)
    
    const response = await fetch(`${AI_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apartmentRentData)
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ Apartment Rent Prediction Success!')
      console.log('💰 Predicted Monthly Rent:', result.prediction, 'TND')
      console.log('Full Response:', result)
    } else {
      const errorData = await response.json()
      console.log('❌ Apartment Rent Prediction Failed:', errorData)
    }
    
    // Test house rent
    console.log('\n🏡 Testing House Rent Prediction...')
    const houseRentData = {
      model_name: 'house_rent',
      total_area: 150,
      rooms: 4,
      terrace: 1,
      furnished: 0,
      air_conditioning: 1,
      heating: 0,
      security: 1,
      latitude: 36.8065,
      longitude: 10.1815,
      bedrooms: 3,
      garage: 1,
      garden: 1,
      pool: 0,
      bathrooms_number: 2,
      payment_period_Mois: 1,      // Monthly payment
      payment_period_Semaine: 0,   // No weekly payment
      city: 'Tunis',
      governorate: 'Tunis'
    }
    
    const houseResponse = await fetch(`${AI_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(houseRentData)
    })
    
    if (houseResponse.ok) {
      const houseResult = await houseResponse.json()
      console.log('✅ House Rent Prediction Success!')
      console.log('💰 Predicted Monthly Rent:', houseResult.prediction, 'TND')
      console.log('Full Response:', houseResult)
    } else {
      const houseErrorData = await houseResponse.json()
      console.log('❌ House Rent Prediction Failed:', houseErrorData)
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    console.log('\n📝 Make sure:')
    console.log('1. Flask server is running: python AI/main_app.py')
    console.log('2. Flask server has CORS enabled')
    console.log('3. Required model files exist')
  }
}

// Run the test
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch')
  testRentPrediction()
} else {
  // Browser environment
  window.testRentPrediction = testRentPrediction
  console.log('Run testRentPrediction() in browser console')
} 
 
 