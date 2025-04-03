import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Linking,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export const SettingsScreen: React.FC = () => {
  const { colors, isDark, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@milksalestracker.com');
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://milksalestracker.com/privacy');
  };

  const handleTermsOfService = () => {
    Linking.openURL('https://milksalestracker.com/terms');
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    onPress?: () => void,
    rightElement?: React.ReactNode
  ) => (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: colors.cardBackground }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingItemLeft}>
        <Ionicons name={icon} size={24} color={colors.primary} style={styles.icon} />
        <Text style={[styles.settingItemText, { color: colors.text }]}>{title}</Text>
      </View>
      {rightElement || (
        onPress && <Ionicons name="chevron-forward" size={20} color={colors.secondaryText} />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
        
        <View style={styles.setting}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isDark ? '#007AFF' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
        
        <TouchableOpacity style={styles.setting}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Stock Alerts</Text>
          <Switch
            value={true}
            onValueChange={() => {}}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor="#007AFF"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.setting}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Subscription Reminders</Text>
          <Switch
            value={true}
            onValueChange={() => {}}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor="#007AFF"
          />
        </TouchableOpacity>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Data</Text>
        
        <TouchableOpacity style={styles.setting}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Export Data</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.setting}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Clear All Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>Support</Text>
        {renderSettingItem('help-circle', 'Help Center', () => {})}
        {renderSettingItem('mail', 'Contact Support', handleContactSupport)}
        {renderSettingItem('star', 'Rate App', () => {})}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>Legal</Text>
        {renderSettingItem('document-text', 'Privacy Policy', handlePrivacyPolicy)}
        {renderSettingItem('document-text', 'Terms of Service', handleTermsOfService)}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>About</Text>
        {renderSettingItem('information-circle', 'Version', undefined, (
          <Text style={[styles.versionText, { color: colors.secondaryText }]}>1.0.0</Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  settingLabel: {
    fontSize: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 1,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  settingItemText: {
    fontSize: 16,
  },
  versionText: {
    fontSize: 16,
  },
}); 