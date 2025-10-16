import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import AppNavigation from './src/navigation/AppNavigation';
import SplashScreen from 'react-native-splash-screen';
import { getFCMToken } from './src/services/NotificationsService';
import { View, Text, StyleSheet, Animated, Linking } from 'react-native';
import { checkNotifications, requestNotifications, RESULTS } from 'react-native-permissions';
import VersionCheck from 'react-native-version-check'; 
import CustomModal from './src/components/CustomModal';
import NetInfo from '@react-native-community/netinfo';
import { setIsNetworkConnected } from './src/redux/reducers/addressSlice';
import { useDispatch } from 'react-redux';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';  // ✅ added
import OnboardingScreen from './src/screens/daddy/OnboardingScreen';
import OnboardingScreen2 from './src/screens/daddy/OnboardingScreen2';
import OnboardingScreen3 from './src/screens/daddy/OnboardingScreen3';

const NetworkStatusBanner = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [slideAnim] = useState(new Animated.Value(-50));
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      dispatch(setIsNetworkConnected(state.isConnected));
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isConnected ? -50 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isConnected, slideAnim]);

  if (isConnected) return null;

  return (
    <Animated.View style={[styles.banner, { transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.text}>No Internet Connection</Text>
    </Animated.View>
  );
};

const App = () => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    const checkAndRequestPermissions = async () => {
      try {
        const { status } = await checkNotifications();
        if (status !== RESULTS.GRANTED) {
          await requestNotifications(['alert', 'sound']);
        }
      } catch (err) {
        console.warn('Notification permission error:', err);
      }
    };
    checkAndRequestPermissions();
  }, []);

  const getToken = async () => { 
    await getFCMToken();
  }

  useEffect(() => {
    SplashScreen.hide();
    getToken();
  }, []);

  const checkForUpdate = async () => {
    try {
      const res = await VersionCheck.needUpdate();
      if (res?.isNeeded) {
        setShowUpdateModal(true);
      } else {
        setShowUpdateModal(false);
      }
    } catch (error) {
      console.log("Error checking for updates:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      console.log("Opening Play Store");
      const playStoreUrl = 'market://details?id=com.melocal';
      const fallbackUrl = 'https://play.google.com/store/apps/details?id=com.melocal';
      
      const supported = await Linking.canOpenURL(playStoreUrl);
      if (supported) {
        await Linking.openURL(playStoreUrl);
      } else {
        await Linking.openURL(fallbackUrl);
      }
    } catch (error) {
      console.log("Play Store link error:", error);
    } finally {
      setShowUpdateModal(false);
    }
  };

  useEffect(() => {
    checkForUpdate();
  }, []);

  useEffect(() => {
    SystemNavigationBar.setNavigationColor('#FFFFFF'); 
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          {/* <SafeAreaView style={{ flex: 1 }}>  */}
            <NetworkStatusBanner />
            {/* <OnboardingScreen3  /> */}
            <AppNavigation />
            <CustomModal
              visible={showUpdateModal}
              title="Update Available"
              message="A new version of the app is available. Please update to continue using all features."
              confirmText="Update Now"
              onConfirm={handleUpdate}
              cancelText=''
            />
          {/* </SafeAreaView> */}
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: 'red',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 1000,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10
  },
});



























// import React, { useEffect, useState } from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// import {Provider} from 'react-redux';
// import {store} from './src/redux/store';
// import AppNavigation from './src/navigation/AppNavigation';
// import SplashScreen from 'react-native-splash-screen'
// import { getFCMToken } from './src/services/NotificationsService';
// import { Linking, Platform, View, Text, StyleSheet, Animated } from 'react-native';
// import { checkNotifications, requestNotifications, RESULTS } from 'react-native-permissions';
// import VersionCheck from 'react-native-version-check'; 
// import CustomModal from './src/components/CustomModal';
// import NetInfo from '@react-native-community/netinfo';
// import { setIsNetworkConnected } from './src/redux/reducers/addressSlice';
// import { useDispatch } from 'react-redux';

// import SystemNavigationBar from 'react-native-system-navigation-bar';
// import { StatusBar } from 'react-native';
// import StatusBarListener from './src/navigation/StatusBarListener';

// const NetworkStatusBanner = () => {
//   const [isConnected, setIsConnected] = useState(true);
//   const [slideAnim] = useState(new Animated.Value(-50));
//   const dispatch = useDispatch();
//   useEffect(() => {
//     const unsubscribe = NetInfo.addEventListener(state => {
//       setIsConnected(state.isConnected);
//       dispatch(setIsNetworkConnected(state.isConnected));
//     });

//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     Animated.timing(slideAnim, {
//       toValue: isConnected ? -50 : 0, // Slide down when disconnected
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//   }, [isConnected, slideAnim]);

//   if (isConnected) return null;

//   return (
//     <Animated.View style={[styles.banner, { transform: [{ translateY: slideAnim }] }]}>
//       <Text style={styles.text}>No Internet Connection</Text>
//     </Animated.View>
//   );
// };



// const App = () => {
//   const [showUpdateModal, setShowUpdateModal] = useState(false);

//   useEffect(() => {
//     const checkAndRequestPermissions = async () => {
//       try {
//         const { status } = await checkNotifications();
//         if (status !== RESULTS.GRANTED) {
//           const { status: newStatus } = await requestNotifications(['alert', 'sound']);
//           console.log('Notification permission status:', newStatus);
//         } else {
//           console.log('Notification permission granted');
//         }
//       } catch (err) {
//         console.warn('Notification permission error:', err);
//       }
//     };
//     checkAndRequestPermissions();
//   }, []);

//   const getToken = async () => { 
//     const fmctoken = await getFCMToken()
//   }

//   useEffect(()=>{
//     SplashScreen.hide();
//     getToken()
//   },[])

//   const checkForUpdate = async () => {
//     try {
//       const res = await VersionCheck.needUpdate();
//       if (res?.isNeeded) {
//         setShowUpdateModal(true);
//       }else{
//         setShowUpdateModal(false);
//       }
//     } catch (error) {
//       console.log("Error checking for updates:", error);
//     }
//   };

//   const handleUpdate = async () => {
//     try {
//       console.log("Open playstore")
//     } catch (error) {
//       console.log("Play Store link error:", error);
//     } finally {
//       setShowUpdateModal(false);
//     }
//   };

//   useEffect(() => {
//     checkForUpdate();
//   }, []);

//   useEffect(() => {
//     SystemNavigationBar.setNavigationColor('#FFFFFF'); 
//   }, []);

//   return (
//     <Provider store={store}>
//       <NavigationContainer>
//         <View style={{ flex: 1 }}>
//           <NetworkStatusBanner />
//           <AppNavigation />
//           <CustomModal
//             visible={showUpdateModal}
//             title="Update Available"
//             message="A new version of the app is available. Please update to continue using all features."
//             confirmText="Update Now"
//             onConfirm={handleUpdate}
//             cancelText=''
//           />
//         </View>
//       </NavigationContainer>
//     </Provider>
//   );
// };

// export default App;


// const styles = StyleSheet.create({
//   banner: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 50,
//     backgroundColor: 'red',
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     zIndex: 1000,
//   },
//   text: {
//     color: 'white',
//     fontWeight: 'bold',
//     marginBottom:10
//   },
// });


