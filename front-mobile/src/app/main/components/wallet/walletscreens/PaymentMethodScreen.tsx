import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Platform,
  Modal,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { useRouter } from "expo-router";
import { WebView } from "react-native-webview";
import TopBar from "@main/components/profileScreens/components/ui/TopBar";
import Card from "@main/components/profileScreens/components/ui/card";
import BottomSheet from "@main/components/profileScreens/components/ui/SheetIndicator";
import {
  getPaymentMethods,
  createPaymePayment,
  checkPaymePaymentStatus,
  getSavedPaymentMethods,
  deleteSavedPaymentMethod,
  setDefaultPaymentMethod,
  type PaymentMethods,
  type SavedPaymentMethod,
  type PaymentMethod as PaymentMethodType,
  type PaymePaymentResponse,
} from "@main/services/payment.service";
import { fetchAccountData } from "@main/services/account";

// Card brand images
const cardBrandImages = {
  payme: require("@assets/payme.png"),
};

type PaymentMethodOption = {
  id: PaymentMethodType;
  type: PaymentMethodType;
  name: string;
  description: string;
  icon: "credit-card" | "smartphone";
  enabled: boolean;
  test_mode?: boolean;
  processing_time?: string;
  fees?: string;
};

const PaymentMethodContent: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<
    SavedPaymentMethod[]
  >([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethods | null>(
    null
  );
  const [userAccount, setUserAccount] = useState<any>(null);

  // Bottom sheet states
  const [removeCardSheetVisible, setRemoveCardSheetVisible] = useState(false);
  const [successSheetVisible, setSuccessSheetVisible] = useState(false);
  const [errorSheetVisible, setErrorSheetVisible] = useState(false);
  const [paymeSheetVisible, setPaymeSheetVisible] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<SavedPaymentMethod | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // PayMe specific states
  const [paymeWebViewVisible, setPaymeWebViewVisible] = useState(false);
  const [paymePaymentData, setPaymePaymentData] =
    useState<PaymePaymentResponse | null>(null);
  const [paymePaymentStatus, setPaymePaymentStatus] = useState<
    "pending" | "completed" | "failed" | null
  >(null);

  // Load payment methods on component mount
  useEffect(() => {
    loadPaymentData();
  }, []);

  const loadPaymentData = async () => {
    try {
      setInitialLoading(true);

      // Load all payment data in parallel
      const [methods, savedMethods, account] = await Promise.all([
        getPaymentMethods(),
        getSavedPaymentMethods().catch(() => []),
        fetchAccountData().catch(() => null),
      ]);

      setPaymentMethods(methods);
      setSavedPaymentMethods(savedMethods);
      setUserAccount(account);
    } catch (error) {
      console.error("Error loading payment data:", error);
      setErrorMessage(
        "Failed to load payment methods. Please check your connection and try again."
      );
      setErrorSheetVisible(true);
    } finally {
      setInitialLoading(false);
    }
  };

  const handlePayMePayment = async () => {
    try {
      setLoading(true);

      if (!userAccount) {
        throw new Error("User account not loaded");
      }

      // For demo purposes - create PayMe payment session
      const paymeResponse = await createPaymePayment({
        amount: 100, // Demo amount
        walletAddress:
          userAccount.walletAddress ||
          "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        note: "Add PayMe payment method",
        first_name: userAccount.first_name || "John",
        last_name: userAccount.last_name || "Doe",
        email: userAccount.email,
        phone: userAccount.phone || "+216 12 345 678",
      });

      setPaymePaymentData(paymeResponse);
      setPaymeWebViewVisible(true);
    } catch (error) {
      console.error("Error creating PayMe payment:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to initialize PayMe payment"
      );
      setErrorSheetVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymeWebViewNavigationStateChange = (navState: any) => {
    console.log("PayMe WebView navigation:", navState.url);

    // Check for payment completion or cancellation
    if (navState.url.includes("success") || navState.url.includes("payment-completed")) {
      setPaymeWebViewVisible(false);
      setPaymePaymentStatus("completed");
      setSuccessMessage("PayMe payment method added successfully!");
      setSuccessSheetVisible(true);
      loadPaymentData(); // Reload to get updated payment methods
    } else if (navState.url.includes("cancel") || navState.url.includes("failed")) {
      setPaymeWebViewVisible(false);
      setPaymePaymentStatus("failed");
      setErrorMessage("PayMe payment was cancelled or failed");
      setErrorSheetVisible(true);
    }
  };

  const checkPaymentStatus = async (token: string) => {
    try {
      const status = await checkPaymePaymentStatus(token);
      console.log("Payment status:", status);

      if (status.payment.status === "completed") {
        setPaymePaymentStatus("completed");
        setSuccessMessage("PayMe payment completed successfully!");
        setSuccessSheetVisible(true);
        loadPaymentData();
      } else if (status.payment.status === "failed") {
        setPaymePaymentStatus("failed");
        setErrorMessage("PayMe payment failed");
        setErrorSheetVisible(true);
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  };

  const handleRemoveCard = (paymentMethod: SavedPaymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
    setRemoveCardSheetVisible(true);
  };

  const confirmRemoveCard = async () => {
    if (!selectedPaymentMethod) return;

    try {
      setLoading(true);
      await deleteSavedPaymentMethod(selectedPaymentMethod.id);

      setSuccessMessage("Payment method removed successfully");
      setSuccessSheetVisible(true);
      setRemoveCardSheetVisible(false);
      setSelectedPaymentMethod(null);

      // Reload payment methods
      await loadPaymentData();
    } catch (error) {
      console.error("Error removing payment method:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to remove payment method"
      );
      setErrorSheetVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (paymentMethodId: string) => {
    try {
      setLoading(true);
      await setDefaultPaymentMethod(paymentMethodId);

      setSuccessMessage("Default payment method updated");
      setSuccessSheetVisible(true);

      // Reload payment methods
      await loadPaymentData();
    } catch (error) {
      console.error("Error setting default payment method:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to update default payment method"
      );
      setErrorSheetVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const getCardBrandImage = (method: SavedPaymentMethod) => {
    if (method.type === "payme") {
      return cardBrandImages.payme;
    }
    return cardBrandImages.payme;
  };

  const getPaymentMethodOptions = (): PaymentMethodOption[] => {
    if (!paymentMethods) return [];

    const options: PaymentMethodOption[] = [];

    // Add PayMe option
    if (paymentMethods.payme) {
      options.push({
        id: "payme" as PaymentMethodType,
        type: "payme" as PaymentMethodType,
        name: paymentMethods.payme.name,
        description: paymentMethods.payme.description,
        icon: "smartphone",
        enabled: paymentMethods.payme.enabled,
        test_mode: paymentMethods.payme.test_mode,
        processing_time: paymentMethods.payme.processing_time,
        fees: paymentMethods.payme.fees,
      });
    }

    return options;
  };

  const handlePaymentMethodPress = (method: PaymentMethodOption) => {
    if (method.type === "payme") {
      handlePayMePayment();
    }
  };

  if (initialLoading) {
    return (
      <View className="flex-1 bg-background">
        <TopBar title="Payment Methods" showBackButton />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#10B981" />
          <Text className="text-text mt-4">Loading payment methods...</Text>
        </View>
      </View>
    );
  }

  const paymentMethodOptions = getPaymentMethodOptions();

  return (
    <View className="flex-1 bg-background">
      <TopBar title="Payment Methods" showBackButton />

      <ScrollView className="flex-1 px-6 pt-6">
        {/* Saved Payment Methods */}
        {savedPaymentMethods.length > 0 && (
          <View className="mb-8">
            <Text className="text-lg font-semibold text-text mb-4">
              Saved Payment Methods
            </Text>
            {savedPaymentMethods.map((method) => (
              <Card key={method.id} className="mb-4 p-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                        <Image
                          source={getCardBrandImage(method)}
                      className="w-12 h-8 rounded mr-3"
                          resizeMode="contain"
                        />
                      <View className="flex-1">
                      <Text className="font-medium text-text">
                        {method.type === "payme" && method.payme
                          ? `PayMe: ${method.payme.phone_number}`
                          : "PayMe Account"}
                              </Text>
                      <Text className="text-sm text-text/60">
                        {method.is_default ? "Default" : ""}
                            </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center">
                      {!method.is_default && (
                        <TouchableOpacity
                          onPress={() => handleSetDefault(method.id)}
                        className="mr-2 px-3 py-1 bg-green-500 rounded"
                        >
                        <Text className="text-white text-xs">Set Default</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        onPress={() => handleRemoveCard(method)}
                        className="p-2"
                      >
                      <Feather name="trash-2" size={16} color="#ef4444" />
                      </TouchableOpacity>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* Add New Payment Method */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-text mb-4">
              Add Payment Method
            </Text>

            {paymentMethodOptions.map((method) => (
                <TouchableOpacity
              key={method.id}
              onPress={() => handlePaymentMethodPress(method)}
                  disabled={!method.enabled || loading}
              className={`mb-4 ${
                method.enabled ? "opacity-100" : "opacity-50"
              }`}
            >
              <Card className="p-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-3">
                      <Feather
                        name={method.icon}
                        size={20}
                        color="#10B981"
                    />
                  </View>
                  <View className="flex-1">
                      <Text className="font-medium text-text">
                        {method.name}
                      </Text>
                      <Text className="text-sm text-text/60">
                      {method.description}
                    </Text>
                      {method.test_mode && (
                        <Text className="text-xs text-orange-500 mt-1">
                          Test Mode
                      </Text>
                    )}
                  </View>
                  </View>
                  <Feather name="chevron-right" size={20} color="#6B7280" />
                </View>
              </Card>
            </TouchableOpacity>
            ))}
          </View>

        {/* Payment Methods Info */}
        <Card className="p-4 mb-8">
          <Text className="font-medium text-text mb-2">
            Payment Security
                  </Text>
          <Text className="text-sm text-text/60">
            Your payment information is securely stored and encrypted. We
            support PayMe for convenient payments in Tunisia.
                  </Text>
            </Card>
      </ScrollView>

      {/* PayMe WebView Modal */}
      <Modal
        visible={paymeWebViewVisible}
        animationType="slide"
        onRequestClose={() => setPaymeWebViewVisible(false)}
      >
        <View className="flex-1 bg-background">
          <View className="flex-row items-center justify-between p-4 border-b border-border">
            <Text className="text-lg font-semibold text-text">
              PayMe Payment
                  </Text>
            <TouchableOpacity
              onPress={() => setPaymeWebViewVisible(false)}
              className="p-2"
            >
              <Feather name="x" size={24} color="#6B7280" />
            </TouchableOpacity>
                </View>
          {paymePaymentData && (
            <WebView
              source={{ uri: paymePaymentData.payment_url }}
              onNavigationStateChange={handlePaymeWebViewNavigationStateChange}
              startInLoadingState
              renderLoading={() => (
                <View className="flex-1 justify-center items-center">
                  <ActivityIndicator size="large" color="#10B981" />
                  <Text className="text-text mt-4">Loading payment...</Text>
          </View>
        )}
            />
          )}
        </View>
      </Modal>

      {/* Remove Card Confirmation Sheet */}
      <BottomSheet
        visible={removeCardSheetVisible}
        onClose={() => setRemoveCardSheetVisible(false)}
      >
        <View className="p-6">
          <View className="items-center mb-6">
            <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
              <Feather name="trash-2" size={32} color="#ef4444" />
          </View>
            <Text className="text-xl font-semibold text-text mb-2">
            Remove Payment Method
          </Text>
            <Text className="text-text/60 text-center">
              Are you sure you want to remove this payment method? This action
              cannot be undone.
              </Text>
            </View>
          <View className="flex-row gap-4">
          <TouchableOpacity
              onPress={() => setRemoveCardSheetVisible(false)}
              className="flex-1 bg-gray-200 py-3 rounded-lg"
          >
              <Text className="text-center text-gray-800 font-medium">
                Cancel
              </Text>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={confirmRemoveCard}
              disabled={loading}
              className="flex-1 bg-red-500 py-3 rounded-lg"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-center text-white font-medium">
                  Remove
            </Text>
              )}
          </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>

      {/* Success Sheet */}
      <BottomSheet
        visible={successSheetVisible}
        onClose={() => setSuccessSheetVisible(false)}
      >
        <View className="p-6">
          <View className="items-center mb-6">
            <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
              <Feather name="check" size={32} color="#10B981" />
          </View>
            <Text className="text-xl font-semibold text-text mb-2">
            Success!
          </Text>
            <Text className="text-text/60 text-center">{successMessage}</Text>
          </View>
          <TouchableOpacity
            onPress={() => setSuccessSheetVisible(false)}
            className="bg-green-500 py-3 rounded-lg"
          >
            <Text className="text-center text-white font-medium">Continue</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>

      {/* Error Sheet */}
      <BottomSheet
        visible={errorSheetVisible}
        onClose={() => setErrorSheetVisible(false)}
      >
        <View className="p-6">
          <View className="items-center mb-6">
            <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
              <Feather name="alert-circle" size={32} color="#ef4444" />
          </View>
            <Text className="text-xl font-semibold text-text mb-2">Error</Text>
            <Text className="text-text/60 text-center">{errorMessage}</Text>
          </View>
          <TouchableOpacity
            onPress={() => setErrorSheetVisible(false)}
            className="bg-red-500 py-3 rounded-lg"
          >
            <Text className="text-center text-white font-medium">
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </View>
  );
};

const PaymentMethodScreen: React.FC = () => {
  return <PaymentMethodContent />;
};

export default PaymentMethodScreen;
