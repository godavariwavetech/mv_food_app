import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const MAX_FIT_FONT_SIZE = 30;

const MarqueeText = ({ text, textStyle, style, speed = 60, always = false, fitWidth = false }) => {
  const [naturalWidth, setNaturalWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [fitFontSize, setFitFontSize] = useState(null);
  const translateX = useRef(new Animated.Value(0)).current;
  const animationRef = useRef(null);
  const activeRef = useRef(false);

  const measured = naturalWidth > 0 && containerWidth > 0;
  const overflowing = measured && naturalWidth > containerWidth;
  const shouldScroll = measured && (always || overflowing);

  // Once we have the raw (un-fitted) measurement, compute a font size that makes
  // the text's natural width match the badge's width, then lock it in.
  useEffect(() => {
    if (!fitWidth || fitFontSize || !measured) return;
    const baseFontSize = (textStyle && textStyle.fontSize) || 14;
    const scale = containerWidth / naturalWidth;
    const target = Math.min(Math.max(baseFontSize * scale, baseFontSize), MAX_FIT_FONT_SIZE);
    setFitFontSize(target);
  }, [fitWidth, fitFontSize, measured, containerWidth, naturalWidth, textStyle]);

  useEffect(() => {
    activeRef.current = shouldScroll;

    if (!shouldScroll) {
      animationRef.current?.stop();
      translateX.setValue(0);
      return;
    }

    const distance = containerWidth + naturalWidth;
    const duration = (distance / speed) * 1000;

    const run = () => {
      if (!activeRef.current) return;
      translateX.setValue(containerWidth);
      animationRef.current = Animated.timing(translateX, {
        toValue: -naturalWidth,
        duration,
        useNativeDriver: true,
      });
      animationRef.current.start(({ finished }) => {
        if (finished && activeRef.current) run();
      });
    };
    run();

    return () => {
      activeRef.current = false;
      animationRef.current?.stop();
    };
  }, [shouldScroll, naturalWidth, containerWidth, speed, translateX]);

  const appliedTextStyle = fitFontSize ? [textStyle, { fontSize: fitFontSize }] : textStyle;

  return (
    <View
      style={[styles.container, style]}
      onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}>
      <Animated.Text
        numberOfLines={1}
        style={[appliedTextStyle, shouldScroll && { transform: [{ translateX }] }]}
        onLayout={e => setNaturalWidth(e.nativeEvent.layout.width)}>
        {text}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

export default MarqueeText;
