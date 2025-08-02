import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, Pressable, Platform, StyleSheet, SafeAreaView} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import User from './User';
import HomeSvg from './HomeSvg';
import Reorder from './Reorder';
import Categoreis from './Categories';
import Cart from './Cart';
import UserHome from './UserHome';
import CartScreen from './CartScreen';
import HomeInactive from './tabassets/HomeInactive';
import ReorderInactive from './tabassets/ReorderInactive';
import CategoryInactive from './tabassets/CategoryInactive';
import CartInactive from './tabassets/CartInactive';
import UserActive from './tabassets/UserActive';
import ReorderScreen from './ReorderScreen';
import ProfileScreen from './ProfileScreen';
import CategoriesScreen from './CategoriesScreen';
import { useSelector } from 'react-redux';
import commonStyles from '../../commonstyles/CommonStyles';

const Tab = createBottomTabNavigator();

export default function BottomNavigation() {
  const { cartItems } = useSelector((state) => state.Dashboard);
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}} edges={['bottom']}>
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarButton: props => (
            <Pressable
              {...props}
              android_ripple={null} 
              style={({pressed}) => [
                props.style,
                {opacity: pressed ? 1 : 1},
              ]}
            />
          ),
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? <HomeSvg color={commonStyles.btn2Color} /> : <HomeInactive />;
            } else if (route.name === 'Reorder') {
              iconName = focused ? <ReorderInactive color={commonStyles.btn2Color}/> : <Reorder />;
            } else if (route.name === 'Categories') {
              iconName = focused ? (
                <CategoryInactive color={commonStyles.btn2Color}/>
              ) : (
                <Categoreis/>
              );
            } else if (route.name === 'Cart') {
              iconName = (
                <View>
                  {focused ? <CartInactive color={commonStyles.btn2Color}/> : <Cart />}
                  {cartItems.length > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {cartItems?.reduce((sum, item) => sum + Number(item.quantity), 0)}
                      </Text>
                    </View>
                  )}
                </View>
              );
            } else if (route.name === 'Profile') {
              iconName = focused ? <UserActive /> : <User />;
            }
            return iconName;
          },
          tabBarActiveTintColor: commonStyles.btn2Color,
          tabBarInactiveTintColor: 'gray',
          tabBarLabelStyle: {fontSize: 12, fontWeight: '700'},
          tabBarStyle: {
            height: (Platform.OS === 'ios' ? 85 : 60) + insets.bottom,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 0,
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#E5E5E5',
            paddingBottom: insets.bottom,
          },
          tabBarHideOnKeyboard: true,
          contentStyle: {
            // paddingBottom: Platform.OS === 'ios' ? 85 : 60,
          },
        })}>
        <Tab.Screen 
          name="Home" 
          component={UserHome}
          options={{
            tabBarLabel: 'Home',
            contentStyle: {
              // paddingBottom: Platform.OS === 'ios' ? 85 : 60,
            },
          }}
        />
        <Tab.Screen 
          name="Reorder" 
          component={ReorderScreen}
          options={{
            tabBarLabel: 'Orders',
            contentStyle: {
              // paddingBottom: Platform.OS === 'ios' ? 85 : 60,
            },
          }}
        />
        <Tab.Screen 
          name="Categories" 
          component={CategoriesScreen}
          options={{
            tabBarLabel: 'Categories',
            contentStyle: {
              // paddingBottom: Platform.OS === 'ios' ? 85 : 60,
            },
          }}
        />
        <Tab.Screen 
          name="Cart" 
          component={CartScreen}
          options={{
            tabBarLabel: 'Cart',
            contentStyle: {
              // paddingBottom: Platform.OS === 'ios' ? 85 : 60,
            },
          }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profile',
            contentStyle: {
              // paddingBottom: Platform.OS === 'ios' ? 85 : 60,
            },
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: commonStyles.btn2Color,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});
