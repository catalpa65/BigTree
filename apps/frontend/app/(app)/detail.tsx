import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ date?: string; excerpt?: string }>();
  const insets = useSafeAreaInsets();

  const dateLabel = useMemo(() => {
    if (!params?.date) return "";
    try {
      const d = new Date(params.date);
      return d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return params.date;
    }
  }, [params?.date]);

  return (
    <View className="flex-1 bg-background-0">
      <View className="flex-1 px-6 pt-10">
        <View className="mx-auto w-full max-w-md">
          {dateLabel ? (
            <Heading size="2xl" className="font-medium text-typography-700">
              {dateLabel}
            </Heading>
          ) : (
            <Heading size="2xl" className="font-medium text-typography-700">
              记录详情
            </Heading>
          )}
          <View style={{ height: 12 }} />
          {params?.excerpt ? (
            <Text className="text-lg leading-7 text-typography-800">
              {params.excerpt}
            </Text>
          ) : (
            <Text className="text-lg leading-7 text-typography-800">
              这是一个独立的详情页面，可以通过路由导航访问。
            </Text>
          )}
        </View>
      </View>

      <View
        style={{
          position: "absolute",
          left: 24,
          right: 24,
          bottom: insets.bottom + 32,
          zIndex: 50,
          elevation: 10,
        }}
      >
        <View className="mx-auto w-full max-w-md">
          <Button
            variant="solid"
            size="lg"
            className="h-14 rounded-xl bg-typography-900"
            onPress={() => router.back()}
          >
            <ButtonText className="text-xl font-semibold text-white">
              返回
            </ButtonText>
          </Button>
        </View>
      </View>
    </View>
  );
}
