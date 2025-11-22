import { View, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";

export default function ProductDetail() {
  const { id } = useLocalSearchParams();

  // Sample product (replace with real data)
  const product = {
    id,
    name: "Sample Product",
    sku: "SKU-12345",
    qty: 18,
    chartData: [10, 12, 15, 20, 18], // Stock trend
  };

  const history = [
    { msg: "Stock updated to 20", time: "Yesterday" },
    { msg: "Product created", time: "2 days ago" },
  ];

  const handleDelete = () => {
    alert("Deleted product " + id);
    router.back();
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F8FAFC" }}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View
        style={{
          padding: 26,
          backgroundColor: "#0EA5E9",
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
        }}
      >
        <Text style={{ color: "white", fontSize: 28, fontWeight: "bold" }}>
          Product Detail
        </Text>
      </View>

      <View style={{ padding: 20 }}>
        {/* PRODUCT CARD */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            padding: 22,
            borderRadius: 18,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 4,
            marginBottom: 20,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Feather name="package" size={38} color="#0EA5E9" style={{ marginRight: 14 }} />
            <View>
              <Text style={{ fontSize: 22, fontWeight: "700" }}>{product.name}</Text>
              <Text style={{ color: "#64748B", marginTop: 2 }}>#{product.sku}</Text>
            </View>
          </View>

          {/* Stock Display */}
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "600" }}>Stock Level</Text>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "700",
                color: product.qty < 10 ? "#DC2626" : "#16A34A",
                marginTop: 6,
              }}
            >
              {product.qty} units
            </Text>
          </View>
        </View>

        {/* STOCK CHART */}
        <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 10 }}>
          Stock Trend
        </Text>

        <LineChart
          data={{
            labels: ["W1", "W2", "W3", "W4", "Now"],
            datasets: [{ data: product.chartData }],
          }}
          width={Dimensions.get("window").width - 40}
          height={220}
          yAxisLabel=""
          chartConfig={{
            backgroundGradientFrom: "#FFFFFF",
            backgroundGradientTo: "#FFFFFF",
            decimalPlaces: 0,
            color: () => `#0EA5E9`,
            labelColor: () => "#64748B",
            propsForDots: { r: "5", strokeWidth: "2", stroke: "#0EA5E9" },
          }}
          style={{
            borderRadius: 16,
            marginBottom: 20,
          }}
        />

        {/* TIMELINE */}
        <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 10 }}>
          Product Activity
        </Text>

        {history.map((h, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              backgroundColor: "white",
              padding: 16,
              borderRadius: 14,
              marginBottom: 12,
              alignItems: "center",
              elevation: 3,
            }}
          >
            <View
              style={{
                backgroundColor: "#E0F2FE",
                padding: 10,
                borderRadius: 12,
                marginRight: 14,
              }}
            >
              <Feather name="clock" size={22} color="#0284C7" />
            </View>

            <View>
              <Text style={{ fontSize: 16, fontWeight: "600" }}>{h.msg}</Text>
              <Text style={{ fontSize: 14, color: "#6B7280" }}>{h.time}</Text>
            </View>
          </View>
        ))}

        {/* ACTION BUTTONS */}
        <View style={{ marginTop: 20, marginBottom: 40 }}>
          {/* Edit */}
          <TouchableOpacity
            onPress={() => router.push(`/products/create?id=${id}`)}
            style={{
              backgroundColor: "#0EA5E9",
              padding: 16,
              borderRadius: 14,
              marginBottom: 12,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Feather name="edit" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
              Edit Product
            </Text>
          </TouchableOpacity>

          {/* Delete */}
          <TouchableOpacity
            onPress={handleDelete}
            style={{
              backgroundColor: "#EF4444",
              padding: 16,
              borderRadius: 14,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Feather name="trash-2" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
              Delete Product
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
