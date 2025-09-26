import React from "react";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FinnhubSymbol, SelectedStock } from "../types/stocks";

type StockItemProps = {
  item: FinnhubSymbol | SelectedStock;
  price?: string | number | undefined;
  onPress?: () => void;
  onRemove?: () => void;
};

const StockItem = ({ item, price, onPress, onRemove }: StockItemProps) => {
  const Container: any = onPress ? TouchableOpacity : View;

  return (
    <Container onPress={onPress} style={styles.stockItem}>
      <View>
        <Text style={styles.symbol}>{item.displaySymbol}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
      <View>
        <View>
          {onRemove && (
            <TouchableOpacity onPress={onRemove}>
              <Text style={{ color: "red" }}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  stockItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  symbol: {
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
});

export default StockItem;
