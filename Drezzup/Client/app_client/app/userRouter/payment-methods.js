import Header from '@/components/common/Header';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const mockPaymentMethods = [
  { id: 'cod', name: 'Thanh toán khi nhận hàng (COD)', icon: 'cash-outline' },
  { id: 'credit_card', name: 'Thẻ tín dụng/ghi nợ', icon: 'card-outline' },
  { id: 'momo', name: 'Momo', icon: 'wallet-outline' },
  { id: 'zalopay', name: 'ZaloPay', icon: 'wallet-outline' },
  { id: 'bank_transfer', name: 'Chuyển khoản ngân hàng', icon: 'business-outline' },
];

const PaymentMethodsScreen = () => {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState('cod'); // Default to COD

  const handleConfirmSelection = () => {
    router.push({
      pathname: '/userRouter/checkout',
      params: { selectedPaymentMethod: selectedMethod }
    });
  };

  const renderPaymentMethodItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.methodItem,
        selectedMethod === item.id && styles.selectedMethodItem,
      ]}
      onPress={() => setSelectedMethod(item.id)}
    >
      <Ionicons name={item.icon} size={24} color={selectedMethod === item.id ? Colors.primary : '#333'} style={styles.methodIcon} />
      <Text style={styles.methodName}>{item.name}</Text>
      {selectedMethod === item.id && (
        <Ionicons name="checkmark-circle" size={24} color={Colors.primary} style={styles.checkmarkIcon} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="Phương thức thanh toán"
        showBackButton={true}
        onBack={() => router.back()}
      />
      <FlatList
        data={mockPaymentMethods}
        keyExtractor={(item) => item.id}
        renderItem={renderPaymentMethodItem}
        contentContainerStyle={styles.methodList}
      />
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmSelection}
        >
          <Text style={styles.confirmButtonText}>Xác nhận</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  methodList: {
    padding: 15,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedMethodItem: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  methodIcon: {
    marginRight: 15,
  },
  methodName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  checkmarkIcon: {
    marginLeft: 10,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
    marginBottom:10,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaymentMethodsScreen;