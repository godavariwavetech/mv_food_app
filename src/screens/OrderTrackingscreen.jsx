import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import commonStyles from '../commonstyles/CommonStyles';

const ORDER_STATUSES = [
    { code: 0, label: 'Order Placed', icon: 'shopping-cart' },
    { code: 1, label: 'Order Accepted', icon: 'check-circle' },
    { code: 2, label: 'Ongoing', icon: 'autorenew' },
    { code: 8, label: 'Delivery Boy Accepted', icon: 'directions-bike' },
    { code: 7, label: 'Waiting for Payment', icon: 'payment' },
    { code: 3, label: 'Completed', icon: 'done-all' },
    { code: 4, label: 'User Canceled', icon: 'cancel' },
    { code: 5, label: 'Rejected by Vendor', icon: 'block' },
    { code: 6, label: 'User Not Received', icon: 'report-problem' },
];

const STATUS_COLORS = {
    active: '#4CAF50',
    inactive: '#BDBDBD',
    canceled: '#F44336',
    warning: '#FF9800'
};



const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
};


const OrderTrackingScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { orderDetails } = route.params;
    console.log("orderdetails", orderDetails)
    console.log("orderdetails", Object.keys(orderDetails))
    const getStatusColor = (statusCode) => {
        if ([4, 5, 6].includes(statusCode)) return STATUS_COLORS.canceled;
        if (statusCode === 7) return STATUS_COLORS.warning;
        return STATUS_COLORS.active;
    };

    const getStatusDate = (statusCode) => {
        switch (statusCode) {
            case 0: return orderDetails.order_date;
            case 1: return orderDetails.accept_order_date_time;
            case 2: return orderDetails.delivery_accepted_date_time;
            case 3: return orderDetails.order_deliverd_date_time;
            case 8: return orderDetails.delivery_accepted_date_time;
            case 4: // User Cancelled
            case 5: // Rejected
            case 6: return orderDetails.order_cancel_date_time; // Add if you have a cancel date
            default: return null;
        }
    };



    return (
        <View style={styles.safeArea}>


            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back-ios" size={22} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order Tracking</Text>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.timeline}>
                    {ORDER_STATUSES.map((status, index) => {
                        const isActive = orderDetails.order_status >= status.code && orderDetails.order_status < 4;
                        const isCanceled = [4, 5, 6].includes(orderDetails.order_status) && orderDetails.order_status === status.code;

                        const stepColor = isActive
                            ? getStatusColor(status.code)   // green/active
                            : isCanceled
                                ? STATUS_COLORS.canceled        // red for rejected/canceled
                                : STATUS_COLORS.inactive;

                        // if (!showStep) return null;

                        return (
                            <View key={index} style={styles.stepContainer}>
                                <View style={[styles.iconContainer, { borderColor: stepColor }]}>
                                    <Icon name={status.icon} size={24} color={stepColor} />
                                </View>
                                <View>
                                    <Text style={[styles.statusText, { color: stepColor }]}>
                                        {status.label}
                                    </Text>
                                    {getStatusDate(status.code) && (
                                        <Text style={styles.timeText}>
                                            {getStatusDate(status.code)}
                                        </Text>
                                    )}
                                </View>
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
        color: "#fff"
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
