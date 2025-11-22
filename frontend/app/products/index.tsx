import { View, Text, TouchableOpacity, TextInput, ScrollView, Animated } from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useState, useRef, useEffect } from "react";

export default function ProductList() {
  const [search, setSearch] = useState("");

  // Animation for list items
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
    }).start();
  }, []);

  const products = [
    { id: 1, name: "Milk Packet", qty: 20 },
    { id: 2, name: "Rice Bag", qty: 12 },
    { id: 3, name: "Sugar", qty: 5 },
  ].filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={{ flex: 1, backgroundColor: "#F1F5F9", paddingHorizontal: 20 }}>
      {/* Header */}
      <View style={{ marginTop: 16, marginBottom: 20 }}>
        <Text style={{ fontSize: 32, fontWeight: "800", color: "#0F172A" }}>
          Products
        </Text>
        <Text style={{ fontSize: 15, color: "#64748B", marginTop: 4 }}>
          Manage your inventory with ease
        </Text>
      </View>

      {/* Search Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          padding: 14,
          borderRadius: 14,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: "#E2E8F0",
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Feather name="search" size={20} color="#64748B" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search products..."
          style={{ flex: 1, fontSize: 16 }}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Product List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {products.map((product, index) => (
          <Animated.View
            key={product.id}
            style={{
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            }}
          >
            <TouchableOpacity
              onPress={() => router.push(`/products/${product.id}`)}
              style={{
                backgroundColor: "#FFFFFF",
                padding: 18,
                borderRadius: 16,
                marginBottom: 14,
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#E2E8F0",
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 6,
                elevation: 3,
              }}
            >
              <Feather
                name="package"
                size={26}
                color="#0284C7"
                style={{ marginRight: 14 }}
              />

              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: "600", color: "#0F172A" }}>
                  {product.name}
                </Text>
                <Text style={{ color: "#475569", marginTop: 4 }}>
                  Quantity: {product.qty}
                </Text>
              </View>

              <Feather name="chevron-right" size={24} color="#94A3B8" />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={() => router.push("/products/create")}
        style={{
          position: "absolute",
          bottom: 30,
          right: 30,
          backgroundColor: "#0EA5E9",
          width: 65,
          height: 65,
          borderRadius: 35,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#0284C7",
          shadowOpacity: 0.4,
          shadowRadius: 8,
          elevation: 10,
        }}
      >
        <Feather name="plus" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}
