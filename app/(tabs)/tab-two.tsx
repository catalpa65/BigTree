import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import { View } from "react-native";

export default function TabTwoScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View className="flex-1 justify-center items-center p-4 bg-background-0">
      <VStack space="lg" className="items-center">
        {user && (
          <VStack space="md" className="items-center">
            <Text className="text-lg">用户信息:</Text>
            <Text>手机号: {user.phoneNumber}</Text>
          </VStack>
        )}

        <Button
          onPress={handleLogout}
          variant="solid"
          size="lg"
          action="primary"
        >
          <ButtonText>退出登录</ButtonText>
        </Button>
      </VStack>
    </View>
  );
}
