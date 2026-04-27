import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
  Animated,
  FlatList
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, RadialGradient, Stop, Rect } from 'react-native-svg';

// --- API & Redux Imports ---
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
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

const { width } = Dimensions.get('window');
const SVG_ASPECT_RATIO = 241 / 393;
const SVG_HEIGHT = width * SVG_ASPECT_RATIO;
const TAB_CUTOUT_HEIGHT = 66.5 * (width / 393); 
const CONTENT_WIDTH = width - 32; 

// Static Assets
const PROFILE_URL = 'https://i.pravatar.cc/150?img=11';

// ==========================================
// MEMOIZED SVG COMPONENTS
// ==========================================
const CategoryRadialBackground = React.memo(({ isVeg }) => (
  <Svg width="84" height="84" viewBox="0 0 84 84" style={styles.absoluteCategoryBg}>
    <Defs>
      <RadialGradient id="catGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <Stop offset="0%" stopColor={isVeg ? "#EDFFEA" : "#FFF4EA"} />
        <Stop offset="83.65%" stopColor={isVeg ? "#EBFFE8" : "#FFF2E8"} />
        <Stop offset="100%" stopColor={isVeg ? "#E0FFDC" : "#FFEBDC"} />
      </RadialGradient>
    </Defs>
    <Rect width="84" height="84" rx="16" fill="url(#catGrad)" />
  </Svg>
));

const VegActiveBackground = React.memo(() => (
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
));

