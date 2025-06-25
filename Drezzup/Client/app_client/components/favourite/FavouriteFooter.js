import { Colors } from "@/constants/Colors"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function FavouriteFooter({ isAllSelected, onSelectAll, onAddToCart }) {
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

        <TouchableOpacity style={styles.addToCartButton} onPress={onAddToCart}>
          <Text style={styles.addToCartButtonText}>Thêm vào giỏ hàng</Text>
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
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginLeft: 8,
  },
  addToCartButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 16,
    alignItems: "center",
  },
  addToCartButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
})
