import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import { useDelivery } from "../context/DeliveryContext";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

export default function CreateDelivery() {
  const { addDelivery } = useDelivery();

  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [type, setType] = useState("Standard");
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    if (!product || !quantity) {
      alert("Please fill all required fields");
      return;
    }

    addDelivery({ product, quantity, type, notes });
    router.back();
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F8FAFC" }}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* HEADER */}
      <Text style={{ fontSize: 30, fontWeight: "800", marginBottom: 20, color: "#0F172A" }}>
        New Delivery
      </Text>

      {/* Live Preview Card */}
      {(product || quantity) && (
        <View
          style={{
            backgroundColor: "#FFFFFF",
            padding: 18,
            borderRadius: 18,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: "#E2E8F0",
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 4,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 4 }}>
            {product || "New Delivery"}
          </Text>
          <Text style={{ color: "#475569" }}>Qty: {quantity || "—"}</Text>
          <Text style={{ color: "#3B82F6", marginTop: 6 }}>Type: {type}</Text>
        </View>
      )}

      {/* PRODUCT INPUT */}
      <Text style={{ fontSize: 15, color: "#64748B", marginBottom: 6 }}>Product</Text>

      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderWidth: 1,
          borderColor: "#E2E8F0",
          borderRadius: 14,
          padding: 12,
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Feather name="package" size={20} color="#64748B" style={{ marginRight: 10 }} />
        <TextInput
          value={product}
          onChangeText={setProduct}
          placeholder="Enter product name"
          style={{ flex: 1, fontSize: 16 }}
        />
      </View>

      {/* QUANTITY */}
      <Text style={{ fontSize: 15, color: "#64748B", marginBottom: 6 }}>Quantity</Text>

      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderWidth: 1,
          borderColor: "#E2E8F0",
          borderRadius: 14,
          padding: 12,
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Feather name="layers" size={20} color="#64748B" style={{ marginRight: 10 }} />
        <TextInput
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          placeholder="Enter quantity"
          style={{ flex: 1, fontSize: 16 }}
        />
      </View>

      {/* DELIVERY TYPE */}
      <Text style={{ fontSize: 15, color: "#64748B", marginBottom: 10 }}>Delivery Type</Text>

      <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
        {["Standard", "Express"].map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setType(t)}
            style={{
              flex: 1,
              paddingVertical: 12,
              backgroundColor: type === t ? "#3B82F6" : "#FFFFFF",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#CBD5E1",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontWeight: "600",
                color: type === t ? "white" : "#334155",
              }}
            >
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* NOTES */}
      <Text style={{ fontSize: 15, color: "#64748B", marginBottom: 6 }}>Notes (optional)</Text>

      <TextInput
        value={notes}
        onChangeText={setNotes}
        multiline
        placeholder="Add delivery instructions or notes"
        style={{
          backgroundColor: "#FFFFFF",
          borderWidth: 1,
          borderColor: "#E2E8F0",
          borderRadius: 14,
          padding: 12,
          minHeight: 90,
          textAlignVertical: "top",
          marginBottom: 28,
        }}
      />

      {/* SAVE BUTTON */}
      <TouchableOpacity
        onPress={handleSave}
        style={{
          backgroundColor: "#2563EB",
          paddingVertical: 16,
          borderRadius: 14,
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 6,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "white",
            fontSize: 18,
            fontWeight: "700",
          }}
        >
          Save Delivery
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
