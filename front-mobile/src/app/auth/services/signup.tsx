import axios from "axios";
import API_URL from "../../../shared/constants/api";
import { authStore } from "./authStore";

interface SignupData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  birthdate: string;
  password: string;
  referralCode?: string;
}

// Signup API Call
export const signup = async (userData: {
  name: string;
  surname: string;
  email: string;
  password: string;
  phone: string;
  birthdate: string;
  accountType: string;
  referralCode?: string | null;
}) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/sign-up`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = response.data;

    console.log("[SignUp] Signup successful, response:", responseData);

    // NOTE: During initial signup, the backend does NOT return tokens.
    // Tokens are only returned after successful phone verification.
    // The signup response only contains user data and verification status.

    return responseData; // Return the response data to handle in your component
  } catch (error: any) {
    // Handle error response gracefully
    throw error.response?.data || { message: "Signup failed" };
  }
};

// Function to retrieve the token from SecureStore
export const getAuthToken = async (): Promise<string | null> => {
  try {
    await authStore.getState().loadTokens();
    return authStore.getState().accessToken;
  } catch (error) {
    console.error("Error retrieving auth token:", error);
    return null;
  }
};

// Function to clear tokens (logout)
export const clearAuthTokens = async (): Promise<void> => {
  try {
    await authStore.getState().clearTokens();
    console.log("✅ Auth tokens cleared from SecureStore");
  } catch (error) {
    console.error("Error clearing auth tokens:", error);
  }
};

export const verifySignUp = async (email: string, code: string) => {
  const response = await axios.post(`${API_URL}/api/auth/verify-email`, {
    email,
    code,
  });
  return response.data;
};

// Forgot Password API Functions
export const forgotPassword = async (email: string) => {
  const response = await axios.post(`${API_URL}/api/auth/forgot-password`, {
    email,
  });
  return response.data;
};

export const resetPassword = async (email: string, code: string, newPassword: string) => {
  const response = await axios.post(`${API_URL}/api/auth/reset-password`, {
    email,
    code,
    newPassword,
  });
  return response.data;
};

export const resendVerificationCode = async (email: string) => {
  const response = await axios.post(`${API_URL}/api/auth/resend-verification`, {
    email,
  });
  return response.data;
};
