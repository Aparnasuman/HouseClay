import React, { memo, useRef, useState } from "react";
import { Animated, Image, ImageProps, StyleSheet, View } from "react-native";

interface ImageWithLoaderProps extends Omit<ImageProps, "source"> {
  src: string;
  placeholderSrc: string;
  width?: number;
  height?: number;
  borderRadius?: number;
}

const ImageWithLoader = memo(function ImageWithLoader({
  src,
  placeholderSrc,
  width,
  height,
  borderRadius = 0,
  style,
  ...rest
}: ImageWithLoaderProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

  const onLoadEnd = () => {
    setLoading(false);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={[styles.wrapper, { width, height, borderRadius }, style]}>
      {(loading || hasError) && (
        <Image
          source={{ uri: placeholderSrc }}
          style={[StyleSheet.absoluteFillObject, { borderRadius }]}
          resizeMode="cover"
        />
      )}

      {!hasError && (
        <Animated.Image
          source={{ uri: src }}
          style={[StyleSheet.absoluteFillObject, { opacity, borderRadius }]}
          resizeMode="cover"
          onLoadEnd={onLoadEnd}
          onError={() => {
            setHasError(true);
            setLoading(false);
          }}
          {...rest}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    overflow: "hidden",
    backgroundColor: "#e5e7eb",
  },
});

export default ImageWithLoader;
