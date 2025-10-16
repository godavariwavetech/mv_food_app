import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

const SubCategoryCard = ({ title, imageSource, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.cardContainer} activeOpacity={0.8}>
      <View style={styles.backgroundBox}>
        <Text style={styles.cardText} numberOfLines={1}>{title}</Text>
      </View>
      <Image
        source={imageSource}
        style={styles.foodImage}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 70,    // Reduced from 80
    height: 70,   // Reduced from 75
    // Removed marginHorizontal to let the parent handle spacing
  },
  backgroundBox: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '90%',
    height: '65%', // Reduced to make space for text
    backgroundColor: '#e6f5f3',
    borderRadius: 8,  // Reduced from 10
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 7, // Reduced from 6
    borderBottomRightRadius:0
  },
  cardText: {
    fontSize: 10,     // Reduced from 11
    fontWeight: '600',
    color: '#333',
    marginHorizontal:1
  },
  foodImage: {
    position: 'absolute',
    top: 0,       // Adjusted from -12
    left: -10,
    width: 65,      // Reduced from 75
    height: 52,     // Reduced from 60
  },
});

export default SubCategoryCard;