import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useReceipts } from "../context/ReceiptContext";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function ReceiptDetail() {
  const { id } = useLocalSearchParams();
  const { receipts } = useReceipts();

  const receipt = receipts.find((r) => r.id === id);

  if (!receipt) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ fontSize: 16, color: "#64748B" }}>Receipt not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12 }}>
          <Text style={{ color: "#059669" }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F1F5F9" }}>
      <LinearGradient colors={["#2563EB", "#1E40AF"]} style={{ paddingTop: 60, paddingBottom: 18, paddingHorizontal: 20 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 12 }}>
          <Feather name="arrow-left" size={22} color="white" />
        </TouchableOpacity>
        <Text style={{ color: "white", fontSize: 22, fontWeight: "800" }}>Receipt #{receipt.id}</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={{ backgroundColor: "white", padding: 16, borderRadius: 12, marginBottom: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: "800" }}>{receipt.supplier}</Text>
          <Text style={{ color: "#64748B", marginTop: 6 }}>{receipt.date}</Text>
        </View>

        <View style={{ backgroundColor: "white", padding: 12, borderRadius: 12, marginBottom: 12 }}>
          {receipt.items.map((it) => (
            <View key={it.id} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#F1F5F9" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "700" }}>{it.itemName} <Text style={{ fontWeight: "600", color: "#64748B" }}>{it.quantity} {it.unit} × ₹{it.rate}</Text></Text>
                <Text style={{ color: "#475569", marginTop: 4 }}>Tax: {it.taxPercent}% • Discount: {it.discountType === "percent" ? it.discountValue + "%" : "₹" + it.discountValue}</Text>
              </View>
              <Text style={{ fontWeight: "800", color: "#059669" }}>₹{Number(it.total).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={{ backgroundColor: "white", padding: 16, borderRadius: 12 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
            <Text style={{ fontWeight: "700" }}>Grand Total</Text>
            <Text style={{ fontWeight: "800", color: "#0F172A" }}>₹{Number(receipt.grandTotal).toFixed(2)}</Text>
          </View>

          <TouchableOpacity onPress={() => { /* future: download / share */ }} style={{ marginTop: 12, backgroundColor: "#2563EB", padding: 12, borderRadius: 10, alignItems: "center" }}>
            <Text style={{ color: "white", fontWeight: "800" }}><Feather name="download" /> Download</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
