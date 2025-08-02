import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

const { width } = Dimensions.get('window');

const ServiceUnavailableScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Service Unavailable</Text>
      </View>

      <View style={styles.content}>
        <MaterialIcons name="location-off" size={responsiveFontSize(25)} color="#666" />
        <Text style={styles.titleText}>Service Not Available</Text>
        <Text style={styles.messageText}>
          We're currently not serving in your area. Please choose from our available service locations.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button,{alignItems:"center",justifyContent:"center"}]}
            onPress={() => navigation.navigate('ServicesAvailable')}
          >
            <Text style={styles.buttonText}>Browse Available Areas</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={() => navigation.navigate('SelectServiceFromLocation')}
          >
            <MaterialIcons name="map" size={20} color="#065E2C" />
            <Text style={styles.buttonSecondaryText}>Choose from Map</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: { 
    backgroundColor: '#065E2C',
    height: responsiveHeight(15),
    flexDirection: "row",
    alignItems: "flex-end",
    paddingBottom: responsiveHeight(3),
    paddingLeft: responsiveWidth(5)
  },
  backButton: {
    width: responsiveWidth(7)
  },
  title: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#fff',
    textAlign: "left" 
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: responsiveWidth(5),
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  messageText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 15,
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#065E2C',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    gap: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#065E2C',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    gap: 10,
    justifyContent: 'center',
  },
  buttonSecondaryText: {
    color: '#065E2C',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ServiceUnavailableScreen; 