import { getRequest } from '@/src/api/';
import { FinnhubSymbol, SelectedStock, StocksState } from '@/src/types/stocks';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';


const initialState: StocksState = {
  selectedStocks: [],
  searchResults: [],
  isLoading: false,
  isSearching: false,
  error: null,
  searchError: null,
  livePrices: {},
};

export const searchStocks = createAsyncThunk(
  "stocks/searchStocks",
  async (params: { query: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await getRequest({
        url: `/search?q=${encodeURIComponent(params.query)}`,
        token: params.token,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || error.message || "Error searching stocks"
      );
    }
  }
);

export const fetchQuote = createAsyncThunk(
  "stocks/fetchQuote",
  async (params: { symbol: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await getRequest({
        url: `/quote?symbol=${params.symbol}`,
        token: params.token,
      });

      return {
        symbol: params.symbol,
        price: response.data.c,
        change: response.data.d,
        percent: response.data.dp,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || error.message || "Error fetching quote"
      );
    }
  }
);

const stocksSlice = createSlice({
  name: "stocks",
  initialState,
  reducers: {
    addStock: (state, action: PayloadAction<FinnhubSymbol>) => {
    const rawSymbol = action.payload.symbol;

      
    const normalizedSymbol = rawSymbol.includes(".")
      ? rawSymbol.split(".")[0]
      : rawSymbol;

    const existingStock = state.selectedStocks.find(
      (stock) => stock.symbol === normalizedSymbol
    );

    if (!existingStock) {
      const newStock: SelectedStock = {
        ...action.payload,
        symbol: normalizedSymbol,
        dateAdded: new Date().toISOString(),
      };
      state.selectedStocks.push(newStock);
    }
    
  },

  removeStock: (state, action: PayloadAction<string>) => {
      state.selectedStocks = state.selectedStocks.filter(
        stock => stock.symbol !== action.payload
      );
      delete state.livePrices[action.payload];
    },

    updatePrice: (
      state,
      action: PayloadAction<{
        symbol: string;
        price: number;
        timestamp?: number;
        volume?: number;
      }>
    ) => {
      const { symbol, price, timestamp = Date.now() } = action.payload;
      const currentPrice = state.livePrices[symbol];
      const previousPrice = currentPrice?.price || price;
      
      const percent = previousPrice !== 0 
        ? ((price - previousPrice) / previousPrice) * 100 
        : 0;

      state.livePrices[symbol] = {
        price,
        percent,
        previousPrice,
        timestamp,
      };
    },

    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchError = null;
      state.isSearching = false;
    },

    setPriceAlert: (
      state,
      action: PayloadAction<{ symbol: string; price: number }>
    ) => {
      const stock = state.selectedStocks.find(
        (s) => s.symbol === action.payload.symbol
      );

      if (stock) {
        if (!stock.alerts) {
          stock.alerts = [];
        }
        stock.alerts.push({
          price: action.payload.price,
          createdAt: new Date().toISOString(),
          triggered: false, 
        });
      }
    },

    triggerAlert: (
      state,
      action: PayloadAction<{ symbol: string; alertPrice: number }>
    ) => {
      const stock = state.selectedStocks.find(
        (s) => s.symbol === action.payload.symbol
      );

      if (stock?.alerts) {
        const alert = stock.alerts.find(
          (alert) => alert.price === action.payload.alertPrice && !alert.triggered
        );
        if (alert) {
          alert.triggered = true;
        }
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(searchStocks.pending, (state) => {
        state.isSearching = true;
        state.searchError = null;
      })
      .addCase(searchStocks.fulfilled, (state, action) => {
        state.isSearching = false;
        state.searchResults = action.payload.result;
        state.searchError = null;
      })
      .addCase(searchStocks.rejected, (state, action) => {
        state.isSearching = false;
        state.searchError = action.payload as string;
        state.searchResults = [];
      })
      .addCase(fetchQuote.fulfilled, (state, action) => {
        const { symbol, price, change, percent } = action.payload;
        state.livePrices[symbol] = {
        price,
        percent,
        previousPrice: price - change,
        timestamp: Date.now(),
  };
})

  },
});

export const {
  addStock,
  updatePrice,
  clearSearchResults,
  setPriceAlert,
  removeStock,
  triggerAlert, 
} = stocksSlice.actions;

export default stocksSlice.reducer;