// components/carousel.tsx
import React from "react";
import {
  View,
  Image,
  FlatList,
  Dimensions,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { PaginationDot } from "@main/components/ui/index";
import PropertyImagePlaceholder from "@main/components/ui/PropertyImagePlaceholder";

interface CarouselProps {
  images: string[];
  currentIndex: number;
  onScrollEnd: (index: number) => void;
  propertyName?: string;
  propertyType?: string;
}

const screenWidth = Dimensions.get("window").width;

const Carousel = ({ images, currentIndex, onScrollEnd, propertyName, propertyType }: CarouselProps) => {
  // If no images, show placeholder
  if (!images || images.length === 0) {
    return (
      <PropertyImagePlaceholder
        width={screenWidth}
        height={240}
        propertyName={propertyName}
        propertyType={propertyType}
        textSize="lg"
      />
    );
  }

  const renderItem = ({ item }: ListRenderItemInfo<string>) => (
    <View style={{ width: screenWidth }}>
      <Image
        source={{ uri: item }}
        style={{ width: screenWidth, height: 240 }}
        resizeMode="cover"
        onError={() => {
          console.log('Image failed to load:', item);
        }}
      />
    </View>
  );

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.floor(event.nativeEvent.contentOffset.x / screenWidth);
    onScrollEnd(index);
  };

  return (
    <View style={{ position: "relative" }}>
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item, index) => `image-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate="fast"
        snapToInterval={screenWidth}
        onMomentumScrollEnd={handleScrollEnd}
      />

      {images.length > 1 && (
        <View
          style={{
            position: "absolute",
            bottom: 16,
            left: 0,
            right: 0,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {images.map((_, index) => (
            <PaginationDot
              key={`dot-${index}`}
              active={currentIndex === index}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default Carousel;
