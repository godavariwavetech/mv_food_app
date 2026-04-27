import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Animated,
  PanResponder,
  ActivityIndicator,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HeaderPick2 from './tabassets/HeaderPick2';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, getItemsList, removeFromCart, setCartRestaurant } from '../../redux/reducers/daddy';
import { setRestaurnatDetails } from '../../redux/reducers/auth';
import { globalSearch } from '../../redux/reducers/addressSlice';
import StarRating from '../../components/StarRating';
import commonStyles from '../../commonstyles/CommonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBarManager from '../../components/StatusBarManager';

// =====================================
// FIGMA ITEM CARD COMPONENT
// =====================================
const MenuItemCard = ({ item, cartItem, onAdd, onIncrement, onDecrement }) => {
  // Extract item data
  const itemName = item?.item_name || 'Veg Samosa';
  const itemPrice = item?.selling_price || '99';
  const isVeg = item?.filter_one === 'Veg';
  
  // Defaulting rating/reviews to match Figma if API doesn't provide them
  const rating = item?.rating || '4.7';
  const reviewCount = item?.review_count || '547';
  
  const imageUrl = item?.item_image || 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=300&q=80';
  
  const quantity = cartItem?.quantity || 0;
  const isUnavailable = item?.active_status === "1";

  return (
    <View style={[styles.cardContainer, isUnavailable && styles.unavailableCard]}>
      {/* Overlay when unavailable */}
      {isUnavailable && (
        <View style={styles.unavailableOverlay}>
          <Text style={styles.unavailableText}>Unavailable</Text>
        </View>
      )}

      {/* Image Block (159x136) */}
      <Image 
        source={{ uri: imageUrl }} 
        style={styles.itemImage} 
        resizeMode="cover" 
      />

      {/* Content Area */}
      <View style={styles.contentArea}>
        
        {/* Title & Veg/Non-Veg Icon */}
        <View style={styles.titleRow}>
          <Text style={styles.itemTitle} numberOfLines={1}>{itemName}</Text>
          
          <View style={[styles.vegIconBorder, { borderColor: isVeg ? '#0EAF50' : '#CD2A2A' }]}>
            <View style={[styles.vegIconDot, { backgroundColor: isVeg ? '#0EAF50' : '#CD2A2A' }]} />
          </View>
        </View>

        {/* Rating Row */}
        <View style={styles.ratingRow}>
          <AntDesign name="star" size={14} color="#D0A50F" />
          <Text style={styles.ratingScore}>{rating}</Text>
          <Text style={styles.reviewCount}>( {reviewCount} )</Text>
        </View>

        {/* Bottom Row: Price & Cart Button */}
        <View style={styles.bottomRow}>
          
          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceSymbol}>₹</Text>
            <Text style={styles.priceText}>{itemPrice}</Text>
          </View>

          {/* Cart Controls (67x25 Stepper) */}
          {quantity > 0 ? (
            <View style={styles.stepperContainer}>
              <TouchableOpacity onPress={onDecrement} style={styles.stepperBtn} activeOpacity={0.7}>
                <Text style={styles.stepperBtnText}>-</Text>
              </TouchableOpacity>
              
              <Text style={styles.stepperCount}>{quantity}</Text>
              
              <TouchableOpacity onPress={onIncrement} style={styles.stepperBtn} activeOpacity={0.7}>
                <Text style={styles.stepperBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={onAdd} style={styles.addButton} activeOpacity={0.7} disabled={isUnavailable}>
              <Text style={styles.addButtonText}>ADD</Text>
            </TouchableOpacity>
          )}
          
        </View>
      </View>
    </View>
  );
};


