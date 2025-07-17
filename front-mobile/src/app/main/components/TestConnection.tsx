import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { apiService } from '../../services/apiService';
import API_URL, { getFallbackUrls } from '../../../shared/constants/api';

export const TestConnection: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...');
  const [lastTest, setLastTest] = useState<Date | null>(null);

  const testConnection = async () => {
    setConnectionStatus('Testing...');
    setLastTest(new Date());
    
    try {
      console.log(`🔍 Testing connection to: ${API_URL}`);
      
      // Test 1: Simple fetch to health endpoint
      const healthResponse = await fetch(`${API_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // 5 second timeout
      });
      
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        console.log('✅ Health check successful:', healthData);
        setConnectionStatus(`✅ Connected! Status: ${healthData.status}`);
        return;
      } else {
        console.log('❌ Health check failed:', healthResponse.status);
        setConnectionStatus(`❌ Health check failed: ${healthResponse.status}`);
      }
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      
      // Test 2: Try alternative URLs from configuration
      const testUrls = getFallbackUrls();
      
      for (const testUrl of testUrls) {
        try {
          console.log(`🔄 Trying: ${testUrl}`);
          const response = await fetch(`${testUrl}/health`);
          if (response.ok) {
            const data = await response.json();
            console.log(`✅ ${testUrl} works!`);
            setConnectionStatus(`✅ Working URL found: ${testUrl}`);
            Alert.alert(
              'Connection Found!', 
              `The backend is reachable at: ${testUrl}\n\nUpdate your API configuration to use this URL.`,
              [{ text: 'OK' }]
            );
            return;
          }
        } catch (testError) {
          console.log(`❌ ${testUrl} failed`);
          continue;
        }
      }
      
      setConnectionStatus(`❌ All connection attempts failed. Backend may be offline.`);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <View style={{
      backgroundColor: 'white',
      padding: 16,
      margin: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd'
    }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
        Backend Connection Test
      </Text>
      
      <Text style={{ fontSize: 14, marginBottom: 8 }}>
        API URL: {API_URL}
      </Text>
      
      <Text style={{ fontSize: 14, marginBottom: 8 }}>
        Status: {connectionStatus}
      </Text>
      
      {lastTest && (
        <Text style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
          Last test: {lastTest.toLocaleTimeString()}
        </Text>
      )}
      
      <TouchableOpacity
        onPress={testConnection}
        style={{
          backgroundColor: '#007AFF',
          padding: 12,
          borderRadius: 6,
          alignItems: 'center'
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          Test Connection
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TestConnection; 