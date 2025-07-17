import React from "react";
import {
  SafeAreaView,
  Image,
  StatusBar,
} from "react-native";
import {
  Box,
  VStack,
  Center,
} from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { LoginCard } from "@auth/components/complex/index";
import { useRouter } from "expo-router";

const Logo = require("@assets/korporBlack.png");

// Background Shapes Components
const BackgroundShape1 = () => (
  <Box
    position="absolute"
    top={-50}
    left={-50}
    width={200}
    height={200}
    borderRadius={100}
    backgroundColor="$blue100"
    opacity={0.3}
  />
);

const BackgroundShape2 = () => (
  <Box
    position="absolute"
    top={100}
    right={-80}
    width={160}
    height={160}
    borderRadius={80}
    backgroundColor="$blue200"
    opacity={0.2}
  />
);

const BackgroundShape3 = () => (
  <Box
    position="absolute"
    bottom={-60}
    left={-40}
    width={180}
    height={180}
    borderRadius={90}
    backgroundColor="$blue50"
    opacity={0.4}
  />
);

const BackgroundShape4 = () => (
  <Box
    position="absolute"
    bottom={200}
    right={-70}
    width={140}
    height={140}
    borderRadius={70}
    backgroundColor="$blue300"
    opacity={0.15}
  />
);

const BackgroundShape5 = () => (
  <Box
    position="absolute"
    top={250}
    left={50}
    width={60}
    height={60}
    borderRadius={30}
    backgroundColor="$blue400"
    opacity={0.1}
  />
);

// Floating Icon Element
const FloatingIcon = () => (
  <Box
    position="absolute"
    top={80}
    right={40}
    width={40}
    height={40}
    borderRadius={20}
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
    <Ionicons name="business" size={20} color="white" />
  </Box>
);

export default function Login() {
  const router = useRouter();

  const handleGoBack = () => {
    router.replace("/"); // Go back to the main screen with signup/login buttons
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f1f5f9" />
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} backgroundColor="$gray50" position="relative">
          {/* Background Shapes */}
          <BackgroundShape1 />
          <BackgroundShape2 />
          <BackgroundShape3 />
          <BackgroundShape4 />
          <BackgroundShape5 />
          
          {/* Floating Icon */}
          <FloatingIcon />
          
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
          <Center flex={1} paddingHorizontal="$4">
            <VStack space="xl" alignItems="center" width="100%">
              {/* Logo */}
              <Box marginTop="$8">
                <Image
                  source={Logo}
                  style={{ 
                    resizeMode: "contain",
                    width: 120,
                    height: 120,
                  }}
                />
              </Box>
              
              {/* Login Card */}
              <LoginCard />
            </VStack>
          </Center>
        </Box>
      </SafeAreaView>
    </>
  );
}
