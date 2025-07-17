import React, { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
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
  ScrollView,
  Spinner,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { signup } from "@auth/services/signup";
import BirthdayPicker from "./birthdaypicker";

// Form validation schema - following login pattern
const formSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .min(2, { message: "First name must be at least 2 characters" })
    .max(50, { message: "First name must be less than 50 characters" })
    .regex(/^[a-zA-Z\s'-]+$/, { message: "Only letters, spaces, hyphens, and apostrophes allowed" }),
  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(50, { message: "Last name must be less than 50 characters" })
    .regex(/^[a-zA-Z\s'-]+$/, { message: "Only letters, spaces, hyphens, and apostrophes allowed" }),
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Invalid email address" })
    .max(100, { message: "Email must be less than 100 characters" }),
  password: z
    .string()
    .min(1, { message: "Please enter your password" })
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { 
      message: "Password must contain uppercase, lowercase, and number" 
    }),
  confirmPassword: z
    .string()
    .min(1, { message: "Please confirm your password" }),
  phone: z
    .string()
    .min(1, { message: "Phone number is required" })
    .regex(/^\+\d{8,15}$/, { message: "Please enter a valid international phone number (e.g., +1234567890)" }),
  birthdate: z
    .string()
    .min(1, { message: "Birthday is required" })
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();
      
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
      }
      
      return age >= 18 && age <= 120;
    }, { message: "You must be between 18 and 120 years old" }),
  referralCode: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

// Google Icon Component
const GoogleIcon = ({ size = 20 }) => (
  <Ionicons name="logo-google" size={size} color="#4285F4" />
);

export default function NewSignupCard() {
  const router = useRouter();
  const [isBirthdayPickerVisible, setIsBirthdayPickerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      birthdate: "",
      referralCode: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log("🎯 Starting signup process with enhanced form");
    setIsLoading(true);

    try {
      // Call the existing signup API
      const signupData = {
        name: data.firstName.trim(),
        surname: data.lastName.trim(),
        email: data.email.toLowerCase().trim(),
        password: data.password,
        phone: data.phone.trim(),
        birthdate: data.birthdate,
        accountType: "investor", // Default account type
        referralCode: data.referralCode?.trim() || null,
      };

      console.log("📤 Calling signup API with data:", { ...signupData, password: "***" });
      
      const response = await signup(signupData);
      console.log("✅ Signup successful, response:", response);

      // Navigate to email verification screen with the user data
      router.replace({
        pathname: "/auth/screens/Signup/verify" as any,
        params: {
          email: data.email.toLowerCase().trim(),
          userId: response.user?.id?.toString() || "",
        },
      });

    } catch (error: any) {
      console.error("❌ Signup error:", error);
      
      // Handle specific error types
      if (error?.message?.includes("already exists") || error?.message?.includes("Email already")) {
        setError("email", {
          message: "An account with this email already exists. Please sign in instead."
        });
      } else if (error?.message) {
        setError("root", {
          message: error.message
        });
      } else {
        setError("root", {
          message: "Failed to create account. Please try again."
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    console.log("Google Sign Up clicked");
    // TODO: Implement Google Sign Up
  };

  const handleDateSelect = (rawDate: string) => {
    // Fix the date handling to avoid off-by-one issues
    const selectedDate = new Date(rawDate);
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    
    setValue("birthdate", formattedDate);
    setIsBirthdayPickerVisible(false);
    
    // Trigger validation for the birthdate field
    trigger("birthdate");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 20 }}
      >
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
            {/* Header - Following login card pattern */}
            <VStack space="xs" alignItems="center">
              <Text fontSize="$2xl" fontWeight="$bold" color="$gray900" textAlign="center">
                Create Your Account
              </Text>
              <Text fontSize="$sm" color="$gray500" textAlign="center" lineHeight="$sm">
                Enter your information below to get started with investing
              </Text>
            </VStack>

            {/* Form */}
            <VStack space="lg">
              {/* Name Fields */}
              <HStack space="md">
                <FormControl flex={1} isInvalid={!!errors.firstName}>
                  <FormControlLabel>
                    <FormControlLabelText fontSize="$sm" fontWeight="$medium" color="$gray700" marginBottom="$2">
                      First Name
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Controller
                    control={control}
                    name="firstName"
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
                          placeholder="John"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          autoCapitalize="words"
                          fontSize="$sm"
                          autoCorrect={false}
                        />
                      </Input>
                    )}
                  />
                  <FormControlError>
                    <FormControlErrorText fontSize="$xs">
                      {errors.firstName?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>

                <FormControl flex={1} isInvalid={!!errors.lastName}>
                  <FormControlLabel>
                    <FormControlLabelText fontSize="$sm" fontWeight="$medium" color="$gray700" marginBottom="$2">
                      Last Name
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Controller
                    control={control}
                    name="lastName"
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
                          placeholder="Doe"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          autoCapitalize="words"
                          fontSize="$sm"
                          autoCorrect={false}
                        />
                      </Input>
                    )}
                  />
                  <FormControlError>
                    <FormControlErrorText fontSize="$xs">
                      {errors.lastName?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              </HStack>

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
                        placeholder="john@example.com"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        fontSize="$sm"
                        autoCorrect={false}
                      />
                    </Input>
                  )}
                />
                <FormControlError>
                  <FormControlErrorText fontSize="$xs">
                    {errors.email?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              {/* Password Field */}
              <FormControl isInvalid={!!errors.password}>
                <FormControlLabel>
                  <FormControlLabelText fontSize="$sm" fontWeight="$medium" color="$gray700" marginBottom="$2">
                    Password
                  </FormControlLabelText>
                </FormControlLabel>
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
                        placeholder="Enter your password"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry={!showPassword}
                        fontSize="$sm"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <Pressable
                        paddingRight="$3"
                        onPress={() => setShowPassword(!showPassword)}
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
                  <FormControlErrorText fontSize="$xs">
                    {errors.password?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              {/* Confirm Password Field */}
              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormControlLabel>
                  <FormControlLabelText fontSize="$sm" fontWeight="$medium" color="$gray700" marginBottom="$2">
                    Confirm Password
                  </FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={control}
                  name="confirmPassword"
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
                        placeholder="Confirm your password"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry={!showConfirmPassword}
                        fontSize="$sm"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <Pressable
                        paddingRight="$3"
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <Ionicons
                          name={showConfirmPassword ? "eye-off" : "eye"}
                          size={20}
                          color="#9CA3AF"
                        />
                      </Pressable>
                    </Input>
                  )}
                />
                <FormControlError>
                  <FormControlErrorText fontSize="$xs">
                    {errors.confirmPassword?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              {/* Phone Field */}
              <FormControl isInvalid={!!errors.phone}>
                <FormControlLabel>
                  <FormControlLabelText fontSize="$sm" fontWeight="$medium" color="$gray700" marginBottom="$2">
                    Phone Number
                  </FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={control}
                  name="phone"
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
                        placeholder="+1234567890"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType="phone-pad"
                        fontSize="$sm"
                      />
                    </Input>
                  )}
                />
                <FormControlError>
                  <FormControlErrorText fontSize="$xs">
                    {errors.phone?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              {/* Birthday Field */}
              <FormControl isInvalid={!!errors.birthdate}>
                <FormControlLabel>
                  <FormControlLabelText fontSize="$sm" fontWeight="$medium" color="$gray700" marginBottom="$2">
                    Birthday
                  </FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={control}
                  name="birthdate"
                  render={({ field: { value } }) => (
                    <Pressable onPress={() => setIsBirthdayPickerVisible(true)}>
                      <Input
                        size="lg"
                        borderRadius="$md"
                        borderColor="$gray300"
                        backgroundColor="$gray50"
                        height={48}
                        isDisabled={isLoading}
                        isReadOnly={true}
                        $focus={{
                          borderColor: "$blue500",
                          borderWidth: "$2",
                          backgroundColor: "$white",
                        }}
                      >
                        <InputField
                          placeholder="Select your birthday"
                          value={value ? new Date(value).toLocaleDateString() : ""}
                          fontSize="$sm"
                          editable={false}
                        />
                        <Box paddingRight="$3">
                          <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
                        </Box>
                      </Input>
                    </Pressable>
                  )}
                />
                <FormControlError>
                  <FormControlErrorText fontSize="$xs">
                    {errors.birthdate?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              {/* Referral Code Field */}
              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText fontSize="$sm" fontWeight="$medium" color="$gray700" marginBottom="$2">
                    Referral Code (Optional)
                  </FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={control}
                  name="referralCode"
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
                        placeholder="Enter referral code"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        fontSize="$sm"
                        autoCapitalize="characters"
                        autoCorrect={false}
                      />
                    </Input>
                  )}
                />
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

              {/* Continue Button */}
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
                      Creating Account...
                    </ButtonText>
                  </HStack>
                ) : (
                  <ButtonText color="$white" fontWeight="$semibold" fontSize="$sm">
                    Create Account
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

            {/* Google Sign Up Button */}
            <Button
              variant="outline"
              size="lg"
              onPress={handleGoogleSignup}
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

            {/* Terms and Conditions */}
            <VStack space="xs" alignItems="center">
              <Text fontSize="$xs" color="$gray500" textAlign="center">
                By creating an account, you agree to our
              </Text>
              <HStack space="xs" alignItems="center">
                <Pressable onPress={() => console.log("Terms of Service")}>
                  <Text fontSize="$xs" color="$blue600" fontWeight="$medium">
                    Terms of Service
                  </Text>
                </Pressable>
                <Text fontSize="$xs" color="$gray500">and</Text>
                <Pressable onPress={() => console.log("Privacy Policy")}>
                  <Text fontSize="$xs" color="$blue600" fontWeight="$medium">
                    Privacy Policy
                  </Text>
                </Pressable>
              </HStack>
            </VStack>

            {/* Login Link */}
            <HStack justifyContent="center" alignItems="center" space="xs">
              <Text fontSize="$sm" color="$gray600">
                Already have an account?
              </Text>
              <Pressable 
                onPress={() => {
                  if (!isLoading) {
                    router.replace("/auth/screens/Login" as any);
                  }
                }}
              >
                <Text fontSize="$sm" color="$blue600" fontWeight="$semibold">
                  Sign In
                </Text>
              </Pressable>
            </HStack>
          </VStack>
        </Box>

        {/* Birthday Picker Modal */}
        <BirthdayPicker
          isBirthdayPickerVisible={isBirthdayPickerVisible}
          onSelectDate={handleDateSelect}
          setIsBirthdayPickerVisible={setIsBirthdayPickerVisible}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
