import { SafeAreaView, StyleSheet, View, Image, StatusBar, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setInitial } from '../../redux/reducers/auth'

const { width } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const { token } = useSelector((state) => state.Auth);
  const rehydrated = useSelector(state => state._persist?.rehydrated);
  const dispatch = useDispatch()

  useEffect(() => {
    if (rehydrated) {
      const timer = setTimeout(() => {
        if (!token) {
          navigation.replace('Onboarding');
        } else {
          // If token exists, AppNavigation will handle switching to MainNavigation
          // but if we are still here, we might want to manually trigger or just wait.
          // AppNavigation is better for this.
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [token, rehydrated, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent />
      <View style={styles.imgContainer}>
        <Image 
          // Points to your newly added logo in the assets folder
          source={require('../../assets/logo.png')} 
          style={styles.logo} 
        />
      </View>
    </SafeAreaView>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Changed to white to match the logo perfectly
    position: 'relative'
  },
  imgContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: width * 1,  // Takes up 70% of the screen width
    height: width * 1, // Keeps the logo perfectly square
    resizeMode: 'contain'
  }
})