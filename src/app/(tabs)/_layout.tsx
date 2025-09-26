import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { HapticTab } from "@/src/components/haptic-tab";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={24} color="#666" />
          ),
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          title: "WatchList",
          tabBarIcon: ({ color }) => (
            <AntDesign name="line-chart" size={24} color="#666" />
          ),
        }}
      />

      <Tabs.Screen
        name="charts"
        options={{
          title: "Charts",
          tabBarIcon: ({ color }) => (
            <EvilIcons name="chart" size={24} color="#666" />
          ),
        }}
      />
    </Tabs>
  );
}
