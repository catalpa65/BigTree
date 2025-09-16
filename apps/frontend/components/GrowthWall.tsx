import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { VStack } from "@/components/ui/vstack";
import React, { useMemo } from "react";
import Svg, { Rect, Text as SvgText } from "react-native-svg";

type HeatmapValue = { date: string; count: number };

function Heatmap({
  values,
  weeks = 20,
}: {
  values: HeatmapValue[];
  weeks?: number;
}) {
  const size = 13;
  const gap = 3;
  const cols = weeks;
  const rows = 7;
  const topLabel = 14;
  const leftLabel = 32;
  const width = leftLabel + cols * (size + gap) - gap;
  const height = topLabel + rows * (size + gap) - gap;
  const color = (n: number) => {
    switch (n) {
      case 1:
        return "#9be9a8";
      case 2:
        return "#40c463";
      case 3:
        return "#30a14e";
      case 4:
        return "#216e39";
      default:
        return "#ebedf0";
    }
  };

  const rects: { x: number; y: number; fill: string }[] = [];
  const labelMonthPoints: { x: number; month: number }[] = [];
  const map = new Map<string, number>();
  for (const v of values) map.set(v.date, v.count);
  const totalCells = cols * rows;
  const today = new Date();
  let col = cols - 1;
  let row = today.getDay();
  let d = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  for (let i = 0; i < totalCells; i++) {
    const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    const count = map.get(key) ?? 0;
    const x = leftLabel + col * (size + gap);
    const y = topLabel + row * (size + gap);
    rects.push({ x, y, fill: color(count) });
    if (d.getDate() === 1)
      labelMonthPoints.push({ x: x + size / 2, month: d.getMonth() });
    d.setDate(d.getDate() - 1);
    row -= 1;
    if (row < 0) {
      row = 6;
      col -= 1;
      if (col < 0) break;
    }
  }

  const monthAbbr = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const pts = [...labelMonthPoints].sort((a, b) => a.x - b.x);

  return (
    <Svg width={width} height={height}>
      {[1, 3, 5].map((row, i) => (
        <SvgText
          key={`w-${i}`}
          x={leftLabel - 6}
          y={topLabel + row * (size + gap) + size - 3}
          fontSize={8}
          fill="#9ca3af"
          textAnchor="end"
        >
          {row === 1 ? "M" : row === 3 ? "W" : "F"}
        </SvgText>
      ))}

      {pts.map((p) => (
        <SvgText
          key={`m-${p.x}`}
          x={p.x}
          y={topLabel - 3}
          fontSize={9}
          fill="#9ca3af"
          textAnchor="middle"
        >
          {monthAbbr[p.month]}
        </SvgText>
      ))}

      {rects.map((rec, i) => (
        <Rect
          key={i}
          x={rec.x}
          y={rec.y}
          width={size}
          height={size}
          rx={3}
          ry={3}
          fill={rec.fill}
        />
      ))}
    </Svg>
  );
}

export function GrowthWall({
  weeks = 20,
  punchRecords = [],
  isLoading = false,
}: {
  weeks?: number;
  punchRecords?: Array<{ punchTime: string | Date }>;
  isLoading?: boolean;
}) {
  const values = useMemo(() => {
    // 如果正在加载，返回空数组（不显示任何内容）
    if (isLoading) {
      return [];
    }

    // 如果没有打卡记录，返回全为0的数据（而不是模拟数据）
    if (punchRecords.length === 0) {
      const days = weeks * 7;
      const today = new Date();
      const data: HeatmapValue[] = [];
      for (let i = 0; i < days; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - (days - 1 - i));
        const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
        data.push({ date: key, count: 0 }); // 全为0，表示没有打卡
      }
      return data;
    }

    // 将打卡记录转换为热力图数据
    const days = weeks * 7;
    const today = new Date();
    const data: HeatmapValue[] = [];

    // 创建日期到打卡次数的映射
    const punchMap = new Map<string, number>();

    punchRecords.forEach((record) => {
      const date = new Date(record.punchTime);
      const key = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;
      punchMap.set(key, (punchMap.get(key) || 0) + 1);
    });

    // 生成指定周数的数据
    for (let i = 0; i < days; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - (days - 1 - i));
      const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      const count = punchMap.get(key) || 0;
      // 将打卡次数映射到0-4的强度值
      const intensity = count > 0 ? Math.min(count, 4) : 0;
      data.push({ date: key, count: intensity });
    }

    return data;
  }, [weeks, punchRecords, isLoading]);

  // 如果正在加载，显示加载状态
  if (isLoading) {
    return (
      <VStack space="lg" className="items-center w-full">
        <Text className="text-sm text-typography-400">
          成长绿墙 · {weeks} 周
        </Text>
        <View className="h-24 justify-center">
          <Text className="text-xs text-typography-300">加载中...</Text>
        </View>
      </VStack>
    );
  }

  return (
    <VStack space="lg" className="items-center w-full">
      <Text className="text-sm text-typography-400">成长绿墙 · {weeks} 周</Text>
      <Heatmap values={values} weeks={weeks} />
    </VStack>
  );
}

export default GrowthWall;
