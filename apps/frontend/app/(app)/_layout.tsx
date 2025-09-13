import { Stack } from "expo-router";
import React from "react";

export default function AppGroupLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="detail"
        options={{
          title: "详情页",
          headerBackVisible: false,
        }}
      />
    </Stack>
  );
}
