import Header from '@/components/common/Header'; // Import the Header component
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AddressScreen = () => {
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const savedAddresses = await AsyncStorage.getItem('userAddresses');
      if (savedAddresses) {
        setAddresses(JSON.parse(savedAddresses));
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách địa chỉ.');
    } finally {
      setLoading(false);
    }
  };

  const saveAddresses = async (newAddresses) => {
    try {
      await AsyncStorage.setItem('userAddresses', JSON.stringify(newAddresses));
      setAddresses(newAddresses);
    } catch (error) {
      console.error('Error saving addresses:', error);
      Alert.alert('Lỗi', 'Không thể lưu địa chỉ.');
    }
  };

  const handleAddAddress = () => {
    router.push('/userRouter/add-edit');
  };

  const handleEditAddress = (addressId) => {
    router.push({ pathname: '/userRouter/add-edit', params: { addressId } });
  };

  const handleDeleteAddress = (addressId) => {
    Alert.alert(
      'Xóa địa chỉ',
      'Bạn có chắc chắn muốn xóa địa chỉ này?',
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Có',
          onPress: () => {
            const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
            saveAddresses(updatedAddresses);
            Alert.alert('Thành công', 'Địa chỉ đã được xóa.');
          },
        },
      ],
    );
  };

  const handleSetDefault = (addressId) => {
    const updatedAddresses = addresses.map(addr => 
      addr.id === addressId ? { ...addr, isDefault: true } : { ...addr, isDefault: false }
    );
    saveAddresses(updatedAddresses);
    Alert.alert('Thành công', 'Địa chỉ mặc định đã được cập nhật.');
  };

  const renderAddressItem = ({ item }) => (
    <View style={styles.addressItem}>
      <View style={styles.addressContent}>
        <Text style={styles.addressName}>{item.recipientName || 'Người nhận'}</Text>
        <Text style={styles.addressText}>{item.fullAddress}</Text>
        <Text style={styles.addressPhone}>SĐT: {item.phone}</Text>
        {item.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultBadgeText}>Mặc định</Text>
          </View>
        )}
      </View>
      <View style={styles.addressActions}>
        {!item.isDefault && (
          <TouchableOpacity onPress={() => handleSetDefault(item.id)} style={styles.actionButton}>
            <Ionicons name="star-outline" size={20} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Đặt mặc định</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => handleEditAddress(item.id)} style={styles.actionButton}>
          <Ionicons name="pencil-outline" size={20} color={Colors.primary} />
          <Text style={styles.actionButtonText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteAddress(item.id)} style={styles.actionButton}>
          <Ionicons name="trash-outline" size={20} color="#DC3545" />
          <Text style={[styles.actionButtonText, { color: '#DC3545' }]}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Đang tải địa chỉ...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="Địa chỉ của tôi"
        showBackButton={true}
        onBack={() => router.back()}
      />
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={renderAddressItem}
        contentContainerStyle={styles.addressList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="map-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Bạn chưa có địa chỉ nào.</Text>
            <TouchableOpacity style={styles.addAddressButtonEmpty} onPress={handleAddAddress}>
              <Text style={styles.addAddressButtonTextEmpty}>Thêm địa chỉ mới</Text>
            </TouchableOpacity>
          </View>
        }
      />
      {addresses.length > 0 && (
        <TouchableOpacity style={styles.addAddressButton} onPress={handleAddAddress}>
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.addAddressButtonText}>Thêm địa chỉ mới</Text>
        </TouchableOpacity>
      )}
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
  addressList: {
    padding: 15,
  },
  addressItem: {
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
  addressContent: {
    marginBottom: 10,
  },
  addressName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  addressText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  addressPhone: {
    fontSize: 14,
    color: '#777',
  },
  defaultBadge: {
    backgroundColor: '#28A745',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  defaultBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  actionButtonText: {
    marginLeft: 5,
    fontSize: 14,
    color: Colors.primary,
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
    color: '#999',
    marginBottom: 20,
  },
  addAddressButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    margin: 15,
  },
  addAddressButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  addAddressButtonEmpty: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  addAddressButtonTextEmpty: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddressScreen;