import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { StatusBar } from "react-native";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Spinner } from "@/components/ui/spinner";
import { View } from "@/components/ui/view";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import "@/global.css";
import { useEffect } from "react";

function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return; // 等待加载完成

    const inAppGroup = segments[0] === "(app)";

    if (!isAuthenticated && inAppGroup) {
      // 未登录但进入应用分组，跳到登录
      router.replace("/login");
    } else if (isAuthenticated && !inAppGroup) {
      // 已登录但不在应用分组，跳到应用首页（tabs 的 index 对应 "/"）
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, segments, router]);

  if (isLoading) {
    // 显示加载中状态
    return (
      <View className="flex-1 justify-center items-center bg-background-0">
        <Spinner size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    // 生产环境会预加载字体，不会有这个问题
    return null;
  }

  return (
    <GluestackUIProvider mode="light">
      <AuthProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          {/* Expo Router 路由配置 */}
          <AppNavigator />
          {/* 控制状态栏样式的 */}
          <StatusBar
            barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
          />
        </ThemeProvider>
      </AuthProvider>
    </GluestackUIProvider>
  );
}
