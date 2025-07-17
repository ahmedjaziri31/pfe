// app/chat/ChatbotScreen.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  ButtonText,
  Input,
  InputField,
  Center,
  Pressable,
  Badge,
  BadgeText,
  Avatar,
  AvatarImage,
  AvatarFallbackText,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { authStore } from "@/app/auth/services/authStore";
import { aiService, ChatMessage } from "@/services/aiService";
import TypingIndicator from "@/app/auth/components/ui/TypingIndicator";
import EnhancedMessageBubble from "./components/EnhancedMessageBubble";
import QuickActions from "./components/QuickActions";

const { width } = Dimensions.get('window');

/* -------------------------------------------------------------------------- */
/*  Enhanced Chatbot Screen with Investment AI Features                       */
/* -------------------------------------------------------------------------- */

const INVESTMENT_SUGGESTIONS = [
  { text: "Market Trends", query: "Show me current market trends and insights", color: "$blue500" },
  { text: "Investment Tips", query: "What are the best investment opportunities?", color: "$green500" },
  { text: "Price Prediction", query: "Help me predict property prices", color: "$purple500" },
  { text: "Portfolio Analysis", query: "Analyze my investment portfolio", color: "$orange500" },
];

export default function ChatbotScreen() {
  const insets = useSafeAreaInsets();
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "AI Investment Assistant",
      message: "👋 Welcome to your **AI Investment Assistant**!\n\nI'm here to help you with:\n\n💹 **Market Analysis** - Real-time insights\n🏆 **Investment Strategies** - Personalized advice\n📊 **Portfolio Management** - Track performance\n⚖️ **Legal Guidance** - Tunisia regulations\n🔮 **Price Predictions** - ML-powered estimates\n📈 **Data Analytics** - Investment insights\n\nHow can I assist you today?",
      timestamp: new Date().toISOString(),
      isAI: true,
      isUser: false,
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  const scrollView = useRef<ScrollView>(null);

  /* ------------------------------ lifecycle ------------------------------ */
  useEffect(() => {
    checkAIConnection();
    loadUserRole();
    console.log("🔧 Enhanced AI Investment Chatbot initialized");
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    setTimeout(() => {
      scrollView.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  /* ------------------------------- helpers ------------------------------- */
  const loadUserRole = () => {
    const { accessToken } = authStore.getState();
    if (accessToken) {
      setUserRole('Premium User');
    }
  };

  const checkAIConnection = async () => {
    try {
      const result = await aiService.checkHealth();
      setIsConnected(result.success);

      if (!result.success) {
        Alert.alert(
          "Connection Issue",
          `Cannot reach the AI service: ${result.message}`,
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Health check error:", error);
      setIsConnected(false);
    }
  };

  const sendMessage = async (messageText?: string) => {
    const text = (messageText || inputText.trim());
    if (!text) return;

    const userMessage = aiService.createUserMessage(text);
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);
    setShowQuickActions(false);

    try {
      console.log("🚀 Sending message to enhanced AI service:", text);
      const aiResponse = await aiService.processQuery(text, false);
      console.log("✅ Enhanced AI response received:", aiResponse);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("❌ Enhanced AI Error:", error);
      
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'AI Investment Assistant',
        message: 'Sorry, I encountered an error processing your request. Please try again later.',
        timestamp: new Date().toISOString(),
        isAI: true,
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (query: string) => {
    sendMessage(query);
  };

  const handleViewDetails = () => {
    Alert.alert(
      "Investment Details",
      "This feature will open detailed analytics with charts and insights.",
      [{ text: "OK" }]
    );
  };

  const Typing = () => (
    <Box marginBottom="$4" paddingHorizontal="$5" alignItems="flex-start">
      <Box
        backgroundColor="$white"
        paddingHorizontal="$6"
        paddingVertical="$4"
        shadowColor="$blue200"
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.15}
        shadowRadius={12}
        elevation={8}
        borderWidth="$1"
        borderColor="$blue100"
        borderRadius="$3xl"
        borderBottomLeftRadius="$md"
        flexDirection="row"
        alignItems="center"
      >
        <Box
          width="$8"
          height="$8"
          backgroundColor="$blue100"
          borderRadius="$full"
          alignItems="center"
          justifyContent="center"
          marginRight="$3"
        >
          <Ionicons name="sparkles" size={16} color="#3B82F6" />
        </Box>
        <VStack>
          <Text fontSize="$sm" fontWeight="$medium" color="$blue600">
            AI Assistant
          </Text>
          <TypingIndicator />
        </VStack>
      </Box>
    </Box>
  );

  /* -------------------------------- render ------------------------------- */
  return (
    <Box flex={1} backgroundColor="$gray50">
      {/* Enhanced Gradient Header */}
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingTop: insets.top + 16, paddingBottom: 24 }}
      >
        <Box paddingHorizontal="$5">
          <HStack alignItems="center" justifyContent="space-between">
            <HStack alignItems="center" flex={1} space="md">
              <Box
                width="$14"
                height="$14"
                backgroundColor="rgba(255,255,255,0.25)"
                borderRadius="$2xl"
                alignItems="center"
                justifyContent="center"
                shadowColor="$black"
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={0.3}
                shadowRadius={8}
                elevation={8}
              >
                <Ionicons name="analytics" size={28} color="white" />
              </Box>
              <VStack flex={1}>
                <Text color="$white" fontSize="$xl" fontWeight="$bold">
                  AI Investment Assistant
                </Text>
                <Text color="rgba(255,255,255,0.85)" fontSize="$sm">
                  Your Smart Investment Advisor
                </Text>
              </VStack>
            </HStack>
            
            <VStack alignItems="flex-end" space="xs">
              {userRole && (
                <Badge
                  backgroundColor="rgba(255,255,255,0.25)"
                  borderRadius="$full"
                  paddingHorizontal="$3"
                  paddingVertical="$1"
                >
                  <BadgeText color="$white" fontSize="$xs" fontWeight="$semibold">
                    {userRole}
                  </BadgeText>
                </Badge>
              )}
              
              <HStack alignItems="center" space="xs">
                <Box
                  width="$2"
                  height="$2"
                  borderRadius="$full"
                  backgroundColor={isConnected ? "$green400" : "$red400"}
                />
                <Text color="rgba(255,255,255,0.8)" fontSize="$xs">
                  {isConnected ? "Online" : "Offline"}
                </Text>
              </HStack>
            </VStack>
          </HStack>
        </Box>
      </LinearGradient>

      {/* Chat Interface */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView
          ref={scrollView}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ 
            paddingBottom: 160 + Math.max(insets.bottom, 0)
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Quick Actions */}
          <QuickActions 
            onActionPress={handleQuickAction}
            isVisible={showQuickActions && messages.length <= 1}
          />

          {/* Enhanced Investment Insight Card */}
          {showQuickActions && messages.length <= 1 && (
            <Box paddingHorizontal="$5" marginBottom="$5">
              <Pressable
                onPress={handleViewDetails}
                backgroundColor="$white"
                borderRadius="$2xl"
                borderWidth="$1"
                borderColor="$blue100"
                padding="$5"
                shadowColor="$blue200"
                shadowOffset={{ width: 0, height: 8 }}
                shadowOpacity={0.15}
                shadowRadius={16}
                elevation={12}
                $pressed={{
                  opacity: 0.8,
                  transform: [{ scale: 0.98 }]
                }}
              >
                <HStack alignItems="center" justifyContent="space-between">
                  <HStack alignItems="center" space="md">
                    <Box
                      width="$12"
                      height="$12"
                      backgroundColor="$blue100"
                      borderRadius="$xl"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Ionicons name="bar-chart" size={24} color="#3B82F6" />
                    </Box>
                    <VStack>
                      <Text color="$gray900" fontWeight="$bold" fontSize="$lg">
                        Investment Insights
                      </Text>
                      <Text color="$gray600" fontSize="$sm">
                        Real-time market analytics
                      </Text>
                    </VStack>
                  </HStack>
                  <Badge
                    backgroundColor="$green500"
                    borderRadius="$full"
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                  >
                    <BadgeText color="$white" fontSize="$xs" fontWeight="$bold">
                      LIVE
                    </BadgeText>
                  </Badge>
                </HStack>
              </Pressable>
            </Box>
          )}

          {/* Messages */}
          <Box paddingTop="$2">
            {messages.map((message) => (
              <EnhancedMessageBubble
                key={message.id}
                message={message}
                onViewDetails={handleViewDetails}
              />
            ))}
            {isTyping && <Typing />}
          </Box>
        </ScrollView>

        {/* Enhanced Input Bar */}
        <Box
          backgroundColor="$white"
          borderTopWidth="$1"
          borderTopColor="$gray200"
          shadowColor="$black"
          shadowOffset={{ width: 0, height: -4 }}
          shadowOpacity={0.1}
          shadowRadius={16}
          elevation={16}
          position="absolute"
          bottom={80}
          left={0}
          right={0}
        >
          <LinearGradient
            colors={["rgba(255,255,255,0.95)", "rgba(255,255,255,1)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 }}
          >
            {/* Enhanced Quick Suggestions */}
            {showQuickActions && (
              <VStack space="md" marginBottom="$4">
                <Text color="$gray700" fontSize="$sm" fontWeight="$medium">
                  Quick Actions
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 4 }}
                >
                  {INVESTMENT_SUGGESTIONS.map((suggestion, index) => (
                    <Pressable
                      key={index}
                      onPress={() => sendMessage(suggestion.query)}
                      backgroundColor="$white"
                      borderWidth="$2"
                      borderColor={suggestion.color}
                      borderRadius="$full"
                      paddingHorizontal="$4"
                      paddingVertical="$2.5"
                      marginRight="$3"
                      shadowColor={suggestion.color}
                      shadowOffset={{ width: 0, height: 2 }}
                      shadowOpacity={0.1}
                      shadowRadius={4}
                      elevation={4}
                      $pressed={{ 
                        opacity: 0.8,
                        transform: [{ scale: 0.95 }]
                      }}
                    >
                      <Text color={suggestion.color} fontSize="$sm" fontWeight="$semibold">
                        {suggestion.text}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </VStack>
            )}

            {/* Enhanced Input Row */}
            <HStack alignItems="flex-end" space="md">
              <Box flex={1}>
                <Box
                  backgroundColor="$gray100"
                  borderWidth="$2"
                  borderColor="$gray200"
                  borderRadius="$3xl"
                  paddingHorizontal="$5"
                  paddingVertical="$4"
                  minHeight={56}
                  shadowColor="$gray300"
                  shadowOffset={{ width: 0, height: 2 }}
                  shadowOpacity={0.1}
                  shadowRadius={8}
                  elevation={4}
                  $focus={{
                    borderColor: "$blue400",
                    shadowColor: "$blue200",
                    shadowOpacity: 0.2,
                  }}
                >
                  <TextInput
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Ask me anything about investments..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    maxLength={1000}
                    style={{
                      fontSize: 16,
                      color: '#1F2937',
                      lineHeight: 22,
                      minHeight: 24,
                      maxHeight: 100,
                      textAlignVertical: 'top',
                      paddingTop: Platform.OS === 'android' ? 0 : 2,
                    }}
                    returnKeyType="send"
                    onSubmitEditing={() => {
                      if (inputText.trim() && !isTyping) {
                        sendMessage();
                      }
                    }}
                    blurOnSubmit={false}
                  />
                </Box>
              </Box>

              {/* Enhanced Send Button */}
              <Pressable
                disabled={!inputText.trim() || isTyping}
                onPress={() => sendMessage()}
                width="$14"
                height="$14"
                alignItems="center"
                justifyContent="center"
                borderRadius="$full"
                shadowColor="$blue400"
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={0.3}
                shadowRadius={8}
                elevation={8}
                $pressed={{ opacity: 0.8, transform: [{ scale: 0.95 }] }}
              >
                <LinearGradient
                  colors={
                    !inputText.trim() || isTyping
                      ? ["#E5E7EB", "#D1D5DB"]
                      : ["#667eea", "#764ba2"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons 
                    name={isTyping ? "hourglass" : "arrow-up"} 
                    size={24} 
                    color="white" 
                  />
                </LinearGradient>
              </Pressable>
            </HStack>
          </LinearGradient>
        </Box>
      </KeyboardAvoidingView>
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/*  Styles                                                                    */
/* -------------------------------------------------------------------------- */
const styles = StyleSheet.create({
  round24: { borderRadius: 24 },
  roundFull: { borderRadius: 9999 },
});
