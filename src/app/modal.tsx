import { router } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { FinnhubSymbolSearch } from "../components/search";
import { clearSearchResults, setPriceAlert } from "../redux/slices/stocksSlice";
import { AppDispatch, RootState } from "../redux/store";

import { SafeAreaView } from "react-native-safe-area-context";

export default function ModalScreen() {
  const [alertPrice, setAlertPrice] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const handleSave = () => {
    if (!lastSelected) return;
    const price = parseFloat(alertPrice);
    if (!isNaN(price)) {
      dispatch(setPriceAlert({ symbol: lastSelected.symbol, price }));
      setAlertPrice("");
    }
    dispatch(clearSearchResults());
    router.dismissAll();
  };

  const selectedStocks = useSelector(
    (state: RootState) => state.stocks.selectedStocks
  );

  const lastSelected = selectedStocks[selectedStocks.length - 1];

  return (
    <SafeAreaView style={[styles.container]}>
      <View
        style={{
          justifyContent: "flex-end",
        }}
      >
        <FinnhubSymbolSearch />

        <Text style={styles.label}>Alert Price ($)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter price"
          value={alertPrice}
          onChangeText={setAlertPrice}
        />

        <Button title="Save Alert" onPress={handleSave} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
});
