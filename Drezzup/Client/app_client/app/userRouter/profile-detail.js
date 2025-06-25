import Header from '@/components/common/Header';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';

const { width } = Dimensions.get('window');

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Họ tên là bắt buộc')
    .min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  email: Yup.string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc'),
  phone: Yup.string()
    .matches(/^[0-9+\-\s()]*$/, 'Số điện thoại không hợp lệ')
    .required('Số điện thoại là bắt buộc'),
  address: Yup.string()
    .required('Địa chỉ là bắt buộc')
    .min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
  dateOfBirth: Yup.string()
    .matches(/^\d{2}\/\d{2}\/\d{4}$/, 'Ngày sinh phải theo định dạng DD/MM/YYYY')
    .required('Ngày sinh là bắt buộc'),
});

const ProfileDetailScreen = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const [initialValues, setInitialValues] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
  });

  useEffect(() => {
    loadProfileData();
    requestPermission();
  }, []);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Yêu cầu quyền truy cập',
        'Vui lòng cấp quyền truy cập thư viện ảnh để thay đổi ảnh đại diện.'
      );
    }
  };

  const loadProfileData = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('userProfile');
      if (savedProfile) {
        const profileData = JSON.parse(savedProfile);
        setInitialValues(profileData);
        if (profileData.avatar) {
          setAvatar(profileData.avatar);
        }
      }
    } catch (error) {
      console.error('Lỗi khi tải hồ sơ:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setAvatar(imageUri);
        const currentProfile = await AsyncStorage.getItem('userProfile');
        if (currentProfile) {
          const profileData = JSON.parse(currentProfile);
          await AsyncStorage.setItem(
            'userProfile',
            JSON.stringify({ ...profileData, avatar: imageUri })
          );
        }
      }
    } catch (error) {
      console.error('Lỗi chọn ảnh:', error);
      Alert.alert('Lỗi', 'Không thể chọn ảnh');
    }
  };

  const handleSave = async (values) => {
    try {
      setLoading(true);
      await AsyncStorage.setItem(
        'userProfile',
        JSON.stringify({ ...values, avatar })
      );
      setIsEditing(false);
      Alert.alert('Thành công', 'Cập nhật hồ sơ thành công');
      router.back();
    } catch (error) {
      console.error('Lỗi khi lưu hồ sơ:', error);
      Alert.alert('Lỗi', 'Lưu hồ sơ thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="Chi tiết hồ sơ"
        showBackButton={true}
        onBack={() => router.back()}
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={avatar ? { uri: avatar } : require('@/assets/images/i1.jpg')}
              style={styles.avatar}
            />
            {isEditing && (
              <TouchableOpacity 
                style={styles.changePhotoButton}
                onPress={handleImagePick}
              >
                <Ionicons name="camera" size={24} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.avatarActions}>
            {isEditing && (
              <Text style={styles.changePhotoText}>Thay ảnh đại diện</Text>
            )}
            <TouchableOpacity
              style={[styles.editButton, isEditing && styles.cancelButton]}
              onPress={() => setIsEditing(!isEditing)}
            >
              <Text style={styles.editButtonText}>
                {isEditing ? 'Hủy' : 'Chỉnh sửa'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSave}
          enableReinitialize
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              {/* Họ tên */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Họ và tên</Text>
                <View style={[styles.inputContainer, touched.name && errors.name && styles.inputError]}>
                  <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={values.name}
                    editable={isEditing}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    placeholder="Nhập họ và tên"
                    placeholderTextColor="#999"
                  />
                </View>
                {touched.name && errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={[styles.inputContainer, touched.email && errors.email && styles.inputError]}>
                  <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={values.email}
                    editable={isEditing}
                    keyboardType="email-address"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    placeholder="Nhập email"
                    placeholderTextColor="#999"
                  />
                </View>
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              {/* Số điện thoại */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Số điện thoại</Text>
                <View style={[styles.inputContainer, touched.phone && errors.phone && styles.inputError]}>
                  <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={values.phone}
                    editable={isEditing}
                    keyboardType="phone-pad"
                    onChangeText={handleChange('phone')}
                    onBlur={handleBlur('phone')}
                    placeholder="Nhập số điện thoại"
                    placeholderTextColor="#999"
                  />
                </View>
                {touched.phone && errors.phone && (
                  <Text style={styles.errorText}>{errors.phone}</Text>
                )}
              </View>

              {/* Địa chỉ */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Địa chỉ</Text>
                <View style={[styles.inputContainer, touched.address && errors.address && styles.inputError]}>
                  <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={values.address}
                    editable={isEditing}
                    onChangeText={handleChange('address')}
                    onBlur={handleBlur('address')}
                    placeholder="Nhập địa chỉ"
                    placeholderTextColor="#999"
                  />
                </View>
                {touched.address && errors.address && (
                  <Text style={styles.errorText}>{errors.address}</Text>
                )}
              </View>

              {/* Ngày sinh */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Ngày sinh</Text>
                <View style={[styles.inputContainer, touched.dateOfBirth && errors.dateOfBirth && styles.inputError]}>
                  <Ionicons name="calendar-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={values.dateOfBirth}
                    editable={isEditing}
                    onChangeText={handleChange('dateOfBirth')}
                    onBlur={handleBlur('dateOfBirth')}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor="#999"
                  />
                </View>
                {touched.dateOfBirth && errors.dateOfBirth && (
                  <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
                )}
              </View>

              {isEditing && (
                <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                  <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  changePhotoText: {
    color: Colors.primary,
    fontSize: 14,
  },
  editButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF3B30', // Red for cancel to differentiate from edit
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileDetailScreen;