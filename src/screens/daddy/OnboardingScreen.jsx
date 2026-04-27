import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ImageBackground } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import commonStyles from '../../commonstyles/CommonStyles';
import OnboardingLogo from './svg/OnboardingLogo';
import { useNavigation } from '@react-navigation/native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import OnboardingLogo1 from './tabassets/OnboardingLogo1';
import { SystemBars } from 'react-native-edge-to-edge';

const OnboardingScreen = ({onNext}) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>

      <Image
        source={require('./tabassets/onBoardBack.png')}
        style={styles.backgroundCircles}
      />

      <View style={styles.imgContainer}>
        <Image
          source={require('./tabassets/onBoard1.png')}
          style={styles.characterImage}
        />
      </View>

      <ImageBackground
        source={require('./tabassets/onBoard1B.png')}
        style={styles.textImageBackground}
        imageStyle={{resizeMode: 'contain'}}>
        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <AntDesign name="arrowright" size={25} color="#fff" />
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonStyles.bgColor,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: responsiveHeight(2.5),
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F7EC',
    // paddingHorizontal: 12,
    paddingLeft: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FC6011", gap: 6
  },
  skipText: {
    color: '#FC6011',
    fontWeight: '400',
    // marginRight: 5,
    fontSize: 14
  },
  image: {
    width: '100%',
    height: 300,
    // marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imgContainer: {
    marginTop: responsiveHeight(4),
    justifyContent: 'center',
    alignItems: 'center'
  },
  textContainer: {
    alignItems: 'center',
    marginTop: responsiveHeight(1),
    // paddingHorizontal: 20,
    width: '82%',
    borderWidth: 0.3,
    borderColor: commonStyles.btn2Color,
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(2),
    // borderRadius:40
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    backgroundColor: commonStyles.bgColor
  },
  textImageBackground: {
    width: '100%',
    height: 300,
    alignItems: 'center',
    justifyContent: 'flex-end', // <-- This pushes children to the bottom
    paddingBottom: 50, // <-- Add space from bottom if needed
    marginTop: responsiveHeight(1),
  },
  title: {
    fontSize: 25,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
    // color:'#101811'
    color: "#fff"
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#fff',
    marginBottom: 20,
    fontWeight: '400'
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6B1F15',
    marginHorizontal: 5,
  },
  dotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginHorizontal: 5,
  },
  nextButton: {
    backgroundColor: "#139400",
    padding: 18,
    borderRadius: 50,
    marginTop: responsiveHeight(0.3),
    // width:58,height:58,
    // alignItems:'center',justifyContent:'center',
  },
    characterImage: {
    width: responsiveWidth(80),
    height: responsiveHeight(45),
    marginTop: responsiveHeight(10),
    resizeMode: 'contain',
    transform:[{translateY:30}]
  },
    backgroundCircles: {
    position: 'absolute',
    top: responsiveHeight(5),
    left: 0,
    width: responsiveWidth(100),
    height: responsiveHeight(50),
    opacity: 0.5,
  },
});
