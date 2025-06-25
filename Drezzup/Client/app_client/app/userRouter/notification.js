import Header from '@/components/common/Header';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Hardcoded notification data
const mockNotifications = [
  {
    id: '1',
    title: 'Đơn hàng đã giao thành công',
    message: 'Đơn hàng #12345 của bạn đã được giao đến địa chỉ. Cảm ơn bạn đã mua sắm!',
    timestamp: '2025-06-09 10:30',
    icon: 'checkmark-circle-outline',
    read: true,
  },
  {
    id: '2',
    title: 'Khuyến mãi mới!',
    message: 'Giảm 20% cho đơn hàng tiếp theo với mã NEW20. HSD: 30/06/2025.',
    timestamp: '2025-06-08 15:45',
    icon: 'gift-outline',
    read: false,
  },
  {
    id: '3',
    title: 'Cập nhật trạng thái đơn hàng',
    message: 'Đơn hàng #12344 đang được chuẩn bị. Dự kiến giao hàng trong 2 ngày tới.',
    timestamp: '2025-06-07 09:15',
    icon: 'cube-outline',
    read: false,
  },
  {
    id: '4',
    title: 'Chào mừng bạn!',
    message: 'Cảm ơn bạn đã đăng ký. Nhận ngay voucher 50K cho đơn hàng đầu tiên!',
    timestamp: '2025-06-06 18:20',
    icon: 'star-outline',
    read: true,
  },
];

const NotificationScreen = () => {
  const router = useRouter();

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.read && styles.unreadNotification]}
      onPress={() => {
        // In a real app, mark as read or navigate to details
        console.log(`Notification ${item.id} clicked`);
      }}
    >
      <Ionicons
        name={item.icon}
        size={24}
        color={item.read ? '#666' : Colors.primary}
        style={styles.notificationIcon}
      />
      <View style={styles.notificationContent}>
        <Text style={[styles.notificationTitle, !item.read && styles.unreadTitle]}>
          {item.title}
        </Text>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.notificationTimestamp}>{item.timestamp}</Text>
      </View>
      {!item.read && (
        <View style={styles.unreadIndicator} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="Thông báo"
        showBackButton={true}
        onBack={() => router.back()}
      />
      <FlatList
        data={mockNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.notificationList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Không có thông báo nào.</Text>
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
  notificationList: {
    padding: 15,
  },
  notificationItem: {
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
  unreadNotification: {
    backgroundColor: '#f9fcff',
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  notificationIcon: {
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  unreadTitle: {
    color: Colors.primary,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#999',
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    marginLeft: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
});

export default NotificationScreen;