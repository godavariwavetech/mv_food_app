import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  SafeAreaView,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HeaderPick2 from './tabassets/HeaderPick2';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../../redux/reducers/daddy';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import commonStyles from '../../commonstyles/CommonStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StatusBarManager from '../../components/StatusBarManager';
import { globalSearch } from '../../redux/reducers/addressSlice';

const CartScreen = ({ navigation, route }) => {
  const { cartItems, totalPrice } = useSelector(state => state.Dashboard);
  const { customerId, token } = useSelector(state => state.Auth);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const timeoutRef = useRef();
  const { globalSearchResults } = useSelector(state => state.address);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    clearTimeout(timeoutRef.current);
    if (query.trim()) {
      timeoutRef.current = setTimeout(() => {
        dispatch(globalSearch({ searchText: query }));
      }, 500);
    }
  };

  const filteredCartItems = cartItems.filter(item =>
    globalSearchResults?.some(result => result.item_name === item.item_name) ||
    item.item_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (item) => dispatch(addToCart(item));
  const handleRemoveFromCart = (item) => dispatch(removeFromCart(item));

  const handleCheckoutPress = () => {
    if (!token) {
      setShowLoginModal(true);
    } else {
      navigation.navigate('AddressList', { isFromCart: true });
    }
  };

  const renderCartItem = ({ item }) => {
    const eachPrice = Number(item.selling_price) * Number(item.quantity);
    return (
      <View>
        <View style={styles.cartItem}>
          <Image source={{ uri: item.item_image }} style={styles.foodImage} />
          <View style={styles.itemDetails}>
            <HeaderPick2 />
            <Text style={styles.foodName}>{item.item_name}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.actualPrice}>₹{item.actual_price}</Text>
              <Text style={styles.sellingPrice}>₹{item.selling_price}</Text>
            </View>
          </View>
          <View>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => handleRemoveFromCart(item)} style={styles.quantityButton}>
                <AntDesign name="minus" size={16} color={commonStyles.btn2Color} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => handleAddToCart(item)} style={styles.quantityButton}>
                <AntDesign name="plus" size={16} color={commonStyles.btn2Color} />
              </TouchableOpacity>
            </View>
            <Text style={styles.itemTotalPrice}>₹ {eachPrice}</Text>
          </View>
        </View>
        <View style={styles.dottedLineContainer}>
          {Array(20).fill(0).map((_, index) => <View key={index} style={styles.dot} />)}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBarManager screenName="cart" />
      <SafeAreaView style={{ backgroundColor: '#fff', paddingTop: 20 }}>
        <View style={styles.figmaHeaderContainer}>
          <View style={styles.titleWrapper}>
            <Text style={styles.reOrderTitle}>My Cart</Text>
          </View>
          <View style={styles.searchWrapper}>
            <View style={styles.searchBarContainer}>
              <TextInput
                style={styles.searchPlaceholderText}
                placeholder="Search items in cart..."
                placeholderTextColor="#666666"
                value={searchQuery}
                onChangeText={handleSearch}
              />
              <Icon name="search" size={18} color="#7A7A7A" />
            </View>
          </View>
        </View>
      </SafeAreaView>

      {cartItems.length === 0 ? (
        <View style={styles.emptyScreenContainer}>
          <Image source={require('../daddy/tabassets/shoppingCart.png')} resizeMode="contain" style={styles.emptyCartImage} />
          <Text style={styles.emptyScreenText}>Looks like you haven't added anything yet.</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CategoriesScreen')} style={styles.exploreButton}>
            <Text style={styles.exploreButtonText}>Explore Items</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.cartContainer}>
          <FlatList
            data={filteredCartItems}
            keyExtractor={item => item.id}
            renderItem={renderCartItem}
          />
          <View style={[styles.bottomContainer, { bottom: route.params?.isFromRestaurant ? 0 : "10%", paddingBottom: insets.bottom }]}>
            <View style={styles.totalContainer}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.addMoreText}>+ Add more items</Text>
              </TouchableOpacity>
              <Text style={styles.totalPrice}>₹ {totalPrice}</Text>
            </View>
            <View style={styles.footer}>
              <TouchableOpacity onPress={handleCheckoutPress} style={styles.addressButton}>
                <Text style={styles.addressButtonText}>Proceed to checkout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {showLoginModal && (
        <Modal visible={showLoginModal} transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Login Required</Text>
              <Text style={styles.modalText}>
                You need to be logged in to proceed to checkout
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowLoginModal(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={() => {
                    setShowLoginModal(false);
                    navigation.navigate('Register1', { isFromCart: true });
                  }}>
                  <Text style={styles.confirmButtonText}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  figmaHeaderContainer: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingBottom: 15 },
  titleWrapper: { marginTop: 10, height: 21, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 },
  reOrderTitle: { fontFamily: 'Rubik', fontWeight: '700', fontSize: 18, color: '#2D2D2D' },
  searchWrapper: { marginTop: 21, width: '100%', height: 56 },
  searchBarContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, width: '100%', height: 56, backgroundColor: '#FFFFFF', borderWidth: 0.5, borderColor: '#A3A3A3', borderRadius: 15 },
  searchPlaceholderText: { flex: 1, fontFamily: 'Rubik', fontWeight: '500', fontSize: 16, color: '#666666', padding: 0 },
  cartContainer: { flex: 1, paddingBottom: 120 },
  cartItem: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  foodImage: { width: 82, height: 82, borderRadius: 12 },
  itemDetails: { flex: 1, marginLeft: 16, gap: 3 },
  foodName: { fontSize: 16, color: '#000', fontWeight: '500' },
  priceContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  actualPrice: { fontSize: 14, color: 'red', textDecorationLine: 'line-through' },
  sellingPrice: { fontSize: 16, color: commonStyles.btn2Color, fontWeight: '700' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: commonStyles.btn2Color, borderRadius: 6 },
  quantityButton: { padding: 5 },
  quantityText: { fontSize: 14, fontWeight: '600', marginHorizontal: 5, color: commonStyles.btn2Color },
  itemTotalPrice: { color: '#3D3D3D', fontSize: 14, fontWeight: '800', textAlign: 'right', marginTop: 3 },
  bottomContainer: { position: 'absolute', left: 0, right: 0, backgroundColor: '#fff' },
  totalContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: responsiveWidth(5), paddingVertical: 15, borderTopWidth: 1, borderTopColor: '#E5E5E5' },
  totalPrice: { fontSize: 18, color: commonStyles.btn2Color, fontWeight: '700' },
  addMoreText: { color: '#C3A710', fontSize: 16, fontWeight: '600' },
  footer: { padding: 10, alignItems: 'center' },
  addressButton: { backgroundColor: commonStyles.btn2Color, height: 48, borderRadius: 8, width: '100%', alignItems: 'center', justifyContent: 'center' },
  addressButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  dottedLineContainer: { flexDirection: 'row', marginTop: 5, alignSelf: 'center' },
  dot: { width: 7, height: 2, backgroundColor: '#D8D8D8', borderRadius: 5, marginHorizontal: 5 },
  emptyScreenContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 },
  emptyCartImage: { width: responsiveWidth(70), height: responsiveHeight(30) },
  emptyScreenText: { fontSize: 16, fontWeight: '700', textAlign: 'center', width: '80%' },
  exploreButton: { backgroundColor: commonStyles.btn2Color, paddingHorizontal: 40, paddingVertical: 12, borderRadius: 8 },
  exploreButtonText: { color: '#fff', fontWeight: '700' },
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
    backgroundColor: '#FE4A31',
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
});

export default CartScreen;