import { Colors } from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useState } from "react"
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import DropDownPicker from 'react-native-dropdown-picker'
import { SafeAreaView } from "react-native-safe-area-context"; // Add this import

// Dữ liệu mẫu cho thành phố và quận/huyện
const cities = [
  { label: 'Hà Nội', value: 'hanoi' },
  { label: 'TP. Hồ Chí Minh', value: 'hcm' },
  { label: 'Đà Nẵng', value: 'danang' },
  { label: 'Cần Thơ', value: 'cantho' },
  { label: 'Hải Phòng', value: 'haiphong' },
]

const districts = {
  hanoi: [
    { label: 'Quận Ba Đình', value: 'badinh' },
    { label: 'Quận Hoàn Kiếm', value: 'hoankiem' },
    { label: 'Quận Đống Đa', value: 'dongda' },
    { label: 'Quận Hai Bà Trưng', value: 'haibatrung' },
  ],
  hcm: [
    { label: 'Quận 1', value: 'q1' },
    { label: 'Quận 2', value: 'q2' },
    { label: 'Quận 3', value: 'q3' },
    { label: 'Quận 4', value: 'q4' },
  ],
  danang: [
    { label: 'Quận Hải Châu', value: 'haichau' },
    { label: 'Quận Thanh Khê', value: 'thankhe' },
    { label: 'Quận Sơn Trà', value: 'sontra' },
  ],
  cantho: [
    { label: 'Quận Ninh Kiều', value: 'ninhkieu' },
    { label: 'Quận Bình Thủy', value: 'binhthuy' },
  ],
  haiphong: [
    { label: 'Quận Hồng Bàng', value: 'hongbang' },
    { label: 'Quận Ngô Quyền', value: 'ngoquyen' },
  ],
}

const AddAddressScreen = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    recipient_name: "",
    phone: "",
    city: "",
    district: "",
    house_number: "",
    is_default: false
  })

  // State cho dropdown
  const [cityOpen, setCityOpen] = useState(false)
  const [districtOpen, setDistrictOpen] = useState(false)
  const [districtItems, setDistrictItems] = useState([])

  // Cập nhật danh sách quận/huyện khi chọn thành phố
  const onCityChange = (value) => {
    setFormData({ ...formData, city: value, district: "" })
    setDistrictItems(districts[value] || [])
  }

  const handleSave = () => {
    // TODO: Implement save address logic
    router.back()
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thêm địa chỉ mới</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Họ và tên</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập họ và tên"
              value={formData.recipient_name}
              onChangeText={(text) => setFormData({ ...formData, recipient_name: text })}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Thành phố/Tỉnh</Text>
            <DropDownPicker
              open={cityOpen}
              value={formData.city}
              items={cities}
              setOpen={setCityOpen}
              setValue={(value) => onCityChange(value())}
              style={styles.dropdown}
              placeholder="Chọn thành phố/tỉnh"
              zIndex={3000}
              zIndexInverse={1000}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Quận/Huyện</Text>
            <DropDownPicker
              open={districtOpen}
              value={formData.district}
              items={districtItems}
              setOpen={setDistrictOpen}
              setValue={(value) => setFormData({ ...formData, district: value() })}
              style={styles.dropdown}
              placeholder="Chọn quận/huyện"
              disabled={!formData.city}
              zIndex={2000}
              zIndexInverse={2000}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Số nhà, tên đường</Text>
            <TextInput
              style={[styles.input, styles.addressInput]}
              placeholder="Nhập số nhà, tên đường"
              multiline
              numberOfLines={3}
              value={formData.house_number}
              onChangeText={(text) => setFormData({ ...formData, house_number: text })}
            />
          </View>

          <TouchableOpacity 
            style={styles.defaultCheckbox}
            onPress={() => setFormData({ ...formData, is_default: !formData.is_default })}
          >
            <View style={[styles.checkbox, formData.is_default && styles.checkboxChecked]}>
              {formData.is_default && (
                <Ionicons name="checkmark" size={16} color="white" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Đặt làm địa chỉ mặc định</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Lưu địa chỉ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    height: 70, // Reduced height since SafeAreaView handles status bar
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
    flex: 1,
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    fontSize: 16,
  },
  addressInput: {
    height: 80,
    textAlignVertical: "top",
  },
  defaultCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
  },
  checkboxLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  footer: {
    padding: 16,
    paddingBottom: 16, // Reduced from 40 to 16 to be closer to bottom
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  dropdown: {
    borderColor: "#eee",
    height: 50,
  },
})

export default AddAddressScreen;