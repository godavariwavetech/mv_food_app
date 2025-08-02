import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import Icon from "react-native-vector-icons/FontAwesome";

const CustomCard = () => {
  return (
    <View style={styles.shadow}>
      <Svg height="100" width="150" viewBox="0 0 150 100">
        <Path
          d="M20,100 H130 A10,10 0 0 0 140,90 V20 A10,10 0 0 0 130,10 H20 A10,10 0 0 0 10,20 V90 A10,10 0 0 0 20,100 Z"
          fill="blue"
          stroke="black"
          strokeWidth="2"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  card: {
    width: 240,
    backgroundColor: "transparent",
    alignItems: "center",
    borderRadius: 20,
    overflow: "hidden",

    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,

    // Shadow for Android
    elevation: 6,
  },
  image: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  contentContainer: {
    position: "relative",
    width: "100%",
    alignItems: "center",
  },
  trapezoid: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  content: {
    position: "absolute",
    bottom: 10,
    width: "85%",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 12,
    color: "gray",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  rating: {
    fontSize: 14,
    color: "green",
    marginLeft: 5,
  },
  time: {
    fontSize: 14,
    color: "gray",
    marginLeft: 5,
  },
  icon: {
    marginLeft: 10,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // For Android shadow
  },
});

export default CustomCard;
