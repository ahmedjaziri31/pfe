import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  Image,
} from "react-native";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  ButtonText,
  Center,
} from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { authService } from "./auth/services/authService";
import { useFonts } from "expo-font";
import { handleBiometricAuth } from "@/shared/utils/biometricAuth";
import "../../global.css";

const logo = require("@assets/logo-black.png");
const korporLogo = require("@assets/korporBlack.png");

// Background Shapes Components - Enhanced for landing page
const BackgroundShape1 = () => (
  <Box
    position="absolute"
    top={-30}
    left={-30}
    width={180}
    height={180}
    borderRadius={90}
    backgroundColor="$blue100"
    opacity={0.4}
  />
);

const BackgroundShape2 = () => (
  <Box
    position="absolute"
    top={120}
    right={-60}
    width={140}
    height={140}
    borderRadius={70}
    backgroundColor="$blue200"
    opacity={0.3}
  />
);

const BackgroundShape3 = () => (
  <Box
    position="absolute"
    bottom={-40}
    left={-20}
    width={160}
    height={160}
    borderRadius={80}
    backgroundColor="$blue50"
    opacity={0.5}
  />
);

const BackgroundShape4 = () => (
  <Box
    position="absolute"
    bottom={180}
    right={-50}
    width={120}
    height={120}
    borderRadius={60}
    backgroundColor="$blue300"
    opacity={0.2}
  />
);

const BackgroundShape5 = () => (
  <Box
    position="absolute"
    top={280}
    left={60}
    width={80}
    height={80}
    borderRadius={40}
    backgroundColor="$blue400"
    opacity={0.15}
  />
);

// Floating Icons for visual interest
const FloatingIcon1 = () => (
  <Box
    position="absolute"
    top={100}
    right={50}
    width={35}
    height={35}
    borderRadius={17.5}
    backgroundColor="$blue500"
    opacity={0.8}
    alignItems="center"
    justifyContent="center"
    shadowColor="$blue500"
    shadowOffset={{ width: 0, height: 4 }}
    shadowOpacity={0.3}
    shadowRadius={8}
    elevation={6}
  >
    <Ionicons name="home" size={18} color="white" />
  </Box>
);

const FloatingIcon2 = () => (
  <Box
    position="absolute"
    top={200}
    left={30}
    width={30}
    height={30}
    borderRadius={15}
    backgroundColor="$blue600"
    opacity={0.7}
    alignItems="center"
    justifyContent="center"
    shadowColor="$blue600"
    shadowOffset={{ width: 0, height: 3 }}
    shadowOpacity={0.2}
    shadowRadius={6}
    elevation={4}
  >
    <Ionicons name="trending-up" size={16} color="white" />
  </Box>
);

const FloatingIcon3 = () => (
  <Box
    position="absolute"
    bottom={300}
    right={40}
    width={28}
    height={28}
    borderRadius={14}
    backgroundColor="$blue400"
    opacity={0.6}
    alignItems="center"
    justifyContent="center"
    shadowColor="$blue400"
    shadowOffset={{ width: 0, height: 2 }}
    shadowOpacity={0.2}
    shadowRadius={4}
    elevation={3}
  >
    <Ionicons name="wallet" size={14} color="white" />
  </Box>
);

