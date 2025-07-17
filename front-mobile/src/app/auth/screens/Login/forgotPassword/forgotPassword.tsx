import React, { useState } from "react";
import { SafeAreaView, Image, StatusBar } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  ButtonText,
  Input,
  InputField,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
  Pressable,
  Spinner,
  Center,
} from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { forgotPassword } from "@auth/services/signup";

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
    <Ionicons name="key" size={20} color="white" />
  </Box>
);

// Form validation schema
const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Invalid email address" }),
});

type FormData = z.infer<typeof formSchema>;

// Google Icon Component
const GoogleIcon = ({ size = 20 }) => (
  <Ionicons name="logo-google" size={size} color="#4285F4" />
);

export default function ForgotPass() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await forgotPassword(data.email);
      console.log("Reset link sent to:", data.email);
      // Navigate to OTP screen with email parameter
      router.push({
        pathname: "auth/screens/Login/forgotPassword/OTPReset",
        params: { email: data.email }
      });
    } catch (error: any) {
      setError("root", {
        message: error?.message || "Failed to send reset link. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign In clicked");
    // TODO: Implement Google Sign In
  };

  const handleBackToLogin = () => {
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

          {/* Back Button */}
          <Box position="absolute" top={50} left={20} zIndex={10}>
            <Pressable onPress={handleBackToLogin}>
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
        <Image
          source={Logo}
                  style={{ 
                    resizeMode: "contain",
                    width: 120,
                    height: 120,
                  }}
                />
              </Box>
              
              {/* Forgot Password Card */}
              <Box
                width="90%"
                maxWidth={400}
                backgroundColor="$white"
                borderRadius="$xl"
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
                    <Text fontSize="$2xl" fontWeight="$bold" color="$gray900" textAlign="center">
            Forgot Password?
          </Text>
                    <Text fontSize="$sm" color="$gray500" textAlign="center" lineHeight="$sm">
            Enter your email to reset your password.
          </Text>
                  </VStack>

                  {/* Form */}
                  <VStack space="lg">
                    {/* Email Field */}
                    <FormControl isInvalid={!!errors.email}>
                      <FormControlLabel>
                        <FormControlLabelText fontSize="$sm" fontWeight="$medium" color="$gray700" marginBottom="$2">
                          Email
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <Input
                            size="lg"
                            borderRadius="$md"
                            borderColor="$gray300"
                            backgroundColor="$gray50"
                            height={48}
                            isDisabled={isLoading}
                            $focus={{
                              borderColor: "$blue500",
                              borderWidth: "$2",
                              backgroundColor: "$white",
                            }}
                          >
                            <InputField
                              placeholder="name@example.com"
                              value={value}
                              onChangeText={onChange}
                              onBlur={onBlur}
                              keyboardType="email-address"
                              autoCapitalize="none"
                              autoComplete="email"
                              fontSize="$sm"
                            />
                          </Input>
                        )}
                      />
                      <FormControlError>
                        <FormControlErrorText fontSize="$sm">
                          {errors.email?.message}
                        </FormControlErrorText>
                      </FormControlError>
                    </FormControl>

                    {/* Error Message */}
                    {errors.root && (
                      <Box
                        backgroundColor="$red50"
                        borderColor="$red200"
                        borderWidth="$1"
                        borderRadius="$md"
                        padding="$3"
                      >
                        <Text fontSize="$sm" color="$red600">
                          {errors.root.message}
                        </Text>
                      </Box>
                    )}

                    {/* Send Reset Link Button */}
                    <Button
                      size="lg"
                      backgroundColor="$blue600"
                      borderRadius="$md"
                      height={48}
                      onPress={handleSubmit(onSubmit)}
                      isDisabled={isLoading}
                      $hover={{
                        backgroundColor: "$blue700",
                      }}
                      $pressed={{
                        backgroundColor: "$blue700",
                      }}
                    >
                      {isLoading ? (
                        <HStack space="sm" alignItems="center">
                          <Spinner size="small" color="$white" />
                          <ButtonText color="$white" fontWeight="$semibold" fontSize="$sm">
                            Sending...
                          </ButtonText>
                        </HStack>
                      ) : (
                        <ButtonText color="$white" fontWeight="$semibold" fontSize="$sm">
                          Send Reset Link
                        </ButtonText>
                      )}
                    </Button>
                  </VStack>

                  {/* Divider */}
                  <HStack alignItems="center" space="md">
                    <Box flex={1} height="$0.5" backgroundColor="$gray300" />
                    <Text fontSize="$xs" color="$gray500" fontWeight="$medium" textTransform="uppercase">
                      OR
                    </Text>
                    <Box flex={1} height="$0.5" backgroundColor="$gray300" />
                  </HStack>

                  {/* Google Sign In Button */}
                  <Button
                    variant="outline"
                    size="lg"
                    onPress={handleGoogleSignIn}
                    isDisabled={isLoading}
                    borderColor="$gray300"
                    backgroundColor="$white"
                    borderRadius="$md"
                    height={48}
                    $hover={{
                      backgroundColor: "$gray50",
                    }}
                  >
                    <HStack space="sm" alignItems="center">
                      <GoogleIcon size={20} />
                      <ButtonText color="$gray700" fontWeight="$medium" fontSize="$sm">
                        Continue with Google
                      </ButtonText>
                    </HStack>
                  </Button>

                  {/* Back to Login Link */}
                  <HStack justifyContent="center" alignItems="center" space="xs">
                    <Text fontSize="$sm" color="$gray600">
                      Remember your password?
                    </Text>
                    <Pressable onPress={handleBackToLogin}>
                      <Text fontSize="$sm" color="$blue600" fontWeight="$semibold">
                        Back to Login
                      </Text>
                    </Pressable>
                  </HStack>
                </VStack>
              </Box>
            </VStack>
          </Center>
        </Box>
      </SafeAreaView>
    </>
  );
}
