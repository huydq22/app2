import { LoginModal } from "@/components/common/LoginModal";
import { Colors } from "@/constants/Colors";
import { fetchBanners } from '@/redux/actions/bannersActions';
import { fetchCategories } from '@/redux/actions/categoriesActions';
import {
  fetchFeaturedProducts,
  fetchLatestProducts,
  fetchProducts,
  fetchRecommendedProducts
} from '@/redux/actions/productsActions';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from 'react-redux';

const { width } = Dimensions.get("window");

// SearchBar Component
function SearchBar({ onNotificationPress }) {
  const router = useRouter();

  const handleSearchPress = () => {
    router.push("/guestRouter/search");
  };

  return (
    <View style={searchBarStyles.container}>
      <TouchableOpacity style={searchBarStyles.searchInput} onPress={handleSearchPress}>
        <Ionicons name="search" size={20} color={Colors.gray} />
        <Text style={searchBarStyles.placeholder}>Tìm kiếm</Text>
      </TouchableOpacity>
      <TouchableOpacity style={searchBarStyles.notificationButton} onPress={onNotificationPress}>
        <View style={searchBarStyles.notificationIcon}>
          <Ionicons name="notifications" size={16} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

// BannerCarousel Component
function BannerCarousel({ banners }) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (banners && banners.length > 1) {
      // Auto scroll every 3 seconds
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % banners.length
          flatListRef.current?.scrollToIndex({
            index: nextIndex,
            animated: true,
          })
          return nextIndex
        })
      }, 3000)

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }
  }, [banners])

  const handleBannerPress = (banner) => {
    console.log('Banner pressed:', banner.id);
    
    router.push({
      pathname: '/guestRouter/banner-detail',
      params: { 
        banner_id: banner.id,
        title: banner.title || banner.name,
        image_url: banner.image
      }
    });
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0)
    }
  }).current

  const renderBanner = ({ item }) => (
    <TouchableOpacity style={bannerStyles.bannerContainer} onPress={() => handleBannerPress(item)}>
      <View style={bannerStyles.banner}>
        <View style={bannerStyles.textContainer}>
          <Text style={bannerStyles.subtitle}>Giảm giá</Text>
          <Text style={bannerStyles.subtitle}>lên tới</Text>
          <Text style={bannerStyles.discount}>70%</Text>
        </View>
        <Image source={{ uri: item.image }} style={bannerStyles.image} resizeMode="cover" />
      </View>
    </TouchableOpacity>
  )

  const renderDots = () => (
    <View style={bannerStyles.dotsContainer}>
      {banners.map((_, index) => (
        <View key={index} style={[bannerStyles.dot, index === currentIndex && bannerStyles.activeDot]} />
      ))}
    </View>
  )

  if (!banners || banners.length === 0) {
    return null
  }

  return (
    <View style={bannerStyles.container}>
      <FlatList
        ref={flatListRef}
        data={banners}
        renderItem={renderBanner}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        getItemLayout={(data, index) => ({
          length: width - 32,
          offset: (width - 32) * index,
          index,
        })}
      />
      {banners.length > 1 && renderDots()}
    </View>
  )
}

