import { Colors } from "@/constants/Colors";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    avatar: null,
  });
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('userProfile');
      if (savedProfile) {
        const profileData = JSON.parse(savedProfile);
        setUserData(profileData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const restrictedScreens = [
    'profile-detail',
    'orders',
    'address',
    'vouchers',
    'payment-methods',
    'notifications',
  ];

  const handleMenuPress = (screen) => {
    try {
      if (restrictedScreens.includes(screen)) {
        console.log(`Showing login prompt for ${screen}`);
        setModalVisible(true); // Show modal for restricted screens
      } else {
        console.log(`Navigating to /guestRouter/${screen}`);
        router.push(`/guestRouter/${screen}`);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Could not navigate to the requested screen');
    }
  };

  const handleProfilePress = () => {
    try {
      console.log('Profile pressed');
      setModalVisible(true); // Show modal for profile-detail
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Could not navigate to profile detail');
    }
  };

  const handleLoginRedirect = () => {
    try {
      console.log('Navigating to userRouter/login');
      setModalVisible(false);
      router.replace('/userRouter/login'); // Use replace to reset navigation stack
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Could not navigate to login');
    }
  };

  const menuItems = [
    {
      id: 'orders',
      title: 'Đơn hàng của tôi',
      icon: '📦',
      screen: 'orders',
    },
    {
      id: 'address',
      title: 'Địa chỉ của tôi',
      icon: '📍',
      screen: 'address',
    },
    {
      id: 'vouchers',
      title: 'Phiếu giảm giá',
      icon: '🎟️',
      screen: 'vouchers',
    },
    {
      id: 'payment',
      title: 'Phương thức thanh toán',
      icon: '💳',
      screen: 'payment-methods',
    },
    {
      id: 'notifications',
      title: 'Cài đặt thông báo',
      icon: '🔔',
      screen: 'notifications',
    },
    {
      id: 'language',
      title: 'Ngôn ngữ & Quốc gia',
      icon: '🌍',
      screen: 'language-country',
    },
    {
      id: 'help',
      title: 'Trung tâm hỗ trợ',
      icon: '❓',
      screen: 'support-center',
    },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <LinearGradient colors={[Colors.primary, "rgba(255,255,255,0.9)", "white"]} style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.profileInfo}
              onPress={handleProfilePress}
              activeOpacity={0.7}
            >
              <Image
                source={userData.avatar ? { uri: userData.avatar } : require('@/assets/images/i1.jpg')}
                style={styles.avatar}
              />
              <View style={styles.userInfo}>
                <Text style={styles.name}>{userData.name || 'Người dùng'}</Text>
                {userData.email && <Text style={styles.email}>{userData.email}</Text>}
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.menuContainer}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleMenuPress(item.screen)}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeft}>
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Modal for login prompt */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Yêu cầu đăng nhập</Text>
              <Text style={styles.modalMessage}>
                Vui lòng đăng nhập để truy cập tính năng này.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButtonCancel}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButtonLogin}
                  onPress={handleLoginRedirect}
                >
                  <Text style={styles.modalButtonText}>Đăng nhập</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  header: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#fff',
    marginRight: 20,
    marginStart: 10,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
    color: '#fff',
    opacity: 0.9,
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    paddingHorizontal: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 22,
    marginRight: 15,
    width: 30,
    textAlign: 'center',
  },
  menuTitle: {
    fontSize: 15,
    color: '#333',
  },
  menuArrow: {
    fontSize: 20,
    color: '#ccc',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for blur effect
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButtonCancel: {
    flex: 1,
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    alignItems: 'center',
  },
  modalButtonLogin: {
    flex: 1,
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;