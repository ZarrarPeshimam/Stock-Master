import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { Feather } from "@expo/vector-icons";

export default function Dashboard() {
  const theme = useTheme();

  const menuItems = [
    { label: "Products", icon: "package", route: "/products" },
    { label: "Receipts", icon: "file-plus", route: "/receipts" },
    { label: "Delivery", icon: "truck", route: "/delivery" },
    { label: "History", icon: "clock", route: "/history" },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* HEADER */}
      <Text
        style={{
          ...theme.typography.h1,
          marginBottom: 20,
        }}
      >
        Dashboard
      </Text>

      {/* QUICK KPIs */}
      <View style={{ flexDirection: "row", gap: 12 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: theme.primaryLight,
            padding: 16,
            borderRadius: theme.radius,
          }}
        >
          <Text style={{ fontSize: 13, color: theme.textBody }}>Total Items</Text>
          <Text style={{ fontSize: 22, fontWeight: "700", color: theme.primary }}>
            248
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: "#FEF3C7",
            padding: 16,
            borderRadius: theme.radius,
          }}
        >
          <Text style={{ fontSize: 13, color: theme.textBody }}>Low Stock</Text>
          <Text style={{ fontSize: 22, fontWeight: "700", color: "#D97706" }}>
            12
          </Text>
        </View>
      </View>

      {/* MENU CARDS */}
      <View style={{ marginTop: 30 }}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.route}
            onPress={() => router.push(item.route)}
            style={{
              backgroundColor: theme.card,
              padding: 16,
              borderRadius: theme.radius,
              borderWidth: 1,
              borderColor: theme.border,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
              ...theme.shadow,
            }}
          >
            <Feather
              name={item.icon}
              size={22}
              color={theme.primary}
              style={{ marginRight: 14 }}
            />

            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: theme.textDark,
              }}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