const RestaurantScreen = ({ navigation, route }) => {
  const [translateY] = useState(new Animated.Value(100));
  const dispatch = useDispatch();
  const { restaurantItems, cartItems, cartRestaurant } = useSelector(state => state.Dashboard)
  const { globalSearchResults } = useSelector(state => state.address);
  const [filterType, setFilterType] = useState("All");
  const [filteredData, setFilterData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState(route.params?.selectedFilter ? [route.params.selectedFilter] : ['All']);
  const pan = useRef(new Animated.ValueXY({ x: responsiveWidth(100) - 88, y: responsiveHeight(100) - 138 })).current;
  const [draggableMenuVisible, setDraggableMenuVisible] = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const timeoutRef = useRef();
  const [highlightedItemId, setHighlightedItemId] = useState(null);
  const scaleAnims = useRef(new Map()).current;
  const [renderedItems, setRenderedItems] = useState(new Set());
  const [initialFilter, setSetInitialFilter] = useState(true);
  const flatListRef = useRef(null);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [activeSubCategoryFilter, setActiveSubCategoryFilter] = useState(null);

  const allFilters = [
    { filter_name: 'All', id: 'all', type: 'general' },
    ...[...new Set((restaurantItems || []).map(item => item.filter_one).filter(Boolean))]
      .map(f => ({ filter_name: f, id: f.toLowerCase().replace(/\s+/g, '-'), type: 'filter_one' })),
    ...[...new Set((restaurantItems || []).map(item => item.sub_category_name).filter(Boolean))]
      .map(sc => ({ filter_name: sc, id: sc.toLowerCase().replace(/\s+/g, '-'), type: 'subcategory' })),
  ];

  const shopId = route.params
  console.log("shopId", shopId)

  const getItems = async () => {
    try {
      setIsLoading(true);
      const response = await dispatch(getItemsList({ shopId: route.params.shopId, shopItem: route.params.shopItem }))
      setFilterData(response.payload.data);
      route?.params?.selectedFilter && setSetInitialFilter(!initialFilter)
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query);
    clearTimeout(timeoutRef.current);
    if (query.trim()) {
      timeoutRef.current = setTimeout(() => {
        dispatch(globalSearch({ searchText: query }));
      }, 500);
    }
  };

  useEffect(() => {
    if (!restaurantItems) return;

    const filtered = restaurantItems.filter(item => {
      const matchesSearch =
        item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.item_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        globalSearchResults?.some(result => result.item_name === item.item_name);

      const matchesFilter =
        selectedFilter === "All" ||
        item.filter_one === selectedFilter ||
        item.category_name === selectedFilter;

      const matchesSubCategory =
        !activeSubCategoryFilter || activeSubCategoryFilter === item.sub_category_name;

      return matchesSearch && matchesFilter && matchesSubCategory;
    });

    setFilterData(filtered);
  }, [searchQuery, selectedFilter, activeSubCategoryFilter, restaurantItems, initialFilter, globalSearchResults]);

  useEffect(() => {
    route.params && getItems();
  }, [route.params])

  useEffect(() => {
    if (route.params?.highlightItemId) {
      const itemId = route.params.highlightItemId;
      setHighlightedItemId(itemId);

      if (!scaleAnims.has(itemId)) {
        scaleAnims.set(itemId, new Animated.Value(1));
      }

      const timer = setTimeout(() => {
        setHighlightedItemId(null);
        setRenderedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
        scaleAnims.get(itemId)?.setValue(1);
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [route.params]);

  const calculateDeliveryTime = (distance) => {
    if (distance < 3) {
      return '15-20 mins';
    } else if (distance < 5) {
      return '20-30 mins';
    } else {
      return '30-45 mins';
    }
  };

  const handleAddToCart = (item) => {
    if (cartItems.length === 0 || cartRestaurant == route.params.shopId) {
      addItem(item);
      dispatch(setRestaurnatDetails(route.params.item))
    } else {
      setSelectedItem(item);
      setShowReplaceModal(true);
    }
  };

  const handleReplaceCart = () => {
    dispatch(setCartRestaurant(route.params.shopId));
    dispatch(setRestaurnatDetails(route.params.item))
    dispatch(addToCart(selectedItem));
    setShowReplaceModal(false);
    setSelectedItem(null);
  };

  const handleCancelReplace = () => {
    setShowReplaceModal(false);
    setSelectedItem(null);
  };

  const startAnim = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }
  
  const stopAnim = () => {
    Animated.timing(translateY, {
      toValue: 100,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }

  const addItem = (item) => {
    dispatch(addToCart(item))
  }

  const decreaseItem = (item) => {
    dispatch(removeFromCart(item))
  }

  useEffect(() => {
    Object.keys(cartItems).length > 0 ? startAnim() : stopAnim()
  }, [Object.keys(cartItems).length])

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([
        null,
        { dx: pan.x, dy: pan.y }
      ], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      }
    })
  ).current;

  const handleDraggableMenuAction = (subCategory) => {
    if (subCategory.sub_category_name === 'All') {
      setFilterType('All');
      setFilterData(restaurantItems);
    } else {
      setFilterType(subCategory.sub_category_name);
      const filteredItems = restaurantItems.filter(item =>
        item.sub_category_name === subCategory.sub_category_name
      );
      setFilterData(filteredItems);
    }
    setDraggableMenuVisible(false);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleFilter = (item) => {
    if (item.type === "subcategory") {
      if (activeSubCategoryFilter === item.filter_name) {
        setActiveSubCategoryFilter(null); 
      } else {
        setActiveSubCategoryFilter(item.filter_name);
      }
    } else {
      if (item.id === "all") {
        setSelectedFilter("All");
      } else {
        setSelectedFilter(item.filter_name);
      }
    }
  };

  const renderFilters = () => (
    <View>
      {/* Veg/Non-Veg Filters */}
      <FlatList
        data={allFilters.filter(f => f.type === 'filter_one' || f.id === 'all')}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `${item.id}_${item.filter_name}_${index}`}
        contentContainerStyle={styles.filterList}
        renderItem={({ item }) => {
          const isActive = selectedFilter === item.filter_name;
          return (
            <TouchableOpacity
              onPress={() => handleFilter(item)}
              style={[
                styles.filterButton,
                {
                  borderColor: isActive ? "#0EAF50" : '#8F8F8F',
                  backgroundColor: isActive ? "#0EAF50" : '#fff',
                }
              ]}
            >
              {item.filter_name !== "All" && (
                <HeaderPick2
                  color={
                    item.filter_name === "Veg"
                      ? (isActive ? "#fff" : "#0EAF50")
                      : "#CD2A2A"
                  }
                />
              )}
              <Text style={[styles.filterText, { color: isActive ? "#fff" : '#313131' }]}>
                {item.filter_name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Subcategory Filters */}
      <FlatList
        data={allFilters.filter(f => f.type === 'subcategory')}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `${item.id}_${item.filter_name}_${index}`}
        contentContainerStyle={[styles.filterList, { marginTop: 8 }]}
        renderItem={({ item }) => {
          const isActive = activeSubCategoryFilter === item.filter_name;
          return (
            <TouchableOpacity
              onPress={() => handleFilter(item)}
              style={[
                styles.filterButton,
                {
                  borderColor: isActive ? "#0EAF50" : '#8F8F8F',
                  backgroundColor: isActive ? "#0EAF50" : '#fff',
                }
              ]}
            >
              <Text style={[styles.filterText, { color: isActive ? "#fff" : '#313131' }]}>
                {item.filter_name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );

  const renderItem = ({ item }) => {
    const isHighlighted = item.id === highlightedItemId;
    const scaleAnim = scaleAnims.get(item.id) || new Animated.Value(1);
    const cartItem = cartItems.find(cartObj => cartObj.id === item.id);

    return (
      <Animated.View
        style={[
          styles.itemWrapper,
          isHighlighted && styles.highlightedItem,
          { transform: [{ scale: scaleAnim }] }
        ]}
        onLayout={() => {
          if (isHighlighted && !renderedItems.has(item.id)) {
            setRenderedItems(prev => new Set(prev).add(item.id));
            scaleAnim.stopAnimation();
            requestAnimationFrame(() => {
              Animated.sequence([
                Animated.spring(scaleAnim, {
                  toValue: 1.1,
                  stiffness: 100,
                  damping: 7,
                  useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                  toValue: 1,
                  stiffness: 200,
                  damping: 10,
                  useNativeDriver: true,
                }),
              ]).start();
            });
          }
        }}
      >
        <MenuItemCard 
          item={item}
          cartItem={cartItem}
          onAdd={() => handleAddToCart(item)}
          onIncrement={() => handleAddToCart(item)}
          onDecrement={() => decreaseItem(item)}
        />
      </Animated.View>
    );
  };

  useEffect(() => {
    return () => {
      scaleAnims.forEach(anim => anim.stopAnimation());
    };
  }, []);

  const cartCalculations = useMemo(() => {
    const itemCount = cartItems?.reduce((sum, item) => sum + Number(item.quantity), 0) || 0;
    const totalPrice = cartItems?.reduce((sum, item) => sum + (Number(item.selling_price) * Number(item.quantity)), 0) || 0;

    return {
      itemCount,
      totalPrice: totalPrice.toFixed(2),
      hasItems: itemCount > 0
    };
  }, [cartItems]);

  return (
    <View style={styles.container}>
      <StatusBarManager screenName="restaurant" />
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
        nestedScrollEnabled={true}>
        <ImageBackground
          source={{uri: route.params?.item?.shop_image}}
          style={styles.imageBackground}>
          <View style={styles.imageOverlay}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <MaterialCommunityIcons
                  name="keyboard-backspace"
                  size={30}
                  color="#fff"
                  style={styles.backIcon}
                />
              </TouchableOpacity>
              <View style={styles.header}>
                <Text style={styles.title}>
                  {route.params?.item?.shop_name}
                </Text>
                <View style={styles.headerRow}>
                  <Text style={styles.subtitle}>
                    {calculateDeliveryTime(
                      route.params?.item?.distance.toFixed(1),
                    )}{' '}
                    | {route.params?.item?.distance.toFixed(1)} km
                  </Text>
                  {route?.params?.item?.minimum_order && (
                    <View style={styles.minimumOrderGradientContainer}>
                      <View style={styles.minimumOrderGradient}>
                        <MaterialCommunityIcons 
                          name="cart-outline" 
                          size={11} 
                          color="#0EAF50" 
                        />
                        <Text style={styles.minimumOrderGradientText}>
                          Min Order ₹{route?.params?.item?.minimum_order}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
                <View
                  style={{
                    backgroundColor: 'rgba(238, 235, 204, 0.20)',
                    padding: 4,
                    borderRadius: 4,
                    width: 95,
                  }}>
                  <StarRating
                    rating={route.params?.item?.shop_rating}
                    width={15}
                    gap={4}
                  />
                </View>
              </View>
              <View style={styles.headerIcons}>
                {/* Reserved for header icons like Favorites/Share */}
              </View>
            </View>

            <View style={styles.searchContainer}>
              <View style={styles.inputWrapper}>
                <MaterialIcons
                  name="search"
                  size={24}
                  color="#666"
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search food items..."
                  value={searchQuery}
                  onChangeText={handleSearch}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => setSearchQuery('')}>
                    <MaterialIcons name="close" size={20} color="#666" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </ImageBackground>

        <View>{renderFilters()}</View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={commonStyles.btn2Color} />
          </View>
        ) : filteredData?.length === 0 ? (
          <View style={styles.noItemsContainer}>
            <MaterialCommunityIcons name="food-off" size={50} color="#A3A3A3" />
            <Text style={styles.noItemsText}>No items found</Text>
            <Text style={styles.noItemsSubText}>
              We couldn't find any items matching your search
            </Text>
          </View>
        ) : (
          <View style={styles.itemListContainer}>
            <FlatList
              ref={flatListRef}
              data={filteredData}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
              keyExtractor={(item, index) => `${item.id}_${index}`}
              style={styles.itemList}
              contentContainerStyle={{
                paddingHorizontal: 16, // Adjusted for perfect grid balance
                paddingBottom: Platform.OS === 'ios' ? 160 : 150,
              }}
              renderItem={renderItem}
              scrollEnabled={false}
              nestedScrollEnabled={true}
              onScrollToIndexFailed={({index, averageItemLength}) => {
                flatListRef.current?.scrollToOffset({
                  offset: index * averageItemLength,
                  animated: true,
                });
                setTimeout(() => {
                  flatListRef.current?.scrollToIndex({index, animated: true});
                }, 100);
              }}
            />
          </View>
        )}
      </ScrollView>

      {cartCalculations.hasItems && (
        <Animated.View style={styles.cartSummary(translateY)}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('CartScreen', {isFromRestaurant: true})
            }
            style={styles.cartSummaryButton}
            activeOpacity={0.8}>
            <View style={styles.cartSummaryContent}>
              <View style={styles.cartSummaryLeft}>
                <View style={styles.cartItemCountContainer}>
                  <Text style={styles.cartItemCount}>
                    {cartCalculations.itemCount}
                  </Text>
                </View>
                <View style={styles.cartTextContainer}>
                  <Text style={styles.cartSummaryText}>Items in cart</Text>
                  <Text style={styles.cartSummarySubText}>
                    ₹{cartCalculations.totalPrice}
                  </Text>
                </View>
              </View>
              <View style={styles.cartSummaryRight}>
                <Text style={styles.viewCartText}>View Cart</Text>
                <AntDesign name="right" color="#fff" size={16} />
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}

      <Modal
        visible={showReplaceModal}
        transparent
        animationType="fade"
        onRequestClose={handleCancelReplace}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Replace Cart Items?</Text>
            <Text style={styles.modalText}>
              Your cart contains items from a different restaurant. Would you
              like to replace them with items from{' '}
              {route.params?.item?.shop_name}?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancelReplace}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleReplaceCart}>
                <Text style={styles.confirmButtonText}>Replace</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: {
    flex: 1,
  },
  itemListContainer: {
    flex: 1,
    minHeight: 500
  },
  imageBackground: { width: responsiveWidth(100), height: responsiveHeight(33), },
  imageOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: responsiveHeight(1),
  },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 4 },
  backIcon: { marginTop: 5 },
  header: { width: responsiveWidth(80), paddingVertical: 10, paddingHorizontal: responsiveWidth(0.5), alignSelf: 'flex-start', gap: 8 },
  title: { fontSize: responsiveFontSize(2.2), fontWeight: '700', color: '#fff', width: responsiveWidth(35) },
  subtitle: { fontSize: 14, color: '#F5F5F5', fontWeight: '500' },
  headerIcons: { flexDirection: 'row', gap: 5, alignItems: 'center', marginTop: 10 },
  iconButton: { width: 18, height: 18, backgroundColor: '#fff', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 5,
    marginVertical: 10,
    height: 48,
    marginHorizontal: responsiveWidth(5),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    flex: 1,
  },
  searchIcon: {
    position: 'absolute',
    left: 15,
    zIndex: 1,
  },
  clearButton: {
    position: 'absolute',
    right: 15,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    padding: 5,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingLeft: 45,
    paddingRight: 40,
    fontSize: 16,
    color: '#000',
  },
  filterList: { marginVertical: 5, paddingHorizontal: 10 },
  filterButton: {
    padding: 5,
    borderWidth: 1,
    borderRadius: 6,
    marginHorizontal: 3,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  filterText: { fontSize: 16, fontWeight: '500' },
  
  // FLATLIST GRID CONFIG
itemList: { flex: 1, marginTop: 10 },
  columnWrapper: { justifyContent: 'space-between' },
  itemWrapper: { 
    flex: 1, 
    maxWidth: '48%', // <-- THIS IS THE FIX: Prevents a single item from stretching across the whole screen
    alignItems: 'center' 
  },
  highlightedItem: {
    backgroundColor: 'rgba(6, 94, 44, 0.1)',
    borderRadius: 12,
  },

  // =====================================
  // FIGMA ITEM CARD UI
  // =====================================
  cardContainer: {
    width: responsiveWidth(44),
    height: 247,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3, 
    marginBottom: 16,
  },
  unavailableCard: {
    opacity: 0.6,
  },
  unavailableOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  unavailableText: {
    color: '#CD2A2A',
    fontWeight: '700',
    fontSize: 14,
    backgroundColor: '#FFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden'
  },
  itemImage: {
    width: responsiveWidth(39),
    height: 136,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  contentArea: {
    width: responsiveWidth(39),
    marginTop: 12, 
    flexDirection: 'column',
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  itemTitle: {
    fontFamily: 'Rubik-Medium',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 17,
    color: '#000000',
    flex: 1,
    marginRight: 8,
  },
  vegIconBorder: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vegIconDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingScore: {
    fontFamily: 'Rubik-Bold',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 17,
    color: '#3D3D3D',
  },
  reviewCount: {
    fontFamily: 'Rubik-Regular',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 14,
    color: '#3D3D3D',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 2, 
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  priceSymbol: {
    fontFamily: 'Rubik-Bold',
    fontWeight: '700',
    fontSize: 14,
    color: '#FC6011',
    marginTop: 2,
  },
  priceText: {
    fontFamily: 'Rubik-Bold',
    fontWeight: '700',
    fontSize: 17,
    lineHeight: 20,
    color: '#FC6011',
  },
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 67,
    height: 25,
    backgroundColor: '#FFF5EB',
    borderWidth: 1,
    borderColor: '#FC6011',
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  stepperBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  stepperBtnText: {
    fontFamily: 'Rubik-SemiBold',
    fontWeight: '600',
    fontSize: 14,
    color: '#FC6011',
  },
  stepperCount: {
    fontFamily: 'Rubik-SemiBold',
    fontWeight: '600',
    fontSize: 14,
    color: '#FC6011',
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 67,
    height: 25,
    backgroundColor: '#FFF5EB',
    borderWidth: 1,
    borderColor: '#FC6011',
    borderRadius: 6,
  },
  addButtonText: {
    fontFamily: 'Rubik-SemiBold',
    fontWeight: '600',
    fontSize: 14,
    color: '#FC6011',
  },

  // =====================================
  // CART / MODAL / ETC STYLES
  // =====================================
  cartSummary: (translateY) => ({
    position: "absolute",
    width: "100%",
    height: 65,
    bottom: Platform.OS === 'ios' ? 60 : 50, 
    backgroundColor: "#07A13B",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginHorizontal: 16,
    width: "92%",
    alignSelf: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    zIndex: 10,
    transform: [{ translateY: translateY }],
  }),
  cartSummaryButton: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartSummaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  cartSummaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cartItemCountContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  cartItemCount: {
    fontSize: 16,
    fontWeight: '700',
    color: commonStyles.btn2Color,
  },
  cartTextContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cartSummaryText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#fff',
  },
  cartSummarySubText: {
    fontSize: 11,
    fontWeight: '400',
    color: '#fff',
  },
  cartSummaryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  viewCartText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  noItemsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
    padding: 20,
  },
  noItemsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#313131',
    marginTop: 15,
    marginBottom: 5,
  },
  noItemsSubText: {
    fontSize: 14,
    color: '#A3A3A3',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  confirmButton: {
    backgroundColor: commonStyles.btn2Color,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  minimumOrderGradientContainer: {
    marginLeft: 6,
    borderRadius: 10,
    overflow: 'hidden',
  },
  minimumOrderGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
    borderWidth: 1,
    borderColor: '#A5D6A7',
  },
  minimumOrderGradientText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0EAF50',
    letterSpacing: 0.2,
  },
});

export default RestaurantScreen;