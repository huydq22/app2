import Header from '@/components/common/Header';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  ScrollView, // Add this import
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const languages = [
  { id: 'vi', name: 'Tiếng Việt', country: 'VN' },
  { id: 'en', name: 'English', country: 'US' },
  { id: 'fr', name: 'Français', country: 'FR' },
  { id: 'es', name: 'Español', country: 'ES' },
];

const countries = [
  { id: 'VN', name: 'Việt Nam', flag: '🇻🇳' },
  { id: 'US', name: 'United States', flag: '🇺🇸' },
  { id: 'FR', name: 'France', flag: '🇫🇷' },
  { id: 'ES', name: 'Spain', flag: '🇪🇸' },
];

const LanguageCountryScreen = () => {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('appLanguage');
      const savedCountry = await AsyncStorage.getItem('appCountry');
      if (savedLanguage) {
        setSelectedLanguage(JSON.parse(savedLanguage));
      } else {
        setSelectedLanguage(languages[0]); // Default to Vietnamese
      }
      if (savedCountry) {
        setSelectedCountry(JSON.parse(savedCountry));
      } else {
        setSelectedCountry(countries[0]); // Default to Vietnam
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      await AsyncStorage.setItem('appLanguage', JSON.stringify(selectedLanguage));
      await AsyncStorage.setItem('appCountry', JSON.stringify(selectedCountry));
      Alert.alert('Thành công', 'Cài đặt đã được lưu.');
      router.back();
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Lỗi', 'Không thể lưu cài đặt. Vui lòng thử lại.');
    }
  };

  const renderLanguageItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.settingItem,
        selectedLanguage?.id === item.id && styles.selectedSettingItem,
      ]}
      onPress={() => setSelectedLanguage(item)}
    >
      <Text style={styles.settingText}>{item.name}</Text>
      {selectedLanguage?.id === item.id && (
        <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
      )}
    </TouchableOpacity>
  );

  const renderCountryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.settingItem,
        selectedCountry?.id === item.id && styles.selectedSettingItem,
      ]}
      onPress={() => setSelectedCountry(item)}
    >
      <Text style={styles.settingText}>{item.flag} {item.name}</Text>
      {selectedCountry?.id === item.id && (
        <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Ngôn ngữ & Quốc gia"
        showBackButton={true}
        onBack={() => router.back()}
      />

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ngôn ngữ</Text>
          <FlatList
            data={languages}
            keyExtractor={(item) => item.id}
            renderItem={renderLanguageItem}
            scrollEnabled={false} // Disable inner scroll for FlatList inside ScrollView
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quốc gia</Text>
          <FlatList
            data={countries}
            keyExtractor={(item) => item.id}
            renderItem={renderCountryItem}
            scrollEnabled={false} // Disable inner scroll for FlatList inside ScrollView
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveSettings}
        >
          <Text style={styles.saveButtonText}>Lưu cài đặt</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#007AFF',
  },
  absoluteBackButton: {
    position: 'absolute',
    left: 15,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedSettingItem: {
    // No specific style for selected item other than checkmark
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LanguageCountryScreen;