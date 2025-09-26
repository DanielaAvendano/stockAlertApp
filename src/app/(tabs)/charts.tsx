import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const screenWidth = Dimensions.get("window").width;

const Charts = () => {
  const selectedStocks = useSelector(
    (state: RootState) => state.stocks.selectedStocks
  );
  const livePrices = useSelector((state: RootState) => state.stocks.livePrices);

  const labels = selectedStocks.map((s) => s.symbol);
  const data = selectedStocks.map((s) => livePrices[s.symbol]?.price ?? 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Portfolio Value</Text>

      {data.length > 0 ? (
        <LineChart
          data={{
            labels,
            datasets: [{ data }],
          }}
          width={screenWidth - 32}
          height={280}
          yAxisLabel="$"
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: "#1f2937",
            backgroundGradientFrom: "#667eea",
            backgroundGradientTo: "#764ba2",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,
            propsForDots: {
              r: "5",
              strokeWidth: "2",
              stroke: "#764ba2",
            },
          }}
          bezier
          style={styles.chart}
        />
      ) : (
        <Text style={styles.empty}>No stock data available</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1f2937",
  },
  chart: {
    borderRadius: 16,
  },
  empty: {
    fontSize: 16,
    color: "#6b7280",
  },
});

export default Charts;
