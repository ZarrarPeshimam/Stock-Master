import { View, Text, TextInput, Button } from "react-native";
import { router } from "expo-router";

export default function LoginScreen() {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>Login</Text>

      <Text>Email</Text>
      <TextInput style={{ borderWidth: 1, marginBottom: 10 }} />

      <Text>Password</Text>
      <TextInput secureTextEntry style={{ borderWidth: 1, marginBottom: 10 }} />

      <Button title="Login" onPress={() => router.push("/dashboard")} />
    </View>
  );
}
