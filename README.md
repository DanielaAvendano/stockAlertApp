# 📈 Stock Alert App

A modern **React Native** application for tracking stock prices and setting price alerts. Stay informed with real-time updates and push notifications for your selected stocks.  

---

## 🌟 Features

- **Real-time Stock Prices**: Live updates powered by **Finnhub WebSocket API**.  
- **Search & Select Stocks**: Quickly search for symbols and add them to your watchlist.  
- **Custom Price Alerts**: Set alerts for specific price targets and get notifications when triggered.  
- **Notifications**: Push notifications when stock alerts are triggered using **Expo Notifications**.  
- **Elegant UI**: Modern, gradient-based interface with responsive and clean design.  
- **Empty State Friendly**: Informative and engaging empty states for better user experience.  

---

## 📱 Screenshots

<img width="447" height="937" alt="Screenshot 2025-09-26 at 7 49 49 AM" src="https://github.com/user-attachments/assets/1f6052cf-c28b-483f-8a66-6293a03a88a6" />

<img width="449" height="933" alt="Screenshot 2025-09-26 at 7 50 00 AM" src="https://github.com/user-attachments/assets/80791405-8990-4c20-aee6-361531dde037" />

---

## ⚙️ Tech Stack

- **Frontend**: React Native + Expo  
- **State Management**: Redux Toolkit  
- **Navigation**: React Navigation  
- **API**: Finnhub (REST & WebSocket)  
- **Notifications**: Expo Notifications  
- **Styling**: React Native Styles + LinearGradient  

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18  
- Expo CLI  
- Yarn or npm  
- Android Studio / Xcode (for device emulators)  

### Installation

```bash
git@github.com:DanielaAvendano/stockAlertApp.git
cd stockAlertApp
npm install
```

### Environment Variables

Create a .env file in the root:
EXPO_PUBLIC_API_URL=https://finnhub.io/api/v1/
EXPO_PUBLIC_API_KEY=YOUR_FINNHUB_API_KEY
EXPO_PUBLIC_WEBSOCKET_URL=wss://ws.finnhub.io



