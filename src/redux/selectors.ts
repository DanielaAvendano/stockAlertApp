import { createSelector } from "@reduxjs/toolkit";
import { AlertStock, StocksState } from "../types/stocks";

export const selectSelectedStocks = (state: { stocks: StocksState }) =>
  state.stocks.selectedStocks;
export const selectSearchResults = (state: { stocks: StocksState }) =>
  state.stocks.searchResults;
export const selectIsSearching = (state: { stocks: StocksState }) =>
  state.stocks.isSearching;
export const selectIsLoading = (state: { stocks: StocksState }) =>
  state.stocks.isLoading;
export const selectError = (state: { stocks: StocksState }) => state.stocks.error;
export const selectSearchError = (state: { stocks: StocksState }) =>
  state.stocks.searchError;

export const selectAlerts = createSelector(
  [selectSelectedStocks],
  (selectedStocks): AlertStock[] =>
    selectedStocks.flatMap((s) =>
      (s.alerts ?? []).map((a) => ({
        symbol: s.symbol,
        description: s.description,
        displaySymbol: s.displaySymbol, 
        type: s.type,               
        price: a.price,
        createdAt: a.createdAt,
        triggered: a.triggered,
      }))
    )
);