const SnacksActiveBackground = React.memo(() => (
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
));

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function UserHome({ navigation }) {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  // --- REDUX STATE (Optimized with shallowEqual) ---
  const { 
    categories, 
    subCategories, 
    banners, 
    activeCategoryIndex, 
    loading, 
    userAddress, 
    serviceAvailable, 
    homeRestaurnats 
  } = useSelector(state => state.Dashboard, shallowEqual);
  
  const { locationName } = useSelector(state => state.Auth, shallowEqual);
  const authLocation = useSelector(state => state.Auth.location, shallowEqual);
  const { isNetworkConnected } = useSelector(state => state.address, shallowEqual);

  // --- LOCAL STATE ---
  const [activeBanner, setActiveBanner] = useState(0); 
  const [selectedAddress, setSelectedAddress] = useState(userAddress || "");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [initialNetLoad, setInitialNetLoad] = useState(false);
  const [errorOccured, setErrorOccured] = useState(false);
  const [mounted, setMounted] = useState(true);

  // --- REFS ---
  const bannerScrollRef = useRef(null);
  const activeBannerRef = useRef(activeBanner);
  const networkStatusRef = useRef(isNetworkConnected);
  const hasInitiallyLoaded = useRef(false);

  // ==========================================
  // DYNAMIC CATEGORY LOGIC
  // ==========================================
  const sortedCategories = useMemo(() => {
    if (!categories) return [];
    return [...categories].sort((a, b) => {
      const aName = a.category_name.toLowerCase();
      const bName = b.category_name.toLowerCase();
      if (aName.includes('veg')) return -1;
      if (bName.includes('veg')) return 1;
      return 0;
    });
  }, [categories]);

  useEffect(() => {
    if (sortedCategories.length > 0 && !hasInitiallyLoaded.current) {
      const vegCategory = sortedCategories.find(c => c.category_name.toLowerCase().includes('veg'));
      if (vegCategory) {
        dispatch(setActiveCategoryIndex(vegCategory.id));
        dispatch(getSubCategories({ categoryId: vegCategory.id }));
        dispatch(getRestaurantsHome({ categoryId: vegCategory.id }));
        dispatch(setOrderOfferAmount(vegCategory.order_offer_amount));
        hasInitiallyLoaded.current = true;
      }
    }
  }, [sortedCategories, dispatch]);

  const activeCategoryData = useMemo(() => 
    sortedCategories.find(c => c.id === activeCategoryIndex),
    [sortedCategories, activeCategoryIndex]
  );
  
  const isLeftTabActive = sortedCategories.length > 0 && activeCategoryIndex === sortedCategories[0].id;
  const isVegTheme = activeCategoryData?.category_name.toLowerCase().includes('veg') ?? true;

  const activeColor = isVegTheme ? '#107D00' : '#D46327';
  const inactiveColor = isVegTheme ? '#65A35D' : '#E8A27A'; 
  const headerGradientColors = isVegTheme 
    ? ['#CEFFC7', '#D4FFCE', 'rgba(206, 255, 199, 0)'] 
    : ['rgba(251, 155, 106, 0.3)', 'rgba(255, 220, 145, 0.2)', 'rgba(255, 220, 145, 0)'];

  const popularRestaurants = useMemo(() => 
    homeRestaurnats ? homeRestaurnats.filter(r => Number(r.shop_rating) >= 4.5) : [],
    [homeRestaurnats]
  );

  const isLoading = (loading.addressCheck || isLoadingLocation || loading.categories || loading.banners);

  // ==========================================
  // FUNCTIONS & HOOKS
  // ==========================================
  useEffect(() => { networkStatusRef.current = isNetworkConnected; }, [isNetworkConnected]);
  useEffect(() => { activeBannerRef.current = activeBanner; }, [activeBanner]);

  const handleScroll = useCallback((event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollPosition / CONTENT_WIDTH);
    if (currentIndex !== activeBannerRef.current) {
      setActiveBanner(currentIndex);
    }
  }, []);

  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const interval = setInterval(() => {
      let nextIndex = activeBannerRef.current + 1;
      if (nextIndex >= banners.length) nextIndex = 0; 
      bannerScrollRef.current?.scrollTo({ x: nextIndex * CONTENT_WIDTH, animated: true });
      setActiveBanner(nextIndex);
    }, 4000); 
    return () => clearInterval(interval);
  }, [banners]);

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyApeRJe3NFzGsTey20Xu8XEFrIxphxs4VM`);
      const data = await response.json();
      return data.results?.[0]?.formatted_address || 'Address not found';
    } catch (error) {
      return 'Error getting address';
    }
  };

  const getCurrentLocation = useCallback(() => {
    setIsLoadingLocation(true);
    Geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        const address = await getAddressFromCoordinates(latitude, longitude);
        dispatch(setLocation({ latitude, longitude }));
        const currentLocationAddress = {
          address_type: userAddress?.address_type || 'Home',
          full_address: address,
          customer_latitude: latitude.toString(),
          customer_longitude: longitude.toString(),
        };
        dispatch(updateUserAddress(currentLocationAddress));
        setSelectedAddress(currentLocationAddress);
        setIsLoadingLocation(false);
        checkServiceAvailability({ latitude, longitude });
      },
      () => {
        setIsLoadingLocation(false);
        navigation.replace('ServicesAvailable', { permissionDenied: true });
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5000 }
    );
  }, [dispatch, userAddress, navigation]);

  const requestLocationPermission = useCallback(async () => {
    try {
      const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      const status = await check(permission);
      if (status === RESULTS.GRANTED) getCurrentLocation();
      else {
        const reqStatus = await request(permission);
        if (reqStatus === RESULTS.GRANTED) getCurrentLocation();
        else navigation.replace('ServicesAvailable', { permissionDenied: true });
      }
    } catch (err) {
      navigation.replace('ServicesAvailable', { permissionDenied: true });
    }
  }, [getCurrentLocation, navigation]);

  const checkServiceAvailability = useCallback(async (paramAuth) => {
    const loc = paramAuth || authLocation;
    if (!loc) return;
    try {
      const response = await dispatch(checkAddressExistence({ latitude: loc.latitude, longitude: loc.longitude })).unwrap();
      if (response.data?.length > 0) {
        dispatch(setLocationName(response.data[0].location_name));
        dispatch(setLocationId(response.data[0].id));
        dispatch(getCategories());
        dispatch(getBanners());
        dispatch(getSubCategories({ categoryId: activeCategoryIndex }));
        dispatch(getRestaurantsHome({ categoryId: activeCategoryIndex }));
      }
    } catch (error) {
      setErrorOccured(true);
    }
  }, [authLocation, activeCategoryIndex, dispatch]);

  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      if (authLocation) {
        setSelectedAddress({ full_address: 'Loading address...', ...authLocation });
        checkServiceAvailability(authLocation);
      } else if (userAddress) {
        setSelectedAddress(userAddress);
        checkServiceAvailability(userAddress);
      } else {
        requestLocationPermission();
      }
    }
  }, [authLocation, userAddress, checkServiceAvailability, requestLocationPermission]);

  useFocusEffect(useCallback(() => { dispatch(getAddressList()); }, [dispatch]));

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(getCategories());
    dispatch(getBanners());
    dispatch(getSubCategories({ categoryId: activeCategoryIndex }));
    dispatch(getRestaurantsHome({ categoryId: activeCategoryIndex }));
    setRefreshing(false);
  }, [activeCategoryIndex, dispatch]);

  const calculateDeliveryTime = (distance) => distance < 3 ? '15-20 mins' : distance < 5 ? '20-30 mins' : '30-45 mins';

  const renderCategoryItem = useCallback(({ item, index }) => (
    <TouchableOpacity 
      style={[styles.categoryItemContainer, { marginRight: 12 }]}
      onPress={() => { dispatch(setsubCategory(item)); navigation.navigate('CategorieItems'); }}
    >
      <View style={styles.categoryImageWrapper}>
        <CategoryRadialBackground isVeg={isVegTheme} />
        <Image source={{ uri: item.sub_category_image }} style={styles.categoryImageOverlay} />
      </View>
      <Text style={styles.categoryText} numberOfLines={2}>{item.sub_category_name}</Text>
    </TouchableOpacity>
  ), [isVegTheme, dispatch, navigation]);

  const renderRestaurantItem = useCallback(({ item, index }) => {
    const isUnavailable = item.shop_active_status === "1";
    return (
      <View key={`restaurant-${item.shop_id || index}`}>
        <TouchableOpacity 
          style={[styles.storeCard, isUnavailable && { opacity: 0.5 }]}
          onPress={() => { if(!isUnavailable) navigation.navigate('RestaurantScreen', { shopId: item.shop_id, shopItem: item.shop_items_tb_nm, item })}}
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
          </View>
        </TouchableOpacity>
        {index !== popularRestaurants.length - 1 && <View style={styles.dashedSeparator} />}
      </View>
    );
  }, [popularRestaurants.length, navigation]);

  // ==========================================
  // RENDER
  // ==========================================
  if (isNetworkConnected === null || isLoading || initialNetLoad) {
    return (
      <View style={styles.mainWrapper}>
        <StatusBar backgroundColor="#088B35" translucent barStyle="light-content" />
        <Skeleton />
      </View>
    );
  }

  if (serviceAvailable === false) return <ServiceUnavailableScreen />;

  return (
    <View style={styles.mainWrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient colors={headerGradientColors} style={styles.rectangle10} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={Platform.OS === 'android'}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#088B35']} />}
        >
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("SelectServiceFromLocation", { selectedAddress })} style={styles.locationWrapper}>
              <View style={styles.homeLabelRow}>
                <Text style={[styles.homeLabel, { color: activeColor }]}>{locationName || 'Location'}</Text>
                <Icon name="keyboard-arrow-down" size={20} color={activeColor} style={{ marginLeft: 4 }} />
              </View>
              <Text style={[styles.addressText, { color: activeColor }]} numberOfLines={1}>
                {selectedAddress?.full_address || 'Select your location'}
              </Text>
            </TouchableOpacity>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Notifications")}>
                <View style={styles.notificationDot} />
                <Text style={styles.bellIcon}>🔔</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Image source={{ uri: PROFILE_URL }} style={styles.profilePic} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.tabsAndContentContainer}>
            {isLeftTabActive ? <VegActiveBackground /> : <SnacksActiveBackground />}
            
            <View style={styles.tabsRow}>
              {sortedCategories.slice(0, 2).map((cat) => {
                const isActive = activeCategoryIndex === cat.id;
                return (
                  <TouchableOpacity 
                    key={cat.id}
                    style={styles.tabButton} 
                    onPress={() => {
                      dispatch(setActiveCategoryIndex(cat.id));
                      dispatch(getSubCategories({ categoryId: cat.id }));
                      dispatch(getRestaurantsHome({ categoryId: cat.id }));
                      dispatch(setOrderOfferAmount(cat.order_offer_amount));
                    }}
                  >
                    <Image source={{ uri: cat.category_image }} style={styles.tabIcon} />
                    <Text style={[styles.tabText, { color: isActive ? activeColor : inactiveColor, fontWeight: isActive ? '700' : '500' }]}>
                      {cat.category_name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.mainContent}>
              <View style={styles.carouselWrapper}>
                {banners && banners.length > 0 ? (
                  <ScrollView
                    ref={bannerScrollRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={32}
                  >
                    {banners.map((item, index) => (
                      <TouchableOpacity key={index} style={styles.bannerItem} onPress={() => handleBannerPress(item)}>
                        <Image source={{ uri: item.banner_image }} style={styles.bannerImage} />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                ) : null}
              </View>

              {subCategories?.length > 0 && (
                <View style={styles.categoriesSection}>
                  <Text style={styles.categoriesTitle}>Categories</Text>
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={subCategories}
                    renderItem={renderCategoryItem}
                    keyExtractor={(item, index) => `subcat-${item.id || index}`}
                    initialNumToRender={5}
                    windowSize={5}
                  />
                </View>
              )}

              <View style={styles.picksSectionContainer}>
                <View style={styles.picksHeaderRow}>
                  <Text style={styles.picksSectionTitle}>Fresh Picks Near You</Text>
                  <View style={styles.picksSectionLine} />
                </View>
                {popularRestaurants.length > 0 ? (
                  <FlatList
                    scrollEnabled={false}
                    data={popularRestaurants}
                    renderItem={renderRestaurantItem}
                    keyExtractor={(item) => `rest-${item.shop_id}`}
                    initialNumToRender={3}
                  />
                ) : (
                  <View style={{ height: 100, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>No fresh picks available</Text>
                  </View>
                )}
              </View>
              <View style={styles.bottomSpacer} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

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
  categoriesSection: { width: CONTENT_WIDTH, alignSelf: 'center', flexDirection: 'column', alignItems: 'flex-start', gap: 12, marginBottom: 30 },
  categoriesTitle: { fontFamily: 'SF Pro Display', fontStyle: 'normal', fontWeight: '700', fontSize: 20, lineHeight: 24, color: '#000000' },
  categoryItemContainer: { flexDirection: 'column', alignItems: 'center', width: 84 },
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
  bottomSpacer: { height: 100 },
});