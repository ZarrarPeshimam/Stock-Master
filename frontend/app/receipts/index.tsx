import { View, Text, Button } from "react-native";
import { router } from "expo-router";

export default function ReceiptList() {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Receipt Operations</Text>

      <Button title="New Receipt" onPress={() => router.push("/receipts/create")} />
    </View>
  );
}
