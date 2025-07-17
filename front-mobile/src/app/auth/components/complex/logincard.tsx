import React, { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
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
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  Pressable,
  Spinner,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { signin, TwoFactorRequiredError } from "@auth/services/signin";
import { handleBiometricAuth } from "@/shared/utils/biometricAuth";

// Form validation schema
const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Please enter your password" }),
  rememberMe: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

// Google Icon Component using Ionicons
const GoogleIcon = ({ size = 20 }) => (
  <Ionicons name="logo-google" size={size} color="#4285F4" />
);

export default function LoginCard(): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log("🎯 APP LOGINCARD: Starting signin with enhanced form");
    setIsLoading(true);

    try {
      const responseData = await signin({ 
        email: data.email, 
        password: data.password 
      });
      console.log("Sign-in successful:", responseData);

      const biometricResult = await handleBiometricAuth();
      if (biometricResult.success) {
        Alert.alert("Success", "You have successfully logged in!", [
          {
            text: "OK",
            onPress: () => router.replace("/main/screens/(tabs)/properties"),
          },
        ]);
      } else {
        Alert.alert(
          "Success",
          "Login successful. Biometric authentication skipped.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/main/screens/(tabs)/properties"),
            },
          ]
        );
      }
    } catch (error: any) {
      console.log("🔍 APP LOGINCARD: Caught error in enhanced LoginCard");
      console.error("Sign-in error:", error);

      if (
        error instanceof TwoFactorRequiredError ||
        error?.requires2FA ||
        error?.name === "TwoFactorRequiredError" ||
        error?.message?.includes("2FA verification required") ||
        (error?.userId &&
          error?.email &&
          error?.message?.includes("Password verified"))
      ) {
        console.log("🔐 APP LOGINCARD: 2FA detected, redirecting to 2FA verification");

        try {
          const navigationParams = {
            userId: error.userId?.toString() || "",
            email: error.email || "",
          };

          router.replace({
            pathname: "/auth/screens/Login/TwoFactorLogin",
            params: navigationParams,
          });

          return;
        } catch (navError) {
          console.error("❌ APP LOGINCARD: Navigation error:", navError);
          setError("root", {
            message: "Unable to navigate to 2FA screen. Please try again."
          });
          return;
        }
      }

      setError("root", {
        message: error.message || "Unable to sign in. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign In clicked");
    // TODO: Implement Google Sign In
  };

  const handleForgotPassword = () => {
    if (!isLoading) {
      router.replace("auth/screens/Login/forgotPassword/forgotPassword");
    }
  };

  return (
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
            Login to Your Account
      </Text>
          <Text fontSize="$sm" color="$gray500" textAlign="center" lineHeight="$sm">
            Enter your credentials below to access the admin dashboard.
      </Text>
        </VStack>

        {/* Form */}
        <VStack space="xl">
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

          {/* Password Field */}
          <FormControl isInvalid={!!errors.password}>
            <HStack justifyContent="space-between" alignItems="center" marginBottom="$2">
              <FormControlLabel>
                <FormControlLabelText fontSize="$sm" fontWeight="$medium" color="$gray700">
                  Password
                </FormControlLabelText>
              </FormControlLabel>
              <Pressable onPress={handleForgotPassword}>
                <Text fontSize="$sm" color="$blue600" fontWeight="$medium">
                  Forgot password?
                </Text>
              </Pressable>
            </HStack>
            <Controller
              control={control}
              name="password"
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
                    placeholder="••••••••••"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                    fontSize="$sm"
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    padding="$3"
                  >
                    <Ionicons 
                      name={showPassword ? "eye-off" : "eye"} 
                      size={20} 
                      color="#9CA3AF" 
                    />
                  </Pressable>
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorText fontSize="$sm">
                {errors.password?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          {/* Remember Me */}
          <Controller
            control={control}
            name="rememberMe"
            render={({ field: { onChange, value } }) => (
              <HStack space="sm" alignItems="center">
                <Checkbox
                  size="sm"
                  isChecked={value}
                  onChange={onChange}
                  isDisabled={isLoading}
                  borderColor="$gray300"
                  borderRadius="$xs"
                  $checked={{
                    backgroundColor: "$blue600",
                    borderColor: "$blue600",
                  }}
                >
                  <CheckboxIndicator>
                    <CheckboxIcon>
                      <Ionicons name="checkmark" size={12} color="white" />
                    </CheckboxIcon>
                  </CheckboxIndicator>
                </Checkbox>
                <VStack>
                  <Text fontSize="$sm" fontWeight="$medium" color="$gray700">
                    Remember me
                  </Text>
                  <Text fontSize="$xs" color="$gray500">
                    Stay signed in for 30 days
                  </Text>
                </VStack>
              </HStack>
            )}
          />

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

          {/* Sign In Button */}
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
                  Signing In...
                </ButtonText>
              </HStack>
            ) : (
              <ButtonText color="$white" fontWeight="$semibold" fontSize="$sm">
                Sign In
              </ButtonText>
            )}
          </Button>
        </VStack>

        {/* Divider */}
        <HStack alignItems="center" space="md">
          <Box flex={1} height="$0.5" backgroundColor="$gray300" />
          <Text fontSize="$xs" color="$gray500" fontWeight="$medium" textTransform="uppercase">
            OR CONTINUE WITH
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

        {/* Sign Up Link */}
        <HStack justifyContent="center" alignItems="center" space="xs">
          <Text fontSize="$sm" color="$gray600">
            Don't have an account?
        </Text>
          <Pressable 
          onPress={() => {
            if (!isLoading) {
              router.replace("auth/screens/Signup");
            }
          }}
          >
            <Text fontSize="$sm" color="$blue600" fontWeight="$semibold">
              Create an account
            </Text>
          </Pressable>
        </HStack>
      </VStack>
    </Box>
  );
}
