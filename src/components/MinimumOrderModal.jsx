import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const MinimumOrderModal = ({
  visible,
  onClose,
  minimumAmount,
  currentAmount,
  restaurantName,
}) => {
  const amountNeeded = minimumAmount - currentAmount;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons 
              name="cart-remove" 
              size={60} 
              color="#FF6B35" 
            />
          </View>
          
          {/* Title */}
          <Text style={styles.title}>
            Minimum Order Not Met
          </Text>
          
          {/* Message */}
          <Text style={styles.message}>
            The minimum order amount for{' '}
            {restaurantName ? (
              <Text style={styles.restaurantName}>{restaurantName}</Text>
            ) : (
              'this restaurant'
            )}{' '}
            is{' '}
            <Text style={styles.minimumAmount}>
              ₹{minimumAmount.toFixed(0)}
            </Text>
          </Text>
          
          {/* Current vs Required */}
          <View style={styles.comparisonContainer}>
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonLabel}>Current Order</Text>
              <Text style={styles.currentValue}>
                ₹{currentAmount.toFixed(2)}
              </Text>
            </View>
            
            <MaterialIcons name="arrow-forward" size={24} color="#ccc" />
            
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonLabel}>Required</Text>
              <Text style={styles.requiredValue}>
                ₹{minimumAmount.toFixed(0)}
              </Text>
            </View>
          </View>
          
          {/* Add More Amount Banner */}
          <View style={styles.addMoreBanner}>
            <MaterialCommunityIcons 
              name="plus-circle" 
              size={20} 
              color="#0EAF50" 
            />
            <Text style={styles.addMoreText}>
              Add items worth{' '}
              <Text style={styles.addMoreAmount}>
                ₹{amountNeeded.toFixed(2)}
              </Text>
              {' '}more to place your order
            </Text>
          </View>
          
          {/* Single Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Got It</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  restaurantName: {
    fontWeight: '600',
    color: '#333',
  },
  minimumAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B35',
  },
  comparisonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    gap: 15,
  },
  comparisonItem: {
    flex: 1,
    alignItems: 'center',
  },
  comparisonLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
    marginBottom: 5,
  },
  currentValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B35',
  },
  requiredValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0EAF50',
  },
  addMoreBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FFF4',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C6F6D5',
    width: '100%',
    gap: 8,
    marginBottom: 24,
  },
  addMoreText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  addMoreAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0EAF50',
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0EAF50',
    elevation: 2,
    shadowColor: '#0EAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default MinimumOrderModal;
