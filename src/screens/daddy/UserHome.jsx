import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  FlatList,
  StyleSheet,
  Platform,
  RefreshControl,
  Dimensions,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Clock from './tabassets/Clock';
import { Shadow } from 'react-native-shadow-2';
import ShopSection from './builder/ShopSection';
import { useDispatch, useSelector } from 'react-redux';
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
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import { setLocation, setLocationId, setLocationName, setOrderOfferAmount } from '../../redux/reducers/auth';
import ServiceUnavailableScreen from './ServiceUnavailableScreen';
import NetInfo from '@react-native-community/netinfo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Skeleton from './Skeleton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Permissions, { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import StarIcon from './svg/StarIcon';
import commonStyles from '../../commonstyles/CommonStyles';
import { colors } from '../../config/theme';
import { indiviadualShop } from '../../redux/reducers/addressSlice';
import StatusBarManager from '../../components/StatusBarManager';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import CategoryCard from '../../components/CategoryCard';
import SubCategoryCard from '../../components/SubCategoryCard';

const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth / 6;
const STICKY_HEADER_SCROLL_DISTANCE = 120;

export default function UserHome({ navigation }) {
  const { categories, subCategories, banners, restaurants, activeCategoryIndex, loading, addressList, userAddress, serviceAvailable, homeRestaurnats } = useSelector(state => state.Dashboard);
  const { locationName } = useSelector(state => state.Auth);
  const { isNetworkConnected } = useSelector(state => state.address);
  
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(userAddress || "");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const authLocation = useSelector(state => state.Auth.location);
  const [mounted, setMounted] = useState(true);
  const isFocused = useIsFocused();
  const [initialNetLoad, setInitialNetLoad] = useState(false);
  const [serviceCheckFailed, setServiceCheckFailed] = useState(false);
  const [errorOccured, setErrorOccured] = useState(false);
  const networkStatusRef = useRef(isNetworkConnected);
  const numColumns = 6;
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [selectedCategoryName, setSelectedCategoryName] = useState('Food');

  // Add flag to track initial load
  const hasInitiallyLoaded = useRef(false);
  const scrollPositionRef = useRef(0);

  const stickyHeaderOpacity = scrollY.interpolate({
    inputRange: [0, STICKY_HEADER_SCROLL_DISTANCE - 20, STICKY_HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const stickyHeaderTranslateY = scrollY.interpolate({
    inputRange: [0, STICKY_HEADER_SCROLL_DISTANCE],
    outputRange: [-100, 0],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    networkStatusRef.current = isNetworkConnected;
  }, [isNetworkConnected]);

  const isLoading = (
    loading.addressCheck ||
    isLoadingLocation ||
    loading.categories ||
    loading.banners
  );

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      setErrorOccured(false);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBjxoAFhr00pjmZ95SEJYoUL98A6iX8hQ4`,
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      return 'Address not found';
    } catch (error) {
      console.error('Error getting address:', error);
      setErrorOccured(true);
      return 'Error getting address';
    }
  };

  const getCurrentLocation = useCallback(() => {
    setIsLoadingLocation(true);
    Geolocation.setRNConfiguration({
      enableHighAccuracy: false,
      timeout: 2000,
      maximumAge: 1000,
    });
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
          name: userAddress?.name || '',
          contact: userAddress?.contact || '',
        };
        if (!isNetworkConnected) return;
        dispatch(updateUserAddress(currentLocationAddress));
        setSelectedAddress(currentLocationAddress);
        setIsLoadingLocation(false);
      },
      error => {
        console.error('Error getting location:', error);
        setIsLoadingLocation(false);
        networkStatusRef.current && navigation.replace('ServicesAvailable', { permissionDenied: true });
      },
      {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 1000,
      }
    );
  }, [dispatch, userAddress]);

  const requestLocationPermission = useCallback(async () => {
    try {
      let permission;
      if (Platform.OS === 'ios') {
        permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
      } else if (Platform.OS === 'android') {
        permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      }
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

  // Only run on initial mount
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
    
    // Only run initialization once
    if (!hasInitiallyLoaded.current) {
      initializeLocation();
      hasInitiallyLoaded.current = true;
    }
  }, []); // Empty dependency array

  // Only fetch address list when screen focuses
  useFocusEffect(
    useCallback(() => {
      dispatch(getAddressList());
    }, [dispatch])
  );

  useEffect(() => {
    if (categories && categories.length > 0 && !selectedCategoryName) {
      const firstCategory = categories.find(cat => cat.id === activeCategoryIndex);
      if (firstCategory) {
        setSelectedCategoryName(firstCategory.category_name);
      }
    }
  }, [categories, activeCategoryIndex]);

  // MODIFIED - Only check service availability on initial load
  useFocusEffect(
    useCallback(() => {
      const checkOnFocus = async () => {
        if (authLocation && !hasInitiallyLoaded.current) {
          await checkServiceAvailability();
        }
      };
      checkOnFocus();
    }, [authLocation])
  );

  const handleSubCategories = category => {
    dispatch(setActiveCategoryIndex(category.id));
    dispatch(getSubCategories({ categoryId: category.id }));
    dispatch(getRestaurantsHome({ categoryId: category.id }));
    dispatch(setOrderOfferAmount(category.order_offer_amount));
    setSelectedCategoryName(category.category_name);
  };

  // Banner auto-scroll
  useFocusEffect(
    useCallback(() => {
      let intervalId;
      if (isFocused && banners?.length > 0) {
        intervalId = setInterval(() => {
          const newIndex = currentIndex < banners.length - 1 ? currentIndex + 1 : 0;
          flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
          setCurrentIndex(newIndex);
        }, 3000);
      }
      return () => {
        clearInterval(intervalId);
      };
    }, [currentIndex, banners, isFocused])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getCategoreis();
    setRefreshing(false);
    dispatch(setActiveCategoryIndex(1));
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    navigation.navigate('CategoriesScreen');
  };

  const checkServiceAvailability = async () => {
    const abortController = new AbortController();
    
    const checkAvailability = async () => {
      if (!authLocation || !mounted) return;
      
      try {
        setErrorOccured(false);
        const response = await dispatch(checkAddressExistence({
          latitude: authLocation.latitude,
          longitude: authLocation.longitude
        })).unwrap();
        
        if (mounted) {
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
        if (error.name !== 'AbortError' && mounted) {
          // Handle error
        }
      }
    };
    
    checkAvailability();
    
    return () => {
      abortController.abort();
      setMounted(false);
    };
  };

  useEffect(() => {
    if (authLocation && !hasInitiallyLoaded.current) {
      checkServiceAvailability();
    }
  }, [authLocation, serviceAvailable]);

  const calculateDeliveryTime = (distance) => {
    if (distance < 3) {
      return '15-20 mins';
    } else if (distance < 5) {
      return '20-30 mins';
    } else {
      return '30-45 mins';
    }
  };

  const handleBannerPress = async (banner) => {
    const resp = await dispatch(indiviadualShop({ shopId: banner?.shop_id }));
    if (!resp.payload.data[0] || resp.payload.data[0] <= 0) return;
    
    if (banner?.shop_id && banner?.shop_id !== 0) {
      navigation.navigate('BannerRestaurantScreen', {
        shopId: banner?.shop_id,
        shopItem: banner?.item_id,
        highlightItemId: 0
      });
    }
  };

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

  const popularRestaurants = homeRestaurnats && homeRestaurnats.filter(restaurant => Number(restaurant.shop_rating) >= 4.5);

  return (
    <View style={styles.mainContainer}>
      <StatusBar backgroundColor="#088B35" translucent barStyle="light-content" />
      {isNetworkConnected === null ? (
        <Skeleton />
      ) : !isNetworkConnected && !categories ? (
        <View style={styles.offlineContainer}>
          <MaterialCommunityIcons name="wifi-off" size={40} color={colors.gray} />
          <Text style={styles.offlineText}>No internet connection available</Text>
          <Text style={styles.offlineSubText}>Please check your network settings</Text>
        </View>
      ) : serviceCheckFailed && !isLoading ? (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={40} color={colors.red} />
          <Text style={styles.errorText}>Network Error</Text>
          <Text style={styles.errorSubText}>Failed to connect to the server</Text>
          <TouchableOpacity style={styles.retryButton} onPress={checkServiceAvailability}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : isLoading || initialNetLoad ? (
        <Skeleton />
      ) : serviceAvailable ? (
        <View style={styles.container}>
          {/* Sticky Search Bar */}
          <Animated.View
            style={[
              styles.stickySearchBar,
              { paddingTop: insets.top },
              { opacity: stickyHeaderOpacity },
              { transform: [{ translateY: stickyHeaderTranslateY }] }
            ]}
            pointerEvents={scrollY._value >= STICKY_HEADER_SCROLL_DISTANCE ? 'auto' : 'none'}
          >
            <LinearGradient
              colors={['#088B35', '#08B341', '#8AD9A4', '#8AD9A4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.stickyGradient}
            >
              <View style={styles.stickySearchContainer}>
                <Icon name="search" size={24} color="#999" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search"
                  placeholderTextColor="#999"
                  value={searchQuery}
                  onChangeText={handleSearch}
                  onFocus={() => navigation.navigate('CategoriesScreen')}
                />
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Main Scrollable Content */}
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { 
                useNativeDriver: true,
                listener: (event) => {
                  scrollPositionRef.current = event.nativeEvent.contentOffset.y;
                }
              }
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#088B35']}
              />
            }
          >
            <LinearGradient
              colors={['#088B35', '#08B341', '#8AD9A4', '#8AD9A4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.headerGradient}
            >
              {/* Location Section */}
              <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("SelectServiceFromLocation", { selectedAddress })}
                  style={styles.locationContainer}
                >
                  <Icon name="location-on" size={24} color="#fff" />
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.locationTitle}>
                        {locationName ? locationName : 'Select Location'}
                      </Text>
                      <Icon name="keyboard-arrow-down" size={20} color="#fff" style={{ marginLeft: 4 }} />
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Profile')}
                  style={styles.profileButton}
                >
                  <Image
                    source={require('../daddy/tabassets/dummy-profile.png')}
                    style={styles.profileAvatar}
                  />
                </TouchableOpacity>
              </View>

              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <Icon name="search" size={24} color="#999" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search"
                  placeholderTextColor="#999"
                  value={searchQuery}
                  onChangeText={handleSearch}
                  onFocus={() => navigation.navigate('CategoriesScreen')}
                />
              </View>

              {/* Banner Section */}
              <FlatList
                ref={flatListRef}
                data={banners}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 0, paddingBottom: 30 }}
                keyExtractor={(item, index) => `banner-${item.id || index}`}
                renderItem={({ item }) => (
                  // <TouchableOpacity onPress={() => handleBannerPress(item)} style={styles.bannerContainer}>
                  <TouchableOpacity onPress={() => {}} style={styles.bannerContainer}>
                    <Image
                      source={{ uri: item.banner_image }}
                      style={styles.bannerImage}
                      resizeMode="stretch"
                    />
                  </TouchableOpacity>
                )}
              />
            </LinearGradient>

            {/* Content area with curved top edge */}
            <View style={styles.contentContainer}>
              {/* Category Header */}
              <View style={styles.categoryHeaderContainer}>
                <Text style={styles.categoryHeaderTitle}>Category</Text>
                <View style={styles.categoryHeaderLine} />
              </View>

              {/* Categories */}
              {categories && (
                <FlatList
                  data={categories}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => `category-${item.id || index}`}
                  contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 15 }}
                  renderItem={({ item }) => (
                    <CategoryCard
                      title={item.category_name}
                      imageSource={{ uri: item.category_image }}
                      isSelected={item.id === activeCategoryIndex}
                      onPress={() => handleSubCategories(item)}
                    />
                  )}
                />
              )}

              {/* Subcategory Header */}
              <View style={styles.categoryHeaderContainer}>
                <Text style={styles.categoryHeaderTitle}>{selectedCategoryName} Items</Text>
                <View style={styles.categoryHeaderLine} />
              </View>

              {/* SubCategories */}
              {subCategories && (
                <View style={styles.subCategoriesContainer}>
                  <FlatList
                    data={subCategories}
                    numColumns={4}
                    scrollEnabled={false}
                    keyExtractor={(item, index) => `subcategory-${item.id || index}`}
                    columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 15 }}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10 }}
                    renderItem={({ item }) => (
                      <SubCategoryCard
                        title={item.sub_category_name}
                        imageSource={{ uri: item.sub_category_image }}
                        onPress={() => {
                          dispatch(setsubCategory(item));
                          navigation.navigate('CategorieItems');
                        }}
                      />
                    )}
                    ListEmptyComponent={() => (
                      <View style={{ width: responsiveWidth(100), height: responsiveHeight(5), alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 14, fontWeight: '400', color: '#656565' }}>No items found</Text>
                      </View>
                    )}
                  />
                </View>
              )}

              {/* Popular Restaurants/Shops */}
              <View style={[commonStyles.row, { paddingHorizontal: 16, marginTop: 3 }]}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#2B2B2B' }}>
                  Popular {activeCategoryIndex === 1 ? "Restaurants" : "Shops"}
                </Text>
              </View>

              <FlatList
                data={popularRestaurants}
                keyExtractor={(item, index) => `restaurant-${item.shop_id || item.id || index}`}
                contentContainerStyle={{ padding: 10, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                ListEmptyComponent={() => (
                  <View style={{ alignItems: 'center', justifyContent: 'center', height: responsiveHeight(10), width: responsiveWidth(100) }}>
                    <Text style={{ fontSize: 14, fontWeight: '400', color: '#656565' }}>
                      No popular {activeCategoryIndex === 1 ? "restaurants" : "shops"} available
                    </Text>
                  </View>
                )}
                renderItem={({ item }) => {
                  const isUnavailable = item.shop_active_status === "1";
                  const distance = item.distance;
                  return (
                    <TouchableOpacity
                      style={[styles.restaurantCard, isUnavailable && styles.unavailableCard]}
                      onPress={() => {
                        if (!isUnavailable) {
                          navigation.navigate('RestaurantScreen', {
                            shopId: item.shop_id,
                            shopItem: item.shop_items_tb_nm,
                            item,
                          });
                        }
                      }}
                    >
                      <View style={styles.restaurantContent}>
                        <View style={styles.restaurantImageContainer}>
                          <Image source={{ uri: item?.shop_image }} style={styles.restaurantImage} />
                          {isUnavailable && (
                            <View style={styles.unavailableOverlay}>
                              <Text style={[styles.unavailableText, { color: 'red' }]}>Currently Unavailable</Text>
                            </View>
                          )}
                        </View>
                        <View style={styles.restaurantTextContainer}>
                          <Text style={styles.restaurantName}>{item.shop_name}</Text>
                          <View style={styles.ratingRow}>
                            <StarIcon />
                            <Text style={styles.ratingText}>{item.shop_rating}</Text>
                            <Text style={styles.dot}>•</Text>
                            <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                              <Clock />
                              <Text style={{ fontSize: 11, fontWeight: '400' }}>
                                {calculateDeliveryTime(distance)}
                              </Text>
                            </View>
                          </View>
                          <Text style={styles.addressText}>{item.shop_address || 'Tilak Road • 3.0 km'}</Text>
                          {item.special_offer_name && (
                            <View style={styles.offerTag}>
                              <Text style={styles.offerText}>{item.special_offer_name}</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </Animated.ScrollView>
        </View>
      ) : serviceAvailable === false ? (
        <ServiceUnavailableScreen />
      ) : !categories && !errorOccured ? (
        <Skeleton />
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Something went wrong</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              checkServiceAvailability();
              getCategoreis();
            }}
          >
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: Platform.OS === 'ios' ? 85 : 60,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  stickySearchBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: "#088B35"
  },
  stickyGradient: {
    paddingVertical: 8,
  },
  stickySearchContainer: {
    marginHorizontal: responsiveWidth(4),
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerGradient: {
    paddingBottom: 0,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(4),
    paddingBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  locationTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileAvatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  searchContainer: {
    marginHorizontal: responsiveWidth(4),
    marginTop: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    fontSize: 15,
    fontWeight: '400',
    color: '#000',
    flex: 1,
    marginLeft: 10,
  },
  bannerContainer: {
    width: responsiveWidth(85),
    height: 120,
    marginHorizontal: responsiveWidth(4),
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -20,
    paddingTop: 15,
  },
  categoryHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  categoryHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
  categoryHeaderLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  subCategoriesContainer: {
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  restaurantCard: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    padding: 10,
  },
  restaurantContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'relative',
  },
  restaurantImageContainer: {
    width: 90,
    height: 90,
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 12,
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  restaurantTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
    color: '#000',
  },
  dot: {
    marginHorizontal: 4,
    fontSize: 12,
    color: '#888',
  },
  addressText: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  offerTag: {
    backgroundColor: '#DAF4E3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  offerText: {
    fontSize: 10,
    color: '#08B341',
    fontWeight: '600',
  },
  unavailableCard: {
    opacity: 0.6,
    backgroundColor: '#f0f0f0',
  },
  unavailableOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderRadius: 15,
  },
  unavailableText: {
    color: '#D9534F',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  offlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  offlineText: {
    fontSize: 18,
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  offlineSubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'grey',
    marginBottom: 20,
  },
  errorSubText: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#065E2C',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
