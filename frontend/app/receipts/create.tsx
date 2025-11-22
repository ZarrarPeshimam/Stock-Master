import { View, Text, TextInput, Button } from "react-native";

export default function CreateReceipt() {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Create Receipt</Text>

      <Text>Supplier</Text>
      <TextInput style={{ borderWidth: 1 }} />

      <Text>Product</Text>
      <TextInput style={{ borderWidth: 1 }} />

      <Text>Qty</Text>
      <TextInput style={{ borderWidth: 1 }} />

      <Button title="Receive" onPress={() => alert("Received")} />
    </View>
  );
}
