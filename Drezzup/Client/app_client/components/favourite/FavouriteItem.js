import { Colors } from "@/constants/Colors";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function FavouriteItem({ item, isSelected, onSelect, onRemove, onPress }) {
  const formatPrice = (price) => {
    if (typeof price === 'string' && price.includes(' - ')) {
      const [minPrice] = price.split(' - ');
      return `${parseInt(minPrice).toLocaleString('vi-VN')} Đ`;
    }
    return `${parseInt(price).toLocaleString('vi-VN')} Đ`;
  };

  const getProductImage = () => {
    if (item.images && item.images.length > 0) {
      return item.images[0];
    }
    if (item.variants && item.variants.length > 0 && item.variants[0].image) {
      return item.variants[0].image;
    }
    return item.image_url || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop";
  };

  const getProductId = () => {
    return item._id || item.id || item.product_id;
  };

  const renderCheckbox = (isSelected) => (
    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
      {isSelected && <Text style={styles.checkboxX}>×</Text>}
    </View>
  )

  return (
    <View style={styles.favoriteItem}>
      <TouchableOpacity style={styles.checkboxContainer} onPress={() => onSelect(getProductId())}>
        {renderCheckbox(isSelected)}
      </TouchableOpacity>

      <TouchableOpacity style={styles.productContent} onPress={onPress}>
        <Image
          source={{
            uri: getProductImage(),
          }}
          style={styles.productImage}
          resizeMode="cover"
        />

        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.productBrand} numberOfLines={1}>
            {item.brand}
          </Text>
          <Text style={styles.productPrice}>Giá: {formatPrice(item.averagePrice || item.price)}</Text>
          <Text style={styles.productStock}>Số lượng: {item.countInStock || 0} sản phẩm</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={() => onRemove(getProductId())}>
        <Text style={styles.deleteButtonText}>Xóa</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  favoriteItem: {
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
    marginBottom: 2,
    lineHeight: 18,
  },
  productBrand: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: "500",
    marginBottom: 2,
  },
  productStock: {
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
})
