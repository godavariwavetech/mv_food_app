import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CalloutInput = ({ 
  onSubmit,
  placeholder = "Enter Your Mobile Number",
  backgroundColor = '#22C55E',
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(phoneNumber);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.bubble, { backgroundColor }]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          maxLength={10}
        />
      </View>
      
      {/* Tail */}
      <View style={styles.tailContainer}>
        <View style={[styles.tail, { borderTopColor: backgroundColor }]} />
        
        {/* Button overlapping the tail */}
        <TouchableOpacity 
          style={[styles.button, { backgroundColor }]}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Icon name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  bubble: {
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 20,
    minWidth: 300,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
  },
  tailContainer: {
    alignItems: 'center',
    marginTop: -1,
  },
  tail: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 30,
    borderRightWidth: 30,
    borderTopWidth: 40,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  button: {
    position: 'absolute',
    top: 10, // Adjust to position button on the tail
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default CalloutInput;
