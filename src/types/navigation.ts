import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  MainApp: NavigatorScreenParams<TabParamList>;
};

export type TabParamList = {
  Home: undefined;
  Stock: undefined;
  Customers: NavigatorScreenParams<CustomerStackParamList>;
  Subscriptions: undefined;
  Settings: undefined;
};

export type CustomerStackParamList = {
  CustomerList: undefined;
  CustomerDetails: {
    customerId: string;
  };
}; 