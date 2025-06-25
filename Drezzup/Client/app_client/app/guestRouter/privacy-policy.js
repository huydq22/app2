import Header from '@/components/common/Header';
import { useRouter } from 'expo-router';
import {
    ScrollView,
    StyleSheet,
    Text
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PrivacyPolicyScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header
        title="Chinh sách bảo mật"
        showBackButton={true}
        onBack={() => router.back()}
      />

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>1. Giới thiệu</Text>
        <Text style={styles.paragraph}>
          Chào mừng bạn đến với ứng dụng của chúng tôi. Chúng tôi cam kết bảo vệ quyền riêng tư của bạn. Chính sách bảo mật này mô tả cách chúng tôi thu thập, sử dụng và chia sẻ thông tin cá nhân của bạn.
        </Text>

        <Text style={styles.sectionTitle}>2. Thông tin chúng tôi thu thập</Text>
        <Text style={styles.paragraph}>
          Chúng tôi có thể thu thập các loại thông tin sau:
        </Text>
        <Text style={styles.listItem}>• Thông tin cá nhân: Tên, địa chỉ email, số điện thoại, địa chỉ giao hàng.</Text>
        <Text style={styles.listItem}>• Dữ liệu sử dụng: Thông tin về cách bạn truy cập và sử dụng ứng dụng, bao gồm địa chỉ IP, loại thiết bị, thời gian truy cập.</Text>

        <Text style={styles.sectionTitle}>3. Cách chúng tôi sử dụng thông tin của bạn</Text>
        <Text style={styles.paragraph}>
          Chúng tôi sử dụng thông tin thu thập được để:
        </Text>
        <Text style={styles.listItem}>• Cung cấp và duy trì dịch vụ của chúng tôi.</Text>
        <Text style={styles.listItem}>• Xử lý giao dịch và gửi thông báo liên quan.</Text>
        <Text style={styles.listItem}>• Cải thiện và cá nhân hóa trải nghiệm người dùng.</Text>
        <Text style={styles.listItem}>• Gửi các thông tin cập nhật, quảng cáo và tài liệu tiếp thị (nếu bạn đồng ý).</Text>

        <Text style={styles.sectionTitle}>4. Chia sẻ thông tin</Text>
        <Text style={styles.paragraph}>
          Chúng tôi không bán hoặc chia sẻ thông tin cá nhân của bạn với bên thứ ba ngoại trừ các trường hợp sau:
        </Text>
        <Text style={styles.listItem}>• Với các nhà cung cấp dịch vụ bên thứ ba để thực hiện các chức năng thay mặt chúng tôi (ví dụ: xử lý thanh toán, giao hàng).</Text>
        <Text style={styles.listItem}>• Để tuân thủ các nghĩa vụ pháp lý.</Text>
        <Text style={styles.listItem}>• Để bảo vệ quyền và tài sản của chúng tôi.</Text>

        <Text style={styles.sectionTitle}>5. Bảo mật dữ liệu</Text>
        <Text style={styles.paragraph}>
          Chúng tôi thực hiện các biện pháp bảo mật hợp lý để bảo vệ thông tin cá nhân của bạn khỏi việc truy cập, sử dụng hoặc tiết lộ trái phép. Tuy nhiên, không có phương pháp truyền tải qua internet hoặc lưu trữ điện tử nào là an toàn 100%.
        </Text>

        <Text style={styles.sectionTitle}>6. Thay đổi chính sách bảo mật</Text>
        <Text style={styles.paragraph}>
          Chúng tôi có thể cập nhật Chính sách bảo mật này theo thời gian. Chúng tôi sẽ thông báo cho bạn về bất kỳ thay đổi nào bằng cách đăng Chính sách bảo mật mới trên trang này.
        </Text>

        <Text style={styles.sectionTitle}>7. Liên hệ chúng tôi</Text>
        <Text style={styles.paragraph}>
          Nếu bạn có bất kỳ câu hỏi nào về Chính sách bảo mật này, vui lòng liên hệ với chúng tôi qua email: support@example.com.
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#41C4E1',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flexGrow: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    lineHeight: 24,
  },
  listItem: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
    marginLeft: 10,
  },
});

export default PrivacyPolicyScreen; 