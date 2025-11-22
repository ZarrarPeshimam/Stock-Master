import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { router } from "expo-router";

export default function CreateProduct() {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [qty, setQty] = useState("");

  const handleSave = () => {
    if (!name || !sku || !qty) {
      alert("Please fill all fields");
      return;
    }
    alert("Product Saved!");
    router.back();
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#F1F5F9",
        padding: 20,
      }}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      {/* Page Header */}
      <View style={{ marginBottom: 30 }}>
        <Text
          style={{
            fontSize: 32,
            fontWeight: "bold",
            color: "#0F172A",
          }}
        >
          Add New Product
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: "#64748B",
            marginTop: 6,
          }}
        >
          Fill the details below to create a new item
        </Text>
      </View>

      {/* Card Container */}
      <View
        style={{
          backgroundColor: "white",
          padding: 20,
          borderRadius: 20,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 4,
          marginBottom: 20,
        }}
      >
        {/* Product Name */}
        <Text style={{ fontSize: 16, marginBottom: 6, fontWeight: "500" }}>
          Product Name
        </Text>
        <View
          style={{
            backgroundColor: "#F8FAFC",
            borderWidth: 1,
            borderColor: "#E2E8F0",
            padding: 14,
            borderRadius: 14,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 18,
          }}
        >
          <Feather name="tag" size={20} color="#64748B" style={{ marginRight: 12 }} />
          <TextInput
            placeholder="Ex: Apple iPhone 15"
            value={name}
            onChangeText={setName}
            style={{ flex: 1, fontSize: 16 }}
          />
        </View>

        {/* SKU */}
        <Text style={{ fontSize: 16, marginBottom: 6, fontWeight: "500" }}>
          SKU Code
        </Text>
        <View
          style={{
            backgroundColor: "#F8FAFC",
            borderWidth: 1,
            borderColor: "#E2E8F0",
            padding: 14,
            borderRadius: 14,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 18,
          }}
        >
          <Feather name="hash" size={20} color="#64748B" style={{ marginRight: 12 }} />
          <TextInput
            placeholder="Ex: SKU12345"
            value={sku}
            onChangeText={setSku}
            style={{ flex: 1, fontSize: 16 }}
          />
        </View>

        {/* Quantity */}
        <Text style={{ fontSize: 16, marginBottom: 6, fontWeight: "500" }}>
          Quantity
        </Text>
        <View
          style={{
            backgroundColor: "#F8FAFC",
            borderWidth: 1,
            borderColor: "#E2E8F0",
            padding: 14,
            borderRadius: 14,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Feather name="layers" size={20} color="#64748B" style={{ marginRight: 12 }} />
          <TextInput
            placeholder="Ex: 50"
            keyboardType="numeric"
            value={qty}
            onChangeText={setQty}
            style={{ flex: 1, fontSize: 16 }}
          />
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleSave}
        style={{
          backgroundColor: "#0EA5E9",
          paddingVertical: 16,
          borderRadius: 16,
          alignItems: "center",
          shadowColor: "#0EA5E9",
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 5,
        }}
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
          Save Product
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
