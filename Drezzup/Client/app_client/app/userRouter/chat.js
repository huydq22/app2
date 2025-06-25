import Header from '@/components/common/Header';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChatScreen = () => {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Chào bạn, tôi có thể giúp gì cho bạn?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Hỗ trợ',
        },
      },
      {
        _id: 2,
        text: 'Tôi muốn hỏi về đơn hàng gần nhất của tôi.',
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'Bạn',
        },
      },
    ]);
  }, []);

  const onSend = () => {
    if (inputText.trim().length > 0) {
      const newMessage = {
        _id: messages.length + 1,
        text: inputText.trim(),
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'Bạn',
        },
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputText('');

      setTimeout(() => {
        const botResponse = {
          _id: messages.length + 2,
          text: 'Vui lòng cung cấp mã đơn hàng để tôi kiểm tra nhé.',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Hỗ trợ',
          },
        };
        setMessages((prevMessages) => [...prevMessages, botResponse]);
      }, 1000);
    }
  };

  const renderMessage = ({ item }) => {
    const isMyMessage = item.user._id === 1;
    return (
      <View style={[
        styles.messageBubble,
        isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble
      ]}>
        <Text style={isMyMessage ? styles.myMessageText : styles.otherMessageText}>
          {item.text}
        </Text>
        <Text style={styles.messageTime}>
          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  const rightComponent = (
    <TouchableOpacity 
      style={styles.homeButton}
      onPress={() => router.replace('/(tabs)')}
    >
      <Ionicons name="home-outline" size={24} color="#333" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="Chat với hỗ trợ"
        showBackButton={true}
        onBack={() => router.back()}
        rightComponent={rightComponent}
      />
      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <FlatList
          data={messages.slice().reverse()}
          renderItem={renderMessage}
          keyExtractor={(item) => item._id.toString()}
          inverted
          contentContainerStyle={styles.messageListContent}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Nhập tin nhắn của bạn..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={onSend}>
            <Ionicons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    justifyContent: 'flex-end',
  },
  messageListContent: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 15,
    marginBottom: 8,
    flexDirection: 'column',
  },
  myMessageBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 2,
  },
  otherMessageBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
    borderBottomLeftRadius: 2,
  },
  myMessageText: {
    color: '#fff',
    fontSize: 16,
  },
  otherMessageText: {
    color: '#333',
    fontSize: 16,
  },
  messageTime: {
    fontSize: 10,
    color: 'rgba(0,0,0,0.5)',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  homeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatScreen;