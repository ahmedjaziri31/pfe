import React from "react";
import {
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import {
  Box,
  VStack,
  Center,
  Pressable,
} from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { OTPCard } from "@auth/components/complex";

const Logo = require("@assets/korporBlack.png");

// Background Shapes for visual consistency
const BackgroundShape1 = () => (
  <Box
    position="absolute"
    top={-50}
    left={-50}
    width={150}
    height={150}
    borderRadius={75}
    backgroundColor="$blue100"
    opacity={0.3}
  />
);

const BackgroundShape2 = () => (
  <Box
    position="absolute"
    top={100}
    right={-40}
    width={120}
    height={120}
    borderRadius={60}
    backgroundColor="$blue200"
    opacity={0.2}
  />
);

const BackgroundShape3 = () => (
  <Box
    position="absolute"
    bottom={-60}
    left={-40}
    width={140}
    height={140}
    borderRadius={70}
    backgroundColor="$blue50"
    opacity={0.4}
  />
);

// Floating icon for visual interest
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
    elevation={5}
  >
    <Ionicons name="mail" size={20} color="white" />
  </Box>
);

export default function VerificationScreen() {
  const router = useRouter();
  const { email, userId } = useLocalSearchParams();

  const handleBackPress = () => {
    router.back();
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
          
          {/* Floating Icon */}
          <FloatingIcon />
          
          {/* Gradient Overlay */}
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

          {/* Back Button */}
          <Box position="absolute" top={50} left={20} zIndex={10}>
            <Pressable onPress={handleBackPress}>
              <Box
                width={44}
                height={44}
                borderRadius={22}
                backgroundColor="$white"
                alignItems="center"
                justifyContent="center"
                shadowColor="$black"
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.1}
                shadowRadius={4}
                elevation={3}
              >
                <Ionicons name="chevron-back" size={24} color="#374151" />
              </Box>
            </Pressable>
          </Box>

          {/* Main Content */}
          <Center flex={1} paddingHorizontal="$4">
            <VStack space="xl" alignItems="center" width="100%">
              {/* Logo */}
              <Box marginTop="$8">
                <Box
                  shadowColor="$black"
                  shadowOffset={{ width: 0, height: 4 }}
                  shadowOpacity={0.1}
                  shadowRadius={8}
                  elevation={4}
                >
                  <Image
                    source={Logo}
                    style={{ 
                      resizeMode: "contain",
                      width: 100,
                      height: 100,
                    }}
                  />
                </Box>
              </Box>
              
              {/* OTP Verification Card */}
              <OTPCard email={email as string} userId={userId as string} />
            </VStack>
          </Center>
        </Box>
      </SafeAreaView>
    </>
  );
}
