import Header from '@/components/common/Header';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ReturnExchangeScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [order, setOrder] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const commonReasons = [
    'Sản phẩm không đúng kích thước',
    'Sản phẩm bị lỗi',
    'Sản phẩm không giống mô tả',
    'Sản phẩm bị hỏng khi nhận hàng',
    'Không vừa ý với chất lượng sản phẩm',
    'Muốn đổi sang sản phẩm khác',
    'Sai màu sắc',
  ];

  useEffect(() => {
    if (params.order) {
      try {
        const orderData = JSON.parse(params.order);
        console.log('Received order data in ReturnExchangeScreen:', orderData);
        setOrder(orderData);
        setLoading(false);
      } catch (error) {
        console.error('Error parsing order data:', error);
        Alert.alert('Lỗi', 'Không thể tải thông tin đơn hàng');
        setLoading(false);
      }
    } else {
      Alert.alert('Lỗi', 'Không có thông tin đơn hàng để đổi trả.');
      setLoading(false);
    }
  }, [params.order]);

  const handleSubmit = () => {
    if (!selectedProductId) {
      Alert.alert('Lỗi', 'Vui lòng chọn sản phẩm cần đổi trả.');
      return;
    }
    if (reason.trim().length === 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập lý do đổi trả.');
      return;
    }

    setSubmitting(true);
    // Simulate API call for return/exchange request
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert('Thành công', 'Yêu cầu đổi trả của bạn đã được gửi thành công!');
      router.back(); // Go back after submission
    }, 2000);
  };

  const handleCancelOrder = () => {
    Alert.alert(
      'Xác nhận hủy đơn hàng',
      'Bạn có chắc chắn muốn hủy đơn hàng này?',
      [
        {
          text: 'Không',
          style: 'cancel'
        },
        {
          text: 'Có, hủy đơn',
          style: 'destructive',
          onPress: async () => {
            setCancelling(true);
            try {
              // Simulate API call for order cancellation
              await new Promise(resolve => setTimeout(resolve, 1500));
              Alert.alert(
                'Thành công',
                'Đơn hàng đã được hủy thành công!',
                [
                  {
                    text: 'OK',
                    onPress: () => router.back()
                  }
                ]
              );
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể hủy đơn hàng. Vui lòng thử lại sau.');
            } finally {
              setCancelling(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Header 
          title="Yêu cầu đổi trả"
          showBackButton={true}
          onBack={() => router.back()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Đang tải thông tin đơn hàng...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Header 
          title="Yêu cầu đổi trả"
          showBackButton={true}
          onBack={() => router.back()}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Không thể tải thông tin đơn hàng.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header 
        title="Yêu cầu đổi trả"
        showBackButton={true}
        onBack={() => router.back()}
      />

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn sản phẩm</Text>
          {order.items.map((item) => (
            <TouchableOpacity
              key={`${item.name}-${item.price}`}
              style={[
                styles.productItem,
                selectedProductId === `${item.name}-${item.price}` && styles.selectedProductItem,
              ]}
              onPress={() => setSelectedProductId(`${item.name}-${item.price}`)}
            >
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price.toLocaleString('vi-VN')}đ</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lý do đổi trả</Text>
          <View style={styles.reasonOptions}>
            {commonReasons.map((commonReason) => (
              <TouchableOpacity
                key={commonReason}
                style={[
                  styles.reasonOption,
                  reason === commonReason && styles.selectedReasonOption,
                ]}
                onPress={() => setReason(commonReason)}
              >
                <Text style={[
                  styles.reasonOptionText,
                  reason === commonReason && styles.selectedReasonOptionText,
                ]}>
                  {commonReason}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.orText}>Hoặc nhập lý do khác:</Text>
          <TextInput
            style={styles.reasonInput}
            placeholder="Vui lòng nhập lý do đổi trả..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            value={reason}
            onChangeText={setReason}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.submitButton, styles.cancelButton]}
            onPress={handleCancelOrder}
            disabled={cancelling || submitting}
          >
            {cancelling ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Hủy đơn hàng</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.submitButton, { marginTop: 10 }]}
            onPress={handleSubmit}
            disabled={submitting || cancelling}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Gửi yêu cầu đổi trả</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 8,
  },
  selectedProductItem: {
    borderColor: '#007AFF',
    backgroundColor: '#e6f2ff',
  },
  productName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flexShrink: 1,
    marginRight: 10,
  },
  productPrice: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  reasonOptions: {
    marginBottom: 15,
  },
  reasonOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  selectedReasonOption: {
    borderColor: '#007AFF',
    backgroundColor: '#e6f2ff',
  },
  reasonOptionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedReasonOptionText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  orText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 10,
  },
  reasonInput: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#DC3545',
  },
});

export default ReturnExchangeScreen;