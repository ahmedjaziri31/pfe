import React from "react";
import { View, Text, ScrollView } from "react-native";
import PropertyImagePlaceholder from "./PropertyImagePlaceholder";

export default function PropertyImagePlaceholderDemo() {
  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <Text className="text-2xl font-bold mb-6 text-center">
        Property Image Placeholders Demo
      </Text>

      {/* Large placeholder for property detail page */}
      <View className="mb-8">
        <Text className="text-lg font-semibold mb-3">Property Detail Page (Large)</Text>
        <PropertyImagePlaceholder
          height={240}
          propertyName="Luxury Marina Apartments"
          propertyType="Residential"
          textSize="lg"
        />
      </View>

      {/* Medium placeholder for property cards */}
      <View className="mb-8">
        <Text className="text-lg font-semibold mb-3">Property Card (Medium)</Text>
        <PropertyImagePlaceholder
          height={220}
          propertyName="Tunis Bay Villa"
          propertyType="Villa"
          textSize="md"
          className="rounded-t-2xl"
        />
      </View>

      {/* Small placeholder for carousel items */}
      <View className="mb-8">
        <Text className="text-lg font-semibold mb-3">Carousel Item (Small)</Text>
        <PropertyImagePlaceholder
          width={200}
          height={144}
          propertyName="Downtown Office"
          propertyType="Commercial"
          textSize="sm"
          className="rounded-xl"
        />
      </View>

      {/* Placeholder without property name */}
      <View className="mb-8">
        <Text className="text-lg font-semibold mb-3">Generic Placeholder</Text>
        <PropertyImagePlaceholder
          height={200}
          propertyType="Property"
          textSize="md"
          className="rounded-xl"
        />
      </View>

      {/* Square placeholder */}
      <View className="mb-8">
        <Text className="text-lg font-semibold mb-3">Square Format</Text>
        <PropertyImagePlaceholder
          width={200}
          height={200}
          propertyName="Apartment Complex"
          propertyType="Apartment"
          textSize="sm"
          className="rounded-xl self-center"
        />
      </View>
    </ScrollView>
  );
} 