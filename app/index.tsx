import { useTheme } from "@/context/ThemeContext";
import { Text, View } from "react-native";

export default function Index() {
  const { currentTheme } = useTheme();
  return (
    <View
      className={`flex-1 items-center justify-center` + (currentTheme === 'dark' ? ' bg-gray-900' : ' bg-white')
      }
    >
      <Text className="text-blue-600">Hello World. Theme: {currentTheme}</Text>
    </View>
  );
}
