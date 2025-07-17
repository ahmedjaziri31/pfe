import React, { useState } from "react";
import { SafeAreaView, Image, StatusBar } from "react-native";
import { router as ExpoRouter, useLocalSearchParams } from "expo-router";
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
  FormControlError,
  FormControlErrorText,
  Pressable,
  Spinner,
  Center,
} from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { resendVerificationCode } from "@auth/services/signup";

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
    <Ionicons name="shield-checkmark" size={20} color="white" />
  </Box>
);

// Form validation schema
const formSchema = z.object({
  digit1: z.string().min(1, "Required").max(1, "Only 1 digit"),
  digit2: z.string().min(1, "Required").max(1, "Only 1 digit"),
  digit3: z.string().min(1, "Required").max(1, "Only 1 digit"),
  digit4: z.string().min(1, "Required").max(1, "Only 1 digit"),
  digit5: z.string().min(1, "Required").max(1, "Only 1 digit"),
  digit6: z.string().min(1, "Required").max(1, "Only 1 digit"),
});

type FormData = z.infer<typeof formSchema>;

// OTP Input Component
const OTPInputField = ({ 
  value, 
  onChangeText, 
  onBlur, 
  isDisabled, 
  isInvalid, 
  inputRef, 
  onKeyPress 
}: any) => (
  <Input
    width={50}
    height={50}
    borderRadius="$md"
    borderColor={isInvalid ? "$red400" : "$gray300"}
    backgroundColor="$gray50"
    isDisabled={isDisabled}
    $focus={{
      borderColor: "$blue500",
      borderWidth: "$2",
      backgroundColor: "$white",
    }}
  >
    <InputField
      ref={inputRef}
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      onKeyPress={onKeyPress}
      keyboardType="numeric"
      maxLength={1}
      textAlign="center"
      fontSize="$lg"
      fontWeight="$bold"
    />
  </Input>
);

