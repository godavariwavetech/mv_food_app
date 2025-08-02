import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from'react-redux';
import { getChargesList } from '../../redux/reducers/addressSlice';
import commonStyles from '../../commonstyles/CommonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

const SupportScreen = ({ navigation }) => {
  const dispatch = useDispatch(); 
  const [contactInfo, setContactInfo] = useState();

  const getContact = async () => {
    try {
      const res = await dispatch(getChargesList());
      if(res.payload.data[0]){
        setContactInfo(res.payload.data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    getContact()
  },[])
    
  const handleCall = () => {
    Linking.openURL(`tel:${contactInfo?.contact_number}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${contactInfo?.mail_id}`);
  };

  const handleWhatsApp = () => {
    Linking.openURL(`https://wa.me/${contactInfo?.contact_number}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={commonStyles.btn2Color} barStyle={'light-content'} translucent />
      <LinearGradient colors={['#E7432D', '#E7432D']} style={styles.gradientContainer}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesome6 name="arrow-left-long" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Support</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.contactOptions}>
            <TouchableOpacity style={styles.contactOption} onPress={handleCall}>
              <MaterialIcons name="phone" size={32} color={commonStyles.btn2Color} />
              <Text style={styles.contactText}>Call Support Team</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactOption} onPress={handleEmail}>
              <MaterialIcons name="email" size={32} color={commonStyles.btn2Color} />
              <Text style={styles.contactText}>Send Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactOption} onPress={handleWhatsApp}>
              <FontAwesome6 name="whatsapp" size={32} color={commonStyles.btn2Color} />
              <Text style={styles.contactText}>Chat on WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
   
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gradientContainer: {
    // paddingTop: 10,
    paddingVertical: responsiveHeight(2),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
    // paddingBottom: responsiveHeight(3),
    paddingTop:responsiveHeight(1)
  },
  backButton: {
    marginRight: responsiveWidth(5),
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: responsiveWidth(5),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: responsiveHeight(2),
  },
  contactSection: {
    marginBottom: responsiveHeight(4),
  },
  contactOptions: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: responsiveHeight(3),
    paddingHorizontal: responsiveHeight(2),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    gap: responsiveHeight(3),
  },
  contactOption: {
    alignItems: 'center',
    width: '100%',
    padding: responsiveHeight(1.5),
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    gap: 15,
  },
  contactText: {
    marginTop: 0,
    fontSize: 16,
    color: '#000',
    fontWeight: '700',
  },
});

export default SupportScreen;