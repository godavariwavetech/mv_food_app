import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  TextInput,
  Platform,
  RefreshControl,
  Animated
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, RadialGradient, Stop, Rect } from 'react-native-svg';

// --- API & Redux Imports ---
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import NetInfo from '@react-native-community/netinfo';
import Permissions, { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// --- Redux Actions ---
import {
  getBanners,
  getCategories,
  getSubCategories,
  setActiveCategoryIndex,
  setsubCategory,
  getAddressList,
  updateUserAddress,
  checkAddressExistence,
  getRestaurantsHome,
} from '../../redux/reducers/daddy';
import { setLocation, setLocationId, setLocationName, setOrderOfferAmount } from '../../redux/reducers/auth';
import { indiviadualShop } from '../../redux/reducers/addressSlice';

// --- Components ---
import Skeleton from './Skeleton';
import ServiceUnavailableScreen from './ServiceUnavailableScreen';
import { colors } from '../../config/theme';
import StatusBarManager from '../../components/StatusBarManager';

const { width } = Dimensions.get('window');
const SVG_ASPECT_RATIO = 241 / 393;
const SVG_HEIGHT = width * SVG_ASPECT_RATIO;
const TAB_CUTOUT_HEIGHT = 66.5 * (width / 393); 
const CONTENT_WIDTH = width - 32; 

// Static Assets
const PROFILE_URL = 'https://i.pravatar.cc/150?img=11';
const VEG_TAB_ICON = 'https://cdn-icons-png.flaticon.com/512/3194/3194591.png';
const SNACK_TAB_ICON = 'https://cdn-icons-png.flaticon.com/512/2515/2515183.png';

// ==========================================
// SVG BACKGROUND COMPONENTS
// ==========================================
const CategoryRadialBackground = () => (
  <Svg width="84" height="84" viewBox="0 0 84 84" style={styles.absoluteCategoryBg}>
    <Defs>
      <RadialGradient id="catGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <Stop offset="0%" stopColor="#EDFFEA" />
        <Stop offset="83.65%" stopColor="#EBFFE8" />
        <Stop offset="100%" stopColor="#E0FFDC" />
      </RadialGradient>
    </Defs>
    <Rect width="84" height="84" rx="16" fill="url(#catGrad)" />
  </Svg>
);

const VegActiveBackground = () => (
  <View style={styles.svgWrapper}>
    <Svg width="100%" height="100%" viewBox="0 0 393 241" fill="none" style={styles.absoluteSvg}>
      <Path d="M0 67H189.603C194.045 67 197.954 64.0703 199.201 59.8073L212.615 13.9468C214.859 6.2734 221.896 1 229.891 1H346.645C354.998 1 362.254 6.74707 364.166 14.8786L374.613 59.2897C375.675 63.8072 379.706 67 384.347 67H393V239.5H0V67Z" fill="url(#snacks_inactive_fill)"/>
      <Path d="M229.892 0.5C221.675 0.5 214.442 5.92009 212.135 13.8066L198.721 59.667C197.536 63.7167 193.823 66.4998 189.604 66.5H-0.5V240H393.5V66.5H384.347C379.938 66.4999 376.109 63.4663 375.1 59.1748L364.653 14.7637C362.687 6.40648 355.23 0.5 346.645 0.5H229.892Z" stroke="url(#snacks_inactive_stroke)" strokeOpacity="0.4"/>
      <Defs>
        <SvgLinearGradient id="snacks_inactive_fill" x1="196.5" y1="1" x2="198" y2="62.5" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#C3FEBC"/>
          <Stop offset="0.201923" stopColor="#CFFFC9" stopOpacity="0.850962"/>
          <Stop offset="1" stopColor="#CFFFC9" stopOpacity="0"/>
        </SvgLinearGradient>
        <SvgLinearGradient id="snacks_inactive_stroke" x1="334.75" y1="-9.11883" x2="145.75" y2="231.108" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#8BC783"/>
          <Stop offset="0.6875" stopColor="white" stopOpacity="0"/>
        </SvgLinearGradient>
      </Defs>
    </Svg>
    <Svg width="100%" height="100%" viewBox="0 0 393 241" fill="none" style={styles.absoluteSvg}>
      <Path d="M163.108 0.5C171.325 0.5 178.558 5.92009 180.865 13.8066L194.279 59.667C195.464 63.7167 199.177 66.4998 203.396 66.5H393.5V240H-0.5V66.5H8.65332C13.0619 66.4999 16.891 63.4663 17.9004 59.1748L28.3467 14.7637C30.3126 6.40648 37.7701 0.5 46.3555 0.5H163.108Z" fill="url(#veg_active_fill)" fillOpacity="0.4" stroke="url(#veg_active_stroke)"/>
      <Defs>
        <SvgLinearGradient id="veg_active_fill" x1="196.5" y1="2.5" x2="196.5" y2="239.5" gradientUnits="userSpaceOnUse">
          <Stop offset="0.0001" stopColor="#66E954"/>
          <Stop offset="0.9999" stopColor="#74D767" stopOpacity="0.56"/>
        </SvgLinearGradient>
        <SvgLinearGradient id="veg_active_stroke" x1="-3.63527e-07" y1="115.99" x2="393" y2="126.01" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#107D00"/>
          <Stop offset="1" stopColor="#C5FFBD"/>
        </SvgLinearGradient>
      </Defs>
    </Svg>
  </View>
);

const SnacksActiveBackground = () => (
  <View style={styles.svgWrapper}>
    <Svg width="100%" height="100%" viewBox="0 0 393 241" fill="none" style={styles.absoluteSvg}>
      <Path d="M163.108 0.5C171.325 0.5 178.558 5.92009 180.865 13.8066L194.279 59.667C195.464 63.7167 199.177 66.4998 203.396 66.5H393.5V240H-0.5V66.5H8.65332C13.0619 66.4999 16.891 63.4663 17.9004 59.1748L28.3467 14.7637C30.3126 6.40648 37.7701 0.5 46.3555 0.5H163.108Z" stroke="url(#veg_inactive_stroke_new)" strokeOpacity="0.3"/>
      <Defs>
        <SvgLinearGradient id="veg_inactive_stroke_new" x1="58.2502" y1="-9.11883" x2="247.25" y2="231.108" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FC6011"/>
          <Stop offset="0.6875" stopColor="white" stopOpacity="0"/>
        </SvgLinearGradient>
      </Defs>
    </Svg>
    <Svg width="100%" height="100%" viewBox="0 0 393 241" fill="none" style={[styles.absoluteSvg, { transform: [{ scaleX: -1 }] }]}>
      <Path d="M163.108 0.5C171.325 0.5 178.558 5.92009 180.865 13.8066L194.279 59.667C195.464 63.7167 199.177 66.4998 203.396 66.5H393.5V240H-0.5V66.5H8.65332C13.0619 66.4999 16.891 63.4663 17.9004 59.1748L28.3467 14.7637C30.3126 6.40648 37.7701 0.5 46.3555 0.5H163.108Z" fill="url(#snacks_active_fill_new)" stroke="url(#snacks_active_stroke_new)"/>
      <Defs>
        <SvgLinearGradient id="snacks_active_fill_new" x1="196.5" y1="0" x2="196.5" y2="238.5" gradientUnits="userSpaceOnUse">
          <Stop offset="0.0064" stopColor="rgba(251, 155, 106, 0.4)"/>
          <Stop offset="0.9999" stopColor="rgba(255, 220, 145, 0)"/>
        </SvgLinearGradient>
        <SvgLinearGradient id="snacks_active_stroke_new" x1="-3.63527e-07" y1="115.99" x2="393" y2="126.01" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FC6011"/>
          <Stop offset="1" stopColor="rgba(255, 220, 145, 0)"/>
        </SvgLinearGradient>
      </Defs>
    </Svg>
  </View>
);

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function UserHome({ navigation }) {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();

  // --- REDUX STATE ---
  const { categories, subCategories, banners, restaurants, activeCategoryIndex, loading, userAddress, serviceAvailable, homeRestaurnats } = useSelector(state => state.Dashboard);
  const { locationName } = useSelector(state => state.Auth);
  const authLocation = useSelector(state => state.Auth.location);
  const { isNetworkConnected } = useSelector(state => state.address);

  // --- LOCAL STATE ---
  const [activeTab, setActiveTab] = useState('veg');
  const [activeBanner, setActiveBanner] = useState(0); 
  const [selectedAddress, setSelectedAddress] = useState(userAddress || "");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [initialNetLoad, setInitialNetLoad] = useState(false);
  const [serviceCheckFailed, setServiceCheckFailed] = useState(false);
  const [errorOccured, setErrorOccured] = useState(false);
  const [mounted, setMounted] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // --- REFS ---
  const bannerScrollRef = useRef(null);
  const activeBannerRef = useRef(activeBanner);
  const networkStatusRef = useRef(isNetworkConnected);
  const hasInitiallyLoaded = useRef(false);

  // --- ANIMATION STATE ---
  const scrollY = useRef(new Animated.Value(0)).current;
  const stickyOpacity = scrollY.interpolate({
    inputRange: [100, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const stickyTranslateY = scrollY.interpolate({
    inputRange: [100, 150],
    outputRange: [-20, 0],
    extrapolate: 'clamp',
  });

  // --- DERIVED UI PROPS ---
  const activeColor = activeTab === 'veg' ? '#107D00' : '#D46327';
  const inactiveColor = activeTab === 'veg' ? '#65A35D' : '#E8A27A'; 
  const headerGradientColors = activeTab === 'veg' 
    ? ['#CEFFC7', '#D4FFCE', 'rgba(206, 255, 199, 0)'] 
    : ['rgba(251, 155, 106, 0.3)', 'rgba(255, 220, 145, 0.2)', 'rgba(255, 220, 145, 0)'];

  const popularRestaurants = homeRestaurnats && homeRestaurnats.filter(restaurant => Number(restaurant.shop_rating) >= 4.5);
  const isLoading = (loading.addressCheck || isLoadingLocation || loading.categories || loading.banners);

  // ==========================================
  // FUNCTIONS & HOOKS
  // ==========================================
  const handleSearch = (query) => {
    setSearchQuery(query);
    // You can add more global search logic here if needed
  };
  useEffect(() => {
    networkStatusRef.current = isNetworkConnected;
  }, [isNetworkConnected]);

  useEffect(() => {
    activeBannerRef.current = activeBanner;
  }, [activeBanner]);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollPosition / CONTENT_WIDTH);
    setActiveBanner(currentIndex);
  };

  useEffect(() => {
    if (!banners || banners.length === 0) return;
    const interval = setInterval(() => {
      let nextIndex = activeBannerRef.current + 1;
      if (nextIndex >= banners.length) nextIndex = 0; 
      bannerScrollRef.current?.scrollTo({ x: nextIndex * CONTENT_WIDTH, animated: true });
      setActiveBanner(nextIndex);
    }, 3000); 
    return () => clearInterval(interval);
  }, [banners]);

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      setErrorOccured(false);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyApeRJe3NFzGsTey20Xu8XEFrIxphxs4VM`,
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) return data.results[0].formatted_address;
      return 'Address not found';
    } catch (error) {
      console.error('Error getting address:', error);
      setErrorOccured(true);
      return 'Error getting address';
    }
  };

  const getCurrentLocation = useCallback(() => {
    setIsLoadingLocation(true);
    Geolocation.setRNConfiguration({ enableHighAccuracy: false, timeout: 2000, maximumAge: 1000 });
    Geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        const address = await getAddressFromCoordinates(latitude, longitude);
        await dispatch(setLocation({ latitude, longitude }));
        const currentLocationAddress = {
          address_type: userAddress?.address_type || 'Home',
          full_address: address,
          customer_latitude: latitude.toString(),
          customer_longitude: longitude.toString(),
          name: userAddress?.name || '',
          contact: userAddress?.contact || '',
        };
        if (!isNetworkConnected) return;
        dispatch(updateUserAddress(currentLocationAddress));
        setSelectedAddress(currentLocationAddress);
        setIsLoadingLocation(false);
        checkServiceAvailability({ latitude, longitude });
      },
      error => {
        console.error('Error getting location:', error);
        setIsLoadingLocation(false);
        networkStatusRef.current && navigation.replace('ServicesAvailable', { permissionDenied: true });
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
    );
  }, [dispatch, userAddress, isNetworkConnected, navigation]);

  const requestLocationPermission = useCallback(async () => {
    try {
      let permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      if (!permission) return;
      const status = await check(permission);
      if (status === RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        const reqStatus = await request(permission);
        if (reqStatus === RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          networkStatusRef.current && navigation.replace('ServicesAvailable', { permissionDenied: true });
        }
      }
    } catch (err) {
      networkStatusRef.current && navigation.replace('ServicesAvailable', { permissionDenied: true });
    }
  }, [getCurrentLocation, navigation, isNetworkConnected]);

  const getCategoreis = async () => {
    try {
      setErrorOccured(false);
      dispatch(getCategories());
      dispatch(getSubCategories({ categoryId: activeCategoryIndex }));
      dispatch(getBanners());
      if (!restaurants || restaurants.length === 0) {
        dispatch(getRestaurantsHome({ categoryId: activeCategoryIndex }));
      }
    } catch (error) {
      setErrorOccured(true);
    }
  };

  useEffect(() => {
    const initializeLocation = async () => {
      if (authLocation) {
        const address = await getAddressFromCoordinates(authLocation.latitude, authLocation.longitude);
        const currentAddress = {
          address_type: locationName,
          full_address: address,
          customer_latitude: authLocation.latitude.toString(),
          customer_longitude: authLocation.longitude.toString(),
        };
        if (!isNetworkConnected) return;
        setSelectedAddress(currentAddress);
      } else if (userAddress) {
        setSelectedAddress(userAddress);
      } else {
        requestLocationPermission();
      }
    };
    if (!hasInitiallyLoaded.current) {
      initializeLocation();
      hasInitiallyLoaded.current = true;
    }
  }, []); 

  useFocusEffect(
    useCallback(() => {
      dispatch(getAddressList());
    }, [dispatch])
  );

  const checkServiceAvailability = async (paramAuth) => {
    const abortController = new AbortController();
    const checkAvailability = async () => {
      if(paramAuth){
        try {
          setErrorOccured(false);
          const response = await dispatch(checkAddressExistence({ latitude: paramAuth.latitude, longitude: paramAuth.longitude })).unwrap();
          if (mounted && response.data && response.data.length > 0) {
            await dispatch(setLocationName(response.data[0].location_name));
            await dispatch(setLocationId(response.data[0].id));
            if (response.data.length > 0) {
              const result = await dispatch(getCategories());
              dispatch(setOrderOfferAmount(result.payload?.data[0]?.order_offer_amount));
              dispatch(getBanners());
              if (!restaurants || restaurants.length === 0) {
                dispatch(getRestaurantsHome({ categoryId: activeCategoryIndex }));
              }
              dispatch(getSubCategories({ categoryId: activeCategoryIndex }));
            }
          }
        } catch (error) {
          setErrorOccured(true);
        }
        return;
      }

      if (!authLocation || !mounted) return;
      try {
        setErrorOccured(false);
        const response = await dispatch(checkAddressExistence({ latitude: authLocation.latitude, longitude: authLocation.longitude })).unwrap();
        if (mounted && response.data && response.data.length > 0) {
          await dispatch(setLocationName(response.data[0].location_name));
          await dispatch(setLocationId(response.data[0].id));
          if (response.data.length > 0) {
            const result = await dispatch(getCategories());
            dispatch(setOrderOfferAmount(result.payload?.data[0]?.order_offer_amount));
            dispatch(getBanners());
            if (!restaurants || restaurants.length === 0) {
              dispatch(getRestaurantsHome({ categoryId: activeCategoryIndex }));
            }
            dispatch(getSubCategories({ categoryId: activeCategoryIndex }));
          }
        }
      } catch (error) {
        setErrorOccured(true);
      }
    };
    checkAvailability();
    return () => { abortController.abort(); setMounted(false); };
  };

  useEffect(() => {
    if (authLocation && !hasInitiallyLoaded.current) {
      checkServiceAvailability();
    }
  }, [authLocation, serviceAvailable]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async state => {
      if (state.isConnected && !isNetworkConnected) {
        setInitialNetLoad(true);
        await checkServiceAvailability();
        await Promise.all([
          dispatch(getCategories()),
          dispatch(getBanners()),
          dispatch(getRestaurantsHome({ categoryId: activeCategoryIndex })),
        ]);
        dispatch(getSubCategories({ categoryId: activeCategoryIndex }));
        await new Promise(resolve => setTimeout(resolve, 500));
        setInitialNetLoad(false);
      }
    });
    return () => unsubscribe();
  }, [isNetworkConnected, activeCategoryIndex, dispatch]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getCategoreis();
    setRefreshing(false);
  }, []);

  const calculateDeliveryTime = (distance) => {
    if (distance < 3) return '15-20 mins';
    else if (distance < 5) return '20-30 mins';
    else return '30-45 mins';
  };

  const handleBannerPress = async (banner) => {
    const resp = await dispatch(indiviadualShop({ shopId: banner?.shop_id }));
    if (!resp.payload.data[0] || resp.payload.data[0] <= 0) return;
    if (banner?.shop_id && banner?.shop_id !== 0) {
      navigation.navigate('BannerRestaurantScreen', { shopId: banner?.shop_id, shopItem: banner?.item_id, highlightItemId: 0 });
    }
  };

  const handleTabToggle = (tabStr) => {
    setActiveTab(tabStr);
    const targetCategory = tabStr === 'veg' ? categories?.[0] : categories?.[1];
    if (targetCategory) {
      dispatch(setActiveCategoryIndex(targetCategory.id));
      dispatch(getSubCategories({ categoryId: targetCategory.id }));
      dispatch(getRestaurantsHome({ categoryId: targetCategory.id }));
      dispatch(setOrderOfferAmount(targetCategory.order_offer_amount));
    }
  };

  // ==========================================
  // RENDER CONDITIONS
  // ==========================================
  if (isNetworkConnected === null || isLoading || initialNetLoad) {
    return (
      <View style={styles.mainWrapper}>
        <StatusBar backgroundColor="#088B35" translucent barStyle="light-content" />
        <Skeleton />
      </View>
    );
  }

  if (!isNetworkConnected && !categories) {
    return (
      <View style={styles.mainWrapper}>
        <StatusBar backgroundColor="#088B35" translucent barStyle="light-content" />
        <View style={styles.offlineContainer}>
          <MaterialCommunityIcons name="wifi-off" size={40} color={colors.gray} />
          <Text style={styles.offlineText}>No internet connection available</Text>
          <Text style={styles.offlineSubText}>Please check your network settings</Text>
        </View>
      </View>
    );
  }

  if (serviceCheckFailed && !isLoading) {
    return (
      <View style={styles.mainWrapper}>
        <StatusBar backgroundColor="#088B35" translucent barStyle="light-content" />
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={40} color={colors.red} />
          <Text style={styles.errorText}>Network Error</Text>
          <Text style={styles.errorSubText}>Failed to connect to the server</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => checkServiceAvailability()}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (serviceAvailable === false) {
    return <ServiceUnavailableScreen />;
  }

  if (!categories && !errorOccured) {
    return (
      <View style={styles.mainWrapper}>
        <StatusBar backgroundColor="#088B35" translucent barStyle="light-content" />
        <Skeleton />
      </View>
    );
  }

  // ==========================================
  // MAIN UI RENDER
  // ==========================================
  return (
    <View style={styles.mainWrapper}>
      <StatusBarManager screenName="home" />
      
      <LinearGradient
        colors={headerGradientColors}
        locations={[0, 0.774, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.rectangle10}
      />

      {/* Sticky Search Bar */}
      <Animated.View
        style={[
          styles.stickySearchBar,
          {
            opacity: stickyOpacity,
            transform: [{ translateY: stickyTranslateY }],
          },
        ]}
      >
        <LinearGradient
          colors={activeTab === 'veg' ? ['#088B35', '#08B341'] : ['#FC6011', '#FF9F6A']}
          style={[styles.stickySearchGradient, { paddingTop: insets.top + 5 }]}
        >
          <View style={styles.searchContainerSticky}>
            <Icon name="search" size={24} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for items..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={handleSearch}
              onFocus={() => navigation.navigate('CategoriesScreen')}
            />
          </View>
        </LinearGradient>
      </Animated.View>

      <SafeAreaView style={styles.safeArea}>
        <Animated.ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#088B35']} />}
        >
          
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('SelectServiceFromLocation', { selectedAddress })} style={styles.locationWrapper}>
              <View style={styles.homeLabelRow}>
                <Text style={[styles.homeLabel, { color: activeColor }]}>{locationName || 'Location'}</Text>
                <Icon name="keyboard-arrow-down" size={20} color={activeColor} style={{ marginLeft: 4 }} />
              </View>
              <Text style={[styles.addressText, { color: activeColor }]} numberOfLines={1}>
                {selectedAddress?.full_address || 'Select your location'}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <View style={styles.notificationDot} />
                <Text style={styles.bellIcon}>🔔</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Image source={{ uri: PROFILE_URL }} style={styles.profilePic} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.tabsAndContentContainer}>
            
            {activeTab === 'veg' ? <VegActiveBackground /> : <SnacksActiveBackground />}

            <View style={styles.tabsRow}>
              <TouchableOpacity 
                style={styles.tabButton} 
                onPress={() => handleTabToggle('veg')}
                activeOpacity={0.8}
              >
                <Image source={{ uri: VEG_TAB_ICON }} style={styles.tabIcon} />
                <Text style={[styles.tabText, { color: activeTab === 'veg' ? activeColor : inactiveColor, fontWeight: activeTab === 'veg' ? '700' : '500' }]}>
                  Vegetables & Fruits
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.tabButton} 
                onPress={() => handleTabToggle('snacks')}
                activeOpacity={0.8}
              >
                <Image source={{ uri: SNACK_TAB_ICON }} style={styles.tabIcon} />
                <Text style={[styles.tabText, { color: activeTab === 'snacks' ? activeColor : inactiveColor, fontWeight: activeTab === 'snacks' ? '700' : '500' }]}>
                  Snacks
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.mainContent}>
              
              {/* Search Bar in Header */}
              <View style={styles.searchContainerHeader}>
                <Icon name="search" size={24} color="#999" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search for items..."
                  placeholderTextColor="#999"
                  value={searchQuery}
                  onChangeText={handleSearch}
                  onFocus={() => navigation.navigate('CategoriesScreen')}
                />
              </View>

              {/* DYNAMIC BANNER CAROUSEL WITH FALLBACK */}
              <View style={styles.carouselWrapper}>
                {banners && banners.length > 0 ? (
                  <ScrollView
                    ref={bannerScrollRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                  >
                    {banners.map((item, index) => (
                      <TouchableOpacity key={index} style={styles.bannerItem} onPress={() => handleBannerPress(item)} activeOpacity={0.9}>
                        <Image source={{ uri: item.banner_image }} style={styles.bannerImage} />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                ) : (
                  <View style={styles.bannerItem}>
                    <Image source={{ uri: activeTab === 'veg' ? 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80' : 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80' }} style={styles.bannerImage} />
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }]}>
                      <Text style={{ color: '#FFFFFF', fontSize: 18, fontFamily: 'SF Pro Display', fontWeight: '700' }}>Welcome to {locationName || 'Our Store'}</Text>
                      <Text style={{ color: '#FFFFFF', fontSize: 13, fontFamily: 'SF Pro Display', fontWeight: '500', marginTop: 4 }}>Amazing offers coming soon!</Text>
                    </View>
                  </View>
                )}
              </View>

              {/* DYNAMIC PAGINATION DOTS */}
              <View style={styles.paginationContainer}>
                {banners && banners.length > 0 ? (
                  banners.map((_, index) => {
                    if (index === activeBanner) {
                      return (
                        <View key={index} style={styles.activeDotTrack}>
                          <View style={styles.activeDotIndicator} />
                        </View>
                      );
                    }
                    return <View key={index} style={styles.inactiveDot} />;
                  })
                ) : (
                  <View style={{ height: 6 }} />
                )}
              </View>

              {/* DYNAMIC SUBCATEGORIES GRID */}
              {subCategories && subCategories.length > 0 && (
                <View style={styles.categoriesSection}>
                  <Text style={styles.categoriesTitle}>Categories</Text>
                  
                  <View style={styles.categoriesGrid}>
                    {subCategories.slice(0, 8).map((item, index) => (
                      <TouchableOpacity 
                        key={index} 
                        style={styles.categoryItemContainer}
                        onPress={() => { dispatch(setsubCategory(item)); navigation.navigate('CategorieItems'); }}
                      >
                        <View style={styles.categoryImageWrapper}>
                          <CategoryRadialBackground />
                          <Image source={{ uri: item.sub_category_image }} style={styles.categoryImageOverlay} />
                        </View>
                        <Text style={styles.categoryText} numberOfLines={2}>{item.sub_category_name}</Text>
                      </TouchableOpacity>
                    ))}

                    {/* View More Button - Navigates to 'Categories' Tab */}
                    {subCategories.length > 8 && (
                      <TouchableOpacity 
                        style={styles.viewMoreContainer}
                        onPress={() => navigation.navigate('Categories')}
                      >
                        <View style={styles.viewMoreCircle}>
                          <Icon name="keyboard-arrow-right" size={30} color="#088B35" />
                        </View>
                        <Text style={styles.viewMoreText}>View More</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}

              {/* DYNAMIC FRESH PICKS (POPULAR RESTAURANTS) */}
              <View style={styles.picksSectionContainer}>
                <View style={styles.picksHeaderRow}>
                  <Text style={styles.picksSectionTitle}>Fresh Picks Near You</Text>
                  <View style={styles.picksSectionLine} />
                </View>
                
                {popularRestaurants?.length > 0 ? (
                  popularRestaurants.map((item, index) => {
                    const isUnavailable = item.shop_active_status === '1';
                    return (
                      <React.Fragment key={`restaurant-${item.shop_id || index}`}>
                        <TouchableOpacity 
                          style={[styles.storeCard, isUnavailable && { opacity: 0.5 }]}
                          onPress={() => navigation.navigate('RestaurantScreen', { shopId: item.shop_id, shopItem: item.shop_items_tb_nm, item })}
                        >
                          <Image source={{ uri: item?.shop_image }} style={styles.storeImage} />
                          
                          <View style={styles.storeContentArea}>
                            <View style={styles.storeInfoColumn}>
                              <View style={styles.storeNameWrap}>
                                <Text style={styles.storeName} numberOfLines={1}>{item.shop_name}</Text>
                                <Text style={styles.storeType} numberOfLines={1}>{item.shop_address || 'Supermarket'}</Text>
                              </View>
                              <Text style={styles.deliveryTime}>• Delivery in {calculateDeliveryTime(item.distance)}</Text>
                              <View style={styles.ratingBadge}>
                                <Text style={styles.ratingText}>{item.shop_rating}</Text>
                                <Text style={styles.starIcon}>★</Text>
                              </View>
                            </View>
                            <TouchableOpacity style={styles.menuIconContainer}>
                              <View style={styles.menuCircle}>
                                <View style={styles.menuDot} /><View style={styles.menuDot} /><View style={styles.menuDot} />
                              </View>
                            </TouchableOpacity>
                          </View>
                        </TouchableOpacity>

                        {index !== popularRestaurants.length - 1 && <View style={styles.dashedSeparator} />}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <View style={{ alignItems: 'center', justifyContent: 'center', height: 100 }}>
                    <Text style={{ fontSize: 14, fontWeight: '400', color: '#656565' }}>No fresh picks available right now</Text>
                  </View>
                )}
              </View>

              <View style={styles.bottomSpacer} />
            </View>
          </View>
        </Animated.ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ==========================================
// STYLES
// ==========================================
const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: '#FFFFFF' },
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  rectangle10: { position: 'absolute', width: width, height: 270, top: 0, left: 0, zIndex: 0 },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 40, marginBottom: 20, zIndex: 2 },
  locationWrapper: { flex: 1, marginRight: 20 },
  homeLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  homeLabel: { fontSize: 18, fontFamily: 'SF Pro Display', fontWeight: '800' },
  addressText: { fontSize: 12, fontFamily: 'SF Pro Display', fontWeight: '500' },
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconButton: { width: 36, height: 36, backgroundColor: '#FFFFFF', borderRadius: 18, justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, shadowOffset: { width: 0, height: 2 } },
  notificationDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, backgroundColor: '#E7432D', borderRadius: 4, zIndex: 2 },
  bellIcon: { fontSize: 16 },
  profilePic: { width: 36, height: 36, borderRadius: 18 },
  tabsAndContentContainer: { position: 'relative', width: width, minHeight: 500 },
  svgWrapper: { position: 'absolute', top: 0, left: 0, width: width, height: SVG_HEIGHT, zIndex: 1 },
  absoluteSvg: { position: 'absolute', top: 0, left: 0 },
  tabsRow: { flexDirection: 'row', width: width, height: TAB_CUTOUT_HEIGHT, zIndex: 2 },
  tabButton: { flex: 1, height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 4 },
  tabIcon: { width: 24, height: 24, resizeMode: 'contain', marginBottom: 2 },
  tabText: { fontSize: 11, fontFamily: 'SF Pro Display', textAlign: 'center' },
  mainContent: { paddingTop: 10, zIndex: 2 },
  carouselWrapper: { width: CONTENT_WIDTH, height: 140, alignSelf: 'center', marginTop: 16, marginBottom: 16, borderRadius: 16, elevation: 3, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 5, shadowOffset: { width: 0, height: 3 }, backgroundColor: '#FFF' },
  bannerItem: { width: CONTENT_WIDTH, height: 140, borderRadius: 16, overflow: 'hidden' },
  bannerImage: { width: '100%', height: '100%', resizeMode: 'stretch' },
  paginationContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5.24, marginBottom: 24 },
  activeDotTrack: { width: 37, height: 6, backgroundColor: '#D6D6D6', borderRadius: 3, overflow: 'hidden' },
  activeDotIndicator: { position: 'absolute', left: 0, top: 0, width: 24.1, height: 6, backgroundColor: '#292D32', borderRadius: 3 },
  inactiveDot: { width: 6, height: 6, backgroundColor: '#D6D6D6', borderRadius: 3 },
  categoriesSection: { width: CONTENT_WIDTH, alignSelf: 'center', flexDirection: 'column', alignItems: 'flex-start', gap: 12, marginBottom: 30 },
  categoriesTitle: { fontFamily: 'SF Pro Display', fontStyle: 'normal', fontWeight: '700', fontSize: 20, lineHeight: 24, color: '#000000' },
  categoriesGridRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 5 },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  viewMoreContainer: {
    width: 84,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewMoreCircle: {
    width: 84,
    height: 84,
    borderRadius: 16,
    backgroundColor: '#EDFFEA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#088B35',
    borderStyle: 'dashed',
  },
  viewMoreText: {
    fontFamily: 'SF Pro Display',
    fontWeight: '600',
    fontSize: 12,
    color: '#088B35',
  },
  categoryItemContainer: { flexDirection: 'column', alignItems: 'center', width: 84, marginBottom: 15 },
  categoryImageWrapper: { width: 84, height: 84, borderRadius: 16, position: 'relative', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  absoluteCategoryBg: { position: 'absolute', left: 0, top: 0 },
  categoryImageOverlay: { width: 50, height: 50, resizeMode: 'contain', zIndex: 2 },
  categoryText: { width: 84, fontFamily: 'SF Pro Display', fontStyle: 'normal', fontWeight: '400', fontSize: 12, lineHeight: 14, textAlign: 'center', color: '#000000' },
  picksSectionContainer: { width: CONTENT_WIDTH, alignSelf: 'center', flexDirection: 'column', gap: 8, marginBottom: 24 },
  picksHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
  picksSectionTitle: { fontFamily: 'Poppins', fontWeight: '700', fontSize: 16, lineHeight: 24, color: '#000000' },
  picksSectionLine: { flex: 1, height: 1, backgroundColor: '#D0D0D0' },
  storeCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 12, alignItems: 'center', gap: 12, height: 116 },
  storeImage: { width: 140, height: 116, borderRadius: 16, backgroundColor: '#f0f0f0' },
  storeContentArea: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', height: 111 },
  storeInfoColumn: { flex: 1, flexDirection: 'column', justifyContent: 'center', paddingVertical: 10, gap: 8 },
  storeNameWrap: { flexDirection: 'column', gap: 4 },
  storeName: { fontFamily: 'Gilroy-Bold', fontWeight: '400', fontSize: 16, lineHeight: 20, color: '#000000' },
  storeType: { fontFamily: 'Gilroy-Medium', fontSize: 12, lineHeight: 15, color: '#676767' },
  deliveryTime: { fontFamily: 'Gilroy-SemiBold', fontSize: 14, lineHeight: 17, color: '#07772F' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#07772F', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 4, gap: 4 },
  ratingText: { fontFamily: 'Gilroy-Bold', fontSize: 12, lineHeight: 14, color: '#FFFFFF' },
  starIcon: { fontSize: 10, color: '#FFFFFF', marginTop: -1 },
  dashedSeparator: { width: '100%', height: 1, borderWidth: 1, borderColor: '#D8D8D8', borderStyle: 'dashed', marginVertical: 4 },
  menuIconContainer: { padding: 8, justifyContent: 'center', alignItems: 'center' },
  menuCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 0.5, borderColor: '#A3A3A3', backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 2 },
  menuDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#000000' },
  bottomSpacer: { height: 100 },
  offlineContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  offlineText: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 20 },
  offlineSubText: { fontSize: 14, color: '#666', marginTop: 10 },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  errorText: { fontSize: 18, fontWeight: 'bold', color: colors.red, marginTop: 20 },
  errorSubText: { fontSize: 14, color: '#666', marginTop: 10 },
  retryButton: { marginTop: 20, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#088B35', borderRadius: 8 },
  retryText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  
  // Search Styles
  searchContainerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    height: 50,
    marginTop: 10,
    marginBottom: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  searchContainerSticky: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    height: 45,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  stickySearchBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  stickySearchGradient: {
    width: '100%',
    paddingBottom: 5,
  },
});