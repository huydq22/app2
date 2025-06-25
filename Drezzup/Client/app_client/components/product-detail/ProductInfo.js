import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function ProductInfo({ product }) {
  const formatPrice = (price) => {
    if (typeof price === 'string' && price.includes(' - ')) {
      const [minPrice] = price.split(' - ');
      return `${parseInt(minPrice).toLocaleString('vi-VN')} Đ`;
    }
    return `${parseInt(price).toLocaleString('vi-VN')} Đ`;
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={Colors.secondary}
          style={styles.star}
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.price}>{formatPrice(product.averagePrice)}</Text>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{product.name}</Text>
        <View style={styles.ratingContainer}>
          <View style={styles.stars}>{renderStars(Math.floor(product.rating || 0))}</View>
          <Text style={styles.ratingText}>{(product.rating || 0).toFixed(1)}</Text>
        </View>
      </View>
      <Text style={styles.brand}>{product.brand}</Text>
      <Text style={styles.stock}>Còn lại: {product.countInStock} sản phẩm</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    flex: 1,
    marginRight: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stars: {
    flexDirection: "row",
    marginRight: 4,
  },
  star: {
    marginRight: 2,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: "500",
  },
  brand: {
    fontSize: 16,
    color: Colors.gray,
    marginBottom: 4,
    fontWeight: "500",
  },
  stock: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: "500",
  },
});