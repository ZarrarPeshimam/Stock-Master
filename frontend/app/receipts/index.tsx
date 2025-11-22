import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Animated } from "react-native";
import { useReceipts } from "../context/ReceiptContext";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function ReceiptList() {
  const { receipts } = useReceipts();
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 450, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#F1F5F9" }}>
      <LinearGradient colors={["#34D399", "#059669"]} style={{ paddingTop: 60, paddingBottom: 18, paddingHorizontal: 20 }}>
        <Text style={{ color: "white", fontSize: 28, fontWeight: "800" }}>Receipts</Text>
        <Text style={{ color: "white", opacity: 0.9 }}>Recent receipts</Text>
      </LinearGradient>

      <Animated.View style={{ flex: 1, opacity: fade }}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {receipts.length === 0 ? (
            <View style={{ alignItems: "center", marginTop: 60 }}>
              <Feather name="file-plus" size={80} color="#94A3B8" />
              <Text style={{ marginTop: 16, color: "#64748B" }}>No receipts yet. Add one now.</Text>
              <TouchableOpacity onPress={() => router.push("/receipts/create")} style={{ marginTop: 12, backgroundColor: "#059669", padding: 12, borderRadius: 10 }}>
                <Text style={{ color: "white", fontWeight: "700" }}>Add Receipt</Text>
              </TouchableOpacity>
            </View>
          ) : (
            receipts.map((r) => (
              <TouchableOpacity key={r.id} onPress={() => router.push(`/receipts/${r.id}`)} style={{ backgroundColor: "white", padding: 18, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: "#E2E8F0", flexDirection: "row", alignItems: "center", justifyContent: "space-between", shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: "800" }}>{r.supplier}</Text>
                  <Text style={{ color: "#64748B", marginTop: 4 }}>{r.date}</Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: "900", color: "#059669" }}>₹{Number(r.grandTotal).toFixed(2)}</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </Animated.View>

      <TouchableOpacity onPress={() => router.push("/receipts/create")} style={{ position: "absolute", bottom: 30, right: 30, backgroundColor: "#059669", width: 62, height: 62, borderRadius: 32, justifyContent: "center", alignItems: "center", elevation: 6 }}>
        <Feather name="plus" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}
