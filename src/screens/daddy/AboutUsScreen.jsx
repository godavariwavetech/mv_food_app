import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import commonStyles from '../../commonstyles/CommonStyles';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AboutUsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#EE6F00', '#C24501']}
        style={[styles.headerGradient, { paddingTop: insets.top + 10 }]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesome6 name="arrow-left-long" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>About Us</Text>
        </View>
      </LinearGradient>
      <ScrollView style={{padding: 20}}>
        <Text style={styles.content}>
          Welcome to Fresh Grab, your ultimate food delivery companion! We are committed to bringing the best meals from your favorite local restaurants straight to your doorstep.
        </Text>

        <Text style={styles.sectionTitle}>Why Choose Fresh Grab?</Text>
        
        <View style={styles.featureItem}>
          <MaterialCommunityIcons name="check-circle" size={20} color={commonStyles.btn2Color} />
          <Text style={styles.featureText}>Wide Variety of Categories – Explore diverse cuisines from street food to fine dining</Text>
        </View>

        <View style={styles.featureItem}>
          <MaterialCommunityIcons name="check-circle" size={20} color={commonStyles.btn2Color} />
          <Text style={styles.featureText}>Restaurant Ratings & Reviews – Make informed decisions with honest feedback</Text>
        </View>

        <View style={styles.featureItem}>
          <MaterialCommunityIcons name="check-circle" size={20} color={commonStyles.btn2Color} />
          <Text style={styles.featureText}>Seamless Cart & Checkout – Intuitive ordering experience</Text>
        </View>

        <View style={styles.featureItem}>
          <MaterialCommunityIcons name="check-circle" size={20} color={commonStyles.btn2Color} />
          <Text style={styles.featureText}>Fast & Reliable Delivery – Food arrives hot and fresh</Text>
        </View>

        <View style={styles.featureItem}>
          <MaterialCommunityIcons name="check-circle" size={20} color={commonStyles.btn2Color} />
          <Text style={styles.featureText}>Secure Payments – Multiple safe payment options</Text>
        </View>

        <View style={styles.featureItem}>
          <MaterialCommunityIcons name="check-circle" size={20} color={commonStyles.btn2Color} />
          <Text style={styles.featureText}>Real-Time Order Tracking – Follow your order from restaurant to doorstep</Text>
        </View>

        <Text style={[styles.content, {marginTop: 20}]}>
          At Fresh Grab, we believe food is more than just a meal – it's an experience. Join us in revolutionizing food delivery, where great food is always within reach!
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerGradient: {
    width: '100%',
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontFamily: 'SF Pro',
    fontWeight: '700',
    fontSize: 18,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 15,
    color: commonStyles.btn2Color
  },
  content: {
    fontSize: 14,
    lineHeight: 24,
    color: '#666',
    marginBottom: 15
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: '#444',
    lineHeight: 20
  }
});

export default AboutUsScreen; 