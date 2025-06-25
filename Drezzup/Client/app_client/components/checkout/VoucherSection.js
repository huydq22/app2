import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function VoucherSection({ appliedVoucher, onApplyVoucher, subtotal }) {
  const canUseVoucher = appliedVoucher && subtotal >= appliedVoucher.minOrder * 1000;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mã giảm giá</Text>
        <TouchableOpacity style={styles.addButton} onPress={onApplyVoucher}>
          <Text style={styles.addButtonText}>
            {appliedVoucher ? "Thay đổi" : "Thêm mã"}
          </Text>
        </TouchableOpacity>
      </View>
      
      {appliedVoucher && (
        <View style={[
          styles.voucherCard,
          canUseVoucher ? styles.validVoucherCard : styles.invalidVoucherCard
        ]}>
          <View style={styles.voucherInfo}>
            <Text style={[
              styles.voucherTitle,
              !canUseVoucher && styles.disabledText
            ]}>
              Giảm {appliedVoucher.discount}%
            </Text>
            <Text style={[
              styles.voucherDescription,
              !canUseVoucher && styles.disabledText
            ]}>
              {appliedVoucher.description}
            </Text>
            {!canUseVoucher && (
              <Text style={styles.warningText}>
                Đơn hàng chưa đủ {appliedVoucher.minOrder}k để áp dụng
              </Text>
            )}
          </View>
          <Ionicons 
            name={canUseVoucher ? "checkmark-circle" : "close-circle"}
            size={20} 
            color={canUseVoucher ? Colors.success : Colors.error}
          />
        </View>
      )}
      
      {!appliedVoucher && (
        <View style={styles.emptyState}>
          <Ionicons name="pricetag-outline" size={24} color={Colors.gray} />
          <Text style={styles.emptyText}>Chưa có mã giảm giá nào được áp dụng</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  addButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },
  voucherCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  validVoucherCard: {
    borderColor: Colors.success,
  },
  invalidVoucherCard: {
    backgroundColor: "#fff2f0",
    borderColor: Colors.error,
  },
  voucherInfo: {
    flex: 1,
  },
  voucherTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  voucherDescription: {
    fontSize: 12,
    color: Colors.gray,
  },
  warningText: {
    fontSize: 11,
    color: Colors.error,
    marginTop: 4,
    fontStyle: "italic",
  },
  disabledText: {
    opacity: 0.6,
  },
  emptyState: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderStyle: "dashed",
  },
  emptyText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.gray,
  },
});