export default function OTPReset(): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [inputRefs] = useState<any[]>([]);
  const { email } = useLocalSearchParams();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      digit1: "",
      digit2: "",
      digit3: "",
      digit4: "",
      digit5: "",
      digit6: "",
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: FormData) => {
    const code = `${data.digit1}${data.digit2}${data.digit3}${data.digit4}${data.digit5}${data.digit6}`;
    setIsLoading(true);
    
    try {
      // Since backend doesn't have separate verification endpoint,
      // we'll just navigate to password reset with the code
      console.log("OTP entered:", code);
      ExpoRouter.push({
        pathname: "auth/screens/Login/forgotPassword/resetPassword",
        params: { email: email as string, code }
      });
    } catch (error: any) {
      setError("root", {
        message: error?.message || "Invalid verification code. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async (): Promise<void> => {
    if (!email) return;
    
    setIsResending(true);
    try {
      await resendVerificationCode(email as string);
      console.log("Resend code sent to:", email);
      // You could show a success message here
    } catch (error: any) {
      console.error("Failed to resend code:", error);
      setError("root", {
        message: error?.message || "Failed to resend code. Please try again."
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToForgotPassword = () => {
    ExpoRouter.back();
  };

  const handleOTPChange = (text: string, index: number, fieldName: keyof FormData) => {
    setValue(fieldName, text);
    
    // Auto-focus next input
    if (text && index < 5) {
      inputRefs[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace to focus previous input
    if (e.nativeEvent.key === 'Backspace' && index > 0 && !watchedValues[`digit${index + 1}` as keyof FormData]) {
      inputRefs[index - 1]?.focus();
    }
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
            <Pressable onPress={handleBackToForgotPassword}>
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
              
              {/* OTP Verification Card */}
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
    Verify it's You
  </Text>
                    <Text fontSize="$sm" color="$gray500" textAlign="center" lineHeight="$sm">
    We've sent a 6-digit code to your email. Enter it below to continue.
  </Text>
                  </VStack>

                  {/* OTP Input */}
                  <VStack space="lg" alignItems="center">
                    <FormControl isInvalid={!!(errors.digit1 || errors.digit2 || errors.digit3 || errors.digit4 || errors.digit5 || errors.digit6)}>
                      <HStack space="sm" justifyContent="center" flexWrap="wrap">
                        <Controller
                          control={control}
                          name="digit1"
                          render={({ field: { onChange, onBlur, value } }) => (
                            <OTPInputField
                              value={value}
                              onChangeText={(text: string) => handleOTPChange(text, 0, "digit1")}
                              onBlur={onBlur}
                              isDisabled={isLoading}
                              isInvalid={!!errors.digit1}
                              inputRef={(ref: any) => (inputRefs[0] = ref)}
                              onKeyPress={(e: any) => handleKeyPress(e, 0)}
                            />
                          )}
                        />
                        <Controller
                          control={control}
                          name="digit2"
                          render={({ field: { onChange, onBlur, value } }) => (
                            <OTPInputField
                              value={value}
                              onChangeText={(text: string) => handleOTPChange(text, 1, "digit2")}
                              onBlur={onBlur}
                              isDisabled={isLoading}
                              isInvalid={!!errors.digit2}
                              inputRef={(ref: any) => (inputRefs[1] = ref)}
                              onKeyPress={(e: any) => handleKeyPress(e, 1)}
                            />
                          )}
                        />
                        <Controller
                          control={control}
                          name="digit3"
                          render={({ field: { onChange, onBlur, value } }) => (
                            <OTPInputField
                              value={value}
                              onChangeText={(text: string) => handleOTPChange(text, 2, "digit3")}
                              onBlur={onBlur}
                              isDisabled={isLoading}
                              isInvalid={!!errors.digit3}
                              inputRef={(ref: any) => (inputRefs[2] = ref)}
                              onKeyPress={(e: any) => handleKeyPress(e, 2)}
                            />
                          )}
                        />
                        <Controller
                          control={control}
                          name="digit4"
                          render={({ field: { onChange, onBlur, value } }) => (
                            <OTPInputField
                              value={value}
                              onChangeText={(text: string) => handleOTPChange(text, 3, "digit4")}
                              onBlur={onBlur}
                              isDisabled={isLoading}
                              isInvalid={!!errors.digit4}
                              inputRef={(ref: any) => (inputRefs[3] = ref)}
                              onKeyPress={(e: any) => handleKeyPress(e, 3)}
                            />
                          )}
                        />
                        <Controller
                          control={control}
                          name="digit5"
                          render={({ field: { onChange, onBlur, value } }) => (
                            <OTPInputField
                              value={value}
                              onChangeText={(text: string) => handleOTPChange(text, 4, "digit5")}
                              onBlur={onBlur}
                              isDisabled={isLoading}
                              isInvalid={!!errors.digit5}
                              inputRef={(ref: any) => (inputRefs[4] = ref)}
                              onKeyPress={(e: any) => handleKeyPress(e, 4)}
                            />
                          )}
                        />
                        <Controller
                          control={control}
                          name="digit6"
                          render={({ field: { onChange, onBlur, value } }) => (
                            <OTPInputField
                              value={value}
                              onChangeText={(text: string) => handleOTPChange(text, 5, "digit6")}
                              onBlur={onBlur}
                              isDisabled={isLoading}
                              isInvalid={!!errors.digit6}
                              inputRef={(ref: any) => (inputRefs[5] = ref)}
                              onKeyPress={(e: any) => handleKeyPress(e, 5)}
                            />
                          )}
                        />
                      </HStack>
                      <FormControlError>
                        <FormControlErrorText fontSize="$sm" textAlign="center">
                          Please enter the complete verification code
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
                        width="100%"
                      >
                        <Text fontSize="$sm" color="$red600" textAlign="center">
                          {errors.root.message}
            </Text>
                      </Box>
                    )}

                    {/* Verify Button */}
                    <Button
                      size="lg"
                      backgroundColor="$blue600"
                      borderRadius="$md"
                      height={48}
                      width="100%"
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
                            Verifying...
                          </ButtonText>
                        </HStack>
                      ) : (
                        <ButtonText color="$white" fontWeight="$semibold" fontSize="$sm">
                          Verify & Continue
                        </ButtonText>
                      )}
                    </Button>

                    {/* Resend Code Link */}
                    <HStack justifyContent="center" alignItems="center" space="xs">
                      <Text fontSize="$sm" color="$gray600">
                        Didn't receive any code?
                      </Text>
                      <Pressable onPress={handleResend} disabled={isResending}>
                        <Text fontSize="$sm" color="$blue600" fontWeight="$semibold">
                          {isResending ? "Sending..." : "Resend Code"}
            </Text>
                      </Pressable>
                    </HStack>
                  </VStack>
                </VStack>
              </Box>
            </VStack>
          </Center>
        </Box>
      </SafeAreaView>
    </>
  );
}
