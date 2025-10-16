import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

// Main component for the onboarding screen
const OnboardingScreen2 = ({ onNext }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f4f4f4" />

      {/* Background decorative circles */}
      <Image
        source={require("./tabassets/onBoardBack.png")}
        style={styles.backgroundCircles}
      />

      {/* Main character illustration */}
      <Image
        source={require('./tabassets/onBoard2B.png')}
        style={styles.characterImage}
      />

      {/* Bottom container with the green card background */}
      <ImageBackground
        source={require('./tabassets/onBoard2C.png')}
        style={styles.textImageBackground}
        resizeMode="contain">
        {/* <View style={styles.cardContent}>
          <View style={styles.pagination}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
          </View>

          <Text style={styles.title}>Taste, Delivered Fast</Text>

          <Text style={styles.description}>
            Get hot and fresh food delivered straight to your door.
          </Text>
        </View> */}
              <TouchableOpacity
        style={styles.nextButton}
        onPress={onNext}>
        <AntDesign name="arrowright" size={28} color="#00C152" />
      </TouchableOpacity>
      </ImageBackground>

      {/* Floating Action Button for 'Next' */}

    </SafeAreaView>
  );
};

export default OnboardingScreen2;

// Stylesheet for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  backgroundCircles: {
    position: 'absolute',
    top: responsiveHeight(5),
    left: 0,
    width: responsiveWidth(100),
    height: responsiveHeight(50),
    opacity: 0.5,
  },
  characterImage: {
    width: responsiveWidth(80),
    height: responsiveHeight(45),
    marginTop: responsiveHeight(10),
    resizeMode: 'contain',
    transform:[{translateY:30}]
  },
  bottomCardContainer: {
    position: 'absolute',
    bottom: 0,
    width: responsiveWidth(100),
    height: responsiveHeight(45), // Adjust height to fit your asset
    alignItems: 'center',
  },
    textImageBackground: {
    width: '100%',
    height: 300,
    alignItems: 'center',
    justifyContent: 'flex-end', // <-- This pushes children to the bottom
    paddingBottom: 50, // <-- Add space from bottom if needed
    marginTop: responsiveHeight(1),
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    paddingTop: responsiveHeight(8), // Pushes content down from the top of the card
    width: '80%',
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: responsiveHeight(2),
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Inactive dot color
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#FFFFFF', // Active dot color
  },
  title: {
    fontSize: responsiveFontSize(3.5),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: responsiveHeight(1.5),
  },
  description: {
    fontSize: responsiveFontSize(2),
    color: '#FFFFFF',
    textAlign: 'center',
    maxWidth: '90%',
  },
  nextButton: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 50,
    marginTop: responsiveHeight(0.3),
  },
});