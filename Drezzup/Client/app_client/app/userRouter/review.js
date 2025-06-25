import Header from "@/components/common/Header";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCategories } from '../../api/categoryApi';
import { getProducts } from '../../api/productApi';
import { getUserData } from '../../api/userApi';

const { width } = Dimensions.get("window");

const ReviewScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProductsToReview();
  }, []);

  const loadProductsToReview = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch products, categories, and user data concurrently
      const [productsData, categoriesData, userData] = await Promise.all([
        getProducts(),
        getCategories(),
        getUserData(),
      ]);

      if (!productsData.length || !categoriesData.length) {
        throw new Error("Không thể tải dữ liệu sản phẩm hoặc danh mục.");
      }

      setCategories(categoriesData);

      // Mock purchase history (replace with real order data if available)
      const mockPurchaseData = productsData.map((product) => ({
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        description: product.description,
        purchaseDate: `2024-01-${Math.floor(Math.random() * 15) + 1}`, // Mock purchase date
        orderStatus: "delivered", // Assume delivered
        hasReviewed: false, // Assume not reviewed
        size: product.variants?.[0]?.size || "M", // Default to first variant size
        color: product.variants?.[0]?.color || "Unknown", // Default to first variant color
        quantity: 1, // Default quantity
        category_id: product.category_id,
        rating: product.rating,
      }));

      // Filter products that are delivered and not yet reviewed
      const reviewableProducts = mockPurchaseData.filter(
        (product) => product.orderStatus === "delivered" && !product.hasReviewed
      );

      setProducts(reviewableProducts);
    } catch (error) {
      console.error("Error loading products to review:", error.message);
      setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => router.back();

  const handleWriteReview = (product) => {
    router.push({
      pathname: "/userRouter/review-detail",
      params: {
        productId: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        description: product.description,
        size: product.size,
        color: product.color,
        quantity: product.quantity,
        category_id: product.category_id,
        rating: product.rating,
      },
    });
  };

  const handleViewProduct = (product) => {
    router.push({
      pathname: "/userRouter/product-detail",
      params: {
        id: product.id,
      },
    });
  };

  const formatPrice = (price) => {
    if (typeof price === 'string' && price.includes(' - ')) {
      const [minPrice] = price.split(' - ');
      return `${parseInt(minPrice).toLocaleString('vi-VN')} Đ`;
    }
    return `${parseInt(price).toLocaleString('vi-VN')} Đ`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Helper function to get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.category_id === categoryId);
    return category ? category.name : "Không xác định";
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="star-outline" size={80} color={Colors.gray} />
      <Text style={styles.emptyTitle}>Chưa có sản phẩm nào để đánh giá</Text>
      <Text style={styles.emptySubtitle}>
        Các sản phẩm bạn đã mua sẽ hiển thị ở đây để bạn có thể đánh giá
      </Text>
      <TouchableOpacity
        style={styles.shopButton}
        onPress={() => router.push("/userRouter/(tabs)/home")}
      >
        <Text style={styles.shopButtonText}>Mua sắm ngay</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProductItem = (product) => (
    <View key={product.id} style={styles.productCard}>
      <TouchableOpacity
        style={styles.productImageContainer}
        onPress={() => handleViewProduct(product)}
      >
        <Image
          source={{ uri: product.image_url }}
          style={styles.productImage}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <View style={styles.productInfo}>
        <TouchableOpacity onPress={() => handleViewProduct(product)}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
        </TouchableOpacity>

        <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>

        <View style={styles.productDetails}>
          <Text style={styles.productDetailText}>
            Số lượng: {product.quantity}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.reviewButton}
          onPress={() => handleWriteReview(product)}
        >
          <Ionicons name="star-outline" size={16} color="white" />
          <Text style={styles.reviewButtonText}>Viết đánh giá</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Header
          title="Đánh giá sản phẩm"
          showBackButton={true}
          onBack={handleBack}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Đang tải danh sách sản phẩm...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Header
          title="Đánh giá sản phẩm"
          showBackButton={true}
          onBack={handleBack}
        />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color={Colors.gray} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadProductsToReview}
          >
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header
        title="Đánh giá sản phẩm"
        showBackButton={true}
        onBack={handleBack}
      />

      {products.length === 0 ? (
        renderEmptyState()
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>
              Sản phẩm cần đánh giá ({products.length})
            </Text>
            <Text style={styles.headerSubtitle}>
              Chia sẻ trải nghiệm của bạn về các sản phẩm đã mua
            </Text>
          </View>

          <View style={styles.productsList}>
            {products.map(renderProductItem)}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.gray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: Colors.text,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  shopButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  headerInfo: {
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.gray,
  },
  productsList: {
    padding: 16,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  productImageContainer: {
    width: 120, // Increased from 80 to 120
    height: 120, // Increased from 80 to 120
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 12,
  },
  productImage: {
    width: "100",
    height: "100",
  },
  productInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 8,
  },
  productDetails: {
    marginBottom: 12,
  },
  productDetailText: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 2,
  },
  purchaseDate: {
    fontSize: 12,
    color: Colors.gray,
    fontStyle: "italic",
  },
  reviewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  reviewButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
});

export default ReviewScreen;