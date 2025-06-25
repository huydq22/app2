import Header from '@/components/common/Header';
import { Colors } from '@/constants/Colors';
import { getOrders } from '@/utils/orderStorage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



const OrderListScreen = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const ordersData = await getOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const handleOrderPress = (order) => {
    router.push({
      pathname: '/userRouter/order-detail',
      params: { order: JSON.stringify(order) }
    });
  };

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

  const renderOrder = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => handleOrderPress(item)}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>{item.orderNumber || `Mã đơn hàng: ${item.donhang_id}`}</Text>
          <Text style={styles.orderDate}>{item.date}</Text>
        </View>
        {item.status && (
           <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
             <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
           </View>
        )}
      </View>

      <View style={styles.orderItems}>
        {item.items && item.items.map((orderItem, index) => (
          <Text key={index} style={styles.orderItem}>
            {orderItem.quantity}x {orderItem.name || `Mã sản phẩm: ${orderItem.san_pham_id}`}
          </Text>
        ))}
         {(!item.items || item.items.length === 0) && (
           <Text style={styles.noItemsText}>Không có sản phẩm trong đơn hàng này.</Text>
        )}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.orderTotal}>Tổng cộng: <Text style={styles.totalAmountText}>{item.total.toLocaleString('vi-VN')}đ</Text></Text>
        <TouchableOpacity 
          style={styles.detailsButton}
          onPress={() => handleOrderPress(item)}
        >
          <Text style={styles.detailsButtonText}>Xem chi tiết</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="Đơn hàng của tôi"
        showBackButton={true}
        onBack={() => router.back()}
      />
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.orderList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào</Text>
          </View>
        }
      />
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
  orderList: {
    padding: 15,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderItems: {
    marginBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  orderItem: {
    fontSize: 15,
    color: '#555',
    marginBottom: 4,
  },
  noItemsText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#666',
  },
  totalAmountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e9e9eb',
  },
  detailsButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default OrderListScreen;