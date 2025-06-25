import Header from "@/components/common/Header";
import { Colors } from "@/constants/Colors";
import { useVoucher } from "@/context/VoucherContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Dữ liệu mẫu cho vouchers
const SAMPLE_VOUCHERS = [
  {
    id: "1",
    image: require("@/assets/images/Vocher.png"),
    discount: 10,
    minOrder: 150,
    expiryDate: "31/12/2025",
    description: "Giảm giá 10% cho đơn hàng từ 150k"
  },
  {
    id: "2",
    image: require("@/assets/images/Vocher.png"),
    discount: 20,
    minOrder: 300,
    expiryDate: "30/12/2025",
    description: "Giảm giá 20% cho đơn hàng từ 300k"
  },
  {
    id: "3",
    image: require("@/assets/images/Vocher.png"),
    discount: 15,
    minOrder: 200,
    expiryDate: "25/12/2025",
    description: "Giảm giá 15% cho đơn hàng từ 200k"
  },
  {
    id: "4",
    image: require("@/assets/images/Vocher.png"),
    discount: 25,
    minOrder: 500,
    expiryDate: "20/12/2025",
    description: "Giảm giá 25% cho đơn hàng từ 500k"
  },
];

const AddVoucherScreen = () => {
  const router = useRouter();
  const { selectedVoucher, setSelectedVoucher } = useVoucher();

  const handleBack = () => {
    router.back();
  };

  const handleSelectVoucher = (voucher) => {
    setSelectedVoucher(voucher);
    router.back();
  };

  const renderVoucherItem = ({ item }) => {
    const isSelected = selectedVoucher?.id === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.voucherItem,
          isSelected && styles.selectedVoucherItem
        ]}
        onPress={() => handleSelectVoucher(item)}
      >
        <Image source={item.image} style={styles.voucherImage} />
        <View style={styles.voucherInfo}>
          <Text style={styles.discountText}>Giảm {item.discount}%</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.minOrderText}>Đơn tối thiểu {item.minOrder}k</Text>
          <Text style={styles.expiryText}>HSD: {item.expiryDate}</Text>
        </View>
        <View style={styles.checkmarkContainer}>
          {isSelected ? (
            <Ionicons 
              name="checkmark-circle" 
              size={24} 
              color={Colors.primary} 
            />
          ) : (
            <Ionicons 
              name="ellipse-outline" 
              size={24} 
              color={Colors.gray} 
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header 
        title="Chọn Voucher" 
        showBackButton={true} 
        onBack={handleBack} 
      />
      <FlatList
        data={SAMPLE_VOUCHERS}
        renderItem={renderVoucherItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContainer: {
    padding: 16,
  },
  voucherItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedVoucherItem: {
    borderColor: Colors.primary,
    borderWidth: 2,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  voucherImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  voucherInfo: {
    flex: 1,
  },
  discountText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 4,
  },
  minOrderText: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 2,
  },
  expiryText: {
    fontSize: 12,
    color: Colors.gray,
  },
  checkmarkContainer: {
    marginLeft: 8,
  },
});

export default AddVoucherScreen;