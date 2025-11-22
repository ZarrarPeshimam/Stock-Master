import { createContext, useContext } from "react";
import { useColorScheme } from "react-native";
import { LightTheme, DarkTheme } from "@/constants/theme";

const ThemeContext = createContext(LightTheme);

export function ThemeProvider({ children }: any) {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
