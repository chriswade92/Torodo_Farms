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
  Image,
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

        {/* Dark header with logo */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={22} color={Colors.primaryLight} />
          </TouchableOpacity>
          <Image
            source={require('../../pictures/IMG-20250404-WA0000.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.tagline}>Join Torodo Farms for fresh daily deliveries</Text>
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
  scrollContainer: { flexGrow: 1 },
  header: {
    backgroundColor: Colors.dark,
    alignItems: 'center',
    paddingTop: 56,
    paddingBottom: 28,
    paddingHorizontal: 24,
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    top: 56,
    left: 20,
    padding: 8,
    zIndex: 1,
  },
  logo: {
    width: 180,
    height: 90,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 13,
    color: Colors.primaryLight,
    textAlign: 'center',
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1.5,
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
    borderRadius: 14,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  registerButtonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700', letterSpacing: 0.3 },
  loginLink: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginLinkText: { fontSize: 14, color: Colors.subText },
  loginLinkAction: { fontSize: 14, color: Colors.primary, fontWeight: '700' },
});

export default RegisterScreen;
