import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Platform,
  Linking,
  RefreshControl,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import VersionCheck from 'react-native-version-check';

// Redux Actions
import { actionLogout, deleteAccount, getProfile } from '../../redux/reducers/auth';
import { clearCart } from '../../redux/reducers/daddy';
import CustomModal from '../../components/CustomModal';

// ==========================================
// REUSABLE MENU LIST ITEM COMPONENT
// ==========================================
const MenuListItem = ({ title, iconName, IconFamily = Feather, iconColor = "#FC6011", onPress, isExternal }) => {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuItemLeft}>
        <View style={styles.iconContainer}>
          <IconFamily name={iconName} size={22} color={iconColor} />
        </View>
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      {isExternal ? (
        <Ionicons name="open-outline" size={20} color="#3D3D3D" />
      ) : (
        <Icon name="chevron-right" size={24} color="#3D3D3D" />
      )}
    </TouchableOpacity>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================
const ProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  // --- Redux State ---
  const { customerId, profile } = useSelector(state => state.Auth);
  const { userDetails } = useSelector(state => state.address);

  // --- Local State ---
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [appVersion, setAppVersion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // --- Profile Data Fetch ---
  useEffect(() => {
    dispatch(getProfile());
  }, []);

  // --- Version Check Logic ---
  useEffect(() => {
    const getVersion = async () => {
      try {
        const version = await VersionCheck.getCurrentVersion();
        setAppVersion(version);
      } catch (error) {
        console.error('Error getting app version:', error);
      }
    };
    getVersion();
  }, []);

  const handleCheckForUpdate = async () => {
    try {
      const res = await VersionCheck.needUpdate();
      if (res.isNeeded) {
        setShowUpdateModal(true);
      } else {
        setUpdateModalVisible(true);
        setShowUpdateModal(false);
      }
    } catch (error) {
      setUpdateModalVisible(true);
      setShowUpdateModal(false);
    }
  };

  const handleUpdate = async () => {
    try {
      console.info('Checking for updates...');
      // Linking.openURL(updateUrl); // Add your app store link here
    } catch (error) {
      console.error('Play Store error:', error);
    } finally {
      setShowUpdateModal(false);
    }
  };

  // --- Logout Logic ---
  const handleConfirmLogout = () => {
    setLogoutModalVisible(false);
    dispatch(actionLogout());
    dispatch(clearCart());
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    );
  };

  // --- Delete Account Logic ---
  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      await dispatch(deleteAccount());
      setDeleteModalVisible(false);
      dispatch(actionLogout());
      dispatch(clearCart());
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(getProfile());
    setRefreshing(false);
  };

  // --- Unified Menu Items Array (Matching Figma Perfectly) ---
  const menuItems = [
    {
      id: 'profile',
      title: 'Your Profile',
      iconName: 'user',
      IconFamily: Feather,
      iconColor: '#FC6011',
      onPress: () => navigation.navigate('MyAccount'), 
    },
    {
      id: 'orders',
      title: 'Your Orders',
      iconName: 'shopping-cart',
      IconFamily: Feather,
      iconColor: '#FC6011',
      onPress: () => navigation.navigate('Reorder'),
    },
    // {
    //   id: 'wishlist',
    //   title: 'Wishlist',
    //   iconName: 'heart',
    //   IconFamily: Feather,
    //   iconColor: '#FC6011',
    //   onPress: () => console.log('Navigate to Wishlist'),
    // },
    {
      id: 'feedback',
      title: 'Give Feedback',
      iconName: 'message-square',
      IconFamily: Feather,
      iconColor: '#FC6011',
      onPress: () => navigation.navigate('Feedback'),
    },
    // {
    //   id: 'support',
    //   title: 'Support',
    //   iconName: 'user', // "headphones" or "life-buoy" also work based on your preference
    //   IconFamily: Feather,
    //   iconColor: '#FC6011',
    //   onPress: () => navigation.navigate('Support'),
    // },
    {
      id: 'updates',
      title: 'App Updates',
      iconName: 'refresh-cw',
      IconFamily: Feather,
      iconColor: '#FC6011',
      onPress: handleCheckForUpdate,
    },
    {
      id: 'logout',
      title: 'Logout',
      iconName: 'power',
      IconFamily: Feather,
      iconColor: '#FC6011',
      onPress: () => setLogoutModalVisible(true),
    },
    // Legal & Information (Rendered below standard items)
    // {
    //   id: 'about',
    //   title: 'About Us',
    //   iconName: 'information-outline',
    //   IconFamily: MaterialCommunityIcons,
    //   iconColor: '#FC6011',
    //   onPress: () => navigation.navigate('AboutUs'),
    //   isExternal: false,
    // },
    // {
    //   id: 'privacy',
    //   title: 'Privacy Policy',
    //   iconName: 'shield-account',
    //   IconFamily: MaterialCommunityIcons,
    //   iconColor: '#FC6011',
    //   onPress: () => navigation.navigate('PrivacyPolicy'),
    //   isExternal: false,
    // },
    // {
    //   id: 'terms',
    //   title: 'Terms and Conditions',
    //   iconName: 'file-document-outline',
    //   IconFamily: MaterialCommunityIcons,
    //   iconColor: '#FC6011',
    //   onPress: () => navigation.navigate('TermsConditions'),
    //   isExternal: false,
    // },
    {
      id: 'refund',
      title: 'Refund Policy',
      iconName: 'credit-card-refund-outline',
      IconFamily: MaterialCommunityIcons,
      iconColor: '#FC6011',
      onPress: () => navigation.navigate('RefundPolicy'),
      isExternal: false,
    },
  ];

  // Auth specific buttons (Delete Account)
  if (customerId) {
    menuItems.push({
      id: 'delete',
      title: 'Delete Account',
      iconName: 'trash-2',
      IconFamily: Feather,
      iconColor: '#FF4B4B',
      onPress: () => setDeleteModalVisible(true),
    });
  } else {
    menuItems.push({
      id: 'login',
      title: 'Login',
      iconName: 'log-in',
      IconFamily: Feather,
      iconColor: '#0EAF50',
      onPress: () => navigation.navigate('Register1', { isFromCart: true }),
    });
  }

  console.log(profile,">>>>>>>>>>>>>>>>>>profile");

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* 1. TOP HEADER SECTION (White Background) */}
      <View style={[styles.profileHeader, { marginTop: insets.top + 20 }]}>
        <Image 
          source={profile?.profile_image ? { uri: profile.profile_image } : require("../daddy/tabassets/dummy-profile.png")} 
          style={styles.profileImage}
        />
        <Text style={styles.profileName} numberOfLines={1}>
          {profile?.customer_name || userDetails?.name || 'Hello User'}
        </Text>
      </View>

      {/* 2. MAIN SCROLLABLE CONTENT */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#08B341']} />}
      >
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <MenuListItem 
              key={item.id}
              title={item.title}
              iconName={item.iconName}
              IconFamily={item.IconFamily}
              iconColor={item.iconColor}
              onPress={item.onPress}
              isExternal={item.isExternal}
            />
          ))}

          {/* App Version Display */}
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>
              App Version: {appVersion || '1.0.0'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ========================================== */}
      {/* MODALS PRESERVED FROM ORIGINAL CODE */}
      {/* ========================================== */}
      
      <CustomModal
        visible={updateModalVisible}
        title={showUpdateModal ? 'Update Available' : 'App Updated'}
        message={
          showUpdateModal
            ? 'A new version is available. Please update now!'
            : "You're using the latest version of Fresh Grab"
        }
        confirmText="OK"
        onConfirm={() => setUpdateModalVisible(false)}
        showCancel={false}
        cancelText=""
      />

      <CustomModal
        visible={logoutModalVisible}
        title="Logout"
        message="Are you sure do you want to logout?"
        onConfirm={handleConfirmLogout}
        onCancel={() => setLogoutModalVisible(false)}
        confirmText="Logout"
        cancelText="Cancel"
      />

      <CustomModal
        visible={showUpdateModal}
        title="Update Available"
        message="A new version of Fresh Grab is available. Please update to continue using all features."
        confirmText="Update Now"
        onConfirm={handleUpdate}
        onCancel={() => setShowUpdateModal(false)}
        cancelText="Later"
      />

      <CustomModal
        visible={deleteModalVisible}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDeleteAccount}
        onCancel={() => setDeleteModalVisible(false)}
        cancelText="Cancel"
        confirmButtonColor="#FF4B4B" 
      />

    </View>
  );
};

// ==========================================
// STYLES (MAPPED TO NEW FIGMA UI)
// ==========================================
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },

  // --- Header Profile Info ---
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24, 
    gap: 20,
    marginBottom: 24,
  },
  profileImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E0E0E0',
  },
  profileName: {
    fontFamily: 'Rubik-SemiBold', 
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 24,
    color: '#2D2D2D', 
    flex: 1,
  },

  // --- Scroll Content & Menu Container ---
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 120, // Padding for bottom tabs
    alignItems: 'center',
  },
  menuContainer: {
    width: wp('100%'), 
    paddingHorizontal: 24, // Keeps list aligned with header
  },
  
  // --- Reusable Menu List Item ---
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 0.8,
    borderBottomColor: '#A3A3A3', // Figma specified color
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, 
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    fontFamily: 'Rubik-Medium',
    fontWeight: '500',
    fontSize: 18, // Figma specified size
    lineHeight: 21,
    color: '#000000',
  },

  // --- App Version ---
  versionContainer: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.6,
  },
  versionText: {
    fontSize: 14,
    color: '#3D3D3D',
    fontFamily: 'SF Pro Display',
    fontWeight: '500',
  },
});

export default ProfileScreen;