// CategoryGrid Component
function CategoryGrid({ categories }) {
  const router = useRouter();

  const categoryIcons = {
    "Thời trang": "👔",
    Nam: "👔",
    Nữ: "👗",
    "Phụ kiện": "👕",
    "Mùa Hè": "☀️",
    "Mùa Thu": "🎈",
    Thêm: "⊞",
    Unisex: "👚",
  };

  const handleCategory = async (category) => {
    try {
      router.push("/guestRouter/category");
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  // Tạo categories mặc định nếu không có categories từ API
  const defaultCategories = [
    { category_id: "68579dd417d49dec5a62e240", name: "Thời trang", description: "", image_url: "", parent_category_id: null },
    { category_id: 999, name: "Unisex", description: "", image_url: "", parent_category_id: null },
    { category_id: 1000, name: "Mùa Hè", description: "", image_url: "", parent_category_id: null },
    { category_id: 1001, name: "Mùa Thu", description: "", image_url: "", parent_category_id: null },
    { category_id: 1002, name: "Thêm", description: "", image_url: "", parent_category_id: null },
  ];

  const displayCategories = categories && categories.length > 0 
    ? [
        ...categories.filter((cat) => cat.parent_category_id === null).slice(0, 2),
        { category_id: 999, name: "Unisex", description: "", image_url: "", parent_category_id: null },
        { category_id: 1000, name: "Mùa Hè", description: "", image_url: "", parent_category_id: null },
        { category_id: 1001, name: "Mùa Thu", description: "", image_url: "", parent_category_id: null },
        { category_id: 1002, name: "Thêm", description: "", image_url: "", parent_category_id: null },
      ]
    : defaultCategories;

  return (
    <View style={categoryStyles.container}>
      <View style={categoryStyles.grid}>
        {displayCategories.map((category) => (
          <TouchableOpacity
            key={category.category_id}
            style={categoryStyles.categoryItem}
            onPress={() => handleCategory(category)}
          >
            <View style={categoryStyles.iconContainer}>
              <Text style={categoryStyles.icon}>{categoryIcons[category.name] || "📦"}</Text>
            </View>
            <Text style={categoryStyles.label}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ProductCard Component
function ProductCard({ product, horizontal = false }) {
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
      pathname: '/guestRouter/product-detail',
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
      style={[productStyles.container, horizontal ? productStyles.horizontalContainer : productStyles.verticalContainer]}
      onPress={handlePress}
    >
      <View style={[productStyles.imageContainer, horizontal ? productStyles.horizontalImage : productStyles.verticalImage]}>
        <Image
          source={{
            uri: getProductImage(),
          }}
          style={productStyles.image}
          resizeMode="cover"
        />
      </View>
      <View style={productStyles.content}>
        <Text style={productStyles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={productStyles.brand} numberOfLines={1}>
          {product.brand}
        </Text>
        <Text style={productStyles.price}>{formatPrice(product.averagePrice)}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ProductSection Component
function ProductSection({ title, products, showArrow = false, showStar = false, horizontal = false }) {
  const router = useRouter();

  const renderItem = ({ item }) => {
    if (!item) return null; 
    return <ProductCard product={item} horizontal={horizontal} />;
  };

  const handleCategoryPress = () => {
    router.push('/guestRouter/category')
  }

  const keyExtractor = (item) => (item ? item._id?.toString() || item.id?.toString() || Math.random().toString() : Math.random().toString());

  return (
    <View style={sectionStyles.container}>
      <View style={sectionStyles.header}>
        <View style={sectionStyles.titleContainer}>
          <Text style={sectionStyles.title}>{title}</Text>
          {showStar && <Ionicons name="star" size={20} color={Colors.secondary} />}
        </View>
        {showArrow && (
          <TouchableOpacity style={sectionStyles.arrowButton} onPress={handleCategoryPress}>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {horizontal ? (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={sectionStyles.horizontalList}
          ItemSeparatorComponent={() => <View style={sectionStyles.separator} />}
        />
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={2}
          columnWrapperStyle={sectionStyles.row}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          style={sectionStyles.gridList}
        />
      )}
    </View>
  );
}

// Main HomeScreen Component
function HomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { products, latestProducts, recommendedProducts, featuredProducts, loading: productsLoading } = useSelector(state => state.products);
  const { categories, loading: categoriesLoading } = useSelector(state => state.categories);
  const { data: banners, loading: bannersLoading } = useSelector(state => state.banners);


  const loading = productsLoading || categoriesLoading || bannersLoading;
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        dispatch(fetchProducts()),
        dispatch(fetchLatestProducts()),
        dispatch(fetchRecommendedProducts()),
        dispatch(fetchFeaturedProducts()),
        dispatch(fetchCategories()),
        dispatch(fetchBanners()),
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleNotificationPress = () => {
    setShowLoginModal(true);
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
  };

  const handleLoginPress = () => {
    router.push("/guestRouter/login");
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  // Log the prop passed to BannerCarousel


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <LinearGradient
          colors={[Colors.primary, "rgba(255,255,255,0.9)", "white"]}
          style={styles.container}
        >
          <View style={styles.searchBarContainer}>
            <SearchBar onNotificationPress={handleNotificationPress} />
          </View>
          <BannerCarousel banners={banners || []} />
          <CategoryGrid categories={categories} />
          <View style={styles.content}>
            <ProductSection title="Mới nhất" products={latestProducts} showArrow={true} horizontal={true} />
            <ProductSection title="Đề xuất" products={recommendedProducts} showStar={true} horizontal={false} />
          </View>
        </LinearGradient>
      </ScrollView>
      
      <LoginModal
        visible={showLoginModal}
        onClose={handleLoginModalClose}
        onLoginPress={handleLoginPress}
      />
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 10,
  },
  container: {
    flex: 1,
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});

const searchBarStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  placeholder: {
    color: Colors.gray,
    fontSize: 16,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
});

const bannerStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  bannerContainer: {
    width: width - 32,
    marginRight: 0,
  },
  banner: {
    height: 160,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  textContainer: {
    position: "absolute",
    left: 16,
    top: 16,
    zIndex: 1,
  },
  subtitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  discount: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
  },
  image: {
    position: "absolute",
    right: 0,
    top: 0,
    width: width * 0.6,
    height: 160,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.4)",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "white",
    width: 20,
  },
});

const categoryStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  grid: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryItem: {
    width: "30%",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    backgroundColor: "white",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    fontSize: 24,
  },
  label: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },
});

const productStyles = StyleSheet.create({
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

const sectionStyles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    justifyContent: "space-between",
  },
  horizontalList: {
    paddingLeft: 0,
  },
  separator: {
    width: 12,
  },
  gridList: {
    marginBottom: 0,
  },
});

export default HomeScreen;