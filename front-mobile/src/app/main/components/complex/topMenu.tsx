// TopMenu.tsx
import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { NotificationBell } from "../ui";
import { PropertyCategory } from "@/app/main/services/propertyUtils";
import BottomSheet from "../profileScreens/components/ui/SheetIndicator";
import Feather from "react-native-vector-icons/Feather";

interface Props {
  selectedCategory: PropertyCategory;
  onChangeCategory: (c: PropertyCategory) => void;
  propertyData?: any[];
}

export default function TopMenu({ selectedCategory, onChangeCategory, propertyData = [] }: Props) {
  const insets = useSafeAreaInsets();
  const [showNotificationSheet, setShowNotificationSheet] = useState(false);

  // Count properties by category
  const getCategoryCount = (category: PropertyCategory): number => {
    return propertyData.filter(property => property.category === category).length;
  };

  const categories: PropertyCategory[] = ["Available", "Funded", "Exited"];

  return (
    <SafeAreaView edges={["top"]} style={styles.safeContainer}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header with title and icons */}
        <View className="flex-row items-center justify-between px-4 py-3">
          <Text className="text-xl font-bold text-gray-900">Properties</Text>
          
          <View className="flex-row items-center">
            {/* Bookmark icon */}
            <TouchableOpacity className="p-2 mr-1">
              <Feather name="bookmark" size={22} color="#6B7280" />
            </TouchableOpacity>
            
            {/* Notification bell with badge */}
            <View className="relative">
              <TouchableOpacity 
                className="p-2"
                onPress={() => setShowNotificationSheet(true)}
              >
                <Feather name="bell" size={22} color="#6B7280" />
              </TouchableOpacity>
              <View className="absolute top-0 right-0 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-white text-xs font-bold">2</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Category tabs */}
        <View className="px-4 pb-3">
          <View className="flex-row">
            {categories.map((category) => {
              const count = getCategoryCount(category);
              const isSelected = selectedCategory === category;
              
              return (
                <TouchableOpacity
                  key={category}
                  onPress={() => onChangeCategory(category)}
                  className={`mr-6 pb-2 ${isSelected ? 'border-b-2 border-blue-500' : ''}`}
                >
                  <Text className={`text-sm font-medium ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                    {category} ({count})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Divider */}
        <View className="w-full h-px bg-gray-200" />

        {/* Bottom sheet for notifications */}
        <BottomSheet
          visible={showNotificationSheet}
          onClose={() => setShowNotificationSheet(false)}
        >
          <View className="py-4 px-4">
            <Text className="text-lg font-bold text-gray-800 mb-4 text-center">
              Notifications & Actions
            </Text>

            {/* Cards */}
            <View className="space-y-3">
              <View className="bg-blue-50 p-3 rounded-lg">
                <Text className="font-semibold text-blue-800 mb-2">
                  📊 Investment Updates
                </Text>
                <Text className="text-blue-700 text-sm">
                  Get notified about your investment progress, dividend
                  payments, and portfolio performance.
                </Text>
              </View>

              <View className="bg-green-50 p-3 rounded-lg">
                <Text className="font-semibold text-green-800 mb-2">
                  🏠 New Properties
                </Text>
                <Text className="text-green-700 text-sm">
                  Be the first to know when new investment opportunities become
                  available.
                </Text>
              </View>

              <View className="bg-orange-50 p-3 rounded-lg">
                <Text className="font-semibold text-orange-800 mb-2">
                  ⚡ Quick Actions
                </Text>
                <Text className="text-orange-700 text-sm">
                  Access your cart, saved properties, and recent activities from
                  the top menu icons.
                </Text>
              </View>

              <View className="bg-purple-50 p-3 rounded-lg">
                <Text className="font-semibold text-purple-800 mb-2">
                  📈 Market Insights
                </Text>
                <Text className="text-purple-700 text-sm">
                  Receive market updates and investment tips to maximize your
                  returns.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setShowNotificationSheet(false)}
              className="bg-green-600 py-3 rounded-lg mt-4"
            >
              <Text className="text-white font-semibold text-center">
                Got it!
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheet>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: "#fff",
  },
  container: {
    backgroundColor: "#fff",
  },
});
