import { View, Text, TextInput, Button } from "react-native";

export default function CreateDelivery() {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Create Delivery</Text>

      <Text>Product</Text>
      <TextInput style={{ borderWidth: 1 }} />

      <Text>Quantity</Text>
      <TextInput style={{ borderWidth: 1 }} />

      <Button title="Submit" onPress={() => alert("Delivery Created")} />
    </View>
  );
}
