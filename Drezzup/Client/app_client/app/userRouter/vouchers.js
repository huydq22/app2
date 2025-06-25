import Header from '@/components/common/Header';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data for vouchers - replace with API call in a real application
const mockVouchers = [
  { id: 'VOUCHER10', code: 'SALE10', value: 10, type: 'percent', expiry: '2025-12-31', description: 'Giảm 10% cho mọi đơn hàng' },
  { id: 'VOUCHER50K', code: 'FREE50K', value: 50000, type: 'fixed', expiry: '2025-11-30', description: 'Giảm 50.000đ cho đơn hàng trên 200.000đ' },
  { id: 'NEWUSER20', code: 'WELCOME20', value: 20, type: 'percent', expiry: '2025-10-15', description: 'Giảm 20% cho khách hàng mới' },
  { id: 'SHIPFREE', code: 'FREESHIP', value: 0, type: 'shipping', expiry: '2025-09-01', description: 'Miễn phí vận chuyển' },
];

const VoucherScreen = () => {
  const router = useRouter();
  const [vouchers, setVouchers] = useState(mockVouchers);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [voucherCodeInput, setVoucherCodeInput] = useState('');

  const handleApplyVoucher = () => {
    const foundVoucher = vouchers.find(v => v.code === voucherCodeInput.toUpperCase());
    if (foundVoucher) {
      setSelectedVoucher(foundVoucher);
      Alert.alert('Áp dụng thành công', `Đã áp dụng voucher: ${foundVoucher.description}`);
    } else {
      setSelectedVoucher(null);
      Alert.alert('Lỗi', 'Mã voucher không hợp lệ hoặc đã hết hạn.');
    }
  };

  const renderVoucherItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.voucherItem, selectedVoucher?.id === item.id && styles.selectedVoucherItem]}
      onPress={() => setSelectedVoucher(item)}
    >
      <View style={styles.voucherContent}>
        <Text style={styles.voucherCode}>{item.code}</Text>
        <Text style={styles.voucherDescription}>{item.description}</Text>
        <Text style={styles.voucherExpiry}>HSD: {item.expiry}</Text>
      </View>
      {selectedVoucher?.id === item.id && (
        <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="Phiếu giảm giá"
        showBackButton={true}
        onBack={() => router.back()}
      />
      <View style={styles.inputSection}>
        <TextInput
          style={styles.voucherInput}
          placeholder="Nhập mã giảm giá của bạn"
          placeholderTextColor="#999"
          value={voucherCodeInput}
          onChangeText={setVoucherCodeInput}
          autoCapitalize="characters"
        />
        <TouchableOpacity style={styles.applyButton} onPress={handleApplyVoucher}>
          <Text style={styles.applyButtonText}>Áp dụng</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={vouchers}
        keyExtractor={(item) => item.id}
        renderItem={renderVoucherItem}
        contentContainerStyle={styles.voucherList}
        ListEmptyComponent={<Text style={styles.emptyText}>Không có phiếu giảm giá nào.</Text>}
      />

      {selectedVoucher && (
        <View style={styles.footer}>
          <Text style={styles.selectedVoucherText}>
            Đã chọn: {selectedVoucher.description}
          </Text>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => {
              // In a real app, you would pass the selected voucher back to the checkout screen
              router.push({
                pathname: '/checkout',
                params: { appliedVoucher: JSON.stringify(selectedVoucher) }
              });
            }}
          >
            <Text style={styles.confirmButtonText}>Xác nhận & Quay lại thanh toán</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  inputSection: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  voucherInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
  },
  applyButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  voucherList: {
    padding: 15,
  },
  voucherItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  selectedVoucherItem: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  voucherContent: {
    flex: 1,
    marginRight: 10,
  },
  voucherCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  voucherDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  voucherExpiry: {
    fontSize: 12,
    color: '#999',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  selectedVoucherText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    fontWeight: 'bold',
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

export default VoucherScreen;