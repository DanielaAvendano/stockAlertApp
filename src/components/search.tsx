import EvilIcons from "@expo/vector-icons/EvilIcons";
import React, { useCallback, useEffect, useState } from "react";

import { useFocusEffect } from "@react-navigation/native";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { selectSearchResults } from "../redux/selectors";
import {
  addStock,
  clearSearchResults,
  removeStock,
  searchStocks,
} from "../redux/slices/stocksSlice";
import { AppDispatch, RootState } from "../redux/store";
import { FinnhubSymbol, SelectedStock } from "../types/stocks";
import StockItem from "./StockItem";

export const FinnhubSymbolSearch = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showResults, setShowResults] = useState<boolean>(true);

  const dispatch = useDispatch<AppDispatch>();

  const searchResults = useSelector(selectSearchResults);
  const livePrices = useSelector((state: RootState) => state.stocks.livePrices);
  const selectedStocks = useSelector(
    (state: RootState) => state.stocks.selectedStocks
  );

  useEffect(() => {
    if (searchQuery.trim()) {
      dispatch(
        searchStocks({
          query: searchQuery.trim(),
          token: process.env.EXPO_PUBLIC_API_KEY!,
        })
      );
    }
  }, [searchQuery, dispatch]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setSearchQuery("");
        setShowResults(false);
        dispatch(clearSearchResults());
      };
    }, [dispatch])
  );

  const handleRemoveStock = (symbol: string, displayName?: string) => {
    Alert.alert(
      "Remove Stock",
      `Are you sure you want to remove ${displayName || symbol}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => dispatch(removeStock(symbol)),
        },
      ]
    );
  };

  const renderStock = ({ item }: { item: FinnhubSymbol }) => (
    <StockItem
      item={item}
      onPress={() => {
        dispatch(addStock(item));
        setShowResults(false);
      }}
    />
  );

  const renderSelectedStock = ({ item }: { item: SelectedStock }) => (
    <StockItem
      item={item}
      price={livePrices[item.symbol]}
      onRemove={() => handleRemoveStock(item.symbol, item.description)}
    />
  );

  const handleCloseResults = () => {
    setSearchQuery("");
    setShowResults(false);
  };

  return (
    <>
      <Text style={styles.title}>Select Stocks</Text>

      <View style={styles.inputContainer}>
        <EvilIcons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          onChangeText={(text) => {
            setSearchQuery(text);
            if (text.trim()) {
              setShowResults(true);
            }
          }}
          value={searchQuery}
          placeholder="Search symbols..."
        />

        {searchQuery.trim().length > 0 && (
          <TouchableOpacity onPress={handleCloseResults}>
            <EvilIcons name="close" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {showResults && (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.displaySymbol}
          renderItem={renderStock}
        />
      )}

      <Text style={styles.title}>Selected Items</Text>
      <FlatList
        data={selectedStocks}
        keyExtractor={(item) => item.symbol}
        renderItem={renderSelectedStock}
        style={{ marginBottom: 16 }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    elevation: 2,
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  searchButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    minWidth: 80,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
