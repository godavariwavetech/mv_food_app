import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import commonStyles from '../commonstyles/CommonStyles';

// Static flow we show in tracking screen
const TRACKING_STATUSES = [
  { code: 0, label: 'Order Placed', icon: 'shopping-cart' },
  { code: 1, label: 'Order Accepted', icon: 'check-circle' },
  { code: 8, label: 'Delivery Boy Picked', icon: 'directions-bike' },
  { code: 2, label: 'Ongoing', icon: 'autorenew' },
  { code: 3, label: 'Completed', icon: 'done-all' },
];

const STATUS_COLORS = {
  active: '#4CAF50',
  inactive: '#BDBDBD',
};

const OrderTrackingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderDetails } = route.params;

  const currentStatus = orderDetails.order_status;

  // Helper: get reached statuses based on the static flow
  const getReachedStatuses = (statusCode) => {
    const index = TRACKING_STATUSES.findIndex(s => s.code === statusCode);
    if (index === -1) return [];
    return TRACKING_STATUSES.slice(0, index + 1).map(s => s.code);
  };

  const reachedStatuses = getReachedStatuses(currentStatus);

  return (
    <View style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back-ios" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Tracking</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.timeline}>
          {TRACKING_STATUSES.map((status, index) => {
            const isReached = reachedStatuses.includes(status.code);
            const stepColor = isReached ? STATUS_COLORS.active : STATUS_COLORS.inactive;

            return (
              <View key={index} style={styles.stepContainer}>
                <View style={[styles.iconContainer, { borderColor: stepColor }]}>
                  <Icon name={status.icon} size={24} color={stepColor} />
                </View>
                <Text style={[styles.statusText, { color: stepColor }]}>
                  {status.label}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: commonStyles.btn2Color,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#fff',
  },
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  timeline: {
    paddingLeft: 20,
    borderLeftWidth: 2,
    borderLeftColor: '#BDBDBD',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#fff',
  },
  statusText: {
    fontSize: 16,
  },
});

export default OrderTrackingScreen;
