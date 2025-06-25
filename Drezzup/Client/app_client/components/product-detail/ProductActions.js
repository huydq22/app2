import { Colors } from "@/constants/Colors";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProductActions({ product, selectedSize, selectedColor, onWriteReview, onAddToCart, onBuyNow }) {
  return (
    <View style={styles.container}>
      <View style={styles.mainActions}>
        <TouchableOpacity style={styles.addToCartButton} onPress={onAddToCart}>
          <Text style={styles.buttonText}>Thêm Giỏ Hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyNowButton} onPress={onBuyNow}>
          <Text style={styles.buttonText}>Mua Sản Phẩm</Text>
        </TouchableOpacity>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  mainActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  addToCartButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  buyNowButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  reviewButton: {
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: "white",
    alignItems: "center",
  },
  reviewButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
});