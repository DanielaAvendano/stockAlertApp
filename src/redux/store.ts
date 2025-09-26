import { configureStore } from '@reduxjs/toolkit';
import stocksReducer from './slices/stocksSlice';


export const store = configureStore({
  reducer: {
    stocks: stocksReducer, 
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

