import { View } from "moti";
import { Text, TouchableOpacity } from "react-native";

interface SolidButtonProps {
  title: string;
  onPress: () => void;
  width?: string;
  height?: string;
  paddingX?: string;
  paddingY?: string;
}

export default function OutlinedButton({
  title,
  onPress,
  width = "w-auto",
  height = "11",
  paddingX = "px-4",
  paddingY = "py-3",
}: SolidButtonProps) {
  return (
    <View>
      <TouchableOpacity
        className={`flex-row items-center justify-center bg-primary rounded-xl w-${width} h-14 px-${paddingX} py-${paddingY} shadow`}
        onPress={onPress}
      >
        <Text className="font-medium text-[#fafafa] text-center text-xl">
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
