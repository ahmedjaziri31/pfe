import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as Progress from "react-native-progress";
import Feather from "react-native-vector-icons/Feather";
import { router } from "expo-router";
import ImageCarousel from "./ImageCarousel";

interface PropertyCardProps {
  data: {
    id: string | number;
    name: string;
    location: string;
    rooms: number | null;
    status: string;
    upload_date: string;
    annual_return_rate: number;
    total_needed: number;
    current_funded: number;
    funding_percentage: number;
    images: string[];
    property_status?: "available" | "under_review" | string;
    bathrooms?: number | null;
    area?: number | null;
    type?: string;
  };
}

export default function PropertyCard({ data }: PropertyCardProps) {
  const {
    id,
    name,
    location,
    rooms,
    status,
    upload_date,
    annual_return_rate,
    total_needed,
    current_funded,
    funding_percentage,
    images,
    property_status = "available",
    bathrooms,
    area,
    type,
  } = data;

  const progressValue = (funding_percentage || 0) / 100;
  const formatPercentage = (value: number): string => {
    return Number(value || 0).toFixed(1);
  };

  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M DT`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)},000 DT`;
    }
    return `${amount.toLocaleString()} DT`;
  };

  const handlePropertyPress = () => {
    console.log("[PropertyCard] Main card clicked for property:", id);
    router.push({
      pathname: "main/components/propertyScreens/[id]",
      params: { id },
    });
  };

  const getStatusBadgeColor = () => {
    if (funding_percentage >= 100) return "bg-blue-500";
    if (property_status === "available") return "bg-green-500";
    return "bg-orange-500";
  };

  const getStatusText = () => {
    if (funding_percentage >= 100) return "Funded";
    if (property_status === "available") return "Active";
    return "Pending";
  };

  return (
    <TouchableOpacity
      onPress={handlePropertyPress}
      className="bg-white rounded-xl mx-4 mb-4 shadow-sm border border-gray-100"
      activeOpacity={0.95}
    >
      {/* Image with overlays */}
      <View className="relative">
        <View className="h-48 rounded-t-xl overflow-hidden">
          <ImageCarousel 
            images={images} 
            propertyName={name}
            propertyType={status}
          />
        </View>
        
        {/* Status Badge */}
        <View className={`absolute top-3 left-3 ${getStatusBadgeColor()} rounded-lg px-2 py-1`}>
          <Text className="text-white text-xs font-semibold">{getStatusText()}</Text>
        </View>
        
        {/* ROI Badge */}
        <View className="absolute top-3 right-3 bg-green-600 rounded-lg px-2 py-1">
          <Text className="text-white text-xs font-bold">{formatPercentage(annual_return_rate)}% ROI</Text>
        </View>
      </View>

      {/* Content */}
      <View className="p-4">
        {/* Title and Location */}
        <Text className="text-lg font-bold text-gray-900 mb-1 leading-tight">{name}</Text>
        <View className="flex-row items-center mb-3">
          <Feather name="map-pin" size={14} color="#6B7280" />
          <Text className="text-gray-600 ml-1 text-sm">{location}</Text>
        </View>

        {/* Property Details */}
        <View className="flex-row justify-between mb-3 bg-gray-50 rounded-lg p-3">
          <View className="flex-1 items-center">
            <View className="flex-row items-center mb-1">
              <Feather name="home" size={14} color="#6B7280" />
              <Text className="text-gray-600 ml-1 text-xs">Rooms</Text>
            </View>
            <Text className="text-gray-900 font-semibold text-sm">{rooms || "—"}</Text>
          </View>
          
          <View className="w-px bg-gray-200" />
          
          <View className="flex-1 items-center">
            <View className="flex-row items-center mb-1">
              <Feather name="droplet" size={14} color="#6B7280" />
              <Text className="text-gray-600 ml-1 text-xs">Baths</Text>
            </View>
            <Text className="text-gray-900 font-semibold text-sm">{bathrooms || "2"}</Text>
          </View>
          
          <View className="w-px bg-gray-200" />
          
          <View className="flex-1 items-center">
            <View className="flex-row items-center mb-1">
              <Feather name="maximize" size={14} color="#6B7280" />
              <Text className="text-gray-600 ml-1 text-xs">Area</Text>
            </View>
            <Text className="text-gray-900 font-semibold text-sm">{area ? `${area}m²` : "1200m²"}</Text>
          </View>
        </View>

        {/* Additional Info Row */}
        <View className="flex-row justify-between mb-3">
          <View className="flex-1">
            <Text className="text-gray-500 text-xs">Type</Text>
            <Text className="text-gray-900 font-medium text-sm">{type || status}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-gray-500 text-xs">Listed</Text>
            <Text className="text-gray-900 font-medium text-sm">{upload_date}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-gray-500 text-xs">Investors</Text>
            <Text className="text-gray-900 font-medium text-sm">N/A</Text>
          </View>
        </View>

        {/* Investment Amount */}
        <Text className="text-2xl font-bold text-gray-900 mb-2">{formatCurrency(total_needed)}</Text>
        
        {/* Investment Status */}
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-blue-600 font-medium">Investment Needed</Text>
          <Text className="text-green-600 font-bold text-lg">{formatPercentage(funding_percentage)}%</Text>
        </View>

        {/* Progress Bar */}
        <View>
          <Progress.Bar
            progress={progressValue}
            width={null}
            height={6}
            borderRadius={3}
            color="#22C55E"
            unfilledColor="#F3F4F6"
            borderWidth={0}
          />
          <View className="flex-row justify-between mt-2">
            <Text className="text-gray-500 text-xs">{formatCurrency(current_funded)} funded</Text>
            <Text className="text-gray-500 text-xs">{formatCurrency(total_needed - current_funded)} remaining</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
