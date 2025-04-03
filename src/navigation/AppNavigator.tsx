import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@contexts/ThemeContext';

// Import your screens
import { HomeScreen } from '@screens/HomeScreen';
import { StockScreen } from '@screens/StockScreen';
import { CustomerScreen } from '@screens/CustomerScreen';
import { CustomerDetailsScreen } from '@screens/CustomerDetailsScreen';
import { SubscriptionScreen } from '@screens/SubscriptionScreen';
import { SettingsScreen } from '@screens/SettingsScreen';

// Import types
import { RootStackParamList, TabParamList, CustomerStackParamList } from '@types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const CustomerStack = createNativeStackNavigator<CustomerStackParamList>();

const CustomerStackNavigator = () => {
  return (
    <CustomerStack.Navigator>
      <CustomerStack.Screen
        name="CustomerList"
        component={CustomerScreen}
        options={{ title: 'Customers' }}
      />
      <CustomerStack.Screen
        name="CustomerDetails"
        component={CustomerDetailsScreen}
        options={{ title: 'Customer Details' }}
      />
    </CustomerStack.Navigator>
  );
};

const AppTabs = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Stock':
              iconName = focused ? 'cube' : 'cube-outline';
              break;
            case 'Customers':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Subscriptions':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Settings':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Stock" component={StockScreen} />
      <Tab.Screen
        name="Customers"
        component={CustomerStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Subscriptions" component={SubscriptionScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainApp"
        component={AppTabs}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}; 