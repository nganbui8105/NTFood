import React from 'react';
import { Text } from 'react-native';
import { Provider } from 'react-redux';
import { TamaguiProvider } from 'tamagui';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import tamaguiConfig from './tamagui.config';
import { store } from './src/redux/store';
import { RootStackParamList } from './src/types';

import { LoginScreen, RegisterScreen, SplashWelcomeScreen } from './src/screens/AuthScreens';
import { HomeScreen } from './src/screens/HomeScreen';
import { AIChatAdvisorScreen, SearchFilterScreen } from './src/screens/ExploreAIScreens';
import { FoodDetailScreen, RestaurantDetailScreen } from './src/screens/DetailScreens';
import { CartScreen, CheckoutScreen } from './src/screens/CartCheckoutScreens';
import { OrderTrackingScreen, ProfileFavoritesScreen } from './src/screens/OrderProfileScreens';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#EE4D2D',
        tabBarInactiveTintColor: '#888888',
        headerStyle: { backgroundColor: '#EE4D2D' },
        headerTintColor: '#FFFFFF',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Trang chủ',
          headerShown: false,
          tabBarIcon: () => <Text style={{ fontSize: 18 }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="SearchFilter"
        component={SearchFilterScreen}
        options={{
          title: 'Tìm kiếm',
          tabBarIcon: () => <Text style={{ fontSize: 18 }}>🔍</Text>,
        }}
      />
      <Tab.Screen
        name="AIChatAdvisor"
        component={AIChatAdvisorScreen}
        options={{
          title: 'Trợ lý AI',
          tabBarIcon: () => <Text style={{ fontSize: 18 }}>🤖</Text>,
        }}
      />
      <Tab.Screen
        name="OrderTracking"
        component={OrderTrackingScreen}
        options={{
          title: 'Đơn hàng',
          tabBarIcon: () => <Text style={{ fontSize: 18 }}>🛵</Text>,
        }}
      />
      <Tab.Screen
        name="ProfileFavorites"
        component={ProfileFavoritesScreen}
        options={{
          title: 'Tôi',
          tabBarIcon: () => <Text style={{ fontSize: 18 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="SplashWelcome"
              screenOptions={{
                headerStyle: { backgroundColor: '#EE4D2D' },
                headerTintColor: '#FFFFFF',
              }}
            >
              <Stack.Screen name="SplashWelcome" component={SplashWelcomeScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Đăng nhập' }} />
              <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Đăng ký tài khoản' }} />
              <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
              <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} options={{ title: 'Chi tiết Quán ăn' }} />
              <Stack.Screen name="FoodDetail" component={FoodDetailScreen} options={{ title: 'Chi tiết Món ăn' }} />
              <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Giỏ hàng của bạn' }} />
              <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Xác nhận Thanh toán' }} />
            </Stack.Navigator>
          </NavigationContainer>
        </TamaguiProvider>
      </Provider>
    </SafeAreaProvider>
  );
}