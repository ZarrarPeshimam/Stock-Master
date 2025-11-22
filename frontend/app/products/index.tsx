import { View, Text, Button } from "react-native";
import { router } from "expo-router";

export default function ProductList() {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Product List</Text>

      <Button title="Add Product" onPress={() => router.push("/products/create")} />

      <Button
        title="Open Product #1"
        onPress={() => router.push("/products/1")}
      />
    </View>
  );
}
