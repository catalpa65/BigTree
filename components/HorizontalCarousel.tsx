import React from "react";
import { FlatList, View } from "react-native";

export function HorizontalCarousel<T>({
  data,
  keyExtractor,
  renderItem,
  listPadding = 24,
  separatorWidth = 24,
  snapItemWidth,
}: {
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  renderItem: ({
    item,
    index,
  }: {
    item: T;
    index: number;
  }) => React.ReactElement;
  listPadding?: number;
  separatorWidth?: number;
  snapItemWidth: number;
}) {
  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={snapItemWidth + separatorWidth}
      snapToAlignment="start"
      contentContainerStyle={{ paddingHorizontal: listPadding }}
      ItemSeparatorComponent={() => <View style={{ width: separatorWidth }} />}
      renderItem={({ item, index }) => renderItem({ item, index })}
    />
  );
}

export default HorizontalCarousel;
