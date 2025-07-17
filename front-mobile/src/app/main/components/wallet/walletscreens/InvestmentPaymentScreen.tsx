import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "react-native-vector-icons/Feather";
import { useRouter, useLocalSearchParams } from "expo-router";
import TopBar from "@main/components/profileScreens/components/ui/TopBar";
import Card from "@main/components/profileScreens/components/ui/card";
import {
  getPaymentMethods,
  getSavedPaymentMethods,
  type PaymentMethods,
  type PaymentMethod,
  type SavedPaymentMethod,
} from "@main/services/payment.service";
import {
  createInvestment,
  formatInvestmentAmount,
  getPaymentMethodDisplayInfo,
  validateInvestmentRequest,
  type CreateInvestmentRequest,
  type InvestmentResponse,
} from "@main/services/investment.service";
import { fetchAccountData } from "@main/services/account";

interface InvestmentParams {
  projectId: string;
  projectName: string;
  amount: string;
  currency?: string;
}

const InvestmentPaymentContent: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Parse params safely
  const projectId = (params.projectId as string) || "";
  const projectName = (params.projectName as string) || "Unknown Project";
  const amount = parseFloat((params.amount as string) || "0");
  const currency = (params.currency as string) || "TND";

  // State
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [selectedSavedMethod, setSelectedSavedMethod] = useState<string | null>(
    null
  );
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethods | null>(
    null
  );
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<
    SavedPaymentMethod[]
  >([]);
  const [userAccount, setUserAccount] = useState<any>(null);
  const [investmentResult, setInvestmentResult] =
    useState<InvestmentResponse | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setInitialLoading(true);

      const [methods, savedMethods, account] = await Promise.all([
        getPaymentMethods(),
        getSavedPaymentMethods().catch(() => []),
        fetchAccountData().catch(() => null),
      ]);

      setPaymentMethods(methods);
      setSavedPaymentMethods(savedMethods);
      setUserAccount(account);

      // Auto-select PayMe if available
      if (methods.payme?.enabled) {
        setSelectedPaymentMethod("payme");
        // If there are saved methods, select the default one
        const defaultMethod = savedMethods.find((method) => method.is_default);
        if (defaultMethod) {
          setSelectedSavedMethod(defaultMethod.id);
        } else if (savedMethods.length > 0) {
          setSelectedSavedMethod(savedMethods[0].id);
        }
      }
    } catch (error) {
      console.error("Error loading payment data:", error);
      Alert.alert("Error", "Failed to load payment methods. Please try again.");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInvestment = async () => {
    if (!selectedPaymentMethod || !userAccount) {
      Alert.alert(
        "Error",
        "Please select a payment method and ensure your account is loaded."
      );
      return;
    }

    const investmentRequest: CreateInvestmentRequest = {
      projectId,
      amount,
      paymentMethod: selectedPaymentMethod,
      currency,
      userEmail: userAccount.email,
      walletAddress:
        userAccount.walletAddress ||
        "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      note: `Investment in ${projectName}`,
      savedPaymentMethodId: selectedSavedMethod || undefined,
    };

    // Validate request
    const validation = validateInvestmentRequest(investmentRequest);
    if (!validation.isValid) {
      Alert.alert("Validation Error", validation.errors.join("\n"));
      return;
    }

    try {
      setLoading(true);

      if (selectedPaymentMethod === "payme") {
        await handlePayMePayment(investmentRequest);
      } else {
        Alert.alert("Error", "Only PayMe payments are currently supported.");
      }
    } catch (error) {
      console.error("Investment error:", error);
      Alert.alert(
        "Investment Failed",
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePayMePayment = async (request: CreateInvestmentRequest) => {
    try {
      console.log("Creating PayMe investment:", request);

      const result = await createInvestment(request);
          setInvestmentResult(result);

      Alert.alert(
        "Investment Created",
        `Your investment of ${formatInvestmentAmount(
          amount,
          currency
        )} has been initiated. Please complete the payment to confirm your investment.`,
        [
          {
            text: "View Details",
            onPress: () => router.push("/main/screens/(tabs)/portfolio"),
          },
          { text: "OK" },
        ]
      );
    } catch (error) {
      console.error("PayMe investment error:", error);
      throw error;
    }
  };

  const getPaymentMethodOptions = () => {
    if (!paymentMethods) return [];

    const options = [];

    // Add PayMe option
    if (paymentMethods.payme?.enabled) {
      options.push({
        id: "payme",
        name: paymentMethods.payme.name,
        description: paymentMethods.payme.description,
        icon: "smartphone",
        enabled: true,
        test_mode: paymentMethods.payme.test_mode,
      });
    }

    return options;
  };

  const isPaymentReady = () => {
    return selectedPaymentMethod === "payme" && userAccount;
  };

  if (initialLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <TopBar title="Investment Payment" showBackButton />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#10B981" />
          <Text className="text-text mt-4">Loading payment options...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!projectId || amount <= 0) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <TopBar title="Investment Payment" showBackButton />
        <View className="flex-1 justify-center items-center px-6">
          <Feather name="alert-circle" size={64} color="#ef4444" />
          <Text className="text-xl font-semibold text-text mt-4 text-center">
            Invalid Investment
          </Text>
          <Text className="text-text/60 text-center mt-2">
            The investment parameters are invalid. Please try again.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-primary py-3 px-6 rounded-lg mt-6"
          >
            <Text className="text-white font-medium">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const paymentMethodOptions = getPaymentMethodOptions();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <TopBar title="Investment Payment" showBackButton />

      <ScrollView className="flex-1 px-6 pt-6">
        {/* Investment Summary */}
        <Card className="p-6 mb-6">
          <View className="items-center">
            <Text className="text-lg font-semibold text-text mb-2">
                  Investment Summary
                </Text>
            <Text className="text-text/60 text-center mb-4">{projectName}</Text>
            <View className="bg-green-50 px-4 py-2 rounded-lg">
              <Text className="text-2xl font-bold text-green-600">
                {formatInvestmentAmount(amount, currency)}
              </Text>
            </View>
            </View>
          </Card>

        {/* Payment Methods */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-text mb-4">
            Select Payment Method
          </Text>

          {paymentMethodOptions.length === 0 ? (
            <Card className="p-4">
              <View className="items-center">
                <Feather name="credit-card" size={48} color="#6B7280" />
                <Text className="text-text font-medium mt-4">
                  No Payment Methods Available
                    </Text>
                <Text className="text-text/60 text-center mt-2">
                  Payment methods are currently being set up. Please try again later.
                  </Text>
                </View>
            </Card>
          ) : (
            paymentMethodOptions.map((method) => (
              <TouchableOpacity
                key={method.id}
                onPress={() => setSelectedPaymentMethod(method.id as PaymentMethod)}
                className="mb-4"
              >
                <Card
                  className={`p-4 ${
                    selectedPaymentMethod === method.id
                      ? "border-2 border-green-500"
                      : "border border-border"
                  }`}
                >
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-3">
                      <Feather name={method.icon as any} size={20} color="#10B981" />
                    </View>
                    <View className="flex-1">
                      <Text className="font-medium text-text">{method.name}</Text>
                      <Text className="text-sm text-text/60">{method.description}</Text>
                    {method.test_mode && (
                        <Text className="text-xs text-orange-500 mt-1">Test Mode</Text>
                    )}
                  </View>
                    <View className="w-6 h-6 rounded-full border-2 border-green-500 items-center justify-center">
                      {selectedPaymentMethod === method.id && (
                        <View className="w-3 h-3 bg-green-500 rounded-full" />
                  )}
                </View>
                </View>
                </Card>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Saved Payment Methods */}
        {selectedPaymentMethod === "payme" && savedPaymentMethods.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-semibold text-text mb-4">
              Saved Payment Methods
            </Text>
              {savedPaymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                onPress={() => setSelectedSavedMethod(method.id)}
                className="mb-3"
              >
                <Card
                  className={`p-4 ${
                    selectedSavedMethod === method.id
                      ? "border-2 border-green-500"
                      : "border border-border"
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      <Image
                        source={require("@assets/payme.png")}
                        className="w-12 h-8 rounded mr-3"
                        resizeMode="contain"
                      />
                    <View className="flex-1">
                        <Text className="font-medium text-text">
                          {method.type === "payme" && method.payme
                            ? `PayMe: ${method.payme.phone_number}`
                            : "PayMe Account"}
                            </Text>
                            {method.is_default && (
                          <Text className="text-xs text-green-600">Default</Text>
                            )}
                          </View>
                    </View>
                    <View className="w-6 h-6 rounded-full border-2 border-green-500 items-center justify-center">
                      {selectedSavedMethod === method.id && (
                        <View className="w-3 h-3 bg-green-500 rounded-full" />
                      )}
                    </View>
                  </View>
                </Card>
                </TouchableOpacity>
            ))}
            </View>
          )}

        {/* Investment Terms */}
        <Card className="p-4 mb-6">
          <Text className="font-medium text-text mb-2">Investment Terms</Text>
          <Text className="text-sm text-text/60 mb-2">
            • Your investment will be processed securely through PayMe
          </Text>
          <Text className="text-sm text-text/60 mb-2">
            • Investment confirmation will be sent to your email
          </Text>
          <Text className="text-sm text-text/60 mb-2">
            • Returns will be distributed according to the project terms
              </Text>
          <Text className="text-sm text-text/60">
            • You can track your investment in the Portfolio section
                    </Text>
              </Card>
      </ScrollView>

      {/* Action Button */}
      <View className="p-6 border-t border-border">
            <TouchableOpacity
          onPress={handleInvestment}
          disabled={!isPaymentReady() || loading}
          className={`py-4 px-6 rounded-lg ${
            isPaymentReady() && !loading
              ? "bg-green-500"
              : "bg-gray-300"
          }`}
            >
              {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center text-white font-semibold text-lg">
              Confirm Investment - {formatInvestmentAmount(amount, currency)}
                </Text>
              )}
            </TouchableOpacity>

        {!isPaymentReady() && !loading && (
          <Text className="text-center text-text/60 text-sm mt-2">
            Please select a payment method to continue
                </Text>
              )}
          </View>
    </SafeAreaView>
  );
};

const InvestmentPaymentScreen: React.FC = () => {
  return <InvestmentPaymentContent />;
};

export default InvestmentPaymentScreen;
