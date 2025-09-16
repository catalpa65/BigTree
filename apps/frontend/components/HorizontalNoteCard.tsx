import { Card } from "@/components/ui/card";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

export type NoteItem = {
  id?: number; // 可选，用于后端数据
  date: Date;
  excerpt: string;
};

export function HorizontalNoteCard({
  item,
  width,
  height,
}: {
  item: NoteItem;
  width: number;
  height: number;
}) {
  const router = useRouter();
  const formatDateEnglish = (d: Date) =>
    d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  return (
    <View style={{ width }}>
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/(app)/detail",
            params: {
              date: item.date.toISOString(),
              excerpt: item.excerpt,
            },
          })
        }
        style={({ pressed }) => ({
          borderRadius: 24,
          transform: [{ scale: pressed ? 1.01 : 1 }],
          shadowColor: "#000",
          shadowOpacity: pressed ? 0.1 : 0,
          shadowRadius: pressed ? 12 : 0,
          shadowOffset: { width: 0, height: pressed ? 6 : 0 },
          elevation: pressed ? 6 : 0,
        })}
      >
        <Card
          variant="elevated"
          size="lg"
          className="p-7"
          style={{
            backgroundColor: "#fff",
            borderRadius: 24,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 3 },
            elevation: 3,
            height,
          }}
        >
          <VStack space="md" className="flex-1">
            <Text className="text-xs text-typography-400">
              {formatDateEnglish(item.date)}
            </Text>
            <View
              style={{
                height: 1,
                backgroundColor: "#111827",
                opacity: 0.06,
              }}
            />
            <Text
              className="text-base leading-6 text-typography-800"
              numberOfLines={8}
            >
              {item.excerpt}
            </Text>
          </VStack>
        </Card>
      </Pressable>
    </View>
  );
}

export default HorizontalNoteCard;