export default function App() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [fontsLoaded] = useFonts({
    Poppins: require("@assets/fonts/poppins/Poppins-SemiBold.ttf"),
  });

  // Check if user is already authenticated using AuthService
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        //is user already authenticated?
        const isAuthenticated = await authService.isAuthenticated();

        if (isAuthenticated) {
          console.log("✅ App: User is authenticated, redirecting to main app");
          router.replace("main/screens/(tabs)/properties");
          return;
        }

        console.log("App: User not authenticated, showing landing page");
      } catch (error) {
        console.error("App: Error checking authentication:", error);
        // if error, show landing page
      } finally {
        // set is checking auth to false
        setIsCheckingAuth(false);
      }
    };

    checkAuthentication();
  }, []);

  if (!fontsLoaded || isCheckingAuth) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} backgroundColor="$gray50" justifyContent="center" alignItems="center">
          <StatusBar style="dark" translucent backgroundColor="transparent" />
          <Image
            style={{ resizeMode: "contain" }}
            source={logo}
            className="w-36 h-36 self-center"
          />
          <Text fontSize="$lg" color="$gray500" marginTop="$4">Loading...</Text>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <>
      <StatusBar style="dark" backgroundColor="#f1f5f9" />
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} backgroundColor="$gray50" position="relative">
          {/* Background Shapes */}
          <BackgroundShape1 />
          <BackgroundShape2 />
          <BackgroundShape3 />
          <BackgroundShape4 />
          <BackgroundShape5 />
          
          {/* Floating Icons */}
          <FloatingIcon1 />
          <FloatingIcon2 />
          <FloatingIcon3 />
          
          {/* Additional Gradient Overlay */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            height={300}
            opacity={0.6}
          >
            <LinearGradient
              colors={['#dbeafe', '#f1f5f9', 'transparent']}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </Box>

          {/* Main Content */}
          <Center flex={1} paddingHorizontal="$6">
            <VStack space="2xl" alignItems="center" width="100%" justifyContent="center">
              {/* Logo Section */}
              <VStack space="lg" alignItems="center" marginBottom="$8">
                <Box
                  shadowColor="$black"
                  shadowOffset={{ width: 0, height: 8 }}
                  shadowOpacity={0.1}
                  shadowRadius={16}
                  elevation={8}
                >
                  <Image
                    style={{ 
                      resizeMode: "contain",
                      width: 140,
                      height: 140,
                    }}
                    source={korporLogo}
                  />
                </Box>
                
                {/* Welcome Text */}
                <VStack space="sm" alignItems="center">
                  <Text 
                    fontSize="$4xl" 
                    fontWeight="$bold" 
                    color="$gray900" 
                    textAlign="center"
                    lineHeight="$4xl"
                  >
                    Welcome to Korpor
                  </Text>
                  <Text 
                    fontSize="$lg" 
                    color="$gray600" 
                    textAlign="center"
                    lineHeight="$lg"
                    paddingHorizontal="$4"
                  >
                    Your gateway to smart real estate investments
                  </Text>
                </VStack>
              </VStack>

              {/* Features Preview */}
              <VStack space="md" width="100%" marginBottom="$8">
                <HStack space="md" justifyContent="center" alignItems="center">
                  <Box
                    backgroundColor="$blue50"
                    padding="$3"
                    borderRadius="$full"
                    borderWidth="$1"
                    borderColor="$blue200"
                  >
                    <Ionicons name="shield-checkmark" size={20} color="#3B82F6" />
                  </Box>
                  <Text fontSize="$sm" color="$gray700" flex={1}>
                    Secure & regulated platform
                  </Text>
                </HStack>
                
                <HStack space="md" justifyContent="center" alignItems="center">
                  <Box
                    backgroundColor="$green50"
                    padding="$3"
                    borderRadius="$full"
                    borderWidth="$1"
                    borderColor="$green200"
                  >
                    <Ionicons name="trending-up" size={20} color="#10B981" />
                  </Box>
                  <Text fontSize="$sm" color="$gray700" flex={1}>
                    Start investing from as low as $100
                  </Text>
                </HStack>
                
                <HStack space="md" justifyContent="center" alignItems="center">
                  <Box
                    backgroundColor="$purple50"
                    padding="$3"
                    borderRadius="$full"
                    borderWidth="$1"
                    borderColor="$purple200"
                  >
                    <Ionicons name="people" size={20} color="#8B5CF6" />
                  </Box>
                  <Text fontSize="$sm" color="$gray700" flex={1}>
                    Join thousands of investors
                  </Text>
                </HStack>
              </VStack>

              {/* Action Buttons */}
              <VStack space="md" width="100%" maxWidth={400}>
                <Button
                  size="lg"
                  backgroundColor="$blue600"
                  borderRadius="$xl"
                  height={56}
                  onPress={() => {
                    router.push("auth/screens/Signup");
                  }}
                  shadowColor="$blue600"
                  shadowOffset={{ width: 0, height: 4 }}
                  shadowOpacity={0.3}
                  shadowRadius={8}
                  elevation={6}
                  $hover={{
                    backgroundColor: "$blue700",
                  }}
                  $pressed={{
                    backgroundColor: "$blue700",
                  }}
                >
                  <ButtonText color="$white" fontWeight="$bold" fontSize="$lg">
                    Get Started
                  </ButtonText>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  borderColor="$gray300"
                  backgroundColor="$white"
                  borderRadius="$xl"
                  height={56}
                  onPress={() => {
                    router.push("auth/screens/Login");
                  }}
                  $hover={{
                    backgroundColor: "$gray50",
                  }}
                  $pressed={{
                    backgroundColor: "$gray50",
                  }}
                >
                  <ButtonText color="$gray700" fontWeight="$semibold" fontSize="$lg">
                    Sign In
                  </ButtonText>
                </Button>
              </VStack>

              {/* Legal Text */}
              <Box marginTop="$4">
                <Text fontSize="$xs" color="$gray500" textAlign="center" lineHeight="$xs">
                  By continuing, you agree to our Terms of Service
                  {"\n"}and Privacy Policy
                </Text>
              </Box>
            </VStack>
          </Center>
        </Box>
      </SafeAreaView>
    </>
  );
}
