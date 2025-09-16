import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { View } from "@/components/ui/view";
import { VStack } from "@/components/ui/vstack";
import { getRandomQuote } from "@/constants/quotes";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import { useFocusEffect } from "@react-navigation/native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Keyboard,
  Platform,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedKeyboard,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const { user } = useAuth(); // 获取用户认证信息

  const [inputText, setInputText] = useState("");
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isPunching, setIsPunching] = useState(false); // 打卡API调用状态
  const [showSaveIndicator, setShowSaveIndicator] = useState(false); // 仅在有编辑/保存时显示
  const [isEditing, setIsEditing] = useState(false); // 是否正在编辑
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle"
  );
  const [isLoadingTodayNote, setIsLoadingTodayNote] = useState(false); // 加载今日笔记状态
  // const [isFocused, setIsFocused] = useState(false); // 是否已聚焦

  // 烟花效果 ref
  const confettiRef = useRef<any>(null);

  // 句库（常量），随机展示
  const quote = useMemo(() => getRandomQuote(), []);

  // 圆形按钮动画值
  const scale = useSharedValue(1);
  const colorProgress = useSharedValue(0);
  const breath = useSharedValue(0);

  // 保存提示动画值
  const saveIndicatorOpacity = useSharedValue(0);
  const saveIndicatorScale = useSharedValue(0.8);
  const saveSpinnerRotation = useSharedValue(0);

  // 按钮按下动画
  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.92, { duration: 80, easing: Easing.linear });
  }, [scale]);

  // 按钮释放动画
  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, {
      damping: 10,
      stiffness: 300,
    });
  }, [scale]);

  // 打卡功能
  const handleCheckIn = useCallback(async () => {
    if (isPunching) return; // 防止重复点击

    if (!user?.id) {
      Alert.alert("错误", "请先登录");
      return;
    }

    if (isCheckedIn) {
      Alert.alert("提示", "今天已经打过卡了");
      return;
    }

    setIsPunching(true);

    // 异步触发烟花效果，避免与按钮动画冲突
    setTimeout(() => {
      if (confettiRef.current) {
        confettiRef.current.start();
      }
    }, 100); // 延迟100ms，让按钮动画先执行

    try {
      // 调用后端打卡接口
      const userId = parseInt(user.id);
      if (isNaN(userId)) {
        Alert.alert("错误", "用户ID无效，请重新登录");
        return;
      }

      const response = await apiService.createPunchRecord({
        userId, // 转换为number类型
      });

      if (response.success) {
        // 异步执行成功动画，避免阻塞
        /* requestAnimationFrame(() => {
          // API调用成功，执行动画
          scale.value = withSequence(
            withSpring(1.1, { damping: 10, stiffness: 300 }),
            withSpring(1, { damping: 15, stiffness: 200 })
          );

          colorProgress.value = withTiming(1, {
            duration: 400,
            easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          });
        }); */

        // 更新状态为已打卡
        runOnJS(setIsCheckedIn)(true);
      } else {
        // API调用失败
        Alert.alert("打卡失败", response.error || "请稍后重试");
      }
    } catch (error) {
      Alert.alert("打卡失败", "网络异常，请稍后重试");
    } finally {
      setIsPunching(false);
    }
  }, [user, isPunching, isCheckedIn, scale, colorProgress]);

  // 呼吸动画（更明显但不打扰）
  useEffect(() => {
    breath.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0, {
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );
  }, [breath]);

  // 检查今日打卡状态的函数
  const checkTodayPunchStatus = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await apiService.getPunchRecordsByUser(user.id);
      if (response.success && response.data) {
        // 检查今天是否已经打卡
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayRecord = response.data.find((record: any) => {
          const punchTime = new Date(record.punchTime);
          return punchTime >= today && punchTime < tomorrow;
        });

        if (todayRecord) {
          setIsCheckedIn(true);
          // 设置按钮颜色为已打卡状态
          colorProgress.value = 1;
        }
      }
    } catch (error) {
      console.error("检查打卡状态失败:", error);
    }
  }, [user?.id, colorProgress]);

  // 检查今日打卡状态
  useEffect(() => {
    checkTodayPunchStatus();
  }, [checkTodayPunchStatus, colorProgress]);

  // 加载今日笔记的函数
  const loadTodayNote = useCallback(async () => {
    if (!user?.id) {
      console.log("用户ID不存在，跳过加载今日笔记");
      return;
    }

    // 检查用户ID是否有效
    const userId = parseInt(user.id);
    if (isNaN(userId)) {
      console.error("用户ID格式无效:", user.id);
      Alert.alert("用户数据异常", "请重新登录后再试");
      return;
    }

    try {
      setIsLoadingTodayNote(true);
      console.log("正在加载用户", user.id, "的今日笔记");
      // 统一使用字符串ID调用API
      const response = await apiService.getTodayNote(user.id);

      if (response.success && response.data) {
        // 回显今天的笔记内容
        setInputText(response.data.note || "");
        console.log("加载今日笔记成功:", response.data);
      } else {
        // 今天没有笔记，保持空白
        setInputText("");
        console.log("今日暂无笔记");
      }
    } catch (error) {
      console.error("加载今日笔记失败，用户ID:", user.id, "错误:", error);
      // 对于新用户，不显示错误提示，只是保持空白状态
      setInputText("");
    } finally {
      setIsLoadingTodayNote(false);
    }
  }, [user?.id]);

  // 获取今日笔记并回显
  useEffect(() => {
    loadTodayNote();
  }, [loadTodayNote]);

  // 监听用户变化，自动刷新数据
  useEffect(() => {
    if (user?.id) {
      console.log("用户变化，刷新Home页面数据，用户ID:", user.id);
      loadTodayNote();
      checkTodayPunchStatus();
    } else {
      // 用户登出时清空所有数据和状态
      console.log("用户登出，清空Home页面数据");
      setInputText("");
      setIsCheckedIn(false);
      setIsPunching(false);
      setIsEditing(false);
      setShowSaveIndicator(false);
      setSaveStatus("idle");
      colorProgress.value = 0;
      saveIndicatorOpacity.value = 0;
      saveIndicatorScale.value = 0.8;
    }
  }, [user?.id, loadTodayNote, checkTodayPunchStatus, colorProgress]);

  // Tab获得焦点时刷新数据
  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        console.log("Home Tab获得焦点，刷新数据");
        loadTodayNote();
        checkTodayPunchStatus();
      }
    }, [user?.id, loadTodayNote, checkTodayPunchStatus])
  );

  // 处理文本输入变化
  const handleTextChange = useCallback(
    (text: string) => {
      setInputText(text);
      setIsEditing(true);

      // 编辑中：显示“保存中”状态
      if (!showSaveIndicator) setShowSaveIndicator(true);
      setSaveStatus("saving");
      saveIndicatorOpacity.value = withTiming(1, { duration: 200 });
      saveIndicatorScale.value = withTiming(1, { duration: 200 });
    },
    [showSaveIndicator, saveIndicatorOpacity, saveIndicatorScale]
  );

  // 自动保存功能
  useEffect(() => {
    if (inputText.trim().length > 0 && isEditing && user?.id) {
      // 延迟保存，避免频繁触发
      const timeoutId = setTimeout(async () => {
        try {
          // 显示保存中状态
          setSaveStatus("saving");

          // 调用API保存今天的笔记
          const userId = parseInt(user.id);
          if (isNaN(userId)) {
            setSaveStatus("idle");
            console.error("用户ID无效，无法保存笔记");
            return;
          }

          const response = await apiService.saveTodayNote({
            userId,
            note: inputText.trim(),
          });

          if (response.success) {
            // 保存完成：切换为"已保存"对钩
            setIsEditing(false);
            setShowSaveIndicator(true);
            setSaveStatus("saved");
            saveIndicatorOpacity.value = withTiming(1, { duration: 300 });
            saveIndicatorScale.value = withTiming(1, { duration: 300 });

            console.log("自动保存今日笔记成功:", response.data);
          } else {
            // 保存失败 - 增强错误处理
            setSaveStatus("idle");
            console.error("自动保存今日笔记失败:", response.error);

            // 如果是ID格式错误，提示用户重新登录
            if (
              response.error?.includes("ID格式无效") ||
              response.error?.includes("ID或用户ID格式无效")
            ) {
              Alert.alert("保存失败", "用户数据异常，请重新登录");
            }
          }
        } catch (error) {
          setSaveStatus("idle");
          console.error("自动保存异常:", error);
        }
      }, 1000); // 1秒后自动保存

      return () => clearTimeout(timeoutId);
    } else if (inputText.trim().length === 0) {
      setIsEditing(false);
      // 文本为空：隐藏指示器，回到空闲
      setShowSaveIndicator(false);
      setSaveStatus("idle");
      saveIndicatorOpacity.value = withTiming(0, { duration: 200 });
      saveIndicatorScale.value = withTiming(0.8, { duration: 200 });
    }
  }, [
    inputText,
    isEditing,
    user?.id,
    saveIndicatorOpacity,
    saveIndicatorScale,
  ]);

  // 圆形按钮动画样式（切至深色方案）
  const circleButtonStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      colorProgress.value,
      [0, 1],
      ["#131a2b", "#1a2336"]
    );

    const breathScale = interpolate(breath.value, [0, 1], [0.982, 1.02]);

    return {
      transform: [{ scale: scale.value * breathScale }],
      backgroundColor,
    };
  });

  // 已移除水波纹样式

  // 呼吸光环（极淡）
  const breathGlowStyle = useAnimatedStyle(() => {
    const glowOpacity = interpolate(breath.value, [0, 1], [0.05, 0.07]);
    return {
      position: "absolute",
      width: 140,
      height: 140,
      borderRadius: 80,
      borderWidth: 2,
      borderColor: "rgba(148,163,184,1)",
      opacity: glowOpacity,
    };
  });

  // 已移除扫光样式

  // 保存提示动画样式
  const saveIndicatorStyle = useAnimatedStyle(() => {
    return {
      opacity: saveIndicatorOpacity.value,
      transform: [{ scale: saveIndicatorScale.value }],
    };
  });

  // 保存中：加载指示动画
  useEffect(() => {
    if (saveStatus === "saving") {
      saveSpinnerRotation.value = withRepeat(
        withTiming(360, { duration: 800, easing: Easing.linear }),
        -1
      );
    } else {
      saveSpinnerRotation.value = 0;
    }
  }, [saveStatus, saveSpinnerRotation]);

  const saveSpinnerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${saveSpinnerRotation.value}deg` }],
    };
  });

  // 已保存后自动淡出指示器（1–1.5s）
  useEffect(() => {
    if (saveStatus === "saved" && showSaveIndicator) {
      const id = setTimeout(() => {
        saveIndicatorOpacity.value = withTiming(0, { duration: 350 });
        saveIndicatorScale.value = withTiming(0.9, { duration: 350 });
        setShowSaveIndicator(false);
        setSaveStatus("idle");
      }, 1500);
      return () => clearTimeout(id);
    }
  }, [saveStatus, showSaveIndicator, saveIndicatorOpacity, saveIndicatorScale]);

  // 优雅键盘适配：键盘高度 + 安全区 + 预测栏余量
  const insets = useSafeAreaInsets();
  const keyboard = useAnimatedKeyboard();
  const EXTRA_BAR_OFFSET = Platform.OS === "ios" ? 36 : 24;
  const containerStyle = useAnimatedStyle(() => {
    return {
      paddingBottom: keyboard.height.value + insets.bottom + EXTRA_BAR_OFFSET,
    };
  }, [insets.bottom]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-background-0">
        {/* 烟花效果组件 - 设置最高层级，从按钮中心发射 */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          <ConfettiCannon
            ref={confettiRef}
            count={100}
            origin={{ x: 0, y: 0 }}
            autoStart={false}
            explosionSpeed={200}
            fallSpeed={2400}
            fadeOut={true}
            colors={["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1"]}
          />
        </View>
        <Animated.View
          style={containerStyle}
          className="flex-1 justify-center px-6"
        >
          {/* 顶部名人名言 */}
          <View
            style={{
              position: "absolute",
              top: insets.top + 8,
              left: 24,
              right: 24,
            }}
            className="items-center"
          >
            <Text
              className="text-base italic text-center opacity-80 text-typography-400"
              numberOfLines={2}
            >
              “{quote.text}” — {quote.author}
            </Text>
          </View>
          <VStack space="xl" className="items-center mx-auto w-full max-w-md">
            {/* 标题与副标题，风格对齐登录页 */}
            <VStack space="md" className="items-center">
              <Heading size="xl" className="font-medium text-typography-700">
                每日记录
              </Heading>
            </VStack>
            {/* 浮动圆形按钮 */}
            <View className="items-center mt-2">
              <Animated.View
                style={[
                  {
                    width: 140,
                    height: 140,
                    borderRadius: 80,
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.12,
                    shadowRadius: 6,
                    elevation: 6,
                  },
                  circleButtonStyle,
                ]}
              >
                <Pressable
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  onPress={handleCheckIn}
                  className="justify-center items-center w-full h-full rounded-full"
                >
                  <Animated.View style={breathGlowStyle} />
                  {isCheckedIn ? (
                    <View className="items-center">
                      <Text className="text-3xl font-bold text-white">✓</Text>
                      <Text className="mt-1 text-sm font-medium text-white/90">
                        已打卡
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-lg font-semibold text-white">
                      今日打卡
                    </Text>
                  )}
                </Pressable>
              </Animated.View>
            </View>

            {/* 多文本输入框 */}
            <View className="relative mt-4 mb-12 w-full">
              <Textarea
                variant="outline"
                size="lg"
                className="min-h-[280px] rounded-xl bg-background-50"
              >
                <TextareaInput
                  placeholder={
                    isLoadingTodayNote
                      ? "加载今日笔记中..."
                      : "记录今天的一个句子、灵感或所思所想…"
                  }
                  value={inputText}
                  onChangeText={handleTextChange}
                  maxLength={1000}
                  multiline={true}
                  scrollEnabled={true}
                  textAlignVertical="top"
                  blurOnSubmit={false}
                  returnKeyType="default"
                  keyboardType="default"
                  editable={!isLoadingTodayNote}
                  // 去除不支持的滚动回调，保持极简
                />
              </Textarea>
              <View className="flex-row justify-end px-2 py-1">
                <Text className="text-sm text-typography-300">
                  {inputText.length}/1000
                </Text>
              </View>

              {/* 自动保存提示图标 */}
              {showSaveIndicator && (
                <Animated.View
                  style={[
                    {
                      position: "absolute",
                      top: 12,
                      right: 12,
                      width: 22,
                      height: 22,
                      backgroundColor: "#111827",
                      borderRadius: 11,
                      justifyContent: "center",
                      alignItems: "center",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.18,
                      shadowRadius: 2,
                      elevation: 2,
                    },
                    saveIndicatorStyle,
                  ]}
                  accessibilityLabel={
                    saveStatus === "saving" ? "保存中" : "已保存"
                  }
                >
                  {saveStatus === "saving" ? (
                    <Animated.View
                      style={[
                        {
                          width: 14,
                          height: 14,
                          borderRadius: 7,
                          borderWidth: 2,
                          borderColor: "rgba(255,255,255,0.5)",
                          borderTopColor: "transparent",
                        },
                        saveSpinnerStyle,
                      ]}
                    />
                  ) : (
                    <Text className="text-[11px] font-medium text-white/70">
                      ✓
                    </Text>
                  )}
                </Animated.View>
              )}
            </View>
          </VStack>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}
