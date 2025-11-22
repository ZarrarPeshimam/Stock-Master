import React, { useMemo, useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  Image,
} from "react-native";
import { useReceipts } from "../context/ReceiptContext";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function CreateReceipt() {
  const { addReceipt } = useReceipts();

  // Receipt metadata
  const [supplier, setSupplier] = useState("");
  const [date, setDate] = useState("");

  // Item being edited
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [rate, setRate] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [discountType, setDiscountType] = useState("amount");
  const [taxPercent, setTaxPercent] = useState("");

  const [items, setItems] = useState([]);

  // animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
    }).start();
  }, []);

  function computeItemTotals(qty, rateVal, discountVal, discountT, taxPct) {
    const q = Number(qty) || 0;
    const r = Number(rateVal) || 0;
    const d = Number(discountVal) || 0;
    const t = Number(taxPct) || 0;

    const subtotal = q * r;
    const taxAmount = (subtotal * t) / 100;

    let discountAmount = 0;
    if (discountT === "percent") discountAmount = (subtotal * d) / 100;
    else discountAmount = d;

    const itemTotal = subtotal + taxAmount - discountAmount;

    return {
      subtotal,
      taxAmount,
      discountAmount,
      itemTotal,
    };
  }

  const addItem = () => {
    if (!itemName || !quantity || !rate) {
      Alert.alert("Validation", "Please fill item name, quantity and rate.");
      return;
    }

    const { subtotal, taxAmount, discountAmount, itemTotal } = computeItemTotals(
      quantity,
      rate,
      discountValue,
      discountType,
      taxPercent
    );

    const newItem = {
      id: Date.now().toString(),
      itemName,
      quantity: Number(quantity),
      unit,
      rate: Number(rate),
      discountType,
      discountValue: Number(discountValue) || 0,
      taxPercent: Number(taxPercent) || 0,
      subtotal,
      taxAmount,
      discountAmount,
      total: itemTotal,
    };

    setItems((prev) => [...prev, newItem]);

    // reset
    setItemName("");
    setQuantity("");
    setUnit("pcs");
    setRate("");
    setDiscountValue("");
    setDiscountType("amount");
    setTaxPercent("");
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const grandTotal = useMemo(
    () => items.reduce((sum, it) => sum + Number(it.total), 0),
    [items]
  );

  const handleSaveReceipt = () => {
    if (!supplier || !date) {
      Alert.alert("Validation", "Fill supplier and date.");
      return;
    }
    if (items.length === 0) {
      Alert.alert("Validation", "Add at least one item.");
      return;
    }

    const receipt = {
      supplier,
      date,
      items,
      grandTotal,
    };

    addReceipt(receipt);
    router.back();
  };

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      {/* HEADER */}
      <LinearGradient
        colors={["#34D399", "#059669"]}
        style={{ paddingTop: 60, paddingBottom: 10 }}
      >
        <View
          style={{
            paddingHorizontal: 20,
            paddingBottom: 12,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
            <Feather name="arrow-left" size={22} color="white" />
          </TouchableOpacity>

          <Text style={{ color: "white", fontSize: 22, fontWeight: "800" }}>
            New Receipt
          </Text>
        </View>
      </LinearGradient>

      {/* BODY */}
      <ScrollView
        contentContainerStyle={{ padding: 20, backgroundColor: "#F1F5F9" }}
      >
        {/* Supplier & Date */}
        <View
          style={{
            backgroundColor: "white",
            padding: 16,
            borderRadius: 14,
            marginBottom: 14,
          }}
        >
          <Text style={{ fontWeight: "700", marginBottom: 6 }}>Supplier</Text>
          <TextInput
            placeholder="Supplier name"
            value={supplier}
            onChangeText={setSupplier}
            style={{
              borderWidth: 1,
              borderColor: "#E2E8F0",
              borderRadius: 10,
              padding: 10,
              backgroundColor: "#FAFBFE",
              marginBottom: 10,
            }}
          />

          <Text style={{ fontWeight: "700", marginBottom: 6 }}>Date</Text>
          <TextInput
            placeholder="YYYY-MM-DD"
            value={date}
            onChangeText={setDate}
            style={{
              borderWidth: 1,
              borderColor: "#E2E8F0",
              borderRadius: 10,
              padding: 10,
              backgroundColor: "#FAFBFE",
            }}
          />
        </View>

        {/* ADD ITEM BOX */}
        <View
          style={{
            backgroundColor: "white",
            padding: 16,
            borderRadius: 14,
            marginBottom: 14,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "800", marginBottom: 10 }}>
            Add Item
          </Text>

          {/* ITEM NAME */}
          <Text style={{ fontWeight: "600" }}>Item Name</Text>
          <TextInput
            placeholder="Item name"
            value={itemName}
            onChangeText={setItemName}
            style={{
              borderWidth: 1,
              borderColor: "#E2E8F0",
              borderRadius: 10,
              padding: 10,
              marginBottom: 10,
            }}
          />

          {/* QTY + UNIT */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "600" }}>Qty</Text>
              <TextInput
                placeholder="0"
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
                style={{
                  borderWidth: 1,
                  borderColor: "#E2E8F0",
                  borderRadius: 10,
                  padding: 10,
                  marginBottom: 10,
                }}
              />
            </View>

            <View style={{ width: 100 }}>
              <Text style={{ fontWeight: "600" }}>Unit</Text>
              <TextInput
                placeholder="pcs"
                value={unit}
                onChangeText={setUnit}
                style={{
                  borderWidth: 1,
                  borderColor: "#E2E8F0",
                  borderRadius: 10,
                  padding: 10,
                  marginBottom: 10,
                }}
              />
            </View>
          </View>

          {/* RATE */}
          <Text style={{ fontWeight: "600" }}>Rate (₹)</Text>
          <TextInput
            placeholder="0"
            keyboardType="numeric"
            value={rate}
            onChangeText={setRate}
            style={{
              borderWidth: 1,
              borderColor: "#E2E8F0",
              borderRadius: 10,
              padding: 10,
              marginBottom: 10,
            }}
          />

          {/* TAX + DISCOUNT */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            {/* TAX */}
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "600" }}>Tax (%)</Text>
              <TextInput
                placeholder="0"
                keyboardType="numeric"
                value={taxPercent}
                onChangeText={setTaxPercent}
                style={{
                  borderWidth: 1,
                  borderColor: "#E2E8F0",
                  borderRadius: 10,
                  padding: 10,
                  marginBottom: 10,
                }}
              />
            </View>

            {/* DISCOUNT */}
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "600" }}>Discount</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TextInput
                  placeholder="0"
                  keyboardType="numeric"
                  value={discountValue}
                  onChangeText={setDiscountValue}
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: "#E2E8F0",
                    borderRadius: 10,
                    padding: 10,
                    marginRight: 8,
                  }}
                />

                <TouchableOpacity
                  onPress={() => setDiscountType("amount")}
                  style={{
                    padding: 8,
                    backgroundColor:
                      discountType === "amount" ? "#059669" : "#F3F4F6",
                    borderRadius: 8,
                    marginRight: 6,
                  }}
                >
                  <Text
                    style={{
                      color: discountType === "amount" ? "white" : "#334155",
                    }}
                  >
                    ₹
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setDiscountType("percent")}
                  style={{
                    padding: 8,
                    backgroundColor:
                      discountType === "percent" ? "#059669" : "#F3F4F6",
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      color: discountType === "percent" ? "white" : "#334155",
                    }}
                  >
                    %
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* PREVIEW */}
          <View
            style={{
              marginTop: 8,
              backgroundColor: "#FAFBFE",
              padding: 10,
              borderRadius: 10,
            }}
          >
            {(() => {
              const { subtotal, taxAmount, discountAmount, itemTotal } =
                computeItemTotals(
                  quantity,
                  rate,
                  discountValue,
                  discountType,
                  taxPercent
                );

              return (
                <>
                  <Text style={{ fontWeight: "700" }}>Preview</Text>
                  <Text>Subtotal: ₹{subtotal.toFixed(2)}</Text>
                  <Text>Tax: ₹{taxAmount.toFixed(2)}</Text>
                  <Text>Discount: -₹{discountAmount.toFixed(2)}</Text>

                  <Text
                    style={{
                      fontWeight: "800",
                      marginTop: 6,
                    }}
                  >
                    Item Total: ₹{itemTotal.toFixed(2)}
                  </Text>
                </>
              );
            })()}
          </View>

          {/* ADD ITEM BUTTON */}
          <TouchableOpacity
            onPress={addItem}
            style={{
              marginTop: 12,
              backgroundColor: "#059669",
              padding: 12,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "700" }}>
              <Feather name="plus" /> Add Item
            </Text>
          </TouchableOpacity>
        </View>

        {/* ITEMS LIST */}
        <Text style={{ fontWeight: "800", marginBottom: 10 }}>Items</Text>
        {items.length === 0 ? (
          <Text style={{ color: "#64748B" }}>No items added yet.</Text>
        ) : (
          items.map((it) => (
            <View
              key={it.id}
              style={{
                backgroundColor: "white",
                padding: 12,
                borderRadius: 10,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: "#E2E8F0",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <Text style={{ fontSize: 16, fontWeight: "700" }}>
                  {it.itemName}{" "}
                  <Text style={{ fontWeight: "600", color: "#64748B" }}>
                    ({it.quantity} {it.unit} × ₹{it.rate})
                  </Text>
                </Text>
                <Text style={{ color: "#475569" }}>
                  Tax {it.taxPercent}% • Discount{" "}
                  {it.discountType === "percent"
                    ? it.discountValue + "%"
                    : "₹" + it.discountValue}
                </Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={{ fontWeight: "800", color: "#059669" }}>
                  ₹{it.total.toFixed(2)}
                </Text>

                <TouchableOpacity
                  onPress={() => removeItem(it.id)}
                  style={{ marginTop: 8 }}
                >
                  <Feather name="trash-2" size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {/* GRAND TOTAL + SAVE */}
        <View
          style={{
            backgroundColor: "white",
            padding: 14,
            borderRadius: 12,
            marginTop: 8,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Text style={{ fontWeight: "700" }}>Grand Total</Text>
            <Text style={{ fontWeight: "800" }}>₹{grandTotal.toFixed(2)}</Text>
          </View>

          <TouchableOpacity
            onPress={handleSaveReceipt}
            style={{
              backgroundColor: "#2563EB",
              padding: 14,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "800" }}>
              Save Receipt
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Animated.View>
  );
}
