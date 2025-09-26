export interface FinnhubSymbol {
  symbol: string;
  description: string;
  displaySymbol: string;
  type: string;
}

export interface PriceAlert {
  price: number;
  createdAt: string;
}
export interface LivePrice {
  price: number;
  percent: number;
  previousPrice?: number;
  timestamp: number;
}
export interface SelectedStock extends FinnhubSymbol {
  dateAdded: string;
  alerts?: PriceAlert[]; 
}

export interface SearchResponse {
  count: number;
  result: FinnhubSymbol[];
}

export interface StocksState {
  selectedStocks: SelectedStock[];
  searchResults: FinnhubSymbol[];
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  searchError: string | null;
   livePrices: { [symbol: string]: LivePrice };
}