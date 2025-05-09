//based on light/dark color, return the color object for displaying on the screen
import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/constants/Colors";

export const useThemeColors = () => {
    const { currentTheme } = useTheme();
    return colors[currentTheme];
}