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
  Pressable,
  Spinner,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { resetPassword } from "@auth/services/signup";

// Form validation schema
const formSchema = z.object({
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Must be at least 6 characters" }),
  confirmPassword: z
    .string()
    .min(1, { message: "Please confirm password" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

interface PasswordResetCardProps {
  email: string;
  code: string;
}

export default function PasswordResetCard({ email, code }: PasswordResetCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await resetPassword(email, code, data.password);
      console.log("Password updated successfully");
      
      Alert.alert(
        "Password Updated!",
        "Your password has been changed successfully.",
        [
          {
            text: "Continue",
            onPress: () => {
              router.replace("/auth/screens/Login" as any);
            },
          },
        ]
      );
    } catch (error: any) {
      console.error("Password reset error:", error);
      setError("root", {
        message: error?.message || "Failed to update password. Please try again."
      });
    } finally {
      setIsLoading(false);
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
      padding="$6"
      shadowColor="$black"
      shadowOffset={{ width: 0, height: 4 }}
      shadowOpacity={0.1}
      shadowRadius={12}
      elevation={4}
    >
      <VStack space="lg">
        {/* Header */}
        <VStack space="sm" alignItems="center">
          <Text fontSize="$2xl" fontWeight="$bold" color="$gray900" textAlign="center">
            Create New Password
          </Text>
          <Text fontSize="$sm" color="$gray500" textAlign="center" lineHeight="$sm">
            Enter your new password below
          </Text>
        </VStack>

        {/* Form Fields */}
        <VStack space="md">
          {/* Password Field */}
          <FormControl isInvalid={!!errors.password}>
            <FormControlLabel>
              <FormControlLabelText 
                fontSize="$sm" 
                fontWeight="$medium" 
                color="$black"
                marginBottom="$1"
              >
                New Password
              </FormControlLabelText>
            </FormControlLabel>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  backgroundColor="$gray100"
                  borderWidth="$0"
                  borderRadius="$md"
                  height={44}
                  isDisabled={isLoading}
                >
                  <InputField
                    placeholder="Enter new password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showPassword}
                    fontSize="$sm"
                    color="$black"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    padding="$2"
                  >
                    <Ionicons 
                      name={showPassword ? "eye-off" : "eye"} 
                      size={20} 
                      color="#666" 
                    />
                  </Pressable>
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorText fontSize="$xs" color="$red500">
                {errors.password?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          {/* Confirm Password Field */}
          <FormControl isInvalid={!!errors.confirmPassword}>
            <FormControlLabel>
              <FormControlLabelText 
                fontSize="$sm" 
                fontWeight="$medium" 
                color="$black"
                marginBottom="$1"
              >
                Confirm Password
              </FormControlLabelText>
            </FormControlLabel>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  backgroundColor="$gray100"
                  borderWidth="$0"
                  borderRadius="$md"
                  height={44}
                  isDisabled={isLoading}
                >
                  <InputField
                    placeholder="Confirm new password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showConfirmPassword}
                    fontSize="$sm"
                    color="$black"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <Pressable
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    padding="$2"
                  >
                    <Ionicons 
                      name={showConfirmPassword ? "eye-off" : "eye"} 
                      size={20} 
                      color="#666" 
                    />
                  </Pressable>
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorText fontSize="$xs" color="$red500">
                {errors.confirmPassword?.message}
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
              <Text fontSize="$xs" color="$red600">
                {errors.root.message}
              </Text>
            </Box>
          )}

          {/* Update Password Button */}
          <Button
            backgroundColor="$blue600"
            borderRadius="$md"
            height={48}
            onPress={handleSubmit(onSubmit)}
            isDisabled={isLoading}
            marginTop="$2"
          >
            {isLoading ? (
              <HStack space="sm" alignItems="center">
                <Spinner size="small" color="$white" />
                <ButtonText color="$white" fontWeight="$semibold" fontSize="$sm">
                  Updating...
                </ButtonText>
              </HStack>
            ) : (
              <ButtonText color="$white" fontWeight="$semibold" fontSize="$sm">
                Update Password
              </ButtonText>
            )}
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
}
