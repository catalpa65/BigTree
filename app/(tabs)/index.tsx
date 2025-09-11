import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { View } from "@/components/ui/view";
import { VStack } from "@/components/ui/vstack";
import { getRandomQuote } from "@/constants/quotes";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
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
  const [inputText, setInputText] = useState("");
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false); // 仅在有编辑/保存时显示
  const [isEditing, setIsEditing] = useState(false); // 是否正在编辑
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle"
  );
  // const [isFocused, setIsFocused] = useState(false); // 是否已聚焦

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
    scale.value = withTiming(0.98, { duration: 60, easing: Easing.linear });
  }, [scale]);

  // 按钮释放动画
  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 200,
    });
  }, [scale]);

  // 打卡功能
  const handleCheckIn = useCallback(() => {
    // 成功动画序列
    scale.value = withSequence(
      withSpring(1.1, { damping: 10, stiffness: 300 }),
      withSpring(1, { damping: 15, stiffness: 200 })
    );

    // 颜色变化动画
    colorProgress.value = withTiming(isCheckedIn ? 0 : 1, {
      duration: 400,
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
    });

    // 已移除扫光效果

    // 更新状态
    const newStatus = !isCheckedIn;
    runOnJS(setIsCheckedIn)(newStatus);
  }, [isCheckedIn, scale, colorProgress]);

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
    if (inputText.trim().length > 0 && isEditing) {
      // 延迟保存，避免频繁触发
      const timeoutId = setTimeout(() => {
        setIsEditing(false);

        // 保存完成：切换为“已保存”对钩
        setShowSaveIndicator(true);
        setSaveStatus("saved");
        saveIndicatorOpacity.value = withTiming(1, { duration: 300 });
        saveIndicatorScale.value = withTiming(1, { duration: 300 });

        // 可以在这里添加实际的保存逻辑，比如保存到本地存储或发送到服务器
        console.log("自动保存:", inputText.trim());
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
  }, [inputText, isEditing, saveIndicatorOpacity, saveIndicatorScale]);

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
              className="text-sm italic text-center opacity-80 text-typography-400"
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
                  placeholder="记录今天的一个句子、灵感或所思所想…"
                  value={inputText}
                  onChangeText={handleTextChange}
                  maxLength={1000}
                  multiline={true}
                  scrollEnabled={true}
                  textAlignVertical="top"
                  blurOnSubmit={false}
                  returnKeyType="default"
                  keyboardType="default"
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
