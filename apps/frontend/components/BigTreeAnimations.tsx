import {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

/**
 * Big Tree 精选动画组件
 * 包含2个经典动画效果：经典摇摆、波浪出现
 */

// 动画Hook - 经典摇摆
export const useSwayAnimation = () => {
  const bigRotation = useSharedValue(0);
  const treeRotation = useSharedValue(0);
  const bigScale = useSharedValue(1);
  const treeScale = useSharedValue(1);
  const bigY = useSharedValue(0);
  const treeY = useSharedValue(0);
  const separationDistance = useSharedValue(8);

  const startSwayAnimation = () => {
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
  };

  return {
    bigRotation,
    treeRotation,
    bigScale,
    treeScale,
    bigY,
    treeY,
    separationDistance,
    startSwayAnimation,
  };
};

// 动画Hook - 波浪出现
export const useWaveAnimation = () => {
  const bigY = useSharedValue(0);
  const treeY = useSharedValue(0);
  const bigScale = useSharedValue(1);
  const treeScale = useSharedValue(1);
  const containerOpacity = useSharedValue(1);

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

  return {
    bigY,
    treeY,
    bigScale,
    treeScale,
    containerOpacity,
    startWaveAnimation,
  };
};

// 统一动画Hook - 整合2个动画
export const useBigTreeAnimations = () => {
  const swayAnimation = useSwayAnimation();
  const waveAnimation = useWaveAnimation();

  // 精选动画选择器
  const triggerRandomAnimation = () => {
    const animations = [
      swayAnimation.startSwayAnimation, // 🎯 经典摇摆
      waveAnimation.startWaveAnimation, // 🌊 波浪出现
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

  // 组合所有动画样式
  const bigAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -swayAnimation.separationDistance.value },
      { translateY: swayAnimation.bigY.value || waveAnimation.bigY.value },
      { scale: swayAnimation.bigScale.value || waveAnimation.bigScale.value },
      { rotate: `${swayAnimation.bigRotation.value}deg` },
    ],
  }));

  const treeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: swayAnimation.separationDistance.value },
      { translateY: swayAnimation.treeY.value || waveAnimation.treeY.value },
      { scale: swayAnimation.treeScale.value || waveAnimation.treeScale.value },
      { rotate: `${swayAnimation.treeRotation.value}deg` },
    ],
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: waveAnimation.containerOpacity.value,
  }));

  return {
    // 动画触发器
    triggerRandomAnimation,
    startSwayAnimation: swayAnimation.startSwayAnimation,
    startWaveAnimation: waveAnimation.startWaveAnimation,

    // 动画样式
    bigAnimatedStyle,
    treeAnimatedStyle,
    containerAnimatedStyle,
  };
};
