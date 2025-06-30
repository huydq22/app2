import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { Alert, Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../../redux/actions/forgotPasswordActions';
import { resetForgotPassword } from '../../redux/reducers/forgotPasswordSlice';

const { width, height } = Dimensions.get('window');

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  
  const dispatch = useDispatch();
  const { loading, error, success, message } = useSelector((state) => state.forgotPassword);

  useEffect(() => {
    if (success) {
      console.log('Component: Quên mật khẩu thành công, chuyển trang');
      Alert.alert('Thành công', message, [
        { text: 'OK', onPress: () => router.push('/userRouter/verify-success') }
      ]);
      dispatch(resetForgotPassword());
    }
  }, [success, message]);

  useEffect(() => {
    if (error) {
      console.log('Component: Hiển thị lỗi quên mật khẩu:', error);
      Alert.alert('Lỗi', error);
    }
  }, [error]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = () => {
    console.log('Component: Bắt đầu xử lý quên mật khẩu');
    if (!email.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập email');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return;
    }

    console.log('Component: Dispatch action forgotPassword');
    dispatch(forgotPassword(email));
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require('@/assets/images/nen.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.02)', 'rgba(255, 255, 255, 0.05)']}
        style={styles.gradient}
      />

      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.welcomeText}>Quên mật khẩu</Text>
          <Text style={styles.subText}>Nhập email để đặt lại mật khẩu</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TouchableOpacity 
            style={styles.resetButton}
            onPress={handleResetPassword}
            disabled={loading}
          >
            <Text style={styles.resetButtonText}>
              {loading ? 'Đang gửi...' : 'Gửi link đặt lại'}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Đã nhớ mật khẩu? </Text>
            <TouchableOpacity onPress={() => router.push('/userRouter/login')}>
              <Text style={styles.loginLink}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
  },
  gradient: {
    position: 'absolute',
    width: width,
    height: height,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#41C4E1',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#666',
  },
  loginLink: {
    color: '#41C4E1',
    fontWeight: 'bold',
  },
}); 

export default ForgotPasswordScreen;