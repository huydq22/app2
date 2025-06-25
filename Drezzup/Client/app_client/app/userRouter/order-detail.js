import Header from '@/components/common/Header';
import { Colors } from '@/constants/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const OrderDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [order, setOrder] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    try {
      if (params.order) {
        const orderData = JSON.parse(params.order);
        console.log('Received order data:', orderData);
        setOrder(orderData);
      }
    } catch (error) {
      console.error('Error parsing order data:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin đơn hàng');
    }
  }, [params.order]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return '#28A745';
      case 'processing':
        return '#FFC107';
      case 'cancelled':
        return '#DC3545';
      default:
        return '#6C757D';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'Đã giao hàng';
      case 'processing':
        return 'Đang xử lý';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const handleCancelOrder = () => {
    Alert.alert(
      'Xác nhận hủy đơn hàng',
      'Bạn có chắc chắn muốn hủy đơn hàng này?' + (order ? `\nĐơn hàng: #${order.donhang_id}` : ''),
      [
        {
          text: 'Không',
          style: 'cancel',
        },
        {
          text: 'Có, hủy đơn',
          style: 'destructive',
          onPress: async () => {
            setCancelling(true);
            try {
              // Simulate API call to cancel the order
              await new Promise(resolve => setTimeout(resolve, 1500));
              setOrder(prevOrder => ({ ...prevOrder, status: 'Cancelled' }));
              Alert.alert('Thành công', 'Đơn hàng đã được hủy thành công!');
              router.back(); // Go back to order list after cancellation
            } catch (error) {
              console.error('Error cancelling order:', error);
              Alert.alert('Lỗi', 'Không thể hủy đơn hàng. Vui lòng thử lại.');
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  };

  if (!order) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Header 
          title="Chi tiết đơn hàng"
          showBackButton={true}
          onBack={() => router.back()}
        />
        <View style={styles.loadingContainer}>
          <Text>Đang tải thông tin đơn hàng...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header 
        title="Chi tiết đơn hàng"
        showBackButton={true}
        onBack={() => router.back()}
      />

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin đơn hàng</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Mã đơn hàng:</Text>
            <Text style={styles.value}>{order.orderNumber || order.donhang_id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Ngày đặt:</Text>
            <Text style={styles.value}>{formatDate(order.date)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Trạng thái:</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
              <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Địa chỉ nhận hàng</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Người nhận:</Text>
            <Text style={styles.value}>Nguyễn Văn A</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Số điện thoại:</Text>
            <Text style={styles.value}>0123 456 789</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Địa chỉ:</Text>
            <Text style={styles.value}>123 Đường ABC, Phường XYZ, Quận 1, TP.HCM</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sản phẩm</Text>
          {order.items && order.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name || `Sản phẩm ${item.san_pham_id}`}</Text>
              <View style={styles.itemDetails}>
                <Text style={styles.itemQuantity}>Số lượng: {item.quantity}</Text>
                <Text style={styles.itemPrice}>{item.price.toLocaleString('vi-VN')}đ</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tổng cộng</Text>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng tiền:</Text>
            <Text style={styles.totalValue}>{order.total.toLocaleString('vi-VN')}đ</Text>
          </View>
        </View>

        {order.status?.toLowerCase() === 'processing' && (
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleCancelOrder}
            disabled={cancelling}
          >
            {cancelling ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.cancelButtonText}>Hủy đơn hàng</Text>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={styles.returnExchangeButton}
          onPress={() => {
            console.log('Navigating to return-exchange with order:', order);
            router.push({ 
              pathname: '/userRouter/return-exchange',
              params: { order: JSON.stringify(order) }
            });
          }}
        >
          <Text style={styles.returnExchangeButtonText}>Yêu cầu đổi trả</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.supportButton}
          onPress={() => router.push('/userRouter/chat')}
        >
          <Text style={styles.supportButtonText}>Liên hệ hỗ trợ</Text>
        </TouchableOpacity>
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
  content: {
    flex: 1,
    padding: 15,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemRow: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  itemPrice: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  totalValue: {
    fontSize: 20,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#DC3545',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  supportButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  },
  supportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  returnExchangeButton: {
    backgroundColor: Colors.secondary,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  returnExchangeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderDetailScreen;