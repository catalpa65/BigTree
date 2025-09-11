import { GrowthWall } from "@/components/GrowthWall";
import { HorizontalCarousel } from "@/components/HorizontalCarousel";
import NoteCard, { NoteItem } from "@/components/HorizontalNoteCard";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/contexts/AuthContext";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React, { useMemo } from "react";
import { View, useWindowDimensions } from "react-native";

export default function TabTwoScreen() {
  const { logout } = useAuth();
  const tabBarHeight = useBottomTabBarHeight();
  const { width: screenWidth } = useWindowDimensions();

  const listPadding = 24; // 与页面 px-6 节奏对齐
  const edgePeek = 8; // 露出的预览宽度
  const cardWidth = screenWidth - listPadding * 2 - edgePeek; // 保持 8px 预览
  const cardHeight = 280; // 固定更高的卡片高度

  const historyData: NoteItem[] = useMemo(() => {
    const today = new Date();
    const items: NoteItem[] = [];
    const excerpts = [
      {
        text: "Today I learned a concise sentence about minimalism. Less is more - this principle guides not only design but also how we approach life itself.Today I learned a concise sentence about minimalism. Less is more - this principle guides not only design but also how we approach life itself.Today I learned a concise sentence about minimalism. Less is more - this principle guides not only design but also how we approach life itself.",
      },
      {
        text: "记录：把复杂留给自己，把简单留给用户。设计的本质是为他人着想，而不是展示自己的技巧。",
      },
      {
        text: "Reflection on today's reading: The power of small, consistent actions compound over time into extraordinary results.",
      },
      {
        text: "今日思考：专注当下，不被过去束缚，不为未来焦虑。每一个当下都是重新开始的机会。",
      },
      {
        text: "Discovered an interesting perspective: Constraints often lead to creativity. When we have fewer options, we become more innovative.",
      },
      {
        text: "学习心得：真正的成长来自于走出舒适区。不断挑战自己，才能发现更广阔的世界。",
      },
    ];

    for (let i = 0; i < 6; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const excerpt = excerpts[i % excerpts.length];
      items.push({
        date: d,
        excerpt: excerpt.text,
      });
    }
    return items;
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View className="flex-1 bg-background-0">
      {/* 绿墙部分 */}
      <View className="px-6 pt-20">
        <View className="mx-auto w-full max-w-md">
          <GrowthWall weeks={20} />
        </View>
      </View>

      {/* 卡片部分 */}
      <View className="flex-1 px-6 mt-12">
        <View className="mx-auto w-full max-w-md">
          <HStack className="justify-between items-center mb-3">
            <Text className="text-base font-medium text-typography-700">
              最近记录
            </Text>
            <Text className="text-xs text-typography-400">
              {historyData.length} 条记录
            </Text>
          </HStack>

          {historyData.length === 0 ? (
            <View className="p-6 w-full rounded-2xl border border-background-300 bg-background-50">
              <Text className="text-sm text-center text-typography-400">
                暂无记录
              </Text>
            </View>
          ) : (
            <HorizontalCarousel
              data={historyData}
              keyExtractor={(item, index) => `${item.date.getTime()}-${index}`}
              listPadding={listPadding}
              separatorWidth={24}
              snapItemWidth={cardWidth}
              renderItem={({ item }) => (
                <NoteCard item={item} width={cardWidth} height={cardHeight} />
              )}
            />
          )}
        </View>
      </View>

      {/* 退出按钮部分 */}
      <View
        style={{
          position: "absolute",
          left: 24,
          right: 24,
          bottom: tabBarHeight + 4,
          zIndex: 50,
          elevation: 10,
        }}
      >
        <View className="mx-auto w-full max-w-md">
          <Button
            onPress={handleLogout}
            variant="solid"
            size="lg"
            action="primary"
          >
            <ButtonText>退出登录</ButtonText>
          </Button>
        </View>
      </View>
    </View>
  );
}
