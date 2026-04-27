import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import commonStyles from '../../commonstyles/CommonStyles';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { getChargesList } from '../../redux/reducers/addressSlice';

const PrivacyPolicyScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { chargesList } = useSelector(state => state.address);
  const contactInfo = chargesList?.[0];

  useEffect(() => {
    if (!chargesList) {
      dispatch(getChargesList());
    }
  }, []);

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
          <Text style={styles.headerTitle}>Privacy Policy</Text>
        </View>
      </LinearGradient>
      <ScrollView style={{padding: 20,paddingBottom:100}}>
        <Text style={styles.effectiveDate}>Effective Date: 20/05/2025</Text>
        <Text style={styles.content}>
          Welcome to Fresh Grab! Your privacy is important to us. This Privacy Policy explains how Fresh Grab ("we," "our," or "us") collects, uses, shares, and protects your information when you use our mobile application and services.
        </Text>

        <Text style={styles.subtitle}>1. Information We Collect</Text>
        <Text style={styles.subsectionTitle}>a. Information You Provide</Text>
        <Text style={styles.content}>
          • Personal details like name, email, phone number, and address{"\n"}
          • Payment details (handled securely by third-party processors){"\n"}
          • Communications and support requests
        </Text>

        <Text style={styles.subsectionTitle}>b. Information Collected Automatically</Text>
        <Text style={styles.content}>
          • Location data for restaurant options and delivery{"\n"}
          • Device information (IP address, OS version, usage data){"\n"}
          • Cookies and similar technologies for analytics
        </Text>

        <Text style={styles.subtitle}>2. How We Use Your Information</Text>
        <Text style={styles.content}>
          • Provide and personalize services{"\n"}
          • Process orders and payments{"\n"}
          • Improve user experience and support{"\n"}
          • Prevent fraud and enhance security{"\n"}
          • Send promotions (with consent)
        </Text>

        <Text style={styles.subtitle}>3. Sharing Your Information</Text>
        <Text style={styles.content}>
          • Partner restaurants and delivery personnel{"\n"}
          • Payment processors for transactions{"\n"}
          • Service providers for analytics and security{"\n"}
          • Authorities when legally required{"\n\n"}
          <Text style={styles.bold}>We do not sell your personal information.</Text>
        </Text>

        <Text style={styles.subtitle}>4. Your Choices and Rights</Text>
        <Text style={styles.content}>
          • Update account information anytime{"\n"}
          • Opt-out of marketing communications{"\n"}
          • Request data access or deletion
        </Text>

        <Text style={styles.subtitle}>5. Data Security</Text>
        <Text style={styles.content}>
          We implement strict security measures, though no method is 100% secure. We recommend users take precautions to protect their information.
        </Text>

        <Text style={styles.subtitle}>6. Third-Party Links</Text>
        <Text style={styles.content}>
          Our app may contain third-party links. We are not responsible for their privacy practices.
        </Text>

        <Text style={styles.subtitle}>7. Policy Changes</Text>
        <Text style={styles.content}>
          We may update this policy periodically. Changes will be communicated through our app or website.
        </Text>

        <Text style={styles.subtitle}>8. Contact Us</Text>
        <Text style={[styles.content,{marginBottom:responsiveHeight(10)}]}>
          For questions about this policy:{"\n"}
          <TouchableOpacity onPress={() => contactInfo?.mail_id && Linking.openURL(`mailto:${contactInfo.mail_id}`)}>
            <Text style={[styles.link, styles.bold]}>Email: {contactInfo?.mail_id || 'foodtrailpro@gmail.com'}</Text>
          </TouchableOpacity>{"\n"}
          <TouchableOpacity onPress={() => contactInfo?.contact_number && Linking.openURL(`tel:${contactInfo.contact_number}`)}>
            <Text style={[styles.link, styles.bold]}>Phone: {contactInfo?.contact_number || '86881 04157'}</Text>
          </TouchableOpacity>{"\n"}
          <Text style={[styles.link, styles.bold]}>Address: Rajahmundry, 533101.</Text>
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom:20
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
  effectiveDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    fontStyle: 'italic'
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    color: commonStyles.btn2Color
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    color: '#333'
  },
  content: {
    fontSize: 14,
    marginTop: 5,
    lineHeight: 24,
    color: '#666'
  },
  bold: {
    fontWeight: '700',
    color: '#000'
  },
  link: {
    color: commonStyles.btn2Color,
    textDecorationLine: 'underline',
  }
});

export default PrivacyPolicyScreen;