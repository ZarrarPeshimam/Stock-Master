import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { PieChart, LineChart } from "react-native-chart-kit";

export default function History() {
  const { width: screenWidth } = useWindowDimensions();
  const chartWidth = screenWidth - 40; // container padding

  // ----- SAMPLE DATA -----
  const rawHistory = [
    { type: "product", message: "Added new product: Laptop", time: "2 mins ago" },
    { type: "receipt", message: "Created Receipt #102", time: "10 mins ago" },
    { type: "delivery", message: "Delivered 15 Boxes", time: "1 hour ago" },
    { type: "product", message: "Added new product: Mouse", time: "2 hours ago" },
    { type: "delivery", message: "Shipped Order #004", time: "Yesterday" },
    { type: "receipt", message: "Created Receipt #101", time: "2 days ago" },
  ];

  // Aggregate counts
  const counts = useMemo(() => {
    const c = { product: 0, receipt: 0, delivery: 0 };
    rawHistory.forEach((h) => {
      if (h.type in c) c[h.type]++;
    });
    return c;
  }, [rawHistory]);

  // PieChart data
  const pieData = [
    { name: "Products", count: counts.product, color: "#2563EB" },
    { name: "Receipts", count: counts.receipt, color: "#059669" },
    { name: "Deliveries", count: counts.delivery, color: "#D97706" },
  ].filter((d) => d.count > 0);

  // Weekly trend for LineChart
  const weeklyTrend = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{ data: [5, 8, 3, 9, 7, 2, 6] }],
  };

  const iconFor = (type: string) => {
    if (type === "product") return <Feather name="package" size={20} color="#2563EB" />;
    if (type === "receipt") return <Feather name="file-text" size={20} color="#059669" />;
    return <Feather name="truck" size={20} color="#D97706" />;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}>
      <Text style={[styles.title, { fontSize: chartWidth * 0.07 }]}>Activity & History</Text>

      {/* SUMMARY CARDS */}
      <View style={styles.cardsRow}>
        <View style={styles.card}>
          <Text style={[styles.cardLabel, { fontSize: chartWidth * 0.035 }]}>Total Events</Text>
          <Text style={[styles.cardValue, { fontSize: chartWidth * 0.06 }]}>{rawHistory.length}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#F8FEF6" }]}>
          <Text style={[styles.cardLabel, { fontSize: chartWidth * 0.035 }]}>Products</Text>
          <Text style={[styles.cardValue, { fontSize: chartWidth * 0.06, color: "#2563EB" }]}>{counts.product}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#FFF7ED" }]}>
          <Text style={[styles.cardLabel, { fontSize: chartWidth * 0.035 }]}>Deliveries</Text>
          <Text style={[styles.cardValue, { fontSize: chartWidth * 0.06, color: "#D97706" }]}>{counts.delivery}</Text>
        </View>
      </View>

      {/* PIE CHART */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { fontSize: chartWidth * 0.045 }]}>Activity Distribution</Text>
        {pieData.length > 0 ? (
          <PieChart
            data={pieData.map((d) => ({
              name: d.name,
              population: d.count,
              color: d.color,
              legendFontColor: "#111827",
              legendFontSize: Math.max(chartWidth * 0.03, 12),
            }))}
            width={chartWidth}
            height={chartWidth * 0.5}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        ) : (
          <Text style={{ color: "#6B7280", marginTop: 8 }}>No activity to show</Text>
        )}
      </View>

      {/* LINE CHART */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { fontSize: chartWidth * 0.045 }]}>Weekly Activity Trend</Text>
        <LineChart
          data={weeklyTrend}
          width={chartWidth}
          height={chartWidth * 0.6}
          yAxisLabel=""
          chartConfig={chartConfig}
          bezier
          style={{ borderRadius: 12 }}
        />
      </View>

      {/* TIMELINE */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { fontSize: chartWidth * 0.045 }]}>Timeline</Text>
        {rawHistory.map((item, idx) => (
          <View key={idx} style={styles.timelineRow}>
            <View style={styles.iconWrap}>{iconFor(item.type)}</View>
            <View style={styles.timelineCard}>
              <Text style={[styles.timelineMessage, { fontSize: chartWidth * 0.04 }]}>{item.message}</Text>
              <View style={styles.timelineMeta}>
                <Text style={[styles.timelineTime, { fontSize: chartWidth * 0.032 }]}>{item.time}</Text>
                <TouchableOpacity style={styles.actionButton}>
                  <Feather name="more-vertical" size={14} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(74, 85, 104, ${opacity})`,
  style: { borderRadius: 12 },
  propsForDots: { r: "4" },
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8FAFC" },
  title: { fontWeight: "700", marginBottom: 18, color: "#111827" },
  cardsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 18 },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardLabel: { color: "#6B7280", marginBottom: 6 },
  cardValue: { fontWeight: "700", color: "#111827" },
  section: { marginTop: 10, marginBottom: 14 },
  sectionTitle: { fontWeight: "700", marginBottom: 12, color: "#111827" },
  timelineRow: { flexDirection: "row", marginBottom: 12, alignItems: "flex-start" },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  timelineCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  timelineMessage: { fontWeight: "600", color: "#111827" },
  timelineMeta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  timelineTime: { color: "#6B7280" },
  actionButton: { padding: 6, borderRadius: 8, backgroundColor: "transparent" },
});
