import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (phoneNumber: string, verificationCode: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

interface User {
  id: string;
  phoneNumber: string;
  name?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 应用启动时检查登录状态
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      const userData = await AsyncStorage.getItem("userData");

      if (userToken && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("检查认证状态失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    phoneNumber: string,
    verificationCode: string
  ): Promise<boolean> => {
    try {
      // 这里应该调用真实的API进行验证
      // 暂时使用模拟验证：验证码为 "123456"
      if (verificationCode === "123456") {
        const userData: User = {
          id: `user_${Date.now()}`,
          phoneNumber,
          name: "用户",
        };

        const userToken = `token_${Date.now()}`;

        // 保存到本地存储
        await AsyncStorage.setItem("userToken", userToken);
        await AsyncStorage.setItem("userData", JSON.stringify(userData));

        setIsAuthenticated(true);
        setUser(userData);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("登录失败:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // 清除本地存储
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");

      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("登出失败:", error);
    }
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
