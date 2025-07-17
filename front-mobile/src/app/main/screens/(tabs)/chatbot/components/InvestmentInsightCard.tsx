import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { InvestmentInsightResponse } from '@/services/aiService';

interface InvestmentInsightCardProps {
  insight: InvestmentInsightResponse;
  onViewDetails?: () => void;
}

const InvestmentInsightCard: React.FC<InvestmentInsightCardProps> = ({
  insight,
  onViewDetails,
}) => {
  return (
    <View className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden my-2">
      {/* Header */}
      <LinearGradient
        colors={['#3B82F6', '#1E40AF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-4 py-3"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="analytics" size={20} color="white" />
            <Text className="text-white font-semibold text-base ml-2">
              Investment Insight
            </Text>
          </View>
          {insight.success && (
            <View className="bg-green-500 px-2 py-1 rounded-full">
              <Text className="text-white text-xs font-medium">
                {insight.data_count} records
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Content */}
      <View className="p-4">
        <Text className="text-gray-800 text-base leading-6 mb-3">
          {insight.response}
        </Text>

        {/* SQL Query Display */}
        {insight.success && insight.sql_query && (
          <View className="bg-gray-50 rounded-lg p-3 mb-3">
            <View className="flex-row items-center mb-2">
              <Ionicons name="code-slash" size={16} color="#6B7280" />
              <Text className="text-gray-600 text-sm font-medium ml-1">
                Data Query
              </Text>
            </View>
            <Text className="text-gray-700 text-sm font-mono">
              {insight.sql_query}
            </Text>
          </View>
        )}

        {/* Chart Data Preview */}
        {insight.chart_data && (
          <View className="bg-blue-50 rounded-lg p-3 mb-3">
            <View className="flex-row items-center mb-2">
              <Ionicons name="bar-chart" size={16} color="#3B82F6" />
              <Text className="text-blue-700 text-sm font-medium ml-1">
                Chart Data Available
              </Text>
            </View>
            <Text className="text-blue-600 text-sm">
              Visualization ready for detailed view
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
          <Text className="text-gray-500 text-xs">
            {new Date(insight.timestamp).toLocaleString()}
          </Text>
          
          {onViewDetails && (
            <TouchableOpacity
              onPress={onViewDetails}
              className="flex-row items-center px-3 py-2 bg-blue-100 rounded-lg"
            >
              <Ionicons name="eye" size={16} color="#3B82F6" />
              <Text className="text-blue-600 text-sm font-medium ml-1">
                View Details
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default InvestmentInsightCard; 