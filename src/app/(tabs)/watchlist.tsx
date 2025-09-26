import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import { fetchQuote } from "@/src/redux/slices/stocksSlice";
import { useFinnhubWS } from "../../hooks/useFinnhubWS";
import { AppDispatch, RootState } from "../../redux/store";
import { SelectedStock } from "../../types/stocks";

const Watchlist = () => {
  const apiKey = process.env.EXPO_PUBLIC_API_KEY;

  if (!apiKey) {
    throw new Error("Missing EXPO_PUBLIC_API_KEY in .env");
  }

  useFinnhubWS(apiKey);

  const dispatch = useDispatch<AppDispatch>();
  const selectedStocks = useSelector(
    (state: RootState) => state.stocks.selectedStocks
  );

  useEffect(() => {
    if (!apiKey) return;
    selectedStocks.forEach((stock) => {
      dispatch(fetchQuote({ symbol: stock.symbol, token: apiKey }));
    });
  }, [selectedStocks, apiKey, dispatch]);

  const livePrices = useSelector((state: RootState) => state.stocks.livePrices);

  selectedStocks.forEach((stock) => {
    console.log(`Stock ${stock.symbol}:`, livePrices[stock.symbol]);
  });

  const renderItem = ({ item }: { item: SelectedStock }) => {
    const quote = livePrices[item.symbol];
    const price = quote?.price;
    const percent = quote?.percent ?? 0;

    const isPositive = percent >= 0;
    const changeColor = isPositive ? "#10b981" : "#ef4444";
    const changeIcon = isPositive ? "▲" : "▼";

    const displayPrice =
      price === undefined ? "Loading..." : `$${price.toFixed(2)}`;

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.header}>
            <View style={styles.symbolContainer}>
              <Text style={styles.symbol}>{item.symbol}</Text>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: quote ? "#10b981" : "#9ca3af" },
                ]}
              />
            </View>
            <Text style={styles.name} numberOfLines={2}>
              {item.description}
            </Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Current Price</Text>
              <Text style={styles.price}>{displayPrice}</Text>
            </View>

            <View style={styles.changeContainer}>
              <View
                style={[
                  styles.changeBadge,
                  {
                    backgroundColor: isPositive
                      ? "rgba(16,185,129,0.1)"
                      : "rgba(239,68,68,0.1)",
                  },
                ]}
              >
                <Text style={[styles.changeIcon, { color: changeColor }]}>
                  {changeIcon}
                </Text>
                <Text style={[styles.percent, { color: changeColor }]}>
                  {Math.abs(percent).toFixed(2)}%
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={[styles.leftAccent, { backgroundColor: changeColor }]} />
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyIcon}>
        <Text style={styles.emptyIconText}>📊</Text>
      </View>
      <Text style={styles.emptyTitle}>No Stocks in Watchlist</Text>
      <Text style={styles.emptySubtitle}>
        Add stocks to your watchlist to monitor their real-time prices and
        performance
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
          <Text style={styles.headerTitle}>Watchlist</Text>
          <Text style={styles.headerSubtitle}>Track your favorite stocks</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Live Prices</Text>
            <Text style={styles.stockCount}>{selectedStocks.length}</Text>
          </View>

          {selectedStocks.length === 0 ? (
            renderEmptyState()
          ) : (
            <FlatList
              data={selectedStocks}
              renderItem={renderItem}
              keyExtractor={(item) => item.symbol}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

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
  content: {
    flex: 1,
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
  stockCount: {
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
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    marginVertical: 8,
    marginHorizontal: 4,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    position: "relative",
    overflow: "hidden",
  },
  cardContent: {
    padding: 20,
  },
  symbolContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  symbol: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#1f2937",
    marginRight: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  name: {
    fontSize: 14,
    color: "#6b7280",
    fontStyle: "italic",
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  changeContainer: {
    alignItems: "flex-end",
  },
  changeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changeIcon: {
    fontSize: 12,
    marginRight: 4,
    fontWeight: "bold",
  },
  percent: {
    fontSize: 16,
    fontWeight: "bold",
  },
  leftAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  emptyStateContainer: {
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

export default Watchlist;
