import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../store/slices/authSlice';
import { Colors } from '../../constants/Colors';
import Icon from 'react-native-vector-icons/Feather';

const RegisterScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter a valid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    try {
      await dispatch(register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
      })).unwrap();
    } catch (error) {
      Alert.alert('Registration Failed', error);
    }
  };

  const update = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={22} color={Colors.text} />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Icon name="droplet" size={50} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Torodo Farms for fresh daily deliveries</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={[styles.inputContainer, errors.name && styles.inputError]}>
            <Icon name="user" size={20} color={Colors.subText} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full name"
              placeholderTextColor={Colors.subText}
              value={formData.name}
              onChangeText={v => update('name', v)}
              autoCapitalize="words"
            />
          </View>
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

          <View style={[styles.inputContainer, errors.email && styles.inputError]}>
            <Icon name="mail" size={20} color={Colors.subText} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor={Colors.subText}
              value={formData.email}
              onChangeText={v => update('email', v)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

          <View style={[styles.inputContainer, errors.phone && styles.inputError]}>
            <Icon name="phone" size={20} color={Colors.subText} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Phone number"
              placeholderTextColor={Colors.subText}
              value={formData.phone}
              onChangeText={v => update('phone', v)}
              keyboardType="phone-pad"
            />
          </View>
          {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}

          <View style={[styles.inputContainer, errors.password && styles.inputError]}>
            <Icon name="lock" size={20} color={Colors.subText} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password (min 6 characters)"
              placeholderTextColor={Colors.subText}
              value={formData.password}
              onChangeText={v => update('password', v)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
              <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color={Colors.subText} />
            </TouchableOpacity>
          </View>
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

          <View style={[styles.inputContainer, errors.confirmPassword && styles.inputError]}>
            <Icon name="lock" size={20} color={Colors.subText} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor={Colors.subText}
              value={formData.confirmPassword}
              onChangeText={v => update('confirmPassword', v)}
              secureTextEntry={!showConfirm}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirm(!showConfirm)}>
              <Icon name={showConfirm ? 'eye-off' : 'eye'} size={20} color={Colors.subText} />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

          <TouchableOpacity
            style={[styles.registerButton, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.registerButtonText}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginLink}>
            <Text style={styles.loginLinkText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLinkAction}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 24 },
  header: { alignItems: 'center', paddingTop: 50, paddingBottom: 28, position: 'relative' },
  backBtn: { position: 'absolute', top: 50, left: 0, padding: 8 },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 26, fontWeight: 'bold', color: Colors.text, marginBottom: 8 },
  subtitle: { fontSize: 15, color: Colors.subText, textAlign: 'center', lineHeight: 22 },
  formContainer: { paddingBottom: 40 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 4,
    paddingHorizontal: 16,
    height: 56,
  },
  inputError: { borderColor: Colors.error },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: Colors.text },
  eyeIcon: { padding: 4 },
  errorText: { fontSize: 12, color: Colors.error, marginBottom: 10, marginLeft: 4 },
  registerButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  registerButtonText: { color: Colors.secondary, fontSize: 16, fontWeight: '600' },
  loginLink: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginLinkText: { fontSize: 14, color: Colors.subText },
  loginLinkAction: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
});

export default RegisterScreen;
