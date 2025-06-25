import { Colors } from "@/constants/Colors";
import { Image, StyleSheet, Text, View } from "react-native";

export default function OrderSummarySection({ items }) {
  const formatPrice = (price) => {
    if (typeof price === 'string' && price.includes(' - ')) {
      const [minPrice] = price.split(' - ');
      return `${parseInt(minPrice).toLocaleString('vi-VN')} Đ`;
    }
    return `${parseInt(price).toLocaleString('vi-VN')} Đ`;
  }

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={`${item.product_id}-${index}`} style={styles.itemContainer}>
          <Image source={{ uri: item.image_url }} style={styles.productImage} resizeMode="cover" />

          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
          </View>

          <Text style={styles.quantity}>×{item.quantity}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
  },
  quantity: {
    fontSize: 16,
    color: Colors.gray,
    marginLeft: 8,
  },
})
