import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import Svg, { G, Path, Defs, Filter, FeOffset, FeGaussianBlur, FeBlend } from "react-native-svg";

function Trapezium({children}) {
  return (
    <View style={styles.container}>
    {/* SVG Trapezium with Shadow */}
    <Svg width={237} height={179} viewBox="0 0 237 179" fill="none">
      <Defs>
        {/* Shadow Filter */}
        <Filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <FeOffset dx="4" dy="4" />
          <FeGaussianBlur stdDeviation="5" result="blur" />
          <FeBlend in="SourceGraphic" in2="blur" mode="normal" />
        </Filter>
      </Defs>
      <G filter="url(#shadow)">
        <Path
          d="M19.815 39.948c.653-13.316 11.639-23.776 24.97-23.776h123.43c13.331 0 24.317 10.46 24.97 23.776l3.53 72c.699 14.27-10.683 26.224-24.971 26.224H41.256c-14.288 0-25.67-11.954-24.97-26.224l3.529-72z"
          fill="#fff"
          stroke="rgba(211, 211, 211, 0.6)"
          strokeWidth="1"
        />
    <View style={styles.overlay}>{children}</View>
      </G>
    </Svg>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width:237
  },
  overlay: {
    // position: "absolute",
    top: "-25%"
    // left: "50%",
    // transform: [{ translateX: -50 }, { translateY: -50 }],
    // alignItems: "center",
  },
});

export default Trapezium;
