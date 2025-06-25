import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProductCard({ product, horizontal = false }) {
  const router = useRouter();

  const formatPrice = (price) => {
    if (typeof price === 'string' && price.includes(' - ')) {
      const [minPrice] = price.split(' - ');
      return `${parseInt(minPrice).toLocaleString('vi-VN')} Đ`;
    }
    return `${parseInt(price).toLocaleString('vi-VN')} Đ`;
  };

  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    if (product.variants && product.variants.length > 0 && product.variants[0].image) {
      return product.variants[0].image;
    }
    return "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop";
  };

  const handlePress = () => {
    console.log("Navigating to product ID:", product._id);
    
    router.push({
      pathname: '/userRouter/product-detail',
      params: { 
        id: product._id,
        name: product.name,
        price: product.averagePrice,
        image_url: getProductImage(),
        description: product.description
      }
    });
  };

  return (
    <TouchableOpacity
      style={[styles.container, horizontal ? styles.horizontalContainer : styles.verticalContainer]}
      onPress={handlePress}
    >
      <View style={[styles.imageContainer, horizontal ? styles.horizontalImage : styles.verticalImage]}>
        <Image
          source={{
            uri: getProductImage(),
          }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.brand} numberOfLines={1}>
          {product.brand}
        </Text>
        <Text style={styles.price}>{formatPrice(product.averagePrice)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
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
  verticalContainer: {
    width: "48%",
  },
  horizontalContainer: {
    width: 140,
  },
  imageContainer: {
    backgroundColor: Colors.lightGray,
  },
  verticalImage: {
    height: 160,
  },
  horizontalImage: {
    height: 120,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  content: {
    padding: 8,
  },
  name: {
    fontSize: 12,
    color: Colors.text,
    lineHeight: 16,
    marginBottom: 2,
    fontWeight: "500",
  },
  brand: {
    fontSize: 10,
    color: Colors.gray,
    lineHeight: 14,
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.primary,
  },
});