import { useColorScheme } from "react-native";
import { LightTheme, DarkTheme } from "@/constants/theme";

export const useTheme = () => {
  const scheme = useColorScheme();
  return scheme === "dark" ? DarkTheme : LightTheme;
};
