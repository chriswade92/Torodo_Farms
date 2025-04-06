import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

export default function SignUp() {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    deliveryAddress: '',
    password: '',
  });

  const handleSignUp = async () => {
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.phoneNumber || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    // Phone number validation (simple check for now)
    if (!/^\d{10,}$/.test(formData.phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const success = await signUp({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phoneNumber,
        email: formData.email,
        address: formData.deliveryAddress,
        password: formData.password,
      });

      if (success) {
        router.replace('/(app)');
      } else {
        Alert.alert('Error', 'Failed to create account. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while creating your account');
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image 
            source={require('../../assets/images/logo.jpg')}
            style={styles.logo}
          />
          <Text style={styles.title}>TorodoFarms</Text>
        </View>

        <Text style={styles.subtitle}>Create Account</Text>

        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#666"
          value={formData.firstName}
          onChangeText={(text) => setFormData({ ...formData, firstName: text })}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#666"
          value={formData.lastName}
          onChangeText={(text) => setFormData({ ...formData, lastName: text })}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#666"
          value={formData.phoneNumber}
          onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
          keyboardType="phone-pad"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Email (Optional)"
          placeholderTextColor="#666"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Delivery Address"
          placeholderTextColor="#666"
          value={formData.deliveryAddress}
          onChangeText={(text) => setFormData({ ...formData, deliveryAddress: text })}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          secureTextEntry
          editable={!loading}
        />

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.guestButton]} 
          onPress={() => router.replace('/(app)')}
          disabled={loading}
        >
          <Text style={styles.guestButtonText}>Continue as Guest</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkContainer}
          onPress={() => router.replace('/(auth)/sign-in')}
          disabled={loading}
        >
          <Text style={styles.linkText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20
  },
  scrollContent: {
    flexGrow: 1
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#90C641',
    marginTop: 10
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#90C641',
    marginBottom: 20
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333'
  },
  button: {
    backgroundColor: '#90C641',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    height: 50,
    justifyContent: 'center'
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  guestButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    height: 50,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#90C641',
  },
  guestButtonText: {
    color: '#90C641',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkContainer: {
    marginTop: 15,
    alignItems: 'center'
  },
  linkText: {
    color: '#90C641',
    fontSize: 16
  }
}); 