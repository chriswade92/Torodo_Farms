import { StyleSheet, ScrollView, Image, TouchableOpacity, Text, TextInput, View, Alert, Platform, Linking, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useCart } from '@/hooks/useCart';

const featuredProducts = [
  {
    id: 1,
    name: 'Fresh Milk',
    prices: {
      '1L': 'CFA 1000',
      '10L': 'CFA 8000'
    },
    image: 'https://www.dairyfarmers.ca/sites/default/files/styles/header_image_1025_x_400_/public/header-images/AdobeStock_279692163_1.jpeg?itok=G2sjbwaY',
  },
  {
    id: 2,
    name: 'Lait Caillé (Soow)',
    prices: {
      '1L': 'CFA 1000',
      '10L': 'CFA 8000'
    },
    image: 'https://static.toiimg.com/thumb/msid-98787812,width-1280,height-720,resizemode-4/98787812.jpg',
  }
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [subscriptionForm, setSubscriptionForm] = useState({
    name: '',
    phone: '',
    address: '',
    deliveryTime: 'morning',
    startDate: new Date(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const validateForm = () => {
    const newErrors = {
      name: '',
      phone: '',
      address: '',
    };
    let isValid = true;

    if (!subscriptionForm.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!subscriptionForm.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(subscriptionForm.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
      isValid = false;
    }

    if (!subscriptionForm.address.trim()) {
      newErrors.address = 'Delivery address is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setSubscriptionForm(prev => ({ ...prev, startDate: selectedDate }));
    }
  };

  const handleSubscribe = async () => {
    if (!validateForm()) {
      return;
    }

    Alert.alert(
      'Confirm Subscription',
      `Name: ${subscriptionForm.name}\nPhone: ${subscriptionForm.phone}\nAddress: ${subscriptionForm.address}\nDelivery Time: ${subscriptionForm.deliveryTime}\nStart Date: ${subscriptionForm.startDate.toLocaleDateString()}\n\nProceed to payment?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Proceed to Payment',
          onPress: async () => {
            setIsProcessingPayment(true);
            try {
              // Open Wave payment link
              await Linking.openURL('https://pay.wave.com/m/M_sn_R_TKbBC1MtLt/c/sn/');
              
              // Show success message
              Alert.alert(
                'Subscription Request Received',
                'Thank you for your subscription request! Please complete the payment through Wave to activate your subscription. We will contact you shortly to confirm your subscription details.',
                [{ text: 'OK' }]
              );

              // Reset form
              setSubscriptionForm({
                name: '',
                phone: '',
                address: '',
                deliveryTime: 'morning',
                startDate: new Date(),
              });
              setErrors({
                name: '',
                phone: '',
                address: '',
              });
            } catch (error) {
              Alert.alert('Error', 'Could not open payment link. Please try again.');
            } finally {
              setIsProcessingPayment(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <ThemedView style={styles.heroSection}>
        <Image
          source={{ 
            uri: 'https://img.freepik.com/free-photo/fresh-dairy-products-wooden-table_114579-59197.jpg'
          }}
          style={styles.heroImage}
        />
        <ThemedView style={styles.heroContent}>
          <ThemedText type="title" style={styles.heroTitle}>
            Fresh Dairy Products
          </ThemedText>
          <ThemedText style={styles.heroSubtitle}>
            Get fresh milk and Lait Caillé delivered to your doorstep daily
          </ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Featured Products */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Our Products
        </ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productScroll}>
          {featuredProducts.map((product) => (
            <TouchableOpacity key={product.id} style={styles.productCard}>
              <Image
                source={{ uri: product.image }}
                style={styles.productImage}
                resizeMode="cover"
              />
              <ThemedView style={styles.productContent}>
                <ThemedText style={styles.productName}>{product.name}</ThemedText>
                <ThemedView style={styles.pricesContainer}>
                  <ThemedText style={styles.priceText}>1L: {product.prices['1L']}</ThemedText>
                  <ThemedText style={styles.priceText}>10L: {product.prices['10L']}</ThemedText>
                </ThemedView>
                <TouchableOpacity style={styles.orderButton}>
                  <Text style={styles.orderButtonText}>Order Now</Text>
                </TouchableOpacity>
              </ThemedView>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ThemedView>

      {/* Daily Offers */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Special Offer
        </ThemedText>
        <ThemedView style={styles.offerCard}>
          <Image
            source={{ 
              uri: 'https://img.freepik.com/free-photo/assorted-dairy-products-milk-yogurt-cottage-cheese-sour-cream_114579-28797.jpg'
            }}
            style={styles.offerImage}
          />
          <ThemedView style={styles.offerContent}>
            <ThemedText style={styles.offerTitle}>Daily Subscription</ThemedText>
            <ThemedText style={styles.offerDescription}>
              Subscribe for daily delivery and get special discounts! Choose your preferred delivery time and we'll ensure fresh dairy products reach your doorstep every day.
            </ThemedText>

            <ThemedView style={styles.subscriptionForm}>
              <View>
                <TextInput
                  style={[
                    styles.input,
                    errors.name ? styles.inputError : null
                  ]}
                  placeholder="Full Name"
                  value={subscriptionForm.name}
                  onChangeText={(text) => {
                    setSubscriptionForm(prev => ({ ...prev, name: text }));
                    setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  placeholderTextColor="#999"
                />
                {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
              </View>

              <View>
                <TextInput
                  style={[
                    styles.input,
                    errors.phone ? styles.inputError : null
                  ]}
                  placeholder="Phone Number"
                  value={subscriptionForm.phone}
                  onChangeText={(text) => {
                    setSubscriptionForm(prev => ({ ...prev, phone: text }));
                    setErrors(prev => ({ ...prev, phone: '' }));
                  }}
                  keyboardType="phone-pad"
                  placeholderTextColor="#999"
                />
                {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
              </View>

              <View>
                <TextInput
                  style={[
                    styles.input,
                    errors.address ? styles.inputError : null
                  ]}
                  placeholder="Delivery Address"
                  value={subscriptionForm.address}
                  onChangeText={(text) => {
                    setSubscriptionForm(prev => ({ ...prev, address: text }));
                    setErrors(prev => ({ ...prev, address: '' }));
                  }}
                  multiline
                  numberOfLines={2}
                  placeholderTextColor="#999"
                />
                {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}
              </View>
              
              <ThemedView style={styles.deliveryDateContainer}>
                <ThemedText style={styles.deliveryDateTitle}>Start Date:</ThemedText>
                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.datePickerText}>
                    {subscriptionForm.startDate.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={subscriptionForm.startDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                  />
                )}
              </ThemedView>

              <ThemedView style={styles.deliveryTimeContainer}>
                <ThemedText style={styles.deliveryTimeTitle}>Preferred Delivery Time:</ThemedText>
                <View style={styles.deliveryTimeButtons}>
                  <TouchableOpacity 
                    style={[
                      styles.timeButton,
                      subscriptionForm.deliveryTime === 'morning' && styles.selectedTimeButton
                    ]}
                    onPress={() => setSubscriptionForm(prev => ({ ...prev, deliveryTime: 'morning' }))}
                  >
                    <Text style={[
                      styles.timeButtonText,
                      subscriptionForm.deliveryTime === 'morning' && styles.selectedTimeText
                    ]}>Morning</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.timeButton,
                      subscriptionForm.deliveryTime === 'evening' && styles.selectedTimeButton
                    ]}
                    onPress={() => setSubscriptionForm(prev => ({ ...prev, deliveryTime: 'evening' }))}
                  >
                    <Text style={[
                      styles.timeButtonText,
                      subscriptionForm.deliveryTime === 'evening' && styles.selectedTimeText
                    ]}>Evening</Text>
                  </TouchableOpacity>
                </View>
              </ThemedView>

              <ThemedView style={styles.paymentNote}>
                <ThemedText style={styles.paymentNoteText}>
                  Note: Payment will be processed through Wave. After submitting the form, you will be redirected to complete the payment.
                </ThemedText>
              </ThemedView>

              <TouchableOpacity 
                style={[
                  styles.subscribeButton,
                  isProcessingPayment && styles.subscribeButtonDisabled
                ]}
                onPress={handleSubscribe}
                disabled={isProcessingPayment}
              >
                <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  heroSection: {
    height: 250,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 8,
  },
  heroSubtitle: {
    color: '#fff',
    fontSize: 16,
  },
  section: {
    padding: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  productScroll: {
    flexDirection: 'row',
  },
  productCard: {
    width: 250,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 150,
  },
  productContent: {
    padding: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pricesContainer: {
    marginBottom: 12,
  },
  priceText: {
    fontSize: 14,
    color: '#2ecc71',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderButton: {
    backgroundColor: '#2ecc71',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  offerCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  offerImage: {
    width: '100%',
    height: 200,
  },
  offerContent: {
    padding: 16,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  offerDescription: {
    fontSize: 14,
    color: '#666',
  },
  subscriptionForm: {
    marginTop: 16,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  deliveryDateContainer: {
    marginBottom: 16,
  },
  deliveryDateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  datePickerButton: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  deliveryTimeContainer: {
    marginBottom: 16,
  },
  deliveryTimeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  deliveryTimeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  timeButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedTimeButton: {
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
  },
  timeButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  selectedTimeText: {
    color: '#fff',
  },
  subscribeButton: {
    backgroundColor: '#2ecc71',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  paymentNote: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  paymentNoteText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
  subscribeButtonDisabled: {
    opacity: 0.7,
  },
});
