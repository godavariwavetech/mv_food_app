import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Modal, KeyboardAvoidingView, Platform, RefreshControl, SafeAreaView } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails, getOrders, addToCart, removeFromCart, setCartRestaurant } from '../../redux/reducers/daddy';
import { useFocusEffect } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { globalSearch } from '../../redux/reducers/addressSlice';
import commonStyles from '../../commonstyles/CommonStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StatusBarManager from '../../components/StatusBarManager';

const ReorderScreen = ({ navigation }) => {
  const [expandedRestaurants, setExpandedRestaurants] = useState({});
  const [orderItems, setOrderItems] = useState({});
  const [loading, setLoading] = useState({});
  const { orders, cartItems, cartRestaurant } = useSelector((state) => state.Dashboard);
  const dispatch = useDispatch();
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const timeoutRef = useRef();
  const { globalSearchResults } = useSelector(state => state.address);
  const [initialLoading, setInitialLoading] = useState(true);

  const getOrdersData = async () => {
    try {
      setInitialLoading(true);
      await dispatch(getOrders({ orderId: 0 }));
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setInitialLoading(false);
    }
  }

  useEffect(() => {
    getOrdersData();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    clearTimeout(timeoutRef.current);
    if (query.trim()) {
      timeoutRef.current = setTimeout(() => {
        dispatch(globalSearch({ searchText: query }));
      }, 500);
    }
  };

  const filteredOrders = orders?.filter(order =>
    globalSearchResults?.some(result => result.shop_name === order.shop_name) ||
    order.shop_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(getOrders({ orderId: 0 }));
    setRefreshing(false);
  };

  const STATUS_MAP = {
    0: 'Order Placed', 1: 'Order Accepted', 2: 'Order On The Way',
    3: 'Order Completed', 4: 'Order Cancelled by You',
    5: 'Order Rejected by Restaurant', 6: 'Order Not Received',
    7: 'Waiting for Payment', 8: 'Delivery Partner Assigned',
  };

  const getStatusColor = (status) => {
    const colorMap = {
      0: '#C3A710', 1: '#065E2C', 2: '#065E2C', 3: '#065E2C',
      4: '#FF4B4B', 5: '#FF4B4B', 6: '#FF4B4B', 7: '#C3A710', 8: '#065E2C',
    };
    return colorMap[status] || '#666';
  };

  const renderRestaurantCard = useCallback(({ item }) => {
    return (
      <View style={styles.card}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={styles.date}>{item.order_date}</Text>
          <Text style={[styles.statusText, { color: getStatusColor(item.order_status) }]}>
            {STATUS_MAP[item.order_status]}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 7 }}>
          <Image source={{ uri: item.shop_image }} style={{ width: 72, height: 72, borderRadius: 8 }} />
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>{item.shop_name}</Text>
            <Text style={[styles.details, { fontSize: 10 }]}>{item?.order_id} / {item?.id}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Text style={styles.details}>₹ {item.grand_total}</Text>
            </View>
            <Text style={styles.details}>{item.location_name}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.viewDetailsButton}
          onPress={() => navigation.navigate('OrderDetails', { orderDetails: item })}
        >
          <Text style={styles.viewDetailsButtonText}>View Order Details</Text>
        </TouchableOpacity>
      </View>
    );
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      setExpandedRestaurants({});
      setOrderItems({});
      getOrdersData();
    }, [])
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBarManager screenName="default" />
      <SafeAreaView style={{ backgroundColor: '#fff' }}>
        <View style={styles.figmaHeaderContainer}>
          <View style={styles.titleWrapper}>
            <Text style={styles.reOrderTitle}>Re-Order</Text>
          </View>
          
          <View style={styles.searchWrapper}>
            <View style={styles.searchBarContainer}>
              <TextInput
                style={styles.searchPlaceholderText}
                placeholder="Search Orders"
                placeholderTextColor="#666666"
                value={searchQuery}
                onChangeText={handleSearch}
              />
              <Icon name="search" size={18} color="#7A7A7A" />
            </View>
          </View>
        </View>
      </SafeAreaView>

      {initialLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={commonStyles.btn2Color} />
        </View>
      ) : filteredOrders?.length > 0 ? (
        <FlatList
          data={filteredOrders}
          renderItem={renderRestaurantCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      ) : (
        <View style={styles.emptyListContainer}>
          <Text style={styles.emptyListText}>No orders found.</Text>
        </View>
      )}

      <Modal visible={showReplaceModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Replace Cart Items?</Text>
            <Text style={styles.modalText}>
              Your cart contains items from a different restaurant. Replace them?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowReplaceModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={() => {}}>
                <Text style={styles.confirmButtonText}>Replace</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  figmaHeaderContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 15,
  },
  titleWrapper: {
    marginTop: 20,
    height: 21,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  reOrderTitle: {
    fontFamily: 'Rubik',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 21,
    color: '#2D2D2D',
  },
  searchWrapper: {
    marginTop: 21,
    width: '100%',
    height: 56,
  },
  searchBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    width: '100%',
    height: 56,
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#A3A3A3',
    borderRadius: 15,
  },
  searchPlaceholderText: {
    flex: 1,
    fontFamily: 'Rubik',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 19,
    color: '#666666',
    padding: 0,
  },
  listContainer: {
    paddingBottom: responsiveHeight(5)
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A3A3A3',
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Gilroy-Bold',
  },
  date: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Rubik',
    fontWeight: '500',
  },
  restaurantInfo: {
    flex: 1,
    marginLeft: 12,
    gap: 4,
  },
  details: {
    fontSize: 12,
    color: '#050505',
    fontFamily: 'SF Pro Display',
    fontWeight: '500'
  },
  viewDetailsButton: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  viewDetailsButtonText: {
    color: '#065E2C',
    fontSize: 14,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListText: {
    fontSize: 16,
    color: '#666',
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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
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
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ReorderScreen;