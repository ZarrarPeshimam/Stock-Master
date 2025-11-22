import { View, Button, Text } from "react-native";
import { router } from "expo-router";

export default function Dashboard() {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>Dashboard</Text>

      <Button title="Products" onPress={() => router.push("/products")} />
      <Button title="Receipts" onPress={() => router.push("/receipts")} />
      <Button title="Delivery" onPress={() => router.push("/delivery")} />
      <Button title="History" onPress={() => router.push("/history")} />
    </View>
  );
}
