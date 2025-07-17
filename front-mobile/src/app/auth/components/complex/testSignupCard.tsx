import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Alert } from "react-native";
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
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { authService } from "@auth/services/authService";
import BirthdayPicker from "./birthdaypicker";

// Enhanced validation schema to match backoffice standards
const formSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .min(2, { message: "Must be at least 2 characters" })
    .max(50, { message: "Must be less than 50 characters" })
    .regex(/^[a-zA-Z\s'-]+$/, { message: "Only letters, spaces, hyphens, and apostrophes allowed" }),
  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .min(2, { message: "Must be at least 2 characters" })
    .max(50, { message: "Must be less than 50 characters" })
    .regex(/^[a-zA-Z\s'-]+$/, { message: "Only letters, spaces, hyphens, and apostrophes allowed" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z
    .string()
    .min(1, { message: "Please confirm your password" }),
  phone: z
    .string()
    .optional(),
  birthdate: z
    .string()
    .min(1, { message: "Birthday is required" })
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age >= 18 && age <= 120;
    }, { message: "You must be at least 18 years old to register" }),
  referralCode: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

// Google Icon Component
const GoogleIcon = ({ size = 20 }) => (
  <Ionicons name="logo-google" size={size} color="#4285F4" />
);

export default function TestSignupCard() {
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
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log("🎯 Starting signup process");
    setIsLoading(true);

    try {
      // Prepare signup data for API
      const signupData = {
        name: data.firstName.trim(),
        surname: data.lastName.trim(),
        email: data.email.toLowerCase().trim(),
        password: data.password,
        phone: data.phone?.trim(),
        birthdate: data.birthdate,
        referralCode: data.referralCode?.trim() || undefined,
      };

      console.log("📤 Calling signup API...");
      const response = await authService.signUp(signupData);
      console.log("✅ Signup successful:", response);

      // Show success message and navigate to verification
      Alert.alert(
        "Account Created!",
        "Please check your email for a verification code to complete your registration.",
        [
          {
            text: "Continue",
            onPress: () => {
              // Navigate to OTP verification with proper parameters
              router.push({
                pathname: "/auth/screens/Signup/verify",
                params: {
                  email: signupData.email,
                  userId: response.user.id.toString(),
                },
              });
            },
          },
        ]
      );

    } catch (error: any) {
      console.error("❌ Signup error:", error);
      
      let errorMessage = "Failed to create account. Please try again.";
      
      if (error?.message) {
        if (error.message.includes("already exists") || error.message.includes("Email already")) {
          errorMessage = "An account with this email already exists. Please sign in instead.";
        } else {
          errorMessage = error.message;
        }
      }
      
      Alert.alert("Signup Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (dateString: string) => {
    // The birthday picker returns date in YYYY-MM-DD format
    setValue("birthdate", dateString);
    trigger("birthdate");
  };

  const handleGoogleSignup = () => {
    console.log("Google Sign Up clicked");
    Alert.alert("Coming Soon", "Google signup will be available in a future update.");
  };

  const navigateToLogin = () => {
    router.push("/auth/screens/Login");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ width: "100%" }}
    >
      <Box
        width="90%"
        maxWidth={400}
        backgroundColor="$white"
        borderRadius="$2xl"
        borderWidth="$1"
        borderColor="$gray200"
        padding="$6"
        shadowColor="$black"
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.1}
        shadowRadius={12}
        elevation={4}
        alignSelf="center"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space="xl">
            {/* Header */}
            <VStack space="xs" alignItems="center">
              <Text 
                fontSize="$2xl" 
                fontWeight="$bold" 
                color="$gray900" 
                textAlign="center"
              >
                Create Account
              </Text>
              <Text 
                fontSize="$sm" 
                color="$gray500" 
                textAlign="center"
              >
                Join us to start your investment journey
              </Text>
            </VStack>

            {/* Name Fields */}
            <HStack space="md">
              <Box flex={1}>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <FormControl isInvalid={!!errors.firstName}>
                      <FormControlLabel>
                        <FormControlLabelText fontSize="$sm" fontWeight="$medium">
                          First Name
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Input borderColor="$gray300" borderRadius="$md" height={48}>
                        <InputField
                          placeholder="John"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          autoCapitalize="words"
                          autoCorrect={false}
                        />
                      </Input>
                      <FormControlError>
                        <FormControlErrorText fontSize="$xs">
                          {errors.firstName?.message}
                        </FormControlErrorText>
                      </FormControlError>
                    </FormControl>
                  )}
                />
              </Box>
              <Box flex={1}>
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <FormControl isInvalid={!!errors.lastName}>
                      <FormControlLabel>
                        <FormControlLabelText fontSize="$sm" fontWeight="$medium">
                          Last Name
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Input borderColor="$gray300" borderRadius="$md" height={48}>
                        <InputField
                          placeholder="Doe"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          autoCapitalize="words"
                          autoCorrect={false}
                        />
                      </Input>
                      <FormControlError>
                        <FormControlErrorText fontSize="$xs">
                          {errors.lastName?.message}
                        </FormControlErrorText>
                      </FormControlError>
                    </FormControl>
                  )}
                />
              </Box>
            </HStack>

            {/* Email Field */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl isInvalid={!!errors.email}>
                  <FormControlLabel>
                    <FormControlLabelText fontSize="$sm" fontWeight="$medium">
                      Email Address
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input borderColor="$gray300" borderRadius="$md" height={48}>
                    <InputField
                      placeholder="name@example.com"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorText fontSize="$xs">
                      {errors.email?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />

            {/* Phone Field (Optional) */}
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl>
                  <FormControlLabel>
                    <FormControlLabelText fontSize="$sm" fontWeight="$medium">
                      Phone Number (Optional)
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input borderColor="$gray300" borderRadius="$md" height={48}>
                    <InputField
                      placeholder="+1 (555) 123-4567"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="phone-pad"
                    />
                  </Input>
                </FormControl>
              )}
            />

            {/* Birthday Field */}
            <Controller
              control={control}
              name="birthdate"
              render={({ field: { value } }) => (
                <FormControl isInvalid={!!errors.birthdate}>
                  <FormControlLabel>
                    <FormControlLabelText fontSize="$sm" fontWeight="$medium">
                      Date of Birth
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Pressable onPress={() => setIsBirthdayPickerVisible(true)}>
                    <Input
                      borderColor="$gray300"
                      borderRadius="$md"
                      height={48}
                      isDisabled
                      opacity={1}
                    >
                      <InputField
                        placeholder="Select your birthday"
                        value={value ? new Date(value).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : ""}
                        editable={false}
                        color="$gray900"
                      />
                      <Box 
                        style={{ 
                          paddingRight: 12, 
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <Ionicons
                          name="calendar-outline"
                          size={20}
                          color="#6B7280"
                        />
                      </Box>
                    </Input>
                  </Pressable>
                  <Text fontSize="$xs" color="$gray500" marginTop="$1">
                    You must be at least 18 years old to register
                  </Text>
                  <FormControlError>
                    <FormControlErrorText fontSize="$xs">
                      {errors.birthdate?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />

            {/* Password Field */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl isInvalid={!!errors.password}>
                  <FormControlLabel>
                    <FormControlLabelText fontSize="$sm" fontWeight="$medium">
                      Password
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input borderColor="$gray300" borderRadius="$md" height={48}>
                    <InputField
                      placeholder="Create a secure password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <Pressable
                      onPress={() => setShowPassword(!showPassword)}
                      style={{ paddingRight: 12, justifyContent: 'center' }}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off" : "eye"}
                        size={20}
                        color="#6B7280"
                      />
                    </Pressable>
                  </Input>
                  <Text fontSize="$xs" color="$gray500" marginTop="$1">
                    At least 8 characters with uppercase, lowercase and numbers
                  </Text>
                  <FormControlError>
                    <FormControlErrorText fontSize="$xs">
                      {errors.password?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />

            {/* Confirm Password Field */}
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl isInvalid={!!errors.confirmPassword}>
                  <FormControlLabel>
                    <FormControlLabelText fontSize="$sm" fontWeight="$medium">
                      Confirm Password
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input borderColor="$gray300" borderRadius="$md" height={48}>
                    <InputField
                      placeholder="Confirm your password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <Pressable
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ paddingRight: 12, justifyContent: 'center' }}
                    >
                      <Ionicons
                        name={showConfirmPassword ? "eye-off" : "eye"}
                        size={20}
                        color="#6B7280"
                      />
                    </Pressable>
                  </Input>
                  <FormControlError>
                    <FormControlErrorText fontSize="$xs">
                      {errors.confirmPassword?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />

            {/* Referral Code Field (Optional) */}
            <Controller
              control={control}
              name="referralCode"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl>
                  <FormControlLabel>
                    <FormControlLabelText fontSize="$sm" fontWeight="$medium">
                      Referral Code (Optional)
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input borderColor="$gray300" borderRadius="$md" height={48}>
                    <InputField
                      placeholder="Enter referral code"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="characters"
                      autoCorrect={false}
                    />
                  </Input>
                </FormControl>
              )}
            />

            {/* Terms and Conditions */}
            <Controller
              control={control}
              name="agreeToTerms"
              render={({ field: { onChange, value } }) => (
                <FormControl isInvalid={!!errors.agreeToTerms}>
                  <HStack space="sm" alignItems="flex-start">
                    <Checkbox
                      value="terms"
                      isChecked={value}
                      onChange={onChange}
                      size="md"
                      borderColor="$gray300"
                    >
                      <CheckboxIndicator>
                        <CheckboxIcon />
                      </CheckboxIndicator>
                    </Checkbox>
                    <Box flex={1}>
                      <Text fontSize="$sm" color="$gray600" lineHeight="$sm">
                        I agree to the{" "}
                        <Text color="$blue600" textDecorationLine="underline">
                          Terms of Service
                        </Text>{" "}
                        and{" "}
                        <Text color="$blue600" textDecorationLine="underline">
                          Privacy Policy
                        </Text>
                      </Text>
                    </Box>
                  </HStack>
                  <FormControlError>
                    <FormControlErrorText fontSize="$xs">
                      {errors.agreeToTerms?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />

            {/* Create Account Button */}
            <Button
              size="lg"
              backgroundColor="$blue600"
              borderRadius="$md"
              height={52}
              onPress={handleSubmit(onSubmit)}
              isDisabled={isLoading}
              $hover={{ backgroundColor: "$blue700" }}
              $pressed={{ backgroundColor: "$blue700", transform: [{ scale: 0.98 }] }}
            >
              {isLoading ? (
                <HStack space="sm" alignItems="center">
                  <Spinner size="small" color="$white" />
                  <ButtonText color="$white" fontWeight="$semibold">
                    Creating Account...
                  </ButtonText>
                </HStack>
              ) : (
                <ButtonText color="$white" fontWeight="$semibold">
                  Create Account
                </ButtonText>
              )}
            </Button>

            {/* Divider */}
            <HStack alignItems="center" space="md">
              <Box flex={1} height={1} backgroundColor="$gray300" />
              <Text fontSize="$sm" color="$gray500">or</Text>
              <Box flex={1} height={1} backgroundColor="$gray300" />
            </HStack>

            {/* Google Sign Up Button */}
            <Button
              variant="outline"
              borderColor="$gray300"
              borderRadius="$md"
              height={52}
              onPress={handleGoogleSignup}
              isDisabled={isLoading}
            >
              <HStack space="sm" alignItems="center">
                <GoogleIcon size={20} />
                <ButtonText color="$gray700" fontWeight="$medium">
                  Continue with Google
                </ButtonText>
              </HStack>
            </Button>

            {/* Sign In Link */}
            <HStack justifyContent="center" space="xs">
              <Text fontSize="$sm" color="$gray600">
                Already have an account?
              </Text>
              <Pressable onPress={navigateToLogin}>
                <Text fontSize="$sm" color="$blue600" fontWeight="$medium">
                  Sign In
                </Text>
              </Pressable>
            </HStack>
          </VStack>
        </ScrollView>
      </Box>

      {/* Birthday Picker Modal */}
      <BirthdayPicker
        isBirthdayPickerVisible={isBirthdayPickerVisible}
        onSelectDate={handleDateSelect}
        setIsBirthdayPickerVisible={setIsBirthdayPickerVisible}
      />
    </KeyboardAvoidingView>
  );
} 