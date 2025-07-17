import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  TopMenu,
  PropertyCard,
  PropertyCardSkeleton,
} from "@main/components/complex/index";
import { getAllProperties } from "@/app/main/services/getListings";
import {
  filterByCategory,
  PropertyCategory,
} from "@/app/main/services/propertyUtils";
import { Property } from "@shared/types/property";

type CategorizedProperty = Property & { category: PropertyCategory };

export default function MainApp() {
  const insets = useSafeAreaInsets();
  
  const [propertyData, setPropertyData] = useState<CategorizedProperty[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<PropertyCategory>("Available");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProperties = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      console.log("🔄 Fetching properties...");
      const data = await getAllProperties();
      console.log(`✅ Fetched ${data.length} properties`);

      // Debug logging
      if (data.length > 0) {
        console.log("🔍 Property data preview:");
        data.slice(0, 3).forEach((prop, index) => {
          console.log(`${index + 1}. ${prop.name}:`);
          console.log(`   - status: ${prop.status}`);
          console.log(`   - category: ${prop.category}`);
          console.log(`   - funding: ${prop.funding_percentage}%`);
        });
      }

      setPropertyData(data as CategorizedProperty[]);
    } catch (err) {
      console.error("❌ Failed to fetch properties:", err);
      setError("Failed to load properties. Using offline data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const onRefresh = () => {
    fetchProperties(true);
  };

  const filtered = useMemo(() => {
    const result = filterByCategory(propertyData, selectedCategory);
    console.log(
      `🔍 Filtering by category "${selectedCategory}": ${result.length}/${propertyData.length} properties`
    );

    if (result.length === 0 && propertyData.length > 0) {
      console.log("⚠️ No properties match the selected category!");
      console.log("Available categories in data:");
      const categories = Array.from(
        new Set(propertyData.map((p) => p.category))
      );
      categories.forEach((cat) => {
        const count = propertyData.filter((p) => p.category === cat).length;
        console.log(`  - ${cat}: ${count} properties`);
      });
    }

    return result;
  }, [propertyData, selectedCategory]);

  // Empty state component
  const EmptyState = () => (
    <View
      className="flex-1 justify-center items-center px-6"
      style={{ paddingTop: 120 }}
    >
      <Text className="text-lg font-bold text-gray-800 mb-3 text-center">
        No Properties Found
      </Text>
      <Text className="text-gray-600 text-center mb-6 text-sm leading-relaxed">
        {error
          ? "There was an issue loading properties. Please check your connection and try again."
          : `No properties available in the "${selectedCategory}" category at the moment.`}
      </Text>
      <TouchableOpacity
        onPress={onRefresh}
        className="bg-blue-500 px-6 py-3 rounded-lg"
      >
        <Text className="text-white font-semibold">Retry</Text>
      </TouchableOpacity>

      {/* Debug info */}
      {propertyData.length > 0 && (
        <View className="mt-6 p-3 bg-gray-100 rounded-lg">
          <Text className="text-xs text-gray-600 mb-1">
            Debug: {propertyData.length} total properties loaded
          </Text>
          <Text className="text-xs text-gray-600">
            Categories available:{" "}
            {Array.from(new Set(propertyData.map((p) => p.category))).join(
              ", "
            )}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View className="bg-gray-50 flex-1">
      <TopMenu
        selectedCategory={selectedCategory}
        onChangeCategory={setSelectedCategory}
        propertyData={propertyData}
      />

      {/* Error banner */}
      {error && (
        <View className="bg-yellow-100 border-l-4 border-yellow-500 p-3 mx-4 mb-3 rounded-r-lg">
          <Text className="text-yellow-800 text-sm">{error}</Text>
        </View>
      )}

      {loading ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 90 + Math.max(insets.bottom, 0), paddingTop: 16 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </ScrollView>
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <PropertyCard data={item} />}
          contentContainerStyle={{ paddingBottom: 90 + Math.max(insets.bottom, 0), paddingTop: 16 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              progressViewOffset={0}
              colors={['#3B82F6']}
              tintColor="#3B82F6"
            />
          }
        />
      )}
    </View>
  );
}
