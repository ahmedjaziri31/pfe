import React from "react";
import { View, Text } from "react-native";
import Feather from "react-native-vector-icons/Feather";

interface PropertyImagePlaceholderProps {
  width?: number | string;
  height?: number | string;
  propertyName?: string;
  propertyType?: string;
  className?: string;
  style?: any;
  textSize?: "sm" | "md" | "lg";
}

export default function PropertyImagePlaceholder({
  width = "100%",
  height = 240,
  propertyName,
  propertyType = "Property",
  className = "",
  style = {},
  textSize = "md",
}: PropertyImagePlaceholderProps) {
  const getTextSizeClass = () => {
    switch (textSize) {
      case "sm":
        return "text-sm";
      case "lg":
        return "text-lg";
      default:
        return "text-base";
    }
  };

  const getIconSize = () => {
    switch (textSize) {
      case "sm":
        return 24;
      case "lg":
        return 48;
      default:
        return 32;
    }
  };

  return (
    <View
      className={`bg-gray-100 justify-center items-center ${className}`}
      style={{
        width,
        height,
        ...style,
      }}
    >
      <View className="items-center">
        <View className="w-16 h-16 bg-gray-200 rounded-full justify-center items-center mb-3">
          <Feather name="home" size={getIconSize()} color="#9CA3AF" />
        </View>
        <Text className={`${getTextSizeClass()} font-medium text-gray-500 text-center mb-1`}>
          {propertyName || `${propertyType} Image`}
        </Text>
        <Text className="text-xs text-gray-400 text-center">
          No image available
        </Text>
      </View>
    </View>
  );
} 