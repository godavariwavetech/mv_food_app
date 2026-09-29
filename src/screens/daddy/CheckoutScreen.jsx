import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Modal,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  TextInput,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderPick2 from './tabassets/HeaderPick2';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToCart,
  removeFromCart,
  placeOrder,
  generateOrderId,
  updateOrderStatus,
  clearCart,
  getItemsList,
  reconcileCartWithLiveData,
} from '../../redux/reducers/daddy';
import { getSingleShopDetails } from '../../redux/reducers/search';
import { setRestaurnatDetails } from '../../redux/reducers/auth';
import Entypo from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getChargesList } from '../../redux/reducers/addressSlice';
import { haversineDistance } from './distanceCalculator';
import { removeCoupon } from '../../redux/reducers/coupons';
import commonStyles from '../../commonstyles/CommonStyles';
import StatusBarManager from '../../components/StatusBarManager';
import RazorpayCheckout from 'react-native-razorpay';
import { getActualDistance } from '../../services/googleDistanceService';

const TIP_PRESETS = [20, 30, 50];

const CheckoutScreen = ({ navigation, route }) => {
  const { cartItems, totalPrice } = useSelector(state => state.Dashboard);
  const { appliedCoupon } = useSelector(state => state.coupons);
  const { chargesList, selectedAddress } = useSelector(
    state => state.address,
  );
  const {
    customerId,
    reaturantDetails,
    locationId,
    locationName,
  } = useSelector(state => state.Auth);
  const dispatch = useDispatch();

  const handlingCharges = Number(chargesList?.[0]?.handling_charges || 0);
  const donationCharges = Number(chargesList?.[0]?.donation_charges || 0);
  const minOrderCharge = Number(chargesList?.[0]?.min_order_charge || 0);
  const extraCharges = Number(chargesList?.[0]?.extra_charge || 0);
  const isRainSurchargeActive =
    Number(chargesList?.[0]?.rain_surge_charge_active_status || 0) === 1;
  const rainSurcharge = isRainSurchargeActive
    ? Number(chargesList?.[0]?.rain_surge_charge || 0)
    : 0;
  const [clearCartConfirmVisible, setClearCartConfirmVisible] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [totalSellingPrice, setTotalSellingPrice] = useState(0);
  const [itemsTotalPrice, setItemsTotalPrice] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [distance, setDistance] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [delivery, setDelivery] = useState({
    baseCharge: 0,
    gstAmount: 0,
    totalCharge: 0,
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [amountLoading, setAmountLoading] = useState(true);
  const [tipAmount, setTipAmount] = useState(0);
  const [customTip, setCustomTip] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [validatingCart, setValidatingCart] = useState(false);

  // --- FREE DELIVERY LOGIC START ---
  const maxFreeDeliveryLimit = Number(reaturantDetails?.max_free_delivery_cost || 0);
  // Calculate how much more is needed (based on total selling price of items)
  const amountNeededForFreeDelivery = maxFreeDeliveryLimit - totalSellingPrice;
  // Determine eligibility
  const isFreeDeliveryEligible = maxFreeDeliveryLimit > 0 && amountNeededForFreeDelivery <= 0;
  const isFreeDeliveryAvailable = maxFreeDeliveryLimit > 0;
  // --- FREE DELIVERY LOGIC END ---

  const addItem = item => {
    dispatch(addToCart(item));
  };

  const decreaseItem = item => {
    dispatch(removeFromCart(item));
  };

  useEffect(() => {
    if (cartItems.length === 0) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'BottomNavigation' }],
      });
    }
  }, [cartItems.length]);

  // Re-validate the (possibly stale, persisted-from-a-previous-session) cart
  // against live restaurant/item data right when the user taps Place Order:
  // the restaurant may have gone inactive, or item prices/offers may have
  // changed since the items were added to the cart. Returns true only if
  // the cart matched live data and it's safe to proceed with the order.
  const validateCartBeforeOrder = async () => {
    const shopId = cartItems[0]?.shop_id;
    if (!shopId) return true;

    const shopResponse = await dispatch(getSingleShopDetails({ shopId }));
    const freshShop = shopResponse?.payload?.data?.[0];
    const restaurantActive = !!freshShop && freshShop.shop_active_status !== '1';

    if (freshShop) {
      dispatch(setRestaurnatDetails(freshShop));
    }

    if (!restaurantActive) {
      return new Promise(resolve => {
        Alert.alert(
          'Restaurant unavailable',
          'This restaurant is currently unavailable. Your cart has been cleared.',
          [{
            text: 'OK',
            onPress: () => {
              dispatch(reconcileCartWithLiveData({ restaurantActive: false, variantsById: {} }));
              resolve(false);
            },
          }],
          { cancelable: false },
        );
      });
    }

    const itemsResponse = await dispatch(getItemsList({
      shopId,
      shopItem: freshShop?.shop_items_tb_nm,
    }));
    const freshItems = itemsResponse?.payload?.data || [];
    const variantsById = {};
    freshItems.forEach(item => {
      (item.quantities || []).forEach(variant => {
        variantsById[variant.id] = variant;
      });
    });

    const removedItems = [];
    const changedItems = [];
    cartItems.forEach(item => {
      const live = variantsById[item.id];
      if (!live || live.active_status === '1') {
        removedItems.push(item.item_name);
        return;
      }
      const priceChanged =
        String(item.selling_price) !== String(live.selling_price) ||
        String(item.actual_price) !== String(live.actual_price) ||
        String(item.discount_percentage) !== String(live.discount_percentage) ||
        String(item.discount_amount) !== String(live.discount_amount);
      if (priceChanged) {
        changedItems.push(item.item_name);
      }
    });

    if (removedItems.length || changedItems.length) {
      const parts = [];
      if (removedItems.length) {
        parts.push(`Removed (no longer available): ${removedItems.join(', ')}`);
      }
      if (changedItems.length) {
        parts.push(`Price/offer updated: ${changedItems.join(', ')}`);
      }
      return new Promise(resolve => {
        Alert.alert(
          'Your cart was updated',
          parts.join('\n'),
          [{
            text: 'OK',
            onPress: () => {
              dispatch(reconcileCartWithLiveData({ restaurantActive: true, variantsById }));
              resolve(false);
            },
          }],
          { cancelable: false },
        );
      });
    }

    return true;
  };


  const caliculateTotalPrice = useCallback(() => {
    const totals = cartItems.reduce(
      (acc, item, index) => {
        const actualTotal = parseFloat(item.actual_price) * item.quantity;
        const sellingTotal = parseFloat(item.selling_price) * item.quantity;
        acc.totalSellingPrice += sellingTotal;
        acc.totalActualPrice += actualTotal;
        acc.totalSavings += actualTotal - sellingTotal;
        return acc;
      },
      { totalSellingPrice: 0, totalActualPrice: 0, totalSavings: 0 },
    );

    setTotalSellingPrice(totals.totalSellingPrice);
    setTotalSavings(totals.totalSavings);

    // Coupon Handling
    if (appliedCoupon) {
      const totalSellingPriceNum = parseFloat(totals.totalSellingPrice);
      const couponMinOrderValue = parseFloat(appliedCoupon.coupon_upto_price);
      const couponMaxDiscountLimit = parseFloat(appliedCoupon.coupon_max_price_limit);
      if (totalSellingPriceNum < couponMinOrderValue) {
        dispatch(removeCoupon());
        setCouponDiscount(0);
        setItemsTotalPrice(totalSellingPriceNum);
        return;
      }
      let discountAmount = (totalSellingPriceNum * appliedCoupon.coupon_percentage) / 100;
      discountAmount = Math.min(discountAmount, couponMaxDiscountLimit);
      setCouponDiscount(discountAmount);
      setItemsTotalPrice(totalSellingPriceNum - discountAmount);
    } else {
      setItemsTotalPrice(totals.totalSellingPrice);
    }
  }, [cartItems, appliedCoupon, dispatch]);

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
              <TouchableOpacity
                onPress={() => decreaseItem(item)}
                style={styles.quantityButton}>
                <AntDesign name="minus" size={16} color={commonStyles.btn2Color} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity
                onPress={() => addItem(item)}
                style={styles.quantityButton}>
                <AntDesign name="plus" size={16} color={commonStyles.btn2Color} />
              </TouchableOpacity>
            </View>
            {item.measurement_type ? (
              <Text style={styles.quantityMeasurement}>{item.measurement_type}</Text>
            ) : null}
            <Text style={styles.itemTotalPrice}>₹ {eachPrice}</Text>
          </View>
        </View>
        <View style={styles.dottedLineContainer}>
          {Array(20)
            .fill(0)
            .map((_, index) => (
              <View key={index} style={styles.dot} />
            ))}
        </View>
      </View>
    );
  };

  const calculateDeliveryCharge = useCallback((
    distance,
    cartPrice,
    gstRate = 18,
  ) => {
    // Check if the restaurant has a max_free_delivery_cost set
    const maxFreeDeliveryLimit = Number(reaturantDetails?.max_free_delivery_cost || 0);

    // If the limit exists (> 0) and the order amount (cartPrice) is crossing it
    if (maxFreeDeliveryLimit > 0 && cartPrice > maxFreeDeliveryLimit) {
      return {
        baseCharge: 0,
        gstAmount: 0,
        totalCharge: "0.00",
      };
    }

    let deliveryCharge = reaturantDetails?.minimum_del_charge || 0;

    if (distance >= Number(reaturantDetails?.minimum_km || 3)) {
      deliveryCharge = deliveryCharge + (Number(distance) - Number(reaturantDetails?.minimum_km)) * (reaturantDetails?.per_km_chargers || 10);
    }

    // Below-minimum-order extra charge is folded into the delivery charge
    // so it shows as a single "Delivery Charges" amount to the customer.
    const minimumOrderAmount = Number(reaturantDetails?.minimum_order || 0);
    if (minimumOrderAmount > 0 && cartPrice < minimumOrderAmount) {
      deliveryCharge += extraCharges;
    }

    let gstAmount = 0;
    let totalDeliveryCharge = deliveryCharge + gstAmount;

    return {
      baseCharge: deliveryCharge,
      gstAmount: gstAmount,
      totalCharge: totalDeliveryCharge.toFixed(2),
    };
  }, [reaturantDetails, extraCharges]);

  const handlePlaceOrder = async () => {
    if (validatingCart || isProcessingPayment) {
      return;
    }

    setValidatingCart(true);
    let cartIsFresh = false;
    try {
      cartIsFresh = await validateCartBeforeOrder();
    } catch (error) {
      console.error('Cart validation error:', error);
      Alert.alert('Unable to verify cart', 'Please check your connection and try again.');
    } finally {
      setValidatingCart(false);
    }
    if (!cartIsFresh) {
      return;
    }

    if (!selectedPaymentMethod) {
      Alert.alert('Select Payment', 'Please choose a payment method to continue.');
      return;
    }
    try {
      setIsProcessingPayment(true);

      // 🔹 Common payload (COD or Razorpay)
      let payload = {
        order_status: 0,
        actual_total_amount: itemsTotalPrice,
        customer_id: customerId,
        customer_name: selectedAddress?.customer_name,
        customer_mobile_number: selectedAddress?.customer_mobile_number,
        category_id: cartItems[0]?.category_id,
        sub_category_id: cartItems[0]?.sub_category_id,
        admin_percentage: Number(reaturantDetails?.admin_percentage || 0),
        item_count: cartItems?.reduce((sum, item) => sum + Number(item.quantity), 0),
        total_amount: totalSellingPrice,
        total_saving_amount: totalSavings,
        coupon_amount: couponDiscount,
        delivery_charges: delivery.totalCharge,
        delivery_boy_tip: tipAmount,
        min_order_charge: minOrderCharge,
        rain_surcharge: rainSurcharge,
        grand_total: grandTotal,
        location_id: locationId,
        location_name: locationName,
        payment_type: selectedPaymentMethod,
        payment_id: selectedPaymentMethod,
        razorpay_order_id: null,
        order_instructions: orderNote.trim(),
        delivery_instructions: deliveryNote.trim(),
        coupon_type: appliedCoupon?.coupon_type || "0",
        coupon_id: appliedCoupon?.id || "0",
        delivery_address: selectedAddress
          ? selectedAddress.full_address
          : 'No address selected',
        order_latitude: selectedAddress?.customer_latitude || '0',
        order_longitude: selectedAddress?.customer_longitude || '0',
        slot_timings: 'Fast Delivery',
        order_distance: distance,
        ext_del_charge: belowMinimumOrderCharge,
        shop_id: cartItems[0]?.shop_id,
        user_player_id: null,
        order_type: 0,
        delivery_charges_gst: delivery.gstAmount,
        handling_charges: handlingCharges,
        packing_charges: 0,
        packing_charges_gst: 0,
        donation_charges: donationCharges,
        sub_order_array: cartItems.map(item => ({
          item_name: item.item_name,
          item_image: item.item_image,
          item_id: item.id,
          category_id: item.category_id,
          sub_category_id: item.sub_category_id,
          category_name: item.category_name,
          sub_category_name: item.sub_category_name,
          actualitem_price: item.actual_price,
          item_price: item.selling_price,
          sub_item_count: item.quantity,
          measurement_type: item.measurement_type || '',
          item_total_amount: item.selling_price * item.quantity,
          filter_name: item.filter_one,
          item_description: item.item_description,
          saving_price: item.discount_amount,
          shop_id: item.shop_id,
          filter_one: item.filter_one,
        })),
      };

      // 🔹 Case 1: COD
      if (selectedPaymentMethod === 'COD') {
        const responseCod = await dispatch(placeOrder({ orderDetails: payload }));

        if (!responseCod?.payload) {
          Alert.alert("Order Failed", "Unable to place COD order. Please try again.");
          return;
        }

        navigation.replace('OrderSuccess', { response: responseCod.payload });
        return;
      }

      // 🔹 Case 2: Razorpay Flow
      if (selectedPaymentMethod === 'Pay Online') {
        const razorpayOrderResponse = await dispatch(generateOrderId({ orderAmount: grandTotal }));
        const razorpayOrder = razorpayOrderResponse?.payload;

        if (!razorpayOrder?.id) {
          Alert.alert("Payment Error", "Failed to generate Razorpay Order ID. Please try again.");
          return;
        }

        const pendingOrder = await dispatch(placeOrder({
          orderDetails: {
            ...payload,
            order_status: 7, // Pending
            razorpay_order_id: razorpayOrder.id,
          }
        }));

        if (!pendingOrder?.payload?.order_id) {
          Alert.alert("Order Error", "Failed to create pending order. Please try again.");
          return;
        }

        const options = {
          description: 'Order Payment',
          currency: razorpayOrder.currency || 'INR',
          key: razorpayOrder.key_id,
          amount: razorpayOrder.amount,
          order_id: razorpayOrder.id,
          name: 'Fresh Grab',
          prefill: {
            email: selectedAddress?.customer_email || 'test@example.com',
            contact: selectedAddress?.customer_mobile_number,
            name: selectedAddress?.customer_name,
          },
          theme: { color: '#3399cc' },
        };

        try {
          const razorpayResult = await RazorpayCheckout.open(options);

          const verifyRes = await dispatch(updateOrderStatus({
            paymentId: razorpayResult?.razorpay_payment_id,
            rzpId: razorpayResult?.razorpay_order_id,
            orderId: pendingOrder.payload.id,
            customer_id: customerId
          }));

          if (!verifyRes?.payload) {
            Alert.alert("Payment Verification Failed", "Your payment was captured, but verification failed. Contact support.");
            return;
          }

          navigation.replace('OrderSuccess', { response: pendingOrder.payload });

        } catch (error) {
          await dispatch(updateOrderStatus({
            orderId: pendingOrder.payload.order_id,
            status: "failed"
          }));
          Alert.alert("Payment Cancelled", "Transaction was not completed.");
        }
      }

    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Unexpected Error', error?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const navigateToCoupons = () => {
    navigation.navigate('Coupons', {
      onCouponSelect: coupon => {
      },
    });
  };

  useEffect(() => {
    dispatch(getChargesList());
  }, []);
  const calculatedDistance = useMemo(() => {
    if (!selectedAddress || !reaturantDetails) return 0;
    return haversineDistance(
      selectedAddress.customer_latitude,
      selectedAddress.customer_longitude,
      reaturantDetails.shop_latitude,
      reaturantDetails.shop_longitude,
    );
  }, [selectedAddress, reaturantDetails]);


  const deliveryCharges = useMemo(() => {
    if (!reaturantDetails || !chargesList?.length) return { baseCharge: 0, gstAmount: 0, totalCharge: 0 };
    return calculateDeliveryCharge(
      distance,
      itemsTotalPrice,
    );
  }, [distance, itemsTotalPrice, calculateDeliveryCharge, reaturantDetails, chargesList]);

  // Fixed "Extra Charges" (from Charges Management) applied when the order
  // is below the restaurant's minimum order. Folded into deliveryCharges
  // above, kept here only to report it separately to the backend.
  const belowMinimumOrderCharge = useMemo(() => {
    const minimumOrderAmount = Number(reaturantDetails?.minimum_order || 0);
    if (minimumOrderAmount > 0 && itemsTotalPrice < minimumOrderAmount) {
      return extraCharges;
    }
    return 0;
  }, [itemsTotalPrice, reaturantDetails, extraCharges]);

  const calculatedGrandTotal = useMemo(() => {
    return totalSellingPrice
      - couponDiscount
      + Number(deliveryCharges.totalCharge)
      + Number(handlingCharges || 0)
      + Number(donationCharges || 0)
      + Number(minOrderCharge || 0)
      + Number(rainSurcharge || 0)
      + Number(tipAmount || 0);
  }, [
    totalSellingPrice,
    couponDiscount,
    deliveryCharges.totalCharge,
    handlingCharges,
    donationCharges,
    minOrderCharge,
    rainSurcharge,
    tipAmount,
  ]);

  useEffect(() => {
    setDistance(calculatedDistance);
  }, [calculatedDistance]);

  useEffect(() => {
    const fetchActualDistance = async () => {
      if (selectedAddress && reaturantDetails) {
        try {
          const response = await getActualDistance(
            selectedAddress.customer_latitude,
            selectedAddress.customer_longitude,
            reaturantDetails.shop_latitude,
            reaturantDetails.shop_longitude,
          );
          if (response.success && response.distance) {
            setDistance(response.distance);
          }
        } catch (error) {
          console.error('Error fetching actual distance:', error);
        }
      }
    };

    fetchActualDistance();

  }, [selectedAddress, reaturantDetails]);

  useEffect(() => {
    setDelivery(deliveryCharges);
  }, [deliveryCharges]);

  useEffect(() => {
    setAmountLoading(true)
    setGrandTotal(calculatedGrandTotal);
    setTimeout(() => {
      setAmountLoading(false)
    }, 500);
  }, [calculatedGrandTotal, totalSellingPrice, couponDiscount, deliveryCharges.totalCharge, handlingCharges]);

  useEffect(() => {
    caliculateTotalPrice();
  }, [cartItems, appliedCoupon]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBarManager screenName="checkout" />
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign name="arrowleft" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Checkout</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Support')}
            style={styles.supportButton}>
            <Icon name="support-agent" size={30} color="grey" />
          </TouchableOpacity>
        </View>

        {/* Savings Banner */}
        <ScrollView style={[styles.content, { marginBottom: responsiveHeight(25) }]}>
          {totalSavings != "" && (
            <View style={styles.savingsBanner}>
              <MaterialCommunityIcons
                name="brightness-percent"
                color={commonStyles.btn2Color}
                size={15}
              />
              {totalSavings && (
                <Text style={styles.savingsText}>
                  {' '}
                  ₹{totalSavings} saved from this order
                </Text>
              )}
            </View>
          )}

          {/* FREE DELIVERY PROGRESS BAR */}
          {isFreeDeliveryAvailable && (
            <View style={{
              marginHorizontal: responsiveWidth(5),
              marginVertical: 10,
              padding: 12,
              backgroundColor: isFreeDeliveryEligible ? '#E7FFD3' : '#FFF5E5',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: isFreeDeliveryEligible ? '#FC6011' : '#FFCB18',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}>
              <MaterialCommunityIcons
                name={isFreeDeliveryEligible ? "check-decagram" : "truck-delivery-outline"}
                size={22}
                color={isFreeDeliveryEligible ? '#FC6011' : '#F5A623'}
              />
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: isFreeDeliveryEligible ? '#FC6011' : '#525252'
              }}>
                {isFreeDeliveryEligible
                  ? "🎉 You've unlocked Free Delivery!"
                  : `Add items worth ₹${amountNeededForFreeDelivery.toFixed(2)} for Free Delivery!`
                }
              </Text>
            </View>
          )}

          {/* Cart Items */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", margin: 10, paddingTop: 10 }}>
            <Text style={styles.checkoutSectionTitle}>Cart Items</Text>
            <TouchableOpacity
              style={styles.checkoutClearCartButton}
              onPress={() => setClearCartConfirmVisible(true)}
            >
              <Text style={styles.checkoutClearCartButtonText}>Clear Cart</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />

          <View style={styles.totalContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('BottomNavigation')}
              style={{}}>
              <Text style={styles.addMoreText}>+ Add more items</Text>
            </TouchableOpacity>
            <Text style={styles.totalPrice}>₹ {totalPrice}</Text>
          </View>

          {/* Delivery Details */}
          <View style={[styles.detailsCard]}>
            <Text style={styles.cardTitle}>Delivery Details</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AddressList', { isFromCart: true })} style={styles.address}>
              <View style={styles.addressSection}>
                <MaterialIcons name="home" size={24} color="#666" />
                <View style={styles.addressDetails}>
                  <Text style={styles.addressType}>
                    {selectedAddress?.address_type || 'No address selected'}
                  </Text>
                  <Text style={styles.addressText}>
                    {selectedAddress?.full_address || 'No address selected'}
                  </Text>
                </View>
                <Entypo
                  name="chevron-right"
                  size={24}
                  color="#666"
                  onPress={() =>
                    navigation.navigate('AddressList', { isFromCart: true })
                  }
                />
              </View>

              <View
                style={[
                  styles.dottedLineContainer,
                  styles.dottedLineContainerFull,
                  {
                    width: responsiveWidth(80),
                    overflow: 'hidden',
                    alignSelf: 'center',
                    marginBottom: 10,
                  },
                ]}>
                {Array(20)
                  .fill(0)
                  .map((_, index) => (
                    <View key={index} style={styles.dot} />
                  ))}
              </View>

              <View style={styles.contactSection}>
                <MaterialIcons name="person" size={24} color="#666" />
                <View style={styles.contactDetails}>
                  <Text style={styles.contactName}>
                    {selectedAddress?.customer_name || 'No name'}
                  </Text>
                  <Text style={styles.contactNumber}>
                    {selectedAddress?.customer_mobile_number || 'No contact'}
                  </Text>
                </View>
                <Entypo
                  name="chevron-right"
                  size={24}
                  color="#666"
                  onPress={() =>
                    navigation.navigate('AddressList', { isFromCart: true })
                  }
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Apply Coupons */}
          <TouchableOpacity onPress={navigateToCoupons} style={styles.couponCard}>
            <MaterialIcons name="local-offer" size={24} color={commonStyles.btn2Color} />
            <Text style={styles.couponText}>Apply coupons</Text>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>

          {/* Delivery Tip */}
          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <MaterialCommunityIcons
                name="hand-heart-outline"
                size={22}
                color={commonStyles.btn2Color}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.tipTitle}>Tip your delivery partner</Text>
                <Text style={styles.tipSubtitle}>
                  100% of the tip goes to your delivery partner
                </Text>
              </View>
            </View>
            <View style={styles.tipChipsRow}>
              {TIP_PRESETS.map(amount => (
                <TouchableOpacity
                  key={amount}
                  style={[
                    styles.tipChip,
                    tipAmount === amount && styles.tipChipSelected,
                  ]}
                  onPress={() => {
                    setCustomTip('');
                    setTipAmount(prev => (prev === amount ? 0 : amount));
                  }}>
                  <Text
                    style={[
                      styles.tipChipText,
                      tipAmount === amount && styles.tipChipTextSelected,
                    ]}>
                    ₹{amount}
                  </Text>
                </TouchableOpacity>
              ))}
              <View
                style={[
                  styles.tipChip,
                  styles.tipCustomChip,
                  customTip !== '' && styles.tipChipSelected,
                ]}>
                <Text
                  style={[
                    styles.tipChipText,
                    customTip !== '' && styles.tipChipTextSelected,
                  ]}>
                  ₹
                </Text>
                <TextInput
                  style={styles.tipCustomInput}
                  placeholder="Other"
                  placeholderTextColor="#999"
                  keyboardType="number-pad"
                  value={customTip}
                  onChangeText={text => {
                    const numeric = text.replace(/[^0-9]/g, '');
                    setCustomTip(numeric);
                    setTipAmount(numeric ? Number(numeric) : 0);
                  }}
                  maxLength={5}
                />
              </View>
            </View>
            {tipAmount > 0 && (
              <TouchableOpacity
                style={styles.tipRemoveButton}
                onPress={() => {
                  setTipAmount(0);
                  setCustomTip('');
                }}>
                <Text style={styles.tipRemoveText}>Remove tip</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Order Instructions */}
          <View style={styles.noteCard}>
            <View style={styles.tipHeader}>
              <MaterialIcons
                name="edit-note"
                size={22}
                color={commonStyles.btn2Color}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.tipTitle}>Order instructions</Text>
                <Text style={styles.tipSubtitle}>
                  E.g. less spicy, no onions, extra napkins
                </Text>
              </View>
            </View>
            <TextInput
              style={styles.noteInput}
              placeholder="Add cooking instructions for the restaurant"
              placeholderTextColor="#999"
              value={orderNote}
              onChangeText={setOrderNote}
              multiline
              maxLength={200}
            />
            <Text style={styles.noteCounter}>{orderNote.length}/200</Text>
          </View>

          {/* Delivery Instructions */}
          <View style={styles.noteCard}>
            <View style={styles.tipHeader}>
              <MaterialCommunityIcons
                name="moped-outline"
                size={22}
                color={commonStyles.btn2Color}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.tipTitle}>Delivery instructions</Text>
                <Text style={styles.tipSubtitle}>
                  E.g. ring the bell, leave at the door, call on arrival
                </Text>
              </View>
            </View>
            <TextInput
              style={styles.noteInput}
              placeholder="Add instructions for the delivery partner"
              placeholderTextColor="#999"
              value={deliveryNote}
              onChangeText={setDeliveryNote}
              multiline
              maxLength={200}
            />
            <Text style={styles.noteCounter}>{deliveryNote.length}/200</Text>
          </View>

          {/* Billing */}
          <Text style={styles.sectionTitle}>Billing</Text>
          <View style={styles.billingCard}>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Original Price</Text>
              <Text style={styles.billValue}>₹ {(totalSellingPrice + totalSavings).toFixed(2)}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Amount</Text>
              <Text style={styles.billValue}>₹ {totalSellingPrice.toFixed(2)}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Savings</Text>
              <Text style={styles.savingsValue}>₹ {totalSavings.toFixed(2)}</Text>
            </View>
            {appliedCoupon && <View style={styles.billRow}>
              <Text style={styles.billLabel}>Coupon Discount</Text>
              <Text style={styles.savingsValue}>₹ {couponDiscount.toFixed(2)}</Text>
            </View>}
            
            {appliedCoupon && (
              <View style={styles.couponRow}>
                <Text style={styles.couponCode}>{appliedCoupon?.coupon_name}</Text>
                <TouchableOpacity onPress={() => {
                  dispatch(removeCoupon());
                  setCouponDiscount(0);
                  setItemsTotalPrice(totalSellingPrice);  // Reset the item price
                }}>
                  <Text style={styles.removeCouponText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Total</Text>
              <Text style={styles.savingsValue}>
                ₹ {(itemsTotalPrice || totalSellingPrice - couponDiscount).toFixed(2)}
              </Text>
            </View>
           
            <View
              style={[
                styles.dottedLineContainer,
                {
                  marginVertical: 10,
                  marginTop: 0,
                  width: responsiveWidth(80),
                  overflow: 'hidden',
                },
              ]}>
              {Array(20)
                .fill(0)
                .map((_, index) => (
                  <View key={index} style={styles.dot} />
                ))}
            </View>
            
            {/* Delivery Charges - UPDATED */}
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Delivery Charges</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {/* If free delivery is eligible, show the old price crossed out */}
                {isFreeDeliveryEligible && (
                  <Text style={[styles.billValue, { 
                    textDecorationLine: 'line-through', 
                    color: '#999', 
                    marginRight: 8, 
                    fontSize: 13 
                  }]}>
                    {/* Calculate what it would have been */}
                    ₹ {((Number(distance) - Number(reaturantDetails?.minimum_km || 3)) * (reaturantDetails?.per_km_chargers || 10) + (reaturantDetails?.minimum_del_charge || 0)).toFixed(2)}
                  </Text>
                )}
                
                {/* Show the actual charge (0 or the calculated amount) */}
                <Text style={[styles.billValue, isFreeDeliveryEligible && { color: '#FC6011', fontWeight: '700' }]}>
                  {Number(delivery.totalCharge) === 0 ? "FREE" : `₹ ${delivery.totalCharge}`}
                </Text>
              </View>
            </View>

            {/* Delivery Tip */}
            {tipAmount > 0 && (
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Delivery Tip</Text>
                <Text style={styles.billValue}>₹ {Number(tipAmount).toFixed(2)}</Text>
              </View>
            )}

            {/* Handling Charges */}
            {handlingCharges > 0 && (
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Handling Charges</Text>
                <Text style={styles.billValue}>₹ {handlingCharges.toFixed(2)}</Text>
              </View>
            )}

            {/* Donation Charges */}
            {donationCharges > 0 && (
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Donation</Text>
                <Text style={styles.billValue}>₹ {donationCharges.toFixed(2)}</Text>
              </View>
            )}

            {/* Minimum Order Charge */}
            {minOrderCharge > 0 && (
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Minimum Order Charge</Text>
                <Text style={styles.billValue}>₹ {minOrderCharge.toFixed(2)}</Text>
              </View>
            )}

            {/* Rain Surcharge */}
            {rainSurcharge > 0 && (
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Rain Surcharge</Text>
                <Text style={styles.billValue}>₹ {rainSurcharge.toFixed(2)}</Text>
              </View>
            )}

            <View
              style={[
                styles.dottedLineContainer,
                {
                  marginVertical: 10,
                  marginTop: 0,
                  width: responsiveWidth(80),
                  overflow: 'hidden',
                },
              ]}>
              {Array(20)
                .fill(0)
                .map((_, index) => (
                  <View key={index} style={styles.dot} />
                ))}
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL</Text>
              <Text style={styles.totalValue}>₹ {grandTotal.toFixed(2)}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Payment Section */}
        <View style={[styles.paymentSection, { position: 'absolute', bottom: "5%", width: '100%' }]}>
          {/* Payment Method Selection */}
          <View style={styles.paymentMethodContainer}>
            <Text style={styles.paymentMethodTitle}>Choose Payment Method</Text>
            <View style={styles.paymentButtonsContainer}>
              {/* Pay Online Button */}
              <TouchableOpacity
                style={[
                  styles.paymentMethodButton,
                  selectedPaymentMethod === 'Pay Online' && styles.paymentMethodButtonSelected,
                  styles.paymentMethodButtonDisabled
                ]}
                onPress={() => setSelectedPaymentMethod('Pay Online')}
                disabled={isProcessingPayment||true}>
                <MaterialIcons 
                  name="credit-card" 
                  size={20} 
                  color={'#ccc' } 
                />
                <Text style={[
                  styles.paymentMethodButtonText,
                  selectedPaymentMethod === 'Pay Online' && styles.paymentMethodButtonTextSelected,
                  styles.paymentMethodButtonTextDisabled
                ]}>
                  Pay Online
                </Text>
              </TouchableOpacity>

              {/* COD Button */}
              <TouchableOpacity
                style={[
                  styles.paymentMethodButton,
                  selectedPaymentMethod === 'COD' && styles.paymentMethodButtonSelected,
                ]}
                onPress={() => setSelectedPaymentMethod('COD')}
                disabled={isProcessingPayment}
                >
                <MaterialIcons 
                  name="money" 
                  size={20} 
                  color={
                    false
                      ? '#ccc' 
                      : selectedPaymentMethod === 'COD' 
                        ? '#fff' 
                        : commonStyles.btn2Color
                  } 
                />
                <Text style={[
                  styles.paymentMethodButtonText,
                  selectedPaymentMethod === 'COD' && styles.paymentMethodButtonTextSelected,
                ]}>
                  COD
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Place Order Button */}
          <TouchableOpacity
            style={[
              styles.placeOrderButton,
              (!selectedPaymentMethod || isProcessingPayment || validatingCart) && { opacity: 0.6 }
            ]}
            onPress={handlePlaceOrder}
            disabled={isProcessingPayment || amountLoading || validatingCart}>
            {(isProcessingPayment || amountLoading || validatingCart) ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.placeOrderContent}>
                <View style={styles.orderTotal}>
                  <Text style={styles.orderTotalValue}>₹ {Number(grandTotal).toFixed(2)}</Text>
                  <Text style={styles.orderTotalLabel}>Total</Text>
                </View>
                <View style={styles.placeOrderTextContainer}>
                  <Text style={styles.placeOrderText}>Place Order</Text>
                  <MaterialIcons name="arrow-forward-ios" size={16} color="#fff" />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Custom Modal for Missing User Details */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Missing Information</Text>
              <Text style={styles.modalMessage}>
                Please fill in your name and phone number in the address section.
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={clearCartConfirmVisible}
          onRequestClose={() => setClearCartConfirmVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Clear Cart?</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to clear all items from your cart?
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: '#FF4D4F' }]}
                  onPress={() => {
                    dispatch(clearCart());
                    setClearCartConfirmVisible(false);

                  }}
                >
                  <Text style={styles.modalButtonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                  onPress={() => setClearCartConfirmVisible(false)}
                >
                  <Text style={[styles.modalButtonText, { color: '#333' }]}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: commonStyles.btn2Color,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(6),
    paddingBottom: responsiveHeight(2),
  },
  backButton: {
    width: responsiveWidth(7),
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  profileButton: {
    width: responsiveWidth(7),
  },
  savingsText: {
    color:"#000",
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    flex: 1,
    // padding: responsiveWidth(5),
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginTop: 0,
    marginBottom: responsiveHeight(0.5),
    marginLeft: responsiveWidth(5),
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  foodImage: {
    width: 82,
    height: 82,
    borderRadius: 12,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
    gap: 3,
    justifyContent: 'center',
  },
  foodName: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    width: '60%',
  },
  foodPrice: {
    fontSize: 16,
    color: commonStyles.btn2Color,
    fontWeight: '700',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: commonStyles.btn2Color,
    borderRadius: 6,
  },
  quantityButton: {
    padding: 5,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 5,
    color: commonStyles.btn2Color,
  },
  quantityMeasurement: {
    fontSize: 11,
    fontWeight: '500',
    color: '#888',
    textAlign: 'right',
    marginTop: 2,
  },
  itemTotalPrice: {
    color: '#3D3D3D',
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'right',
    marginTop: 3,
  },
  addMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: responsiveHeight(3),
  },
  addMoreText: {
    color: '#C3A710',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'left',
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: responsiveHeight(2),
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginLeft: responsiveWidth(2),
    marginBottom: 5,
  },
  addressSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    gap: 10,
  },
  addressDetails: {
    flex: 1,
  },
  addressType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#3D3D3D',
    lineHeight: 18,
    fontWeight: '400',
  },
  contactSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  contactNumber: {
    fontSize: 12,
    color: '#666',
  },
  couponCard: {
    width: responsiveWidth(90),
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: responsiveHeight(2),
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: commonStyles.btn2Color,
  },
  couponText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  tipCard: {
    width: responsiveWidth(90),
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: responsiveHeight(0.5),
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  tipSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  tipChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tipChip: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
    marginBottom: 8,
  },
  tipChipSelected: {
    borderColor: commonStyles.btn2Color,
    backgroundColor: '#F0FBF4',
  },
  tipChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#525252',
  },
  tipChipTextSelected: {
    color: commonStyles.btn2Color,
  },
  tipCustomChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  tipCustomInput: {
    minWidth: responsiveWidth(14),
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  tipRemoveButton: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  tipRemoveText: {
    color: '#FF4D4F',
    fontSize: 13,
    fontWeight: '600',
  },
  noteCard: {
    width: responsiveWidth(90),
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: responsiveHeight(0.5),
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  noteCounter: {
    fontSize: 11,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  billingCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: responsiveHeight(2),
    borderWidth: 1,
    width: responsiveWidth(90),
    alignSelf: 'center',
    borderColor: commonStyles.btn2Color,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  billLabel: {
    fontSize: 16,
    color: '#525252',
    fontWeight: '500',
  },
  billValue: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
  },
  savingsValue: {
    fontSize: 15,
    color: '#525252',
    fontWeight: '500',
  },
  gstValue: {
    fontSize: 15,
    color: '#FFCB18',
    fontWeight: '500',
  },
  couponCode: {
    fontSize: 12,
    color: commonStyles.btn2Color,
    fontWeight: '500',
    marginLeft: 10,
  },
  gstNote: {
    fontSize: 12,
    color: '#666',
    marginLeft: 0,
    marginBottom: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  paymentSection: {
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  paymentMethodContainer: {
    marginBottom: 10,
  },
  paymentMethodTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    textAlign: 'center',
  },
  paymentButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  paymentMethodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e9ecef',
    gap: 6,
  },
  paymentMethodButtonSelected: {
    backgroundColor: commonStyles.btn2Color,
    borderColor: commonStyles.btn2Color,
  },
  paymentMethodButtonDisabled: {
    backgroundColor: '#f8f9fa',
    borderColor: '#dee2e6',
    opacity: 0.6,
  },
  paymentMethodButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: commonStyles.btn2Color,
  },
  paymentMethodButtonTextSelected: {
    color: '#fff',
  },
  paymentMethodButtonTextDisabled: {
    color: '#6c757d',
  },
  codLimitText: {
    fontSize: 9,
    color: '#dc3545',
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
  placeOrderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: commonStyles.btn2Color,
    borderRadius: 6,
    // padding: 15,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  placeOrderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  orderTotal: {
    alignItems: 'flex-start',
  },
  orderTotalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  orderTotalLabel: {
    fontSize: 11,
    fontWeight: '400',
    color: '#fff',
  },
  placeOrderTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeOrderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginRight: 4,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(2),
  },
  totalPrice: {
    fontSize: 18,
    color: commonStyles.btn2Color,
    fontWeight: '700',
  },
  dottedLineContainer: {
    flexDirection: 'row',
    marginTop: 5,
    alignSelf: 'center',
  },
  dot: {
    width: 7, // Dot size
    height: 2,
    backgroundColor: '#D8D8D8', // Dot color
    borderRadius: 5, // Makes it circular
    marginHorizontal: 5, // Space between dots
  },
  savingsBanner: {
    width: responsiveWidth(90),
    alignSelf: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: responsiveHeight(1.5),
    borderWidth: 1,

    borderRadius: 8,
    gap: 8,
    marginTop: responsiveHeight(2),
    // marginVertical: responsiveHeight(2),
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  supportButton: {
    width: 44,
    height: 44,
    backgroundColor: '#fff',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appliedCouponContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appliedCouponText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  removeCouponText: {
    fontSize: 16,
    fontWeight: '600',
    color: commonStyles.btn2Color,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: commonStyles.btn2Color,
    borderRadius: 5,
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  totalText: {
    fontSize: 16,
    color: '#000',
  },
  amountText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  address: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: commonStyles.btn2Color,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actualPrice: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'line-through',
  },
  sellingPrice: {
    fontSize: 16,
    color: commonStyles.btn2Color,
    fontWeight: '700',
    textAlign: "left"
  },
  couponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,

  },
  removeCouponText: {
    color: '#FF4D4F',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  checkoutSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  checkoutClearCartButton: {
    backgroundColor: '#FF4D4F',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  checkoutClearCartButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CheckoutScreen;