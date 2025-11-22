import { Stack } from "expo-router";
import { DeliveryProvider } from "./context/DeliveryContext";
import { ReceiptProvider } from "./context/ReceiptContext";

export default function RootLayout() {
  return (
    <DeliveryProvider>
      <ReceiptProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </ReceiptProvider>
    </DeliveryProvider>
  );
}
