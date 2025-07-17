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
} from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import TestSignupCard from "@auth/components/complex/testSignupCard";

const Logo = require("@assets/korporBlack.png");

// Minimal Background Shapes for visual consistency (smaller and fewer)
const BackgroundShape1 = () => (
  <Box
    position="absolute"
    top={-30}
    left={-30}
    width={120}
    height={120}
    borderRadius={60}
    backgroundColor="$blue100"
    opacity={0.2}
  />
);

const BackgroundShape2 = () => (
  <Box
    position="absolute"
    top={80}
    right={-50}
    width={100}
    height={100}
    borderRadius={50}
    backgroundColor="$blue200"
    opacity={0.15}
  />
);

const BackgroundShape3 = () => (
  <Box
    position="absolute"
    bottom={-40}
    left={-30}
    width={110}
    height={110}
    borderRadius={55}
    backgroundColor="$blue50"
    opacity={0.3}
  />
);

// Small floating icon for visual interest
const FloatingIcon = () => (
  <Box
    position="absolute"
    top={60}
    right={30}
    width={32}
    height={32}
    borderRadius={16}
    backgroundColor="$blue500"
    opacity={0.7}
    alignItems="center"
    justifyContent="center"
    shadowColor="$blue500"
    shadowOffset={{ width: 0, height: 2 }}
    shadowOpacity={0.2}
    shadowRadius={4}
    elevation={3}
  >
    <Ionicons name="person-add" size={16} color="white" />
  </Box>
);

export default function Signup() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f1f5f9" />
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} backgroundColor="$gray50" position="relative">
          {/* Minimal Background Shapes */}
          <BackgroundShape1 />
          <BackgroundShape2 />
          <BackgroundShape3 />
          
          {/* Small Floating Icon */}
          <FloatingIcon />
          
          {/* Subtle Gradient Overlay */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            height={200}
            opacity={0.4}
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
            <VStack space="lg" alignItems="center" width="100%">
              {/* Compact Logo - Much smaller than login */}
              <Box marginTop="$20" marginBottom="$1">
                <Box
                  shadowColor="$black"
                  shadowOffset={{ width: 0, height: 4 }}
                  shadowOpacity={0.08}
                  shadowRadius={8}
                  elevation={4}
                >
                  <Image
                    source={Logo}
                    style={{ 
                      resizeMode: "contain",
                      width: 80,  // Much smaller than login (120px) and landing (140px)
                      height: 80,
                    }}
                  />
                </Box>
              </Box>
              
              {/* Signup Card */}
              <TestSignupCard />
            </VStack>
          </Center>
        </Box>
      </SafeAreaView>
    </>
  );
}
