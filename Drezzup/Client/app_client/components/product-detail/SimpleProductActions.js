// components/product-detail/SimpleProductActions.js
import { Colors } from "@/constants/Colors";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SimpleProductActions({
  product,
  selectedSize,
  selectedColor,
  onAddToCart,
  onBuyNow
}) {
  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.button, styles.addToCartButton]} 
          onPress={onAddToCart}
        >
          <Text style={styles.addToCartButtonText}>Thêm Giỏ Hàng</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.buyNowButton]} 
          onPress={onBuyNow}
        >
          <Text style={styles.buyNowButtonText}>Mua Sản Phẩm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  addToCartButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  addToCartButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  buyNowButton: {
    backgroundColor: Colors.primary,
  },
  buyNowButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});