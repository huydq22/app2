import { Colors } from "@/constants/Colors";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
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

  const handleProfilePress = () => {
    try {
      console.log('Navigating to profile detail...');
      router.push({
        pathname: '/userRouter/profile-detail',
      });
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Could not navigate to profile detail');
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
      id: 'review',
      title: 'Đánh giá sản phẩm',
      icon: '⭐',
      screen: 'review',
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
      id: 'changePassword',
      title: 'Đổi mật khẩu',
      icon: '🔒',
      screen: 'change-password',
    },
    {
      id: 'notifications',
      title: 'Cài đặt thông báo',
      icon: '🔔',
      screen: 'notification',
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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userProfile');
      router.replace('/userRouter/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

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
                onPress={() => router.push(`/userRouter/${item.screen}`)}
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

          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutButtonText}>Đăng xuất</Text>
          </TouchableOpacity>
        </ScrollView>
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
  logoutButton: {
    margin: 15,
    marginTop: 30,
    padding: 15,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  logoutButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;