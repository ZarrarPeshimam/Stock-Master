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
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* HEADER */}
      <Text
        style={{
          ...(theme.typography?.h1 || { fontSize: 28, fontWeight: "700" }),
          color: theme.colors.textDark,
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
            backgroundColor: theme.colors.primaryLight,
            padding: 16,
            borderRadius: theme.radius,
          }}
        >
          <Text style={{ fontSize: 13, color: theme.colors.textBody }}>
            Total Items
          </Text>
          <Text style={{ fontSize: 22, fontWeight: "700", color: theme.colors.primary }}>
            248
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.warningLight,
            padding: 16,
            borderRadius: theme.radius,
          }}
        >
          <Text style={{ fontSize: 13, color: theme.colors.textBody }}>
            Low Stock
          </Text>
          <Text style={{ fontSize: 22, fontWeight: "700", color: theme.colors.warning }}>
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
              backgroundColor: theme.colors.card,
              padding: 16,
              borderRadius: theme.radius,
              borderWidth: 1,
              borderColor: theme.colors.border,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
              ...theme.shadow,
            }}
          >
            <Feather
              name={item.icon}
              size={22}
              color={theme.colors.primary}
              style={{ marginRight: 14 }}
            />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: theme.colors.textDark,
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
