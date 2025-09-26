import { selectAlerts } from "@/src/redux/selectors";
import { AlertStock } from "@/src/types/stocks";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React from "react";
import {
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

export default function HomeScreen() {
  const alerts = useSelector(selectAlerts);
  const renderAlertItem: ListRenderItem<AlertStock> = ({ item }) => (
    <View style={styles.alertCard}>
      <View style={styles.alertHeader}>
        <View style={styles.symbolContainer}>
          <Text style={styles.symbol}>{item.symbol}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>ALERT</Text>
          </View>
        </View>
        <Text style={styles.description}>{item.description}</Text>
      </View>
      <View style={styles.alertBody}>
        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>Target Price</Text>
          <Text style={styles.priceValue}>${item.price.toFixed(2)}</Text>
        </View>
        <View style={styles.dateSection}>
          <Text style={styles.dateLabel}>Created</Text>
          <Text style={styles.dateValue}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <View style={styles.statusIndicator} />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Text style={styles.emptyIconText}>📊</Text>
      </View>
      <Text style={styles.emptyTitle}>No Active Alerts</Text>
      <Text style={styles.emptySubtitle}>
        Add your first stock alert to get started with price monitoring
      </Text>
    </View>
  );

  return (
    <LinearGradient
      colors={["#667eea", "#764ba2"]}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Stock Alerts</Text>
          <Text style={styles.headerSubtitle}>Monitor your investments</Text>
        </View>

        <Link href="/modal" push asChild>
          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.addButtonPressed,
            ]}
          >
            <LinearGradient
              colors={["#4facfe", "#00f2fe"]}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.addButtonText}>+ Add Symbol Alert</Text>
            </LinearGradient>
          </Pressable>
        </Link>

        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Alerts</Text>
            <Text style={styles.alertCount}>{alerts.length}</Text>
          </View>

          {alerts.length === 0 ? (
            renderEmptyState()
          ) : (
            <FlatList
              data={alerts}
              keyExtractor={(item, index) => `${item.symbol}-${index}`}
              renderItem={renderAlertItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
  },
  addButton: {
    borderRadius: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    marginTop: 30,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  alertCount: {
    backgroundColor: "#667eea",
    color: "white",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 14,
    fontWeight: "bold",
    minWidth: 32,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  alertCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#4facfe",
    position: "relative",
  },
  alertHeader: {
    marginBottom: 16,
  },
  symbolContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  symbol: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f2937",
  },
  badge: {
    backgroundColor: "#10b981",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
    fontStyle: "italic",
  },
  alertBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceSection: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#059669",
  },
  dateSection: {
    alignItems: "flex-end",
  },
  dateLabel: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 14,
    color: "#4b5563",
    fontWeight: "500",
  },
  statusIndicator: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10b981",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyIconText: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
  },
});
