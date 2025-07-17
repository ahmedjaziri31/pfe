import React, { useState } from "react";
import { Alert } from "react-native";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  ButtonText,
  Spinner,
  Pressable,
} from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { authService } from "@auth/services/authService";
import API_URL from "@shared/constants/api";
import { OTPInput } from "../ui";

interface OTPCardProps {
  email: string;
  userId: string;
}

export default function OTPCard({ email, userId }: OTPCardProps) {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async () => {
    setErrorMessage("");
    setIsLoading(true);

    const code = otp.join("");
    if (code.length < 4) {
      setErrorMessage("Please enter the 4-digit code.");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Verifying email with:", { email, code });
      
      // Use direct API call to avoid automatic token storage
      const response = await fetch(`${API_URL}/api/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Email verification failed");
      }

      const data = await response.json();
      console.log("Email verification successful:", data);

      // Show success message and navigate to sign-in page
      Alert.alert(
        "Account Verified!",
        "Your email has been verified successfully. Please sign in to continue.",
        [
          {
            text: "Sign In",
            onPress: () => {
              // Navigate to sign-in page instead of auto-login
              router.replace("/auth/screens/Login");
            },
          },
        ]
      );
    } catch (error: any) {
      console.error("Email verification error:", error);

      let errorMessage = "Verification failed. Please try again.";
      if (error?.message) {
        if (error.message.includes("Invalid") || error.message.includes("wrong")) {
          errorMessage = "Invalid verification code. Please check and try again.";
        } else if (error.message.includes("expired")) {
          errorMessage = "Verification code has expired. Please request a new one.";
        } else {
          errorMessage = error.message;
        }
      }

      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setErrorMessage("");
    
    try {
      const response = await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to resend verification code");
      }

      const data = await response.json();
      console.log("Resend code response:", data);
      
      Alert.alert(
        "Code Sent",
        "A new verification code has been sent to your email.",
        [{ text: "OK" }]
      );
      
      // Clear OTP inputs
      setOtp(["", "", "", ""]);
    } catch (error: any) {
      console.error("Failed to resend code:", error);
      const errorMsg = error?.message || "Failed to resend code. Please try again.";
      setErrorMessage(errorMsg);
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToSignup = () => {
    router.back();
  };

  return (
    <Box
      width="90%"
      maxWidth={400}
      backgroundColor="$white"
      borderRadius="$2xl"
      borderWidth="$1"
      borderColor="$gray200"
      padding="$8"
      shadowColor="$black"
      shadowOffset={{ width: 0, height: 4 }}
      shadowOpacity={0.1}
      shadowRadius={12}
      elevation={4}
    >
      <VStack space="2xl">
        {/* Header */}
        <VStack space="xs" alignItems="center">
          <Text 
            fontSize="$3xl" 
            fontWeight="$bold" 
            color="$gray900" 
            textAlign="center"
            lineHeight="$3xl"
          >
            Verify Your Email
          </Text>
          <Text 
            fontSize="$sm" 
            color="$gray500" 
            textAlign="center" 
            lineHeight="$sm"
            paddingHorizontal="$2"
          >
            We've sent a 4-digit code to {email}. Enter it below to complete your account setup.
          </Text>
        </VStack>

        {/* OTP Input */}
        <VStack space="lg" alignItems="center">
          <Box alignItems="center">
            <OTPInput otp={otp} setOtp={setOtp} />
          </Box>

          {/* Error Message */}
          {errorMessage ? (
            <Box
              backgroundColor="$red50"
              borderColor="$red200"
              borderWidth="$1"
              borderRadius="$md"
              padding="$3"
              width="100%"
            >
              <Text fontSize="$sm" color="$red600" textAlign="center">
                {errorMessage}
              </Text>
            </Box>
          ) : null}

          {/* Verify Button */}
          <Button
            size="lg"
            backgroundColor="$blue600"
            borderRadius="$md"
            height={52}
            width="100%"
            onPress={handleVerify}
            isDisabled={isLoading || isResending}
            $hover={{
              backgroundColor: "$blue700",
            }}
            $pressed={{
              backgroundColor: "$blue700",
              transform: [{ scale: 0.98 }],
            }}
          >
            {isLoading ? (
              <HStack space="sm" alignItems="center">
                <Spinner size="small" color="$white" />
                <ButtonText color="$white" fontWeight="$semibold" fontSize="$sm">
                  Verifying...
                </ButtonText>
              </HStack>
            ) : (
              <ButtonText color="$white" fontWeight="$semibold" fontSize="$sm">
                Verify Email
              </ButtonText>
            )}
          </Button>

          {/* Resend Code Link */}
          <HStack justifyContent="center" alignItems="center" space="xs">
            <Text fontSize="$sm" color="$gray600">
              Didn't receive any code?
            </Text>
            <Pressable 
              onPress={handleResendCode} 
              disabled={isResending || isLoading}
              $pressed={{
                opacity: 0.7,
              }}
            >
              <Text 
                fontSize="$sm" 
                color={isResending || isLoading ? "$gray400" : "$blue600"} 
                fontWeight="$medium"
                textDecorationLine="underline"
              >
                {isResending ? "Sending..." : "Resend Code"}
              </Text>
            </Pressable>
          </HStack>

          {/* Back to Signup Link */}
          <Pressable 
            onPress={handleBackToSignup} 
            disabled={isLoading || isResending}
            $pressed={{
              opacity: 0.7,
            }}
          >
            <Text 
              fontSize="$sm" 
              color="$gray500" 
              textAlign="center"
              textDecorationLine="underline"
            >
              Back to Signup
            </Text>
          </Pressable>
        </VStack>
      </VStack>
    </Box>
  );
}
