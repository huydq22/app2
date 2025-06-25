import Header from '@/components/common/Header';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    LayoutAnimation,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const faqData = [
  {
    id: '1',
    question: 'Làm cách nào để đặt hàng?',
    answer: 'Bạn có thể đặt hàng bằng cách duyệt qua các sản phẩm, thêm chúng vào giỏ hàng và tiến hành thanh toán.',
  },
  {
    id: '2',
    question: 'Tôi có thể hủy đơn hàng của mình không?',
    answer: 'Bạn có thể hủy đơn hàng trong vòng X giờ sau khi đặt hàng, hoặc nếu đơn hàng vẫn đang trong trạng thái xử lý. Vui lòng kiểm tra chi tiết đơn hàng của bạn.',
  },
  {
    id: '3',
    question: 'Làm cách nào để đổi trả sản phẩm?',
    answer: 'Để yêu cầu đổi trả, vui lòng vào màn hình chi tiết đơn hàng, chọn sản phẩm và nhập lý do đổi trả. Đội ngũ hỗ trợ của chúng tôi sẽ xem xét yêu cầu của bạn.',
  },
  {
    id: '4',
    question: 'Thời gian giao hàng mất bao lâu?',
    answer: 'Thời gian giao hàng phụ thuộc vào địa điểm của bạn và loại sản phẩm. Thông thường, các đơn hàng được giao trong vòng 3-5 ngày làm việc.',
  },
  {
    id: '5',
    question: 'Tôi có thể thay đổi địa chỉ giao hàng sau khi đặt hàng không?',
    answer: 'Bạn có thể thay đổi địa chỉ giao hàng trước khi đơn hàng được vận chuyển. Vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi càng sớm càng tốt để được hỗ trợ.',
  },
];

const FAQScreen = () => {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header
        title="Câu hỏi thường gặp"
        showBackButton={true}
        onBack={() => router.back()}
      />

      <ScrollView style={styles.content}>
        {faqData.map((item) => (
          <View key={item.id} style={styles.faqItem}>
            <TouchableOpacity 
              onPress={() => toggleExpand(item.id)}
              style={styles.questionContainer}
            >
              <Text style={styles.question}>{item.question}</Text>
              <Ionicons 
                name={expandedId === item.id ? "chevron-up" : "chevron-down"}
                size={20}
                color="#555"
              />
            </TouchableOpacity>
            {expandedId === item.id && (
              <View style={styles.answerContainer}>
                <Text style={styles.answer}>{item.answer}</Text>
              </View>
            )}
          </View>
        ))}
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
  faqItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  question: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  answerContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  answer: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
});

export default FAQScreen; 