import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { VStack } from "@/components/ui/vstack";
import { useAuth } from "@/contexts/AuthContext";
import { useBigTreeAnimation } from "@/hooks/useBigTreeAnimation";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import Animated from "react-native-reanimated";

/* 
优化：
验证码60秒倒计时
加载loading
短信验证码自动填充
登录加点震动反馈
*/
//useAuth登录实现仔细看一下
export default function LoginScreen() {
  const { login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  // 使用动画Hook
  const {
    handleLogoPress,
    containerAnimatedStyle,
    bigAnimatedStyle,
    treeAnimatedStyle,
  } = useBigTreeAnimation();

  const handleSendCode = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert("提示", "请输入手机号");
      return;
    }

    // 简单的手机号验证
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert("提示", "请输入正确的手机号格式");
      return;
    }

    setCodeSent(true);
    Alert.alert("验证码已发送", "请输入验证码：123456（测试用）");
  };

  const handleLogin = async () => {
    if (!phoneNumber.trim() || !verificationCode.trim()) {
      Alert.alert("提示", "请输入手机号和验证码");
      return;
    }

    // 先隐藏键盘
    Keyboard.dismiss();

    // 添加震动反馈
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setIsLoading(true);
    try {
      const success = await login(phoneNumber, verificationCode);
      if (success) {
        router.replace("/(tabs)");
      } else {
        Alert.alert("登录失败", "验证码错误，请重试");
      }
    } catch {
      Alert.alert("登录失败", "网络错误，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-background-0">
        {/* 主内容区域 - 垂直居中 */}
        <View className="flex-1 justify-center px-6">
          <VStack space="2xl" className="items-center mx-auto w-full max-w-sm">
            {/* 品牌标题区域 */}
            <VStack space="md" className="items-center">
              <Animated.View style={containerAnimatedStyle}>
                <Pressable onPress={handleLogoPress}>
                  <View className="flex-row justify-center items-end">
                    <Animated.View style={bigAnimatedStyle}>
                      <Heading
                        size="4xl"
                        className="tracking-wide font-jakarta text-primary-700"
                        style={{
                          fontWeight: "800",
                          fontStyle: "italic",
                          letterSpacing: 1,
                        }}
                      >
                        Big
                      </Heading>
                    </Animated.View>

                    <Animated.View style={treeAnimatedStyle}>
                      <Heading
                        size="4xl"
                        className="tracking-wider text-green-700 font-code"
                        style={{
                          fontWeight: "900",
                          letterSpacing: 2,
                        }}
                      >
                        Tree
                      </Heading>
                    </Animated.View>
                  </View>
                </Pressable>
              </Animated.View>
              <Heading size="xl" className="font-medium text-typography-700">
                Welcome!
              </Heading>
              <Text className="px-4 text-base leading-relaxed text-center text-typography-500">
                每一棵参天大树，都始于一粒小小的种子。
              </Text>
            </VStack>

            {/* 登录表单区域 */}
            <VStack space="lg" className="w-full">
              {/* 手机号输入 */}
              <Input
                variant="outline"
                size="lg"
                className="h-14 rounded-xl bg-background-50"
              >
                <InputField
                  placeholder="请输入手机号"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  maxLength={11}
                />
              </Input>

              {/* 验证码输入 */}
              <View className="flex-row gap-3">
                <Input
                  variant="outline"
                  size="lg"
                  className="flex-1 h-14 rounded-xl bg-background-50"
                >
                  <InputField
                    placeholder="请输入验证码"
                    keyboardType="number-pad"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    maxLength={6}
                    onSubmitEditing={handleLogin}
                  />
                </Input>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-4 h-12 min-w-24"
                  onPress={handleSendCode}
                  isDisabled={isLoading}
                >
                  <ButtonText className="text-sm font-medium">
                    {codeSent ? "重新发送" : "获取验证码"}
                  </ButtonText>
                </Button>
              </View>

              {/* 登录按钮 */}
              <View className="mt-4 w-full">
                <Button
                  variant="solid"
                  size="lg"
                  className="w-full h-14 rounded-xl bg-typography-900"
                  onPress={handleLogin}
                  isDisabled={isLoading}
                >
                  <ButtonText className="text-lg font-semibold text-white">
                    {isLoading ? "登录中..." : "登录"}
                  </ButtonText>
                </Button>
              </View>
            </VStack>
          </VStack>
        </View>

        {/* 底部信息区域 - 固定在底部 */}
        <View className="items-center px-6 pb-8">
          <VStack space="xs" className="items-center">
            <Text className="text-sm text-center text-typography-400">
              登录即表示您同意我们的《用户协议》和《隐私政策》
            </Text>
            <Text className="text-sm font-semibold text-center text-green-600">
              support@bigtree.com
            </Text>
            <Text className="mt-2 text-xs text-center text-typography-300">
              © Big Tree English 2025 | 让世界，听得到你的声音
            </Text>
          </VStack>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
