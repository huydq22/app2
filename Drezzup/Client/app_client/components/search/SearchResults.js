import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SearchResults({ products }) {
  const router = useRouter();

  if (products.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Không tìm thấy sản phẩm nào</Text>
      </View>
    );
  }

  const formatPrice = (price) => {
    if (typeof price === 'string' && price.includes(' - ')) {
      const [minPrice] = price.split(' - ');
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseInt(minPrice));
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    if (product.variants && product.variants.length > 0 && product.variants[0].image) {
      return product.variants[0].image;
    }
    return "https://via.placeholder.com/80";
  };

  const handlePress = (item) => {
    console.log("Navigating to product ID:", item._id);
    
    router.push({
      pathname: '/userRouter/product-detail',
      params: { 
        id: item._id,
        name: item.name,
        price: item.averagePrice,
        image_url: getProductImage(item),
        description: item.description
      }
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handlePress(item)}
    >
      <Image
        source={{
          uri: getProductImage(item),
        }}
        style={styles.resultImage}
        onError={() => console.warn(`Failed to load image for product ${item._id}`)}
      />
      <View style={styles.resultInfo}>
        <Text style={styles.resultName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.resultBrand} numberOfLines={1}>
          {item.brand}
        </Text>
        <Text style={styles.resultPrice}>{formatPrice(item.averagePrice)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={(item) => item._id.toString()}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 12,
  },
  resultItem: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  resultInfo: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: "center",
  },
  resultName: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 2,
    fontWeight: "500",
  },
  resultBrand: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 4,
  },
  resultPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray,
  },
});