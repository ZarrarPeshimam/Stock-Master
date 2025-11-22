import { Stack } from "expo-router";
import { DeliveryProvider } from "./context/DeliveryContext";
import { ReceiptProvider } from "./context/ReceiptContext";
import { ThemeProvider } from "@/providers/ThemeProvider";

export default function RootLayout() {
  return (
    <DeliveryProvider>
      <ReceiptProvider>
        <ThemeProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </ThemeProvider>
      </ReceiptProvider>
    </DeliveryProvider>
  );
}
