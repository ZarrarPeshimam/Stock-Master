import { View, Text, Button } from "react-native";
import { router } from "expo-router";

export default function DeliveryList() {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Delivery Operations</Text>

      <Button title="New Delivery" onPress={() => router.push("/delivery/create")} />
    </View>
  );
}
