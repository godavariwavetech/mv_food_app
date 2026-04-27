import { SafeAreaView, StyleSheet, View, Image, StatusBar, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setInitial } from '../../redux/reducers/auth'

const { width } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const { token } = useSelector((state) => state.Auth);
  const { rehydrated } = useSelector(state => state.Auth._persist);
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setInitial())
    if (rehydrated) {
      // Increased the timeout slightly from 500 to 1500 
      // so the user actually has time to see the new logo
      setTimeout(() => {
        if (!token) {
          navigation.replace('Onboarding');
        }
      }, 1500);
    }
  }, [token, rehydrated]);

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