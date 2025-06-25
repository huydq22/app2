import { Colors } from "@/constants/Colors";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CartItem({ item, isSelected, onSelect, onRemove }) {
  const formatPrice = (price) => {
    if (typeof price === 'string' && price.includes(' - ')) {
      const [minPrice] = price.split(' - ');
      return `${parseInt(minPrice).toLocaleString('vi-VN')} Đ`;
    }
    return `${parseInt(price).toLocaleString('vi-VN')} Đ`;
  };

  const renderCheckbox = (isSelected) => (
    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
      {isSelected && <Text style={styles.checkboxX}>×</Text>}
    </View>
  );

  return (
    <View style={styles.cartItem}>
      <TouchableOpacity 
        style={styles.checkboxContainer} 
        onPress={() => onSelect(item.cartItemId)}
      >
        {renderCheckbox(isSelected)}
      </TouchableOpacity>

      <View style={styles.productContent}>
        <Image
          source={{
            uri: item.image_url || "https://via.placeholder.com/60",
          }}
          style={styles.productImage}
          resizeMode="cover"
        />

        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.productPrice}>Giá: {formatPrice(item.price)}</Text>
          <Text style={styles.productQuantity}>Số lượng: {item.quantity}x</Text>
          {item.selectedSize && (
            <Text style={styles.productVariant}>Size: {item.selectedSize}</Text>
          )}
          {item.selectedColor && (
            <Text style={styles.productVariant}>Màu: {item.selectedColor}</Text>
          )}
        </View>
      </View>

      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => onRemove(item)}
      >
        <Text style={styles.deleteButtonText}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkboxContainer: {
    marginRight: 12,
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
  productContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 13,
    color: Colors.text,
    marginBottom: 2,
  },
  productQuantity: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 2,
  },
  productVariant: {
    fontSize: 12,
    color: Colors.gray,
  },
  deleteButton: {
    backgroundColor: "#ff6b6b",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  deleteButtonText: {
    fontSize: 12,
    color: "white",
    fontWeight: "500",
  },
});