import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface ImageCarouselProps {
  images: string[];
  height?: number;
  autoplay?: boolean;
  autoplayInterval?: number;
  showDots?: boolean;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  height = 200,
  autoplay = false,
  autoplayInterval = 3000,
  showDots = true,
}) => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ---- autoplay ----

  useEffect(() => {
    if (!autoplay || images.length <= 1) return;

    const timer = setInterval(() => {
      const next = (currentIndex + 1) % images.length;

      flatListRef.current?.scrollToIndex({
        index: next,
        animated: true,
      });

      setCurrentIndex(next);
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [currentIndex, autoplay, images.length, autoplayInterval]);

  if (!images?.length) return null;

  return (
    <View style={{ height }}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{ width, height }}
            resizeMode="cover"
          />
        )}
        onMomentumScrollEnd={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      {/* ---- dots ---- */}

      {showDots && images.length > 1 && (
        <View style={styles.dots}>
          {images.map((_, i) => (
            <Pressable
              key={i}
              style={[styles.dot, i === currentIndex && styles.activeDot]}
              onPress={() => {
                flatListRef.current?.scrollToIndex({
                  index: i,
                  animated: true,
                });
                setCurrentIndex(i);
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default ImageCarousel;

const styles = StyleSheet.create({
  dots: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: "#fff",
  },
});
