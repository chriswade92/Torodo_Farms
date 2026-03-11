import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '../../constants/Colors';
import Icon from 'react-native-vector-icons/Feather';
import { updateProfile, logout } from '../../store/slices/authSlice';

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector(state => state.auth);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
  });
  const [saving, setSaving] = useState(false);

  const getInitials = (name = '') =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    setSaving(true);
    try {
      await dispatch(updateProfile({
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: {
          street: form.street.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          country: 'Senegal',
        },
      })).unwrap();
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => dispatch(logout()),
        },
      ]
    );
  };

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      {/* Profile Info */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          {!editing ? (
            <TouchableOpacity onPress={() => setEditing(true)}>
              <Icon name="edit-2" size={18} color={Colors.primary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setEditing(false)}>
              <Icon name="x" size={18} color={Colors.subText} />
            </TouchableOpacity>
          )}
        </View>

        {editing ? (
          <View style={styles.editForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  value={form.name}
                  onChangeText={v => update('name', v)}
                  placeholderTextColor={Colors.subText}
                />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  value={form.phone}
                  onChangeText={v => update('phone', v)}
                  keyboardType="phone-pad"
                  placeholderTextColor={Colors.subText}
                />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Street Address</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  value={form.street}
                  onChangeText={v => update('street', v)}
                  placeholder="Street address"
                  placeholderTextColor={Colors.subText}
                />
              </View>
            </View>
            <View style={styles.twoCol}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>City</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    style={styles.input}
                    value={form.city}
                    onChangeText={v => update('city', v)}
                    placeholder="City"
                    placeholderTextColor={Colors.subText}
                  />
                </View>
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>State</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    style={styles.input}
                    value={form.state}
                    onChangeText={v => update('state', v)}
                    placeholder="State"
                    placeholderTextColor={Colors.subText}
                  />
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.saveButton, saving && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color={Colors.secondary} />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.infoRows}>
            <InfoRow icon="user" label="Name" value={user?.name} />
            <InfoRow icon="mail" label="Email" value={user?.email} />
            <InfoRow icon="phone" label="Phone" value={user?.phone || 'Not set'} />
            {user?.address?.street && (
              <InfoRow
                icon="map-pin"
                label="Address"
                value={`${user.address.street}, ${user.address.city}, ${user.address.state}`}
              />
            )}
          </View>
        )}
      </View>

      {/* Account Options */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account</Text>
        <View style={styles.optionsList}>
          <OptionRow icon="shopping-bag" label="My Orders" onPress={() => navigation.navigate('Orders')} />
          <OptionRow icon="bell" label="Notifications" onPress={() => Alert.alert('Notifications', 'Push notifications coming soon!')} />
          <OptionRow icon="shield" label="Privacy Policy" onPress={() => Alert.alert('Privacy Policy', 'Your data is safe with Torodo Farms.')} />
          <OptionRow icon="help-circle" label="Help & Support" onPress={() => Alert.alert('Help & Support', 'Contact us at support@torodofarms.com')} />
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out" size={20} color={Colors.accentPink} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Torodo Farms v1.0.0</Text>
    </ScrollView>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <Icon name={icon} size={16} color={Colors.primary} style={{ width: 22 }} />
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || '—'}</Text>
    </View>
  </View>
);

const OptionRow = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.optionRow} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.optionLeft}>
      <View style={styles.optionIconBox}>
        <Icon name={icon} size={16} color={Colors.primary} />
      </View>
      <Text style={styles.optionLabel}>{label}</Text>
    </View>
    <Icon name="chevron-right" size={16} color={Colors.subText} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  avatarSection: { alignItems: 'center', paddingVertical: 28 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: { fontSize: 28, fontWeight: 'bold', color: Colors.secondary },
  userName: { fontSize: 20, fontWeight: '700', color: Colors.text },
  userEmail: { fontSize: 14, color: Colors.subText, marginTop: 4 },
  card: {
    backgroundColor: Colors.secondary,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: Colors.text },
  infoRows: { gap: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  infoLabel: { fontSize: 11, color: Colors.subText, marginBottom: 2 },
  infoValue: { fontSize: 14, color: Colors.text, fontWeight: '500' },
  editForm: { gap: 10 },
  inputGroup: { gap: 4 },
  inputLabel: { fontSize: 12, color: Colors.subText, fontWeight: '500' },
  inputBox: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    height: 44,
    justifyContent: 'center',
  },
  input: { fontSize: 14, color: Colors.text },
  twoCol: { flexDirection: 'row', gap: 10 },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  buttonDisabled: { opacity: 0.6 },
  saveButtonText: { color: Colors.secondary, fontSize: 15, fontWeight: '600' },
  optionsList: { gap: 4 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  optionIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLabel: { fontSize: 14, color: Colors.text, fontWeight: '500' },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: Colors.accentPink + '15',
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.accentPink + '30',
  },
  logoutText: { fontSize: 16, fontWeight: '600', color: Colors.accentPink },
  version: { textAlign: 'center', fontSize: 12, color: Colors.subText, marginBottom: 32 },
});

export default ProfileScreen;
