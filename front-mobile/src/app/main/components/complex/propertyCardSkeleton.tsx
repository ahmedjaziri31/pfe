// components/complex/PropertyCardSkeleton.tsx
import React from "react";
import { View } from "react-native";
import { MotiView } from "moti";

export default function PropertyCardSkeleton() {
  return (
    <MotiView
      from={{ opacity: 0.3 }}
      animate={{ opacity: 0.7 }}
      transition={{
        type: "timing",
        duration: 1000,
        loop: true,
        repeatReverse: true,
      }}
      className="bg-white rounded-xl mx-4 mb-4 shadow-sm border border-gray-100"
    >
      {/* Image skeleton */}
      <View className="h-48 bg-gray-200 rounded-t-xl mb-4" />
      
      {/* Content skeleton */}
      <View className="px-4 pb-4">
        {/* Title skeleton */}
        <View className="h-5 bg-gray-200 rounded-lg w-4/5 mb-1" />
        
        {/* Location skeleton */}
        <View className="h-4 bg-gray-200 rounded-lg w-2/3 mb-3" />
        
        {/* Property details skeleton */}
        <View className="bg-gray-50 rounded-lg p-3 mb-3">
          <View className="flex-row justify-between">
            <View className="flex-1 items-center">
              <View className="h-3 bg-gray-200 rounded-lg w-12 mb-1" />
              <View className="h-4 bg-gray-200 rounded-lg w-6" />
            </View>
            <View className="flex-1 items-center">
              <View className="h-3 bg-gray-200 rounded-lg w-14 mb-1" />
              <View className="h-4 bg-gray-200 rounded-lg w-6" />
            </View>
            <View className="flex-1 items-center">
              <View className="h-3 bg-gray-200 rounded-lg w-10 mb-1" />
              <View className="h-4 bg-gray-200 rounded-lg w-12" />
            </View>
          </View>
        </View>
        
        {/* Additional info skeleton */}
        <View className="flex-row justify-between mb-3">
          <View className="flex-1">
            <View className="h-3 bg-gray-200 rounded-lg w-8 mb-1" />
            <View className="h-4 bg-gray-200 rounded-lg w-16" />
          </View>
          <View className="flex-1">
            <View className="h-3 bg-gray-200 rounded-lg w-12 mb-1" />
            <View className="h-4 bg-gray-200 rounded-lg w-20" />
          </View>
          <View className="flex-1">
            <View className="h-3 bg-gray-200 rounded-lg w-16 mb-1" />
            <View className="h-4 bg-gray-200 rounded-lg w-6" />
          </View>
        </View>
        
        {/* Price skeleton */}
        <View className="h-6 bg-gray-200 rounded-lg w-2/5 mb-2" />
        
        {/* Investment status skeleton */}
        <View className="flex-row justify-between items-center mb-2">
          <View className="h-4 bg-gray-200 rounded-lg w-2/5" />
          <View className="h-5 bg-gray-200 rounded-lg w-12" />
        </View>
        
        {/* Progress bar skeleton */}
        <View>
          <View className="h-2 bg-gray-200 rounded-lg w-full mb-2" />
          <View className="flex-row justify-between">
            <View className="h-3 bg-gray-200 rounded-lg w-20" />
            <View className="h-3 bg-gray-200 rounded-lg w-16" />
          </View>
        </View>
      </View>
    </MotiView>
  );
}
