import Header from '@/components/common/Header';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SupportCenterScreen = () => {
  const router = useRouter();

  const navigateTo = (path) => {
    router.push(path);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="Trung tâm hỗ trợ"
        showBackButton={true}
        onBack={() => router.back()}
      />
      <ScrollView style={styles.content}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/userRouter/faq')}>
          <Ionicons name="help-circle-outline" size={24} color="#333" style={styles.menuIcon} />
          <Text style={styles.menuText}>Câu hỏi thường gặp (FAQ)</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/userRouter/contact-feedback')}>
          <Ionicons name="mail-outline" size={24} color="#333" style={styles.menuIcon} />
          <Text style={styles.menuText}>Liên hệ & Phản hồi</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/userRouter/privacy-policy')}>
          <Ionicons name="shield-checkmark-outline" size={24} color="#333" style={styles.menuIcon} />
          <Text style={styles.menuText}>Chính sách bảo mật</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/userRouter/chat')}>
          <Ionicons name="chatbox-ellipses-outline" size={24} color="#333" style={styles.menuIcon} />
          <Text style={styles.menuText}>Hỗ trợ trò chuyện</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
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
  content: {
    flex: 1,
    padding: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default SupportCenterScreen;