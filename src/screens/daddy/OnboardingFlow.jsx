import React, { useState, useRef } from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Import your three onboarding screens
import OnboardingScreen from './OnboardingScreen';
import OnboardingScreen2 from './OnboardingScreen2';
import OnboardingScreen3 from './OnboardingScreen3';

// Get the width of the device screen
const { width } = Dimensions.get('window');

const OnboardingFlow = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Data for each onboarding slide
  const slides = [
    { key: 'one', component: OnboardingScreen },
    { key: 'two', component: OnboardingScreen2 },
    { key: 'three', component: OnboardingScreen3 },
  ];

  // Function to handle programmatic scrolling for the 'Next' button
  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < slides.length) {
      // If not the last slide, scroll to the next one
      const offset = nextIndex * width;
      scrollViewRef.current?.scrollTo({ x: offset, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      // If it's the last slide, navigate to the main app
      navigation.replace('Register');
    }
  };

  // Updates the current index based on the user's swipe
  const handleMomentumScrollEnd = (event) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip button for convenience */}
      <TouchableOpacity style={styles.skipButton} onPress={() => navigation.replace('Register')}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        style={styles.scrollView}
        bounces={false}
      >
        {/* Render each slide by mapping over the slides array */}
        {slides.map((slide) => (
          <View key={slide.key} style={styles.slide}>
            <slide.component onNext={handleNext} />
          </View>
        ))}
      </ScrollView>

      {/* Pagination dots */}
      {/* <View style={styles.paginationContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: width, // Each slide takes the full screen width
    flex: 1,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#FC6011',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#E6F7EC',
    borderRadius: 20,
  },
  skipText: {
    color: '#FC6011',
    fontWeight: 'bold',
  },
});

export default OnboardingFlow;