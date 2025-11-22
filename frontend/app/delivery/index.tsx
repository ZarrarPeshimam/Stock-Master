import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { useDelivery } from "../context/DeliveryContext";
import { Feather } from "@expo/vector-icons";

export default function DeliveryList() {
  const { deliveries } = useDelivery();

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* HEADER */}
        <Text
          style={{
            fontSize: 30,
            fontWeight: "800",
            color: "#0F172A",
            marginBottom: 20,
          }}
        >
          Delivery Operations
        </Text>

        {/* EMPTY STATE */}
        {deliveries.length === 0 && (
          <View
            style={{
              alignItems: "center",
              marginTop: 80,
              padding: 20,
            }}
          >
            <Feather name="truck" size={80} color="#94A3B8" />
            <Text
              style={{
                marginTop: 20,
                fontSize: 18,
                color: "#64748B",
                textAlign: "center",
              }}
            >
              No deliveries yet.
            </Text>
            <Text
              style={{
                marginTop: 4,
                fontSize: 15,
                color: "#94A3B8",
                textAlign: "center",
              }}
            >
              Tap the button below to add one.
            </Text>
          </View>
        )}

        {/* DELIVERY LIST */}
        {deliveries.map((d, i) => (
          <View
            key={i}
            style={{
              backgroundColor: "#FFFFFF",
              padding: 18,
              borderRadius: 16,
              marginBottom: 14,
              borderWidth: 1,
              borderColor: "#E2E8F0",
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 4,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {/* ICON */}
            <Feather
              name="package"
              size={28}
              color="#2563EB"
              style={{ marginRight: 16 }}
            />

            {/* MAIN INFO */}
            <View style={{ flex: 1 }}>
              <Text
                style={{ fontSize: 18, fontWeight: "700", color: "#1E293B" }}
              >
                {d.product}
              </Text>

              <Text style={{ color: "#64748B", marginTop: 4, fontSize: 15 }}>
                Qty: {d.quantity}
              </Text>

              {d.type && (
                <Text
                  style={{
                    marginTop: 4,
                    fontSize: 14,
                    color: d.type === "Express" ? "#DC2626" : "#2563EB",
                  }}
                >
                  {d.type} Delivery
                </Text>
              )}
            </View>

            {/* ARROW ICON */}
            <Feather name="chevron-right" size={24} color="#94A3B8" />
          </View>
        ))}
      </ScrollView>

      {/* FLOATING ADD BUTTON */}
      <TouchableOpacity
        onPress={() => router.push("/delivery/create")}
        style={{
          position: "absolute",
          bottom: 25,
          right: 25,
          backgroundColor: "#2563EB",
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 5,
          elevation: 6,
        }}
      >
        <Feather name="plus" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}
