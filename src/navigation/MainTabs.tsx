import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ShopStack } from '@navigation/ShopStack';
import { CartScreen } from '@screens/CartScreen';
import { MeScreen } from '@screens/MeScreen';
import { useCartStore } from '@stores/cartStore';
import { theme } from '@constants/theme';
import { VARIANT } from '@constants/student';

export type MainTabsParamList = {
  ShopTab: undefined;
  CartTab: undefined;
  MeTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

export const MainTabs: React.FC = () => {
  const totalQuantity = useCartStore((s) => s.getTotalQuantity());

  const shopScreen = (
    <Tab.Screen
      key="ShopTab"
      name="ShopTab"
      component={ShopStack}
      options={{
        title: 'Cửa hàng',
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>🏪</Text>,
      }}
    />
  );

  const cartScreen = (
    <Tab.Screen
      key="CartTab"
      name="CartTab"
      component={CartScreen}
      options={{
        title: 'Giỏ hàng',
        tabBarBadge: totalQuantity > 0 ? totalQuantity : undefined,
        tabBarBadgeStyle: {
          backgroundColor: theme.colors.secondary,
          color: '#FFFFFF',
          fontSize: 10,
          fontWeight: '700',
        },
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>🛒</Text>,
      }}
    />
  );

  const meScreen = (
    <Tab.Screen
      key="MeTab"
      name="MeTab"
      component={MeScreen}
      options={{
        title: 'Tôi',
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>👤</Text>,
      }}
    />
  );

  // Tab order based on VARIANT: 'cartFirst' or 'shopFirst'
  const screens =
    VARIANT.tabOrder === 'cartFirst'
      ? [cartScreen, shopScreen, meScreen]
      : [shopScreen, cartScreen, meScreen];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textLight,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      }}
    >
      {screens}
    </Tab.Navigator>
  );
};

export default MainTabs;
