import {View, Text} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SampleScreen from '../screens/SampleScreen';
import VideoKyc from '../screens/VideoKyc';
import {
  CustomBackButton,
  CustomTitle,
} from '../components/common/CustomTabBackButton';
import UserHome from '../screens/UserHome';

import TabNavigator from './TabNaviagator';
import TourProfileScreen from '../screens/user/TourProfileScreen';
import ContactUs from '../screens/ContactUs';
import BookingsPendingScreen from '../screens/freelancer/BookingsPendingScreen';
import AddItineraries from '../screens/freelancer/AddItineraries';
import BookingsUpComing from '../screens/freelancer/BookingsUpComing';
import HomeScreen from '../screens/freelancer/HomeScreen';
import Profile from '../screens/freelancer/Profile';
import EditProfile from '../screens/freelancer/EditProfile';
import FreelancerTabNavigator from './FreelancerTabNavigator';
import TermsAndConditions from '../screens/TermsAndConditions';
import PrivacyPolicy from '../screens/PrivacyPolicy';
import AccountSettings from '../screens/AccountSettings';
import TourGuides from '../screens/user/TourGuides';
import RentalEquipment from '../screens/user/RentalEquipment';
import MyCalendar from '../screens/user/MyCalendar';
import TourDetailsScreen from '../screens/freelancer/BookingsUpComing';

const Stack = createStackNavigator();

export default function UserNavigation() {
  return (
    <Stack.Navigator  screenOptions={{headerShown: false}} initialRouteName='TabNavigator'>
          <Stack.Screen name='TabNavigator' component={TabNavigator} />
          <Stack.Screen  name='TourProfileScreen' component={TourProfileScreen} />
           <Stack.Screen  name='VideoKyc' component={VideoKyc} key={Date.now().toString()} />
           <Stack.Screen  name='ContactUs' component={ContactUs} />
           <Stack.Screen name='TermsAndConditions' component={TermsAndConditions}  />
           <Stack.Screen name='PrivacyPolicy' component={PrivacyPolicy} />      
           <Stack.Screen  name='TourGuides' component={TourGuides} />
           <Stack.Screen  name='RentalEquipment' component={RentalEquipment} />
           <Stack.Screen name='BookingsPendingScreen' component={BookingsPendingScreen} />
           <Stack.Screen name='FreelancerTabNavigator' component={FreelancerTabNavigator} />
           <Stack.Screen name='AccountSettings' component={AccountSettings} />  
           <Stack.Screen name='MyCalendar' component={MyCalendar} />
           <Stack.Screen name="AddItineraries" component={AddItineraries} />
          <Stack.Screen name="BookingsUpComing" component={BookingsUpComing} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="FreelancerProfile" component={Profile} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="TourDetailsScreen" component={TourDetailsScreen}  />

       </Stack.Navigator>
  )
}
