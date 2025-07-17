import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ChatMessage } from '@/services/aiService';
import InvestmentInsightCard from './InvestmentInsightCard';

interface EnhancedMessageBubbleProps {
  message: ChatMessage;
  onViewDetails?: () => void;
}

const EnhancedMessageBubble: React.FC<EnhancedMessageBubbleProps> = ({
  message,
  onViewDetails,
}) => {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderFormattedText = (text: string) => {
    // Handle markdown-style formatting
    const parts = text.split(/(\*\*[^\*]+\*\*|`[^`]+`|\n)/);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <Text key={index} className="font-bold text-gray-900">
            {part.slice(2, -2)}
          </Text>
        );
      } else if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <Text key={index} className="bg-gray-100 text-gray-800 font-mono text-sm px-1 py-0.5 rounded">
            {part.slice(1, -1)}
          </Text>
        );
      } else if (part === '\n') {
        return <Text key={index}>{'\n'}</Text>;
      } else {
        return <Text key={index}>{part}</Text>;
      }
    });
  };

  // Check if this message contains structured data (investment insights)
  const isInvestmentInsight = message.message.includes('**Data Query:**') || 
                             message.message.includes('*Found') ||
                             message.sender.toLowerCase().includes('investment');

  const container = message.isUser ? "items-end" : "items-start";
  const bubbleBase = "px-5 py-4 shadow-lg max-w-[85%] border border-white/10";

  return (
    <Animated.View
      style={{ opacity: fade, transform: [{ translateY: slide }] }}
      className={`${container} mb-4 px-5`}
    >
      {message.isUser ? (
        // User message bubble
        <LinearGradient
          colors={['#34d399', '#059669']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className={bubbleBase}
          style={{ borderRadius: 24, borderBottomRightRadius: 6 }}
        >
          <Text className="text-white text-[16px] leading-[22px] font-medium">
            {renderFormattedText(message.message)}
          </Text>
        </LinearGradient>
      ) : (
        // AI message bubble with enhanced features
        <View className="max-w-[85%]">
          {isInvestmentInsight ? (
            // Investment insight card for structured data
            <InvestmentInsightCard
              insight={{
                success: true,
                query: 'User query',
                response: message.message,
                timestamp: message.timestamp,
                sql_query: message.message.includes('**Data Query:**') 
                  ? message.message.split('**Data Query:**')[1]?.split('`')[1] 
                  : undefined,
                data_count: message.message.includes('*Found') 
                  ? parseInt(message.message.split('*Found ')[1]?.split(' records')[0] || '0')
                  : undefined
              }}
              onViewDetails={onViewDetails}
            />
          ) : (
            // Regular AI message bubble
            <View
              className={`${bubbleBase} bg-white`}
              style={{ borderRadius: 24, borderBottomLeftRadius: 6 }}
            >
              {/* AI Assistant Header */}
              <View className="flex-row items-center mb-2">
                <View className="w-6 h-6 bg-blue-100 rounded-full items-center justify-center mr-2">
                  <Ionicons name="sparkles" size={12} color="#3B82F6" />
                </View>
                <Text className="text-blue-600 text-sm font-medium">
                  {message.sender}
                </Text>
              </View>

              {/* Message content */}
              <Text className="text-gray-800 text-[16px] leading-[22px]">
                {renderFormattedText(message.message)}
              </Text>

              {/* Audio player if available */}
              {message.audioUrl && (
                <TouchableOpacity className="flex-row items-center mt-3 p-2 bg-gray-50 rounded-lg">
                  <Ionicons name="play-circle" size={24} color="#3B82F6" />
                  <Text className="text-blue-600 text-sm font-medium ml-2">
                    Play Audio Response
                  </Text>
                </TouchableOpacity>
              )}

              {/* Additional actions for AI messages */}
              <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <View className="flex-row items-center space-x-4">
                  <TouchableOpacity className="flex-row items-center">
                    <Ionicons name="thumbs-up-outline" size={16} color="#6B7280" />
                    <Text className="text-gray-500 text-xs ml-1">Helpful</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-row items-center">
                    <Ionicons name="copy-outline" size={16} color="#6B7280" />
                    <Text className="text-gray-500 text-xs ml-1">Copy</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Timestamp */}
      <Text
        className={`text-xs text-gray-400 mt-1 ${
          message.isUser ? "mr-2" : "ml-2"
        }`}
      >
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </Animated.View>
  );
};

export default EnhancedMessageBubble; 