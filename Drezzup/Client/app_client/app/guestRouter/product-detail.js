// screens/ProductDetailScreen.js
import { getProductById } from "@/api/productApi";
import { LoginModal } from "@/components/common/LoginModal";
import ProductDescription from "@/components/product-detail/ProductDescription";
import ProductDetailHeader from "@/components/product-detail/ProductDetailHeader";
import ProductImageCarousel from "@/components/product-detail/ProductImageCarousel";
import ProductInfo from "@/components/product-detail/ProductInfo";
import ProductReviews from "@/components/product-detail/ProductReviews";
import ProductVariants from "@/components/product-detail/ProductVariants";
import SimpleProductActions from "@/components/product-detail/SimpleProductActions";
import { Colors } from "@/constants/Colors";
import { useCart } from "@/context/CartContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProductDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id;
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMoreReviews, setShowMoreReviews] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    console.log('Received params:', params);
    console.log('Product ID:', id);

    const productId = Array.isArray(id) ? id[0] : id;
    if (productId) {
      console.log("Loading product with ID:", productId);
      loadProduct(productId);
    } else {
      console.warn("No product ID provided");
      setError("Không tìm thấy ID sản phẩm.");
      setLoading(false);
    }
  }, [id]);

  const loadProduct = async (productId) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Calling getProductById with ID:', productId);
      const productData = await getProductById(productId);
      console.log("Product data received:", productData);
      setProduct(productData);
      
      // Set default selections based on new data structure
      if (productData.variants && productData.variants.length > 0) {
        const firstVariant = productData.variants[0];
        if (firstVariant.sizes && firstVariant.sizes.length > 0) {
          setSelectedSize(firstVariant.sizes[0].size);
        }
        setSelectedColor(firstVariant.color);
      }
    } catch (error) {
      console.error("Error loading product:", error.message);
      setError(error.message.includes("not found") ? "Sản phẩm không tồn tại." : "Không thể tải sản phẩm. Vui lòng kiểm tra kết nối và thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => router.back();

  const handleShowMoreReviews = () => setShowMoreReviews(true);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      Alert.alert("Thông báo", "Vui lòng chọn kích thước và màu sắc");
      return;
    }
    const success = addToCart(product, 1, selectedSize, selectedColor);
    if (success) {
      Alert.alert("Thành công", "Đã thêm sản phẩm vào giỏ hàng", [
        { text: "Tiếp tục mua sắm", style: "cancel" },
        { text: "Xem giỏ hàng", onPress: () => router.push("/guestRouter/(tabs)/cart") },
      ]);
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      Alert.alert("Thông báo", "Vui lòng chọn kích thước và màu sắc");
      return;
    }
    
    // Show login modal instead of direct alert
    setShowLoginModal(true);
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    router.push("/userRouter/login");
  };

  // Helper function to get product images
  const getProductImages = () => {
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    if (product.variants && product.variants.length > 0) {
      return product.variants.map(variant => variant.image).filter(Boolean);
    }
    return [];
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || "Không tìm thấy sản phẩm"}</Text>
          <Text style={styles.debugText}>Product ID: {id}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => loadProduct(Array.isArray(id) ? id[0] : id)}>
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <ProductImageCarousel images={getProductImages()} />
          <ProductDetailHeader onBack={handleBack} product={product} />
        </View>
        <View style={styles.productInfo}>
          <ProductInfo product={product} />
          <ProductVariants
            variants={product.variants}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            onSizeSelect={setSelectedSize}
            onColorSelect={setSelectedColor}
          />
          <ProductDescription description={product.description} />
          <ProductReviews
            reviews={product.reviews || []}
            rating={product.rating || 0}
            showMore={showMoreReviews}
            onShowMore={handleShowMoreReviews}
          />
        </View>
      </ScrollView>
      
      <SimpleProductActions
        product={product}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      <LoginModal
        visible={showLoginModal}
        onClose={handleLoginModalClose}
        onLogin={handleLoginRedirect}
        action="mua sản phẩm"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  content: { flex: 1 },
  imageContainer: { position: "relative" },
  productInfo: { padding: 16 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: Colors.gray },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  errorText: { fontSize: 16, color: Colors.text, marginBottom: 8, textAlign: "center" },
  debugText: { fontSize: 12, color: Colors.gray, marginBottom: 16, textAlign: "center" },
  retryButton: { backgroundColor: Colors.primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, marginBottom: 12 },
  retryText: { color: "white", fontSize: 16, fontWeight: "bold" },
  backButton: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, borderWidth: 1, borderColor: Colors.primary },
  backText: { color: Colors.primary, fontSize: 16, fontWeight: "bold" },
});

export default ProductDetailScreen;