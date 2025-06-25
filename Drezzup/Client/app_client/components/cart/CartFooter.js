import { Colors } from "@/constants/Colors";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CartFooter({ isAllSelected, onSelectAll, selectedTotal, onCheckout, selectedItems }) {
  const formatPrice = (price) => {
    if (typeof price === 'string' && price.includes(' - ')) {
      const [minPrice] = price.split(' - ');
      return `${parseInt(minPrice).toLocaleString('vi-VN')} Đ`;
    }
    return `${parseInt(price).toLocaleString('vi-VN')} Đ`;
  }

  const renderCheckbox = (isSelected) => (
    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
      {isSelected && <Text style={styles.checkboxX}>×</Text>}
    </View>
  )

  return (
    <View style={styles.bottomSection}>
      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.selectAllContainer} onPress={onSelectAll}>
          {renderCheckbox(isAllSelected)}
          <Text style={styles.selectAllText}>Tất cả</Text>
        </TouchableOpacity>

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Tổng Tiền</Text>
          <Text style={styles.totalPrice}>{formatPrice(selectedTotal)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.checkoutButton, selectedItems.length === 0 && styles.disabledButton]}
          onPress={onCheckout}
        >
          <Text style={styles.checkoutButtonText}>Thanh Toán</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  bottomSection: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "white",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  selectAllContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
  },
  checkboxX: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  selectAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginLeft: 8,
  },
  totalContainer: {
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 12,
    color: Colors.gray,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
  },
  checkoutButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  checkoutButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
})
