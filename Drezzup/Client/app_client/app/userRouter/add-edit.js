import Header from '@/components/common/Header'; // Import the Header component
import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AddEditAddressScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const addressId = params.addressId;

  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (addressId) {
      setIsEditing(true);
      loadAddressForEdit(addressId);
    }
  }, [addressId]);

  const loadAddressForEdit = async (id) => {
    try {
      const savedAddresses = await AsyncStorage.getItem('userAddresses');
      if (savedAddresses) {
        const addresses = JSON.parse(savedAddresses);
        const addressToEdit = addresses.find(addr => addr.id === id);
        if (addressToEdit) {
          setRecipientName(addressToEdit.recipientName);
          setPhone(addressToEdit.phone);
          setFullAddress(addressToEdit.fullAddress);
          setIsDefault(addressToEdit.isDefault);
        }
      }
    } catch (error) {
      console.error('Error loading address for edit:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin địa chỉ.');
    }
  };

  const handleSaveAddress = async () => {
    if (!recipientName || !phone || !fullAddress) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin địa chỉ.');
      return;
    }

    try {
      let savedAddresses = await AsyncStorage.getItem('userAddresses');
      let addresses = savedAddresses ? JSON.parse(savedAddresses) : [];

      if (isDefault) {
        // Unset default for all other addresses if this one is set as default
        addresses = addresses.map(addr => ({ ...addr, isDefault: false }));
      }

      if (isEditing) {
        // Update existing address
        const updatedAddresses = addresses.map(addr =>
          addr.id === addressId
            ? { ...addr, recipientName, phone, fullAddress, isDefault }
            : addr
        );
        await AsyncStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
        Alert.alert('Thành công', 'Địa chỉ đã được cập nhật.');
      } else {
        // Add new address
        const newAddress = {
          id: Date.now().toString(), // Simple unique ID
          recipientName,
          phone,
          fullAddress,
          isDefault,
        };
        const newAddresses = [...addresses, newAddress];
        await AsyncStorage.setItem('userAddresses', JSON.stringify(newAddresses));
        Alert.alert('Thành công', 'Địa chỉ mới đã được thêm.');
      }
      router.back(); // Go back to the address list screen
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Lỗi', 'Không thể lưu địa chỉ.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title={isEditing ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
        showBackButton={true}
        onBack={() => router.back()}
      />
      <ScrollView style={styles.formContainer}>
        <Text style={styles.label}>Tên người nhận</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên người nhận"
          value={recipientName}
          onChangeText={setRecipientName}
        />

        <Text style={styles.label}>Số điện thoại</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập số điện thoại"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Địa chỉ đầy đủ</Text>
        <TextInput
          style={styles.input}
          placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
          value={fullAddress}
          onChangeText={setFullAddress}
          multiline
          numberOfLines={4}
        />

        <View style={styles.defaultSwitchContainer}>
          <Text style={styles.label}>Đặt làm địa chỉ mặc định</Text>
          <Switch
            trackColor={{ false: '#767577', true: Colors.primary }}
            thumbColor={isDefault ? '#f4f3f4' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setIsDefault}
            value={isDefault}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress}>
          <Text style={styles.saveButtonText}>{isEditing ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ'}</Text>
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
  formContainer: {
    padding: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  defaultSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddEditAddressScreen;