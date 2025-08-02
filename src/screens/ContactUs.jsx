import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import commonStyles from '../commonstyles/CommonStyles';
import CallIcon from './user/svgs/CallIcon';
import MailIcon from './user/svgs/MailIcon';

const ContactUs = () => {
  const navigation = useNavigation();

  const openWhatsapp = async () => {
    try {
      const phoneNumber = "911234567890";
      const url = `whatsapp://send?phone=${phoneNumber}&text=Hello, I need assistance!`;
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("","WhatsApp is not installed or URL is invalid.")
      }
    } catch (err) {
      console.error("Error opening WhatsApp: ", err);
    }
  };

  const openEmail = async () => {
    try {
      const email = "escypesupport@gmail.com"; 
      const subject = "Contact Us";
      const body = "Hello, I need assistance!";
      const url = `mailto:${email}?subject=${subject}&body=${body}`;
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("","Email client is not available or URL is invalid.")
      }
    } catch (err) {
      console.error("Error opening email: ", err);
    }
  };

  const openPhone = async () => {
    try {
      const phone = "1234567890";
      const url = `tel:${phone}`;
      // const supported = await Linking.canOpenURL(url);
      // if (supported) {
        await Linking.openURL(url);
      // } else {
        Alert.alert("","Phone number link is invalid or not supported.")
      // }
    } catch (err) {
      console.error("Error opening phone: ", err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Customer Service</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Headings */}
      <View style={styles.section}>
      <Text style={styles.heading1}>Need Help? Get in Touch:</Text>
      <Text style={styles.heading2}>Good for a support-related contact option.</Text>

      {/* Contact Buttons */}
      <TouchableOpacity style={styles.button} onPress={openWhatsapp}>
        <Icon name="whatsapp" size={26} color="green" />
        <Text style={styles.buttonText}>WhatsApp</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={openEmail}>
        <MailIcon />
        {/* <Icon name="envelope" size={30} color="#bfbfbf" /> */}
        <Text style={styles.buttonText}>Email</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={openPhone}>
        {/* <Icon name="phone" size={30} color="black" /> */}
        <CallIcon />
        <Text style={styles.buttonText}>Phone</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', 
    alignItems: 'center',
    paddingTop: 30, 
    backgroundColor: commonStyles.bgColor,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal:responsiveWidth(5)
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    flexGrow: 1,
  },
  heading1: {
    fontSize: 20, 
    fontWeight: '700',
    color: commonStyles.mainColor,
    textAlign: 'center',
    marginBottom: 5,
  },
  heading2: {
    fontSize: 16,
    color: commonStyles.lightColor, 
    textAlign: 'center',
    marginBottom: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    marginVertical: 16,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    width: '80%',
  },
  buttonText: {
    marginLeft: 15,
    fontSize: 18,
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    width:"90%",
    borderRadius: 8,
    marginTop: 32,
    borderWidth: 1,
    borderColor: commonStyles.strokeLines,
    paddingHorizontal:12,
    paddingVertical:16
  },
});
