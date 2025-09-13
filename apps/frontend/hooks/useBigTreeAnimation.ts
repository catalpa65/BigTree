import { useCallback, useEffect } from "react";
import {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

/**
 * Big Tree 动画 Hook
 * 管理登录页面的 Big Tree 文字动画效果
 */
export const useBigTreeAnimation = () => {
  // 核心动画值
  const containerOpacity = useSharedValue(0);
  const bigRotation = useSharedValue(0);
  const treeRotation = useSharedValue(0);
  const bigScale = useSharedValue(1);
  const treeScale = useSharedValue(1);
  const bigY = useSharedValue(0);
  const treeY = useSharedValue(0);
  const separationDistance = useSharedValue(8);

  // 启动高级摇摆动画 - 使用优化的缓动曲线
  const startSwayAnimation = useCallback(() => {
    console.log("🎨 动画效果: 🎯 经典摇摆 (Classic Sway)");
    // 取消现有动画
    cancelAnimation(bigRotation);
    cancelAnimation(treeRotation);
    cancelAnimation(bigScale);
    cancelAnimation(treeScale);
    cancelAnimation(bigY);
    cancelAnimation(treeY);
    cancelAnimation(separationDistance);

    // 重置到对称的初始状态
    bigRotation.value = -12;
    treeRotation.value = 12;
    separationDistance.value = 12;

    // 阶段1: 优雅的摇摆序列 - 使用贝塞尔曲线
    bigRotation.value = withSequence(
      // 第一次摇摆 - 加强版对称
      withTiming(12, {
        duration: 600,
        easing: Easing.bezier(0.68, -0.55, 0.265, 1.55), // 过冲效果
      }),
      // 第二次摇摆 - 优雅收束
      withTiming(-6, {
        duration: 450,
        easing: Easing.bezier(0.175, 0.885, 0.32, 1.275),
      }),
      // 最终回正 - 自然弹簧
      withSpring(0, {
        damping: 16,
        stiffness: 180,
        mass: 0.9,
        restDisplacementThreshold: 0.01,
      })
    );

    // Tree 镜像摇摆 - 艺术性延迟
    treeRotation.value = withSequence(
      withDelay(
        120, // 精心调节的延迟
        withTiming(-12, {
          duration: 600,
          easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
        })
      ),
      withTiming(6, {
        duration: 450,
        easing: Easing.bezier(0.175, 0.885, 0.32, 1.275),
      }),
      withSpring(0, {
        damping: 16,
        stiffness: 180,
        mass: 0.9,
        restDisplacementThreshold: 0.01,
      })
    );

    // 阶段2: 垂直律动 - 飘逸感
    bigY.value = withSequence(
      withTiming(-4, {
        duration: 280,
        easing: Easing.bezier(0.25, 0.46, 0.45, 0.94), // 上浮优雅
      }),
      withTiming(4, {
        duration: 380,
        easing: Easing.bezier(0.55, 0.06, 0.68, 0.19), // 下坠自然
      }),
      withSpring(0, {
        damping: 22,
        stiffness: 240,
        mass: 0.7,
        restDisplacementThreshold: 0.01,
      })
    );

    // Tree 垂直律动 - 同步镜像
    treeY.value = withSequence(
      withDelay(
        120,
        withTiming(-4, {
          duration: 280,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
        })
      ),
      withTiming(4, {
        duration: 380,
        easing: Easing.bezier(0.55, 0.06, 0.68, 0.19),
      }),
      withSpring(0, {
        damping: 22,
        stiffness: 240,
        mass: 0.7,
        restDisplacementThreshold: 0.01,
      })
    );

    // 阶段3: 脉冲缩放 - 生命力
    bigScale.value = withSequence(
      withTiming(1.18, {
        duration: 320,
        easing: Easing.bezier(0.175, 0.885, 0.32, 1.275), // 膨胀有力
      }),
      withTiming(0.85, {
        duration: 380,
        easing: Easing.bezier(0.55, 0.06, 0.68, 0.19), // 收缩紧凑
      }),
      withSpring(1, {
        damping: 18,
        stiffness: 190,
        mass: 0.8,
        restDisplacementThreshold: 0.001,
      })
    );

    // Tree 脉冲缩放 - 呼应
    treeScale.value = withSequence(
      withDelay(
        120,
        withTiming(1.18, {
          duration: 320,
          easing: Easing.bezier(0.175, 0.885, 0.32, 1.275),
        })
      ),
      withTiming(0.85, {
        duration: 380,
        easing: Easing.bezier(0.55, 0.06, 0.68, 0.19),
      }),
      withSpring(1, {
        damping: 18,
        stiffness: 190,
        mass: 0.8,
        restDisplacementThreshold: 0.001,
      })
    );

    // 阶段4: 磁性贴合 - 终极融合
    setTimeout(() => {
      separationDistance.value = withSpring(0, {
        damping: 28,
        stiffness: 280,
        mass: 0.5, // 轻盈贴合
        restDisplacementThreshold: 0.001,
      });
    }, 1000); // 精心计算的时机
  }, [
    bigRotation,
    treeRotation,
    bigScale,
    treeScale,
    bigY,
    treeY,
    separationDistance,
  ]);

  // 波浪式出现动画
  const startWaveAnimation = () => {
    console.log("🎨 动画效果: 🌊 波浪出现 (Wave Animation)");

    // 重置
    bigY.value = 20;
    treeY.value = 20;
    bigScale.value = 0.8;
    treeScale.value = 0.8;
    containerOpacity.value = 0.3;

    // 波浪式上升
    bigY.value = withSequence(
      withTiming(-5, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
      }),
      withTiming(0, { duration: 200, easing: Easing.out(Easing.quad) })
    );

    treeY.value = withSequence(
      withDelay(
        150,
        withTiming(-5, {
          duration: 300,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
        })
      ),
      withTiming(0, { duration: 200, easing: Easing.out(Easing.quad) })
    );

    // 缩放恢复
    bigScale.value = withSpring(1, { damping: 15, stiffness: 200 });
    treeScale.value = withDelay(
      150,
      withSpring(1, { damping: 15, stiffness: 200 })
    );

    // 透明度恢复
    containerOpacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.quad),
    });
  };

  // 精选动画选择器 - 2个经典动画
  const handleLogoPress = () => {
    const animations = [
      startSwayAnimation, // 🎯 经典摇摆
      startWaveAnimation, // 🌊 波浪出现
    ];
    const randomIndex = Math.floor(Math.random() * animations.length);
    const randomAnimation = animations[randomIndex];

    // 动画名称映射
    const animationNames = ["🎯 经典摇摆", "🌊 波浪出现"];

    console.log(
      `🎲 精选动画 [${randomIndex + 1}/2]: ${animationNames[randomIndex]}`
    );
    randomAnimation();
  };

  // 初始化动画效果
  useEffect(() => {
    // 优雅的淡入效果 - 迎接用户
    containerOpacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
    });

    // 延迟启动动画 - 给用户时间适应
    const startTimer = setTimeout(() => {
      console.log("🚀 初始动画启动: 使用经典摇摆作为欢迎动画");
      startSwayAnimation();
    }, 1000);

    // 设置智能化定期摇摆 - 保持活力
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        // 20% 概率自动摇摆，稀有且惊喜
        startSwayAnimation();
      }
    }, 12000); // 12秒间隔，不干扰用户

    return () => {
      clearTimeout(startTimer);
      clearInterval(interval);
    };
  }, [containerOpacity, startSwayAnimation]);

  // 动画样式
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const bigAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -separationDistance.value },
      { translateY: bigY.value },
      { scale: bigScale.value },
      { rotate: `${bigRotation.value}deg` },
    ],
  }));

  const treeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: separationDistance.value },
      { translateY: treeY.value },
      { scale: treeScale.value },
      { rotate: `${treeRotation.value}deg` },
    ],
  }));

  return {
    // 动画触发器
    handleLogoPress,
    startSwayAnimation,
    startWaveAnimation,

    // 动画样式
    containerAnimatedStyle,
    bigAnimatedStyle,
    treeAnimatedStyle,
  };
};
