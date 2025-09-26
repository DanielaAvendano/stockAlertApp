import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePrice } from "../redux/slices/stocksSlice";
import { RootState } from "../redux/store";

export const useFinnhubWS = (token: string) => {
  const dispatch = useDispatch();
  const socketRef = useRef<WebSocket | null>(null);
  const selectedStocks = useSelector(
    (state: RootState) => state.stocks.selectedStocks
  );
  const WEB_SOCKET_URL = process.env.EXPO_PUBLIC_WEBSOCKET_URL;

  useEffect(() => {
    if (!WEB_SOCKET_URL || !token || selectedStocks.length === 0) return;

    console.log("Connecting to Finnhub WebSocket...", selectedStocks.map(s => s.symbol));
    
    const socket = new WebSocket(`${WEB_SOCKET_URL}?token=${token}`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket connected");

      // subscribe to each selected stock
      selectedStocks.forEach((stock) => {
        const symbol = stock.symbol; // make sure this matches Finnhub format
        const subscribeMsg = JSON.stringify({ type: "subscribe", symbol });
        console.log("➡️ Subscribing to:", subscribeMsg);
        socket.send(subscribeMsg);
      });
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "ping") {
          // keep-alive ping
          return;
        }

        if (data.type === "trade" && data.data) {
          data.data.forEach((trade: any) => {
            console.log("📈 Trade update:", trade);
            dispatch(updatePrice({ 
              symbol: trade.s, 
              price: trade.p,
            }));
          });
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    socket.onclose = (event) => {
      console.log("⚠️ WebSocket closed:", event.code, event.reason);
    };

    return () => {
      console.log("Cleaning up WebSocket...");
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        selectedStocks.forEach((stock) => {
          try {
            socketRef.current!.send(
              JSON.stringify({ type: "unsubscribe", symbol: stock.symbol })
            );
          } catch (error) {
            console.log("Error unsubscribing:", error);
          }
        });
        socketRef.current.close();
      }
      socketRef.current = null;
    };
  }, [selectedStocks, token, dispatch, WEB_SOCKET_URL]);
};
