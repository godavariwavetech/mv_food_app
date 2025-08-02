import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { responsiveHeight } from '../../utils/responsiveDimensions';

const SupportScreen = () => {
  const [faqs, setFaqs] = useState([
    { question: 'What is the return policy?', answer: 'You can return your product within 30 days for a full refund.' },
    { question: 'How long is the warranty?', answer: 'The warranty period is 1 year from the date of purchase.' },
    { question: 'Can I cancel my order?', answer: 'Yes, you can cancel your order before it ships.' },
  ]);

  const handleCall = () => {
    // Implementation of handleCall
  };

  const handleEmail = () => {
    // Implementation of handleEmail
  };

  const handleWhatsApp = () => {
    // Implementation of handleWhatsApp
  };

  return (
    <View style={styles.container}>
      {/* ... existing header code ... */}

      <ScrollView style={styles.content}>
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.contactOptions}>
            <TouchableOpacity style={styles.contactOption} onPress={handleCall}>
              <MaterialIcons name="phone" size={32} color="#065E2C" />
              <Text style={styles.contactText}>Call Support Team</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.contactOption} onPress={handleEmail}>
              <MaterialIcons name="email" size={32} color="#065E2C" />
              <Text style={styles.contactText}>Send Email</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.contactOption} onPress={handleWhatsApp}>
              <MaterialIcons name="chat" size={32} color="#065E2C" />
              <Text style={styles.contactText}>Chat on WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Remove entire FAQ section */}
      </ScrollView>
    </View>
  );
};

// Update styles
const styles = StyleSheet.create({
  contactOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: responsiveHeight(3),
    paddingHorizontal: responsiveHeight(2),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    gap: responsiveHeight(2),
  },
  contactOption: {
    alignItems: 'center',
    flex: 1,
    padding: responsiveHeight(1.5),
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
  },
  contactText: {
    marginTop: responsiveHeight(1),
    fontSize: 16,
    color: '#065E2C',
    fontWeight: '700',
    textAlign: 'center',
  },
  // Remove FAQ related styles
});

export default SupportScreen; 