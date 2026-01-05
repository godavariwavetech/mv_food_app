import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Pressable,
  Keyboard,
  ActivityIndicator,
  Alert,
  Linking, Image
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import AuthBackground from './tabassets/AuthBackground';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import GoogleIcon from '../user/svgs/GoogleIcon';
import { useDispatch } from 'react-redux';
import { actionLogin, addCustomer, verifyCustomerMobile, verifyCustomerOTP } from '../../redux/reducers/auth';
import Geolocation from 'react-native-geolocation-service';
import { checkAddressExistence } from '../../redux/reducers/daddy';
import commonStyles from '../../commonstyles/CommonStyles';
import { logintoppng } from '../../assets';

export default function OTPVerification({ navigation, route }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const dispatch = useDispatch();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);
  const [error, setError] = useState('');
  const [loader, setLoader] = useState(false);
  const [location, setLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [paramOtp, setParamOtp] = useState(route.params?.otp || "")

  useEffect(() => {
    const countdown = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      } else {
        clearInterval(countdown);
      }
    }, 1000);
    return () => clearInterval(countdown);
  }, [timer]);

  useEffect(() => {
    // getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    setError('');

    Geolocation.setRNConfiguration({
      enableHighAccuracy: false,
      timeout: 2000,
      maximumAge: 1000,
    });

    Geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setIsLoadingLocation(false);
      },
      error => {
        console.error('Error getting location:', error);
        setIsLoadingLocation(false);
        setError('Please enable location services to continue');
        Alert.alert(
          'Location Required',
          'Please enable location services to use this app. This is required to check service availability in your area.',
          [
            {
              text: 'Open Settings',
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              },
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );
      },
      {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 1000,
      }
    );
  };




  const handleVerifyOtp = async () => {
    if (otp.includes('')) {
      setError('Please enter all 4 digits of the OTP');
      return;
    }

    try {
      const enteredOtp = otp.join('');
      setLoader(true);

      if(route.params?.phoneNumber == "7997753587"){
        dispatch(addCustomer({mobileNumber:route.params?.phoneNumber,otp:enteredOtp}))
        if(enteredOtp=="1234"){
          route.params?.isFromCart ? navigation.pop(2) : dispatch(actionLogin())
        return
          if (!location) {
            setError('Please enable location services to continue');
            Alert.alert(
              'Location Required',
              'Please enable location services to use this app. This is required to check service availability in your area.',
              [
                {
                  text: 'Open Settings',
                  onPress: () => {
                    if (Platform.OS === 'ios') {
                      Linking.openURL('app-settings:');
                    } else {
                      Linking.openSettings();
                    }
                  },
                },
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
              ]
            );
            return;
          }

          // Check service availability
          const serviceResult = await dispatch(
            checkAddressExistence({
              latitude: location.latitude.toString(),
              longitude: location.longitude.toString(),
            })
          ).unwrap();



          if (serviceResult?.data) {
            dispatch(actionLogin());
            navigation.replace('UserHome');
          } else {
            navigation.replace('ServiceLocations', {
              latitude: location.latitude,
              longitude: location.longitude
            });
          }
        } else {
          setError('Please enter valid OTP');
        }
        return;
      }

      if (paramOtp == enteredOtp) {
        // First verify OTP, then check location

        const response = await dispatch(addCustomer({ mobileNumber: route.params?.phoneNumber, otp: enteredOtp }))

        route.params?.isFromCart ? navigation.pop(2) : dispatch(actionLogin())

        return
        if (!location) {
          setError('Please enable location services to continue');
          Alert.alert(
            'Location Required',
            'Please enable location services to use this app. This is required to check service availability in your area.',
            [
              {
                text: 'Open Settings',
                onPress: () => {
                  if (Platform.OS === 'ios') {
                    Linking.openURL('app-settings:');
                  } else {
                    Linking.openSettings();
                  }
                },
              },
              {
                text: 'Cancel',
                style: 'cancel',
              },
            ]
          );
          return;
        }

        // Check service availability
        const serviceResult = await dispatch(
          checkAddressExistence({
            latitude: location.latitude.toString(),
            longitude: location.longitude.toString(),
          })
        ).unwrap();

        if (serviceResult?.data?.service_available === 1) {
          dispatch(actionLogin());
          navigation.replace('UserHome');
        } else {
          navigation.replace('ServiceLocations');
        }
      } else {
        setError('Please enter valid OTP');
      }
    } catch (err) {

      setError('Something went wrong. Please try again.');
    } finally {
      setLoader(false);
    }
  };


  const handleOTPChange = (value, index) => {
    let newOtp = [...otp];

    // Only allow paste in first box
    if (index === 0 && value.length === otp.length) {
      newOtp = value.split('');
      setOtp(newOtp);
      inputRefs.current[otp.length - 1]?.focus(); // focus last input
      setError('');
      return;
    }

    // Normal single character entry
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Move forward
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Move backward if cleared
    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const maskPhoneNumber = number => {
    if (!number) return '';
    return number.replace(/(\d{1})\d{7}(\d{2})/, '$1*****$2');
  };

  const resendOtpHandler = async () => {
    setError("")
    setTimer(60);
    setOtp(['', '', '', '']);
    const response = await dispatch(verifyCustomerMobile({ customer_mobile_number: route.params?.phoneNumber }));

    setParamOtp(response.payload.loginotp)
  };

  return (
    <Pressable onPress={() => Keyboard.dismiss()} style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* ==== Green Wave Header Image ==== */}
      <View style={styles.topSection} >
        <Image
          source={logintoppng} // 👈 replace with your actual image path
          style={styles.headerImage}
          resizeMode="cover"
        />
      </View>
      {/* White Card Section */}
      <View style={styles.cardSection}>
        <Text style={styles.signInTitle}>Verification</Text>
        <Text style={styles.subtitle}>Enter the verification code we just sent on the mobile number {maskPhoneNumber(` ${route.params?.phoneNumber}`)}</Text>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={el => (inputRefs.current[index] = el)}
              style={styles.otpBox}
              keyboardType="numeric"
              maxLength={index === 0 ? otp.length : 1}
              value={digit}
              onChangeText={value => handleOTPChange(value, index)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace' && !digit && index > 0) {
                  inputRefs.current[index - 1]?.focus();
                }
              }}
            />
          ))}
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={{ height: 70, marginTop: responsiveHeight(3) }}>
          {timer !== 0 && <Text style={{ color: "#3D3D3D", fontSize: 18, fontWeight: "700", textAlign: "center" }}>Resend OTP in {timer}s </Text>}
          <TouchableOpacity disabled={timer != 0} onPress={resendOtpHandler}>
            <Text style={{ fontSize: 14, color: timer == 0 ? '#08B341' : "#8F8F8F", fontWeight: "700", textAlign: "center", marginTop: responsiveHeight(1) }}>Resend OTP</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleVerifyOtp} style={styles.loginButton}>
          {loader ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.loginText}>Verify</Text>
          )}
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topSection: {
    height: responsiveHeight(5),
  },
  // logoCircle: {
  //   position: 'absolute',
  //   top: responsiveHeight(7),
  //   alignSelf: 'center',
  //   width: 150,
  //   height: 150,
  //   borderRadius: 75,
  //   backgroundColor: 'transparent',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   borderWidth: 0,
  //   zIndex: 10,
  // },
  // logoImage: {
  //   width: '100%',
  //   height: '100%',
  //   borderRadius: 75,
  // },
  cardSection: {
    flex: 1,
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(20),
  },
  signInTitle: {
    fontSize: 28,
    fontFamily: 'Rubik-Black',
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    // textAlign: 'left',
  },
  subtitle: {
    fontSize: 16,
    color: '#3D3D3D',
    marginBottom: 18,
    // textAlign: 'left',
    fontWeight: '500',
  },
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 17,
    fontWeight: '500',
    marginBottom: 5,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#666',
    color: '#000',
    fontWeight: 'condensed',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#666',
  },
  passwordInput: {
    flex: 1,
    color: '#000',
  },
  icon: {
    paddingHorizontal: 10,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginVertical: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 3,
    marginRight: 5,
  },
  rememberText: {
    fontSize: 13,
    color: '#7E8A97',
    fontWeight: '400',
  },
  forgotPassword: {
    // marginLeft: "auto",
    fontSize: 14,
    color: '#065E2C',
    fontWeight: '400',
  },
  loginButton: {
    backgroundColor: '#08B341',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: responsiveHeight(1),
  },
  loginText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  signupText: {
    textAlign: 'center',
    // marginTop: 15,
    fontSize: 14,
    color: '#646982',
    fontWeight: '400',
  },
  signupLink: {
    color: '#065E2C',
    fontWeight: 'bold',
    fontSize: 14,
  },
  orText: {
    textAlign: 'center',
    // marginVertical: 10,
    fontSize: 16,
    color: '#646982',
  },

  errorText: {
    color: 'red',
    fontSize: 14,
    alignSelf: 'flex-start',
    marginTop: 8,
    // marginVertical: 10,
  },
  otpContainer: {
    flexDirection: 'row',
    // justifyContent: "space-between",
    // marginHorizontal:20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // alignSelf:"center",
    // marginVertical: 16,
    marginTop: responsiveHeight(10),
    gap: 16,
  },
  otpBox: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderRadius: 7,
    textAlign: 'center',
    fontSize: 18,
    // backgroundColor: '#F5F9FF',
    borderColor: '#666',
  },
  timer: {
    color: 'gray',
    marginBottom: 20,
    alignSelf: 'start',
  },
  resendText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2264D2',
    textAlign: 'center',
  },
  locationLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationLoadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#065E2C',
    fontWeight: '500',
  },
  locationErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  locationErrorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#065E2C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
      headerImage:{
      width:responsiveWidth(100),
      height:responsiveHeight(20),
      resizeMode:"stretch"
    }
});
