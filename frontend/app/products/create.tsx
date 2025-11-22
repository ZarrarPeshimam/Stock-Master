import { View, Text, TextInput, Button } from "react-native";

export default function CreateProduct() {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Add Product</Text>

      <Text>Name</Text>
      <TextInput style={{ borderWidth: 1 }} />

      <Text>SKU</Text>
      <TextInput style={{ borderWidth: 1 }} />

      <Button title="Save" onPress={() => alert("Saved")} />
    </View>
  );
}
