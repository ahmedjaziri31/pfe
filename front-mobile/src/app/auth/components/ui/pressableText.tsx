import { View, Text, TouchableOpacity } from "react-native";

interface PressableTextProps {
  text: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function PressableText({
  text,
  onPress,
  disabled = false,
}: PressableTextProps) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Text className={`text-xs underline ${disabled ? 'text-gray-400' : 'text-[#a1a1aa]'}`}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}
