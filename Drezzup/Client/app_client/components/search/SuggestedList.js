import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SuggestedList({ products }) {
  const router = useRouter();

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
    return "https://via.placeholder.com/150";
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
      style={styles.suggestedItem}
      onPress={() => handlePress(item)}
    >
      <Image
        source={{
          uri: getProductImage(item),
        }}
        style={styles.suggestedImage}
        onError={() => console.warn(`Failed to load image for product ${item._id}`)}
      />
      <Text style={styles.suggestedName} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={styles.suggestedBrand} numberOfLines={1}>
        {item.brand}
      </Text>
      <Text style={styles.suggestedPrice}>{formatPrice(item.averagePrice)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Danh sách gợi ý</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item, index) => item._id ? item._id.toString() : `product-${index}`}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 16,
  },
  row: {
    justifyContent: "space-between",
  },
  suggestedItem: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
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
  suggestedImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  suggestedName: {
    fontSize: 14,
    color: Colors.text,
    padding: 8,
    paddingBottom: 2,
    fontWeight: "500",
  },
  suggestedBrand: {
    fontSize: 12,
    color: Colors.gray,
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  suggestedPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
});