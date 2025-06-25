import Header from "@/components/common/Header";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProductById } from '../../api/productApi';

const { width } = Dimensions.get("window");

const ReviewDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  // Ưu tiên params.id vì ProductDetailScreen truyền id
  const productId = params.id || params.productId;
  const [product, setProduct] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Received params:", params);
    console.log("Product ID:", productId);

    const id = Array.isArray(productId) ? productId[0] : productId;
    if (id) {
      console.log("Loading product for review with ID:", id);
      loadProduct(id);
    } else {
      console.warn("No product ID provided");
      setError("Không tìm thấy ID sản phẩm.");
      setLoading(false);
    }
    requestPermissions();
  }, [productId]);

  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Thông báo", "Cần quyền truy cập thư viện ảnh để tải ảnh lên!");
      }
    }
  };

  const loadProduct = async (id) => {
    try {
      setLoading(true);
      setError(null);
      console.log("Calling getProductById with ID:", id);
      const productData = await getProductById(id);
      console.log("Product data received for review:", productData);
      setProduct({
        ...productData,
        name: productData.name || params.name || "Sản phẩm không tên",
        price: productData.price || params.price || 0,
        image_url: productData.image_url || params.image_url || "https://via.placeholder.com/400",
        rating: productData.rating || 0
      });
    } catch (error) {
      console.error("Error loading product for review:", error.message);
      // Nếu API lỗi, sử dụng dữ liệu từ params làm fallback
      if (params.name || params.price || params.image_url) {
        setProduct({
          name: params.name || "Sản phẩm không tên",
          price: params.price || 0,
          image_url: params.image_url || "https://via.placeholder.com/400",
          rating: 0
        });
        setError("Không thể tải thông tin chi tiết sản phẩm, nhưng bạn vẫn có thể viết đánh giá.");
      } else {
        setError(
          error.message.includes("not found")
            ? "Sản phẩm không tồn tại."
            : "Không thể tải sản phẩm. Vui lòng kiểm tra kết nối và thử lại."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => router.back();

  const handleStarPress = (starRating) => setUserRating(starRating);

  const handleImageUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImages((prev) => [...prev, result.assets[0]]);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải ảnh lên. Vui lòng thử lại!");
    }
  };

  const handleRemoveImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReview = () => {
    if (userRating === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn số sao đánh giá");
      return;
    }
    if (reviewText.trim() === "") {
      Alert.alert("Thông báo", "Vui lòng viết đánh giá của bạn");
      return;
    }

    const finalProductId = Array.isArray(productId) ? productId[0] : productId;
    console.log("Review submitted:", {
      productId: finalProductId,
      rating: userRating,
      text: reviewText,
      images: selectedImages,
    });

    Alert.alert("Thành công", "Đánh giá của bạn đã được gửi!", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  const handleViewProduct = () => {
    const finalProductId = Array.isArray(productId) ? productId[0] : productId;
    if (finalProductId) {
      router.push({
        pathname: '/userRouter/product-detail',
        params: {
          id: finalProductId,
          name: product?.name || params.name,
          price: product?.price || params.price,
          image_url: product?.image_url || params.image_url,
          description: product?.description || params.description
        }
      });
    }
  };

  const renderInteractiveStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <TouchableOpacity key={i + 1} onPress={() => handleStarPress(i + 1)} style={styles.starButton}>
        <Ionicons name={i + 1 <= userRating ? "star" : "star-outline"} size={20} color={Colors.secondary} />
      </TouchableOpacity>
    ));
  };

  const formatPrice = (price) => {
    if (typeof price === 'string' && price.includes(' - ')) {
      const [minPrice] = price.split(' - ');
      return `${parseInt(minPrice).toLocaleString('vi-VN')} Đ`;
    }
    return `${parseInt(price).toLocaleString('vi-VN')} Đ`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Header title="Đánh giá" showBackButton={true} onBack={handleBack} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !product) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Header title="Đánh giá" showBackButton={true} onBack={handleBack} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.debugText}>Product ID: {productId}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => loadProduct(Array.isArray(productId) ? productId[0] : productId)}
          >
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
      <Header title="Đánh giá" showBackButton={true} onBack={handleBack} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.productImageContainer} onPress={handleViewProduct}>
          <Image
            source={{ uri: product.image_url }}
            style={styles.productImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay}>
            <Ionicons name="eye-outline" size={24} color="white" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.productDetails} onPress={handleViewProduct}>
          <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
          <View style={styles.productNameRow}>
            <Text style={styles.productName}>{product.name}</Text>
            <View style={styles.productRatingContainer}>
              <Ionicons name="star" size={16} color={Colors.secondary} />
              <Text style={styles.productRating}>{product.rating}</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.gray} style={styles.chevronIcon} />
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.ratingSection}>
          <Text style={styles.ratingTitle}>Đánh giá mức sao cho sản phẩm</Text>
          <View style={styles.ratingRow}>
            <View style={styles.ratingDisplay}>
              <Text style={styles.ratingNumber}>{userRating || "0"}</Text>
              <Text style={styles.ratingOf}>of 5</Text>
            </View>
            <View style={styles.interactiveStars}>{renderInteractiveStars()}</View>
          </View>
        </View>
        <View style={styles.reviewContainer}>
          <TextInput
            style={styles.reviewInput}
            multiline={true}
            numberOfLines={4}
            placeholder="Viết đánh giá của bạn về sản phẩm này ..."
            placeholderTextColor="#999"
            value={reviewText}
            onChangeText={setReviewText}
            textAlignVertical="top"
          />
          {selectedImages.length > 0 ? (
            <View style={styles.imagesGrid}>
              {selectedImages.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri: image.uri }} style={styles.uploadedImage} />
                  <TouchableOpacity style={styles.removeImageButton} onPress={() => handleRemoveImage(index)}>
                    <Ionicons name="close-circle" size={20} color="#ff4444" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.addMoreImageButton} onPress={handleImageUpload}>
                <Ionicons name="add" size={24} color={Colors.gray} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadArea} onPress={handleImageUpload}>
              <View style={styles.uploadButton}>
                <Ionicons name="arrow-up" size={24} color={Colors.text} />
              </View>
              <Text style={styles.uploadText}>Tải ảnh lên</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <View style={styles.submitContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReview}>
          <Text style={styles.submitButtonText}>Gửi đánh giá</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

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
  },
  loadingText: {
    fontSize: 16,
    color: Colors.gray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  debugText: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
  },
  retryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  backText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  productImageContainer: {
    width: width,
    height: 300,
    backgroundColor: "#f5f5f5",
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 8,
  },
  productDetails: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "white",
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  productNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productName: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
    marginRight: 12,
  },
  productRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  productRating: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 4,
    fontWeight: "500",
  },
  chevronIcon: {
    marginLeft: 4,
  },
  ratingSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  ratingTitle: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 12,
    textAlign: "left",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ratingDisplay: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  ratingNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginRight: 4,
  },
  ratingOf: {
    fontSize: 16,
    color: Colors.gray,
  },
  interactiveStars: {
    flexDirection: "row",
    gap: 4,
  },
  starButton: {
    padding: 2,
  },
  reviewContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    overflow: "hidden",
  },
  reviewInput: {
    padding: 12,
    fontSize: 14,
    color: Colors.text,
    minHeight: 100,
    textAlignVertical: "top",
  },
  uploadArea: {
    alignItems: "center",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  uploadButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: "500",
  },
  imagesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    gap: 8,
  },
  imageContainer: {
    position: "relative",
  },
  uploadedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "white",
    borderRadius: 10,
  },
  addMoreImageButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderStyle: "dashed",
  },
  submitContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
})

export default ReviewDetailScreen;