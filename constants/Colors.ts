/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#059669"; // green-600 对应的颜色值
const tintColorDark = "#10b981"; // green-500 对应的颜色值，深色模式下稍亮一些

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#111827", // typography-900 对应的颜色值
    tabIconDefault: "#111827", // typography-900 对应的颜色值
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#e5e7eb", // 深色模式下使用较浅的灰色，与深色背景形成良好对比
    tabIconDefault: "#e5e7eb", // 深色模式下使用较浅的灰色
    tabIconSelected: tintColorDark,
  },
};
