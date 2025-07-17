import React from "react";
import { SafeAreaView, Image, StatusBar } from "react-native";
import { router } from "expo-router";
import {
  Box,
  VStack,
  Text,
  Button,
  ButtonText,
  Pressable,
  Center,
} from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

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
    backgroundColor="$green100"
    opacity={0.3}
  />
);

const BackgroundShape2 = () => (
  <Box
    position="absolute"
    top={100}
    right={-30}
    width={150}
    height={150}
    borderRadius={75}
    backgroundColor="$blue100"
    opacity={0.2}
  />
);

const BackgroundShape3 = () => (
  <Box
    position="absolute"
    bottom={200}
    left={-40}
    width={120}
    height={120}
    borderRadius={60}
    backgroundColor="$purple100"
    opacity={0.25}
  />
);

const FloatingIcon = () => (
  <Box
    position="absolute"
    top={150}
    right={50}
    padding="$3"
    borderRadius="$full"
    backgroundColor="$white"
    shadowColor="$black"
    shadowOffset={{ width: 0, height: 2 }}
    shadowOpacity={0.1}
    shadowRadius={4}
    elevation={3}
  >
    <Ionicons name="checkmark-circle" size={24} color="#10B981" />
  </Box>
);

export default function ResetDone() {
  const handleLogin = () => {
    router.replace("/auth/screens/Login" as any);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <LinearGradient
        colors={["#FFFFFF", "#F8FAFC", "#EFF6FF"]}
        style={{ flex: 1 }}
      >
        {/* Background Decorations */}
        <BackgroundShape1 />
        <BackgroundShape2 />
        <BackgroundShape3 />
        <FloatingIcon />

        {/* Header with Back Button */}
        <Box paddingHorizontal="$4" paddingTop="$2">
          <Pressable
            onPress={handleBack}
            padding="$2"
            borderRadius="$full"
            $hover={{ backgroundColor: "$gray100" }}
            $pressed={{ backgroundColor: "$gray200" }}
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </Pressable>
        </Box>

        <Center flex={1} paddingHorizontal="$4">
          <VStack space="2xl" alignItems="center" width="100%">
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

            {/* Success Card */}
            <Box
              width="90%"
              maxWidth={400}
              backgroundColor="$white"
              borderRadius="$2xl"
              borderWidth="$1"
              borderColor="$gray200"
              padding="$8"
              shadowColor="$black"
              shadowOffset={{ width: 0, height: 8 }}
              shadowOpacity={0.1}
              shadowRadius={24}
              elevation={8}
            >
              <VStack space="2xl" alignItems="center">
                {/* Success Icon */}
                <Box
                  padding="$4"
                  borderRadius="$full"
                  backgroundColor="$green50"
                  borderWidth="$2"
                  borderColor="$green200"
                >
                  <Ionicons name="checkmark-circle" size={48} color="#10B981" />
                </Box>

                {/* Header */}
                <VStack space="xs" alignItems="center">
                  <Text fontSize="$3xl" fontWeight="$bold" color="$gray900" textAlign="center" lineHeight="$3xl">
                    You're All Set!
                  </Text>
                  <Text fontSize="$sm" color="$gray500" textAlign="center" lineHeight="$sm" marginTop="$2">
                    Your password has been changed successfully. You can now log in with your new password.
                  </Text>
                </VStack>

                {/* Login Button */}
                <Button
                  size="lg"
                  backgroundColor="$blue600"
                  borderRadius="$md"
                  height={56}
                  width="100%"
                  onPress={handleLogin}
                  shadowColor="$blue600"
                  shadowOffset={{ width: 0, height: 4 }}
                  shadowOpacity={0.2}
                  shadowRadius={8}
                  elevation={4}
                  $hover={{
                    backgroundColor: "$blue700",
                    shadowOpacity: 0.3,
                  }}
                  $pressed={{
                    backgroundColor: "$blue700",
                    transform: [{ scale: 0.98 }],
                  }}
                >
                  <ButtonText color="$white" fontWeight="$semibold" fontSize="$sm">
                    Continue to Login
                  </ButtonText>
                </Button>
              </VStack>
            </Box>
          </VStack>
        </Center>
      </LinearGradient>
    </SafeAreaView>
  );
}
