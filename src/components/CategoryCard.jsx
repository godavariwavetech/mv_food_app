import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CategoryCard = ({ 
  title, 
  imageSource, 
  isSelected = false, 
  onPress 
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.container}
    >
      <View style={[
        styles.card,
        { 
          backgroundColor: isSelected ? '#B2E7C4' : '#F9FAFB',
          borderColor: isSelected ? '#079D39' : '#B2E7C4',
        }
      ]}>
        {/* Image Section */}
        <View style={styles.imageSection}>
          <Image 
            source={imageSource} 
            style={styles.image} 
            resizeMode="contain" 
          />
        </View>
        
        {/* Label Section */}
        <View style={[
          styles.labelSection,
          { backgroundColor: isSelected ? '#079D39' : '#B2E7C4' }
        ]}>
          <Text style={[styles.labelText,{color:isSelected ? '#fff' : '#000'}]}>{title}</Text>
          
          {isSelected && (
            <View style={styles.checkmark}>
              <Icon name="check" size={14} color="#FFFFFF" />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 6,
    
  },
  card: {
    width: 92,
    height: 101,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 0,
    borderWidth: 2,
    
    overflow: 'hidden',
  },
  imageSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  image: {
    width: 60,
    height: 60,
  },
  labelSection: {
    height: 27,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 6,
    borderTopLeftRadius:12,
    borderTopRightRadius:12
  },
  labelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  checkmark: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CategoryCard;
