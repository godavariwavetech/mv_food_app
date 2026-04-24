import { SafeAreaView, StyleSheet, View, Image, StatusBar } from 'react-native'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setInitial } from '../../redux/reducers/auth'

const SplashScreen = ({ navigation }) => {
  const { token } = useSelector((state) => state.Auth);
  const { rehydrated } = useSelector(state => state.Auth._persist);
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setInitial())
    if (rehydrated) {
      setTimeout(() => {
        if (!token) {
          navigation.replace('Onboarding');
        }
      }, 500);
    }
  }, [token, rehydrated]);


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imgContainer}>
        <Image source={require('../daddy/tabassets/varadhiSplash.png')} style={{height: 500, width: 300,resizeMode:"contain"}} />
      </View>
    </SafeAreaView>

  )
}

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FC6011',
    position: 'relative'
  },
  imgContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imgWrapper: {
    position: 'relative'
  },
  logo: {
    position: "absolute",
    top: '50%',
    left: '50%',
    // transform:translate('-50%','-50%')
    transform: [
      { translateX: -50 }, // Replace 50 with half the image width
      { translateY: -50 }  // Replace 50 with half the image height
    ],
    width: 200,
    height: 200,
    //marginLeft: -50, // negative half of width
    //marginTop: -50, // negative half of height
  },
  logoWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
  }

})