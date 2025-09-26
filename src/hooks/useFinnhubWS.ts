import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { triggerAlert, updatePrice } from "../redux/slices/stocksSlice";
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
  
    const socket = new WebSocket(`${WEB_SOCKET_URL}?token=${token}`);
    socketRef.current = socket;

    socket.onopen = () => {
      selectedStocks.forEach((stock) => {
        const symbol = stock.symbol;
        const subscribeMsg = JSON.stringify({ type: "subscribe", symbol });
        socket.send(subscribeMsg);
      });
    };

    socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        if (msg.type === "trade") {
          msg.data.forEach(async (trade: any) => {
            const { s: symbol, p: price } = trade;

            dispatch(updatePrice({ symbol, price }));

            const stock = selectedStocks.find((st) => st.symbol === symbol);
            if (stock?.alerts) {
              stock.alerts.forEach(async (alert) => {
                if (!alert.triggered && price >= alert.price) {
          
                  await Notifications.scheduleNotificationAsync({
                    content: {
                      title: `${symbol} reached $${price.toFixed(2)}`,
                      body: `Your alert at $${alert.price.toFixed(2)} was triggered.`,
                    },
                    trigger: null,
                  });

                  // Use Redux action instead of direct mutation
                  dispatch(triggerAlert({ symbol, alertPrice: alert.price }));
                }
              });
            }
          });
        }
      };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = (event) => {
      console.log("WebSocket closed:", event.code, event.reason);
    };

    return () => {
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