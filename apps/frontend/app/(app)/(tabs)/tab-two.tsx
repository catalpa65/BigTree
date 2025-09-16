import { GrowthWall } from "@/components/GrowthWall";
import { HorizontalCarousel } from "@/components/HorizontalCarousel";
import NoteCard, { NoteItem } from "@/components/HorizontalNoteCard";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";

export default function TabTwoScreen() {
  const { logout, user } = useAuth();
  const tabBarHeight = useBottomTabBarHeight();
  const { width: screenWidth } = useWindowDimensions();

  const [historyData, setHistoryData] = useState<NoteItem[]>([]);
  const [punchRecords, setPunchRecords] = useState<
    Array<{ punchTime: string | Date }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const listPadding = 24; // 与页面 px-6 节奏对齐
  const edgePeek = 8; // 露出的预览宽度
  const cardWidth = screenWidth - listPadding * 2 - edgePeek; // 保持 8px 预览
  const cardHeight = 280; // 固定更高的卡片高度

  // 获取用户数据的函数
  const fetchUserData = useCallback(async () => {
    if (!user?.id) {
      console.log("用户ID不存在，跳过获取用户数据");
      return;
    }

    // 验证用户ID格式
    const userIdNum = parseInt(user.id);
    if (isNaN(userIdNum)) {
      console.error("用户ID格式无效:", user.id);
      return;
    }

    try {
      setIsLoading(true);

      console.log("开始获取用户数据，用户ID:", user.id);
      // 并行获取笔记列表和打卡记录
      const [notesResponse, punchResponse] = await Promise.all([
        apiService.getNotesByUser(user.id),
        apiService.getPunchRecordsByUser(user.id),
      ]);

      // 处理笔记数据
      if (notesResponse.success && notesResponse.data) {
        const notes: NoteItem[] = notesResponse.data.map((note: any) => ({
          id: note.id,
          date: new Date(note.createTime),
          excerpt: note.note,
        }));
        setHistoryData(notes);
        console.log("成功获取历史笔记数据，数量:", notes.length);
      } else {
        // 对于新用户，没有历史数据是正常情况，不需要显示错误
        console.log("暂无历史笔记数据，响应:", notesResponse);
        setHistoryData([]);
      }

      // 处理打卡记录数据
      if (punchResponse.success && punchResponse.data) {
        setPunchRecords(punchResponse.data);
        console.log("成功获取打卡记录数据，数量:", punchResponse.data.length);
      } else {
        // 对于新用户，没有打卡记录是正常情况
        console.log("暂无打卡记录，响应:", punchResponse);
        setPunchRecords([]);
      }
    } catch (error) {
      console.error("获取用户数据异常，用户ID:", user.id, "错误:", error);
      setHistoryData([]);
      setPunchRecords([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // 获取用户数据（笔记列表和打卡记录）
  useEffect(() => {
    if (user?.id) {
      fetchUserData();
    }
  }, [user?.id, fetchUserData]);

  // Tab获得焦点时刷新数据
  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        console.log("Tab获得焦点，刷新用户数据");
        fetchUserData();
      }
    }, [user?.id, fetchUserData])
  );

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View className="flex-1 bg-background-0">
      {/* 绿墙部分 */}
      <View className="px-6 pt-20">
        <View className="mx-auto w-full max-w-md">
          <GrowthWall
            weeks={20}
            punchRecords={punchRecords}
            isLoading={isLoading}
          />
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
              {isLoading ? "加载中..." : `${historyData.length} 条记录`}
            </Text>
          </HStack>

          {isLoading ? (
            <View className="p-6 w-full rounded-2xl border border-background-300 bg-background-50">
              <Text className="text-sm text-center text-typography-400">
                加载中...
              </Text>
            </View>
          ) : historyData.length === 0 ? (
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
