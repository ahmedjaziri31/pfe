import React from 'react';
import { ScrollView } from 'react-native';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Pressable 
} from '@gluestack-ui/themed';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface QuickAction {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  colors: string[];
  query: string;
  description: string;
}

interface QuickActionsProps {
  onActionPress: (query: string) => void;
  isVisible: boolean;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'market-analysis',
    title: 'Market Analysis',
    icon: 'trending-up',
    colors: ['#10B981', '#059669'],
    query: 'Show me the current real estate market trends and statistics',
    description: 'Get market insights'
  },
  {
    id: 'investment-portfolio',
    title: 'My Portfolio',
    icon: 'briefcase',
    colors: ['#3B82F6', '#1E40AF'],
    query: 'Show me my investment portfolio performance and ROI',
    description: 'View portfolio stats'
  },
  {
    id: 'price-prediction',
    title: 'Price Prediction',
    icon: 'calculator',
    colors: ['#8B5CF6', '#7C3AED'],
    query: 'I want to predict property prices for a specific location',
    description: 'Estimate property value'
  },
  {
    id: 'recommendations',
    title: 'Recommendations',
    icon: 'star',
    colors: ['#F59E0B', '#D97706'],
    query: 'Show me property recommendations based on my preferences',
    description: 'Get AI suggestions'
  }
];

const QuickActions: React.FC<QuickActionsProps> = ({ onActionPress, isVisible }) => {
  if (!isVisible) return null;

  return (
    <Box paddingHorizontal="$4" paddingVertical="$4">
      <VStack space="md" marginBottom="$4">
        <Text color="$gray800" fontWeight="$semibold" fontSize="$lg">
          Quick Actions
        </Text>
        <Text color="$gray500" fontSize="$sm">
          Tap to get instant investment insights
        </Text>
      </VStack>
      
      {/* 2x2 Grid Layout */}
      <HStack flexWrap="wrap" justifyContent="space-between">
        {QUICK_ACTIONS.map((action, index) => (
          <Pressable
            key={action.id}
            onPress={() => onActionPress(action.query)}
            width="48%"
            marginBottom="$3"
            $pressed={{
              opacity: 0.8,
              transform: [{ scale: 0.98 }]
            }}
          >
            <LinearGradient
              colors={action.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                height: 96,
                borderRadius: 16,
                padding: 16,
                justifyContent: 'space-between',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Box
                backgroundColor="rgba(255,255,255,0.2)"
                width="$8"
                height="$8"
                borderRadius="$full"
                alignItems="center"
                justifyContent="center"
              >
                <Ionicons name={action.icon} size={18} color="white" />
              </Box>
              
              <VStack>
                <Text 
                  color="$white" 
                  fontWeight="$semibold" 
                  fontSize="$sm" 
                  marginBottom="$1"
                  numberOfLines={1}
                >
                  {action.title}
                </Text>
                <Text 
                  color="rgba(255,255,255,0.8)" 
                  fontSize="$xs" 
                  numberOfLines={1}
                >
                  {action.description}
                </Text>
              </VStack>
            </LinearGradient>
          </Pressable>
        ))}
      </HStack>
    </Box>
  );
};

export default QuickActions; 